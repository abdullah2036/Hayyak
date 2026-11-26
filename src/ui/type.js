'use client';
/** The brand typeface is put together by the script at the top of the page (lib/typepack); these wait for it. */
import { unpack } from '@/lib/typepack';

export const typeReady = (ms = 2500) => Promise.race([Promise.resolve(window.__hyType), new Promise((r) => setTimeout(r, ms))]);

/** For text drawn on a canvas, which is never drawn again when a font arrives late. */
export const fontReady = (font, ms) => typeReady(ms).then(() => document.fonts?.load?.(font)).catch(() => {});

/** Pictures are drawn from a copy of the page that knows only the fonts it is handed. Nothing of this is kept on disk. */
export async function typeCss() {
  try {
    if (!(await typeReady())) return '';
    const r = await fetch(window.__hyTypeUrl || '/api/type');
    if (r.status !== 200) return '';
    const url = (b) => new Promise((ok, no) => {
      const f = new FileReader();
      f.onload = () => ok(f.result);
      f.onerror = no;
      f.readAsDataURL(new Blob([b], { type: 'font/woff2' }));
    });
    const faces = unpack(await r.arrayBuffer());
    return (await Promise.all(faces.map(async (f) => `@font-face{font-family:${f.family};font-weight:${f.weight};src:url(${await url(f.bytes)})}`))).join('\n');
  } catch {
    return '';
  }
}
