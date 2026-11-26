import 'server-only';
import { and, asc, desc, eq, inArray, isNull, ne, or, sql } from 'drizzle-orm';
import { MAX_GUESTS, PAID_SEALS, PHOTO_PATTERN, SEND_LEAD_HOURS } from '@/lib/constants';
import { time, weekdayDate } from '@/lib/dates';
import {
  db, assets, attendance, certificates, customDesigns, guests, invitationLog, invitations, orgs, sendRequests,
  type Channel, type DB, type InvStatus,
} from '../db';
import { token } from '../lib/crypto';
import { AppError, appUrl, bad, hostLabel, limit, notFound } from '../lib/core';
import { send } from '../lib/mail';
import { balance, spend } from './credit';

export type Inv = typeof invitations.$inferSelect;
export type Guest = typeof guests.$inferSelect;

/** Every read goes through here: an invitation is only visible to the workspace that owns it. */
export async function own(orgId: string, id: string): Promise<Inv> {
  const d = await db();
  const [r] = await d.select().from(invitations).where(and(eq(invitations.id, id), eq(invitations.orgId, orgId)));
  if (!r) throw notFound();
  return r;
}

export const endOf = (i: Pick<Inv, 'startsAt' | 'durationMin'>) => (i.startsAt ? new Date(i.startsAt.getTime() + i.durationMin * 60_000) : null);
export function liveStatus(i: Pick<Inv, 'status' | 'startsAt' | 'durationMin'>): InvStatus {
  const end = endOf(i);
  return i.status === 'sent' && end && end < new Date() ? 'ended' : i.status;
}
export const STATUS_AR: Record<InvStatus, string> = { draft: 'مسودة', scheduled: 'مجدولة', sent: 'مُرسلة', ended: 'انتهت' };

export const linkOf = (i: Pick<Inv, 'slug'>, g?: Pick<Guest, 'token'>) => `${appUrl()}/i/${i.slug}${g ? '/' + g.token : ''}`;
export const shortLink = (i: Pick<Inv, 'slug'>, g?: Pick<Guest, 'token'>) => `${hostLabel()}/i/${i.slug}${g ? '/' + g.token : ''}`;

export async function log(tx: DB, invitationId: string, text: string, detail = '', tone = 'info') {
  await tx.insert(invitationLog).values({ invitationId, text, detail, tone });
}

export type Stats = { sent: number; open: number; ok: number; no: number; pending: number };
export async function statsFor(ids: string[]): Promise<Record<string, Stats>> {
  const out: Record<string, Stats> = {};
  if (!ids.length) return out;
  const d = await db();
  const rows = await d
    .select({
      id: guests.invitationId,
      sent: sql<number>`count(*) filter (where ${guests.charged})::int`,
      open: sql<number>`count(*) filter (where ${guests.firstOpenedAt} is not null)::int`,
      ok: sql<number>`count(*) filter (where ${guests.status} = 'yes')::int`,
      no: sql<number>`count(*) filter (where ${guests.status} = 'no')::int`,
      pending: sql<number>`count(*) filter (where ${guests.charged} and ${guests.status} = 'pending')::int`,
    })
    .from(guests)
    .where(and(inArray(guests.invitationId, ids), ne(guests.source, 'walkin')))
    .groupBy(guests.invitationId);
  for (const r of rows) out[r.id] = { sent: r.sent, open: r.open, ok: r.ok, no: r.no, pending: r.pending };
  return out;
}
export const NOSTATS: Stats = { sent: 0, open: 0, ok: 0, no: 0, pending: 0 };

export async function list(orgId: string) {
  const d = await db();
  return d.select().from(invitations).where(eq(invitations.orgId, orgId)).orderBy(desc(invitations.createdAt)).limit(300);
}

/* ---------- drafting ---------- */

export async function createDraft(orgId: string, userId: string, patch: Partial<Inv> = {}) {
  await limit(`draft:${orgId}`, 60, 3600);
  const d = await db();
  const [r] = await d.insert(invitations).values({ ...patch, orgId, createdBy: userId, slug: token(7) }).returning();
  await log(d, r!.id, 'أُنشئت الدعوة', '', 'mute');
  return r!;
}

