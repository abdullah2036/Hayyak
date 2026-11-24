import 'server-only';
import { and, asc, desc, eq, gte, ilike, inArray, isNull, lt, ne, or, sql } from 'drizzle-orm';
import { CHANNEL_NAMES, CHANNEL_SHORT, PACKS, STAGES } from '@/lib/constants';
import { dayMonth, partsOf, relative, time, until } from '@/lib/dates';
import { db, auditLog, creditLots, customDesigns, customRequests, guests, invitations, memberships, orders, orgs, sendRequests, services, sessions, staff, users, type Channel, type DB, type StaffRole } from '../db';
import { AppError, appUrl, audit, bad, limit, notFound, type Actor } from '../lib/core';
import { send } from '../lib/mail';
import { can, type StaffCtx } from '../lib/session';
import { grant } from './credit';
import { linkOf, log, personalMessage, reminderText, type Guest } from './invitations';

const actor = (me: StaffCtx, ip: string): Actor => ({ type: 'staff', id: me.staff.id, name: me.staff.name, ip });
const monthStart = (back = 0) => {
  const p = partsOf(new Date());
  return new Date(Date.UTC(p.y, p.mo - 1 - back, 1, -3));
};

/* ---------- overview: totals only, never guest names or numbers ---------- */
export async function overview() {
  const d = await db();
  const m0 = monthStart();
  const m1 = monthStart(1);
  const one = async (q: Promise<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);
  const n = sql<number>`count(*)::int`;
  const [activeOrgs, newOrgs, revenue, lastRevenue, sent, byHayyak, bySelf] = await Promise.all([
    one(d.select({ n }).from(orgs).where(eq(orgs.status, 'active'))),
    one(d.select({ n }).from(orgs).where(gte(orgs.createdAt, m0))),
    one(d.select({ n: sql<number>`coalesce(sum(${orders.total}),0)::int` }).from(orders).where(and(eq(orders.status, 'paid'), gte(orders.decidedAt, m0)))),
    one(d.select({ n: sql<number>`coalesce(sum(${orders.total}),0)::int` }).from(orders).where(and(eq(orders.status, 'paid'), gte(orders.decidedAt, m1), lt(orders.decidedAt, m0)))),
    one(d.select({ n }).from(guests).innerJoin(invitations, eq(invitations.id, guests.invitationId)).where(and(eq(guests.charged, true), gte(invitations.createdAt, m0)))),
    one(d.select({ n }).from(invitations).where(and(eq(invitations.audience, 'private'), eq(invitations.sendBy, 'hayyak'), ne(invitations.status, 'draft'), gte(invitations.createdAt, m0)))),
    one(d.select({ n }).from(invitations).where(and(eq(invitations.audience, 'private'), eq(invitations.sendBy, 'self'), ne(invitations.status, 'draft'), gte(invitations.createdAt, m0)))),
  ]);
  const sales = await d.select({ channel: orders.channel, c: sql<number>`count(distinct ${orders.orgId})::int`, r: sql<number>`coalesce(sum(${orders.total}),0)::int` }).from(orders).where(eq(orders.status, 'paid')).groupBy(orders.channel);
  const free = await one(d.select({ n: sql<number>`count(distinct ${creditLots.orgId})::int` }).from(creditLots).where(eq(creditLots.kind, 'free')));
  return { activeOrgs, newOrgs, revenue, lastRevenue, sent, byHayyak, bySelf, sales, free };
}

