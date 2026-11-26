import 'server-only';
import { desc, gte, lt, sql } from 'drizzle-orm';
import { db, clientEvents } from '../db';

/** "iPhone · iOS 17.4" from a user agent: enough to see which devices have problems, nothing that identifies anyone. */
export function deviceOf(ua: string) {
  const ios = ua.match(/(iPhone|iPad|iPod).*?OS (\d+)[_.](\d+)/);
  if (ios) return `${ios[1]} · iOS ${ios[2]}.${ios[3]}${/CriOS/.test(ua) ? ' · Chrome' : ''}`;
  const and = ua.match(/Android (\d+(?:\.\d+)?)/);
  const browser = /SamsungBrowser/.test(ua) ? 'Samsung' : /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'متصفح آخر';
  if (and) return `Android ${and[1]} · ${browser}`;
  const os = /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : '';
  return [os, browser].filter(Boolean).join(' · ');
}

export async function saveReport(r: { kind: 'error' | 'crash'; path: string; message: string; screen: string }, ua: string) {
  await (await db()).insert(clientEvents).values({ kind: r.kind, path: r.path, message: r.message, device: `${deviceOf(ua)} · ${r.screen}`.slice(0, 120) });
}

/** For the Studio: the last week, by page, and the latest reports. */
export async function reportList() {
  const d = await db();
  const since = new Date(Date.now() - 7 * 864e5);
  const byPage = await d
    .select({ path: clientEvents.path, kind: clientEvents.kind, n: sql<number>`count(*)::int` })
    .from(clientEvents)
    .where(gte(clientEvents.createdAt, since))
    .groupBy(clientEvents.path, clientEvents.kind)
    .orderBy(desc(sql`count(*)`))
    .limit(20);
  const recent = await d.select().from(clientEvents).orderBy(desc(clientEvents.createdAt)).limit(30);
  return { byPage, recent: recent.map((r) => ({ id: r.id, kind: r.kind, path: r.path, message: r.message, device: r.device, at: r.createdAt })) };
}

export async function pruneReports() {
  await (await db()).delete(clientEvents).where(lt(clientEvents.createdAt, new Date(Date.now() - 30 * 864e5)));
}
