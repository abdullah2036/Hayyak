import 'server-only';
import { and, desc, eq, inArray, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import { CHANNELS, CHANNEL_NAMES, DEFAULT_FREE, DEFAULT_PACKS, MAX_GUESTS } from '@/lib/constants';
import { dayMonth } from '@/lib/dates';
import { db, customRequests, discounts, orders, orgs, services, settings, type Channel, type DB } from '../db';
import { AppError, audit, bad, limit, notFound, type Actor } from '../lib/core';
import { grant } from './credit';

/* ---------- what the founders can change ---------- */

const money = z.number().int().min(0).max(100_000);
export const pricingSchema = z.object({
  packs: z
    .array(z.object({ count: z.number().int().min(1).max(MAX_GUESTS), self: money, email: money, whatsapp: money, on: z.boolean() }))
    .min(1, 'خلّ حزمة وحدة على الأقل')
    .max(12)
    .refine((p) => new Set(p.map((x) => x.count)).size === p.length, 'فيه حزمتين بنفس العدد')
    .refine((p) => p.some((x) => x.on), 'شغّل حزمة وحدة على الأقل'),
  free: z.number().int().min(0).max(500),
  beta: z.object({ on: z.boolean(), quota: z.number().int().min(1).max(20_000), channels: z.array(z.enum(CHANNELS)), services: z.boolean() }),
});
export type Pricing = z.infer<typeof pricingSchema>;

/** Open free credit is off: people who should get it free receive a discount code. WhatsApp stays out even when it is on, because the team sends it by hand. */
const DEFAULT: Pricing = { packs: DEFAULT_PACKS, free: DEFAULT_FREE, beta: { on: false, quota: 300, channels: ['self', 'email'], services: true } };

export async function pricing(tx?: DB): Promise<Pricing> {
  const d = tx ?? (await db());
  const [row] = await d.select().from(settings).where(eq(settings.key, 'pricing'));
  const p = pricingSchema.safeParse(row?.value);
  return p.success ? { ...p.data, packs: [...p.data.packs].sort((a, b) => a.count - b.count) } : DEFAULT;
}
/** What anyone may see: the prices that are on sale. */
export async function publicPricing() {
  const p = await pricing();
  const svc = await (await db()).select({ key: services.key, name: services.name, price: services.price }).from(services).where(eq(services.available, true));
  return { packs: p.packs.filter((x) => x.on).map(({ count, self, email, whatsapp }) => ({ count, self, email, whatsapp })), free: p.free, beta: p.beta.on ? { quota: p.beta.quota, channels: p.beta.channels, services: p.beta.services } : null, services: svc };
}
export async function savePricing(who: Actor, next: Pricing) {
  const d = await db();
  const old = await pricing();
  const value = { ...next, packs: [...next.packs].sort((a, b) => a.count - b.count) };
  await d.insert(settings).values({ key: 'pricing', value, updatedBy: who.name || '' }).onConflictDoUpdate({ target: settings.key, set: { value, updatedBy: who.name || '', updatedAt: new Date() } });
  const diff: string[] = [];
  for (const p of value.packs) {
    const o = old.packs.find((x) => x.count === p.count);
    if (!o) diff.push(`حزمة جديدة ${p.count}`);
    else if (CHANNELS.some((c) => o[c] !== p[c])) diff.push(`${p.count}: ${CHANNELS.map((c) => o[c]).join('/')} ← ${CHANNELS.map((c) => p[c]).join('/')}`);
    else if (o.on !== p.on) diff.push(`${p.count}: ${p.on ? 'شغّال' : 'موقّف'}`);
  }
  for (const o of old.packs) if (!value.packs.some((p) => p.count === o.count)) diff.push(`انحذفت حزمة ${o.count}`);
  if (old.free !== value.free) diff.push(`المجاني ${old.free} ← ${value.free}`);
  if (JSON.stringify(old.beta) !== JSON.stringify(value.beta)) diff.push(value.beta.on ? `البيتا شغّالة · ${value.beta.quota} دعوة` : 'البيتا متوقفة');
  await audit(who, 'عدّل الأسعار', { detail: diff.join(' · ').slice(0, 400) || 'بدون تغيير' });
}

/* ---------- working out an order: the only place a price comes from ---------- */

export type OrderInput = { count: number; channel: Channel; services: string[]; code: string };
type Line = { k: string; v: string; price: number | null };
const sar = (n: number) => `${n.toLocaleString('en-US')} ر.س`;

/** Never throws for a wrong code: the reason goes back to the buyer next to the field. */
export async function quote(tx: DB, orgId: string, o: OrderInput, lock = false) {
  const p = await pricing(tx);
  const pack = p.packs.find((x) => x.count === o.count && x.on);
  if (!pack) throw bad('الحزمة غير متاحة');
  const orgQ = tx.select().from(orgs).where(eq(orgs.id, orgId));
  const [org] = lock ? await orgQ.for('update') : await orgQ;
  if (!org) throw notFound();
  const svc = o.services.length ? await tx.select().from(services).where(and(inArray(services.id, o.services), eq(services.available, true))) : [];

  let beta = p.beta.on && p.beta.channels.includes(o.channel);
  let betaLeft = 0;
  if (beta) {
    const [u] = await tx.select({ n: sql<number>`coalesce(sum(${orders.count}),0)::int` }).from(orders).where(and(eq(orders.orgId, orgId), eq(orders.beta, true), ne(orders.status, 'cancelled')));
    betaLeft = Math.max(0, p.beta.quota - (u?.n ?? 0));
    if (betaLeft < o.count) beta = false;
  }
  const full = pack[o.channel];
  const items: Line[] = [
    { k: `${o.count} دعوة`, v: beta ? 'مجانًا خلال البيتا' : sar(full), price: beta ? 0 : full },
    { k: 'الإرسال', v: CHANNEL_NAMES[o.channel]!, price: null },
    ...svc.map((s): Line => (beta && p.beta.services ? { k: s.name, v: 'مجانًا خلال البيتا', price: 0 } : { k: s.name, v: s.price === null ? 'حسب الطلب' : sar(s.price), price: s.price })),
  ];
  const subtotal = items.reduce((a, i) => a + (i.price || 0), 0);

  let off = Math.floor((subtotal * org.discountPct) / 100);
  let label = off ? `سعر خاص لكم ${org.discountPct}%` : '';
  let used: typeof discounts.$inferSelect | null = null;
  let codeError = '';
  if (o.code && subtotal) {
    const code = o.code.trim().toUpperCase();
    const q = tx.select().from(discounts).where(eq(discounts.code, code));
    const [c] = lock ? await q.for('update') : await q;
    const [mine] = c ? await tx.select({ n: sql<number>`count(*)::int` }).from(orders).where(and(eq(orders.orgId, orgId), eq(orders.discountCode, code), ne(orders.status, 'cancelled'))) : [{ n: 0 }];
    if (!c || !c.active || (c.orgId && c.orgId !== orgId)) codeError = 'الكود غير صحيح';
    else if (c.expiresAt && c.expiresAt < new Date()) codeError = 'انتهى وقت الكود';
    else if (c.maxUses !== null && c.uses >= c.maxUses) codeError = 'انتهت مرات استخدام الكود';
    else if ((mine?.n ?? 0) >= c.perOrg) codeError = 'استخدمت هذا الكود من قبل';
    else {
      const v = c.kind === 'percent' ? Math.floor((subtotal * c.value) / 100) : Math.min(c.value, subtotal);
      // Discounts do not add up: the better one for the customer is used.
      if (v > off) {
        off = v;
        label = `كود ${c.code}`;
        used = c;
      }
    }
  }
  if (off) items.push({ k: 'الخصم', v: `${label} · −${sar(off)}`, price: -off });
  return { items, subtotal, discount: off, total: subtotal - off, beta, betaLeft, codeError, used, svc, quoted: svc.some((s) => s.price === null && !(beta && p.beta.services)), full };
}

export async function quoteFor(orgId: string, o: OrderInput, ip: string) {
  if (o.code) await limit(`code:${orgId}:${ip}`, 30, 3600);
  const q = await quote(await db(), orgId, o);
  return { items: q.items, subtotal: q.subtotal, discount: q.discount, total: q.total, beta: q.beta, codeError: q.codeError };
}

/** Places an order. One that costs nothing is fulfilled at once; the rest wait for the Studio to confirm payment. */
export async function placeOrder(me: { orgId: string; orgName: string; userId: string; email: string }, o: OrderInput, contact: { name: string; email: string; phone: string }) {
  const d = await db();
  return d.transaction(async (t) => {
    const tx = t as unknown as DB;
    // The workspace and the code are locked, so a limit cannot be passed by ordering twice at the same moment.
    const q = await quote(tx, me.orgId, o, true);
    if (o.code && q.codeError) throw new AppError(400, q.codeError, 'bad_code');
    await tx.execute(sql`select pg_advisory_xact_lock(727275)`);
    const [m] = await tx.select({ n: sql<number>`coalesce(max(${orders.number}), 10480)::int` }).from(orders);
    // A pack priced at zero by mistake must not hand out unlimited credit: free means the beta or a discount someone gave.
    const now = q.total === 0 && (q.beta || q.discount > 0);
    const mail = contact.email || me.email;
    const [row] = await tx
      .insert(orders)
      .values({
        number: m!.n + 1, orgId: me.orgId, userId: me.userId, count: o.count, channel: o.channel, items: q.items, total: q.total, discount: q.discount, discountCode: q.used?.code || '', beta: q.beta,
        contact: { name: contact.name || me.orgName, email: mail, phone: contact.phone }, ...(now ? { status: 'paid' as const, decidedBy: q.beta ? 'البيتا' : 'خصم كامل', decidedAt: new Date() } : {}),
      })
      .returning();
    if (q.used) await tx.update(discounts).set({ uses: sql`${discounts.uses} + 1` }).where(eq(discounts.id, q.used.id));
    if (now) await grant(tx, { orgId: me.orgId, count: o.count, channel: o.channel, kind: 'grant', orderId: row!.id, reason: `طلب HY-${row!.number}${q.beta ? ' · البيتا' : ''}` });
    for (const s of q.svc) {
      const line = q.items.find((i) => i.k === s.name);
      await tx.insert(customRequests).values({ orgId: me.orgId, userId: me.userId, title: s.name, description: `مع طلب الشراء HY-${row!.number}`, contactVia: 'واتساب', contactPhone: contact.phone, contactEmail: mail, price: line?.price === null ? '' : line?.v || '' });
    }
    return { number: `HY-${row!.number}`, total: row!.total, items: row!.items, done: now };
  });
}

/* ---------- discount codes ---------- */

export const discountSchema = z
  .object({
    code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{4,24}$/, 'الكود حروف إنجليزية وأرقام، من 4 إلى 24'),
    kind: z.enum(['percent', 'amount']), value: z.number().int().min(1).max(100_000), maxUses: z.number().int().min(1).max(100_000).nullable(), perOrg: z.number().int().min(1).max(100),
    orgId: z.uuid().nullable(), expiresAt: z.iso.datetime().nullable(), note: z.string().trim().max(120),
  })
  .refine((x) => x.kind === 'amount' || x.value <= 100, 'النسبة ما تزيد عن 100');
