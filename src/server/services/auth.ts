import 'server-only';
import { and, desc, eq, gt, isNull, ne } from 'drizzle-orm';
import { db, creditLedger, creditLots, memberships, orgInvites, orgs, otps, rateLimits, sessions, staff, users, type DB } from '../db';
import { decrypt, digits, encrypt, hashPassword, hmac, safeEqual, token, verifyPassword } from '../lib/crypto';
import { AppError, audit, bad, clearLimit, hit, limit } from '../lib/core';
import { send } from '../lib/mail';
import { checkTotp, newSecret, totpUri } from '../lib/totp';
import { pricing } from './pricing';
import { deviceTrusted, endSession, getStaff, startStaffSession, startUserSession, trustDevice } from '../lib/session';

type Meta = { ip: string; device: string };
const OTP_MIN = 10;
const OTP_TRIES = 5;
export const cleanEmail = (e: string) => e.trim().toLowerCase();

const COMMON = new Set(['12345678', '123456789', '1234567890', 'password', 'password1', 'qwerty123', 'iloveyou', '11111111', '00000000', 'abc12345', 'qwertyuiop', 'password123', '87654321']);
export function checkPassword(pw: string, email: string) {
  if (pw.length < 8) throw bad('كلمة المرور لازم تكون 8 أحرف على الأقل');
  if (pw.length > 200) throw bad('كلمة المرور طويلة');
  const low = pw.toLowerCase();
  if (COMMON.has(low) || /^(.)\1+$/.test(pw) || low === email || low === email.split('@')[0]) throw bad('كلمة المرور سهلة التخمين، اختر غيرها');
}

type Purpose = 'signup' | 'login' | 'reset' | 'studio';
async function issue(purpose: Purpose, email: string, payload: Record<string, unknown> = {}) {
  const d = await db();
  const code = digits(6);
  await d.update(otps).set({ consumedAt: new Date() }).where(and(eq(otps.purpose, purpose), eq(otps.email, email), isNull(otps.consumedAt)));
  await d.insert(otps).values({ purpose, email, payload, codeHash: hmac(`${purpose}:${email}:${code}`), expiresAt: new Date(Date.now() + OTP_MIN * 60_000) });
  return code;
}
/** Checks a code. Five wrong tries burn it. The row is locked so parallel guesses cannot beat the counter. */
async function consume(purpose: Purpose, email: string, code: string) {
  const d = await db();
  return d.transaction(async (tx) => {
    const [row] = await tx
      .select()
      .from(otps)
      .where(and(eq(otps.purpose, purpose), eq(otps.email, email), isNull(otps.consumedAt), gt(otps.expiresAt, new Date())))
      .orderBy(desc(otps.createdAt))
      .limit(1)
      .for('update');
    if (!row) return null;
    if (row.attempts >= OTP_TRIES) return null;
    if (!safeEqual(row.codeHash, hmac(`${purpose}:${email}:${code}`))) {
      await tx.update(otps).set({ attempts: row.attempts + 1 }).where(eq(otps.id, row.id));
      return null;
    }
    await tx.update(otps).set({ consumedAt: new Date() }).where(eq(otps.id, row.id));
    return row;
  });
}
const WRONG_CODE = () => new AppError(400, 'الرمز غلط أو انتهى، جرّب مرة ثانية', 'bad_code');

async function mailCode(email: string, code: string, title: string, line: string) {
  await send({ to: email, subject: `${code} رمز التحقق من حيّــاك`, title, lines: [line], code, note: `الرمز صالح ${OTP_MIN} دقايق. لو ما طلبته تجاهل الرسالة ولا تعطيه أحد.`, now: true });
}

/** Creates a workspace with its one-time free credit. */
export async function createOrg(tx: DB, userId: string, name: string, email: string, free: boolean) {
  const [org] = await tx.insert(orgs).values({ name, contactEmail: email, reportToken: token(24) }).returning();
  await tx.insert(memberships).values({ orgId: org!.id, userId, role: 'owner' });
  const credits = free ? (await pricing(tx)).free : 0;
  if (credits) {
    const [lot] = await tx.insert(creditLots).values({ orgId: org!.id, kind: 'free', channel: 'self', total: credits }).returning();
    await tx.insert(creditLedger).values({ orgId: org!.id, lotId: lot!.id, delta: credits, reason: 'رصيد مجاني للتجربة' });
  }
  return org!;
}

