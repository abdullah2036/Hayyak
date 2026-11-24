import 'server-only';
import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { THANK_GROUPS } from '@/lib/constants';
import { db, attendance, certificates, guests, invitations, memberships, nameRequests, orgs, thankNotes, users, type DB } from '../db';
import { token } from '../lib/crypto';
import { AppError, appUrl, bad, limit, notFound } from '../lib/core';
import { send } from '../lib/mail';
import { balance, spend } from './credit';
import { certFor, isOpen, sessionsOf, type CertConfig } from './attendance';
import { endOf, linkOf, liveStatus, lookOf, type Guest, type Inv, type Look } from './invitations';

const SLUG = /^[a-z0-9]{4,24}$/;

/** Finds an invitation that guests may see. Drafts and unsent invitations do not exist for the outside world. */
export async function bySlug(slug: string): Promise<Inv | null> {
  if (!SLUG.test(slug)) return null;
  const d = await db();
  const [r] = await d.select({ i: invitations, s: orgs.status }).from(invitations).innerJoin(orgs, eq(orgs.id, invitations.orgId)).where(eq(invitations.slug, slug));
  if (!r || r.s !== 'active' || r.i.purgedAt) return null;
  if (r.i.status === 'draft' || (r.i.status === 'scheduled' && r.i.audience === 'public')) return null;
  return r.i;
}
export async function byToken(slug: string, tok: string): Promise<{ inv: Inv; g: Guest } | null> {
  const inv = await bySlug(slug);
  if (!inv || !SLUG.test(tok)) return null;
  const d = await db();
  const [g] = await d.select().from(guests).where(and(eq(guests.token, tok), eq(guests.invitationId, inv.id)));
  if (!g || g.archive !== null) return null;
  return { inv, g };
}
export async function guestOnly(tok: string) {
  if (!SLUG.test(tok)) throw notFound();
  const d = await db();
  const [r] = await d.select({ g: guests, i: invitations, s: orgs.status }).from(guests).innerJoin(invitations, eq(invitations.id, guests.invitationId)).innerJoin(orgs, eq(orgs.id, guests.orgId)).where(eq(guests.token, tok));
  if (!r || r.s !== 'active' || r.i.status === 'draft' || r.i.purgedAt || r.g.archive !== null) throw notFound();
  return { inv: r.i, g: r.g };
}

export type InvView = {
  slug: string; look: Look; audience: 'private' | 'public'; startsAt: string | null; durationMin: number; online: boolean; placeName: string; placeArea: string; mapUrl: string; platform: string; liveUrl: string;
  org: { name: string; logo: string }; ended: boolean; free: boolean; url: string;
};
export async function viewOf(inv: Inv): Promise<InvView> {
  const d = await db();
  const [org] = await d.select().from(orgs).where(eq(orgs.id, inv.orgId));
  const end = endOf(inv);
  return {
    slug: inv.slug, look: await lookOf(inv), audience: inv.audience, startsAt: inv.startsAt?.toISOString() ?? null, durationMin: inv.durationMin, online: inv.online, placeName: inv.placeName, placeArea: inv.placeArea,
    mapUrl: inv.mapUrl, platform: inv.platform, liveUrl: inv.liveUrl, org: { name: org!.name, logo: org!.logoAssetId ? `/api/assets/${org!.logoAssetId}` : '' }, ended: Boolean(end && end < new Date()), free: true, url: linkOf(inv),
  };
}

export type CertView = { code: string; kind: 'attend' | 'thanks'; nameAr: string; nameEn: string; issuedAt: string; extraValue: string; config: CertConfig; event: { title: string; startsAt: string | null; durationMin: number } };
export type GuestView = {
  inv: InvView;
  guest: { token: string; name: string; title: string; seal: string; status: string; certNameAr: string; certNameEn: string; extraValue: string };
  stage: 'invite' | 'attend' | 'done' | 'cert';
  partial: boolean;
  attendedAt: string | null;
  session: { mode: 'person' | 'online'; closesAt: string; phase: 'start' | 'end' } | null;
  certs: CertView[];
  thanks: string[];
  cert: { lang: 'ar' | 'bi'; extra: boolean; extraL: string };
  nameRequest: { status: string; toName: string } | null;
  nameLocked: boolean;
};

