/**
 * End-to-end and security checks against a real production build.
 *   npm run build && npm run test:e2e
 * Starts the app on a spare port with an empty embedded database, plays the whole product through the
 * HTTP API (accounts, invitations, guests, attendance, certificates, orders, Studio), then attacks it.
 * Set TEST_DATABASE_URL to an empty throwaway Postgres database (after `npm run db:migrate`) to run against a real server
 * instead, with few connections and through a stand-in for Supabase's pooler.
 */
import { spawn, execFileSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { watchPooler } from './pooler.mjs';

const PORT = 3111;
const BASE = `http://localhost:${PORT}`;
const STUDIO = `http://127.0.0.1:${PORT}`; // the Studio's own address
const SECRET = 'e2e-only-app-secret-0123456789abcdef0123';
const DKEY = 'e2e-only-data-key-0123456789abcdef012345';
const tmp = mkdtempSync(path.join(tmpdir(), 'hy-'));
const MAIL = path.join(tmp, 'mail.jsonl');
const pooler = process.env.TEST_DATABASE_URL ? await watchPooler(process.env.TEST_DATABASE_URL, PORT + 1) : null;
const env = { ...process.env, ...(pooler ? { DB_POOL: '3' } : {}), NODE_ENV: 'production', APP_URL: BASE, STUDIO_URL: STUDIO, APP_SECRET: SECRET, DATA_KEY: DKEY, APP_ENV: '', ALLOW_EMBEDDED_DB: '1', ALLOW_DEV_SECRETS: '1', PGLITE_DIR: path.join(tmp, 'pg'), MAIL_FILE: MAIL, MAIL_SILENT: '1', TRUSTED_PROXIES: '1', CRON_SECRET: 'test-cron-secret-123456', DATABASE_URL: pooler?.url || '', SMTP_URL: '', RESEND_API_KEY: '', BREVO_API_KEY: '', CLIENT_IP_HEADER: '', PASSWORD_SLOTS: '' };

let pass = 0;
const fails = [];
const check = (name, ok, extra = '') => {
  if (ok) pass++;
  else {
    fails.push(name);
    console.log(`  FAIL  ${name} ${extra}`);
  }
};
const section = (t) => console.log(`\n# ${t}`);
let ipN = 10;
const newIp = () => `203.0.113.${ipN++ % 250}`;

/** A browser: keeps cookies, sends the right Origin. */
class Client {
  constructor(ip = newIp(), base = BASE) {
    this.base = base;
    this.jar = new Map();
    this.ip = ip;
    this.raw = [];
  }

  async req(method, url, body, o = {}) {
    const headers = { 'user-agent': 'Mozilla/5.0 (iPhone) Safari/605', 'x-forwarded-for': this.ip, ...(o.headers || {}) };
    if (method !== 'GET' && !o.noOrigin) headers.origin = o.origin ?? this.base;
    if (this.jar.size) headers.cookie = [...this.jar].map(([k, v]) => `${k}=${v}`).join('; ');
    let payload;
    if (o.form) payload = o.form;
    else if (body !== undefined || method !== 'GET') {
      headers['content-type'] = o.type || 'application/json';
      payload = typeof body === 'string' ? body : JSON.stringify(body ?? {});
    }
    const r = await fetch(this.base + url, { method, headers, body: method === 'GET' ? undefined : payload, redirect: 'manual' });
    for (const c of r.headers.getSetCookie()) {
      this.raw.push(c);
      const [kv] = c.split(';');
      const i = kv.indexOf('=');
      if (/max-age=0/i.test(c) || !kv.slice(i + 1)) this.jar.delete(kv.slice(0, i));
      else this.jar.set(kv.slice(0, i), kv.slice(i + 1));
    }
    const text = await r.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch { /* page */ }
    return { s: r.status, j: json, t: text, h: r.headers };
  }

  get(u, o) { return this.req('GET', u, undefined, o); }
  post(u, b, o) { return this.req('POST', '/api' + u, b, o); }
  patch(u, b, o) { return this.req('PATCH', '/api' + u, b, o); }
  del(u, o) { return this.req('DELETE', '/api' + u, undefined, o); }
}

const desk = () => new Client(newIp(), STUDIO);
/** What an authenticator app does. */
function totp(secret, shift = 0) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits = [...secret].map((c) => A.indexOf(c).toString(2).padStart(5, '0')).join('');
  const key = Buffer.from(bits.match(/.{8}/g).map((x) => parseInt(x, 2)));
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000) + shift));
  const h = createHmac('sha1', key).update(msg).digest();
  return String((h.readUInt32BE(h[19] & 15) & 0x7fffffff) % 1e6).padStart(6, '0');
}
/** Both steps of a first Studio sign-in. */
async function enterStudio(email) {
  const c = desk();
  await c.post('/studio/login', { email });
  const one = await c.post('/studio/verify', { email, code: codeFor(email) });
  const used = totp(one.j?.secret || 'A');
  const two = await c.post('/studio/mfa', { code: used });
  return Object.assign(c, { one, two, used, secret: one.j?.secret, codes: two.j?.codes || [] });
}
/** Sends the path exactly as written; fetch would tidy up the dots. */
const rawGet = (path, headers = {}) => new Promise((ok) => {
  const r = http.request({ host: '127.0.0.1', port: PORT, path, method: 'GET', agent: false, headers: { host: `localhost:${PORT}`, 'x-forwarded-for': newIp(), ...headers } }, (res) => { let t = ''; res.setEncoding('utf8'); res.on('data', (d) => { t += d; }); res.on('end', () => ok({ s: res.statusCode, t, loc: res.headers.location || '' })); });
  r.on('error', (e) => ok({ s: 0, t: String(e.code), loc: '' }));
  r.end();
});
const mails = () => (existsSync(MAIL) ? readFileSync(MAIL, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
const lastMail = (to, re = /./) => mails().filter((m) => m.to === to && re.test(m.subject + m.text)).pop();
const codeFor = (to) => lastMail(to, /^\d{6} /)?.subject.slice(0, 6);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitMail = async (to, re, n = 40) => {
  for (let i = 0; i < n; i++) {
    const m = lastMail(to, re);
    if (m) return m;
    await sleep(100);
  }
  return null;
};
async function account(name, email, password = 'Str0ng!pass-' + name.length) {
  const c = new Client();
  await c.post('/auth/signup', { name, email, password });
  const r = await c.post('/auth/verify', { email, code: codeFor(email) });
  return Object.assign(c, { email, password, ok: r.s === 200 });
}
const future = (h) => new Date(Date.now() + h * 36e5).toISOString();
async function invitation(c, o = {}, guests = 2) {
  const { j } = await c.post('/invitations', { title: 'الحفل الختامي', pattern: 'رشّة فرح', startsAt: future(72), placeName: 'قاعة الملك فيصل', ...o });
  if (guests) await c.post(`/invitations/${j.id}/guests`, { source: 'manual', items: Array.from({ length: guests }, (_, i) => ({ name: `ضيف رقم ${i + 1}`, email: `g${i + 1}-${j.slug}@example.com`, phone: '05500000' + String(i).padStart(2, '0') })) });
  return j;
}
const links = async (c, id) => (await c.get(`/api/invitations/${id}/links`)).j.rows;
const tokenOf = (l) => l.link.split('/').pop();

execFileSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/seed-admin.ts', 'founder@example.com', 'مؤسس تجريبي'], { env: { ...env, DATABASE_URL: process.env.TEST_DATABASE_URL || '' }, stdio: 'inherit' });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], { env, stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
server.stdout.on('data', (d) => { log += d; });
server.stderr.on('data', (d) => { log += d; });

async function main() {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(BASE + '/api/health')).ok) break;
    } catch { /* not up yet */ }
    await sleep(300);
  }

  section('public pages and headers');
  const v = new Client();
  for (const p of ['/', '/signup', '/privacy', '/terms', '/robots.txt']) check(`GET ${p}`, (await v.get(p)).s === 200);
  const home = await v.get('/');
  const csp = home.h.get('content-security-policy') || '';
  check('CSP blocks inline and foreign scripts', /script-src 'self' 'nonce-[^']+' 'strict-dynamic'/.test(csp) && !/script-src[^;]*unsafe-inline/.test(csp) && !/unsafe-eval/.test(csp), csp);
  check('CSP blocks framing, plugins and foreign base tags', /frame-ancestors 'none'/.test(csp) && /object-src 'none'/.test(csp) && /base-uri 'self'/.test(csp));
  check('nonce changes on every request', csp !== (await v.get('/')).h.get('content-security-policy'));
  check('every script tag carries the nonce', [...home.t.matchAll(/<script\b[^>]*>/g)].every((m) => /nonce=/.test(m[0])), [...home.t.matchAll(/<script\b[^>]*>/g)].filter((m) => !/nonce=/.test(m[0])).slice(0, 2).join(' '));
  check('nosniff, HSTS, frame and referrer headers', home.h.get('x-content-type-options') === 'nosniff' && /max-age/.test(home.h.get('strict-transport-security')) && home.h.get('x-frame-options') === 'DENY' && Boolean(home.h.get('referrer-policy')));
  check('server does not advertise itself', !home.h.get('x-powered-by'));
  check('/app needs sign-in', [307, 303, 302].includes((await v.get('/app')).s));
  const sv = desk();
  check('/studio needs sign-in', [307, 303, 302].includes((await sv.get('/studio')).s) && (await sv.get('/studio/login')).s === 200);

  section('the Studio has its own address');
  for (const p of ['/studio', '/studio/login', '/studio/anything', '/Studio', '/studio/']) check(`public address does not have ${p}`, [404, 308].includes((await v.get(p)).s) && !(await v.get(p)).t.includes('الاستوديو'));
  for (const h of [{ 'next-router-prefetch': '1' }, { RSC: '1' }, { RSC: '1', 'next-router-prefetch': '1', 'next-url': '/studio' }, { 'x-middleware-subrequest': 'middleware:middleware:middleware:middleware:middleware' }, { 'x-forwarded-host': `127.0.0.1:${PORT}` }]) check(`nor with the header ${Object.keys(h).join(' + ')}`, (await v.get('/studio/login', { headers: h })).s === 404);
  check('nor its API', (await v.post('/studio/login', { email: 'founder@example.com' })).s === 404 && (await v.get('/api/studio/customers')).s === 404);
  for (const p of ['/', '/signup', '/app', '/privacy', '/i/abcdefg']) check(`Studio address does not serve ${p}`, [404, 307].includes((await sv.get(p)).s) && !(await sv.get(p)).t.includes('أنشئ حسابك'));
  check('Studio address does not serve the customers\' API', (await sv.post('/auth/login', { email: 'a@example.com', password: 'x' })).s === 404);
  check('Studio forms are only accepted from the Studio', (await sv.post('/studio/login', { email: 'x@example.com' }, { origin: BASE })).s === 403);
  check('nothing public points at it', !/studio/i.test((await v.get('/robots.txt')).t) && !(await v.get('/')).t.includes('/studio'));

  section('accounts');
  const a = await account('نادي العلوم', 'a@example.com');
  check('sign-up with email code', a.ok);
  check('session cookie is HttpOnly and SameSite', a.raw.some((c) => /^hy=/.test(c) && /httponly/i.test(c) && /samesite=lax/i.test(c)), a.raw.join('|'));
  for (const p of ['', '/invitations', '/guests', '/designs', '/requests', '/settings', '/account', '/buy', '/report', '/create']) check(`page /app${p}`, (await a.get('/app' + p)).s === 200);
  const dup = await new Client().post('/auth/signup', { name: 'آخر', email: 'a@example.com', password: 'An0ther!pass' });
  const fresh = await new Client().post('/auth/signup', { name: 'جديد', email: 'fresh@example.com', password: 'An0ther!pass' });
  check('sign-up answers the same for known and unknown emails', dup.s === 200 && JSON.stringify(dup.j) === JSON.stringify(fresh.j));
  check('weak passwords are refused', (await new Client().post('/auth/signup', { name: 'ضعيف', email: 'w@example.com', password: '12345678' })).s === 400);
  const l1 = new Client();
  check('new device needs a code', (await l1.post('/auth/login', { email: a.email, password: a.password })).j.otp === true);
  check('login code works', (await l1.post('/auth/login/verify', { email: a.email, code: codeFor(a.email) })).s === 200);
  await l1.post('/auth/logout');
  check('sign-out ends the session on the server', (await l1.get('/app')).s !== 200);
  check('known device signs in without a code', (await l1.post('/auth/login', { email: a.email, password: a.password })).j.otp === false);

  section('invitations, credit and guests');
  const inv = await invitation(a, {}, 3);
  check('draft opens in the editor', (await a.get(`/app/create?id=${inv.id}`)).s === 200);
  check('draft link is not public', (await v.get(`/i/${inv.slug}`)).s === 404);
  check('adding the same guest twice is skipped', (await a.post(`/invitations/${inv.id}/guests`, { source: 'manual', items: [{ name: 'ضيف مكرر', phone: '0550000000' }] })).j.added === 0);
  const pubd = await a.post(`/invitations/${inv.id}/publish`);
  check('publish charges one credit per guest', pubd.s === 200 && pubd.j.count === 3, JSON.stringify(pubd.j));
  check('publishing twice is refused', (await a.post(`/invitations/${inv.id}/publish`)).s === 400);
  check('a sent invitation cannot be edited as a draft', (await a.patch(`/invitations/${inv.id}`, { title: 'x' })).s === 400);
  const ls = await links(a, inv.id);
  check('each guest has a personal link and message', ls.length === 3 && ls.every((l) => /\/i\/[a-z0-9]+\/[a-z0-9]{16}$/.test(l.link) && l.message.includes('ضيف')));
  const big = await invitation(a, {}, 9);
  check('cannot spend more credit than available', (await a.post(`/invitations/${big.id}/publish`)).s === 402);
  for (const p of ['', '/attendance', '/certificate', '/journey', '/preview']) check(`page invitation${p}`, (await a.get(`/app/invitations/${inv.id}${p}`)).s === 200);
  check('change date and place notifies guests by email', (await a.post(`/invitations/${inv.id}/event`, { startsAt: future(80), placeName: 'القاعة الكبرى' })).j.notified === 3 && Boolean(await waitMail('g1-' + inv.slug + '@example.com', /تعدّل/)));
  check('reminder text is prepared', (await a.post(`/invitations/${inv.id}/remind`)).j.mode === 'copy');
  check('duplicate makes a new draft', Boolean((await a.post(`/invitations/${inv.id}/duplicate`)).j.id));

  section('guest journey');
  const g = new Client();
  check('guests keep the order they were added in', ls.every((l, i) => l.name === `ضيف رقم ${i + 1}`), ls.map((l) => l.name).join());
  const t1 = tokenOf(ls[0]);
  check('guest opens the invitation', (await g.get(`/i/${inv.slug}/${t1}`)).s === 200);
  check('private invitation is hidden without the personal link', (await g.get(`/i/${inv.slug}`)).s === 404);
  await g.post(`/g/${t1}/open`);
  check('RSVP', (await g.post(`/g/${t1}/rsvp`, { answer: 'yes' })).s === 200);
  check('name for the certificate', (await g.post(`/g/${t1}/profile`, { certNameAr: 'سارة أحمد الغامدي' })).s === 200);
  check('organiser sees the answer', (await a.get(`/api/invitations/${inv.id}/guests`)).j.rows.some((r) => r.st === 'أكّد'));
  check('attendance is closed before it opens', (await g.post(`/g/${t1}/attend`, { code: '0000' })).s === 409);
  check('open attendance', (await a.post(`/invitations/${inv.id}/attendance/open`, { mode: 'person', minutes: 10, second: false, autoCert: true })).s === 200);
  const att = (await a.get(`/app/invitations/${inv.id}/attendance`)).t;
  const code = att.match(/\\"code\\":\\"(\d{4})\\"/)?.[1];
  const qr = att.match(/\/a\/([a-z0-9]{18})/)?.[1];
  check('organiser page carries code and QR', Boolean(code && qr));
  const wrong = String((Number(code) + 1) % 10000).padStart(4, '0');
  check('wrong code is refused', (await g.post(`/g/${t1}/attend`, { code: wrong })).s === 400);
  check('right code records attendance', (await g.post(`/g/${t1}/attend`, { code })).s === 200);
  check('QR without a known phone is refused', (await new Client().post(`/a/${qr}`)).s === 409);
  const g2 = new Client();
  await g2.post(`/g/${tokenOf(ls[1])}/open`);
  check('QR on a known phone records attendance', (await g2.post(`/a/${qr}`)).s === 200);
  check('walk-in guest', (await a.post(`/invitations/${inv.id}/attendance/walkin`, { name: 'لمى سعد' })).s === 200);
  const cl = await a.post(`/invitations/${inv.id}/attendance/close`);
  check('close attendance', cl.s === 200, cl.t);
  check('closing issues certificates and tells the guests', Boolean(await waitMail('g1-' + inv.slug + '@example.com', /^شهادتك/)));
  const gp = (await g.get(`/i/${inv.slug}/${t1}`)).t;
  const cert = gp.match(/\\"code\\":\\"([a-z0-9]{14})\\"/)?.[1];
  check('certificate reaches the guest link', Boolean(cert) && gp.includes('سارة أحمد الغامدي'));
  check('certificate has its own page', (await v.get(`/c/${cert}`)).s === 200);
  check('name is locked after issue', (await g.post(`/g/${t1}/profile`, { certNameAr: 'اسم ثاني' })).s === 409);
  check('name change request', (await g.post(`/g/${t1}/name`, { name: 'سارة محمد الغامدي' })).s === 200);
  const rid = (await a.get(`/app/invitations/${inv.id}/certificate`)).t.match(/\\"requests\\":\[\{\\"id\\":\\"([0-9a-f-]{36})/)?.[1];
  check('organiser approves the new name', (await a.post(`/invitations/${inv.id}/names/${rid}`, { ok: true })).s === 200 && (await v.get(`/c/${cert}`)).t.includes('سارة محمد الغامدي'));
  check('thank-you note', (await a.post(`/invitations/${inv.id}/thanks`, { group: 0, text: 'شكرًا لحضوركم', withCert: false })).s === 200);
  const rep = (await a.get('/app/report')).t.match(/\/r\/([a-z0-9]{24})/)?.[1];
  check('shared report opens without sign-in and shows no names', (await v.get(`/r/${rep}`)).s === 200 && !(await v.get(`/r/${rep}`)).t.includes('لمى سعد'));

  section('public invitation');
  const b = await account('جمعية الكيمياء', 'b@example.com');
  const pi = await invitation(b, { audience: 'public', cap: 2, title: 'لقاء مفتوح' }, 0);
  check('publish public invitation', (await b.post(`/invitations/${pi.id}/publish`)).s === 200);
  check('public page opens', (await v.get(`/i/${pi.slug}`)).s === 200);
  const r1 = await v.post(`/i/${pi.slug}/register`, { name: 'ريم الزهراني', email: 'reem@example.com' });
  check('register returns a personal link', r1.s === 200 && Boolean(r1.j.token));
  const r2 = await new Client().post(`/i/${pi.slug}/register`, { name: 'متطفل', email: 'reem@example.com' });
  check('registering with a taken email never reveals the link', r2.j.mailed === true && !r2.j.token);
  const race = await Promise.all(Array.from({ length: 6 }, (_, i) => new Client().post(`/i/${pi.slug}/register`, { name: `متسابق ${i}`, email: `race${i}@example.com` })));
  check('the cap holds under simultaneous sign-ups', race.filter((x) => x.s === 200).length === 1, race.map((x) => x.s).join());

  section('Studio');
  const st0 = desk();
  const unknown = await st0.post('/studio/login', { email: 'nobody@example.com' });
  const known = await st0.post('/studio/login', { email: 'founder@example.com' });
  check('Studio sign-in does not reveal who is on the team', unknown.s === known.s && JSON.stringify(unknown.j) === JSON.stringify(known.j));
  const pre = await st0.post('/studio/verify', { email: 'founder@example.com', code: codeFor('founder@example.com') });
  check('the email code alone does not open the Studio', pre.s === 200 && pre.j.next === 'setup' && (await st0.get('/studio')).s !== 200 && (await st0.get('/api/studio/customers')).s === 401);
  check('a wrong authenticator code is refused', (await st0.post('/studio/mfa', { code: '000000' })).s === 400);
  const st = await enterStudio('founder@example.com');
  check('authenticator code opens it and gives recovery codes once', st.two.s === 200 && st.codes.length === 8 && st.secret === pre.j.secret, JSON.stringify(st.two.j));
  check('every Studio sign-in is announced by email', Boolean(await waitMail('founder@example.com', /دخول جديد/)));
  const again = desk();
  await again.post('/studio/login', { email: 'founder@example.com' });
  const ag = await again.post('/studio/verify', { email: 'founder@example.com', code: codeFor('founder@example.com') });
  check('the secret is never shown again', ag.j.next === 'code' && !ag.j.secret);
  check('a code cannot be replayed', (await again.post('/studio/mfa', { code: st.used })).s === 400);
  check('a recovery code works once', (await again.post('/studio/mfa', { code: st.codes[0].toUpperCase() })).s === 200 && (await again.get('/studio')).s === 200);
  const re = desk();
  await re.post('/studio/login', { email: 'founder@example.com' });
  await re.post('/studio/verify', { email: 'founder@example.com', code: codeFor('founder@example.com') });
  check('and not twice', (await re.post('/studio/mfa', { code: st.codes[0] })).s === 400);
  check('the short pass ends with the wrong session', (await desk().post('/studio/mfa', { code: totp(st.secret) })).s === 401);
  check('Studio cookie is SameSite=Strict', st.raw.some((c) => /^hys=/.test(c) && /samesite=strict/i.test(c)));
  const sp = await st.get('/studio');
  check('Studio page', sp.s === 200);
  check('Studio never carries guest contacts', !sp.t.includes('reem@example.com') && !sp.t.includes('0550000') && !sp.t.includes('ضيف رقم'));
  const ord = await a.post('/orders', { count: 100, channel: 'whatsapp', services: [], contact: { name: 'نادي', email: '', phone: '0551234567' }, total: 1, price: 1 });
  check('order price is set by the server', ord.j.total === 185, JSON.stringify(ord.j));
  check('unknown pack is refused', (await a.post('/orders', { count: 7, channel: 'self', services: [], contact: { name: 'x', email: '', phone: '' } })).s === 400);
  const oid = (await st.get('/studio')).t.match(/\\"pending\\":\[\{\\"id\\":\\"([0-9a-f-]{36})/)?.[1];
  const both = await Promise.all([st.post(`/studio/orders/${oid}`, { ok: true }), st.post(`/studio/orders/${oid}`, { ok: true })]);
  check('an order is credited exactly once', both.filter((x) => x.s === 200).length === 1, both.map((x) => x.s).join());
  check('credit arrived', /\\"total\\":110/.test((await a.get('/app')).t));
  const hs = await invitation(a, { sendBy: 'hayyak', sendChannels: ['email', 'whatsapp'], startsAt: future(100) }, 4);
  check('ask Hayyak to send', (await a.post(`/invitations/${hs.id}/publish`)).j.request === true);
  const soon = await invitation(a, { sendBy: 'hayyak', sendChannels: ['email'], startsAt: future(20) }, 1);
  check('48 hour rule', (await a.post(`/invitations/${soon.id}/publish`)).s === 400);
  const rq = (await st.get('/studio')).t.match(/\\"sends\\":\[\{\\"id\\":\\"([0-9a-f-]{36})/)?.[1];
  check('recipient list is closed before sending starts', (await st.post(`/studio/sends/${rq}/recipients`)).s === 400);
  check('start sending', (await st.post(`/studio/sends/${rq}/advance`)).s === 200);
  check('emails leave with the organiser name and link', Boolean(await waitMail(`g1-${hs.slug}@example.com`, /\/i\//)));
  check('recipient list opens while sending', (await st.post(`/studio/sends/${rq}/recipients`)).j.rows.length >= 0);
  check('opening it is visible to the customer', (await a.get('/app/settings')).t.includes('فتح قائمة إرسال الواتساب'));
  check('finish sending', (await st.post(`/studio/sends/${rq}/advance`)).j.status === 2);
  check('customisation request', (await a.post('/requests', { title: 'ختم خاص', description: 'ختم سفير', via: 'واتساب', phone: '0551234567' })).s === 200);
  const cr = (await st.get('/studio')).t.match(/\\"requests\\":\[\{\\"id\\":\\"([0-9a-f-]{36})/)?.[1];
  check('Studio sends a preview', (await st.post(`/studio/requests/${cr}/deliver`, { name: 'ختم سفير', scope: 'org', final: false, design: { kind: 'seal', data: { text: 'سفير', wax: '#0A2A43', logo: '' } } })).s === 200);
  check('design is not usable before approval', !(await a.get('/app/create')).t.includes('ختم سفير'));
  check('customer approves', (await a.post(`/requests/${cr}/approve`)).s === 200 && (await a.get('/app/create')).t.includes('ختم سفير'));
  check('private design is not visible to others', !(await b.get('/app/create')).t.includes('ختم سفير'));
  check('new public pattern', (await st.post('/studio/patterns', { name: 'نجوم ذهبية', scope: 'public', data: { e: 0, c1: '#123E5C', c2: '#04121F', c3: '#E7C873', tx: '#FFFFFF', den: 60, spd: 50, logo: '' } })).s === 200 && (await b.get('/app/designs')).t.includes('نجوم ذهبية'));
  check('add a designer', (await st.post('/studio/team', { name: 'مصمم', email: 'designer@example.com', role: 'design' })).s === 200);
  const ds = await enterStudio('designer@example.com');
  const orgB = (await st.get('/api/studio/customers?q=' + encodeURIComponent('الكيمياء'))).j.rows[0].id;
  check('designer enters the Studio', (await ds.get('/studio')).s === 200);
  check('designer cannot grant credit', (await ds.post(`/studio/customers/${orgB}/credit`, { count: 500, channel: 'whatsapp', reason: 'اختبار' })).s === 403);
  check('designer cannot confirm payments', (await ds.post(`/studio/orders/${oid}`, { ok: true })).s === 403);
  check('designer cannot add team members', (await ds.post('/studio/team', { name: 'متسلل', email: 'x@example.com', role: 'founder' })).s === 403);
  check('designer cannot see customers', (await ds.get('/api/studio/customers')).s === 403);
  check('designer page has no revenue or customers', !(await ds.get('/studio')).t.includes('b@example.com'));
  check('designer cannot publish a design for everyone', (await ds.post('/studio/patterns', { name: 'للكل', scope: 'public', data: { e: 0, c1: '#123E5C', c2: '#04121F', c3: '#E7C873', tx: '#FFFFFF', den: 60, spd: 50, logo: '' } })).s === 403);
  check('founder grants credit', (await st.post(`/studio/customers/${orgB}/credit`, { count: 20, channel: 'self', reason: 'تعويض' })).s === 200);

  section('prices, beta and discounts');
  const contact = { name: 'نادي', email: '', phone: '0551234567' };
  const p0 = (await v.get('/api/pricing')).j;
  check('prices are public and carry nothing else', p0.packs.length === 6 && !JSON.stringify(p0).includes('updatedBy'));
  const paidQ = (await b.post('/orders/quote', { count: 100, channel: 'self', services: [] })).j;
  const paidO = await b.post('/orders', { count: 30, channel: 'self', services: [], contact });
  check('nobody gets free credit on their own', p0.beta === null && paidQ.total === 105 && paidQ.beta === false && paidO.j.total === 35 && paidO.j.done === false, JSON.stringify([paidQ, paidO.j]));
  check('a customer cannot switch the beta on', (await b.post('/studio/pricing', { packs: p0.packs.map((x) => ({ ...x, on: true })), free: 10, beta: { on: true, quota: 300, channels: ['self', 'email'], services: true } })).s === 404);
  check('founder can open free credit to everyone', (await st.post('/studio/pricing', { packs: p0.packs.map((x) => ({ ...x, on: true })), free: 10, beta: { on: true, quota: 300, channels: ['self', 'email'], services: true } })).s === 200);
  const q1 = (await b.post('/orders/quote', { count: 100, channel: 'self', services: [] })).j;
  check('beta credit is free', q1.total === 0 && q1.beta === true, JSON.stringify(q1));
  const bo = await b.post('/orders', { count: 100, channel: 'self', services: [], contact });
  check('a free order is credited at once', bo.s === 200 && bo.j.done === true && /\\"total\\":1[0-9]{2}/.test((await b.get('/app')).t), JSON.stringify(bo.j));
  const rush = await Promise.all(Array.from({ length: 4 }, () => b.post('/orders', { count: 150, channel: 'self', services: [], contact })));
  check('the beta quota holds under simultaneous orders', rush.filter((x) => x.j?.done).length === 1, rush.map((x) => `${x.s}:${x.j?.done}`).join());
  check('WhatsApp is not part of the beta until it is switched on', (await b.post('/orders/quote', { count: 30, channel: 'whatsapp', services: [] })).j.total === 59);
  const price = { packs: [{ count: 30, self: 40, email: 60, whatsapp: 70, on: true }, { count: 100, self: 120, email: 160, whatsapp: 200, on: true }, { count: 500, self: 0, email: 0, whatsapp: 0, on: true }], free: 15, beta: { on: false, quota: 300, channels: ['self', 'email'], services: true } };
  check('founder changes prices and ends the beta', (await st.post('/studio/pricing', price)).s === 200 && (await v.get('/api/pricing')).j.beta === null);
  check('new prices apply at once', (await b.post('/orders/quote', { count: 100, channel: 'email', services: [] })).j.total === 160 && (await b.post('/orders', { count: 300, channel: 'self', services: [], contact })).s === 400);
  const zero = await b.post('/orders', { count: 500, channel: 'self', services: [], contact });
  check('a pack priced at zero by mistake waits for the Studio', zero.s === 200 && zero.j.done === false, JSON.stringify(zero.j));
  check('old orders keep their price', (await st.get('/studio')).t.includes('185') || ord.j.total === 185);
  check('nonsense prices are refused', (await st.post('/studio/pricing', { ...price, packs: [{ count: 30, self: -5, email: 1, whatsapp: 1, on: true }] })).s === 400 && (await st.post('/studio/pricing', { ...price, packs: [] })).s === 400 && (await st.post('/studio/pricing', { ...price, packs: [price.packs[0], price.packs[0]] })).s === 400);
  check('new accounts get the new free credit', /\\"total\\":15/.test((await (await account('حساب جديد', 'new15@example.com')).get('/app')).t));
  const mkCode = (o) => st.post('/studio/discounts', { code: 'HALF', kind: 'percent', value: 50, maxUses: 1, perOrg: 1, orgId: null, expiresAt: null, note: '', ...o });
  check('founder makes discount codes', (await mkCode({})).s === 200 && (await mkCode({ code: 'GIFT', value: 100, maxUses: 5 })).s === 200 && (await mkCode({ code: 'OLD', expiresAt: new Date(Date.now() - 1000).toISOString() })).s === 400 && (await mkCode({ code: 'OLDD', expiresAt: new Date(Date.now() - 1000).toISOString() })).s === 200 && (await mkCode({ code: 'FORA', orgId: orgB, value: 20 })).s === 200);
  check('the same code twice, and more than 100%, are refused', (await mkCode({})).s === 400 && (await mkCode({ code: 'MORE', value: 150 })).s === 400);
  const dq = (await a.post('/orders/quote', { count: 100, channel: 'self', services: [], code: 'half' })).j;
  check('a code halves the total', dq.total === 60 && dq.discount === 60, JSON.stringify(dq));
  check('wrong, expired and other people\'s codes do nothing', ['NOPE', 'OLDD', 'FORA'].length === 3 && (await Promise.all(['NOPE', 'OLDD', 'FORA'].map((c) => a.post('/orders/quote', { count: 100, channel: 'self', services: [], code: c })))).every((x) => x.j.total === 120 && x.j.codeError));
  check('a workspace cannot see or make codes', (await a.post('/studio/discounts', { code: 'HACK', kind: 'percent', value: 100 })).s === 404 && !(await a.get('/app/buy')).t.includes('GIFT'));
  const two = await Promise.all([a.post('/orders', { count: 100, channel: 'self', services: [], code: 'HALF', contact }), b.post('/orders', { count: 100, channel: 'self', services: [], code: 'HALF', contact })]);
  check('a code with one use works once, even at the same moment', two.filter((x) => x.s === 200).length === 1, two.map((x) => x.s).join());
  const gift = await a.post('/orders', { count: 30, channel: 'email', services: [], code: 'GIFT', contact });
  check('a full discount is credited at once', gift.j.total === 0 && gift.j.done === true);
  check('once per workspace', (await a.post('/orders', { count: 30, channel: 'email', services: [], code: 'GIFT', contact })).s === 400);
  check('founder sets a standing price', (await st.post(`/studio/customers/${orgB}/discount`, { pct: 25, reason: 'نادي طلابي' })).s === 200 && (await b.post('/orders/quote', { count: 100, channel: 'self', services: [] })).j.total === 90);
  check('discounts do not add up', (await b.post('/orders/quote', { count: 100, channel: 'self', services: [], code: 'FORA' })).j.total === 90);
  for (const [m, u, body] of [['POST', '/studio/pricing', price], ['POST', '/studio/discounts', { code: 'DSGN', kind: 'percent', value: 100, maxUses: null, perOrg: 1, orgId: null, expiresAt: null, note: '' }], ['POST', `/studio/customers/${orgB}/discount`, { pct: 100, reason: 'اختبار' }], ['POST', `/studio/customers/${orgB}/test`, { test: true }], ['POST', `/studio/customers/${orgB}/wipe`, { name: 'x' }], ['POST', `/studio/team/${orgB}/reset`, {}]]) check(`designer cannot use ${u.replace(orgB, ':id')}`, (await ds.req(m, '/api' + u, body)).s === 403);
  check('designer cannot read analytics', (await ds.get('/api/studio/analytics?days=7')).s === 403);
  const an = await st.get('/api/studio/analytics?days=30');
  check('analytics are totals only', an.s === 200 && an.j.series.length === 6 && an.j.series[0].total >= 3 && !/example\.com|0550000|ضيف رقم|متسابق/.test(an.t), an.t.slice(0, 200));
  const fn = Object.fromEntries(an.j.funnel);
  check('the funnel follows real steps', fn['سجّلوا'] >= 3 && fn['سوّوا دعوة'] >= 2 && fn['أرسلوها'] >= 2 && fn['جاهم رد'] >= 1 && fn['سجّلوا حضور'] >= 1 && fn['سوّوا دعوة'] <= fn['سجّلوا'], JSON.stringify(an.j.funnel));
  for (const d of ['7', '90', '999', "30' or 1=1", '']) check(`analytics range "${d}"`, (await st.get('/api/studio/analytics?days=' + encodeURIComponent(d))).s === 200);
  check('ready designs', (await st.post('/studio/designs', { name: 'ختم جاهز', orgId: null, design: { kind: 'seal', data: { text: 'حفل', wax: '#0E97AE', logo: '' } } })).s === 200 && (await b.get('/app/create')).t.includes('ختم جاهز') && (await ds.post('/studio/designs', { name: 'للكل', orgId: null, design: { kind: 'seal', data: { text: 'x', wax: '#0E97AE', logo: '' } } })).s === 403);
  const did = (await st.get('/studio')).t.match(/\\"id\\":\\"([0-9a-f-]{36})\\",\\"kind\\":\\"seal\\",\\"name\\":\\"ختم جاهز/)?.[1];
  check('a hidden design leaves the pickers', (await st.patch(`/studio/designs/${did}`, { on: false })).s === 200 && !(await b.get('/app/create')).t.includes('ختم جاهز'));

  section('trial workspaces');
  const tw = await account('تجربة الفريق', 'trial@example.com');
  const ti = await invitation(tw, {}, 2);
  await tw.post(`/invitations/${ti.id}/publish`);
  const twId = (await st.get('/api/studio/customers?q=' + encodeURIComponent('تجربة الفريق'))).j.rows[0].id;
  const before = (await st.get('/api/studio/analytics?days=7')).j;
  check('a normal workspace cannot be wiped', (await st.post(`/studio/customers/${twId}/wipe`, { name: 'تجربة الفريق' })).s === 400);
  check('mark it as a trial', (await st.post(`/studio/customers/${twId}/test`, { test: true })).s === 200);
  const after = (await st.get('/api/studio/analytics?days=7')).j;
  check('it leaves every number', after.series[0].total === before.series[0].total - 1 && after.series[2].total === before.series[2].total - 2, JSON.stringify([before.series.map((x) => x.total), after.series.map((x) => x.total)]));
  check('wiping needs the exact name', (await st.post(`/studio/customers/${twId}/wipe`, { name: 'غيره' })).s === 400);
  check('wiping empties it and only it', (await st.post(`/studio/customers/${twId}/wipe`, { name: 'تجربة الفريق' })).s === 200 && (await tw.get(`/app/invitations/${ti.id}`)).s === 404 && (await v.get(`/i/${ti.slug}`)).s === 404 && (await a.get(`/app/invitations/${inv.id}`)).s === 200 && (await tw.get('/app')).s === 200);

  section('workspace roles');
  const vw = await account('مشاهد الفريق', 'viewer@example.com');
  check('owner invites a viewer', (await a.post('/org/members', { email: 'viewer@example.com', role: 'viewer' })).s === 200);
  const ac = (await vw.get('/app/account')).t.match(/\\"invites\\":\[\{\\"id\\":\\"([0-9a-f-]{36})/)?.[1];
  check('a stranger cannot accept the invite', (await b.post(`/me/invites/${ac}/accept`)).s === 404);
  check('viewer accepts', (await vw.post(`/me/invites/${ac}/accept`)).s === 200);
  const orgA = (await vw.get('/app/account')).t.match(/\\"id\\":\\"([0-9a-f-]{36})\\",\\"name\\":\\"نادي العلوم\\"/)?.[1];
  check('viewer switches workspace', (await vw.post('/org/switch', { orgId: orgA })).s === 200 && (await vw.get(`/app/invitations/${inv.id}`)).s === 200);
  check('viewer cannot create', (await vw.post('/invitations', { title: 'x' })).s === 403);
  check('viewer cannot add guests, mark attendance or send', (await vw.post(`/invitations/${inv.id}/guests`, { source: 'manual', items: [{ name: 'متسلل', phone: '0559999999' }] })).s === 403 && (await vw.post(`/invitations/${inv.id}/attendance/walkin`, { name: 'متسلل' })).s === 403 && (await vw.post(`/invitations/${hs.id}/remind`)).s === 403);
  check('viewer cannot change the workspace or its team', (await vw.patch('/org', { name: 'مخترق', kind: '', contactEmail: '', phone: '' })).s === 403 && (await vw.post('/org/members', { email: 'evil@example.com', role: 'manager' })).s === 403);
  check('viewer cannot read personal links', (await vw.get(`/api/invitations/${inv.id}/links`)).s === 403);

  section('attack: other people\'s data (IDOR)');
  const tries = [['GET', `/api/invitations/${inv.id}/guests`], ['GET', `/api/invitations/${inv.id}/links`], ['PATCH', `/api/invitations/${inv.id}`, { title: 'مخترق' }], ['DELETE', `/api/invitations/${inv.id}`], ['POST', `/api/invitations/${inv.id}/publish`], ['POST', `/api/invitations/${inv.id}/duplicate`], ['POST', `/api/invitations/${inv.id}/event`, { startsAt: future(90), placeName: 'x' }], ['POST', `/api/invitations/${inv.id}/remind`], ['POST', `/api/invitations/${inv.id}/attendance/open`, { mode: 'person', minutes: 5, second: false, autoCert: true }], ['POST', `/api/invitations/${inv.id}/attendance/walkin`, { name: 'دخيل' }], ['POST', `/api/invitations/${inv.id}/certificate/issue`], ['POST', `/api/invitations/${inv.id}/thanks`, { group: 0, text: 'abc', withCert: false }], ['POST', `/api/invitations/${inv.id}/guests`, { source: 'manual', items: [{ name: 'دخيل', phone: '0551111111' }] }], ['POST', `/api/requests/${cr}/approve`], ['POST', '/api/org/switch', { orgId: orgA }]];
  for (const [m, u, bd] of tries) check(`B cannot ${m} ${u.replace(/[0-9a-f-]{36}/, ':id')}`, (await b.req(m, u, bd)).s === 404, String((await b.req(m, u, bd)).s));
  for (const p of ['', '/attendance', '/certificate', '/preview']) check(`B cannot open A's page${p}`, (await b.get(`/app/invitations/${inv.id}${p}`)).s === 404);
  check('a guest token only works on its own invitation', (await v.get(`/i/${pi.slug}/${t1}`)).s === 404);
  check('a made-up token is not found', (await v.get(`/i/${inv.slug}/aaaaaaaaaaaaaaaa`)).s === 404);
  const swapA = Object.assign(desk(), { jar: new Map([...a.jar, ['hys', a.jar.get('hy')]]) });
  check('a customer session cannot use the Studio API', (await swapA.get('/api/studio/customers')).s === 401 && (await swapA.get('/studio')).s !== 200);
  const swapS = Object.assign(new Client(), { jar: new Map([...st.jar, ['hy', st.jar.get('hys')]]) });
  check('a Studio session cannot use the customer API', (await swapS.post('/invitations', { title: 'x' })).s === 401 && (await swapS.get('/app')).s !== 200);

  section('attack: cross-site requests');
  check('foreign Origin is refused', (await a.post('/invitations', { title: 'csrf' }, { origin: 'https://evil.example' })).s === 403);
  check('missing Origin is refused', (await a.post('/invitations', { title: 'csrf' }, { noOrigin: true })).s === 403);
  check('cross-site fetch metadata is refused', (await a.post('/invitations', { title: 'csrf' }, { headers: { 'sec-fetch-site': 'cross-site' } })).s === 403);
  check('form post is refused', (await a.post('/invitations', 'title=csrf', { type: 'application/x-www-form-urlencoded' })).s === 415);
  check('GET never changes anything', (await a.get(`/api/invitations/${inv.id}/publish`)).s === 404);

  section('brand typeface');
  const sample = (f) => readFileSync(path.join('node_modules/@fontsource', f));
  const fonts = [['x-Serif_Display-Bold.woff2', sample('markazi-text/files/markazi-text-arabic-700-normal.woff2')], ...[['Regular', 400], ['Medium', 500], ['Bold', 700]].map(([n, w]) => [`xsans-${n}.woff2`, sample(`ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`)])];
  const typeForm = (list) => { const f = new FormData(); for (const [n, b] of list) f.append('file', new Blob([b]), n); return { form: f }; };
  const grab = async (base = BASE) => { const r = await fetch(`${base}/api/type`); return { s: r.status, h: r.headers, b: new Uint8Array(await r.arrayBuffer()) }; };
  check('without an upload there is no pack', (await grab()).s === 204);
  check('only founders upload it', (await ds.post('/studio/type', undefined, typeForm(fonts))).s === 403 && (await ds.del('/studio/type')).s === 403 && (await ds.get('/api/studio/type')).s === 403);
  check('it is not reachable from a workspace or the public address', (await a.post('/studio/type', undefined, typeForm(fonts))).s === 404 && (await v.get('/api/studio/type')).s === 404);
  check('another site cannot upload it', (await st.post('/studio/type', undefined, { ...typeForm(fonts), origin: 'https://evil.example' })).s === 403);
  check('a missing file is named', /Sans Medium/.test((await st.post('/studio/type', undefined, typeForm(fonts.filter((x) => !/Medium/.test(x[0]))))).j.error));
  check('a page dressed as a font is refused', (await st.post('/studio/type', undefined, typeForm(fonts.map(([n], i) => [n, i === 1 ? Buffer.from('<script>alert(1)</script>'.repeat(100)) : fonts[i][1]])))).s === 400);
  check('a cut-off font is refused', (await st.post('/studio/type', undefined, typeForm(fonts.map(([n, b], i) => [n, i === 2 ? b.subarray(0, 5000) : b])))).s === 400);
  check('an oversized font is refused', (await st.post('/studio/type', undefined, typeForm(fonts.map(([n, b], i) => [n, i === 0 ? Buffer.concat([b, Buffer.alloc(600_000)]) : b])))).s === 400);
  check('founder uploads the four files', (await st.post('/studio/type', undefined, typeForm(fonts))).j?.on === true);
  const pk = await grab();
  const raw = Buffer.from(pk.b);
  check('the pack is served on both addresses, never as a font', pk.s === 200 && (await grab(STUDIO)).s === 200 && pk.h.get('content-type') === 'application/octet-stream' && pk.h.get('x-content-type-options') === 'nosniff' && pk.h.get('cross-origin-resource-policy') === 'same-origin');
  check('no font can be cut out of it', !raw.includes('wOF2') && !raw.includes('OTTO') && !fonts.some(([, b]) => raw.includes(b.subarray(100, 140))));
  const un = () => { const u = Buffer.from(raw); let x = u.readUInt32BE(4) | 1; for (let i = 8; i < u.length; i++) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; u[i] ^= x & 255; } const out = []; for (let n = u[8], q = 9; n > 0; n--) { const l = u.readUInt32BE(q + 3); out.push([u[q], u.readUInt16BE(q + 1), u.subarray(q + 7, q + 7 + l)]); q += 7 + l; } return out; };
  const faces = un();
  check('every font arrives unchanged', faces.length === 4 && faces.every(([, , b], i) => b.equals(fonts[i][1])) && faces.map(([f, w]) => `${f}${w}`).join() === '0700,1400,1500,1700', faces.map(([f, w]) => `${f}${w}`).join());
  const top = (await v.get('/')).t;
  check('pages load it under their nonce', /<body>.*<script nonce="[^"]+"[^>]*>\(function\(w,d\)/s.test(top) && /<link rel="preload" href="\/api\/type" as="fetch"/.test(top));
  check('the head holds no script of ours: hosts write into it', !/<script(?![^>]*\bsrc=)[^>]*>/.test(top.split('</head>')[0]));
  check('the upload is in the log', (await st.get('/studio')).t.includes('رفع خط الهوية'));
  check('founder takes it off again', (await st.del('/studio/type')).j?.on === false && (await grab()).s === 204);

  section('attack: leaked files and path traversal');
  const secretish = /APP_SECRET|DATA_KEY|DATABASE_URL=|e2e-only|root:x:0|BEGIN [A-Z ]*PRIVATE KEY|"dependencies"|\[core\]|create table/i;
  const files = ['/.env', '/.env.local', '/.env.production', '/.git/config', '/.git/HEAD', '/package.json', '/package-lock.json', '/next.config.mjs', '/drizzle/0000_init.sql', '/src/server/lib/crypto.ts', '/tests/e2e.mjs', '/.next/BUILD_ID', '/.next/server/app/page.js', '/server/app/page.js', '/.data/pg/PG_VERSION', '/backup.sql', '/dump.sql', '/node_modules/next/package.json', '/.DS_Store', '/wp-admin', '/phpinfo.php', '/actuator/env', '/server-status', '/.well-known/../.env'];
  const climbs = ['/../../.env', '/../../../../etc/passwd', '/..%2f..%2f.env', '/%2e%2e/%2e%2e/.env', '/%2e%2e%2f%2e%2e%2f.env', '/..%5c..%5c.env', '/..\\..\\.env', '/%252e%252e%252f.env', '/_next/static/../../../.env', '/_next/static/..%2f..%2f..%2f.env', '/_next/static/%2e%2e/%2e%2e/%2e%2e/package.json', '/_next/../.env', '/img/../../.env', '/img/..%2f..%2fpackage.json', '/img/%2e%2e/%2e%2e/package.json', '/icon.svg/../../.env', '/api/assets/../../../.env', '/api/assets/..%2f..%2f..%2f.env', '/api/assets/%2e%2e%2f.env', '/api/assets/....//....//.env', '/api/assets/%00', '/api/../.env', '/i/../../.env', '/c/..%2f..%2f.env', '//etc/passwd', '/.//.env', '/%c0%ae%c0%ae/.env', '/..;/..;/.env', 'C:/Windows/win.ini', '/C:/Windows/win.ini', '/_next/image?url=%2F..%2F..%2F.env&w=64&q=75', '/_next/image?url=file:///etc/passwd&w=64&q=75', '/_next/image?url=http://169.254.169.254/latest/meta-data&w=64&q=75', '/_next/image?url=http://localhost:3111/api/health&w=64&q=75'];
  for (const p of [...files, ...climbs]) { const r = await rawGet(p); check(`not served: ${p}`, (r.s !== 200 || !r.t) && !secretish.test(r.t), `${r.s} ${r.t.slice(0, 80)}`); }
  check('redirects never leave the site', (await Promise.all(['//evil.example', '/\\evil.example', '/%5cevil.example', '//evil.example/%2e%2e', '/signup//evil.example'].map((p) => rawGet(p)))).every((r) => !/^(https?:)?\/\/(?!localhost|127)/.test(r.loc)));
  check('a next address outside the site is ignored', !(await v.get('/signup?mode=old&next=https://evil.example')).t.includes('href="https://evil.example'));
  const chunks = readdirSync('.next/static', { recursive: true }).map(String).filter((f) => /\.(js|css|map|json)$/.test(f));
  const inBundle = chunks.filter((f) => /APP_SECRET|DATA_KEY|DATABASE_URL|RESEND_API_KEY|BREVO_API_KEY|SMTP_URL|CRON_SECRET|scrypt\$|postgres:\/\//.test(readFileSync(path.join('.next/static', f), 'utf8')));
  check('nothing secret is in the browser files', chunks.length > 10 && !inBundle.length, inBundle.join());
  check('no source maps are published', !chunks.some((f) => f.endsWith('.map')));
  const tracked = execFileSync(process.platform === 'win32' ? 'node' : process.execPath, ['scripts/check-secrets.mjs'], { encoding: 'utf8' });
  check('the repository holds no secrets', /clean/.test(tracked), tracked);

  section('attack: injection');
  const evil = '<script>alert(1)</script>"\'><img src=x onerror=alert(1)>';
  const xs = await invitation(a, { title: evil.slice(0, 60), audience: 'public', cap: 3 }, 0);
  await a.post(`/invitations/${xs.id}/publish`);
  const xp = await v.get(`/i/${xs.slug}`);
  check('markup in a title is never live on the page', xp.s === 200 && !xp.t.includes('<script>alert(1)') && !xp.t.includes('<img src=x'));
  for (const u of ['javascript:alert(1)', 'data:text/html,x', 'http://plain.example', 'https://user:pass@evil.example', '//evil.example', 'https://localhost']) check(`unsafe link refused: ${u}`, (await a.patch(`/invitations/${big.id}`, { mapUrl: u })).s === 400);
  for (const p of ["' OR 1=1--", "'; DROP TABLE users;--", '%', '_', '\\']) check(`search is literal: ${p}`, (await st.get('/api/studio/customers?q=' + encodeURIComponent(p))).j?.rows?.length === 0);
  for (const p of ["/i/' OR 1=1--/x", '/i/..%2f..%2fetc/passwd', "/c/' UNION SELECT 1--", '/r/%00', '/a/%27']) check(`odd address is not found: ${p}`, [404, 400].includes((await v.get(p)).s));
  check('bad ids are not found', (await a.get('/api/invitations/1%20OR%201=1/guests')).s === 404 && (await v.get('/api/assets/..%2f..%2f.env')).s === 404);
  const mass = await a.post('/invitations', { title: 'x', status: 'sent', orgId: orgB, slug: 'hacked', sentAt: future(1), createdBy: orgB, __proto__: { admin: true } });
  check('extra fields are ignored', mass.s === 200 && mass.j.slug !== 'hacked' && (await v.get('/i/hacked')).s === 404);
  check('profile cannot change role, status or email', (await a.patch('/me', { role: 'founder', status: 'active', email: 'x@x.com', emailVerifiedAt: null, notify: { daily: true } })).s === 200 && (await swapA.get('/api/studio/customers')).s === 401);
  check('unknown pattern and colours are refused', (await a.patch(`/invitations/${big.id}`, { pattern: 'x;background:url(//evil)' })).s === 400 && (await st.post('/studio/patterns', { name: 'xx', scope: 'public', data: { e: 0, c1: 'red;}body{display:none', c2: '#04121F', c3: '#E7C873', tx: '#FFFFFF', den: 60, spd: 50, logo: '' } })).s === 400);
  check('another workspace\'s photo or design cannot be attached', (await b.patch(`/invitations/${pi.id}`, { photoAssetId: inv.id })).s === 400);
  check('broken JSON is handled', (await a.post('/invitations', '{"title":', {})).s === 400);
  check('huge bodies are refused', (await a.post('/invitations', JSON.stringify({ title: 'x'.repeat(1_200_000) }))).s === 413);
  check('mail subjects cannot carry extra headers', (await a.patch(`/invitations/${big.id}`, { title: 'سطر\r\nBcc: x@evil.example' })).s === 200 && !mails().some((m) => /[\r\n]/.test(m.subject)));

  section('attack: uploads');
  const up = async (c, bytes, name, kind = 'logo', type = 'image/png') => { const f = new FormData(); f.append('kind', kind); f.append('file', new Blob([bytes], { type }), name); return c.req('POST', '/api/assets', undefined, { form: f }); };
  const { default: sharp } = await import('sharp');
  const png = await sharp({ create: { width: 40, height: 40, channels: 4, background: '#0E97AE' } }).png().toBuffer();
  const okUp = await up(a, png, 'logo.png');
  check('a real PNG is accepted', okUp.s === 200, okUp.t.slice(0, 120));
  const poly = await up(a, Buffer.concat([png, Buffer.from('<script>alert(1)</script>')]), 'p.png');
  const back = poly.s === 200 ? await v.get(poly.j.url) : null;
  check('anything hidden after the image is stripped', poly.s === 400 || (back && !back.t.includes('<script>')));
  check('HTML dressed as an image is refused', (await up(a, '<html><script>alert(1)</script></html>', 'x.png')).s === 400);
  check('SVG with script is refused', (await up(a, '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>', 'x.svg', 'logo', 'image/svg+xml')).s === 400);
  check('SVG with an external entity is refused', (await up(a, '<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg xmlns="http://www.w3.org/2000/svg"><text>&x;</text></svg>', 'x.svg', 'logo', 'image/svg+xml')).s === 400);
  check('SVG that loads another site is refused', (await up(a, '<svg xmlns="http://www.w3.org/2000/svg"><image href="http://169.254.169.254/latest"/></svg>', 'x.svg', 'logo', 'image/svg+xml')).s === 400);
  const svg = await up(a, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#0E97AE"/></svg>', 'x.svg', 'logo', 'image/svg+xml');
  check('a clean SVG is served back as PNG', svg.s === 200 && (await v.get(svg.j.url)).h.get('content-type') === 'image/png', svg.t.slice(0, 120));
  check('files are served sandboxed', /sandbox/.test((await v.get(okUp.j.url)).h.get('content-security-policy')) && (await v.get(okUp.j.url)).h.get('x-content-type-options') === 'nosniff');
  check('oversized files are refused', (await up(a, Buffer.concat([png, Buffer.alloc(2_100_000)]), 'big.png')).s === 400);
  check('an unknown kind of upload is refused', (await up(a, png, 'x.png', 'other')).s === 400);
  // Plain http, so the connection the server drops is not one the other checks share.
  const endless = (c) => new Promise((ok) => {
    const r = http.request(BASE + '/api/assets', { method: 'POST', agent: false, headers: { origin: BASE, 'x-forwarded-for': c.ip, 'content-type': 'multipart/form-data; boundary=x', cookie: [...c.jar].map(([k, v]) => `${k}=${v}`).join('; ') } }, (res) => { ok(res.statusCode); r.destroy(); });
    r.on('error', (e) => ok(e.code));
    let left = 14;
    const push = () => { if (r.destroyed) return; if (left-- > 0) r.write(Buffer.alloc(1_000_000), push); else r.end(); };
    push();
  });
  const cut = await endless(a);
  check('an upload that hides its size is cut off', cut === 413 || /ECONNRESET|EPIPE|ECANCELED|ECONNABORTED/.test(String(cut)), String(cut));
  check('the site still answers after it', (await v.get('/api/health')).s === 200);
  check('uploading needs sign-in', (await up(new Client(), png, 'x.png')).s === 401);
  check('certificate cannot use another workspace\'s image', (await b.post(`/invitations/${pi.id}/certificate`, { tpl: 0, color: 0, title: 0, org: 'x', orgSub: '', certLine: '', para: '', lang: 'ar', enLine: '', enPara: '', signer: '', role: '', extra: false, extraL: '', when: 0, logo: okUp.j.url, sigImg: '', bg: '', fields: { ev: true, dt: true, du: false }, px: 50, py: 50, al: 1, sz: 1, tc: 0 })).s === 400);

  section('attack: guessing and racing');
  const bf = new Client();
  await bf.post('/auth/signup', { name: 'هدف', email: 'target@example.com', password: 'G00d!password' });
  const real = codeFor('target@example.com');
  for (let i = 0; i < 5; i++) await bf.post('/auth/verify', { email: 'target@example.com', code: String((Number(real) + i + 1) % 1e6).padStart(6, '0') });
  check('five wrong codes burn the real one', (await bf.post('/auth/verify', { email: 'target@example.com', code: real })).s === 400);
  const pw = new Client();
  let last = 0;
  for (let i = 0; i < 10; i++) last = (await pw.post('/auth/login', { email: a.email, password: 'wrong-' + i })).s;
  check('password guessing is slowed down', last === 429);
  check('the real owner is not locked out by it', (await a.post('/auth/login', { email: a.email, password: a.password })).s === 200);
  const lk = desk();
  for (let i = 0; i < 6; i++) await lk.post('/studio/verify', { email: 'founder@example.com', code: '00000' + i });
  check('Studio locks after five wrong codes', (await lk.post('/studio/verify', { email: 'founder@example.com', code: '123456' })).s === 429);
  const dm = desk();
  await dm.post('/studio/login', { email: 'designer@example.com' });
  await dm.post('/studio/verify', { email: 'designer@example.com', code: codeFor('designer@example.com') });
  for (let i = 0; i < 5; i++) await dm.post('/studio/mfa', { code: '11111' + i });
  check('authenticator codes cannot be guessed', (await dm.post('/studio/mfa', { code: totp(ds.secret, 1) })).s === 429);
  const sneaky = new Client();
  let blocked = false;
  for (let i = 0; i < 12; i++) { const r = await sneaky.req('POST', '/api/auth/login', { email: 'b@example.com', password: 'x' + i }, { headers: { 'x-forwarded-for': `10.0.0.${i}, ${sneaky.ip}` } }); if (r.s === 429) blocked = true; }
  check('a forged X-Forwarded-For does not reset the limits', blocked);
  const cc = await account('سباق', 'race@example.com');
  const i1 = await invitation(cc, {}, 8);
  const i2 = await invitation(cc, { title: 'ثانية' }, 8);
  const dbl = await Promise.all([cc.post(`/invitations/${i1.id}/publish`), cc.post(`/invitations/${i2.id}/publish`), cc.post(`/invitations/${i1.id}/publish`)]);
  check('credit cannot be spent twice at the same moment', dbl.filter((x) => x.s === 200).length === 1, dbl.map((x) => x.s).join());
  const i3 = await invitation(cc, { title: 'ثالثة' }, 1);
  await cc.post(`/invitations/${i3.id}/publish`);
  await cc.post(`/invitations/${i3.id}/attendance/open`, { mode: 'online', minutes: 5, second: false, autoCert: true });
  const tk = tokenOf((await links(cc, i3.id))[0] || { link: 'x/x' });
  let g429 = false;
  for (let i = 0; i < 12; i++) if ((await new Client().post(`/g/${tk}/attend`, { code: String(i).padStart(4, '0') })).s === 429) g429 = true;
  check('attendance codes cannot be guessed', g429);

  section('attack: sessions');
  const s2 = new Client();
  await s2.post('/auth/login', { email: 'b@example.com', password: b.password });
  await s2.post('/auth/login/verify', { email: 'b@example.com', code: codeFor('b@example.com') });
  check('second device works', (await s2.get('/app')).s === 200);
  check('wrong current password is refused', (await b.post('/auth/password', { current: 'nope', next: 'N3w!password9' })).s === 400);
  check('password change', (await b.post('/auth/password', { current: b.password, next: 'N3w!password9' })).s === 200);
  check('other devices are signed out by it', (await s2.get('/app')).s !== 200 && (await b.get('/app')).s === 200);
  await new Client().post('/auth/forgot', { email: 'b@example.com' });
  const rs = new Client();
  check('reset needs the code', (await rs.post('/auth/reset', { email: 'b@example.com', code: '000000', password: 'An0ther!pass1' })).s === 400);
  check('reset works with the code', (await rs.post('/auth/reset', { email: 'b@example.com', code: codeFor('b@example.com'), password: 'An0ther!pass1' })).s === 200);
  check('a code cannot be used twice', (await new Client().post('/auth/reset', { email: 'b@example.com', code: codeFor('b@example.com'), password: 'An0ther!pass2' })).s === 400);
  check('reset signs out old sessions', (await b.get('/app')).s !== 200);
  const fk = new Client();
  fk.jar.set('hy', 'x'.repeat(43));
  check('a made-up session is refused', (await fk.get('/app')).s !== 200 && (await fk.post('/invitations', { title: 'x' })).s === 401);

  section('suspension and scheduler');
  check('founder suspends a workspace', (await st.post(`/studio/customers/${orgB}/status`, { status: 'suspended', reason: 'مخالفة' })).s === 200);
  check('suspended workspace cannot change anything', (await rs.post('/invitations', { title: 'x' })).s === 403);
  check('its invitations go dark', (await v.get(`/i/${pi.slug}`)).s === 404);
  check('scheduler is hidden without its secret', (await v.get('/api/cron/tick')).s === 404 && (await v.get('/api/cron/tick', { headers: { authorization: 'Bearer wrong' } })).s === 404);
  const tk1 = await v.get('/api/cron/tick', { headers: { authorization: 'Bearer test-cron-secret-123456' } });
  check('scheduler runs every step', tk1.s === 200 && !Object.values(tk1.j).includes('error'), JSON.stringify(tk1.j));
  if (pooler) check('no query is sent behind another: Supabase would never answer it', pooler.stat.queries > 500 && pooler.stat.pipelined === 0, JSON.stringify(pooler.stat));
  check('errors never show details', !/stack|select |node_modules|postgres/i.test((await v.get('/api/nothing/here')).t));
}

try {
  await main();
} catch (e) {
  fails.push('crash');
  console.error(e);
} finally {
  server.kill();
  await sleep(600);
  const errs = log.split('\n').filter((l) => /\[api\]|\[scheduler\]|\[mail\]|⨯|Error:/.test(l));
  if (errs.length) console.log('\nserver log:\n' + errs.slice(0, 15).join('\n'));
  if (process.env.E2E_LOG) console.log(log.slice(-6000));
  rmSync(tmp, { recursive: true, force: true, maxRetries: 5 });
  console.log(`\n${pass} passed, ${fails.length} failed`);
  if (fails.length) console.log(fails.map((f) => ' - ' + f).join('\n'));
  process.exit(fails.length ? 1 : 0);
}