async function designVisible(orgId: string, id: string, kind: 'seal' | 'colors' | 'loading' | 'pattern') {
  const d = await db();
  const [r] = await d
    .select({ id: customDesigns.id })
    .from(customDesigns)
    .where(and(eq(customDesigns.id, id), eq(customDesigns.kind, kind), eq(customDesigns.approved, true), or(isNull(customDesigns.orgId), eq(customDesigns.orgId, orgId))));
  if (!r) throw bad('التصميم غير متاح');
}

export type DraftPatch = Partial<
  Pick<
    Inv,
    | 'audience' | 'pattern' | 'color' | 'seal' | 'photoAssetId' | 'title' | 'latin' | 'eventLabel' | 'startsAt' | 'durationMin' | 'online' | 'placeName' | 'placeArea' | 'mapUrl' | 'platform' | 'liveUrl'
    | 'sendBy' | 'sendChannels' | 'message' | 'scheduledAt' | 'reminders' | 'cap' | 'closesAt' | 'customPatternId' | 'customColorsId' | 'customSealId' | 'customLoadingId'
  >
>;

export async function saveDraft(orgId: string, id: string, p: DraftPatch) {
  const inv = await own(orgId, id);
  if (inv.status !== 'draft') throw bad('الدعوة أُرسلت، عدّلها من صفحة الدعوة');
  const d = await db();
  if (p.photoAssetId) {
    const [a] = await d.select({ id: assets.id }).from(assets).where(and(eq(assets.id, p.photoAssetId), eq(assets.orgId, orgId)));
    if (!a) throw bad('الصورة غير موجودة');
  }
  if (p.customPatternId) await designVisible(orgId, p.customPatternId, 'pattern');
  if (p.customColorsId) await designVisible(orgId, p.customColorsId, 'colors');
  if (p.customSealId) await designVisible(orgId, p.customSealId, 'seal');
  if (p.customLoadingId) await designVisible(orgId, p.customLoadingId, 'loading');
  const [r] = await d.update(invitations).set({ ...p, updatedAt: new Date() }).where(and(eq(invitations.id, id), eq(invitations.orgId, orgId))).returning();
  return r!;
}

export async function removeDraft(orgId: string, id: string) {
  const inv = await own(orgId, id);
  if (inv.status !== 'draft') throw bad('ما تقدر تحذف دعوة مُرسلة');
  const d = await db();
  await d.delete(invitations).where(and(eq(invitations.id, id), eq(invitations.orgId, orgId)));
}

export async function duplicate(orgId: string, userId: string, id: string) {
  const i = await own(orgId, id);
  return createDraft(orgId, userId, {
    audience: i.audience, pattern: i.pattern, color: i.color, seal: i.seal, photoAssetId: i.photoAssetId, title: i.title, latin: i.latin, eventLabel: i.eventLabel, durationMin: i.durationMin,
    online: i.online, placeName: i.placeName, placeArea: i.placeArea, mapUrl: i.mapUrl, platform: i.platform, customPatternId: i.customPatternId, customColorsId: i.customColorsId, customSealId: i.customSealId, customLoadingId: i.customLoadingId,
  });
}

/* ---------- guests ---------- */

export type GuestInput = { name: string; title?: string; phone?: string; email?: string; seal?: string; note?: string };
const need = (i: Inv): Channel => (i.sendBy === 'self' ? 'self' : i.sendChannels.includes('whatsapp') ? 'whatsapp' : 'email');

export async function guestsOf(orgId: string, invitationId: string) {
  const d = await db();
  return d.select().from(guests).where(and(eq(guests.invitationId, invitationId), eq(guests.orgId, orgId))).orderBy(asc(guests.createdAt), asc(guests.id)).limit(MAX_GUESTS + 200);
}