export async function guestView(inv: Inv, g: Guest): Promise<GuestView> {
  const d = await db();
  const sess = (await sessionsOf(inv.id)).find(isOpen) ?? null;
  const [att] = await d.select().from(attendance).where(and(eq(attendance.invitationId, inv.id), eq(attendance.guestId, g.id)));
  const { config } = await certFor(inv);
  const certRows = await d.select().from(certificates).where(and(eq(certificates.guestId, g.id), eq(certificates.invitationId, inv.id)));
  const notes = await d.select().from(thankNotes).where(eq(thankNotes.invitationId, inv.id));
  const thanks = notes.filter((n) => (THANK_GROUPS[n.group]?.seals ? THANK_GROUPS[n.group]!.seals!.includes(g.seal) : Boolean(att?.complete))).map((n) => n.text);
  const [nr] = await d.select().from(nameRequests).where(eq(nameRequests.guestId, g.id)).orderBy(desc(nameRequests.createdAt)).limit(1);
  const done = Boolean(att?.complete);
  const partial = Boolean(att && !att.complete);
  const stage: GuestView['stage'] = certRows.length ? 'cert' : done ? 'done' : sess && !(partial && sess.phase === 'start') ? 'attend' : thanks.length ? 'done' : 'invite';
  return {
    inv: await viewOf(inv),
    guest: { token: g.token, name: g.name, title: g.title, seal: g.seal, status: g.status, certNameAr: g.certNameAr, certNameEn: g.certNameEn, extraValue: g.extraValue },
    stage, partial, attendedAt: att?.complete ? att.at.toISOString() : null,
    session: sess ? { mode: sess.mode, closesAt: sess.closesAt.toISOString(), phase: sess.phase } : null,
    certs: certRows.map((c) => ({ code: c.code, kind: c.kind, nameAr: c.nameAr, nameEn: c.nameEn, issuedAt: c.issuedAt.toISOString(), extraValue: g.extraValue, config: c.kind === 'thanks' ? { ...config, title: 1 } : config, event: { title: inv.title, startsAt: inv.startsAt?.toISOString() ?? null, durationMin: inv.durationMin } })),
    thanks, cert: { lang: config.lang, extra: config.extra, extraL: config.extraL },
    nameRequest: nr ? { status: nr.status, toName: nr.toName } : null, nameLocked: certRows.length > 0,
  };
}

export async function opened(g: Guest) {
  const d = await db();
  await d.update(guests).set({ openCount: sql`${guests.openCount} + 1`, firstOpenedAt: sql`coalesce(${guests.firstOpenedAt}, now())`, lastOpenedAt: new Date() }).where(eq(guests.id, g.id));
}

