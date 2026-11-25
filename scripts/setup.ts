/**
 * Prepares a deployment:  npm run setup
 * Asks a few questions, makes the secrets, creates and locks the tables, adds the first founder, tests email, and
 * writes .env.netlify to paste into the host. Safe to run again: secrets and answers are kept.
 * The file holds every secret. Git ignores it; delete it once it is pasted and DATA_KEY is saved elsewhere.
 */
import { spawnSync } from 'node:child_process';
import { randomBytes, randomInt } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import nodemailer from 'nodemailer';
import postgres from 'postgres';

const FILE = '.env.netlify';
const old: Record<string, string> = {};
if (existsSync(FILE)) for (const l of readFileSync(FILE, 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) old[m[1]!] = m[2]!.replace(/^"(.*)"$/, '$1'); }

let muted = false;
const out = new Writable({ write(c, _e, cb) { if (!muted) process.stdout.write(c); cb(); } });
const rl = createInterface({ input: process.stdin, output: out, terminal: Boolean(process.stdin.isTTY) });
const lines: string[] = [];
let waiter: ((l: string) => void) | null = null;
rl.on('line', (l) => { if (waiter) { const w = waiter; waiter = null; w(l); } else lines.push(l); });
const read = () => (lines.length ? Promise.resolve(lines.shift()!) : new Promise<string>((r) => { waiter = r; }));
async function ask(q: string, o: { def?: string; secret?: boolean; test?: RegExp; hint?: string; fix?: (v: string) => string } = {}): Promise<string> {
  for (;;) {
    process.stdout.write(`\n${q}${o.def ? (o.secret ? ' [Enter = keep the saved one]' : ` [${o.def}]`) : ''}\n> `);
    muted = Boolean(o.secret);
    const typed = (await read()).trim() || o.def || '';
    const v = o.fix ? o.fix(typed) : typed;
    muted = false;
    if (o.secret) process.stdout.write('\n');
    if (v && (!o.test || o.test.test(v))) return v;
    console.log(`  ${o.hint || 'Please answer this one.'}`);
  }
}
const secret = (k: string) => old[k] || randomBytes(32).toString('base64');
const word = () => Array.from({ length: 9 }, () => 'abcdefghjkmnpqrstuvwxyz23456789'[randomInt(31)]).join('');
const NAME = /^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const nameOf = (u?: string) => u?.match(/^https:\/\/(.+)\.netlify\.app$/)?.[1];

console.log('Hayyak setup. Nothing you type is sent anywhere except to your own database and email provider.');

// People paste whole addresses; only the name matters.
const bare = (v: string) => v.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\.netlify\.app.*$/, '').replace(/\/.*$/, '');
const site = await ask('1. Your site. Paste its Netlify address, like https://my-site.netlify.app (Netlify shows it at the top of the project)', { def: nameOf(old.APP_URL), test: NAME, fix: bare, hint: 'Paste the address that ends in .netlify.app, or just the name before it.' });
const desk = await ask('2. The admin panel. You will make this second Netlify project later; press Enter to accept this name', { def: nameOf(old.STUDIO_URL) || `h${word().slice(0, 5)}-desk-${word().slice(0, 4)}`, test: NAME, fix: bare, hint: 'Small letters, numbers and dashes.' });

/* ---------- database ---------- */
const FAST = process.env.SETUP_FAST === '1'; // tests do not wait
const pause = (sec: number) => new Promise((r) => setTimeout(r, FAST ? 300 : sec * 1000));
type Db = { user: string; host: string; port: number; name: string };
/** Takes the address apart. The password inside it is ignored on purpose: it is asked for on its own. */
function parts(raw: string): Db | null {
  const v = raw.trim().replace(/^['"]?(DATABASE_URL=)?['"]?/, '').replace(/['"]$/, '');
  const m = v.match(/^postgres(?:ql)?:\/\/([^:/@\s]+)(?::.*)?@([^:/@?\s]+)(?::(\d+))?(?:\/([^?\s]*))?/);
  return m ? { user: decodeURIComponent(m[1]!), host: m[2]!, port: Number(m[3] || 6543), name: m[4] || 'postgres' } : null;
}
const isLocal = (d: Db) => /^(localhost|127\.)/.test(d.host);
const urlOf = (d: Db, pw: string, port = d.port) => `postgresql://${encodeURIComponent(d.user)}:${encodeURIComponent(pw)}@${d.host}:${port}/${d.name}${isLocal(d) ? '' : '?sslmode=require'}`;
async function tryConnect(u: string) {
  const sql = postgres(u, { max: 1, prepare: false, connect_timeout: 20, onnotice: () => {}, channel_binding: 'disable' } as postgres.Options<Record<string, never>>);
  try {
    await sql`select 1`;
    return '';
  } catch (e) {
    return `${(e as { code?: string }).code || ''} ${(e as Error).message}`.trim();
  } finally {
    await sql.end({ timeout: 2 }).catch(() => {});
  }
}
/** Puts text on the clipboard, so a password is never shown or retyped. */
function clipboard(text: string) {
  if (process.env.SETUP_NOCLIP === '1') return false;
  const cmd = process.platform === 'win32' ? ['clip'] : process.platform === 'darwin' ? ['pbcopy'] : ['xclip', '-selection', 'clipboard'];
  return spawnSync(cmd[0]!, cmd.slice(1), { input: text }).status === 0;
}