/** Adds people. On a draft nothing is charged; after sending, each new link is charged right away. */
export async function addGuests(orgId: string, invitationId: string, items: GuestInput[], source: 'manual' | 'import') {
  const inv = await own(orgId, invitationId);
  if (inv.audience === 'public' && inv.status === 'draft') throw bad('الدعوة العامة يسجّل فيها الضيوف بأنفسهم');
  if (liveStatus(inv) === 'ended') throw bad('المناسبة انتهت');
  const bal = await balance(orgId);
  const d = await db();
  return d.transaction(async (t) => {
    const tx = t as unknown as DB;
    await tx.select({ id: invitations.id }).from(invitations).where(eq(invitations.id, invitationId)).for('update');
    const cur = await tx.select({ phone: guests.phone, email: guests.email, name: guests.name }).from(guests).where(eq(guests.invitationId, invitationId));
    const seen = new Set(cur.map((g) => (g.phone || g.email || g.name).toLowerCase()));
    const fresh: GuestInput[] = [];
    for (const g of items) {
      const k = (g.phone || g.email || '').toLowerCase();
      if (!k || seen.has(k)) continue;
      seen.add(k);
      fresh.push(g);
    }
    if (cur.length + fresh.length > MAX_GUESTS) throw bad(`الحد الأعلى ${MAX_GUESTS} مدعو في الدعوة الوحدة`);
    if (!fresh.length) return { added: 0, skipped: items.length, rows: [] as Guest[] };
    const charge = inv.status !== 'draft';
    if (charge) await spend(tx, orgId, fresh.length, need(inv), 'إضافة مدعوين', invitationId);
    // One millisecond apart, so a list keeps the order it was imported in.
    const t0 = Date.now();
    const rows = await tx
      .insert(guests)
      .values(
        fresh.map((g, k) => ({
          createdAt: new Date(t0 + k), orgId, invitationId, token: token(16), name: g.name, title: g.title || '', phone: g.phone || '', email: g.email || '', note: g.note || '', source, charged: charge,
          seal: g.seal && !(PAID_SEALS.includes(g.seal) && !bal.paid) ? g.seal : inv.seal,
        })),
      )
      .returning();
    if (charge) {
      await log(tx, invitationId, `أُضيف ${rows.length} مدعو`, '', 'info');
      if (inv.status === 'sent' && inv.sendBy === 'hayyak') await openSendRequest(tx, inv, rows, 'invite');
    }
    return { added: rows.length, skipped: items.length - rows.length, rows };
  });
}

export async function removeGuest(orgId: string, invitationId: string, guestId: string) {
  const inv = await own(orgId, invitationId);
  const d = await db();
  const [g] = await d.select().from(guests).where(and(eq(guests.id, guestId), eq(guests.invitationId, invitationId), eq(guests.orgId, orgId)));
  if (!g) throw notFound();
  if (inv.status !== 'draft' && g.charged) throw bad('المدعو وصلته دعوته، ما تقدر تحذفه');
  await d.delete(guests).where(eq(guests.id, g.id));
}

/* ---------- sending ---------- */

async function openSendRequest(tx: DB, inv: Inv, rows: Guest[], kind: 'invite' | 'reminder') {
  const channels = (inv.sendChannels.filter((c) => c === 'email' || c === 'whatsapp') as Channel[]).filter(Boolean);
  const reach = rows.filter((g) => (channels.includes('email') && g.email) || (channels.includes('whatsapp') && g.phone));
  if (!reach.length) return 0;
  await tx.insert(sendRequests).values({ orgId: inv.orgId, invitationId: inv.id, kind, channels, count: reach.length });
  return reach.length;
}

