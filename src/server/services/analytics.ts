import 'server-only';
import { and, desc, eq, gte, isNotNull, lt, ne, sql, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { inputDate } from '@/lib/dates';
import { db, attendance, certificates, customRequests, discounts, guests, invitations, orders, orgs } from '../db';

/** The team's own trial workspaces never count. */
export const real = (orgId: PgColumn): SQL => sql`${orgId} not in (select ${orgs.id} from ${orgs} where ${orgs.test})`;

const DAY = 864e5;
const n = sql<number>`count(*)::int`;
// Days are counted in Riyadh time (UTC+3, no daylight saving).
const dayOf = (c: PgColumn) => sql<string>`to_char((${c} at time zone 'UTC') + interval '3 hours', 'YYYY-MM-DD')`;

/** Totals only: no guest names, numbers or addresses leave the database. */
export async function analytics(days: 7 | 30 | 90, withMoney: boolean) {
  const d = await db();
  const today = Date.parse(inputDate(new Date()) + 'T00:00:00Z') - 3 * 36e5; // midnight in Riyadh
  const from = new Date(today - (days - 1) * DAY);
  const before = new Date(from.getTime() - days * DAY);
  const labels = Array.from({ length: days }, (_, i) => inputDate(new Date(from.getTime() + i * DAY + 12 * 36e5)));
  const one = async (q: PromiseLike<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);

  type Source = { key: string; col: PgColumn; run: (since: Date, until?: Date) => { perDay: () => PromiseLike<{ d: string; n: number }[]>; total: () => PromiseLike<{ n: number }[]> } };
  const src = (key: string, table: typeof orgs | typeof invitations | typeof guests | typeof attendance | typeof certificates, col: PgColumn, orgId: PgColumn, extra?: SQL): Source => ({
    key, col,
    run: (since, until) => {
      const w = and(real(orgId), isNotNull(col), gte(col, since), until ? lt(col, until) : undefined, extra);
      return { perDay: () => d.select({ d: dayOf(col), n }).from(table as typeof orgs).where(w).groupBy(sql`1`), total: () => d.select({ n }).from(table as typeof orgs).where(w) };
    },
  });
  const sources = [
    src('signups', orgs, orgs.createdAt, orgs.id),
    src('published', invitations, invitations.sentAt, invitations.orgId, ne(invitations.status, 'draft')),
    src('invited', guests, guests.createdAt, guests.orgId, eq(guests.charged, true)),
    src('opened', guests, guests.firstOpenedAt, guests.orgId),
    src('replied', guests, guests.respondedAt, guests.orgId),
    src('attended', attendance, attendance.at, attendance.orgId, eq(attendance.complete, true)),
  ];
  const series = await Promise.all(
    sources.map(async (s) => {
      const rows = await s.run(from).perDay();
      const map = new Map(rows.map((r) => [r.d, Number(r.n)]));
      const values = labels.map((l) => map.get(l) ?? 0);
      return { key: s.key, values, total: values.reduce((a, b) => a + b, 0), before: await one(s.run(before, from).total()) };
    }),
  );

  // People who signed up in the period, and how far each one got. The outer column is written out in full:
  // without its table name it would be read as the inner table's own id.
  const me = sql.raw('"orgs"."id"');
  const [f] = await d
    .select({
      signed: n,
      made: sql<number>`count(*) filter (where exists (select 1 from ${invitations} i where i.org_id = ${me}))::int`,
      sent: sql<number>`count(*) filter (where exists (select 1 from ${invitations} i where i.org_id = ${me} and i.status <> 'draft'))::int`,
      reply: sql<number>`count(*) filter (where exists (select 1 from ${guests} g where g.org_id = ${me} and g.responded_at is not null))::int`,
      att: sql<number>`count(*) filter (where exists (select 1 from ${attendance} a where a.org_id = ${me}))::int`,
    })
    .from(orgs).where(and(eq(orgs.test, false), gte(orgs.createdAt, from)));

  const inRange = and(real(invitations.orgId), ne(invitations.status, 'draft'), gte(invitations.sentAt, from));
  const name = sql<string>`case when ${invitations.customPatternId} is not null then 'أنماط خاصة' else ${invitations.pattern} end`;
  const [patterns, audience, top, certs, active, reqs] = await Promise.all([
    d.select({ k: name, n }).from(invitations).where(inRange).groupBy(sql`1`).orderBy(desc(n)).limit(8),
    d.select({ k: sql<string>`case when ${invitations.audience} = 'public' then 'دعوات عامة' when ${invitations.sendBy} = 'hayyak' then 'حيّــاك ترسلها' else 'يرسلها بنفسه' end`, n }).from(invitations).where(inRange).groupBy(sql`1`).orderBy(desc(n)),
    d.select({ k: orgs.name, n }).from(guests).innerJoin(orgs, eq(orgs.id, guests.orgId)).where(and(eq(orgs.test, false), eq(guests.charged, true), gte(guests.createdAt, from))).groupBy(orgs.id, orgs.name).orderBy(desc(n)).limit(6),
    one(d.select({ n }).from(certificates).where(and(real(certificates.orgId), gte(certificates.issuedAt, from)))),
    one(d.select({ n }).from(orgs).where(and(eq(orgs.test, false), gte(orgs.lastActiveAt, from)))),
    one(d.select({ n }).from(customRequests).where(and(real(customRequests.orgId), gte(customRequests.createdAt, from)))),
  ]);
  const money = withMoney
    ? (await d
        .select({ paid: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} = 'paid'),0)::int`, orders: n, beta: sql<number>`count(*) filter (where ${orders.beta})::int`, off: sql<number>`coalesce(sum(${orders.discount}) filter (where ${orders.status} = 'paid'),0)::int` })
        .from(orders).where(and(real(orders.orgId), gte(orders.createdAt, from))))[0]!
    : null;
  const codes = withMoney ? await d.select({ k: discounts.code, n: discounts.uses }).from(discounts).where(sql`${discounts.uses} > 0`).orderBy(desc(discounts.uses)).limit(6) : [];
  return {
    days, labels, series, patterns, audience, top, certs, active, requests: reqs, money, codes,
    funnel: [['سجّلوا', f!.signed], ['سوّوا دعوة', f!.made], ['أرسلوها', f!.sent], ['جاهم رد', f!.reply], ['سجّلوا حضور', f!.att]] as [string, number][],
  };
}
export type Analytics = Awaited<ReturnType<typeof analytics>>;
