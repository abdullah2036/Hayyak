import 'server-only';
import { and, asc, desc, eq, gt, inArray, isNull, ne, or, sql } from 'drizzle-orm';
import { ORG_ROLES, SEALS, THANK_GROUPS } from '@/lib/constants';
import { dayMonth, dayNum, durationText, fullDate, inputDate, inputTime, longDate, monthName, plural, relative, term, time, until, weekdayDate } from '@/lib/dates';
import { db, attendance, auditLog, customDesigns, customRequests, guests, invitationLog, invitations, memberships, orders, orgInvites, orgs, sessions, thankNotes, users } from '../db';
import { appUrl, hostLabel } from '../lib/core';
import type { UserCtx } from '../lib/session';
import { balance } from './credit';
import { certFor, isOpen, nameRequestsOf, roster, sessionsOf, thankTargets } from './attendance';
import { received } from './guest';
import { publicPricing } from './pricing';
import { attendanceCounts, defaultMessage, guestsOf, linkOf, list, liveStatus, lookOf, NOSTATS, own, personalMessage, reminderText, shortLink, statsFor, STATUS_AR, type Guest, type Inv } from './invitations';
import { serviceList } from './studio';

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

/** Phone and email are shortened on screen; the full value is only in the file the owner downloads. */
export function mask(g: Pick<Guest, 'phone' | 'email'>) {
  if (g.phone) return g.phone.replace(/^\+966/, '0').replace(/^(\d{2})\d+(\d{3})$/, '$1•• ••• $2');
  if (g.email) return g.email.replace(/^(.).*(@.*)$/, '$1•••$2');
  return '—';
}
const channelOf = (g: Guest) => g.sentVia || (g.source === 'public' ? 'رابط' : g.phone ? 'رابط' : 'إيميل');
const activity = (g: Guest) =>
  g.status !== 'pending' ? relative(g.respondedAt) : g.openCount > 1 ? `فتح الدعوة ${plural(g.openCount, 'مرة', 'مرتين', 'مرات')}` : g.firstOpenedAt ? `فتحها ${relative(g.firstOpenedAt)}` : 'ما فتح الدعوة';
const ST_AR = { yes: 'أكّد', no: 'اعتذر', pending: 'ما ردّ' } as const;

export async function shell(me: UserCtx) {
  const d = await db();
  const b = await balance(me.org.id);
  const [r] = await d.select({ n: sql<number>`count(*)::int` }).from(customRequests).where(and(eq(customRequests.orgId, me.org.id), sql`${customRequests.stage} < 5`));
  return {
    org: { id: me.org.id, name: me.org.name, logo: me.org.logoAssetId ? `/api/assets/${me.org.logoAssetId}` : '', suspended: me.org.status !== 'active' },
    user: { name: me.user.name, email: me.user.email, tourSeen: me.user.tourSeen },
    role: me.role, roleLabel: ORG_ROLES[me.role]!, canEdit: me.role !== 'viewer', orgs: me.orgsList,
    credit: {
      left: b.left, total: b.total, used: b.used, self: b.byChannel.self, email: b.byChannel.email, whatsapp: b.byChannel.whatsapp, paid: b.paid, plan: b.plan, expires: b.expiresAt ? dayMonth(b.expiresAt) : '', bought: b.boughtAt ? dayMonth(b.boughtAt) : '',
      days: b.expiresAt ? Math.max(0, Math.ceil((b.expiresAt.getTime() - Date.now()) / 864e5)) : null,
    },
    requests: r?.n ?? 0, host: hostLabel(),
  };
}
export type Shell = Awaited<ReturnType<typeof shell>>;

const card = async (me: UserCtx, i: Inv, s = NOSTATS) => ({
  id: i.id, title: i.title || 'دعوة بدون عنوان', latin: i.latin, status: STATUS_AR[liveStatus(i)], audience: i.audience === 'private' ? 'خاصة' : 'عامة', by: i.audience === 'public' ? 'رابط للنشر' : i.sendBy === 'hayyak' ? 'حيّــاك ترسلها' : 'ترسلها بنفسك',
  date: i.startsAt ? weekdayDate(i.startsAt) : 'بدون موعد', short: i.startsAt ? dayMonth(i.startsAt) : '—', time: i.startsAt ? time(i.startsAt) : '', place: i.online ? i.platform : i.placeName, eventLabel: i.eventLabel, slug: i.slug,
  // A thumbnail shows the same card the guest gets, so it needs the event's own details.
  look: { ...(await lookOf(i)), info: { entity: me.org.name, logo: me.org.logoAssetId ? `/api/assets/${me.org.logoAssetId}` : '', startsAt: iso(i.startsAt), durationMin: i.durationMin, online: i.online, placeName: i.placeName, placeArea: i.placeArea, platform: i.platform, liveUrl: i.liveUrl } },
  until: i.startsAt ? until(i.startsAt) : '', scheduled: i.scheduledAt ? dayMonth(i.scheduledAt) : '', stats: s, startsAt: iso(i.startsAt),
});

