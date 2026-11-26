import 'server-only';
import { pruneReports } from './reports';
import { and, eq, inArray, isNotNull, isNull, lt, lte, ne, sql } from 'drizzle-orm';
import { ARCHIVE_DAYS, PURGE_DAYS } from '@/lib/constants';
import { inputDate, partsOf, time, weekdayDate } from '@/lib/dates';
import { db, auditLog, certificates, creditLots, guests, invitations, memberships, nameRequests, orgInvites, otps, outbox, rateLimits, sessions, trustedDevices, users, type DB } from '../db';
import { encrypt } from '../lib/crypto';
import { SYSTEM, appUrl, audit } from '../lib/core';
import { flushOutbox, send } from '../lib/mail';
import { settle } from './attendance';
import { deliverReminder, guestsOf, log, reminderText, shortLink, type Inv } from './invitations';

const LOCK = 727274;

/** Everything that happens on its own. Safe to call from several places: only one run works at a time. */
export async function tick() {
  const d = await db();
  const got = await claim(d);
  if (!got) return { skipped: true };
  const out: Record<string, unknown> = {};
  const step = async (name: string, fn: () => Promise<unknown>) => {
    try {
      out[name] = (await fn()) ?? 'ok';
    } catch (e) {
      out[name] = 'error';
      console.error('[scheduler]', name, e);
    }
  };
  await step('attendance', () => settle());
  await step('scheduled', sendScheduled);
  await step('ended', markEnded);
  await step('reminders', reminders);
  await step('credit', creditNotices);
  await step('daily', dailySummary);
  await step('archive', archive);
  await step('purge', purge);
  await step('cleanup', cleanup);
  await step('mail', () => flushOutbox());
  await d.delete(rateLimits).where(eq(rateLimits.key, `lock:${LOCK}`));
  return out;
}
async function claim(d: DB) {
  const r = await d
    .insert(rateLimits)
    .values({ key: `lock:${LOCK}`, count: 1, resetAt: new Date(Date.now() + 4 * 60_000) })
    .onConflictDoUpdate({ target: rateLimits.key, set: { resetAt: new Date(Date.now() + 4 * 60_000) }, setWhere: lt(rateLimits.resetAt, new Date()) })
    .returning({ key: rateLimits.key });
  return r.length > 0;
}

