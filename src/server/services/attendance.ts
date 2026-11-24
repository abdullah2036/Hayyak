import 'server-only';
import { and, asc, desc, eq, gt, inArray, isNull, lte, sql } from 'drizzle-orm';
import { THANK_GROUPS } from '@/lib/constants';
import { durationText, fullDate } from '@/lib/dates';
import { db, attendance, attendanceSessions, certConfigs, certificates, guests, invitations, nameRequests, orgs, thankNotes, type DB } from '../db';
import { digits, safeEqual, token } from '../lib/crypto';
import { AppError, bad, limit, notFound } from '../lib/core';
import { send } from '../lib/mail';
import { guestsOf, linkOf, log, own, type Guest, type Inv } from './invitations';

export type Sess = typeof attendanceSessions.$inferSelect;

/* ---------- certificate design ---------- */

export type CertConfig = {
  tpl: number; color: number; title: number; org: string; orgSub: string; certLine: string; para: string; lang: 'ar' | 'bi'; enLine: string; enPara: string;
  signer: string; role: string; extra: boolean; extraL: string; when: number; logo: string; sigImg: string; bg: string; fields: { ev: boolean; dt: boolean; du: boolean };
  px: number; py: number; al: number; sz: number; tc: number;
};

export function defaultCert(inv: Inv, org: { name: string; logoAssetId: string | null }): CertConfig {
  const dur = durationText(inv.durationMin);
  return {
    tpl: 0, color: 0, title: 0, org: org.name, orgSub: '', lang: 'ar', certLine: `يشهد ${org.name} بأنّ`,
    para: `حضر فعالية «${inv.title}»${inv.startsAt ? ` يوم ${fullDate(inv.startsAt)}م` : ''} ومدتها ${dur}، ونتقدّم إليه بخالص الشكر والتقدير، متمنّين له دوام التوفيق والنجاح`,
    enLine: `${org.name} certifies that`, enPara: `attended “${inv.latin || inv.title}”${inv.startsAt ? ` on ${new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(inv.startsAt)}` : ''}. With sincere thanks and appreciation.`,
    signer: '', role: '', extra: false, extraL: 'الرقم الجامعي', when: 0, logo: org.logoAssetId ? `/api/assets/${org.logoAssetId}` : '', sigImg: '', bg: '', fields: { ev: true, dt: true, du: false }, px: 50, py: 50, al: 1, sz: 1, tc: 0,
  };
}

export async function certFor(inv: Inv) {
  const d = await db();
  const [org] = await d.select().from(orgs).where(eq(orgs.id, inv.orgId));
  const [row] = await d.select().from(certConfigs).where(eq(certConfigs.invitationId, inv.id));
  const base = defaultCert(inv, org!);
  return { config: { ...base, ...((row?.config as Partial<CertConfig>) || {}) }, issuedAt: row?.issuedAt ?? null, saved: Boolean(row), org: org! };
}

export async function saveCert(orgId: string, id: string, c: CertConfig) {
  const inv = await own(orgId, id);
  const d = await db();
  await d.insert(certConfigs).values({ invitationId: inv.id, orgId, config: c }).onConflictDoUpdate({ target: certConfigs.invitationId, set: { config: c, updatedAt: new Date() } });
}

/** Issues certificates to everyone who attended and does not have one yet. Safe to call more than once. */
export async function issueCerts(inv: Inv, kind: 'attend' | 'thanks' = 'attend', only?: string[]) {
  const d = await db();
  const rows = await d
    .select({ g: guests })
    .from(attendance)
    .innerJoin(guests, eq(guests.id, attendance.guestId))
    .where(and(eq(attendance.invitationId, inv.id), eq(attendance.complete, true)));
  let list = rows.map((r) => r.g);
  if (kind === 'thanks') list = (await guestsOf(inv.orgId, inv.id)).filter((g) => only?.includes(g.id));
  if (list.length) {
    await d
      .insert(certificates)
      .values(list.map((g) => ({ code: token(14), orgId: inv.orgId, invitationId: inv.id, guestId: g.id, kind, nameAr: g.certNameAr || g.name, nameEn: g.certNameEn })))
      .onConflictDoNothing();
  }
  if (kind === 'attend') {
    const { config } = await certFor(inv);
    await d.insert(certConfigs).values({ invitationId: inv.id, orgId: inv.orgId, config, issuedAt: new Date() }).onConflictDoUpdate({ target: certConfigs.invitationId, set: { issuedAt: sql`coalesce(${certConfigs.issuedAt}, now())` } });
  }
  return list.length;
}

