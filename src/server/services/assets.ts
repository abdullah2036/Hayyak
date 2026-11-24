import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { db, assets } from '../db';
import { AppError, bad, limit } from '../lib/core';

const RULES = {
  logo: { max: 2_000_000, w: 640, h: 640, svg: true, out: 'png' },
  signature: { max: 2_000_000, w: 900, h: 450, svg: false, out: 'png' },
  custom: { max: 2_000_000, w: 640, h: 640, svg: true, out: 'png' },
  photo: { max: 10_000_000, w: 1080, h: 1920, svg: false, out: 'jpeg' },
  certbg: { max: 10_000_000, w: 2480, h: 1754, svg: false, out: 'jpeg' },
} as const;
export type AssetKind = keyof typeof RULES;
const QUOTA = 60_000_000;

/** Looks at the first bytes; the file name and the declared type are never trusted. */
function sniff(b: Buffer): 'png' | 'jpeg' | 'webp' | 'svg' | null {
  if (b.length > 8 && b.readUInt32BE(0) === 0x89504e47) return 'png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.length > 12 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  const head = b.toString('utf8', 0, 600).replace(/^﻿/, '').trimStart().toLowerCase();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'svg';
  return null;
}

/**
 * Re-encodes every upload to a plain PNG or JPEG. That drops hidden metadata (GPS), scripts inside SVG
 * and anything appended to the file, so nothing a user uploads is ever served back as it came in.
 */
export async function store(orgId: string | null, kind: AssetKind, file: File) {
  const r = RULES[kind];
  if (file.size > r.max) throw bad(`حجم الصورة أكبر من ${Math.round(r.max / 1e6)} ميقا`);
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type || (type === 'svg' && !r.svg)) throw bad(r.svg ? 'الصيغ المتاحة: PNG أو JPG أو WebP أو SVG' : 'الصيغ المتاحة: PNG أو JPG أو WebP');
  if (type === 'svg') {
    const s = buf.toString('utf8');
    if (/<!ENTITY|<!DOCTYPE|xlink:href\s*=\s*["'](?!#|data:image\/(png|jpe?g))|href\s*=\s*["'](?!#|data:image\/(png|jpe?g))|<script|<foreignObject|url\(\s*["']?(?!#)/i.test(s)) throw bad('ملف SVG فيه عناصر غير مسموحة، صدّره PNG');
  }
  const d = await db();
  if (orgId) {
    await limit(`up:${orgId}`, 60, 3600);
    const [u] = await d.select({ n: sql<number>`coalesce(sum(length(${assets.bytes})),0)::bigint` }).from(assets).where(eq(assets.orgId, orgId));
    if (Number(u?.n ?? 0) > QUOTA) throw bad('وصلت الحد الأعلى لحجم الصور');
  }
  const { default: sharp } = await import('sharp');
  try {
    let img = sharp(buf, { limitInputPixels: 40_000_000, density: type === 'svg' ? 200 : undefined, failOn: 'error' }).rotate().resize({ width: r.w, height: r.h, fit: 'inside', withoutEnlargement: type !== 'svg' });
    img = r.out === 'png' ? img.png({ compressionLevel: 9 }) : img.flatten({ background: '#ffffff' }).jpeg({ quality: 84 });
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    const [row] = await d.insert(assets).values({ orgId, kind, mime: r.out === 'png' ? 'image/png' : 'image/jpeg', width: info.width, height: info.height, bytes: data }).returning({ id: assets.id, width: assets.width, height: assets.height });
    return { id: row!.id, url: `/api/assets/${row!.id}`, width: row!.width, height: row!.height };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw bad('ما قدرنا نقرأ الصورة، جرّب ملف ثاني');
  }
}

export async function read(id: string) {
  const d = await db();
  const [a] = await d.select().from(assets).where(eq(assets.id, id));
  return a ?? null;
}
export async function ownsAsset(orgId: string, url: string, kinds: AssetKind[]) {
  if (!url) return '';
  const m = url.match(/^\/api\/assets\/([0-9a-f-]{36})$/);
  if (!m) throw bad('الصورة غير صحيحة');
  const d = await db();
  const [a] = await d.select({ kind: assets.kind }).from(assets).where(and(eq(assets.id, m[1]!), eq(assets.orgId, orgId)));
  if (!a || !kinds.includes(a.kind)) throw bad('الصورة غير موجودة');
  return url;
}