export async function discountList() {
  const rows = await (await db()).select({ c: discounts, org: orgs.name }).from(discounts).leftJoin(orgs, eq(orgs.id, discounts.orgId)).orderBy(desc(discounts.active), desc(discounts.createdAt)).limit(100);
  return rows.map((x) => ({ id: x.c.id, code: x.c.code, off: x.c.kind === 'percent' ? (x.c.value === 100 ? 'مجاني بالكامل' : `${x.c.value}%`) : sar(x.c.value), uses: x.c.uses, max: x.c.maxUses, perOrg: x.c.perOrg, org: x.org || '', until: x.c.expiresAt ? dayMonth(x.c.expiresAt) : '', ended: Boolean(x.c.expiresAt && x.c.expiresAt < new Date()), active: x.c.active, note: x.c.note }));
}
export async function addDiscount(who: Actor, p: z.infer<typeof discountSchema>) {
  const d = await db();
  if (p.orgId) {
    const [o] = await d.select({ id: orgs.id }).from(orgs).where(eq(orgs.id, p.orgId));
    if (!o) throw bad('اختر المستخدم');
  }
  const r = await d.insert(discounts).values({ ...p, expiresAt: p.expiresAt ? new Date(p.expiresAt) : null, createdBy: who.name || '' }).onConflictDoNothing().returning();
  if (!r.length) throw bad('الكود موجود من قبل');
  await audit(who, 'أضاف كود خصم', { detail: `${p.code} · ${p.kind === 'percent' ? p.value + '%' : sar(p.value)}`, orgId: p.orgId });
}
export async function toggleDiscount(who: Actor, id: string, active: boolean) {
  const r = await (await db()).update(discounts).set({ active }).where(eq(discounts.id, id)).returning();
  if (!r.length) throw notFound();
  await audit(who, active ? 'شغّل كود خصم' : 'وقّف كود خصم', { detail: r[0]!.code });
}
/** A standing price for one workspace: a partner, a student club, or 100 for free. */
export async function setOrgDiscount(who: Actor, orgId: string, pct: number, reason: string) {
  const r = await (await db()).update(orgs).set({ discountPct: pct }).where(eq(orgs.id, orgId)).returning();
  if (!r.length) throw notFound();
  await audit(who, pct ? `حط سعر خاص ${pct}%` : 'شال السعر الخاص', { detail: r[0]!.name, reason, orgId });
}