async function tellCertificates(inv: Inv) {
  const d = await db();
  const [org] = await d.select().from(orgs).where(eq(orgs.id, inv.orgId));
  const rows = await d.select({ g: guests }).from(certificates).innerJoin(guests, eq(guests.id, certificates.guestId)).where(and(eq(certificates.invitationId, inv.id), eq(certificates.kind, 'attend')));
  for (const { g } of rows) if (g.email) await send({ to: g.email, guestId: g.id, fromName: org!.name, subject: `شهادتك من «${inv.title}»`, title: `حيّاك يا ${g.name.split(' ')[0]}`, lines: ['شهادتك جاهزة، تلقاها في نفس رابط دعوتك.'], button: { label: 'افتح شهادتك', url: linkOf(inv, g) }, note: `من ${org!.name} عبر حيّــاك` });
}

export async function issueNow(orgId: string, id: string) {
  const inv = await own(orgId, id);
  const d = await db();
  const [cur] = await d.select().from(certConfigs).where(eq(certConfigs.invitationId, id));
  const n = await issueCerts(inv);
  if (!n) throw bad('ما فيه حضور مسجّل للحين');
  if (!cur?.issuedAt) {
    await log(d, id, 'طلعت الشهادات', `${n} شهادة`, 'main');
    await tellCertificates(inv);
  }
  return n;
}

/* ---------- attendance code ---------- */

/** Closes sessions whose time is over and issues certificates. Called by the scheduler and on every read. */
export async function settle(invitationId?: string) {
  const d = await db();
  const due = await d
    .update(attendanceSessions)
    .set({ closedAt: sql`${attendanceSessions.closesAt}` })
    .where(and(isNull(attendanceSessions.closedAt), lte(attendanceSessions.closesAt, new Date()), invitationId ? eq(attendanceSessions.invitationId, invitationId) : undefined))
    .returning();
  for (const s of due) await afterClose(s);
}
async function afterClose(s: Sess) {
  const d = await db();
  const [inv] = await d.select().from(invitations).where(eq(invitations.id, s.invitationId));
  if (!inv) return;
  const [{ n } = { n: 0 }] = await d.select({ n: sql<number>`count(*) filter (where ${attendance.complete})::int` }).from(attendance).where(eq(attendance.invitationId, inv.id));
  if (s.phase === 'start') {
    await log(d, inv.id, 'انسكّر كود البداية', '', 'info');
    return;
  }
  await log(d, inv.id, 'انسكّر تسجيل الحضور', `${n} حضروا`, 'main');
  const { config, issuedAt } = await certFor(inv);
  if (s.autoCert && config.when === 0 && n > 0) {
    await issueCerts(inv);
    if (!issuedAt) await tellCertificates(inv);
  }
}

export async function sessionsOf(invitationId: string) {
  await settle(invitationId);
  const d = await db();
  return d.select().from(attendanceSessions).where(eq(attendanceSessions.invitationId, invitationId)).orderBy(desc(attendanceSessions.openedAt));
}
export const isOpen = (s: Sess) => !s.closedAt && s.closesAt > new Date();

export async function openSession(orgId: string, id: string, o: { mode: 'person' | 'online'; minutes: number; second: boolean; autoCert: boolean }) {
  const inv = await own(orgId, id);
  if (inv.status === 'draft' || inv.status === 'scheduled') throw bad('أرسل الدعوة أول');
  const list = await sessionsOf(id);
  if (list.some(isOpen)) throw bad('التسجيل مفتوح الحين');
  const startDone = list.some((s) => s.phase === 'start');
  const phase = o.second && !startDone && !list.some((s) => s.phase === 'end') ? 'start' : 'end';
  const d = await db();
  const [s] = await d
    .insert(attendanceSessions)
    .values({ orgId, invitationId: id, phase, mode: o.mode, code: digits(4), qrToken: token(18), closesAt: new Date(Date.now() + o.minutes * 60_000), autoCert: o.autoCert, final: phase === 'end' })
    .returning();
  await log(d, id, phase === 'start' ? 'انفتح كود البداية' : 'انفتح تسجيل الحضور', `${o.minutes} دقايق`, 'main');
  return s!;
}
async function current(orgId: string, id: string) {
  await own(orgId, id);
  const s = (await sessionsOf(id)).find(isOpen);
  if (!s) throw bad('التسجيل مقفل');
  return s;
}
export async function extendSession(orgId: string, id: string) {
  const s = await current(orgId, id);
  if (s.closesAt.getTime() - s.openedAt.getTime() > 3 * 36e5) throw bad('وصلت أقصى مدة للتمديد');
  const d = await db();
  await d.update(attendanceSessions).set({ closesAt: new Date(s.closesAt.getTime() + 5 * 60_000) }).where(eq(attendanceSessions.id, s.id));
}
export async function closeSession(orgId: string, id: string) {
  const s = await current(orgId, id);
  const d = await db();
  const r = await d.update(attendanceSessions).set({ closedAt: new Date(), closesAt: new Date() }).where(and(eq(attendanceSessions.id, s.id), isNull(attendanceSessions.closedAt))).returning();
  if (r[0]) await afterClose(r[0]);
}