export async function publish(orgId: string, id: string) {
  const inv = await own(orgId, id);
  if (inv.status !== 'draft') throw bad('الدعوة أُرسلت من قبل');
  const now = new Date();
  if (!inv.title) throw bad('اكتب عنوان المناسبة');
  if (!inv.startsAt) throw bad('حدد تاريخ المناسبة ووقتها');
  if (inv.startsAt <= now) throw bad('موعد المناسبة فات، عدّل التاريخ');
  if (!inv.online && !inv.placeName) throw bad('اكتب اسم المكان');
  if (inv.pattern === PHOTO_PATTERN && !inv.photoAssetId) throw bad('ارفع صورة الخلفية');
  const bal = await balance(orgId);
  if (PAID_SEALS.includes(inv.seal) && !bal.paid) throw bad('هذا الختم متاح مع الرصيد المدفوع');
  const when = inv.scheduledAt && inv.scheduledAt > now ? inv.scheduledAt : null;
  if (when && when >= inv.startsAt) throw bad('وقت الإرسال لازم يكون قبل المناسبة');
  const d = await db();

  if (inv.audience === 'public') {
    if (!inv.cap || inv.cap < 1) throw bad('حدد الحد الأقصى للتسجيل');
    if (inv.cap > bal.byChannel.self) throw new AppError(402, `الحد أكثر من المتبقي في رصيدك (${bal.byChannel.self})`, 'no_credit');
    await d.transaction(async (t) => {
      const tx = t as unknown as DB;
      const r = await tx.update(invitations).set({ status: when ? 'scheduled' : 'sent', sentAt: when ? null : now, updatedAt: now }).where(and(eq(invitations.id, id), eq(invitations.status, 'draft'))).returning({ id: invitations.id });
      if (!r.length) throw bad('الدعوة أُرسلت من قبل');
      await log(tx, id, when ? 'تمت جدولة نشر الدعوة العامة' : 'انتشر رابط الدعوة العامة', when ? `${weekdayDate(when)} · ${time(when)}` : '', 'main');
    });
    return { status: when ? 'scheduled' : 'sent', count: 0, request: false };
  }

  if (inv.sendBy === 'hayyak') {
    if (!inv.sendChannels.some((c) => c === 'email' || c === 'whatsapp')) throw bad('اختر الواتساب أو الإيميل');
    if (!bal.paid) throw new AppError(402, 'حيّــاك ترسلها عنك متاحة مع الرصيد المدفوع', 'no_credit');
    if (inv.startsAt.getTime() - now.getTime() < SEND_LEAD_HOURS * 36e5) throw bad('طلب الإرسال لازم يكون قبل المناسبة بـ 48 ساعة على الأقل');
  }
  return d.transaction(async (t) => {
    const tx = t as unknown as DB;
    const [locked] = await tx.select().from(invitations).where(and(eq(invitations.id, id), eq(invitations.orgId, orgId))).for('update');
    if (!locked || locked.status !== 'draft') throw bad('الدعوة أُرسلت من قبل');
    const rows = await tx.select().from(guests).where(eq(guests.invitationId, id));
    if (!rows.length) throw bad('أضف مدعو واحد على الأقل');
    if (inv.sendBy === 'hayyak') {
      const miss = rows.filter((g) => !((inv.sendChannels.includes('email') && g.email) || (inv.sendChannels.includes('whatsapp') && g.phone)));
      if (miss.length) throw bad(`${miss.length} مدعو بدون ${inv.sendChannels.includes('whatsapp') ? (inv.sendChannels.includes('email') ? 'جوال أو إيميل' : 'رقم جوال') : 'إيميل'}، كمّل بياناتهم أو احذفهم`);
    }
    await spend(tx, orgId, rows.length, need(inv), `دعوة «${inv.title}»`, id);
    await tx.update(guests).set({ charged: true, sentVia: inv.sendBy === 'self' ? 'رابط' : '' }).where(eq(guests.invitationId, id));
    const viaHayyak = inv.sendBy === 'hayyak';
    const status: InvStatus = viaHayyak || when ? 'scheduled' : 'sent';
    await tx.update(invitations).set({ status, sentAt: status === 'sent' ? now : null, updatedAt: now }).where(eq(invitations.id, id));
    if (viaHayyak) {
      await openSendRequest(tx, inv, rows, 'invite');
      await log(tx, id, 'طلبت من حيّــاك ترسلها', `${rows.length} مدعو`, 'info');
    } else await log(tx, id, when ? 'تمت جدولة الدعوات' : `تجهزت ${rows.length} دعوة ترسلها بنفسك`, when ? `${weekdayDate(when)} · ${time(when)}` : '', 'main');
    return { status, count: rows.length, request: viaHayyak };
  });
}

