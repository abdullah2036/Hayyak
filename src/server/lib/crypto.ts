import 'server-only';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto';

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'; // 32 symbols, no look-alikes

/** Unguessable identifier. 32 symbols = 5 bits each, so 20 characters carry 100 bits. */
export function token(len = 20) {
  const b = randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) s += ALPHABET[b[i]! & 31];
  return s;
}
export const digits = (n: number) => String(randomInt(0, 10 ** n)).padStart(n, '0');
export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

function secret(name: 'APP_SECRET' | 'DATA_KEY') {
  const v = process.env[name];
  if (v && v.length >= 32) return v;
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_SECRETS !== '1') throw new Error(`${name} must be set to at least 32 characters`);
  return `development-only-${name}-never-use-in-production`;
}
export const hmac = (s: string) => createHmac('sha256', secret('APP_SECRET')).update(s).digest('hex');
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(sha256(a));
  const y = Buffer.from(sha256(b));
  return timingSafeEqual(x, y);
}

/* ---------- passwords: scrypt with the OWASP recommended cost ---------- */
const COST = { N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
const derive = (pw: string, salt: Buffer, N: number, r: number, p: number) =>
  new Promise<Buffer>((ok, bad) => scrypt(pw.normalize('NFKC'), salt, 32, { N, r, p, maxmem: COST.maxmem }, (e, k) => (e ? bad(e) : ok(k))));

// Each derivation uses about 128 MB, so only a few run at the same time. Use 1 on a 512 MB server.
const SLOTS = Math.max(1, Number(process.env.PASSWORD_SLOTS) || 2);
let running = 0;
const waiting: (() => void)[] = [];
async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= SLOTS) await new Promise<void>((r) => waiting.push(r));
  running++;
  try {
    return await fn();
  } finally {
    running--;
    waiting.shift()?.();
  }
}
export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = await slot(() => derive(pw, salt, COST.N, COST.r, COST.p));
  return `scrypt$${COST.N}$${COST.r}$${COST.p}$${salt.toString('base64')}$${key.toString('base64')}`;
}
const DUMMY = `scrypt$${COST.N}$8$1$${Buffer.alloc(16).toString('base64')}$${Buffer.alloc(32).toString('base64')}`;
/** Always does the same amount of work, whether or not the account exists. */
export async function verifyPassword(pw: string, stored: string | null | undefined) {
  const [, N, r, p, salt, key] = (stored || DUMMY).split('$');
  const want = Buffer.from(key!, 'base64');
  const got = await slot(() => derive(pw, Buffer.from(salt!, 'base64'), Number(N), Number(r), Number(p)));
  return timingSafeEqual(want, got) && Boolean(stored);
}

/* ---------- archive encryption: AES-256-GCM ---------- */
const dataKey = () => createHash('sha256').update(secret('DATA_KEY')).digest();
export function encrypt(plain: string) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', dataKey(), iv);
  const body = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64');
}
export function decrypt(blob: string) {
  const b = Buffer.from(blob, 'base64');
  const d = createDecipheriv('aes-256-gcm', dataKey(), b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8');
}