export async function dashboard(me: UserCtx) {
  const d = await db();
  const all = await list(me.org.id);
  const stats = await statsFor(all.map((i) => i.id));
  const cards = await Promise.all(all.slice(0, 40).map((i) => card(me, i, stats[i.id])));
  const active = all.filter((i) => liveStatus(i) === 'sent');
  const next = all.filter((i) => ['sent', 'scheduled'].includes(liveStatus(i)) && i.startsAt && i.startsAt > new Date()).sort((a, b) => a.startsAt!.getTime() - b.startsAt!.getTime())[0];
  const activeIds = active.map((i) => i.id);
  const pendingRows = activeIds.length ? await d.select().from(guests).where(and(inArray(guests.invitationId, activeIds), eq(guests.charged, true), eq(guests.status, 'pending'))).orderBy(desc(guests.lastOpenedAt)).limit(4) : [];
  const [tot] = all.length
    ? await d
        .select({
          sent: sql<number>`count(*) filter (where ${guests.charged})::int`, open: sql<number>`count(*) filter (where ${guests.firstOpenedAt} is not null)::int`, yes: sql<number>`count(*) filter (where ${guests.status} = 'yes')::int`, no: sql<number>`count(*) filter (where ${guests.status} = 'no')::int`,
          openNo: sql<number>`count(*) filter (where ${guests.status} = 'pending' and ${guests.firstOpenedAt} is not null)::int`,
        })
        .from(guests).where(and(eq(guests.orgId, me.org.id), ne(guests.source, 'walkin'), eq(guests.charged, true)))
    : [];
  const ch = await d
    .select({ via: guests.sentVia, n: sql<number>`count(*)::int`, o: sql<number>`count(*) filter (where ${guests.firstOpenedAt} is not null)::int` })
    .from(guests).where(and(eq(guests.orgId, me.org.id), eq(guests.charged, true))).groupBy(guests.sentVia);
  const t = tot ?? { sent: 0, open: 0, yes: 0, no: 0, openNo: 0 };
  return {
    today: weekdayDate(new Date()), month: monthName(new Date()), active: active.length, pendingCount: activeIds.reduce((a, id) => a + (stats[id]?.pending ?? 0), 0),
    totals: { sent: t.sent, open: t.open, yes: t.yes, no: t.no, openNo: t.openNo, unopened: Math.max(0, t.sent - t.yes - t.no - t.openNo) },
    next: next ? { ...(await card(me, next, stats[next.id])), when: `${weekdayDate(next.startsAt)} · ${time(next.startsAt, true)}`, link: shortLink(next), message: `${next.audience === 'public' ? defaultMessage(next) : `حيّــاكم 🌿\nيسعدنا حضوركم «${next.title}» ${weekdayDate(next.startsAt)}، وهذي دعوتكم:`}\n${linkOf(next)}`, reminder: next.reminders, isPublic: next.audience === 'public', remind: reminderText(next) } : null,
    pending: pendingRows.map((g) => ({ init: g.name.charAt(0), name: g.name, st: activity(g), ch: channelOf(g) })),
    rows: cards,
    channels: ch.map((c) => ({ name: c.via === 'رابط' || !c.via ? 'رابط مباشر' : c.via, sent: c.n, open: c.n ? Math.round((c.o / c.n) * 100) : 0 })),
    groups: [...new Set(all.filter((i) => i.eventLabel).map((i) => i.eventLabel))].slice(0, 4).map((name) => {
      const mine = all.filter((i) => i.eventLabel === name);
      const sent = mine.reduce((a, i) => a + (stats[i.id]?.sent ?? 0), 0);
      const ok = mine.reduce((a, i) => a + (stats[i.id]?.ok ?? 0), 0);
      return { name, count: plural(mine.length, 'دعوة وحدة', 'دعوتين', 'دعوات'), sub: `${sent} مدعو · ${ok} أكّدوا`, pct: sent ? Math.round((ok / sent) * 100) : 0, invs: mine.slice(0, 4).map((i) => i.title || 'بدون عنوان') };
    }),
    today8: inputDate(new Date()),
  };
}
export type DashboardData = Awaited<ReturnType<typeof dashboard>>;

