import 'server-only';
import { cookies } from 'next/headers';
import { and, eq, ne, sql } from 'drizzle-orm';
import { MAX_GUESTS, PATTERNS, SEAL_NAMES } from '@/lib/constants';
import { db, customDesigns, customRequests, guests, invitations, memberships, orders, orgInvites, orgs, sessions, users, type DB, type OrgRole } from '../db';
import { safeEqual } from '../lib/crypto';
import { AppError, appUrl, audit, bad, limit, notFound } from '../lib/core';
import { send } from '../lib/mail';
import { can, endSession, needRole, type StaffCtx } from '../lib/session';
import { analytics } from '../services/analytics';
import * as auth from '../services/auth';
import * as inv from '../services/invitations';
import * as att from '../services/attendance';
import * as guest from '../services/guest';
import * as st from '../services/studio';
import * as type from '../services/type';
import * as assets from '../services/assets';
import { balance } from '../services/credit';
import * as price from '../services/pricing';
import { guestRows, personalLinks } from '../services/screens';
import { tick } from '../services/scheduler';
import { email, hex, httpsUrl, optEmail, phone, pub, readForm, str, studio, uid, user, uuid, z, type PublicReq } from './router';

const meta = (c: PublicReq) => ({ ip: c.ip, device: c.device });
const password = z.string().min(1).max(200);
const code6 = z.string().transform((s) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))).pipe(z.string().regex(/^\d{6}$/, 'الرمز 6 أرقام'));
const code4 = z.string().transform((s) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))).pipe(z.string().regex(/^\d{4}$/, 'الكود 4 أرقام'));
const when = z.coerce.date().refine((d) => d.getFullYear() >= 2024 && d.getFullYear() < 2100, 'التاريخ غير صحيح');

/* ---------- accounts ---------- */
pub('POST', '/auth/signup', { body: z.object({ name: str(80, 2, 'اكتب اسمك'), email, password }), rate: [20, 600] }, async (c) => { await auth.signup(c.body, meta(c)); });
pub('POST', '/auth/verify', { body: z.object({ email, code: code6 }), rate: [40, 600] }, async (c) => { await auth.verifySignup(c.body.email, c.body.code, meta(c)); });
pub('POST', '/auth/login', { body: z.object({ email, password }), rate: [60, 600] }, async (c) => auth.login(c.body, meta(c)));
pub('POST', '/auth/login/verify', { body: z.object({ email, code: code6 }), rate: [40, 600] }, async (c) => { await auth.verifyLogin(c.body.email, c.body.code, meta(c)); });
pub('POST', '/auth/forgot', { body: z.object({ email }), rate: [10, 600] }, async (c) => { await auth.forgot(c.body.email, meta(c)); });
pub('POST', '/auth/reset', { body: z.object({ email, code: code6, password }), rate: [30, 600] }, async (c) => { await auth.reset(c.body, meta(c)); });
pub('POST', '/auth/logout', {}, async () => { await endSession('user'); });
user('POST', '/auth/password', { body: z.object({ current: password, next: password }), write: false }, async (c) => { await auth.changePassword(c.me.user, c.me.session.id, c.body, meta(c)); });
user('POST', '/auth/sessions/:id/end', { write: false }, async (c) => {
  await (await db()).delete(sessions).where(and(eq(sessions.id, uuid(c.params.id)), eq(sessions.userId, c.me.user.id)));
});