/** Changes the date or the place after sending, and tells everyone who can be reached. */
export async function updateEvent(orgId: string, id: string, p: { startsAt: Date; placeName: string; placeArea?: string; mapUrl?: string; liveUrl?: string }) {
  const inv = await own(orgId, id);
  if (liveStatus(inv) === 'ended') throw bad('المناسبة انتهت');
  if (p.startsAt <= new Date()) throw bad('الموعد الجديد فات');
  await limit(`evt:${id}`, 10, 3600);
  const d = await db();
  const timeChanged = inv.startsAt?.getTime() !== p.startsAt.getTime();
  await d.transaction(async (t) => {
    const tx = t as unknown as DB;
    await tx
      .update(invitations)
      .set({ startsAt: p.startsAt, placeName: p.placeName, placeArea: p.placeArea ?? inv.placeArea, mapUrl: p.mapUrl ?? inv.mapUrl, liveUrl: p.liveUrl ?? inv.liveUrl, updatedAt: new Date(), reminders: timeChanged ? { ...inv.reminders, dayDone: false, hoursDone: false } : inv.reminders })
      .where(eq(invitations.id, id));
    if (inv.status !== 'draft') await log(tx, id, 'تعدّل الموعد أو المكان', `${weekdayDate(p.startsAt)} · ${time(p.startsAt)}${p.placeName ? ' · ' + p.placeName : ''}`, 'info');
  });
  if (inv.status !== 'sent') return { notified: 0 };
  const [org] = await d.select().from(orgs).where(eq(orgs.id, orgId));
  const rows = (await guestsOf(orgId, id)).filter((g) => g.charged && g.email && g.status !== 'no');
  for (const g of rows) {
    await send({
      to: g.email, guestId: g.id, fromName: org!.name, subject: `تعديل على «${inv.title}»`, title: `حيّاك يا ${g.name.split(' ')[0]}`,
      lines: [`تعدّل موعد أو مكان «${inv.title}».`, `${weekdayDate(p.startsAt)} · ${time(p.startsAt)}${p.placeName ? '\n' + p.placeName : ''}`], button: { label: 'افتح دعوتك', url: linkOf(inv, g) }, note: `من ${org!.name} عبر حيّــاك`,
    });
  }
  return { notified: rows.length };
}

export function defaultMessage(inv: Pick<Inv, 'title' | 'audience'>) {
  return inv.audience === 'private' ? `حيّاك يا «اسم المدعو» 🌿\nيسعدنا حضورك «${inv.title}»، وهذي دعوتك باسمك:` : `حيّــاكم 🌿\nيسعدنا حضوركم «${inv.title}». سجّل اسمك من الرابط وتوصلك دعوتك:`;
}
export const personalMessage = (inv: Inv, g: Pick<Guest, 'name'>) => (inv.message || defaultMessage(inv)).replaceAll('«اسم المدعو»', g.name.split(' ')[0] || g.name);
export function reminderText(inv: Inv) {
  return `نذكّركم بـ «${inv.title}» ${inv.startsAt ? `${weekdayDate(inv.startsAt)} الساعة ${time(inv.startsAt)}` : ''}${inv.placeName ? ` في ${inv.placeName}` : ''}. يسعدنا تأكيد حضوركم من رابط الدعوة`;
}

/** Sends a reminder now to the people who have not answered. */
export async function remindNow(orgId: string, id: string) {
  const inv = await own(orgId, id);
  if (liveStatus(inv) !== 'sent') throw bad('التذكير متاح للدعوات المُرسلة');
  const all = (await guestsOf(orgId, id)).filter((g) => g.charged && g.status === 'pending');
  if (!all.length) return { mode: 'none' as const, count: 0 };
  if (inv.reminders.by !== 'hayyak') return { mode: 'copy' as const, count: all.length, text: `${reminderText(inv)}\n${inv.audience === 'public' ? shortLink(inv) : ''}`.trim() };
  await limit(`remind:${id}`, 1, 6 * 3600);
  return { mode: 'sent' as const, count: await deliverReminder(inv, all, 'تذكير الحين') };
}