export async function rsvp(inv: Inv, g: Guest, answer: 'yes' | 'no' | 'pending') {
  if (liveStatus(inv) === 'ended') throw new AppError(409, 'المناسبة انتهت', 'ended');
  const d = await db();
  const before = g.status;
  await d.update(guests).set({ status: answer, respondedAt: answer === 'pending' ? null : new Date(), certNameAr: g.certNameAr || g.name }).where(eq(guests.id, g.id));
  if (answer !== 'pending' && before !== answer) await notifyOrganisers(inv, g, answer);
}
async function notifyOrganisers(inv: Inv, g: Guest, answer: 'yes' | 'no') {
  const d = await db();
  const list = await d.select({ email: users.email, notify: users.notify }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(eq(memberships.orgId, inv.orgId));
  for (const m of list) if (m.notify.each) await send({ to: m.email, subject: `${g.name} ${answer === 'yes' ? 'أكّد حضوره' : 'اعتذر'}`, title: inv.title, lines: [`${g.name} ${answer === 'yes' ? 'أكّد حضوره' : 'اعتذر عن الحضور'}.`], button: { label: 'افتح الدعوة', url: `${appUrl()}/app/invitations/${inv.id}` } });
}

export async function profile(inv: Inv, g: Guest, p: { certNameAr?: string; certNameEn?: string; extraValue?: string }) {
  const d = await db();
  const has = await d.select({ id: certificates.id }).from(certificates).where(eq(certificates.guestId, g.id)).limit(1);
  if (has.length) throw new AppError(409, 'طلعت الشهادة، أرسل طلب تعديل الاسم', 'locked');
  await d.update(guests).set(p).where(eq(guests.id, g.id));
}
export async function askNameChange(inv: Inv, g: Guest, toName: string) {
  await limit(`namereq:${g.id}`, 3, 86400);
  const d = await db();
  const [c] = await d.select().from(certificates).where(and(eq(certificates.guestId, g.id), eq(certificates.kind, 'attend')));
  if (!c) throw bad('عدّل اسمك مباشرة قبل ما تطلع الشهادة');
  const open = await d.select({ id: nameRequests.id }).from(nameRequests).where(and(eq(nameRequests.guestId, g.id), eq(nameRequests.status, 'pending')));
  if (open.length) throw bad('طلبك وصل وينتظر موافقة المنظّم');
  await d.insert(nameRequests).values({ orgId: inv.orgId, invitationId: inv.id, guestId: g.id, fromName: c.nameAr, toName });
}
export async function downloaded(g: Guest) {
  const d = await db();
  await d.update(certificates).set({ downloads: sql`${certificates.downloads} + 1` }).where(eq(certificates.guestId, g.id));
}

/* ---------- public invitations ---------- */

export async function publicState(inv: Inv) {
  const d = await db();
  const [r] = await d.select({ n: sql<number>`count(*)::int` }).from(guests).where(and(eq(guests.invitationId, inv.id), eq(guests.source, 'public')));
  const left = (await balance(inv.orgId)).byChannel.self;
  const closed = liveStatus(inv) !== 'sent' || Boolean(inv.closesAt && inv.closesAt < new Date());
  return { open: !closed && (r?.n ?? 0) < (inv.cap ?? 0) && left > 0, closed, full: (r?.n ?? 0) >= (inv.cap ?? 0) || left <= 0 };
}

export async function register(inv: Inv, p: { name: string; email: string }, ip: string): Promise<{ token?: string; mailed?: boolean }> {
  if (inv.audience !== 'public') throw notFound();
  // A whole lecture hall can share one Wi-Fi address, so this stays generous; the cap and the credit are the real limits.
  await limit(`reg:${ip}`, 60, 600);
  await limit(`reg:${inv.id}`, 600, 600);
  const st = await publicState(inv);
  if (st.closed) throw new AppError(409, 'انقفل التسجيل', 'closed');
  const d = await db();
  const [org] = await d.select().from(orgs).where(eq(orgs.id, inv.orgId));
  const mail = (g: Guest) => send({ to: p.email, guestId: g.id, fromName: org!.name, subject: `دعوتك إلى «${inv.title}»`, title: `حيّاك يا ${g.name.split(' ')[0]}`, lines: [`يسعدنا حضورك «${inv.title}». هذي دعوتك باسمك:`], button: { label: 'افتح دعوتك', url: linkOf(inv, g) }, note: `من ${org!.name} عبر حيّــاك` });
  const [dup] = await d.select().from(guests).where(and(eq(guests.invitationId, inv.id), eq(guests.email, p.email)));
  if (dup) {
    // The personal link is only ever sent to the address itself, so nobody can open someone else's invitation.
    await limit(`remail:${dup.id}`, 3, 3600);
    await mail(dup);
    return { mailed: true };
  }
  if (st.full) throw new AppError(409, 'اكتمل العدد', 'full');
  const g = await d.transaction(async (t) => {
    const tx = t as unknown as DB;
    const [i] = await tx.select().from(invitations).where(eq(invitations.id, inv.id)).for('update');
    const [c] = await tx.select({ n: sql<number>`count(*)::int` }).from(guests).where(and(eq(guests.invitationId, inv.id), eq(guests.source, 'public')));
    if ((c?.n ?? 0) >= (i!.cap ?? 0)) throw new AppError(409, 'اكتمل العدد', 'full');
    try {
      await spend(tx, inv.orgId, 1, 'self', `تسجيل في «${inv.title}»`, inv.id);
    } catch {
      throw new AppError(409, 'اكتمل العدد', 'full');
    }
    const [row] = await tx
      .insert(guests)
      .values({ orgId: inv.orgId, invitationId: inv.id, token: token(16), name: p.name, certNameAr: p.name, email: p.email, seal: 'مدعو', title: 'ضمن المدعوين', source: 'public', charged: true, sentVia: 'رابط', sentAt: new Date() })
      .returning();
    return row!;
  });
  await mail(g);
  return { token: g.token };
}

/* ---------- "my account": invitations sent to this person's verified email ---------- */

export async function received(email: string) {
  const d = await db();
  const rows = await d
    .select({ g: guests, i: invitations, org: orgs.name })
    .from(guests)
    .innerJoin(invitations, eq(invitations.id, guests.invitationId))
    .innerJoin(orgs, eq(orgs.id, invitations.orgId))
    .where(and(eq(guests.email, email), eq(guests.charged, true), eq(orgs.status, 'active'), inArray(invitations.status, ['sent', 'ended']), isNull(invitations.purgedAt)))
    .orderBy(desc(invitations.startsAt))
    .limit(200);
  const ids = rows.map((r) => r.g.id);
  const att = ids.length ? await d.select().from(attendance).where(and(inArray(attendance.guestId, ids), eq(attendance.complete, true))) : [];
  const certs = ids.length ? await d.select().from(certificates).where(inArray(certificates.guestId, ids)) : [];
  return rows.map((r) => ({ ...r, att: att.find((a) => a.guestId === r.g.id) ?? null, certs: certs.filter((c) => c.guestId === r.g.id) }));
}

export async function certByCode(code: string) {
  if (!/^[a-z0-9]{10,24}$/.test(code)) return null;
  const d = await db();
  const [r] = await d.select({ c: certificates, g: guests, i: invitations }).from(certificates).innerJoin(guests, eq(guests.id, certificates.guestId)).innerJoin(invitations, eq(invitations.id, certificates.invitationId)).where(eq(certificates.code, code));
  if (!r || r.i.purgedAt) return null;
  const { config } = await certFor(r.i);
  const v: CertView = { code, kind: r.c.kind, nameAr: r.c.nameAr, nameEn: r.c.nameEn, issuedAt: r.c.issuedAt.toISOString(), extraValue: '', config: r.c.kind === 'thanks' ? { ...config, title: 1 } : config, event: { title: r.i.title, startsAt: r.i.startsAt?.toISOString() ?? null, durationMin: r.i.durationMin } };
  return v;
}
