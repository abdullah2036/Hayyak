import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import type { OrgRole } from '../db';
import { AppError, appUrl, clientIp, deviceLabel, forbidden, limit, notFound } from '../lib/core';
import { can, getStaff, getUser, needActive, needRole, type Perm, type StaffCtx, type UserCtx } from '../lib/session';

/**
 * One table of routes, one place where the rules are enforced:
 * cross-site check -> rate limit -> sign-in -> role -> input validation -> handler.
 * A route without an explicit `auth` does not compile.
 */
type Base<B> = { req: NextRequest; params: Record<string, string>; body: B; ip: string; device: string; query: URLSearchParams };
type Opts<B> = { body?: z.ZodType<B>; rate?: [max: number, seconds: number]; raw?: boolean };

export type UserReq<B = unknown> = Base<B> & { me: UserCtx };
export type StaffReq<B = unknown> = Base<B> & { me: StaffCtx };
export type PublicReq<B = unknown> = Base<B>;

type Auth = { auth: 'public' } | { auth: 'user'; role?: OrgRole; write?: boolean } | { auth: 'staff'; perm: Perm };
type Route = { method: string; parts: string[]; rule: Auth; o: Opts<unknown>; fn: (c: never) => Promise<unknown> };
const routes: Route[] = [];

const add = (method: string, path: string, rule: Auth, o: Opts<unknown>, fn: unknown) => routes.push({ method, parts: path.split('/').filter(Boolean), rule, o, fn: fn as Route['fn'] });

export const pub = <B = unknown>(method: string, path: string, o: Opts<B>, fn: (c: PublicReq<B>) => Promise<unknown>) => add(method, path, { auth: 'public' }, o as Opts<unknown>, fn);
export const user = <B = unknown>(method: string, path: string, o: Opts<B> & { role?: OrgRole; write?: boolean }, fn: (c: UserReq<B>) => Promise<unknown>) =>
  add(method, path, { auth: 'user', role: o.role, write: o.write }, o as Opts<unknown>, fn);
export const studio = <B = unknown>(method: string, path: string, perm: Perm, o: Opts<B>, fn: (c: StaffReq<B>) => Promise<unknown>) => add(method, path, { auth: 'staff', perm }, o as Opts<unknown>, fn);