/* ---------- me and my workspace ---------- */
user('PATCH', '/me', { body: z.object({ certNameAr: str(80).optional(), certNameEn: str(80).optional(), uniId: str(30).optional(), tourSeen: z.boolean().optional(), notify: z.object({ daily: z.boolean(), each: z.boolean(), low: z.boolean(), requests: z.boolean(), offers: z.boolean() }).partial().optional() }), write: false }, async (c) => {
  await (await db()).update(users).set({ ...c.body, notify: c.body.notify ? { ...c.me.user.notify, ...c.body.notify } : undefined }).where(eq(users.id, c.me.user.id));
});
user('PATCH', '/org', { role: 'owner', body: z.object({ name: str(80, 2, 'اكتب الاسم'), kind: str(40), contactEmail: optEmail, phone }) }, async (c) => {
  await (await db()).update(orgs).set(c.body).where(eq(orgs.id, c.me.org.id));
});
user('POST', '/org/new', { body: z.object({ name: str(80, 2, 'اكتب الاسم') }) }, async (c) => {
  await limit(`neworg:${c.me.user.id}`, 5, 86400);
  const d = await db();
  const mine = await d.select({ id: memberships.orgId }).from(memberships).where(and(eq(memberships.userId, c.me.user.id), eq(memberships.role, 'owner')));
  if (mine.length >= 5) throw bad('تقدر تدير 5 جهات بالكثير');
  // The free trial is per person, so a second workspace starts empty.
  const org = await d.transaction((t) => auth.createOrg(t as unknown as DB, c.me.user.id, c.body.name, c.me.user.email, false));
  await d.update(sessions).set({ orgId: org.id }).where(eq(sessions.id, c.me.session.id));
});
user('POST', '/org/switch', { body: z.object({ orgId: uid }), write: false }, async (c) => {
  if (!c.me.orgsList.some((o) => o.id === c.body.orgId)) throw notFound();
  await (await db()).update(sessions).set({ orgId: c.body.orgId }).where(eq(sessions.id, c.me.session.id));
});
user('POST', '/org/members', { role: 'owner', body: z.object({ email, role: z.enum(['manager', 'viewer']) }) }, async (c) => {
  await limit(`members:${c.me.org.id}`, 30, 86400);
  const d = await db();
  const n = await d.select({ id: memberships.userId }).from(memberships).where(eq(memberships.orgId, c.me.org.id));
  if (n.length >= 30) throw bad('وصلت الحد الأعلى للفريق');
  await d.insert(orgInvites).values({ orgId: c.me.org.id, email: c.body.email, role: c.body.role as OrgRole, invitedBy: c.me.user.id, expiresAt: new Date(Date.now() + 14 * 864e5) }).onConflictDoUpdate({ target: [orgInvites.orgId, orgInvites.email], set: { role: c.body.role as OrgRole, expiresAt: new Date(Date.now() + 14 * 864e5) } });
  await audit({ type: 'user', id: c.me.user.id, name: c.me.user.name, ip: c.ip }, 'دعا عضو للفريق', { detail: c.body.email, orgId: c.me.org.id });
  await send({ to: c.body.email, subject: `دعوة لفريق ${c.me.org.name}`, title: `${c.me.user.name} دعاك لفريق ${c.me.org.name}`, lines: ['أنشئ حسابك بهذا الإيميل أو ادخل بحسابك، وبتلقى الدعوة في صفحة «حسابي».'], button: { label: 'افتح حيّــاك', url: `${appUrl()}/app/account` } });
});
user('POST', '/org/members/:id/remove', { role: 'owner' }, async (c) => {
  const id = uuid(c.params.id);
  if (id === c.me.user.id) throw bad('ما تقدر تشيل نفسك');
  const d = await db();
  await d.delete(memberships).where(and(eq(memberships.orgId, c.me.org.id), eq(memberships.userId, id), ne(memberships.role, 'owner')));
  await d.delete(orgInvites).where(and(eq(orgInvites.orgId, c.me.org.id), eq(orgInvites.id, id)));
});
user('POST', '/me/invites/:id/:answer', { write: false }, async (c) => {
  const d = await db();
  const [i] = await d.delete(orgInvites).where(and(eq(orgInvites.id, uuid(c.params.id)), eq(orgInvites.email, c.me.user.email))).returning();
  if (!i || i.expiresAt < new Date()) throw notFound();
  if (c.params.answer === 'accept') await d.insert(memberships).values({ orgId: i.orgId, userId: c.me.user.id, role: i.role }).onConflictDoNothing();
});