/** Writes one person's attendance. With two codes, the end code only completes people who also entered the first one. */
async function record(inv: Inv, g: Guest, s: Sess | null, method: 'code' | 'qr' | 'manual') {
  const d = await db();
  const now = new Date();
  if (s?.phase === 'start') {
    await d.insert(attendance).values({ orgId: inv.orgId, invitationId: inv.id, guestId: g.id, method, startAt: now, complete: false }).onConflictDoNothing();
    return { partial: true };
  }
  let complete = true;
  if (s) {
    const first = await d.select({ id: attendanceSessions.id }).from(attendanceSessions).where(and(eq(attendanceSessions.invitationId, inv.id), eq(attendanceSessions.phase, 'start')));
    if (first.length) {
      const [a] = await d.select().from(attendance).where(and(eq(attendance.invitationId, inv.id), eq(attendance.guestId, g.id)));
      complete = Boolean(a?.startAt) || Boolean(a?.complete);
    }
  }
  if (!complete) throw new AppError(409, 'ما سجّلت في كود البداية، كلّم المنظّم يسجّل حضورك', 'no_start');
  await d
    .insert(attendance)
    .values({ orgId: inv.orgId, invitationId: inv.id, guestId: g.id, method, at: now, complete: true })
    .onConflictDoUpdate({ target: [attendance.invitationId, attendance.guestId], set: { complete: true, at: sql`case when ${attendance.complete} then ${attendance.at} else now() end`, method: sql`case when ${attendance.complete} then ${attendance.method} else ${method} end` } });
  const [cfg] = await d.select().from(certConfigs).where(eq(certConfigs.invitationId, inv.id));
  if (cfg?.issuedAt) await issueCerts(inv); // late additions get their certificate too
  return { partial: false };
}

/** A four digit code can be guessed, so tries are limited per guest and per code. */
export async function attendByCode(inv: Inv, g: Guest, code: string) {
  await limit(`att:${g.id}`, 6, 300);
  const s = (await sessionsOf(inv.id)).find(isOpen);
  if (!s) throw new AppError(409, 'التسجيل مقفل الحين', 'closed');
  if (!safeEqual(s.code, code)) {
    await limit(`attbad:${s.id}`, 300, 900);
    throw new AppError(400, 'الكود غلط، تأكد منه وجرّب مرة ثانية', 'bad_code');
  }
  return record(inv, g, s, 'code');
}
export async function attendByQr(inv: Inv, g: Guest, qrToken: string) {
  const s = (await sessionsOf(inv.id)).find(isOpen);
  if (!s) throw new AppError(409, 'التسجيل مقفل الحين', 'closed');
  if (!safeEqual(s.qrToken, qrToken)) throw new AppError(400, 'الباركود غير صحيح', 'bad_code');
  return record(inv, g, s, 'qr');
}
export async function sessionByQr(qrToken: string) {
  const d = await db();
  const [r] = await d.select({ s: attendanceSessions, i: invitations }).from(attendanceSessions).innerJoin(invitations, eq(invitations.id, attendanceSessions.invitationId)).where(eq(attendanceSessions.qrToken, qrToken));
  return r ?? null;
}
export async function markManual(orgId: string, id: string, guestId: string) {
  const inv = await own(orgId, id);
  const d = await db();
  const [g] = await d.select().from(guests).where(and(eq(guests.id, guestId), eq(guests.invitationId, id)));
  if (!g) throw notFound();
  return record(inv, g, null, 'manual');
}
export async function addWalkin(orgId: string, id: string, name: string) {
  const inv = await own(orgId, id);
  if (!(await sessionsOf(id)).length) throw bad('افتح تسجيل الحضور أول');
  await limit(`walk:${id}`, 200, 3600);
  const d = await db();
  const [g] = await d.insert(guests).values({ orgId, invitationId: id, token: token(16), name, certNameAr: name, seal: 'ضيف', source: 'walkin' }).returning();
  await record(inv, g!, null, 'manual');
}

