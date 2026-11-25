import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/** Authenticator codes (RFC 6238): six digits, thirty seconds, SHA-1 as every authenticator app expects. */
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function newSecret() {
  let bits = '';
  for (const b of randomBytes(20)) bits += b.toString(2).padStart(8, '0');
  return bits.match(/.{5}/g)!.map((x) => A[parseInt(x, 2)]).join('');
}
function bytes(secret: string) {
  let bits = '';
  for (const c of secret) bits += A.indexOf(c).toString(2).padStart(5, '0');
  return Buffer.from(bits.match(/.{8}/g)!.map((x) => parseInt(x, 2)));
}
function at(secret: string, step: number) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(step));
  const h = createHmac('sha1', bytes(secret)).update(msg).digest();
  const o = h[19]! & 15;
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}
/** Returns the step the code belongs to, or 0. A step that was already used (or an older one) is refused. */
export function checkTotp(secret: string, code: string, lastStep: number, now = Date.now()) {
  if (!/^\d{6}$/.test(code)) return 0;
  const cur = Math.floor(now / 30_000);
  let found = 0;
  for (const s of [cur - 1, cur, cur + 1]) if (timingSafeEqual(Buffer.from(at(secret, s)), Buffer.from(code)) && s > lastStep) found = s;
  return found;
}
export const totpUri = (secret: string, email: string) => `otpauth://totp/${encodeURIComponent(`Hayyak Studio:${email}`)}?secret=${secret}&issuer=${encodeURIComponent('Hayyak Studio')}`;