/* ---------- uploads ---------- */
const MAX_UPLOAD = 11_000_000;
user('POST', '/assets', { role: 'manager', raw: true }, async (c) => {
  const f = await readForm(c.req, MAX_UPLOAD);
  const file = f.get('file');
  const kind = z.enum(['logo', 'photo', 'signature', 'certbg']).safeParse(f.get('kind')).data;
  if (!kind) throw bad('نوع الملف غير معروف');
  if (!(file instanceof File)) throw bad('اختر ملف');
  const a = await assets.store(c.me.org.id, kind, file);
  if (kind === 'logo' && f.get('set') === '1') {
    needRole(c.me, 'owner');
    await (await db()).update(orgs).set({ logoAssetId: a.id }).where(eq(orgs.id, c.me.org.id));
  }
  return a;
});
studio('POST', '/studio/assets', 'design', { raw: true }, async (c) => {
  const file = (await readForm(c.req, MAX_UPLOAD)).get('file');
  if (!(file instanceof File)) throw bad('اختر ملف');
  return assets.store(null, 'custom', file);
});
studio('GET', '/studio/type', 'team', {}, async () => type.typeStatus());
studio('POST', '/studio/type', 'team', { raw: true, rate: [20, 600] }, async (c) => {
  const files = (await readForm(c.req, 2_100_000)).getAll('file').filter((f): f is File => f instanceof File);
  if (!files.length || files.length > 20) throw bad('اختر ملفات الخط');
  return type.saveType({ type: 'staff', id: c.me.staff.id, name: c.me.staff.name, ip: c.ip }, files);
});
studio('DELETE', '/studio/type', 'team', {}, async (c) => type.dropType({ type: 'staff', id: c.me.staff.id, name: c.me.staff.name, ip: c.ip }));
const sendType = async (c: { params: Record<string, string>; req: Request }) => {
  const b = await type.typePack();
  if (!b) return new Response(null, { status: 204, headers: { 'Cache-Control': 'public, max-age=30' } });
  const v = await type.typeVersion();
  // A versioned address always holds the same bytes, so it can be kept for a year and is never asked for again.
  const fixed = c.params.v === v;
  const tag = `"${v}"`;
  const head: Record<string, string> = {
    'Content-Type': 'application/octet-stream', ETag: tag, 'Cache-Control': fixed ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
    'Netlify-CDN-Cache-Control': fixed ? 'public, durable, max-age=31536000, immutable' : 'public, durable, max-age=300', 'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox", 'Cross-Origin-Resource-Policy': 'same-origin', 'X-Robots-Tag': 'noindex',
  };
  if (c.req.headers.get('if-none-match') === tag) return new Response(null, { status: 304, headers: head });
  if (c.params.v && !fixed) return new Response(null, { status: 307, headers: { Location: `/api/type/${v}`, 'Cache-Control': 'no-store' } });
  return new Response(b, { headers: { ...head, 'Content-Length': String(b.length) } });
};
pub('GET', '/type', {}, sendType);
pub('GET', '/type/:v', {}, sendType);
pub('GET', '/assets/:id', {}, async (c) => {
  const a = await assets.read(uuid(c.params.id));
  if (!a) throw notFound();
  return new Response(new Uint8Array(a.bytes), {
    headers: { 'Content-Type': a.mime, 'Content-Length': String(a.bytes.length), 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Cross-Origin-Resource-Policy': 'same-origin' },
  });
});

/* ---------- invitations ---------- */
const reminders = z.object({ by: z.enum(['hayyak', 'self', 'none']), day: z.boolean(), hours: z.boolean() });
const draft = z.object({
  audience: z.enum(['private', 'public']).optional(), pattern: z.enum(PATTERNS).optional(), color: z.number().int().min(0).max(2).optional(), seal: z.enum(SEAL_NAMES as [string, ...string[]]).optional(),
  photoAssetId: uid.nullable().optional(), customPatternId: uid.nullable().optional(), customColorsId: uid.nullable().optional(), customSealId: uid.nullable().optional(), customLoadingId: uid.nullable().optional(),
  title: str(60).optional(), latin: str(60).optional(), eventLabel: str(80).optional(), startsAt: when.nullable().optional(), durationMin: z.number().int().min(30).max(1440).optional(),
  online: z.boolean().optional(), placeName: str(80).optional(), placeArea: str(80).optional(), mapUrl: httpsUrl.optional(), platform: z.enum(['Zoom', 'Google Meet', 'Microsoft Teams', 'YouTube Live']).optional(), liveUrl: httpsUrl.optional(),
  sendBy: z.enum(['self', 'hayyak']).optional(), sendChannels: z.array(z.enum(['link', 'message', 'email', 'whatsapp'])).max(4).optional(), message: str(1200).optional(), scheduledAt: when.nullable().optional(), reminders: reminders.optional(),
  cap: z.number().int().min(1).max(100000).nullable().optional(), closesAt: when.nullable().optional(),
});
const guestItem = z.object({ name: str(80, 2, 'اكتب اسم المدعو'), title: str(60).optional(), phone: phone.optional(), email: optEmail.optional(), seal: z.enum(SEAL_NAMES as [string, ...string[]]).optional(), note: str(200).optional() })
  .refine((g) => g.phone || g.email, 'اكتب رقم الجوال أو الإيميل');

user('POST', '/invitations', { role: 'manager', body: draft }, async (c) => {
  const i = await inv.createDraft(c.me.org.id, c.me.user.id);
  if (Object.keys(c.body).length) await inv.saveDraft(c.me.org.id, i.id, c.body);
  return { id: i.id, slug: i.slug };
});
user('PATCH', '/invitations/:id', { role: 'manager', body: draft }, async (c) => { await inv.saveDraft(c.me.org.id, uuid(c.params.id), c.body); });
user('DELETE', '/invitations/:id', { role: 'manager' }, async (c) => { await inv.removeDraft(c.me.org.id, uuid(c.params.id)); });
user('POST', '/invitations/:id/publish', { role: 'manager', rate: [20, 60] }, async (c) => {
  const r = await inv.publish(c.me.org.id, uuid(c.params.id));
  await audit({ type: 'user', id: c.me.user.id, name: c.me.user.name, ip: c.ip }, 'أرسل دعوة', { detail: `${r.count}`, orgId: c.me.org.id });
  return r;
});
user('POST', '/invitations/:id/duplicate', { role: 'manager' }, async (c) => ({ id: (await inv.duplicate(c.me.org.id, c.me.user.id, uuid(c.params.id))).id }));
user('POST', '/invitations/:id/event', { role: 'manager', body: z.object({ startsAt: when, placeName: str(80), placeArea: str(80).optional(), mapUrl: httpsUrl.optional(), liveUrl: httpsUrl.optional() }) }, async (c) => inv.updateEvent(c.me.org.id, uuid(c.params.id), c.body));
user('POST', '/invitations/:id/reminders', { role: 'manager', body: z.object({ day: z.boolean(), hours: z.boolean() }) }, async (c) => {
  const i = await inv.own(c.me.org.id, uuid(c.params.id));
  await (await db()).update(invitations).set({ reminders: { ...i.reminders, ...c.body, by: (c.body.day || c.body.hours) && i.reminders.by === 'none' ? 'self' : i.reminders.by } }).where(eq(invitations.id, i.id));
});
user('POST', '/invitations/:id/remind', { role: 'manager' }, async (c) => inv.remindNow(c.me.org.id, uuid(c.params.id)));
user('GET', '/invitations/:id/guests', {}, async (c) => { const i = await inv.own(c.me.org.id, uuid(c.params.id)); return { rows: await guestRows(c.me.org.id, i.id) }; });
user('GET', '/invitations/:id/links', { role: 'manager' }, async (c) => ({ rows: await personalLinks(c.me.org.id, uuid(c.params.id)) }));
user('POST', '/invitations/:id/guests', { role: 'manager', body: z.object({ items: z.array(guestItem).min(1).max(MAX_GUESTS), source: z.enum(['manual', 'import']) }) }, async (c) => {
  const r = await inv.addGuests(c.me.org.id, uuid(c.params.id), c.body.items, c.body.source);
  return { added: r.added, skipped: r.skipped, rows: r.rows.map((g) => ({ id: g.id, n: g.name, p: g.phone, e: g.email, s: g.seal })) };
});
user('DELETE', '/invitations/:id/guests/:gid', { role: 'manager' }, async (c) => { await inv.removeGuest(c.me.org.id, uuid(c.params.id), uuid(c.params.gid)); });

/* ---------- attendance ---------- */
user('POST', '/invitations/:id/attendance/open', { role: 'manager', body: z.object({ mode: z.enum(['person', 'online']), minutes: z.union([z.literal(5), z.literal(10), z.literal(15)]), second: z.boolean(), autoCert: z.boolean() }) }, async (c) => { await att.openSession(c.me.org.id, uuid(c.params.id), c.body); });
user('POST', '/invitations/:id/attendance/extend', { role: 'manager' }, async (c) => { await att.extendSession(c.me.org.id, uuid(c.params.id)); });
user('POST', '/invitations/:id/attendance/close', { role: 'manager' }, async (c) => { await att.closeSession(c.me.org.id, uuid(c.params.id)); });
user('POST', '/invitations/:id/attendance/mark', { role: 'manager', body: z.object({ guestId: uid }) }, async (c) => { await att.markManual(c.me.org.id, uuid(c.params.id), c.body.guestId); });
user('POST', '/invitations/:id/attendance/walkin', { role: 'manager', body: z.object({ name: str(80, 2, 'اكتب الاسم') }) }, async (c) => { await att.addWalkin(c.me.org.id, uuid(c.params.id), c.body.name); });
user('POST', '/invitations/:id/thanks', { role: 'manager', body: z.object({ group: z.number().int().min(0).max(3), text: str(600, 3, 'اكتب الرسالة'), withCert: z.boolean() }) }, async (c) => ({ count: await att.postThanks(c.me.org.id, uuid(c.params.id), c.body.group, c.body.text, c.body.withCert) }));

/* ---------- certificates ---------- */
const certCfg = z.object({
  tpl: z.number().int().min(0).max(2), color: z.number().int().min(0).max(3), title: z.number().int().min(0).max(2), org: str(80), orgSub: str(80), certLine: str(160), para: str(700), lang: z.enum(['ar', 'bi']), enLine: str(160), enPara: str(700),
  signer: str(80), role: str(80), extra: z.boolean(), extraL: str(40), when: z.number().int().min(0).max(1), logo: z.string().max(80), sigImg: z.string().max(80), bg: z.string().max(80), fields: z.object({ ev: z.boolean(), dt: z.boolean(), du: z.boolean() }),
  px: z.number().min(15).max(85), py: z.number().min(15).max(85), al: z.number().int().min(0).max(2), sz: z.number().int().min(0).max(2), tc: z.number().int().min(0).max(3),
});
user('POST', '/invitations/:id/certificate', { role: 'manager', body: certCfg }, async (c) => {
  const o = c.me.org.id;
  await assets.ownsAsset(o, c.body.logo, ['logo']);
  await assets.ownsAsset(o, c.body.sigImg, ['signature']);
  await assets.ownsAsset(o, c.body.bg, ['certbg']);
  await att.saveCert(o, uuid(c.params.id), c.body);
});
user('POST', '/invitations/:id/certificate/issue', { role: 'manager' }, async (c) => ({ count: await att.issueNow(c.me.org.id, uuid(c.params.id)) }));
user('POST', '/invitations/:id/names/:rid', { role: 'manager', body: z.object({ ok: z.boolean() }) }, async (c) => { await att.decideName(c.me.org.id, uuid(c.params.id), uuid(c.params.rid), c.body.ok); });

/* ---------- credit orders and customisation requests ---------- */
// Prices come from the server. Whatever the browser shows or sends is never used.
const orderBody = { count: z.number().int().min(1).max(MAX_GUESTS), channel: z.enum(['self', 'email', 'whatsapp']), services: z.array(uid).max(10), code: str(24).optional() };
pub('GET', '/pricing', { rate: [120, 60] }, async () => price.publicPricing());
user('POST', '/orders/quote', { role: 'manager', body: z.object(orderBody) }, async (c) => price.quoteFor(c.me.org.id, { ...c.body, code: c.body.code || '' }, c.ip));
user('POST', '/orders', { role: 'manager', body: z.object({ ...orderBody, contact: z.object({ name: str(80), email: optEmail, phone }) }) }, async (c) => {
  await limit(`order:${c.me.org.id}`, 10, 86400);
  const { contact, code, ...o } = c.body;
  return price.placeOrder({ orgId: c.me.org.id, orgName: c.me.org.name, userId: c.me.user.id, email: c.me.user.email }, { ...o, code: code || '' }, contact);
});
user('POST', '/requests', { role: 'manager', body: z.object({ title: str(80, 2, 'اختر نوع التخصيص'), description: str(1500), via: z.enum(['واتساب', 'إيميل']), phone: phone.optional(), email: optEmail.optional() }) }, async (c) => {
  await limit(`request:${c.me.org.id}`, 10, 86400);
  if (!(await balance(c.me.org.id)).paid) throw bad('التخصيص متاح مع الرصيد المدفوع');
  await (await db()).insert(customRequests).values({ orgId: c.me.org.id, userId: c.me.user.id, title: c.body.title, description: c.body.description, contactVia: c.body.via, contactPhone: c.body.phone || c.me.org.phone, contactEmail: c.body.email || c.me.org.contactEmail || c.me.user.email });
});
user('POST', '/requests/:id/:answer', { role: 'manager' }, async (c) => {
  const ok = c.params.answer === 'approve';
  if (!ok && c.params.answer !== 'change') throw notFound();
  const d = await db();
  const [r] = await d.update(customRequests).set({ stage: ok ? 5 : 3, updatedAt: new Date() }).where(and(eq(customRequests.id, uuid(c.params.id)), eq(customRequests.orgId, c.me.org.id), eq(customRequests.stage, 4))).returning();
  if (!r) throw notFound();
  if (ok && r.designId) await d.update(customDesigns).set({ approved: true }).where(and(eq(customDesigns.id, r.designId), eq(customDesigns.orgId, c.me.org.id)));
});

/* ---------- guests: reached with the personal link only ---------- */
const GUEST_COOKIE = (slug: string) => `hyg_${slug}`;
pub('POST', '/g/:token/open', { rate: [120, 60] }, async (c) => {
  const { inv: i, g } = await guest.guestOnly(c.params.token!);
  await guest.opened(g);
  // Lets the QR on the projector recognise this phone. Readable by the server only.
  const secure = appUrl().startsWith('https://');
  (await cookies()).set(GUEST_COOKIE(i.slug), g.token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 60 * 86400 });
});
pub('POST', '/g/:token/rsvp', { body: z.object({ answer: z.enum(['yes', 'no', 'pending']) }), rate: [60, 60] }, async (c) => {
  const { inv: i, g } = await guest.guestOnly(c.params.token!);
  await limit(`rsvp:${g.id}`, 20, 600);
  await guest.rsvp(i, g, c.body.answer);
});
pub('POST', '/g/:token/profile', { body: z.object({ certNameAr: str(80, 2, 'اكتب اسمك').optional(), certNameEn: str(80).optional(), extraValue: str(40).optional() }), rate: [60, 60] }, async (c) => {
  const { inv: i, g } = await guest.guestOnly(c.params.token!);
  await guest.profile(i, g, c.body);
});
pub('POST', '/g/:token/attend', { body: z.object({ code: code4 }), rate: [60, 60] }, async (c) => {
  const { inv: i, g } = await guest.guestOnly(c.params.token!);
  return att.attendByCode(i, g, c.body.code);
});
pub('POST', '/g/:token/name', { body: z.object({ name: str(80, 2, 'اكتب اسمك') }), rate: [20, 60] }, async (c) => {
  const { inv: i, g } = await guest.guestOnly(c.params.token!);
  await guest.askNameChange(i, g, c.body.name);
});
pub('POST', '/g/:token/downloaded', { rate: [60, 60] }, async (c) => { const { g } = await guest.guestOnly(c.params.token!); await guest.downloaded(g); });
pub('POST', '/g/:token/saved', { rate: [60, 60] }, async (c) => {
  const { g } = await guest.guestOnly(c.params.token!);
  await (await db()).update(guests).set({ savedVideo: true }).where(eq(guests.id, g.id));
});
pub('POST', '/i/:slug/register', { body: z.object({ name: str(80, 2, 'اكتب اسمك'), email }), rate: [20, 600] }, async (c) => {
  const i = await guest.bySlug(c.params.slug!);
  if (!i) throw notFound();
  return guest.register(i, c.body, c.ip);
});
pub('POST', '/a/:qr', { rate: [30, 60] }, async (c) => {
  const s = await att.sessionByQr(c.params.qr!);
  if (!s) throw notFound();
  const tok = (await cookies()).get(GUEST_COOKIE(s.i.slug))?.value;
  if (!tok) throw new AppError(409, 'افتح رابط دعوتك من هذا الجوال أول', 'no_guest');
  const { inv: i, g } = await guest.guestOnly(tok);
  if (i.id !== s.i.id) throw notFound();
  const r = await att.attendByQr(i, g, c.params.qr!);
  return { ...r, slug: i.slug, token: g.token };
});