/* ---------- name fixes and thank-you notes ---------- */

export async function decideName(orgId: string, id: string, reqId: string, ok: boolean) {
  const inv = await own(orgId, id);
  const d = await db();
  await d.transaction(async (t) => {
    const tx = t as unknown as DB;
    const [r] = await tx.update(nameRequests).set({ status: ok ? 'ok' : 'no', decidedAt: new Date() }).where(and(eq(nameRequests.id, reqId), eq(nameRequests.invitationId, inv.id), eq(nameRequests.status, 'pending'))).returning();
    if (!r) throw notFound();
    if (ok) {
      await tx.update(guests).set({ certNameAr: r.toName }).where(eq(guests.id, r.guestId));
      await tx.update(certificates).set({ nameAr: r.toName }).where(and(eq(certificates.guestId, r.guestId), eq(certificates.invitationId, inv.id)));
    }
  });
}
export async function nameRequestsOf(invitationId: string) {
  const d = await db();
  return d.select().from(nameRequests).where(eq(nameRequests.invitationId, invitationId)).orderBy(asc(nameRequests.createdAt)).limit(200);
}

export async function thankTargets(inv: Inv) {
  const d = await db();
  const all = await guestsOf(inv.orgId, inv.id);
  const att = new Set((await d.select({ id: attendance.guestId }).from(attendance).where(and(eq(attendance.invitationId, inv.id), eq(attendance.complete, true)))).map((r) => r.id));
  return THANK_GROUPS.map((g) => all.filter((x) => (g.seals ? g.seals.includes(x.seal) : att.has(x.id))));
}
export async function postThanks(orgId: string, id: string, group: number, text: string, withCert: boolean) {
  const inv = await own(orgId, id);
  if (inv.status === 'draft' || inv.status === 'scheduled') throw bad('أرسل الدعوة أول');
  const people = (await thankTargets(inv))[group];
  if (!people?.length) throw bad('ما فيه أحد في هذي الفئة');
  const d = await db();
  const prev = await d.select().from(thankNotes).where(and(eq(thankNotes.invitationId, id), eq(thankNotes.group, group)));
  await d.insert(thankNotes).values({ invitationId: id, group, text, withCert }).onConflictDoUpdate({ target: [thankNotes.invitationId, thankNotes.group], set: { text, withCert, postedAt: new Date() } });
  if (withCert && group > 0) await issueCerts(inv, 'thanks', people.map((p) => p.id));
  if (!prev.length) {
    const [org] = await d.select().from(orgs).where(eq(orgs.id, orgId));
    for (const g of people) if (g.email) await send({ to: g.email, guestId: g.id, fromName: org!.name, subject: `رسالة شكر من ${org!.name}`, title: `حيّاك يا ${g.name.split(' ')[0]}`, lines: [text], button: { label: 'افتح دعوتك', url: linkOf(inv, g) }, note: `من ${org!.name} عبر حيّــاك` });
    await log(d, id, 'انتشرت رسالة شكر', THANK_GROUPS[group]!.label, 'info');
  }
  return people.length;
}

export async function roster(inv: Inv) {
  const d = await db();
  const list = await guestsOf(inv.orgId, inv.id);
  const att = await d.select().from(attendance).where(eq(attendance.invitationId, inv.id));
  const by = new Map(att.map((a) => [a.guestId, a]));
  return list.map((g) => ({ g, a: by.get(g.id) ?? null }));
}

export async function certificatesOf(guestIds: string[]) {
  if (!guestIds.length) return [];
  const d = await db();
  return d.select().from(certificates).where(inArray(certificates.guestId, guestIds));
}
export async function openUntil(invitationId: string) {
  const d = await db();
  const [s] = await d.select().from(attendanceSessions).where(and(eq(attendanceSessions.invitationId, invitationId), isNull(attendanceSessions.closedAt), gt(attendanceSessions.closesAt, new Date())));
  return s ?? null;
}
