import 'server-only';
import { randomInt } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { pack, type Face } from '@/lib/typepack';
import { db, settings } from '../db';
import { audit, bad, type Actor } from '../lib/core';

/** The four files the design uses. The name says which is which; the licence forbids renaming the fonts anyway. */
const NEED: { re: RegExp; family: Face['family']; weight: number; name: string }[] = [
  { re: /serifdisplaybold/, family: 'TD', weight: 700, name: 'Serif Display Bold' },
  { re: /sansregular/, family: 'TS', weight: 400, name: 'Sans Regular' },
  { re: /sansmedium/, family: 'TS', weight: 500, name: 'Sans Medium' },
  { re: /sansbold/, family: 'TS', weight: 700, name: 'Sans Bold' },
];
const MAX = 500_000;
type Saved = { pack: string; names: string[]; size: number };

let cache: { at: number; bytes: Uint8Array<ArrayBuffer> | null } | null = null;

async function saved() {
  const [row] = await (await db()).select().from(settings).where(eq(settings.key, 'type'));
  return row ? { value: row.value as unknown as Saved, by: row.updatedBy, at: row.updatedAt } : null;
}

/** What visitors download. Kept in memory for a minute: it is large and almost never changes. */
export async function typePack() {
  if (!cache || Date.now() - cache.at > 60_000) {
    const s = await saved();
    cache = { at: Date.now(), bytes: s ? new Uint8Array(Buffer.from(s.value.pack, 'base64')) : null };
  }
  return cache.bytes;
}

export async function typeStatus() {
  const s = await saved();
  return { on: Boolean(s), size: s?.value.size ?? 0, by: s?.by ?? '', at: s?.at ?? null, need: NEED.map((n) => n.name) };
}

/** Only real WOFF2 and OpenType files: the first bytes decide, not the extension. */
function isFont(b: Buffer) {
  if (b.length < 1000) return false;
  const tag = b.toString('latin1', 0, 4);
  return tag === 'wOF2' ? b.readUInt32BE(8) === b.length : tag === 'OTTO';
}

export async function saveType(who: Actor, files: File[]) {
  const faces: Face[] = [];
  for (const n of NEED) {
    const f = files.find((x) => n.re.test(x.name.toLowerCase().replace(/[^a-z]/g, '')));
    if (!f) throw bad(`ناقص ملف: ${n.name}`);
    if (f.size > MAX) throw bad(`${n.name}: الملف أكبر من المتوقع`);
    const b = Buffer.from(await f.arrayBuffer());
    if (!isFont(b)) throw bad(`${n.name}: مو ملف خط. الصيغ المتاحة WOFF2 أو OTF`);
    faces.push({ family: n.family, weight: n.weight, bytes: new Uint8Array(b) });
  }
  const bytes = pack(faces, randomInt(1, 2 ** 32 - 1));
  const names = NEED.map((n) => n.name);
  const value = { pack: Buffer.from(bytes).toString('base64'), names, size: bytes.length };
  await (await db())
    .insert(settings)
    .values({ key: 'type', value, updatedBy: who.name || '' })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedBy: who.name || '', updatedAt: new Date() } });
  cache = null;
  await audit(who, 'رفع خط الهوية', { detail: names.join(' · ') });
  return typeStatus();
}

export async function dropType(who: Actor) {
  await (await db()).delete(settings).where(eq(settings.key, 'type'));
  cache = null;
  await audit(who, 'شال خط الهوية');
  return typeStatus();
}