export async function deliverReminder(inv: Inv, rows: Guest[], label: string) {
  const d = await db();
  const [org] = await d.select().from(orgs).where(eq(orgs.id, inv.orgId));
  const mail = rows.filter((g) => g.email);
  for (const g of mail) {
    await send({
      to: g.email, guestId: g.id, fromName: org!.name, subject: `تذكير: ${inv.title}`, title: `حيّاك يا ${g.name.split(' ')[0]}`, lines: [reminderText(inv)],
      button: { label: 'افتح دعوتك', url: linkOf(inv, g) }, note: `من ${org!.name} عبر حيّــاك`,
    });
  }
  const phoneOnly = rows.filter((g) => !g.email && g.phone);
  if (phoneOnly.length && inv.sendChannels.includes('whatsapp')) await d.insert(sendRequests).values({ orgId: inv.orgId, invitationId: inv.id, kind: 'reminder', channels: ['whatsapp'], count: phoneOnly.length });
  const n = mail.length + (inv.sendChannels.includes('whatsapp') ? phoneOnly.length : 0);
  await log(d, inv.id, label, `وصل لـ ${n}`, 'info');
  return n;
}

/* ---------- what a design looks like, for any page that shows the invitation ---------- */

export type Look = {
  pattern: string; color: number; seal: string; photo: string; title: string; latin: string; eventLabel: string;
  customColors?: { c1: string; c2: string; c3: string }; customSeal?: { text: string; wax: string; logo: string }; customLoading?: { bg: string; logo: string };
  engine?: { e: number; c1: string; c2: string; c3: string; tx: string; den: number; spd: number; logo: string };
};
export async function lookOf(inv: Inv): Promise<Look> {
  const look: Look = { pattern: inv.pattern, color: inv.color, seal: inv.seal, photo: inv.photoAssetId ? `/api/assets/${inv.photoAssetId}` : '', title: inv.title, latin: inv.latin, eventLabel: inv.eventLabel };
  const ids = [inv.customColorsId, inv.customSealId, inv.customLoadingId, inv.customPatternId].filter(Boolean) as string[];
  if (!ids.length) return look;
  const d = await db();
  const rows = await d.select().from(customDesigns).where(and(inArray(customDesigns.id, ids), or(isNull(customDesigns.orgId), eq(customDesigns.orgId, inv.orgId))));
  for (const r of rows) {
    if (r.id === inv.customColorsId) look.customColors = r.data as Look['customColors'];
    if (r.id === inv.customSealId) look.customSeal = r.data as Look['customSeal'];
    if (r.id === inv.customLoadingId) look.customLoading = r.data as Look['customLoading'];
    if (r.id === inv.customPatternId) look.engine = r.data as Look['engine'];
  }
  return look;
}

/* ---------- counts used by the attendance and report pages ---------- */
export async function attendanceCounts(ids: string[]) {
  const out: Record<string, { attended: number; certs: number; downloads: number }> = {};
  if (!ids.length) return out;
  const d = await db();
  const a = await d.select({ id: attendance.invitationId, n: sql<number>`count(*) filter (where ${attendance.complete})::int` }).from(attendance).where(inArray(attendance.invitationId, ids)).groupBy(attendance.invitationId);
  const c = await d
    .select({ id: certificates.invitationId, n: sql<number>`count(*)::int`, dl: sql<number>`count(*) filter (where ${certificates.downloads} > 0)::int` })
    .from(certificates).where(and(inArray(certificates.invitationId, ids), eq(certificates.kind, 'attend'))).groupBy(certificates.invitationId);
  for (const i of ids) out[i] = { attended: 0, certs: 0, downloads: 0 };
  for (const r of a) out[r.id]!.attended = r.n;
  for (const r of c) Object.assign(out[r.id]!, { certs: r.n, downloads: r.dl });
  return out;
}
