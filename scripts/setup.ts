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
async function ask(q: string, o: { def?: string; secret?: boolean; test?: RegExp; hint?: string } = {}): Promise<string> {
  for (;;) {
    process.stdout.write(`\n${q}${o.def ? (o.secret ? ' [Enter = keep the saved one]' : ` [${o.def}]`) : ''}\n> `);
    muted = Boolean(o.secret);
    const v = (await read()).trim() || o.def || '';
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

const site = await ask('Netlify project name for the site (the part before .netlify.app)', { def: nameOf(old.APP_URL), test: NAME, hint: 'Small letters, numbers and dashes.' });
const desk = await ask('Netlify project name for the Studio (a name nobody would guess)', { def: nameOf(old.STUDIO_URL) || `${word().slice(0, 5)}-desk-${word().slice(0, 4)}`, test: NAME, hint: 'Small letters, numbers and dashes.' });

/* ---------- database ---------- */
let url = '';
for (;;) {
  const raw = await ask('Supabase > Connect > Transaction pooler: paste the address (it starts with postgresql://)', { def: old.DATABASE_URL, secret: Boolean(old.DATABASE_URL), test: /^postgres(ql)?:\/\/.+@.+/, hint: 'It should start with postgresql:// and contain an @.' });
  url = raw;
  if (/\[YOUR-PASSWORD\]/i.test(url)) url = url.replace(/\[YOUR-PASSWORD\]/i, encodeURIComponent(await ask('Database password (not shown while you type)', { secret: true })));
  if (!/[?&]sslmode=/.test(url) && !/@(localhost|127\.)/.test(url)) url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
  process.stdout.write('Connecting to the database... ');
  try {
    const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 20, onnotice: () => {} });
    await sql`select 1`;
    await sql.end();
    console.log('works');
    break;
  } catch (e) {
    console.log(`failed: ${(e as Error).message}\n  Check the password, and that it is the Transaction pooler address.`);
    delete old.DATABASE_URL;
    if (!process.stdin.isTTY) process.exit(1);
  }
}
const run = (file: string, args: string[] = []) => spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', file, ...args], { env: { ...process.env, DATABASE_URL: url }, encoding: 'utf8' });
process.stdout.write('Creating and locking the tables... ');
const m = run('scripts/migrate.ts');
if (m.status !== 0) {
  console.log(`failed\n${m.stderr.slice(-800)}`);
  process.exit(1);
}
console.log('done');

/* ---------- first founder ---------- */
const founder = (await ask('Your email, for the Studio (admin panel)', { test: EMAIL, hint: 'An email address, please.' })).toLowerCase();
const s = run('scripts/seed-admin.ts', [founder, await ask('Your name, as the team sees it')]);
console.log(s.status === 0 ? `  ${founder} is the first founder.` : `  ${s.stderr.includes('already exists') ? 'A founder exists already; add people from the Studio.' : s.stderr.slice(-400)}`);

/* ---------- email ---------- */
const kind = (await ask('Email by: "gmail" (an app password, no domain needed), "brevo", or "resend" (your own domain)', { def: old.RESEND_API_KEY ? 'resend' : old.BREVO_API_KEY ? 'brevo' : 'gmail', test: /^(gmail|brevo|resend)$/i, hint: 'Type gmail, brevo or resend.' })).toLowerCase();
const from = await ask(kind === 'gmail' ? 'The Gmail address that sends' : 'Sender address (verified with that provider)', { def: old.MAIL_FROM?.match(/<([^>]+)>/)?.[1], test: EMAIL, hint: 'An email address, please.' });
const provider = kind === 'gmail' ? 'SMTP_URL' : kind === 'resend' ? 'RESEND_API_KEY' : 'BREVO_API_KEY';
let key = '';
for (;;) {
  key = await ask(kind === 'gmail' ? 'Its app password, 16 letters from myaccount.google.com/apppasswords (not shown while you type)' : `${kind} API key (not shown while you type)`, { def: old[provider], secret: true });
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
Done. ${FILE} is ready. In Netlify, make TWO projects from this repository with these exact names:

  ${site}     the site
  ${desk}     the Studio

and for both: Environment variables > Add a variable > Import from a .env file > paste all of ${FILE}.
Then save DATA_KEY in a password manager and delete ${FILE}.
If a name is taken, run "npm run setup" again with another one; everything else is kept.`);
process.exit(0);
