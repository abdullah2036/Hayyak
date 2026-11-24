'use client';
/** Turns what is on screen into files: invitation image and video, certificate PDF and story image. */
import { saveBlob } from './kit';

const lib = () => import('html-to-image');
let fontCss;

/** A capture shows the finished card, even when the guest taps save while it is still arriving. */
function settle(node) {
  for (const a of node.getAnimations?.({ subtree: true }) ?? []) {
    try {
      if (a.effect?.getComputedTiming().endTime !== Infinity) a.finish();
    } catch {
      /* endless animations keep running */
    }
  }
}

async function snap(node, o) {
  settle(node);
  const { toCanvas, getFontEmbedCSS } = await lib();
  try {
    fontCss ??= await getFontEmbedCSS(node);
  } catch {
    fontCss = '';
  }
  return toCanvas(node, { pixelRatio: 2, cacheBust: false, fontEmbedCSS: fontCss, ...o });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const blobOf = (c, type, q) => new Promise((ok, bad) => c.toBlob((b) => (b ? ok(b) : bad(new Error('ما قدرنا نجهّز الملف'))), type, q));
const keep = (n) => !(n.dataset && n.dataset.nocap !== undefined);

async function image(self) {
  const c = await snap(self.root, { width: 390, height: 844, filter: keep, style: { transform: 'none' } });
  saveBlob(await blobOf(c, 'image/png'), 'hayyak-invite.png');
}

async function video(self, pid) {
  const type = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t));
  const out = document.createElement('canvas');
  if (!type || !out.captureStream) throw new Error('متصفحك ما يدعم الفيديو، احفظها صورة');
  const W = 780;
  const H = 1688;
  out.width = W;
  out.height = H;
  const x = out.getContext('2d');
  const root = self.root;
  // Three still layers; the moving layer is drawn live from the pattern's own canvas.
  const bg = await snap(root, { width: 390, height: 844, filter: (n) => n === root });
  const decor = await snap(root, { width: 390, height: 844, filter: (n) => n === root || (keep(n) && !inFront(n, root) && n.tagName !== 'CANVAS') });
  const front = await snap(root, { width: 390, height: 844, style: { background: 'transparent', backgroundImage: 'none' }, filter: (n) => n === root || (keep(n) && (inFront(n, root) || hasFront(n, root) || isDefs(n))) });
  const pal = self.pal();
  const stream = out.captureStream(30);
  const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 6_000_000 });
  const parts = [];
  rec.ondataavailable = (e) => e.data.size && parts.push(e.data);
  const done = new Promise((ok, bad) => { rec.onstop = ok; rec.onerror = () => bad(new Error('ما قدرنا نجهّز الفيديو')); });
  self.startFx();
  rec.start(500);
  const t0 = performance.now();
  const LEN = 9000;
  await new Promise((ok) => {
    const frame = (now) => {
      const t = now - t0;
      x.globalAlpha = 1;
      x.drawImage(bg, 0, 0, W, H);
      const ease = (a, b) => { const q = Math.min(1, Math.max(0, (t - a) / (b - a))); return 1 - Math.pow(1 - q, 3); };
      if (pid === 'sadu') { x.save(); x.beginPath(); x.rect(0, 0, W, H * ease(300, 3000)); x.clip(); x.drawImage(decor, 0, 0, W, H); x.restore(); } else { x.globalAlpha = ease(0, 900); x.drawImage(decor, 0, 0, W, H); x.globalAlpha = 1; }
      if (pid === 'curtain') { const k = 1 - ease(500, 3000); x.fillStyle = pal.cu; const cw = (W / 2) * k; if (cw > 1) { x.fillRect(0, 0, cw, H * 0.66); x.fillRect(W - cw, 0, cw, H * 0.66); x.fillStyle = 'rgba(0,0,0,.22)'; for (let i = 0; i < 6; i++) { x.fillRect((cw / 6) * i, 0, cw / 18, H * 0.66); x.fillRect(W - (cw / 6) * i - cw / 18, 0, cw / 18, H * 0.66); } } }
      if (self.cv && self.cv.width) x.drawImage(self.cv, 0, 0, W, H);
      const a = ease(pid === 'curtain' ? 2400 : pid === 'sadu' ? 2000 : 500, pid === 'curtain' ? 3600 : pid === 'sadu' ? 3200 : 1700);
      x.globalAlpha = a;
      x.drawImage(front, 0, (1 - a) * 40, W, H);
      if (t < LEN) requestAnimationFrame(frame);
      else ok();
    };
    requestAnimationFrame(frame);
  });
  rec.stop();
  await done;
  saveBlob(new Blob(parts, { type: type.split(';')[0] }), type.startsWith('video/mp4') ? 'hayyak-invite.mp4' : 'hayyak-invite.webm');
}
// The card and the title live inside the element marked data-front.
const inFront = (n, root) => { for (let p = n.nodeType === 1 ? n : n.parentElement; p && p !== root; p = p.parentElement) if (p.dataset && p.dataset.front !== undefined) return true; return false; };
// The seal is painted with gradients kept in an empty svg at the top of the card.
const isDefs = (n) => Boolean(n.closest && n.closest('svg[width="0"]'));
const hasFront = (n) => n.nodeType === 1 && Boolean(n.querySelector && n.querySelector('[data-front]'));