/* ---------- Studio ---------- */
pub('POST', '/studio/login', { body: z.object({ email }), rate: [20, 600] }, async (c) => { await auth.studioStart(c.body.email, meta(c)); });
pub('POST', '/studio/verify', { body: z.object({ email, code: code6 }), rate: [30, 600] }, async (c) => auth.studioVerify(c.body.email, c.body.code, meta(c)));
pub('POST', '/studio/mfa', { body: z.object({ code: str(20, 6) }), rate: [30, 600] }, async (c) => auth.studioMfa(c.body.code, meta(c)));
pub('POST', '/studio/logout', {}, async () => { await endSession('staff'); });
studio('POST', '/studio/sends/:id/advance', 'sends', {}, async (c) => st.advanceSend(c.me, uuid(c.params.id), c.ip));
studio('POST', '/studio/sends/:id/recipients', 'sends', {}, async (c) => ({ rows: await st.recipients(c.me, uuid(c.params.id), c.ip) }));
studio('PATCH', '/studio/requests/:id', 'requests', { body: z.object({ stage: z.number().int().min(0).max(5).optional(), price: str(40).optional(), message: str(600).optional() }) }, async (c) => { await st.updateRequest(c.me, uuid(c.params.id), c.body, c.ip); });
const assetRef = z.string().regex(/^(\/api\/assets\/[0-9a-f-]{36})?$/);
const designData = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('seal'), data: z.object({ text: str(8), wax: hex, logo: assetRef }) }),
  z.object({ kind: z.literal('colors'), data: z.object({ pattern: z.enum(PATTERNS), c1: hex, c2: hex, c3: hex }) }),
  z.object({ kind: z.literal('loading'), data: z.object({ bg: hex, logo: assetRef }) }),
]);
studio('POST', '/studio/requests/:id/deliver', 'design', { body: z.object({ name: str(40, 1, 'اكتب اسم التصميم'), scope: z.enum(['org', 'public']), final: z.boolean(), design: designData }) }, async (c) => {
  await st.deliver(c.me, uuid(c.params.id), { kind: c.body.design.kind, data: c.body.design.data, name: c.body.name, scope: c.body.scope, final: c.body.final }, c.ip);
});
studio('POST', '/studio/patterns', 'design', { body: z.object({ name: str(40, 2, 'اكتب اسم النمط'), scope: z.enum(['org', 'public']), orgId: uid.optional(), data: z.object({ e: z.number().int().min(0).max(4), c1: hex, c2: hex, c3: hex, tx: hex, den: z.number().min(10).max(100), spd: z.number().min(10).max(100), logo: assetRef }) }) }, async (c) => { await st.createPattern(c.me, c.body, c.ip); });
studio('POST', '/studio/services', 'services', { body: z.object({ name: str(60, 2, 'اكتب اسم الخدمة'), description: str(120), price: z.number().int().min(0).max(100000).nullable() }) }, async (c) => { await st.saveService(c.me, null, c.body, c.ip); });
studio('PATCH', '/studio/services/:id', 'services', { body: z.object({ price: z.number().int().min(0).max(100000).nullable().optional(), available: z.boolean().optional() }) }, async (c) => { await st.saveService(c.me, uuid(c.params.id), c.body, c.ip); });
studio('GET', '/studio/customers', 'users', {}, async (c) => ({ rows: await st.customers((c.query.get('q') || '').slice(0, 60)) }));
studio('POST', '/studio/customers/:id/status', 'users', { body: z.object({ status: z.enum(['active', 'suspended']), reason: str(200, 3, 'اكتب السبب') }) }, async (c) => { await st.setOrgStatus(c.me, uuid(c.params.id), c.body.status, c.body.reason, c.ip); });
studio('POST', '/studio/customers/:id/credit', 'credit', { body: z.object({ count: z.number().int().min(1).max(1000), channel: z.enum(['self', 'email', 'whatsapp']), reason: str(200, 3, 'اكتب السبب') }) }, async (c) => { await st.grantCredit(c.me, { orgId: uuid(c.params.id), ...c.body }, c.ip); });
studio('POST', '/studio/orders/:id', 'sales', { body: z.object({ ok: z.boolean() }) }, async (c) => { await st.decideOrder(c.me, uuid(c.params.id), c.body.ok, c.ip); });
studio('POST', '/studio/team', 'team', { body: z.object({ name: str(60, 2, 'اكتب الاسم'), email, role: z.enum(['founder', 'support', 'design']) }) }, async (c) => { await st.addMember(c.me, c.body, c.ip); });
studio('POST', '/studio/team/:id/remove', 'team', {}, async (c) => { await st.removeMember(c.me, uuid(c.params.id), c.ip); });
studio('POST', '/studio/team/:id/reset', 'team', {}, async (c) => { await st.resetMember(c.me, uuid(c.params.id), c.ip); });

