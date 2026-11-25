import 'server-only';
import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { and, asc, eq, gt } from 'drizzle-orm';
import { db, memberships, orgs, sessions, staff, trustedDevices, users, type OrgRole, type StaffRole } from '../db';
import { hmac } from './crypto';
import { AppError, forbidden } from './core';

const prod = () => process.env.NODE_ENV === 'production' && (process.env.APP_URL || '').startsWith('https://');
// The __Host- prefix makes the browser refuse the cookie unless it is Secure, host-only and path=/.
const names = () => (prod() ? { user: '__Host-hy', staff: '__Host-hys', device: '__Host-hyd' } : { user: 'hy', staff: 'hys', device: 'hyd' });
const opts = (maxAge: number) => ({ httpOnly: true, secure: prod(), sameSite: 'lax' as const, path: '/', maxAge });

const USER_DAYS = 30;
const USER_IDLE_DAYS = 14;
export const STAFF_IDLE_MIN = 30;
const STAFF_MAX_HOURS = 10;
const raw = () => randomBytes(32).toString('base64url');

export async function startUserSession(userId: string, orgId: string | null, meta: { device: string; ip: string }) {
  const t = raw();
  const d = await db();
  await d.insert(sessions).values({ kind: 'user', userId, orgId, tokenHash: hmac(t), device: meta.device, ip: meta.ip, expiresAt: new Date(Date.now() + USER_DAYS * 864e5) });
  (await cookies()).set(names().user, t, opts(USER_DAYS * 86400));
}
const MFA_MIN = 10;
/** 'mfa' is a short pass that can only be used to enter the authenticator code. */
export async function startStaffSession(staffId: string, meta: { device: string; ip: string }, stage: 'full' | 'mfa') {
  const t = raw();
  const d = await db();
  await d.insert(sessions).values({ kind: 'staff', stage, staffId, tokenHash: hmac(t), device: meta.device, ip: meta.ip, expiresAt: new Date(Date.now() + (stage === 'mfa' ? MFA_MIN * 60_000 : STAFF_MAX_HOURS * 36e5)) });
  // Strict: the Studio is never opened from a link on another site.
  (await cookies()).set(names().staff, t, { ...opts(STAFF_MAX_HOURS * 3600), sameSite: 'strict' });
}
export async function endSession(kind: 'user' | 'staff') {
  const jar = await cookies();
  const n = names()[kind];
  const t = jar.get(n)?.value;
  if (t) await (await db()).delete(sessions).where(eq(sessions.tokenHash, hmac(t)));
  jar.set(n, '', opts(0));
}

export async function trustDevice(userId: string) {
  const jar = await cookies();
  const t = jar.get(names().device)?.value || raw();
  const d = await db();
  const expiresAt = new Date(Date.now() + 90 * 864e5);
  await d.insert(trustedDevices).values({ userId, tokenHash: hmac(t), expiresAt }).onConflictDoUpdate({ target: [trustedDevices.userId, trustedDevices.tokenHash], set: { expiresAt } });
  jar.set(names().device, t, opts(90 * 86400));
}
export async function deviceTrusted(userId: string) {
  const t = (await cookies()).get(names().device)?.value;
  if (!t) return false;
  const d = await db();
  const r = await d.select({ id: trustedDevices.id }).from(trustedDevices).where(and(eq(trustedDevices.userId, userId), eq(trustedDevices.tokenHash, hmac(t)), gt(trustedDevices.expiresAt, new Date())));
  return r.length > 0;
}

export type UserCtx = {
  session: { id: string };
  user: typeof users.$inferSelect;
  org: typeof orgs.$inferSelect;
  role: OrgRole;
  orgsList: { id: string; name: string; role: OrgRole }[];
};