let url = ''; // what Netlify uses
let local = ''; // what this computer uses for the next steps
let dbAddr: Db | null = old.DATABASE_URL ? parts(old.DATABASE_URL) : null;
if (old.DATABASE_URL) {
  process.stdout.write('\nTrying the saved database... ');
  const why = await tryConnect(old.DATABASE_URL);
  console.log(why ? `no longer works (${why.slice(0, 80)})` : 'works');
  if (!why) url = local = old.DATABASE_URL;
}
while (!url) {
  if (!dbAddr) {
    dbAddr = parts(await ask('3. Database. In Supabase press Connect at the top, choose "Transaction pooler", and paste the address exactly as it is', { test: /postgres(ql)?:\/\/.+@.+/, hint: 'It starts with postgresql:// and contains an @. The [YOUR-PASSWORD] part can stay.' }));
    if (!dbAddr) continue;
    if (!isLocal(dbAddr) && !/pooler\.supabase\.com$/.test(dbAddr.host)) {
      console.log(`  This is not the pooler (it says ${dbAddr.host}). Choose "Transaction pooler": its address contains "pooler.supabase.com".`);
      dbAddr = null;
      if (!process.stdin.isTTY) process.exit(1);
      continue;
    }
    if (!isLocal(dbAddr) && !dbAddr.user.includes('.')) {
      console.log('  The user name should look like postgres.abcdefgh. Copy the address again from "Transaction pooler".');
      dbAddr = null;
      if (!process.stdin.isTTY) process.exit(1);
      continue;
    }
    if (!isLocal(dbAddr)) dbAddr.port = 6543; // 5432 is the session pooler; Netlify needs this one
    console.log(`  user ${dbAddr.user}, server ${dbAddr.host}, port ${dbAddr.port}`);
  }
  // The app gets its own database user, new every time. Supabase's pooler remembers passwords, so a user it has never
  // seen is the only one it cannot have an old password for. It is also less powerful than the main "postgres" user.
  const role = `hayyak_${word().slice(0, 5)}`;
  const pw = Array.from({ length: 32 }, () => 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'[randomInt(54)]).join('');
  const ref = dbAddr.user.includes('.') ? dbAddr.user.slice(dbAddr.user.indexOf('.')) : '';
  dbAddr = { ...dbAddr, user: role + ref };
  const command = `create role ${role} with login password '${pw}'; grant usage, create on schema public to ${role}; grant connect, create on database "${dbAddr.name}" to ${role};`;
  console.log(clipboard(command) ? '\n  A command is on your clipboard.' : `\n  Command: ${command}`);
  console.log('  In Supabase: SQL Editor (left side) > new query > Ctrl+V > Run.\n  It should answer "Success. No rows returned". Use the same project as the address above.');
  await ask('   Press Enter here after it says Success', { def: 'done' });
  await pause(5);

  for (let i = 1; i <= 3 && !url; i++) {
    process.stdout.write('Connecting to the database... ');
    let why = await tryConnect(urlOf(dbAddr, pw));
    if (!why) { url = local = urlOf(dbAddr, pw); console.log('works'); break; }
    if (/ETIMEDOUT|CONNECT_TIMEOUT|ECONNREFUSED|ECONNRESET|ENETUNREACH|EHOSTUNREACH/.test(why) && !isLocal(dbAddr)) {
      // Some networks block this port; the other one leads to the same database.
      const other = await tryConnect(urlOf(dbAddr, pw, 5432));
      if (!other) { url = urlOf(dbAddr, pw); local = urlOf(dbAddr, pw, 5432); console.log('works (your network blocks one port; Netlify is not affected)'); break; }
      why = other;
    }
    if (/tenant|ENOIDENTIFIER|not found/i.test(why)) {
      console.log('Supabase does not know this project at this address.\n  If the project is new, wait until it has finished setting up. Then copy the address again.');
      dbAddr = null;
      break;
    }
    if (/password|auth|circuit|28P01|too many/i.test(why)) {
      console.log(i < 3 ? `not yet (${why.slice(0, 90)}).\n  Earlier wrong tries can make Supabase refuse this computer for 2 minutes. Trying again after that; leave this open.` : `still refused (${why.slice(0, 90)}).\n  Was the command run in the project of this address, and did it say Success?`);
      if (i < 3) await pause(130);
      continue;
    }
    console.log(`failed: ${why.slice(0, 160)}\n  Check your internet; a university network may block databases, so try a phone hotspot.`);
    break;
  }
  if (!url && !process.stdin.isTTY) process.exit(1);
}
const run = (file: string, args: string[] = []) => spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', file, ...args], { env: { ...process.env, DATABASE_URL: local }, encoding: 'utf8' });
process.stdout.write('Creating and locking the tables... ');
const m = run('scripts/migrate.ts');
if (m.status !== 0) {
  console.log(`failed\n${m.stderr.slice(-800)}`);
  process.exit(1);
}
console.log('done');

/* ---------- first founder ---------- */
const founder = (await ask('4. Your own email, to sign in to the admin panel', { test: EMAIL, hint: 'An email address, please.' })).toLowerCase();
const s = run('scripts/seed-admin.ts', [founder, await ask('5. Your name')]);
console.log(s.status === 0 ? `  ${founder} is the first founder.` : `  ${s.stderr.includes('already exists') ? 'A founder exists already; add people from the Studio.' : s.stderr.slice(-400)}`);

/* ---------- email ---------- */
const kind = (await ask('6. Email by: "gmail" (an app password, no domain needed), "brevo", or "resend" (your own domain)', { def: old.RESEND_API_KEY ? 'resend' : old.BREVO_API_KEY ? 'brevo' : 'gmail', test: /^(gmail|brevo|resend)$/i, hint: 'Type gmail, brevo or resend.' })).toLowerCase();
const from = await ask(kind === 'gmail' ? '7. The Gmail address that sends' : 'Sender address (verified with that provider)', { def: old.MAIL_FROM?.match(/<([^>]+)>/)?.[1], test: EMAIL, hint: 'An email address, please.' });
const provider = kind === 'gmail' ? 'SMTP_URL' : kind === 'resend' ? 'RESEND_API_KEY' : 'BREVO_API_KEY';
let key = '';
for (;;) {
  key = await ask(kind === 'gmail' ? '8. Its app password, 16 letters from myaccount.google.com/apppasswords (not shown while you type)' : `${kind} API key (not shown while you type)`, { def: old[provider], secret: true });
  // Google shows it in four groups; the spaces are not part of it.
  if (kind === 'gmail' && !key.startsWith('smtps://')) key = `smtps://${encodeURIComponent(from)}:${encodeURIComponent(key.replace(/\s/g, ''))}@smtp.gmail.com:465`;
  process.stdout.write(`Sending a test email to ${founder}... `);
  let problem = '';
  try {
    if (kind === 'gmail') await nodemailer.createTransport(key).sendMail({ from: `Hayyak <${from}>`, to: founder, subject: 'Hayyak setup test', text: 'Email works.' });
    else {
      const r = kind === 'brevo'
        ? await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json' }, body: JSON.stringify({ sender: { name: 'Hayyak', email: from }, to: [{ email: founder }], subject: 'Hayyak setup test', textContent: 'Email works.' }) })
        : await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: `Hayyak <${from}>`, to: [founder], subject: 'Hayyak setup test', text: 'Email works.' }) });
      if (!r.ok) problem = `${r.status} ${(await r.text()).slice(0, 160)}`;
    }
  } catch (e) {
    problem = (e as Error).message.slice(0, 200);
  }
  if (!problem) {
    console.log('accepted. Check the inbox and the spam folder.');
    break;
  }
  console.log(`refused: ${problem}
  Sign-up does not work without email.${kind === 'gmail' ? ' Turn on 2-Step Verification for that account first, and use an app password, not its normal one.' : ''}`);
  delete old[provider];
  if (!process.stdin.isTTY || !/^y/i.test(await ask('Try another password or key? (y/n)', { def: 'y' }))) break;
}

/* ---------- the file ---------- */
const env: Record<string, string> = {
  APP_URL: `https://${site}.netlify.app`, STUDIO_URL: `https://${desk}.netlify.app`, DATABASE_URL: url, APP_SECRET: secret('APP_SECRET'), DATA_KEY: secret('DATA_KEY'), CRON_SECRET: secret('CRON_SECRET'),
  [provider]: key, MAIL_FROM: `Hayyak <${from}>`, CLIENT_IP_HEADER: 'x-nf-client-connection-ip', DB_POOL: '3', PASSWORD_SLOTS: '1',
};
writeFileSync(FILE, Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n', { mode: 0o600 });
rl.close();
console.log(`
Done. Everything Netlify needs is in the file ${FILE}. Open it with:  notepad ${FILE}

  Project 1, the site:         ${site}   (the one you have)
  Project 2, the admin panel:  ${desk}   (make it now, same repository)

In both: Project configuration > Environment variables > Add a variable > Import from a .env file, paste the whole
file, choose "Update conflicts" if asked, then Deploys > Trigger deploy > Clear cache and deploy site.
Afterwards save DATA_KEY in a password manager and delete ${FILE}.
If a name is taken, run "npm run setup" again; everything else is kept.`);
process.exit(0);