export async function invitationsScreen(me: UserCtx) {
  const all = await list(me.org.id);
  const stats = await statsFor(all.map((i) => i.id));
  return { cards: await Promise.all(all.map((i) => card(me, i, stats[i.id]))) };
}

export async function guestRows(orgId: string, id: string) {
  return (await guestsOf(orgId, id)).filter((g) => g.source !== 'walkin' && g.archive === null).map((g) => ({ id: g.id, i: g.name.charAt(0), n: g.name, c: mask(g), ch: channelOf(g), st: ST_AR[g.status], when: activity(g), s: g.seal, p: g.phone, e: g.email, token: g.token, title: g.title }));
}
export async function personalLinks(orgId: string, id: string) {
  const i = await own(orgId, id);
  if (i.status === 'draft') return [];
  return (await guestsOf(orgId, id)).filter((g) => g.charged && g.archive === null).map((g) => ({ name: g.name, phone: g.phone, email: g.email, link: linkOf(i, g), message: `${personalMessage(i, g)}\n${linkOf(i, g)}`, st: ST_AR[g.status] }));
}

export async function detail(me: UserCtx, id: string) {
  const i = await own(me.org.id, id);
  const d = await db();
  const stats = (await statsFor([id]))[id] ?? NOSTATS;
  const logRows = await d.select().from(invitationLog).where(eq(invitationLog.invitationId, id)).orderBy(asc(invitationLog.at)).limit(60);
  const { config } = await certFor(i);
  const names = new Map((await d.select({ id: users.id, n: users.name }).from(users).innerJoin(memberships, eq(memberships.userId, users.id)).where(eq(memberships.orgId, me.org.id))).map((u) => [u.id, u.n]));
  const day = i.startsAt ? new Date(i.startsAt.getTime() - 864e5) : null;
  const h3 = i.startsAt ? new Date(i.startsAt.getTime() - 3 * 36e5) : null;
  return {
    ...(await card(me, i, stats)), raw: { status: liveStatus(i), audience: i.audience, sendBy: i.sendBy, online: i.online, placeName: i.placeName, placeArea: i.placeArea, mapUrl: i.mapUrl, liveUrl: i.liveUrl, date: inputDate(i.startsAt), time: inputTime(i.startsAt) },
    link: shortLink(i), url: linkOf(i), message: i.audience === 'public' ? `${i.message || defaultMessage(i)}\n${linkOf(i)}` : '', guests: i.archivedAt ? [] : await guestRows(me.org.id, id), archived: Boolean(i.archivedAt),
    reminders: { ...i.reminders, dayText: day ? `${weekdayDate(day)} · ${time(day)} · للي ما ردّوا واللي أكّدوا` : '', hoursText: h3 ? `${weekdayDate(h3)} · ${time(h3)} · للي أكّدوا` : '' },
    cert: { tpl: ['قالب فاتح', 'قالب غامق', 'تصميمكم'][config.tpl]!, lang: config.lang === 'bi' ? 'عربي وإنجليزي' : 'عربي' },
    log: [
      ...logRows.map((l) => ({ t: l.text, d: [weekdayDate(l.at), time(l.at), l.detail].filter(Boolean).join(' · ') + (['أُنشئت الدعوة', 'انشأت الدعوة'].includes(l.text) && i.createdBy && names.get(i.createdBy) ? ` · ${names.get(i.createdBy)}` : ''), c: l.tone === 'main' ? '#0E97AE' : l.tone === 'mute' ? '#B8C4CC' : '#86DCEA' })),
      ...(liveStatus(i) === 'sent' && i.reminders.by !== 'none' && i.reminders.day && !i.reminders.dayDone && day && day > new Date() ? [{ t: 'التذكير الجاي', d: `${weekdayDate(day)} · ${time(day)}`, c: '#E7C873' }] : []),
    ],
  };
}
export type DetailData = Awaited<ReturnType<typeof detail>>;