async function joinPendingOrgs(tx: DB, userId: string, email: string) {
  const list = await tx.select().from(orgInvites).where(and(eq(orgInvites.email, email), gt(orgInvites.expiresAt, new Date())));
  for (const i of list) await tx.insert(memberships).values({ orgId: i.orgId, userId, role: i.role }).onConflictDoNothing();
  if (list.length) await tx.delete(orgInvites).where(eq(orgInvites.email, email));
}

/* ---------- customers ---------- */

export async function signup(i: { name: string; email: string; password: string }, m: Meta) {
  const email = cleanEmail(i.email);
  checkPassword(i.password, email);
  await limit(`signup:ip:${m.ip}`, 10, 3600);
  await limit(`otp:${email}`, 5, 3600);
  const d = await db();
  const passwordHash = await hashPassword(i.password);
  const [exists] = await d.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (exists) {
    // Same answer either way, so nobody can find out who has an account.
    await send({ to: email, subject: 'عندك حساب في حيّــاك', title: 'عندك حساب من قبل', lines: ['أحد حاول ينشئ حساب بهذا الإيميل. لو كنت أنت، ادخل بحسابك أو استخدم «نسيت كلمة المرور».'], now: true });
    return;
  }
  const code = await issue('signup', email, { name: i.name, passwordHash });
  await mailCode(email, code, 'أهلًا فيك', 'اكتب هذا الرمز عشان نتأكد إن الإيميل لك:');
}

export async function verifySignup(emailRaw: string, code: string, m: Meta) {
  const email = cleanEmail(emailRaw);
  await limit(`verify:ip:${m.ip}`, 30, 900);
  const row = await consume('signup', email, code);
  if (!row) throw WRONG_CODE();
  const { name, passwordHash } = row.payload as { name: string; passwordHash: string };
  const d = await db();
  const r = await d.transaction(async (tx) => {
    const t = tx as unknown as DB;
    const [u] = await t.insert(users).values({ email, name, passwordHash, emailVerifiedAt: new Date(), certNameAr: name }).onConflictDoNothing().returning();
    if (!u) throw WRONG_CODE();
    const org = await createOrg(t, u.id, name, email, true);
    await joinPendingOrgs(t, u.id, email);
    return { u, org };
  });
  await audit({ type: 'user', id: r.u.id, name, ip: m.ip }, 'أنشأ حساب', { orgId: r.org.id });
  await trustDevice(r.u.id);
  await startUserSession(r.u.id, r.org.id, m);
}

async function firstOrg(userId: string) {
  const d = await db();
  const [r] = await d.select({ id: memberships.orgId }).from(memberships).where(eq(memberships.userId, userId)).limit(1);
  return r?.id ?? null;
}

export async function login(i: { email: string; password: string }, m: Meta): Promise<{ otp: boolean }> {
  const email = cleanEmail(i.email);
  await limit(`login:ip:${m.ip}`, 40, 900);
  // Per account and address, so an attacker cannot lock the owner out from elsewhere; a wider cap slows distributed guessing.
  await limit(`login:${email}:${m.ip}`, 8, 900);
  await limit(`login:${email}`, 60, 3600);
  const d = await db();
  const [u] = await d.select().from(users).where(eq(users.email, email));
  const ok = await verifyPassword(i.password, u?.passwordHash);
  if (!u || !ok) throw new AppError(401, 'الإيميل أو كلمة المرور غلط', 'bad_login');
  if (u.status !== 'active') throw new AppError(403, 'الحساب موقوف، راسلنا على hayyakinfo@gmail.com', 'suspended');
  if (await deviceTrusted(u.id)) {
    await clearLimit(`login:${email}:${m.ip}`);
    await startUserSession(u.id, await firstOrg(u.id), m);
    return { otp: false };
  }
  await limit(`otp:${email}`, 8, 3600);
  const code = await issue('login', email, { userId: u.id });
  await mailCode(email, code, 'دخول من جهاز جديد', 'اكتب هذا الرمز عشان تكمل دخولك:');
  return { otp: true };
}

export async function verifyLogin(emailRaw: string, code: string, m: Meta) {
  const email = cleanEmail(emailRaw);
  await limit(`verify:ip:${m.ip}`, 30, 900);
  const row = await consume('login', email, code);
  const userId = row?.payload.userId as string | undefined;
  if (!userId) throw WRONG_CODE();
  const d = await db();
  const [u] = await d.select().from(users).where(and(eq(users.id, userId), eq(users.status, 'active')));
  if (!u) throw WRONG_CODE();
  await trustDevice(u.id);
  await startUserSession(u.id, await firstOrg(u.id), m);
}