/* prices, discounts, analytics, ready designs, trial workspaces */
const who = (c: { me: StaffCtx; ip: string }) => ({ type: 'staff' as const, id: c.me.staff.id, name: c.me.staff.name, ip: c.ip });
studio('POST', '/studio/pricing', 'pricing', { body: price.pricingSchema }, async (c) => { await price.savePricing(who(c), c.body); });
studio('POST', '/studio/discounts', 'pricing', { body: price.discountSchema }, async (c) => { await price.addDiscount(who(c), c.body); });
studio('PATCH', '/studio/discounts/:id', 'pricing', { body: z.object({ active: z.boolean() }) }, async (c) => { await price.toggleDiscount(who(c), uuid(c.params.id), c.body.active); });
studio('POST', '/studio/customers/:id/discount', 'pricing', { body: z.object({ pct: z.number().int().min(0).max(100), reason: str(200, 3, 'اكتب السبب') }) }, async (c) => { await price.setOrgDiscount(who(c), uuid(c.params.id), c.body.pct, c.body.reason); });
studio('POST', '/studio/customers/:id/test', 'team', { body: z.object({ test: z.boolean() }) }, async (c) => { await st.setTest(c.me, uuid(c.params.id), c.body.test, c.ip); });
studio('POST', '/studio/customers/:id/wipe', 'team', { body: z.object({ name: str(120) }) }, async (c) => { await st.wipeTest(c.me, uuid(c.params.id), c.body.name, c.ip); });
studio('GET', '/studio/analytics', 'analytics', {}, async (c) => analytics(({ 7: 7, 30: 30, 90: 90 } as const)[Number(c.query.get('days')) as 7 | 30 | 90] ?? 30, can(c.me.staff.role, 'sales')));
studio('POST', '/studio/designs', 'design', { body: z.object({ name: str(40, 1, 'اكتب اسم التصميم'), orgId: uid.nullable(), design: designData }) }, async (c) => { await st.createDesign(c.me, { name: c.body.name, orgId: c.body.orgId, kind: c.body.design.kind, data: c.body.design.data }, c.ip); });
studio('PATCH', '/studio/designs/:id', 'design', { body: z.object({ on: z.boolean() }) }, async (c) => { await st.toggleDesign(c.me, uuid(c.params.id), c.body.on, c.ip); });

/* ---------- scheduler hook ---------- */
pub('GET', '/cron/tick', {}, async (c) => {
  const want = process.env.CRON_SECRET || '';
  const got = (c.req.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (want.length < 16 || !safeEqual(want, got)) throw notFound();
  return tick();
});
pub('GET', '/health', {}, async () => {
  await (await db()).execute(sql`select 1`);
  return { ok: true };
});