async function ownersOf(orgId: string) {
  const d = await db();
  return d.select({ email: users.email, notify: users.notify }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(and(eq(memberships.orgId, orgId), inArray(memberships.role, ['owner', 'manager']), eq(users.status, 'active')));
}

/** Self-sent and public invitations that were scheduled. The ones Hayyak sends wait for the Studio. */
async function sendScheduled() {
  const d = await db();
  const due = await d.update(invitations).set({ status: 'sent', sentAt: new Date() }).where(and(eq(invitations.status, 'scheduled'), isNotNull(invitations.scheduledAt), lte(invitations.scheduledAt, new Date()), sql`(${invitations.sendBy} = 'self' or ${invitations.audience} = 'public')`)).returning();
  for (const i of due) {
    await log(d, i.id, i.audience === 'public' ? 'انتشر رابط الدعوة العامة' : 'حان وقت الإرسال', '', 'main');
    for (const o of await ownersOf(i.orgId)) await send({ to: o.email, subject: `حان وقت إرسال «${i.title}»`, title: 'دعواتك جاهزة', lines: [i.audience === 'public' ? 'رابط دعوتك العامة صار شغال، انشره الحين.' : 'روابط مدعوينك جاهزة، انسخها وأرسلها من صفحة الدعوة.'], button: { label: 'افتح الدعوة', url: `${appUrl()}/app/invitations/${i.id}` } });
  }
  return due.length;
}
async function markEnded() {
  const d = await db();
  const r = await d.update(invitations).set({ status: 'ended' }).where(and(eq(invitations.status, 'sent'), isNotNull(invitations.startsAt), sql`${invitations.startsAt} + (${invitations.durationMin} * interval '1 minute') < now() - interval '1 day'`)).returning({ id: invitations.id });
  return r.length;
}

async function reminders() {
  const d = await db();
  const soon = await d.select().from(invitations).where(and(eq(invitations.status, 'sent'), isNotNull(invitations.startsAt), sql`${invitations.startsAt} > now()`, sql`${invitations.startsAt} < now() + interval '25 hours'`));
  let n = 0;
  for (const i of soon) {
    const left = i.startsAt!.getTime() - Date.now();
    const r = i.reminders;
    if (r.by === 'none') continue;
    const age = Date.now() - (i.sentAt?.getTime() ?? 0);
    if (r.day && !r.dayDone && left <= 24 * 36e5 && left > 4 * 36e5) {
      // Sent less than a day ago: the invitation itself is the reminder.
      if (age > 20 * 36e5) await remind(i, 'day');
      await d.update(invitations).set({ reminders: { ...r, dayDone: true } }).where(eq(invitations.id, i.id));
      n++;
    } else if (r.hours && !r.hoursDone && left <= 3 * 36e5) {
      if (age > 6 * 36e5) await remind(i, 'hours');
      await d.update(invitations).set({ reminders: { ...r, dayDone: true, hoursDone: true } }).where(eq(invitations.id, i.id));
      n++;
    }
  }
  return n;
}
async function remind(i: Inv, which: 'day' | 'hours') {
  const d = await db();
  const all = (await guestsOf(i.orgId, i.id)).filter((g) => g.charged);
  const rows = which === 'day' ? all.filter((g) => g.status !== 'no') : all.filter((g) => g.status === 'yes');
  if (!rows.length) return;
  if (i.reminders.by === 'hayyak') {
    await deliverReminder(i, rows, which === 'day' ? 'تذكير تلقائي قبل بيوم' : 'تذكير تلقائي قبل 3 ساعات');
    return;
  }
  const pending = all.filter((g) => g.status === 'pending').length;
  for (const o of await ownersOf(i.orgId)) await send({ to: o.email, subject: `وقت التذكير: ${i.title}`, title: 'هذا وقت تذكير مدعوينك', lines: [`${pending} مدعو ما ردّوا للحين. انسخ هذي الرسالة وأرسلها لهم:`, `${reminderText(i)}\n${i.audience === 'public' ? shortLink(i) : ''}`], button: { label: 'افتح الدعوة', url: `${appUrl()}/app/invitations/${i.id}` } });
  await log(d, i.id, 'نبّهناك وقت التذكير', `${weekdayDate(new Date())} · ${time(new Date())}`, 'info');
}

async function creditNotices() {
  const d = await db();
  const low = await d.update(creditLots).set({ lowNotifiedAt: new Date() }).where(and(ne(creditLots.kind, 'free'), isNull(creditLots.lowNotifiedAt), sql`${creditLots.expiresAt} > now()`, sql`${creditLots.total} - ${creditLots.used} <= ${creditLots.total} * 0.1`)).returning();
  for (const l of low) for (const o of await ownersOf(l.orgId)) if (o.notify.low !== false) await send({ to: o.email, subject: 'قرب ينتهي رصيدك', title: 'قرب ينتهي رصيدك', lines: [`باقي لك ${l.total - l.used} من ${l.total} دعوة.`], button: { label: 'اشترِ رصيد', url: `${appUrl()}/app/buy` } });
  return low.length;
}

async function dailySummary() {
  const p = partsOf(new Date());
  if (p.h !== 20) return 0;
  const d = await db();
  const key = `daily:${inputDate(new Date())}`;
  const first = await d.insert(rateLimits).values({ key, count: 1, resetAt: new Date(Date.now() + 2 * 864e5) }).onConflictDoNothing().returning();
  if (!first.length) return 0;
  const rows = await d
    .select({ orgId: guests.orgId, title: invitations.title, yes: sql<number>`count(*) filter (where ${guests.status} = 'yes')::int`, no: sql<number>`count(*) filter (where ${guests.status} = 'no')::int` })
    .from(guests).innerJoin(invitations, eq(invitations.id, guests.invitationId))
    .where(and(eq(invitations.status, 'sent'), sql`${guests.respondedAt} > now() - interval '24 hours'`)).groupBy(guests.orgId, invitations.id, invitations.title);
  for (const orgId of new Set(rows.map((r) => r.orgId))) {
    const lines = rows.filter((r) => r.orgId === orgId).map((r) => `«${r.title}»: ${r.yes} أكّدوا و ${r.no} اعتذروا`);
    for (const o of await ownersOf(orgId)) if (o.notify.daily !== false) await send({ to: o.email, subject: 'ملخص ردود اليوم', title: 'ملخص ردود اليوم', lines, button: { label: 'افتح لوحتك', url: `${appUrl()}/app` } });
  }
  return rows.length;
}

/** 90 days after the event: personal data leaves the live tables and is kept encrypted only. */
async function archive() {
  const d = await db();
  const due = await d.select().from(invitations).where(and(isNull(invitations.archivedAt), isNotNull(invitations.startsAt), ne(invitations.status, 'draft'), sql`${invitations.startsAt} < now() - (${ARCHIVE_DAYS} * interval '1 day')`)).limit(20);
  for (const i of due) {
    for (const g of await guestsOf(i.orgId, i.id)) {
      if (g.archive !== null) continue;
      const blob = encrypt(JSON.stringify({ name: g.name, title: g.title, phone: g.phone, email: g.email, note: g.note, certNameAr: g.certNameAr, certNameEn: g.certNameEn, extraValue: g.extraValue }));
      await d.update(guests).set({ archive: blob, name: 'مدعو', title: '', phone: '', email: '', note: '', certNameAr: '', certNameEn: '', extraValue: '' }).where(eq(guests.id, g.id));
    }
    await d.delete(nameRequests).where(eq(nameRequests.invitationId, i.id));
    await d.update(invitations).set({ archivedAt: new Date() }).where(eq(invitations.id, i.id));
  }
  if (due.length) await audit(SYSTEM, `أرشف بيانات ${due.length} مناسبة`, { reason: 'مرّت 90 يوم' });
  return due.length;
}
/** 180 days after the event: the archive and certificates are deleted for good. Counts stay for the reports. */
async function purge() {
  const d = await db();
  const due = await d.select({ id: invitations.id }).from(invitations).where(and(isNull(invitations.purgedAt), isNotNull(invitations.archivedAt), sql`${invitations.startsAt} < now() - (${PURGE_DAYS} * interval '1 day')`)).limit(20);
  for (const i of due) {
    await d.update(guests).set({ archive: '' }).where(eq(guests.invitationId, i.id));
    await d.delete(certificates).where(eq(certificates.invitationId, i.id));
    await d.update(invitations).set({ purgedAt: new Date() }).where(eq(invitations.id, i.id));
  }
  if (due.length) await audit(SYSTEM, `حذف بيانات ${due.length} مناسبة من الأرشيف`, { reason: 'مرّت 90 يوم في الأرشيف' });
  return due.length;
}

async function cleanup() {
  const d = await db();
  const now = new Date();
  await d.delete(sessions).where(lt(sessions.expiresAt, now));
  await d.delete(trustedDevices).where(lt(trustedDevices.expiresAt, now));
  await d.delete(otps).where(lt(otps.expiresAt, new Date(now.getTime() - 864e5)));
  await d.delete(rateLimits).where(and(lt(rateLimits.resetAt, now), ne(rateLimits.key, `lock:${LOCK}`)));
  await d.delete(orgInvites).where(lt(orgInvites.expiresAt, now));
  await pruneReports();
  await d.delete(outbox).where(and(eq(outbox.status, 'sent'), lt(outbox.createdAt, new Date(now.getTime() - 30 * 864e5))));
  await d.delete(auditLog).where(lt(auditLog.at, new Date(now.getTime() - 730 * 864e5)));
}