/** Reads the signed-in person. Membership and status are checked on every request, never trusted from the cookie. */
export async function getUser(): Promise<UserCtx | null> {
  const t = (await cookies()).get(names().user)?.value;
  if (!t) return null;
  const d = await db();
  const [row] = await d
    .select({ s: sessions, u: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, hmac(t)), eq(sessions.kind, 'user'), gt(sessions.expiresAt, new Date())));
  if (!row || row.u.status !== 'active') return null;
  if (Date.now() - row.s.lastSeenAt.getTime() > USER_IDLE_DAYS * 864e5) {
    await d.delete(sessions).where(eq(sessions.id, row.s.id));
    return null;
  }
  const list = await d
    .select({ o: orgs, role: memberships.role })
    .from(memberships)
    .innerJoin(orgs, eq(orgs.id, memberships.orgId))
    .where(eq(memberships.userId, row.u.id))
    .orderBy(asc(memberships.createdAt));
  const cur = list.find((m) => m.o.id === row.s.orgId) || list[0];
  if (!cur) return null;
  if (Date.now() - row.s.lastSeenAt.getTime() > 5 * 60_000) {
    const now = new Date();
    await d.update(sessions).set({ lastSeenAt: now }).where(eq(sessions.id, row.s.id));
    await d.update(users).set({ lastSeenAt: now }).where(eq(users.id, row.u.id));
    await d.update(orgs).set({ lastActiveAt: now }).where(eq(orgs.id, cur.o.id));
  }
  return { session: { id: row.s.id }, user: row.u, org: cur.o, role: cur.role, orgsList: list.map((m) => ({ id: m.o.id, name: m.o.name, role: m.role })) };
}

const RANK: Record<OrgRole, number> = { viewer: 0, manager: 1, owner: 2 };
export function needRole(ctx: UserCtx, min: OrgRole) {
  if (RANK[ctx.role] < RANK[min]) throw forbidden();
}
/** A suspended workspace can still be read, but nothing can be changed or sent. */
export function needActive(ctx: UserCtx) {
  if (ctx.org.status !== 'active') throw new AppError(403, 'الحساب موقوف حاليًا، راسلنا على hayyakinfo@gmail.com', 'suspended');
}

export type StaffCtx = { session: { id: string }; staff: typeof staff.$inferSelect };
export async function getStaff(stage: 'full' | 'mfa' = 'full'): Promise<StaffCtx | null> {
  const t = (await cookies()).get(names().staff)?.value;
  if (!t) return null;
  const d = await db();
  const [row] = await d
    .select({ s: sessions, m: staff })
    .from(sessions)
    .innerJoin(staff, eq(staff.id, sessions.staffId))
    .where(and(eq(sessions.tokenHash, hmac(t)), eq(sessions.kind, 'staff'), eq(sessions.stage, stage), gt(sessions.expiresAt, new Date())));
  if (!row || row.m.status === 'disabled' || (stage === 'full' && row.m.status !== 'active')) return null;
  const idle = Date.now() - row.s.lastSeenAt.getTime();
  if (idle > STAFF_IDLE_MIN * 60_000) {
    await d.delete(sessions).where(eq(sessions.id, row.s.id));
    return null;
  }
  if (idle > 30_000) await d.update(sessions).set({ lastSeenAt: new Date() }).where(eq(sessions.id, row.s.id));
  return { session: { id: row.s.id }, staff: row.m };
}

/* ---------- what each Studio role may do ---------- */
export type Perm = 'overview' | 'analytics' | 'sends' | 'requests' | 'design' | 'services' | 'pricing' | 'users' | 'credit' | 'sales' | 'privacy' | 'team';
const PERMS: Record<StaffRole, Perm[]> = {
  founder: ['overview', 'analytics', 'sends', 'requests', 'design', 'services', 'pricing', 'users', 'credit', 'sales', 'privacy', 'team'],
  support: ['overview', 'analytics', 'sends', 'requests', 'users', 'credit', 'sales', 'privacy'],
  design: ['overview', 'requests', 'design'],
};
export const can = (role: StaffRole, p: Perm) => PERMS[role].includes(p);
export const permsOf = (role: StaffRole) => PERMS[role];