export async function saveInvite(self, kind, pid) {
  await wait(60);
  return kind === 'video' ? video(self, pid) : image(self);
}

/* ---------- certificates ---------- */

/** A one page PDF around a JPEG. Keeps the exact look, including the Arabic type. */
export function pdfFromJpeg(jpeg, w, h) {
  const enc = new TextEncoder();
  const pw = w >= h ? 841.89 : 595.28;
  const ph = (pw * h) / w;
  const draw = `q ${pw.toFixed(2)} 0 0 ${ph.toFixed(2)} 0 0 cm /I Do Q`;
  const objs = [
    '<</Type/Catalog/Pages 2 0 R>>', '<</Type/Pages/Kids[3 0 R]/Count 1>>', `<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${pw.toFixed(2)} ${ph.toFixed(2)}]/Resources<</XObject<</I 4 0 R>>>>/Contents 5 0 R>>`,
    [`<</Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${jpeg.length}>>\nstream\n`, jpeg, '\nendstream'], `<</Length ${draw.length}>>\nstream\n${draw}\nendstream`,
  ];
  const chunks = [];
  let pos = 0;
  const push = (d) => { const b = typeof d === 'string' ? enc.encode(d) : d; chunks.push(b); pos += b.length; };
  push('%PDF-1.4\n');
  const at = objs.map((o, i) => { const p = pos; push(`${i + 1} 0 obj\n`); (Array.isArray(o) ? o : [o]).forEach(push); push('\nendobj\n'); return p; });
  const x = pos;
  push(`xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${at.map((p) => String(p).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${x}\n%%EOF`);
  return new Blob(chunks, { type: 'application/pdf' });
}

async function certCanvas(node) {
  const w = node.clientWidth;
  return snap(node, { pixelRatio: Math.max(2, 2246 / w) });
}
export async function saveCertPdf(node, name) {
  const c = await certCanvas(node);
  const jpeg = new Uint8Array(await (await blobOf(c, 'image/jpeg', 0.94)).arrayBuffer());
  saveBlob(pdfFromJpeg(jpeg, c.width, c.height), name + '.pdf');
}
/** 1080 x 1920 picture with the certificate on a soft background, for stories. */
export async function saveCertStory(node, name, title) {
  const c = await certCanvas(node);
  const s = document.createElement('canvas');
  s.width = 1080;
  s.height = 1920;
  const x = s.getContext('2d');
  const g = x.createLinearGradient(0, 0, 400, 1920);
  g.addColorStop(0, '#123E5C');
  g.addColorStop(0.5, '#0A2A43');
  g.addColorStop(1, '#04121F');
  x.fillStyle = g;
  x.fillRect(0, 0, 1080, 1920);
  const w = 980;
  const h = (w * c.height) / c.width;
  x.shadowColor = 'rgba(0,0,0,.45)';
  x.shadowBlur = 60;
  x.drawImage(c, 50, 960 - h / 2, w, h);
  x.shadowBlur = 0;
  x.direction = 'rtl';
  x.textAlign = 'center';
  x.fillStyle = '#FFFFFF';
  await document.fonts?.load('700 80px TD').catch(() => {});
  x.font = '700 76px TD, serif';
  x.fillText('حيّــاك', 540, 330);
  x.font = "500 40px 'IBM Plex Sans Arabic', sans-serif";
  x.fillStyle = '#CFE7EE';
  x.fillText(title, 540, 420, 960);
  saveBlob(await blobOf(s, 'image/png'), name + '.png');
}