/* ---------- send requests ---------- */
export async function sends() {
  const d = await db();
  const rows = await d
    .select({ r: sendRequests, title: invitations.title, startsAt: invitations.startsAt, scheduledAt: invitations.scheduledAt, org: orgs.name })
    .from(sendRequests).innerJoin(invitations, eq(invitations.id, sendRequests.invitationId)).innerJoin(orgs, eq(orgs.id, sendRequests.orgId))
    .orderBy(asc(sendRequests.status), asc(invitations.startsAt)).limit(200);
  return rows.map((x) => ({
    id: x.r.id, inv: x.title, who: x.org, n: x.r.count, kind: x.r.kind, status: x.r.status,
    ch: x.r.channels.map((c) => CHANNEL_SHORT[c]).join(' و'), whatsapp: x.r.channels.includes('whatsapp'),
    when: `المناسبة ${until(x.startsAt)}${x.scheduledAt && x.scheduledAt > new Date() ? ` · يبون الإرسال ${dayMonth(x.scheduledAt)} ${time(x.scheduledAt)}` : ''}`,
  }));
}
async function sendReq(id: string) {
  const d = await db();
  const [r] = await d.select({ r: sendRequests, i: invitations, o: orgs }).from(sendRequests).innerJoin(invitations, eq(invitations.id, sendRequests.invitationId)).innerJoin(orgs, eq(orgs.id, sendRequests.orgId)).where(eq(sendRequests.id, id));
  if (!r) throw notFound();
  return r;
}
const reach = async (invitationId: string, kind: string) => {
  const d = await db();
  return d.select().from(guests).where(and(eq(guests.invitationId, invitationId), eq(guests.charged, true), kind === 'reminder' ? eq(guests.status, 'pending') : isNull(guests.sentAt))).orderBy(asc(guests.createdAt));
};

