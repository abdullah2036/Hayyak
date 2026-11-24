import 'server-only';
import { sql } from 'drizzle-orm';
import { db, auditLog, rateLimits } from '../db';

/** An error whose message is safe to show to the person using the site. */
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = 'error',
  ) {
    super(message);
  }
}
export const notFound = () => new AppError(404, 'ما لقينا اللي تدوّر عليه', 'not_found');
export const forbidden = () => new AppError(403, 'ما عندك صلاحية لهذا', 'forbidden');
export const bad = (m: string) => new AppError(400, m, 'bad_request');

export const appUrl = () => (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
export const hostLabel = () => appUrl().replace(/^https?:\/\//, '');

/**
 * Client address. Proxies append to X-Forwarded-For, so only the last TRUSTED_PROXIES entries can be
 * believed; anything before that can be typed in by an attacker.
 */
export function clientIp(h: Headers) {
  const hops = Number(process.env.TRUSTED_PROXIES ?? 1);
  const list = (h.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (hops > 0 && list.length) return (list[Math.max(0, list.length - hops)] || 'unknown').slice(0, 64);
  return 'local';
}

/** Counts a hit and reports whether it is over the limit. Works across several app instances. */
export async function hit(key: string, limit: number, windowSec: number) {
  const d = await db();
  const r = await d
    .insert(rateLimits)
    .values({ key, count: 1, resetAt: new Date(Date.now() + windowSec * 1000) })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.resetAt} < now() then 1 else ${rateLimits.count} + 1 end`,
        resetAt: sql`case when ${rateLimits.resetAt} < now() then excluded.reset_at else ${rateLimits.resetAt} end`,
      },
    })
    .returning();
  const row = r[0]!;
  return { over: row.count > limit, retryAfter: Math.max(1, Math.ceil((row.resetAt.getTime() - Date.now()) / 1000)) };
}
export async function limit(key: string, max: number, windowSec: number) {
  const r = await hit(key, max, windowSec);
  if (r.over) throw new AppError(429, `محاولات كثيرة، جرّب بعد ${r.retryAfter > 90 ? Math.ceil(r.retryAfter / 60) + ' دقيقة' : r.retryAfter + ' ثانية'}`, 'rate_limited');
}
export async function clearLimit(key: string) {
  const d = await db();
  await d.delete(rateLimits).where(sql`${rateLimits.key} = ${key}`);
}

export type Actor = { type: 'user' | 'staff' | 'system' | 'guest'; id?: string; name?: string; ip?: string };
export async function audit(a: Actor, action: string, o: { detail?: string; reason?: string; orgId?: string | null } = {}) {
  const d = await db();
  await d.insert(auditLog).values({
    actorType: a.type,
    actorId: a.id || '',
    actorName: a.name || (a.type === 'system' ? 'النظام' : ''),
    ip: a.ip || '',
    action,
    detail: o.detail || '',
    reason: o.reason || '',
    orgId: o.orgId || null,
  });
}
export const SYSTEM: Actor = { type: 'system', name: 'النظام' };

/** "Safari on iPhone" style label for the device list. */
export function deviceLabel(ua: string) {
  const os = /iPhone/.test(ua) ? 'آيفون' : /iPad/.test(ua) ? 'آيباد' : /Android/.test(ua) ? 'أندرويد' : /Macintosh/.test(ua) ? 'ماك' : /Windows/.test(ua) ? 'ويندوز' : /Linux/.test(ua) ? 'لينكس' : 'جهاز';
  const br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'متصفح';
  return `${os} · ${br}`;
}