export async function forgot(emailRaw: string, m: Meta) {
  const email = cleanEmail(emailRaw);
  await limit(`forgot:ip:${m.ip}`, 10, 3600);
  await limit(`otp:${email}`, 5, 3600);
  const d = await db();
  const [u] = await d.select().from(users).where(and(eq(users.email, email), eq(users.status, 'active')));
  if (!u) return;
  const code = await issue('reset', email, { userId: u.id });
  await mailCode(email, code, 'استعادة كلمة المرور', 'اكتب هذا الرمز، وبعدها تختار كلمة مرور جديدة:');
}

/** Code and new password travel together, so a code alone never opens an account. */
export async function reset(i: { email: string; code: string; password: string }, m: Meta) {
  const email = cleanEmail(i.email);
  await limit(`verify:ip:${m.ip}`, 30, 900);
  checkPassword(i.password, email);
  const row = await consume('reset', email, i.code);
  const userId = row?.payload.userId as string | undefined;
  if (!userId) throw WRONG_CODE();
  const passwordHash = await hashPassword(i.password);
  const d = await db();
  await d.update(users).set({ passwordHash }).where(eq(users.id, userId));
  await d.delete(sessions).where(eq(sessions.userId, userId)); // sign out everywhere
  await audit({ type: 'user', id: userId, ip: m.ip }, 'غيّر كلمة المرور بالاستعادة');
  await send({ to: email, subject: 'تغيّرت كلمة مرورك', title: 'تغيّرت كلمة مرورك', lines: ['غيّرنا كلمة مرور حسابك وسجّلنا خروج كل الأجهزة. لو ما كنت أنت، راسلنا فورًا على hayyakinfo@gmail.com'] });
  await trustDevice(userId);
  await startUserSession(userId, await firstOrg(userId), m);
}

export async function changePassword(user: { id: string; email: string; passwordHash: string }, sessionId: string, i: { current: string; next: string }, m: Meta) {
  await limit(`pw:${user.id}`, 8, 900);
  checkPassword(i.next, user.email);
  if (!(await verifyPassword(i.current, user.passwordHash))) throw bad('كلمة المرور الحالية غلط');
  const d = await db();
  await d.update(users).set({ passwordHash: await hashPassword(i.next) }).where(eq(users.id, user.id));
  await d.delete(sessions).where(and(eq(sessions.userId, user.id), ne(sessions.id, sessionId)));
  await audit({ type: 'user', id: user.id, ip: m.ip }, 'غيّر كلمة المرور');
  await send({ to: user.email, subject: 'تغيّرت كلمة مرورك', title: 'تغيّرت كلمة مرورك', lines: ['غيّرت كلمة مرور حسابك وسجّلنا خروج باقي الأجهزة. لو ما كنت أنت، راسلنا فورًا على hayyakinfo@gmail.com'] });
}

/* ---------- Studio: an email code, then a code from an authenticator app. Five wrong tries lock it for an hour ---------- */

export async function studioStart(emailRaw: string, m: Meta) {
  const email = cleanEmail(emailRaw);
  await limit(`studio:ip:${m.ip}`, 20, 3600);
  await limit(`studio:otp:${email}`, 6, 3600);
  const d = await db();
  const [s] = await d.select().from(staff).where(and(eq(staff.email, email), ne(staff.status, 'disabled')));
  if (!s) return; // same answer for unknown addresses
  const code = await issue('studio', email, { staffId: s.id });
  await mailCode(email, code, 'دخول الاستوديو', 'رمز الدخول لاستوديو حيّــاك:');
}