function match(method: string, parts: string[]) {
  for (const r of routes) {
    if (r.method !== method || r.parts.length !== parts.length) continue;
    const params: Record<string, string> = {};
    if (r.parts.every((p, i) => (p[0] === ':' ? ((params[p.slice(1)] = parts[i]!), true) : p === parts[i]))) return { r, params };
  }
  return null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function uuid(s: string | undefined) {
  if (!s || !UUID.test(s)) throw notFound();
  return s;
}

/** Requests that change something must come from our own pages. Works together with SameSite cookies. */
function sameSite(req: NextRequest) {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = req.headers.get('origin');
  if (!origin) return false;
  if (origin === new URL(appUrl()).origin) return true;
  return process.env.NODE_ENV !== 'production' && origin === req.nextUrl.origin;
}

/** Reads a body up to a size. The declared length can be missing or wrong, so the bytes are counted as they arrive. */
async function readBytes(req: NextRequest, max: number) {
  const tooBig = () => new AppError(413, 'الطلب كبير', 'too_big');
  if (Number(req.headers.get('content-length') || 0) > max) throw tooBig();
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (; reader; ) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw tooBig();
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function readForm(req: NextRequest, max: number) {
  const type = req.headers.get('content-type') || '';
  if (!type.startsWith('multipart/form-data')) throw new AppError(415, 'نوع الطلب غير مدعوم', 'bad_type');
  const bytes = await readBytes(req, max);
  try {
    return await new Response(new Uint8Array(bytes), { headers: { 'content-type': type } }).formData();
  } catch {
    throw new AppError(400, 'الطلب غير مفهوم', 'bad_form');
  }
}

const MAX_JSON = 1_000_000;
async function readJson(req: NextRequest) {
  if (!(req.headers.get('content-type') || '').startsWith('application/json')) throw new AppError(415, 'نوع الطلب غير مدعوم', 'bad_type');
  const text = (await readBytes(req, MAX_JSON)).toString('utf8');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError(400, 'الطلب غير مفهوم', 'bad_json');
  }
}

const NOSTORE = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

export async function handle(req: NextRequest, path: string[]) {
  try {
    const m = match(req.method, path);
    if (!m) throw notFound();
    const { r, params } = m;
    const mutating = req.method !== 'GET';
    if (mutating && !sameSite(req)) throw new AppError(403, 'الطلب مرفوض', 'bad_origin');
    const ip = clientIp(req.headers);
    const device = deviceLabel(req.headers.get('user-agent') || '');
    await limit(`api:${ip}`, 600, 60);
    if (r.o.rate) await limit(`r:${r.method}:${r.parts.join('/')}:${ip}`, r.o.rate[0], r.o.rate[1]);

    let me: UserCtx | StaffCtx | undefined;
    if (r.rule.auth === 'user') {
      const u = await getUser();
      if (!u) throw new AppError(401, 'انتهت الجلسة، ادخل من جديد', 'signed_out');
      if (r.rule.role) needRole(u, r.rule.role);
      if (mutating && r.rule.write !== false) needActive(u);
      me = u;
    } else if (r.rule.auth === 'staff') {
      const s = await getStaff();
      if (!s) throw new AppError(401, 'انتهت الجلسة، ادخل من جديد', 'signed_out');
      if (!can(s.staff.role, r.rule.perm)) throw forbidden();
      me = s;
    }

    let body: unknown;
    if (mutating && !r.o.raw) {
      const json = await readJson(req);
      if (r.o.body) {
        const p = r.o.body.safeParse(json);
        if (!p.success) throw new AppError(400, p.error.issues[0]?.message || 'تأكد من البيانات', 'invalid');
        body = p.data;
      }
    }
    const out = await (r.fn as (c: unknown) => Promise<unknown>)({ req, params, body, ip, device, query: req.nextUrl.searchParams, me });
    if (out instanceof Response) return out;
    return NextResponse.json(out ?? { ok: true }, { headers: NOSTORE });
  } catch (e) {
    if (e instanceof AppError) return NextResponse.json({ error: e.message, code: e.code }, { status: e.status, headers: NOSTORE });
    // Details stay in the server log; the browser only learns that something failed.
    console.error('[api]', req.method, '/' + path.map((p) => (p.length > 24 ? '…' : p)).join('/'), e);
    return NextResponse.json({ error: 'صار خطأ عندنا، جرّب مرة ثانية', code: 'server' }, { status: 500, headers: NOSTORE });
  }
}

/* ---------- shared field rules ---------- */
// Control and bidi-override characters can hide or reorder text, so they are removed everywhere.
const HIDDEN = new RegExp('[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029\u202a-\u202e\u2066-\u2069\ufeff]', 'g');
const clean = (s: string) => s.replace(HIDDEN, '');
export const str = (max: number, min = 0, msg = 'تأكد من البيانات') =>
  z
    .string()
    .transform((s) => clean(s).trim())
    .pipe(z.string().min(min, msg).max(max, 'النص أطول من المسموح'));
export const email = z.string().trim().toLowerCase().max(200).regex(/^[^@\s<>"',;:\\()[\]]+@[^@\s<>"',;:\\()[\]]+\.[a-z0-9-]{2,}$/i, 'اكتب بريد صحيح');
export const optEmail = z.union([z.literal(''), email]);
export const phone = z
  .string()
  .transform((s) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[^\d+]/g, ''))
  .pipe(z.string().max(16))
  .transform((s) => (/^05\d{8}$/.test(s) ? '+966' + s.slice(1) : /^5\d{8}$/.test(s) ? '+966' + s : /^00\d+$/.test(s) ? '+' + s.slice(2) : /^966\d{9}$/.test(s) ? '+' + s : s))
  .pipe(z.string().regex(/^(\+?\d{8,15})?$/, 'رقم الجوال غير صحيح'));
/** Links shown to guests must be plain https addresses, never javascript: or data:. */
export const httpsUrl = z
  .string()
  .trim()
  .max(600)
  .refine((s) => {
    if (!s) return true;
    try {
      const u = new URL(s);
      return u.protocol === 'https:' && !u.username && !u.password && u.hostname.includes('.');
    } catch {
      return false;
    }
  }, 'الرابط لازم يبدأ بـ https://');
export const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'لون غير صحيح');
export const uid = z.string().uuid();
export { z };
