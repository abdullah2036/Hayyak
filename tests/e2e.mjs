/**
 * End-to-end and security checks against a real production build.
 *   npm run build && npm run test:e2e
 * Starts the app on a spare port with an empty embedded database, plays the whole product through the
 * HTTP API (accounts, invitations, guests, attendance, certificates, orders, Studio), then attacks it.
 * Set TEST_DATABASE_URL to an empty throwaway Postgres database to run against a real server instead.
 */
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';

const PORT = 3111;
const BASE = `http://localhost:${PORT}`;
const tmp = mkdtempSync(path.join(tmpdir(), 'hy-'));
const MAIL = path.join(tmp, 'mail.jsonl');
const env = { ...process.env, NODE_ENV: 'production', APP_URL: BASE, ALLOW_EMBEDDED_DB: '1', ALLOW_DEV_SECRETS: '1', PGLITE_DIR: path.join(tmp, 'pg'), MAIL_FILE: MAIL, MAIL_SILENT: '1', TRUSTED_PROXIES: '1', CRON_SECRET: 'test-cron-secret-123456', DATABASE_URL: process.env.TEST_DATABASE_URL || '', SMTP_URL: '', RESEND_API_KEY: '' };

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
  constructor(ip = newIp()) {
    this.jar = new Map();
    this.ip = ip;
    this.raw = [];
  }

  async req(method, url, body, o = {}) {
    const headers = { 'user-agent': 'Mozilla/5.0 (iPhone) Safari/605', 'x-forwarded-for': this.ip, ...(o.headers || {}) };
    if (method !== 'GET' && !o.noOrigin) headers.origin = o.origin ?? BASE;
    if (this.jar.size) headers.cookie = [...this.jar].map(([k, v]) => `${k}=${v}`).join('; ');
    let payload;
    if (o.form) payload = o.form;
    else if (body !== undefined || method !== 'GET') {
      headers['content-type'] = o.type || 'application/json';
      payload = typeof body === 'string' ? body : JSON.stringify(body ?? {});
    }
    const r = await fetch(BASE + url, { method, headers, body: method === 'GET' ? undefined : payload, redirect: 'manual' });
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

execFileSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/seed-admin.ts', 'founder@example.com', 'مؤسس تجريبي'], { env, stdio: 'inherit' });
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
  for (const p of ['/', '/signup', '/privacy', '/terms', '/studio/login', '/robots.txt']) check(`GET ${p}`, (await v.get(p)).s === 200);
  const home = await v.get('/');
  const csp = home.h.get('content-security-policy') || '';
  check('CSP blocks inline and foreign scripts', /script-src 'self' 'nonce-[^']+' 'strict-dynamic'/.test(csp) && !/script-src[^;]*unsafe-inline/.test(csp) && !/unsafe-eval/.test(csp), csp);
  check('CSP blocks framing, plugins and foreign base tags', /frame-ancestors 'none'/.test(csp) && /object-src 'none'/.test(csp) && /base-uri 'self'/.test(csp));
  check('nonce changes on every request', csp !== (await v.get('/')).h.get('content-security-policy'));
  check('every script tag carries the nonce', [...home.t.matchAll(/<script\b[^>]*>/g)].every((m) => /nonce=/.test(m[0])), [...home.t.matchAll(/<script\b[^>]*>/g)].filter((m) => !/nonce=/.test(m[0])).slice(0, 2).join(' '));
  check('nosniff, HSTS, frame and referrer headers', home.h.get('x-content-type-options') === 'nosniff' && /max-age/.test(home.h.get('strict-transport-security')) && home.h.get('x-frame-options') === 'DENY' && Boolean(home.h.get('referrer-policy')));
  check('server does not advertise itself', !home.h.get('x-powered-by'));
  check('/app needs sign-in', [307, 303, 302].includes((await v.get('/app')).s));
  check('/studio needs sign-in', [307, 303, 302].includes((await v.get('/studio')).s));

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
  const st = new Client();
  const unknown = await st.post('/studio/login', { email: 'nobody@example.com' });
  const known = await st.post('/studio/login', { email: 'founder@example.com' });
  check('Studio sign-in does not reveal who is on the team', unknown.s === known.s && JSON.stringify(unknown.j) === JSON.stringify(known.j));
  check('Studio code', (await st.post('/studio/verify', { email: 'founder@example.com', code: codeFor('founder@example.com') })).s === 200);
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
  const ds = new Client();
  await ds.post('/studio/login', { email: 'designer@example.com' });
  await ds.post('/studio/verify', { email: 'designer@example.com', code: codeFor('designer@example.com') });
  const orgB = (await st.get('/api/studio/customers?q=' + encodeURIComponent('الكيمياء'))).j.rows[0].id;
  check('designer enters the Studio', (await ds.get('/studio')).s === 200);
  check('designer cannot grant credit', (await ds.post(`/studio/customers/${orgB}/credit`, { count: 500, channel: 'whatsapp', reason: 'اختبار' })).s === 403);
  check('designer cannot confirm payments', (await ds.post(`/studio/orders/${oid}`, { ok: true })).s === 403);
  check('designer cannot add team members', (await ds.post('/studio/team', { name: 'متسلل', email: 'x@example.com', role: 'founder' })).s === 403);
  check('designer cannot see customers', (await ds.get('/api/studio/customers')).s === 403);
  check('designer page has no revenue or customers', !(await ds.get('/studio')).t.includes('b@example.com'));
  check('designer cannot publish a design for everyone', (await ds.post('/studio/patterns', { name: 'للكل', scope: 'public', data: { e: 0, c1: '#123E5C', c2: '#04121F', c3: '#E7C873', tx: '#FFFFFF', den: 60, spd: 50, logo: '' } })).s === 403);
  check('founder grants credit', (await st.post(`/studio/customers/${orgB}/credit`, { count: 20, channel: 'self', reason: 'تعويض' })).s === 200);

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
  check('a customer session cannot use the Studio API', (await a.get('/api/studio/customers')).s === 401);
  check('a Studio session cannot use the customer API', (await st.post('/invitations', { title: 'x' })).s === 401);

  section('attack: cross-site requests');
  check('foreign Origin is refused', (await a.post('/invitations', { title: 'csrf' }, { origin: 'https://evil.example' })).s === 403);
  check('missing Origin is refused', (await a.post('/invitations', { title: 'csrf' }, { noOrigin: true })).s === 403);
  check('cross-site fetch metadata is refused', (await a.post('/invitations', { title: 'csrf' }, { headers: { 'sec-fetch-site': 'cross-site' } })).s === 403);
  check('form post is refused', (await a.post('/invitations', 'title=csrf', { type: 'application/x-www-form-urlencoded' })).s === 415);
  check('GET never changes anything', (await a.get(`/api/invitations/${inv.id}/publish`)).s === 404);

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
  check('profile cannot change role, status or email', (await a.patch('/me', { role: 'founder', status: 'active', email: 'x@x.com', emailVerifiedAt: null, notify: { daily: true } })).s === 200 && (await a.get('/api/studio/customers')).s === 401);
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
  check('an upload that hides its size is cut off', cut === 413 || /ECONNRESET|EPIPE/.test(String(cut)), String(cut));
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
  const lk = new Client();
  for (let i = 0; i < 6; i++) await lk.post('/studio/verify', { email: 'founder@example.com', code: '00000' + i });
  check('Studio locks after five wrong codes', (await lk.post('/studio/verify', { email: 'founder@example.com', code: '123456' })).s === 429);
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