export async function guestsScreen(me: UserCtx) {
  const d = await db();
  const rows = await d.select({ g: guests, title: invitations.title, invId: invitations.id }).from(guests).innerJoin(invitations, eq(invitations.id, guests.invitationId)).where(and(eq(guests.orgId, me.org.id), eq(guests.charged, true), isNull(guests.archive))).orderBy(desc(guests.createdAt)).limit(4000);
  const people = new Map<string, { i: string; n: string; c: string; phone: string; email: string; when: string; inv: { id: string; t: string; st: string }[] }>();
  for (const r of rows) {
    const k = r.g.phone || r.g.email || r.g.id;
    const p = people.get(k) ?? { i: r.g.name.replace(/^د\. /, '').charAt(0), n: r.g.name, c: mask(r.g), phone: r.g.phone, email: r.g.email, when: activity(r.g), inv: [] };
    p.inv.push({ id: r.invId, t: r.title, st: ST_AR[r.g.status] });
    people.set(k, p);
  }
  const invs = [...new Map(rows.map((r) => [r.invId, r.title])).entries()].slice(0, 12).map(([id, t]) => ({ id, t }));
  const c = (s: string) => rows.filter((r) => r.g.status === s).length;
  return { people: [...people.values()], invs, kpis: { all: rows.length, yes: c('yes'), no: c('no'), pending: c('pending') } };
}

async function visibleDesigns(orgId: string) {
  const d = await db();
  const rows = await d.select().from(customDesigns).where(and(eq(customDesigns.approved, true), or(isNull(customDesigns.orgId), eq(customDesigns.orgId, orgId)))).orderBy(desc(customDesigns.createdAt)).limit(100);
  return rows.map((r) => ({ id: r.id, kind: r.kind, name: r.name, mine: r.orgId !== null, data: r.data as Record<string, unknown> }));
}
export async function designsScreen(me: UserCtx) {
  return { services: (await serviceList(true)).map((s) => ({ id: s.id, key: s.key, name: s.name, description: s.description, duration: s.duration, price: s.price })), designs: await visibleDesigns(me.org.id) };
}

export async function createScreen(me: UserCtx, id: string | null) {
  const designs = await visibleDesigns(me.org.id);
  if (!id) return { designs, draft: null, guests: [] };
  const i = await own(me.org.id, id);
  return {
    designs, guests: (await guestsOf(me.org.id, id)).map((g) => ({ id: g.id, n: g.name, p: g.phone, e: g.email, s: g.seal })),
    draft: {
      id: i.id, slug: i.slug, status: i.status, audience: i.audience, pattern: i.pattern, color: i.color, seal: i.seal, photoAssetId: i.photoAssetId, customPatternId: i.customPatternId, customColorsId: i.customColorsId, customSealId: i.customSealId, customLoadingId: i.customLoadingId,
      title: i.title, latin: i.latin, eventLabel: i.eventLabel, date: inputDate(i.startsAt), time: inputTime(i.startsAt), durationMin: i.durationMin, online: i.online, placeName: i.placeName, placeArea: i.placeArea, mapUrl: i.mapUrl, platform: i.platform, liveUrl: i.liveUrl,
      sendBy: i.sendBy, sendChannels: i.sendChannels, message: i.message, schedDate: inputDate(i.scheduledAt), schedTime: inputTime(i.scheduledAt), reminders: i.reminders, cap: i.cap, closes: inputDate(i.closesAt),
    },
  };
}
export type CreateData = Awaited<ReturnType<typeof createScreen>>;

export async function requestsScreen(me: UserCtx) {
  const d = await db();
  const rows = await d.select().from(customRequests).where(eq(customRequests.orgId, me.org.id)).orderBy(desc(customRequests.createdAt)).limit(100);
  const ids = rows.map((r) => r.designId).filter(Boolean) as string[];
  const des = ids.length ? await d.select().from(customDesigns).where(inArray(customDesigns.id, ids)) : [];
  return {
    requests: rows.map((r) => ({ id: r.id, t: r.title, meta: `طلبته ${dayMonth(r.createdAt)}${r.price ? ' · ' + r.price : ''}`, st: r.stage, message: r.message, design: des.find((x) => x.id === r.designId) ? { kind: des.find((x) => x.id === r.designId)!.kind, data: des.find((x) => x.id === r.designId)!.data as Record<string, unknown> } : null })),
    services: (await serviceList(true)).map((s) => ({ id: s.id, name: s.name, description: s.description, duration: s.duration, price: s.price })), phone: me.org.phone, email: me.org.contactEmail || me.user.email,
  };
}

