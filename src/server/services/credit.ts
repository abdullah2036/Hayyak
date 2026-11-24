import 'server-only';
import { and, eq, gt, isNull, or, sql } from 'drizzle-orm';
import { CREDIT_DAYS } from '@/lib/constants';
import { db, creditLedger, creditLots, type Channel, type DB } from '../db';
import { AppError } from '../lib/core';

const RANK: Record<Channel, number> = { self: 0, email: 1, whatsapp: 2 };
const alive = (orgId: string) => and(eq(creditLots.orgId, orgId), or(isNull(creditLots.expiresAt), gt(creditLots.expiresAt, new Date())));

export type Balance = {
  total: number;
  used: number;
  left: number;
  byChannel: Record<Channel, number>;
  expiresAt: Date | null;
  boughtAt: Date | null;
  paid: boolean;
  plan: 'free' | Channel;
};

/** What the workspace can spend right now. A pack also covers cheaper ways of sending. */
export async function balance(orgId: string): Promise<Balance> {
  const d = await db();
  const lots = await d.select().from(creditLots).where(alive(orgId));
  const b: Balance = { total: 0, used: 0, left: 0, byChannel: { self: 0, email: 0, whatsapp: 0 }, expiresAt: null, boughtAt: null, paid: false, plan: 'free' };
  let top = -1;
  for (const l of lots) {
    const left = l.total - l.used;
    b.total += l.total;
    b.used += l.used;
    b.left += left;
    for (const c of Object.keys(RANK) as Channel[]) if (RANK[l.channel] >= RANK[c]) b.byChannel[c] += left;
    if (l.kind !== 'free') {
      b.paid = b.paid || left > 0;
      if (RANK[l.channel] > top) {
        top = RANK[l.channel];
        b.plan = l.channel;
      }
      if (l.expiresAt && (!b.expiresAt || l.expiresAt < b.expiresAt)) b.expiresAt = l.expiresAt;
      if (!b.boughtAt || l.createdAt > b.boughtAt) b.boughtAt = l.createdAt;
    }
  }
  return b;
}

/**
 * Takes n invitations from the workspace inside the caller's transaction.
 * Lots are locked, so two requests at the same moment can never spend the same credit.
 */
export async function spend(tx: DB, orgId: string, n: number, need: Channel, reason: string, invitationId: string) {
  if (n <= 0) return;
  const lots = (await tx.select().from(creditLots).where(alive(orgId)).for('update'))
    .filter((l) => RANK[l.channel] >= RANK[need] && l.total > l.used)
    .sort((a, b) => RANK[a.channel] - RANK[b.channel] || (a.expiresAt?.getTime() ?? Infinity) - (b.expiresAt?.getTime() ?? Infinity));
  const have = lots.reduce((s, l) => s + l.total - l.used, 0);
  if (have < n) {
    throw new AppError(402, need === 'self' ? `رصيدك ما يكفي: تحتاج ${n} وباقي لك ${have}. اشترِ رصيد أو قلّل العدد` : `رصيد الإرسال ${need === 'email' ? 'بالإيميل' : 'بالواتساب'} ما يكفي: تحتاج ${n} وباقي لك ${have}`, 'no_credit');
  }
  let rest = n;
  for (const l of lots) {
    if (!rest) break;
    const k = Math.min(rest, l.total - l.used);
    await tx.update(creditLots).set({ used: sql`${creditLots.used} + ${k}` }).where(eq(creditLots.id, l.id));
    await tx.insert(creditLedger).values({ orgId, lotId: l.id, delta: -k, reason, invitationId });
    rest -= k;
  }
}

export async function grant(tx: DB, o: { orgId: string; count: number; channel: Channel; kind: 'paid' | 'grant'; orderId?: string; reason: string }) {
  const [lot] = await tx
    .insert(creditLots)
    .values({ orgId: o.orgId, kind: o.kind, channel: o.channel, total: o.count, orderId: o.orderId || null, expiresAt: new Date(Date.now() + CREDIT_DAYS * 864e5) })
    .returning();
  await tx.insert(creditLedger).values({ orgId: o.orgId, lotId: lot!.id, delta: o.count, reason: o.reason });
  return lot!;
}
