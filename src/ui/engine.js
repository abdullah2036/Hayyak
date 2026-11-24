'use client';
/** The five motion engines behind the Studio's pattern editor. Runs until the returned function is called. */
export function runEngine(canvas, read) {
  const R = Math.random;
  const t0 = performance.now();
  const W = 230;
  const H = 470;
  let P = [];
  let lastE = -1;
  let nextB = 0;
  let raf = 0;
  const dot = (x, a, b, r) => { x.beginPath(); x.arc(a, b, r, 0, 6.283); x.fill(); };
  const loop = (now) => {
    if (!canvas.isConnected) return;
    const s = read();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
    const x = canvas.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sp = 0.3 + s.spd / 50;
    const den = Math.round(20 + s.den * 1.6);
    const T = now - t0;
    const cols = [s.c3, s.tx, s.c3];
    if (lastE !== s.e) { P = []; lastE = s.e; }
    if (s.e === 1 || s.e === 3) { x.globalCompositeOperation = 'destination-out'; x.fillStyle = `rgba(0,0,0,${s.e === 3 ? 0.25 : 0.18})`; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over'; } else x.clearRect(0, 0, W, H);
    if (s.e === 0) {
      while (P.length < den) P.push({ x: R() * W, y: R() * H * 0.75, r: 0.5 + R() * 1.6, p: R() * 6, v: (R() - 0.5) * 0.15 });
      P.length = den;
      for (const q of P) { q.x = (q.x + q.v * sp + W) % W; x.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(T * 0.002 * sp + q.p)); x.fillStyle = q.p > 3 ? s.c3 : s.tx; dot(x, q.x, q.y, q.r); }
    } else if (s.e === 1) {
      if (T > nextB) { const bx = 30 + R() * (W - 60); const by = 50 + R() * 150; const c = cols[(R() * 3) | 0]; for (let i = 0; i < 30 + s.den * 0.8; i++) { const a = R() * 6.283; const v = (0.6 + R() * 2.2) * sp; P.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c }); } nextB = T + 900 / sp; }
      P = P.filter((q) => { q.vx *= 0.97; q.vy = q.vy * 0.97 + 0.03; q.x += q.vx; q.y += q.vy; q.l -= 0.012 * sp; if (q.l <= 0) return false; x.globalAlpha = q.l; x.fillStyle = q.c; dot(x, q.x, q.y, 1.5); return true; });
    } else if (s.e === 2) {
      while (P.length < den) P.push({ x: R() * W, y: H * 0.3 + R() * H * 0.7, r: 0.6 + R() * 2, p: R() * 6, vy: -(0.2 + R() * 0.5) });
      P.length = den;
      for (const q of P) { q.y += q.vy * sp; q.x += Math.sin(T * 0.001 + q.p) * 0.2; if (q.y < -5) { q.y = H; q.x = R() * W; } x.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(T * 0.003 + q.p)); x.fillStyle = q.p > 3 ? s.c3 : s.tx; dot(x, q.x, q.y, q.r); }
    } else if (s.e === 3) {
      if (R() < 0.04 * sp * (s.den / 50)) P.push({ x: 40 + R() * (W + 40), y: -10 + R() * 120, l: 1 });
      P = P.filter((q) => { q.x -= 5 * sp; q.y += 2.4 * sp; q.l -= 0.012; if (q.l <= 0) return false; x.globalAlpha = q.l; x.strokeStyle = s.c3; x.lineWidth = 1.6; x.beginPath(); x.moveTo(q.x, q.y); x.lineTo(q.x + 22, q.y - 10); x.stroke(); return true; });
    } else {
      const n = Math.round(den * 0.7);
      while (P.length < n) P.push({ x: R() * W, y: -R() * H, w: 4 + R() * 4, h: 7 + R() * 6, r: R() * 6, vr: (R() - 0.5) * 0.1, vy: 0.8 + R() * 1.2, c: [s.c3, s.tx, s.c1][(R() * 3) | 0] });
      P.length = n;
      for (const q of P) { q.y += q.vy * sp; q.r += q.vr * sp; q.x += Math.sin(T * 0.002 + q.r) * 0.4; if (q.y > H + 10) { q.y = -10; q.x = R() * W; } x.save(); x.translate(q.x, q.y); x.rotate(q.r); x.globalAlpha = 0.9; x.fillStyle = q.c; x.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); x.restore(); }
    }
    x.globalAlpha = 1;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}