export async function settingsScreen(me: UserCtx) {
  const d = await db();
  const dev = await d.select().from(sessions).where(and(eq(sessions.userId, me.user.id), eq(sessions.kind, 'user'), gt(sessions.expiresAt, new Date()))).orderBy(desc(sessions.lastSeenAt)).limit(20);
  const members = await d.select({ id: users.id, n: users.name, email: users.email, role: memberships.role }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(eq(memberships.orgId, me.org.id)).orderBy(asc(memberships.createdAt));
  const invites = await d.select().from(orgInvites).where(and(eq(orgInvites.orgId, me.org.id), gt(orgInvites.expiresAt, new Date())));
  const access = await d.select().from(auditLog).where(and(eq(auditLog.orgId, me.org.id), eq(auditLog.actorType, 'staff'))).orderBy(desc(auditLog.at)).limit(20);
  return {
    org: { name: me.org.name, kind: me.org.kind, contactEmail: me.org.contactEmail, phone: me.org.phone }, notify: me.user.notify,
    devices: dev.map((s) => ({ id: s.id, n: s.device || 'جهاز', w: relative(s.lastSeenAt), cur: s.id === me.session.id })),
    members: members.map((m) => ({ id: m.id, i: m.n.charAt(0), n: m.n, mail: m.email, role: ORG_ROLES[m.role]!, owner: m.role === 'owner', pending: false })).concat(invites.map((i) => ({ id: i.id, i: i.email.charAt(0).toUpperCase(), n: i.email, mail: 'بانتظار القبول', role: ORG_ROLES[i.role]!, owner: false, pending: true }))),
    access: access.map((a) => ({ what: [a.action, a.detail].filter(Boolean).join(' · '), why: a.reason, who: a.actorName, when: `${relative(a.at)} ${time(a.at)}` })),
  };
}

export async function accountScreen(me: UserCtx) {
  const d = await db();
  const rec = await received(me.user.email);
  const now = new Date();
  const tr = term(now).key;
  const done = rec.filter((r) => r.att);
  const inv = await d.select({ i: orgInvites, n: orgs.name }).from(orgInvites).innerJoin(orgs, eq(orgs.id, orgInvites.orgId)).where(and(eq(orgInvites.email, me.user.email), gt(orgInvites.expiresAt, now)));
  const counts = await d.select({ id: invitations.orgId, n: sql<number>`count(*)::int` }).from(invitations).where(and(inArray(invitations.orgId, me.orgsList.map((o) => o.id)), ne(invitations.status, 'draft'))).groupBy(invitations.orgId);
  const hours = (m: number) => Math.round((m / 60) * 10) / 10;
  return {
    me: { name: me.user.name, email: me.user.email, certNameAr: me.user.certNameAr, certNameEn: me.user.certNameEn, uniId: me.user.uniId },
    orgNames: [...new Set(rec.map((r) => r.org))].slice(0, 6),
    upcoming: rec.filter((r) => r.i.startsAt && r.i.startsAt > now).sort((a, b) => a.i.startsAt!.getTime() - b.i.startsAt!.getTime()).slice(0, 8).map((r) => ({ d: dayNum(r.i.startsAt), m: monthName(r.i.startsAt), t: r.i.title, o: r.org, w: `${time(r.i.startsAt)} · ${r.i.online ? 'أونلاين' : r.i.placeName}`, st: r.g.status, href: `/i/${r.i.slug}/${r.g.token}` })),
    certs: rec.flatMap((r) => r.certs.map((c) => ({ code: c.code, t: r.i.title, o: r.org, d: dayMonth(r.i.startsAt), h: hours(r.i.durationMin), img: '', token: r.g.token, kind: c.kind }))),
    hours: done.map((r) => ({ t: r.i.title, o: r.org, d: dayMonth(r.i.startsAt), h: hours(r.i.durationMin), cert: r.certs.length > 0, term: r.i.startsAt ? term(r.i.startsAt).key === tr : false })),
    orgs: me.orgsList.map((o) => ({ id: o.id, name: o.name, role: ORG_ROLES[o.role]!, n: counts.find((c) => c.id === o.id)?.n ?? 0, current: o.id === me.org.id })),
    invites: inv.map((x) => ({ id: x.i.id, name: x.n, role: ORG_ROLES[x.i.role]! })),
  };
}
export type AccountData = Awaited<ReturnType<typeof accountScreen>>;

export async function buyScreen(me: UserCtx) {
  const d = await db();
  const mine = await d.select().from(orders).where(eq(orders.orgId, me.org.id)).orderBy(desc(orders.createdAt)).limit(30);
  return {
    services: (await serviceList(true)).filter((s) => s.price !== null).map((s) => ({ id: s.id, name: s.name, description: s.description, duration: s.duration, price: s.price! })),
    pricing: await publicPricing(), special: me.org.discountPct,
    contact: { name: me.org.name, email: me.org.contactEmail || me.user.email, phone: me.org.phone },
    orders: mine.map((o) => ({ number: `HY-${o.number}`, count: o.count, total: o.total, status: o.status, date: dayMonth(o.createdAt) })),
  };
}

export async function attendanceScreen(me: UserCtx, id: string) {
  const i = await own(me.org.id, id);
  const ss = await sessionsOf(id);
  const cur = ss.find(isOpen) ?? null;
  const endDone = ss.some((s) => s.phase === 'end' && !isOpen(s));
  const people = await roster(i);
  const stats = (await statsFor([id]))[id] ?? NOSTATS;
  const counts = (await attendanceCounts([id]))[id]!;
  const { config, issuedAt } = await certFor(i);
  const targets = await thankTargets(i);
  const d = await db();
  const notes = await d.select().from(thankNotes).where(eq(thankNotes.invitationId, id));
  const invited = people.filter((p) => p.g.charged).length;
  const attended = people.filter((p) => p.a?.complete);
  const confirmed = people.filter((p) => p.g.status === 'yes');
  const perMin = new Map<number, number>();
  for (const p of attended) if (p.a!.method !== 'manual') { const m = Math.floor(p.a!.at.getTime() / 60_000); perMin.set(m, (perMin.get(m) ?? 0) + 1); }
  const mins = [...perMin.keys()].sort((a, b) => a - b);
  const span = mins.length ? Math.max(1, Math.ceil((mins[mins.length - 1]! - mins[0]! + 1) / 9)) : 1;
  const arr: { n: number; t: string }[] = [];
  if (mins.length) for (let k = 0; k < 9; k++) { const from = mins[0]! + k * span; let n = 0; for (let m = from; m < from + span; m++) n += perMin.get(m) ?? 0; arr.push({ n, t: time(new Date(from * 60_000)) }); }
  return {
    id, title: i.title, when: `${weekdayDate(i.startsAt)} · ${i.online ? i.platform : i.placeName}`, online: i.online, sent: i.status !== 'draft' && i.status !== 'scheduled',
    phase: cur ? ('open' as const) : endDone ? ('done' as const) : ('before' as const),
    session: cur ? { code: cur.code, qr: `${appUrl()}/a/${cur.qrToken}`, closesAt: cur.closesAt.toISOString(), mode: cur.mode, phase: cur.phase } : null,
    startDone: ss.some((s) => s.phase === 'start') ? people.filter((p) => p.a?.startAt).length : null,
    counts: { invited, confirmed: confirmed.length, opened: stats.open, attended: attended.length, noConfirm: attended.filter((p) => p.g.status !== 'yes').length, noShow: confirmed.filter((p) => !p.a?.complete).length, certs: counts.certs, downloads: counts.downloads },
    walkins: people.filter((p) => p.g.source === 'walkin').map((p) => p.g.name),
    seals: SEALS.map((s) => ({ l: s[0], n: attended.filter((p) => p.g.seal === s[0]).length, all: people.filter((p) => p.g.seal === s[0]).length })).filter((s) => s.all > 0),
    arr,
    rows: people.slice(0, 400).map((p) => ({ id: p.g.id, n: p.g.name, r: p.g.source === 'walkin' ? 'بدون دعوة' : ST_AR[p.g.status], seal: p.g.seal, t: p.a?.complete ? (p.a.method === 'manual' ? 'يدوي' : time(p.a.at)) : '', att: Boolean(p.a?.complete), walkin: p.g.source === 'walkin' })),
    certIssued: Boolean(issuedAt) && counts.certs > 0, certAuto: config.when === 0,
    groups: THANK_GROUPS.map((g, k) => ({ l: g.label, n: targets[k]!.length, note: notes.find((n) => n.group === k) ? { text: notes.find((n) => n.group === k)!.text, withCert: notes.find((n) => n.group === k)!.withCert } : null })),
    link: linkOf(i), org: me.org.name,
  };
}
export type AttendanceData = Awaited<ReturnType<typeof attendanceScreen>>;

export async function certificateScreen(me: UserCtx, id: string) {
  const i = await own(me.org.id, id);
  const { config, issuedAt } = await certFor(i);
  const reqs = await nameRequestsOf(id);
  return { id, title: i.title, config, issued: Boolean(issuedAt), event: { title: i.title, date: fullDate(i.startsAt), long: longDate(i.startsAt), dur: durationText(i.durationMin) }, requests: reqs.map((r) => ({ id: r.id, from: r.fromName, to: r.toName, st: r.status })) };
}
export type CertificateData = Awaited<ReturnType<typeof certificateScreen>>;

export async function report(orgId: string) {
  const d = await db();
  const all = (await list(orgId)).filter((i) => i.startsAt && i.startsAt < new Date() && ['sent', 'ended'].includes(i.status));
  const ids = all.map((i) => i.id);
  const stats = await statsFor(ids);
  const counts = await attendanceCounts(ids);
  const att = ids.length ? await d.select({ invId: attendance.invitationId, name: guests.name, key: sql<string>`coalesce(nullif(${guests.email}, ''), nullif(${guests.phone}, ''), ${guests.name})`, archived: guests.archive }).from(attendance).innerJoin(guests, eq(guests.id, attendance.guestId)).where(and(inArray(attendance.invitationId, ids), eq(attendance.complete, true))) : [];
  const terms = new Map<string, { key: string; label: string; ev: { n: string; d: string; i: number; c: number; a: number; dl: number; certs: number }[]; ids: string[] }>();
  for (const i of [...all].reverse().sort((a, b) => a.startsAt!.getTime() - b.startsAt!.getTime())) {
    const t = term(i.startsAt);
    const cur = terms.get(t.key) ?? { ...t, ev: [], ids: [] };
    cur.ev.push({ n: i.title, d: dayMonth(i.startsAt), i: stats[i.id]?.sent ?? 0, c: stats[i.id]?.ok ?? 0, a: counts[i.id]?.attended ?? 0, dl: counts[i.id]?.downloads ?? 0, certs: counts[i.id]?.certs ?? 0 });
    cur.ids.push(i.id);
    terms.set(t.key, cur);
  }
  return [...terms.values()].sort((a, b) => (a.key < b.key ? 1 : -1)).map((t) => {
    const by = new Map<string, { n: string; c: number }>();
    for (const a of att) if (t.ids.includes(a.invId) && a.archived === null) { const p = by.get(a.key) ?? { n: a.name, c: 0 }; p.c++; by.set(a.key, p); }
    return { key: t.key, label: t.label, ev: t.ev, top: [...by.values()].sort((a, b) => b.c - a.c).slice(0, 5) };
  });
}
export async function reportScreen(me: UserCtx) {
  return { terms: await report(me.org.id), link: `${appUrl()}/r/${me.org.reportToken}`, org: me.org.name, shared: false };
}
/** Shared with a supervisor by link: event totals only, no names. */
export async function sharedReport(tok: string) {
  if (!/^[a-z0-9]{16,32}$/.test(tok)) return null;
  const d = await db();
  const [o] = await d.select().from(orgs).where(and(eq(orgs.reportToken, tok), eq(orgs.status, 'active')));
  if (!o) return null;
  return { terms: (await report(o.id)).map((t) => ({ ...t, top: [] as { n: string; c: number }[] })), link: '', org: o.name, shared: true };
}
export type ReportData = Awaited<ReturnType<typeof reportScreen>>;

export async function journeyScreen(me: UserCtx, id: string) {
  const i = await own(me.org.id, id);
  const { config } = await certFor(i);
  return { id, title: i.title, org: me.org.name, when: i.startsAt ? `${weekdayDate(i.startsAt)} · ${time(i.startsAt)}` : '', date: fullDate(i.startsAt), online: i.online, cert: config, look: await lookOf(i) };
}