/** New -> sending: the invitation goes live and every email is queued. Sending -> sent: closes the request. */
export async function advanceSend(me: StaffCtx, id: string, ip: string) {
  const { r, i, o } = await sendReq(id);
  const d = await db();
  if (r.status >= 2) throw bad('الطلب منتهي');
  const moved = await d.update(sendRequests).set({ status: r.status + 1, updatedAt: new Date() }).where(and(eq(sendRequests.id, id), eq(sendRequests.status, r.status))).returning({ id: sendRequests.id });
  if (!moved.length) throw bad('حدّث الصفحة وجرّب مرة ثانية');
  if (r.status === 0) {
    if (r.kind === 'invite') await d.update(invitations).set({ status: 'sent', sentAt: i.sentAt ?? new Date() }).where(and(eq(invitations.id, i.id), inArray(invitations.status, ['scheduled', 'sent'])));
    const list = await reach(i.id, r.kind);
    if (r.channels.includes('email')) {
      for (const g of list.filter((x) => x.email)) {
        await send({ to: g.email, guestId: g.id, fromName: o.name, subject: r.kind === 'invite' ? `دعوتك إلى «${i.title}»` : `تذكير: ${i.title}`, title: r.kind === 'invite' ? 'عندك دعوة' : `حيّاك يا ${g.name.split(' ')[0]}`, lines: [r.kind === 'invite' ? personalMessage(i, g) : reminderText(i)], button: { label: 'افتح دعوتك', url: linkOf(i, g) }, note: `من ${o.name} عبر حيّــاك` });
      }
      await d.update(guests).set({ sentVia: 'إيميل' }).where(and(eq(guests.invitationId, i.id), ne(guests.email, ''), eq(guests.sentVia, '')));
    }
  } else if (r.kind === 'invite') {
    await d.update(guests).set({ sentVia: 'واتساب' }).where(and(eq(guests.invitationId, i.id), eq(guests.charged, true), eq(guests.sentVia, '')));
    await d.update(guests).set({ sentAt: new Date() }).where(and(eq(guests.invitationId, i.id), eq(guests.charged, true), isNull(guests.sentAt)));
    await log(d, i.id, `حيّــاك أرسلتها باسمك لـ ${r.count} مدعو`, `${dayMonth(new Date())} · ${time(new Date())} · ${r.channels.map((c) => CHANNEL_SHORT[c]).join(' و')}`, 'main');
    const own = await d.select({ email: users.email }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(and(eq(memberships.orgId, o.id), eq(memberships.role, 'owner')));
    for (const u of own) await send({ to: u.email, subject: `انرسلت دعوات «${i.title}»`, title: 'انرسلت دعواتك', lines: [`أرسلنا ${r.count} دعوة باسم ${o.name}. تابع الردود من لوحتك.`], button: { label: 'تابع الردود', url: `${appUrl()}/app/invitations/${i.id}` } });
  }
  await audit(actor(me, ip), r.status === 0 ? 'بدأ إرسال دعوات' : 'أنهى إرسال دعوات', { detail: `«${i.title}» · ${r.count} مدعو`, reason: 'طلب إرسال من المستخدم', orgId: o.id });
  return { status: r.status + 1 };
}

/** WhatsApp is sent by hand in this version. Opening the list is only possible while the request is active, and it is always logged where the customer can see it. */
export async function recipients(me: StaffCtx, id: string, ip: string) {
  const { r, i, o } = await sendReq(id);
  if (r.status !== 1) throw bad('القائمة تنفتح وقت الإرسال بس');
  if (!r.channels.includes('whatsapp')) throw bad('الطلب ما فيه واتساب');
  await limit(`recips:${me.staff.id}`, 60, 3600);
  await audit(actor(me, ip), 'فتح قائمة إرسال الواتساب', { detail: `«${i.title}» · ${o.name}`, reason: 'تنفيذ طلب الإرسال', orgId: o.id });
  const list = (await reach(i.id, r.kind)).filter((g: Guest) => g.phone);
  return list.map((g) => ({ name: g.name, url: `https://wa.me/${g.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`${r.kind === 'invite' ? personalMessage(i, g) : reminderText(i)}\n${linkOf(i, g)}`)}` }));
}

/* ---------- customisation requests ---------- */
export async function requests() {
  const d = await db();
  const rows = await d.select({ r: customRequests, org: orgs.name, orgId: orgs.id }).from(customRequests).innerJoin(orgs, eq(orgs.id, customRequests.orgId)).orderBy(desc(customRequests.createdAt)).limit(300);
  const plans = await plansOf([...new Set(rows.map((r) => r.orgId))]);
  return rows.map((x) => ({ id: x.r.id, st: x.r.stage, what: x.r.title, who: x.org, plan: plans[x.orgId] || 'مجاني', when: relative(x.r.createdAt), note: x.r.description || 'بدون وصف', via: x.r.contactVia, phone: x.r.contactPhone, mail: x.r.contactEmail, price: x.r.price, message: x.r.message }));
}
async function plansOf(ids: string[]) {
  const out: Record<string, string> = {};
  if (!ids.length) return out;
  const d = await db();
  const lots = await d.select().from(creditLots).where(and(inArray(creditLots.orgId, ids), ne(creditLots.kind, 'free'), or(isNull(creditLots.expiresAt), gte(creditLots.expiresAt, new Date()))));
  const rank = { self: 0, email: 1, whatsapp: 2 };
  const top: Record<string, number> = {};
  for (const l of lots) if ((top[l.orgId] ?? -1) < rank[l.channel]) { top[l.orgId] = rank[l.channel]; out[l.orgId] = CHANNEL_SHORT[l.channel]!; }
  return out;
}
export async function updateRequest(me: StaffCtx, id: string, p: { stage?: number; price?: string; message?: string }, ip: string) {
  const d = await db();
  const [r] = await d.update(customRequests).set({ ...p, updatedAt: new Date() }).where(eq(customRequests.id, id)).returning();
  if (!r) throw notFound();
  if (p.stage !== undefined || p.message) {
    await audit(actor(me, ip), 'حدّث طلب تخصيص', { detail: `${r.title}${p.stage !== undefined ? ' · ' + STAGES[r.stage]![0] : ''}`, orgId: r.orgId });
    const list = await d.select({ email: users.email, notify: users.notify }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(eq(memberships.orgId, r.orgId));
    for (const m of list) if (m.notify.requests !== false) await send({ to: m.email, subject: `تحديث طلبك: ${r.title}`, title: r.title, lines: [STAGES[r.stage]![1], ...(p.message ? [p.message] : [])], button: { label: 'تابع طلبك', url: `${appUrl()}/app/requests` } });
  }
}
export async function deliver(me: StaffCtx, id: string, p: { kind: 'seal' | 'colors' | 'loading'; name: string; scope: 'org' | 'public'; data: Record<string, unknown>; final: boolean }, ip: string) {
  const d = await db();
  const [r] = await d.select().from(customRequests).where(eq(customRequests.id, id));
  if (!r) throw notFound();
  if (p.scope === 'public' && me.staff.role !== 'founder') throw new AppError(403, 'النشر للكل من صلاحية المؤسسين', 'forbidden');
  await d.transaction(async (t) => {
    const tx = t as unknown as DB;
    const [des] = await tx.insert(customDesigns).values({ kind: p.kind, name: p.name, orgId: p.scope === 'org' ? r.orgId : null, data: p.data, approved: p.final }).returning();
    if (r.designId) await tx.delete(customDesigns).where(and(eq(customDesigns.id, r.designId), eq(customDesigns.approved, false)));
    await tx.update(customRequests).set({ designId: des!.id, stage: p.final ? 5 : 4, updatedAt: new Date() }).where(eq(customRequests.id, id));
  });
  await audit(actor(me, ip), p.final ? 'سلّم تصميم خاص' : 'أرسل معاينة تصميم', { detail: `${p.name} · ${r.title}`, orgId: r.orgId });
}
export async function createPattern(me: StaffCtx, p: { name: string; scope: 'org' | 'public'; orgId?: string; data: Record<string, unknown> }, ip: string) {
  const d = await db();
  if (p.scope === 'org') {
    const [o] = await d.select({ id: orgs.id }).from(orgs).where(eq(orgs.id, p.orgId!));
    if (!o) throw bad('اختر المستخدم');
  } else if (me.staff.role !== 'founder') throw new AppError(403, 'النشر للكل من صلاحية المؤسسين', 'forbidden');
  await d.insert(customDesigns).values({ kind: 'pattern', name: p.name, orgId: p.scope === 'org' ? p.orgId! : null, data: p.data });
  await audit(actor(me, ip), 'أضاف نمط جديد', { detail: p.name, orgId: p.scope === 'org' ? p.orgId : null });
}

/* ---------- services ---------- */
export async function serviceList(onlyAvailable = false) {
  const d = await db();
  return d.select().from(services).where(onlyAvailable ? eq(services.available, true) : undefined).orderBy(asc(services.sort), asc(services.name));
}
export async function saveService(me: StaffCtx, id: string | null, p: { name?: string; description?: string; price?: number | null; available?: boolean }, ip: string) {
  const d = await db();
  if (id) {
    const r = await d.update(services).set(p).where(eq(services.id, id)).returning();
    if (!r.length) throw notFound();
  } else await d.insert(services).values({ key: 's' + Date.now().toString(36), name: p.name!, description: p.description || '', price: p.price ?? null, sort: 100 });
  await audit(actor(me, ip), id ? 'عدّل خدمة' : 'أضاف خدمة', { detail: JSON.stringify(p).slice(0, 200) });
}

/* ---------- customers and usage ---------- */
export async function customers(q: string) {
  const d = await db();
  const like = '%' + q.replace(/[\\%_]/g, (c) => '\\' + c) + '%';
  const rows = await d.select().from(orgs).where(q ? ilike(orgs.name, like) : undefined).orderBy(desc(orgs.createdAt)).limit(200);
  const ids = rows.map((r) => r.id);
  if (!ids.length) return [];
  const lots = await d.select().from(creditLots).where(and(inArray(creditLots.orgId, ids), or(isNull(creditLots.expiresAt), gte(creditLots.expiresAt, new Date()))));
  const invs = await d.select({ id: invitations.orgId, n: sql<number>`count(*)::int` }).from(invitations).where(and(inArray(invitations.orgId, ids), ne(invitations.status, 'draft'))).groupBy(invitations.orgId);
  const plans = await plansOf(ids);
  const own = await d.select({ orgId: memberships.orgId, email: users.email, name: users.name }).from(memberships).innerJoin(users, eq(users.id, memberships.userId)).where(and(inArray(memberships.orgId, ids), eq(memberships.role, 'owner')));
  return rows.map((o) => {
    const mine = lots.filter((l) => l.orgId === o.id);
    const total = mine.reduce((a, l) => a + l.total, 0);
    const used = mine.reduce((a, l) => a + l.used, 0);
    const exp = mine.filter((l) => l.expiresAt).sort((a, b) => a.expiresAt!.getTime() - b.expiresAt!.getTime())[0]?.expiresAt;
    return { id: o.id, n: o.name, kind: o.kind || 'حساب', plan: plans[o.id] || 'مجاني', total, used, end: exp ? `ينتهي ${until(exp)}` : 'تجربة مرة وحدة', last: relative(o.lastActiveAt || o.createdAt), status: o.status, invitations: invs.find((i) => i.id === o.id)?.n ?? 0, owner: own.find((u) => u.orgId === o.id)?.email || '' };
  });
}
export async function setOrgStatus(me: StaffCtx, orgId: string, status: 'active' | 'suspended', reason: string, ip: string) {
  if (me.staff.role !== 'founder') throw new AppError(403, 'إيقاف الحسابات من صلاحية المؤسسين', 'forbidden');
  const d = await db();
  const r = await d.update(orgs).set({ status }).where(eq(orgs.id, orgId)).returning();
  if (!r.length) throw notFound();
  await audit(actor(me, ip), status === 'active' ? 'فعّل حساب' : 'أوقف حساب', { detail: r[0]!.name, reason, orgId });
}
export async function grantCredit(me: StaffCtx, p: { orgId: string; count: number; channel: Channel; reason: string }, ip: string) {
  const d = await db();
  const [o] = await d.select().from(orgs).where(eq(orgs.id, p.orgId));
  if (!o) throw notFound();
  await d.transaction((t) => grant(t as unknown as DB, { orgId: o.id, count: p.count, channel: p.channel, kind: 'grant', reason: p.reason }));
  await audit(actor(me, ip), `أضاف رصيد ${p.count} دعوة`, { detail: `${o.name} · ${CHANNEL_NAMES[p.channel]}`, reason: p.reason, orgId: o.id });
}

/* ---------- orders: confirmed by hand until a payment gateway is connected ---------- */
export async function sales() {
  const d = await db();
  const paid = await d.select({ count: orders.count, c: sql<number>`count(*)::int`, r: sql<number>`coalesce(sum(${orders.total}),0)::int` }).from(orders).where(eq(orders.status, 'paid')).groupBy(orders.count);
  const pending = await d.select({ o: orders, org: orgs.name }).from(orders).innerJoin(orgs, eq(orgs.id, orders.orgId)).where(eq(orders.status, 'pending')).orderBy(desc(orders.createdAt)).limit(100);
  const [f] = await d.select({ n: sql<number>`count(*)::int` }).from(creditLots).where(eq(creditLots.kind, 'free'));
  return {
    packs: [{ n: 'مجاني', price: '0', lim: '10 دعوات مرة وحدة للتجربة', c: f?.n ?? 0, r: '0 ر.س' }, ...PACKS.map((p) => { const s = paid.find((x) => x.count === p[0]); return { n: `${p[0]} دعوة`, price: `${p[1]} · ${p[2]} · ${p[3]}`, lim: 'بنفسك · إيميل · واتساب', c: s?.c ?? 0, r: `${(s?.r ?? 0).toLocaleString('en-US')} ر.س` }; })],
    pending: pending.map((x) => ({ id: x.o.id, number: x.o.number, who: x.org, total: x.o.total, what: `${x.o.count} دعوة · ${CHANNEL_NAMES[x.o.channel]}`, items: x.o.items, contact: x.o.contact, when: relative(x.o.createdAt) })),
  };
}
export async function decideOrder(me: StaffCtx, id: string, ok: boolean, ip: string) {
  const d = await db();
  const o = await d.transaction(async (t) => {
    const tx = t as unknown as DB;
    const [row] = await tx.update(orders).set({ status: ok ? 'paid' : 'cancelled', decidedBy: me.staff.name, decidedAt: new Date() }).where(and(eq(orders.id, id), eq(orders.status, 'pending'))).returning();
    if (!row) throw bad('الطلب انتهى من قبل');
    if (ok) await grant(tx, { orgId: row.orgId, count: row.count, channel: row.channel, kind: 'paid', orderId: row.id, reason: `طلب HY-${row.number}` });
    return row;
  });
  await audit(actor(me, ip), ok ? 'أكّد طلب شراء' : 'ألغى طلب شراء', { detail: `HY-${o.number} · ${o.total} ر.س`, orgId: o.orgId });
  const [u] = await d.select().from(users).where(eq(users.id, o.userId));
  if (u) await send({ to: u.email, subject: `طلبك HY-${o.number}`, title: ok ? 'نزل رصيدك' : 'انلغى طلبك', lines: [ok ? `نزل في حسابك رصيد ${o.count} دعوة صالح 30 يوم.` : 'انلغى طلب الشراء. لو فيه خطأ راسلنا على hayyakinfo@gmail.com'], button: { label: 'ادخل لوحتك', url: `${appUrl()}/app` } });
}

/* ---------- privacy log and team ---------- */
export async function auditList() {
  const d = await db();
  const rows = await d.select({ a: auditLog, org: orgs.name }).from(auditLog).leftJoin(orgs, eq(orgs.id, auditLog.orgId)).where(inArray(auditLog.actorType, ['staff', 'system'])).orderBy(desc(auditLog.at)).limit(80);
  return rows.map((x) => ({ time: relative(x.a.at) === 'اليوم' || relative(x.a.at).startsWith('قبل') || relative(x.a.at) === 'الحين' ? time(x.a.at) : relative(x.a.at), who: x.a.actorName || 'النظام', what: [x.a.action, x.a.detail, x.org].filter(Boolean).join(' · '), why: x.a.reason || '—' }));
}
export async function team() {
  const d = await db();
  return d.select().from(staff).where(ne(staff.status, 'disabled')).orderBy(asc(staff.createdAt));
}
export async function addMember(me: StaffCtx, p: { name: string; email: string; role: StaffRole }, ip: string) {
  const d = await db();
  const r = await d.insert(staff).values(p).onConflictDoUpdate({ target: staff.email, set: { name: p.name, role: p.role, status: 'pending' }, setWhere: eq(staff.status, 'disabled') }).returning();
  if (!r.length) throw bad('الإيميل مضاف من قبل');
  await audit(actor(me, ip), 'أضاف عضو للفريق', { detail: `${p.name} · ${p.role}` });
  await send({ to: p.email, subject: 'دعوة لفريق حيّــاك', title: `أهلًا ${p.name}`, lines: [`${me.staff.name} أضافك لفريق إدارة حيّــاك. ادخل الاستوديو بهذا الإيميل، وبيوصلك رمز التحقق عليه.`], button: { label: 'ادخل الاستوديو', url: `${appUrl()}/studio/login` } });
}
export async function removeMember(me: StaffCtx, id: string, ip: string) {
  if (id === me.staff.id) throw bad('ما تقدر تشيل نفسك');
  const d = await db();
  const [m] = await d.select().from(staff).where(eq(staff.id, id));
  if (!m) throw notFound();
  if (m.role === 'founder') {
    const f = await d.select({ id: staff.id }).from(staff).where(and(eq(staff.role, 'founder'), ne(staff.status, 'disabled')));
    if (f.length < 2) throw bad('لازم يبقى مؤسس واحد على الأقل');
  }
  await d.update(staff).set({ status: 'disabled' }).where(eq(staff.id, id));
  await d.delete(sessions).where(eq(sessions.staffId, id));
  await audit(actor(me, ip), 'شال عضو من الفريق', { detail: m.name });
}

/** Everything the Studio page needs, limited to what this role may see. */
export async function studioData(me: StaffCtx) {
  const r = me.staff.role;
  const has = (p: Parameters<typeof can>[1]) => can(r, p);
  const [ov, sendList, reqs, svc, ents, sal, log_, tm] = await Promise.all([
    overview(), has('sends') ? sends() : [], has('requests') ? requests() : [], has('services') ? serviceList() : [], has('users') ? customers('') : [],
    has('sales') ? sales() : null, has('privacy') ? auditList() : [], has('team') ? team() : [],
  ]);
  return { me: { name: me.staff.name, role: r }, overview: has('sales') ? ov : { ...ov, revenue: 0, lastRevenue: 0, sales: [] }, sends: sendList, requests: reqs, services: svc, customers: ents, sales: sal, audit: log_, team: tm.map((m) => ({ id: m.id, n: m.name, mail: m.email, role: m.role, status: m.status, me: m.id === me.staff.id })) };
}
export type StudioData = Awaited<ReturnType<typeof studioData>>;