export async function studioVerify(emailRaw: string, code: string, m: Meta) {
  const email = cleanEmail(emailRaw);
  // Locked per address as well, so a stranger cannot lock the team out from elsewhere.
  const lockKey = `studio:lock:${email}:${m.ip}`;
  const d = await db();
  const [lock] = await d.select().from(rateLimits).where(and(eq(rateLimits.key, lockKey), gt(rateLimits.resetAt, new Date())));
  if (lock && lock.count >= 5) throw new AppError(429, 'انقفل الدخول ساعة بسبب محاولات غلط كثيرة', 'locked');
  const ok = await consume('studio', email, code);
  const staffId = ok?.payload.staffId as string | undefined;
  if (!staffId) {
    await hit(lockKey, 5, 3600);
    await audit({ type: 'staff', name: email, ip: m.ip }, 'محاولة دخول غلط للاستوديو');
    throw WRONG_CODE();
  }
  const [s] = await d.select().from(staff).where(and(eq(staff.id, staffId), ne(staff.status, 'disabled')));
  if (!s) throw WRONG_CODE();
  await clearLimit(lockKey);
  await startStaffSession(s.id, m, 'mfa');
  if (s.totpAt) return { next: 'code' as const };
  // First sign-in: the same secret is shown until it is confirmed, so a reload does not break the scan.
  const secret = s.totpSecret ? decrypt(s.totpSecret) : newSecret();
  if (!s.totpSecret) await d.update(staff).set({ totpSecret: encrypt(secret) }).where(eq(staff.id, s.id));
  return { next: 'setup' as const, secret, uri: totpUri(secret, s.email) };
}

const RECOVERY = 8;
const cleanRecovery = (c: string) => c.toLowerCase().replace(/[^a-z0-9]/g, '');
export async function studioMfa(code: string, m: Meta) {
  const me = await getStaff('mfa');
  if (!me) throw new AppError(401, 'انتهى الوقت، ابدأ الدخول من جديد', 'signed_out');
  const d = await db();
  const key = `studio:mfa:${me.staff.id}`;
  const [lock] = await d.select().from(rateLimits).where(and(eq(rateLimits.key, key), gt(rateLimits.resetAt, new Date())));
  if (lock && lock.count >= 5) throw new AppError(429, 'انقفل الدخول ساعة بسبب محاولات غلط كثيرة', 'locked');
  const r = await d.transaction(async (tx) => {
    const [s] = await tx.select().from(staff).where(eq(staff.id, me.staff.id)).for('update');
    if (!s || s.status === 'disabled' || !s.totpSecret) return null;
    const step = checkTotp(decrypt(s.totpSecret), code.replace(/\s/g, ''), s.totpStep);
    const first = !s.totpAt;
    let recovery = s.recovery;
    if (!step) {
      const h = hmac(`recovery:${s.id}:${cleanRecovery(code)}`);
      if (first || !recovery.includes(h)) return null;
      recovery = recovery.filter((x) => x !== h); // each one works once
    }
    const codes = first ? Array.from({ length: RECOVERY }, () => token(10)) : [];
    if (first) recovery = codes.map((c) => hmac(`recovery:${s.id}:${c}`));
    await tx.update(staff).set({ status: 'active', lastLoginAt: new Date(), totpAt: s.totpAt ?? new Date(), totpStep: step || s.totpStep, recovery }).where(eq(staff.id, s.id));
    return { s, codes: codes.map((c) => `${c.slice(0, 5)}-${c.slice(5)}`), byRecovery: !step, left: recovery.length };
  });
  if (!r) {
    await hit(key, 5, 3600);
    await audit({ type: 'staff', id: me.staff.id, name: me.staff.name, ip: m.ip }, 'رمز تطبيق التحقق غلط');
    throw WRONG_CODE();
  }
  await clearLimit(key);
  await endSession('staff'); // the short pass is thrown away and a new session starts
  await startStaffSession(r.s.id, m, 'full');
  await audit({ type: 'staff', id: r.s.id, name: r.s.name, ip: m.ip }, r.byRecovery ? 'دخل الاستوديو برمز احتياطي' : 'دخل الاستوديو');
  await send({ to: r.s.email, subject: 'دخول جديد لاستوديو حيّــاك', title: 'دخول جديد للاستوديو', lines: [`دخل حسابك من ${m.device || 'جهاز غير معروف'} (${m.ip}).`, ...(r.byRecovery ? [`الدخول كان برمز احتياطي، وباقي لك ${r.left}.`] : []), 'لو ما كنت أنت، كلّم المؤسسين فورًا عشان يوقفون حسابك.'] });
  return { name: r.s.name, codes: r.codes };
}

/** Clears a lost authenticator. The person sets up a new one at the next sign-in. */
export async function resetTotp(staffId: string) {
  const d = await db();
  await d.update(staff).set({ totpSecret: '', totpAt: null, totpStep: 0, recovery: [] }).where(eq(staff.id, staffId));
  await d.delete(sessions).where(eq(sessions.staffId, staffId));
}
