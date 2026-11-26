'use client';
import { fontReady } from '@/ui/type';
import InviteView from '@/views/Invite.view';
import { Screen } from '@/ui/dc';
import { loadQr, qrCells, waxPath } from '@/ui/kit';
import { saveInvite } from '@/ui/capture';
import { fullDate, time } from '@/lib/dates';

/** Lighter (k > 0) or darker (k < 0) version of a colour, for custom wax seals. */
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(k > 0 ? c + (255 - c) * k : c * (1 + k))));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, '0')).join('');
}

/**
 * The animated invitation. Draws one of ten patterns behind the card for ten seconds, stamps the seal,
 * and then lets the guest answer, save the date, or keep the invitation as an image or a video.
 * The card is always 390 x 844 and is scaled by whoever shows it.
 */
export default class Invite extends Screen {
  static View = InviteView;

constructor(p) { super(p); this.state = { phase: 'load', run: 0, gname: '', gmail: '', rsvp: p.rsvp || '', sheet: '', saved: '', cal: false, nudge: false, touched: false, settled: false, gateMsg: '', gateBusy: false, saveErr: '', qr: null }; this.ptr = { x: -1, y: -1, t: 0 }; this.ori = { b: 0, g: 0, t: 0 }; }
componentDidMount() { var self = this; this.onOri = function (e) { if (e.gamma == null) return; self.ori = { b: e.beta || 0, g: e.gamma || 0, t: performance.now() }; }; window.addEventListener('deviceorientation', this.onOri); this.watch(); this.arm(); if (!this.px().thumb) loadQr().then(function (q) { if (!self.gone) self.setState({ qr: q }); }); }
componentDidUpdate(pp) { var k = this.fxKey(this.px()); if (k !== this.lastKey) { this.lastKey = k; if (this.state.phase === 'open') this.startFx(); } if (pp.rsvp !== this.props.rsvp && this.props.rsvp !== undefined) this.setState({ rsvp: this.props.rsvp || '' }); }
fxKey(P) { return [P.pattern, P.color, P.title, P.latin, JSON.stringify(P.customColors || 0), JSON.stringify(P.engine || 0)].join('|'); }
componentWillUnmount() { this.gone = true; if (this.io) this.io.disconnect(); clearTimeout(this.t); clearTimeout(this.ts); clearTimeout(this.tn); window.removeEventListener('deviceorientation', this.onOri); this.stopFx(); }

/** One shape for both ways of using the card: demo props, or a saved invitation's look and details. */
px() {
  var P = this.props, L = P.look || {}, I = P.info || L.info || {};
  return {
    pattern: L.engine ? 'محرك' : (L.pattern || P.pattern || 'لمّة نجوم'), color: L.customColors ? 'مخصص' : (P.look && L.color !== undefined ? 'لون ' + (L.color + 1) : (P.color || 'لون 1')), customColors: L.customColors, engine: L.engine,
    seal: P.sealName || L.seal || P.seal || 'VIP', customSeal: L.customSeal, customLoading: L.customLoading, title: L.title || P.title || (P.look ? ' ' : 'ليلة التكريم'), latin: P.look ? (L.latin || '') : (P.latin || ''), eventLabel: P.look ? (L.eventLabel || '') : (P.eventLabel || ''),
    bgImage: L.photo || P.bgImage || '', audience: P.audience || 'شخصية', place: P.place || (I.online ? 'عن بعد' : 'حضوري'), platform: I.platform || P.platform || 'Zoom', placeName: I.placeName || '', placeArea: I.placeArea || '', mapUrl: I.mapUrl || '', liveUrl: I.liveUrl || '', startsAt: I.startsAt || null, durationMin: I.durationMin || 120,
    linkStatus: P.linkStatus || (I.liveUrl ? 'الرابط جاهز' : 'يوصل لاحقًا'), thumb: P.thumb === 'نعم', preview: P.preview === 'نعم', entity: I.entity || P.entity || 'اسم المنظّم', logo: I.logo || '', name: P.name || 'سارة أحمد', org: P.org !== undefined ? P.org : 'صفة المدعو', url: I.url || '', ended: Boolean(I.ended), uid: I.slug || 'demo'
  };
}
general() { return this.px().audience === 'عامة'; }
/** Phones die when a page runs many of these at once: a thumbnail draws only while it can be seen, and only once. */
watch() {
  var self = this;
  if (!this.px().thumb) { this.vis = true; return; }
  this.vis = false;
  if (typeof IntersectionObserver === 'undefined' || !this.root) { this.vis = true; return; }
  this.io = new IntersectionObserver(function (es) {
    var on = es[es.length - 1].isIntersecting;
    if (on === self.vis) return;
    self.vis = on;
    if (!on) self.stopFx(); else if (self.state.phase === 'open' && !self.fxDone) self.startFx();
  }, { rootMargin: '120px' });
  this.io.observe(this.root);
}
arm() { var self = this; clearTimeout(this.t); this.stopFx(); this.clearCanvas(); this.t = setTimeout(function () { var ph = self.general() ? 'gate' : 'open'; self.setState({ phase: ph, run: self.state.run + 1, settled: false }); if (ph === 'open') self.startFx(); }, self.px().thumb ? 60 : 2800); }
pid() { var map = { 'لمّة نجوم': 'ptext', 'اسمك من نجوم': 'ptext', 'لمعة لؤلؤ': 'holo', 'من القلب': 'warp', 'ألعاب نارية': 'fireworks', 'رشّة فرح': 'confetti', 'انفتح الستار': 'curtain', 'مرّ شهاب': 'meteors', 'فقاعات': 'meteors', 'سجادة الحفل': 'meteors', 'فلاشات الحفل': 'meteors', 'ضوء يلحقك': 'dust', 'سدو ينتسج': 'sadu', 'سدو': 'sadu', 'العنوان من نجوم': 'ptext', 'هولوغرام': 'holo', 'انطلاقة': 'warp', 'احتفال': 'confetti', 'ستارة': 'curtain', 'شهب': 'meteors', 'غبار ضوء': 'dust', 'السدو': 'sadu', 'صورة خاصة': 'photo', 'محرك': 'pe' }; return map[this.px().pattern] || 'ptext'; }
pal() {
  var P = this.px();
  function hexRgb(h) { h = (h || '#000000').replace('#', ''); if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join(''); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function lum(h) { var c = hexRgb(h); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
  function rgba(h, a) { var c = hexRgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mk(nm, top, mid, bot, a1, a2, dark, o) {
    o = o || {};
    return { name: nm, bg: (o.bgx ? o.bgx + ', ' : '') + 'radial-gradient(120% 80% at 70% 0%, ' + top + ' 0%, ' + mid + ' 50%, ' + bot + ' 100%)', c1: a1, c2: a2, c3: o.c3 || rgba(a1, .75), tx: dark ? '#FFFFFF' : '#0A2A43', bt: lum(a2) > 0.6 ? '#0A2A43' : '#FFFFFF', scA: rgba(bot, .85), scB: rgba(bot, .35), gl: dark ? 'rgba(255,255,255,.1)' : 'rgba(10,42,67,.06)', ln: dark ? 'rgba(255,255,255,.25)' : 'rgba(10,42,67,.2)', cu: o.cu || mid, lc: dark ? '#DCE4E8' : '#0A2A43', ring: dark ? bot : '#FFFFFF', dark: !!dark, h: o.h || ['#FFD6E8', '#CFF4FF', '#E8E1FF', '#D9FFF0'], fx: o.fx || null, sd: o.sd || null };
  }
  var NAVY = ['#123E5C', '#0A2A43', '#04121F'], SEA = ['#12A3BA', '#0A5E78', '#071D30'], PEARL = ['#FFFFFF', '#EDF1F3', '#CFE7EE'], BLACK = ['#26262C', '#0E0E12', '#000000'];
  var T = {
    ptext: [mk('ليلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1), mk('أسود', BLACK[0], BLACK[1], BLACK[2], '#FFFFFF', '#E9E4D8', 1, { c3: '#E7C873' }), mk('زمردي', '#0F4A3C', '#062A20', '#02130E', '#E7C873', '#FFF6DA', 1, { c3: '#FFFFFF' })],
    holo: [mk('لؤلؤي', PEARL[0], PEARL[1], PEARL[2], '#0E97AE', '#0A2A43', 0), mk('تركوازي', '#3CC3D6', '#0E97AE', '#06606F', '#FFFFFF', '#FFFFFF', 1, { c3: '#CFF4FF', h: ['#BFF3FA', '#FFD6EC', '#E3FFF4', '#D6E4FF'] }), mk('ليلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1, { h: ['#1E6B8F', '#5B3FA0', '#0E97AE', '#2A3F8F'] })],
    warp: [mk('ليلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1), mk('أسود', BLACK[0], BLACK[1], BLACK[2], '#FFFFFF', '#E9E4D8', 1, { c3: '#9FB4FF' }), mk('درب التبانة', '#2B1B4F', '#120A2A', '#05030F', '#C9B8FF', '#FFFFFF', 1, { fx: ['#FFFFFF', '#9FB4FF', '#FFC8E8', '#FFE3A8', '#B39CFF'], bgx: 'linear-gradient(125deg, rgba(0,0,0,0) 28%, rgba(255,160,215,.16) 42%, rgba(170,185,255,.22) 52%, rgba(255,227,168,.1) 60%, rgba(0,0,0,0) 72%)' })],
    fireworks: [mk('بحري', SEA[0], SEA[1], SEA[2], '#86DCEA', '#DCE4E8', 1, { fx: ['#86DCEA', '#FFFFFF', '#FFD166'] }), mk('أسود', BLACK[0], BLACK[1], BLACK[2], '#FFD166', '#FFF1CC', 1, { fx: ['#FFD166', '#FFFFFF', '#FF6B8B'] }), mk('بنفسجي ملكي', '#3A1F6E', '#1C0F3A', '#0A0518', '#E7C873', '#FFF6DA', 1, { fx: ['#E7C873', '#F2B8C6', '#FFFFFF'] })],
    confetti: [mk('لؤلؤي', PEARL[0], PEARL[1], PEARL[2], '#0E97AE', '#0A2A43', 0, { fx: ['#0E97AE', '#86DCEA', '#0A2A43', '#F2B8C6', '#FFD166'] }), mk('وردي', '#FFFFFF', '#FFF4F6', '#FADDE4', '#E8577A', '#5A1426', 0, { fx: ['#E8577A', '#FFB3C6', '#FFD166', '#B39CFF', '#5A1426'] }), mk('ليلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1, { fx: ['#86DCEA', '#FFD166', '#FF6B8B', '#7CF0C8', '#FFFFFF'] })],
    curtain: [mk('عنابي', '#3A0F18', '#1E070D', '#0A0205', '#FFD9A0', '#FFF3E0', 1, { cu: '#8C1D2C' }), mk('كحلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1, { cu: '#0E3B5A' }), mk('زمردي', '#0F4A3C', '#06281F', '#021410', '#E7C873', '#FFF6DA', 1, { cu: '#0E5A45' })],
    meteors: [mk('ليلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1, { fx: ['#FFFFFF', '#86DCEA', '#CFE7EE'] }), mk('أسود', BLACK[0], BLACK[1], BLACK[2], '#FFFFFF', '#E9E4D8', 1, { fx: ['#FFFFFF', '#FFE3A8', '#E9E4D8'] }), mk('بحري', SEA[0], SEA[1], SEA[2], '#DCE4E8', '#FFFFFF', 1, { fx: ['#FFFFFF', '#86DCEA', '#F2B8C6'] })],
    sadu: [mk('بحري', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1, { sd: ['#0E97AE', '#04121F', '#DCE4E8', '#86DCEA'] }), mk('تقليدي', '#4A2418', '#2A140E', '#120806', '#E7C873', '#F4EEE4', 1, { sd: ['#9E2B2B', '#140A06', '#EFE6D6', '#E7C873'], cu: '#9E2B2B' }), mk('رملي', '#FFFFFF', '#F4EEE4', '#E6D7BC', '#9A5226', '#3A2A1E', 0, { sd: ['#B8892A', '#3A2A1E', '#FBF6EC', '#C9733A'] })],
    photo: [mk('صورة', '#2A3540', '#141B22', '#06090C', '#FFFFFF', '#FFFFFF', 1), mk('صورة', '#2A3540', '#141B22', '#06090C', '#FFFFFF', '#FFFFFF', 1), mk('صورة', '#2A3540', '#141B22', '#06090C', '#FFFFFF', '#FFFFFF', 1)],
    dust: [mk('بنفسجي', '#4A2C78', '#2C1550', '#140826', '#F2B8C6', '#FFFFFF', 1), mk('ليلي', NAVY[0], NAVY[1], NAVY[2], '#86DCEA', '#DCE4E8', 1), mk('أسود ذهبي', BLACK[0], BLACK[1], BLACK[2], '#E7C873', '#FFF1CC', 1, { c3: '#FFFFFF' })]
  };
  if (P.engine) { var E = P.engine, dkE = lum(E.c2) < 0.6; var em = mk('محرك', E.c1, E.c2, E.c2, E.c3, E.tx, dkE, { c3: E.c3 }); em.bg = 'radial-gradient(120% 70% at 70% 0%,' + E.c1 + ',' + E.c2 + ' 75%)'; em.tx = E.tx; em.ring = dkE ? E.c2 : '#FFFFFF'; return em; }
  if (P.customColors) { var CC = P.customColors, dkC = lum(CC.c2) < 0.6; var cm = mk('مخصص', CC.c1, CC.c2, CC.c2, CC.c3, dkC ? '#FFFFFF' : '#14181C', dkC, { cu: CC.c3, sd: [CC.c3, CC.c2, '#FFFFFF', CC.c1], fx: [CC.c3, '#FFFFFF', CC.c1] }); cm.bg = 'radial-gradient(120% 80% at 70% 0%, ' + CC.c1 + ' 0%, ' + CC.c2 + ' 70%)'; return cm; }
  if (P.color === 'مخصص') {
    var bgc = P.bgColor || '#3B1F5C', ac = P.accentColor || '#F2B8C6', dk = lum(bgc) < 0.55;
    var m = mk('مخصص', rgba(ac, .35), bgc, bgc, ac, dk ? '#FFFFFF' : '#14181C', dk, { cu: ac });
    m.bg = 'radial-gradient(120% 80% at 70% 0%, ' + rgba(ac, .35) + ' 0%, ' + bgc + ' 55%, ' + bgc + ' 100%)'; m.scA = rgba(bgc, .85); m.scB = rgba(bgc, .35); m.ring = dk ? bgc : '#FFFFFF';
    return m;
  }
  var idx = { 'لون 1': 0, 'لون 2': 1, 'لون 3': 2 }[P.color || 'لون 1']; if (idx == null) idx = 0;
  return (T[this.pid()] || T.ptext)[idx];
}
clearCanvas() { var c = this.cv; if (!c) return; var x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); }
stopFx() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; if (this.root) { this.root.style.removeProperty('--tiltX'); this.root.style.removeProperty('--tiltY'); } }
startFx() {
  var self = this; this.stopFx();
  var thumb = this.px().thumb; if (thumb && (!this.vis || this.fxDone)) return;
  var c = this.cv; if (!c) return; c.style.transition = 'none'; c.style.opacity = '';
  var W = 390, H = 844, dpr = thumb ? 1 : Math.min(2, window.devicePixelRatio || 1);
  c.width = W * dpr; c.height = H * dpr;
  var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
  var pal = this.pal(), id = this.pid(), cols = [pal.c1, pal.c2, pal.c3, pal.tx];
  if (id === 'curtain' || id === 'sadu' || id === 'photo') return;
  if (pal.fx) cols = pal.fx;
  var interactive = !thumb && (id === 'holo' || id === 'dust');
  var LIMIT = thumb ? 3200 : id === 'fireworks' ? 15000 : 10000, EASE = thumb ? 1400 : id === 'fireworks' ? 2200 : 2600;
  var R = Math.random, t0 = performance.now(), last = t0, clk = 0, S = {}, settledSent = false;
  function rc() { return cols[(R() * cols.length) | 0]; }
  function fade(a) { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,' + Math.min(1, a) + ')'; x.fillRect(0, 0, W, H); x.restore(); }
  var add = pal.dark ? 'lighter' : 'source-over';
  if (id === 'ptext') {
    S.ready = false; S.bg = []; for (var i = 0; i < 70; i++) S.bg.push({ x: R() * W, y: R() * H * 0.55, r: 0.6 + R() * 1.4, p: R() * 6 });
    var word = this.px().title;
    var build = function () {
      var o = document.createElement('canvas'); o.width = W; o.height = 250; var ox = o.getContext('2d');
      var fs = 62; ox.font = '700 ' + fs + 'px TD, TDx, serif'; while (ox.measureText(word).width > W - 70 && fs > 28) { fs -= 2; ox.font = '700 ' + fs + 'px TD, TDx, serif'; }
      ox.fillStyle = '#fff'; ox.textAlign = 'center'; ox.textBaseline = 'middle'; ox.direction = 'rtl'; ox.fillText(word, W / 2, 100);
      var d = ox.getImageData(0, 0, W, 250).data, pts = [];
      for (var yy = 0; yy < 250; yy += 3) for (var xx = 0; xx < W; xx += 3) if (d[(yy * W + xx) * 4 + 3] > 140) pts.push([xx + (R() - .5), yy + 75 + (R() - .5)]);
      while (pts.length > 1500) pts.splice((R() * pts.length) | 0, 1);
      S.p = pts.map(function (q) { var a = R() * Math.PI * 2, rr = 300 + R() * 300; return { x: W / 2 + Math.cos(a) * rr, y: 200 + Math.sin(a) * rr, vx: 0, vy: 0, tx: q[0], ty: q[1], r: 0.85 + R() * 0.9, c: rc(), p: R() * 6, d: R() * 900 }; });
      S.ready = true;
    };
    fontReady('700 80px TD, TDx, serif').then(build);
  } else if (id === 'pe') {
    S.en = this.px().engine; S.P = []; S.nb = 0;
  } else if (id === 'warp') {
    S.s = []; for (var j = 0; j < 520; j++) S.s.push({ x: (R() - 0.5) * 2, y: (R() - 0.5) * 2, z: R(), c: rc() });
  } else if (id === 'fireworks') {
    S.rk = []; S.pt = []; S.finale = false; S.fc = cols.slice(0, 3); S.si = 0; S.next = 250; var TF = 10000; S.tf = TF; S.sched = []; [[80, 128, 0, 0.42], [198, 94, 1, 0.33], [312, 140, 2, 0.3]].forEach(function (f) { var tl = TF - Math.sqrt(2 * (H * 0.6 - f[1]) / 0.12) * 16.67; S.sched.push([tl, f[0], f[1], f[2], f[3], 1]); }); S.sched.sort(function (a, b) { return a[0] - b[0]; });
  } else if (id === 'confetti') {
    S.pc = []; S.burst = [[300, 0], [1300, 1], [2400, 0], [3500, 1]]; S.drip = 0;
  } else if (id === 'meteors') {
    S.st = []; for (var mi = 0; mi < 190; mi++) S.st.push({ x: R() * W, y: R() * H * 0.62, r: 0.4 + R() * 1.3, p: R() * 6 }); S.mt = []; S.nx = 200; S.big = false;
  } else if (id === 'bubbles') {
    S.b = []; S.pop = []; var mkB = function (y0) { return { x: 20 + R() * (W - 40), y: y0, r: 12 + R() * 30, vy: -(0.35 + R() * 0.6), w: R() * 6, hu: R() * 6 }; };
    for (var bq = 0; bq < 18; bq++) S.b.push(mkB(H * 0.2 + R() * H * 0.8)); S.mkB = mkB;
  } else if (id === 'dust') {
    S.d = []; for (var k = 0; k < 150; k++) S.d.push({ x: R() * W, y: R() * H * 0.7, vx: (R() - 0.5) * 0.3, vy: -0.15 - R() * 0.35, r: 0.6 + R() * 1.8, c: rc(), p: R() * 6 }); S.sp = [];
  }
  function launch(xp, ty, ci, sc, fin) { var y0 = H * 0.6; S.rk.push({ x: xp, y: y0, vy: -Math.sqrt(2 * 0.12 * (y0 - ty)), ty: ty, c: S.fc[ci % 3], c2: S.fc[(ci + 1) % 3], sc: sc || 1, fin: !!fin }); }
  function frame(now) {
    var el = now - t0, rawdt = Math.min(40, now - last); last = now;
    var spd = interactive ? 1 : (el < LIMIT ? 1 : Math.max(0, 1 - (el - LIMIT) / EASE));
    if (!thumb && (id === 'fireworks' || id === 'confetti')) spd = 1;
    spd = spd * spd * (3 - 2 * spd);
    clk += rawdt * spd; var dt = rawdt * spd / 16.67, T = clk;
    if (id === 'ptext') {
      x.clearRect(0, 0, W, H); x.globalCompositeOperation = 'source-over';
      for (var i = 0; i < S.bg.length; i++) { var b = S.bg[i]; x.globalAlpha = 0.25 + 0.35 * Math.sin(T * 0.002 + b.p); x.fillStyle = pal.tx; x.beginPath(); x.arc(b.x, b.y, b.r, 0, 6.283); x.fill(); }
      if (S.ready) for (var j = 0; j < S.p.length; j++) {
        var p = S.p[j]; if (T < 300 + p.d) { p.x += Math.cos(T * 0.0006 + p.p) * 0.3 * dt; } else { p.vx = (p.vx + (p.tx - p.x) * 0.035 * dt) * 0.84; p.vy = (p.vy + (p.ty - p.y) * 0.035 * dt) * 0.84; p.x += p.vx * dt; p.y += p.vy * dt; }
        var tw = 0.7 + 0.3 * Math.sin(T * 0.004 + p.p);
        x.globalAlpha = tw; x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
        if (pal.dark && j % 16 === 0) { x.globalAlpha = tw * 0.12; x.beginPath(); x.arc(p.x, p.y, p.r * 3, 0, 6.283); x.fill(); }
      }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } else if (id === 'warp') {
      x.clearRect(0, 0, W, H);
      var sp = T < 1400 ? 0.045 : (T < 3400 ? 0.045 - (T - 1400) / 2000 * 0.041 : 0.004);
      var cx = W / 2, cy = 180, f = 260;
      x.globalCompositeOperation = add; x.lineCap = 'round';
      for (var m = 0; m < S.s.length; m++) {
        var s = S.s[m], pz = s.z; s.z -= sp * dt; if (s.z <= 0.02) { s.z = 1; s.x = (R() - 0.5) * 2; s.y = (R() - 0.5) * 2; pz = 1; }
        var sx = cx + s.x / s.z * f, sy = cy + s.y / s.z * f, px = cx + s.x / pz * f, py = cy + s.y / pz * f;
        if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) continue;
        var al = Math.min(1, 0.35 + (1 - s.z) * 1.2); x.globalAlpha = al; x.strokeStyle = s.c; x.lineWidth = Math.max(0.8, (1 - s.z) * 2.6);
        x.beginPath(); x.moveTo(px, py); x.lineTo(sx, sy); x.stroke();
        x.fillStyle = s.c; x.beginPath(); x.arc(sx, sy, Math.max(0.9, (1 - s.z) * 2.2), 0, 6.283); x.fill();
        if (m % 7 === 0) { x.globalAlpha = al * 0.25; x.beginPath(); x.arc(sx, sy, Math.max(3, (1 - s.z) * 7), 0, 6.283); x.fill(); }
      }
      if (T < 2200) { var g = x.createRadialGradient(cx, cy, 0, cx, cy, 200); g.addColorStop(0, pal.c1); g.addColorStop(1, 'rgba(0,0,0,0)'); x.globalAlpha = Math.max(0, 0.5 - T / 4400); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } else if (id === 'fireworks') {
      fade((S.fin ? 0.13 : 0.2) * dt); if (!S.pt.length && !S.rk.length && T > 1000) x.clearRect(0, 0, W, H);
      if (S.fl) for (var fq = 0; fq < S.fl.length; fq++) { var fo = S.fl[fq]; fo.a = Math.max(0, fo.a - 0.06 * dt); var fg = x.createRadialGradient(fo.x, fo.y, 0, fo.x, fo.y, 46); fg.addColorStop(0, 'rgba(255,255,255,' + (0.5 * fo.a).toFixed(3) + ')'); fg.addColorStop(1, 'rgba(255,255,255,0)'); x.globalCompositeOperation = add; x.fillStyle = fg; x.fillRect(fo.x - 46, fo.y - 46, 92, 92); x.globalCompositeOperation = 'source-over'; }
      x.globalCompositeOperation = add;
      if (T > S.next && T < S.tf - 1900) { launch(50 + R() * (W - 100), 70 + R() * 100, (R() * 3) | 0, 1, 0); S.next = T + 380 + R() * 520; }
      if (S.fxEl && el > S.fxEl + 4500 && T > (S.amb || 0)) { if (S.amb) launch(40 + R() * (W - 80), 60 + R() * 80, (R() * 3) | 0, 0.5, 0); S.amb = T + 2800 + R() * 1800; }
      while (S.si < S.sched.length && T > S.sched[S.si][0]) { var sc0 = S.sched[S.si]; launch(sc0[1], sc0[2], sc0[3], sc0[4], sc0[5]); S.si++; }
      
      for (var r = S.rk.length - 1; r >= 0; r--) { var k = S.rk[r]; k.y += k.vy * dt; k.vy += 0.12 * dt; x.globalAlpha = 1; x.fillStyle = k.c; x.beginPath(); x.arc(k.x, k.y, 2, 0, 6.283); x.fill();
        if (k.y <= k.ty || k.vy >= -1) { if (k.fin && !S.fxEl) S.fxEl = el; if (k.fin) S.fin = true; if (!k.fin) { var ks = k.sc || 1, nr = Math.round((90 + (R() * 50 | 0)) * (ks < 1 ? 0.6 : 1)), rng = R() < 0.4; for (var qq = 0; qq < nr; qq++) { var an0 = qq / nr * 6.283 + R() * 0.1, v0 = (rng ? 3.4 : 0.8 + R() * 3.2) * ks; S.pt.push({ x: k.x, y: k.y, vx: Math.cos(an0) * v0, vy: Math.sin(an0) * v0, l: 1, f: false, c: qq % 3 === 0 ? k.c2 : k.c }); } }
        if (k.fin) { S.fl = S.fl || []; S.fl.push({ x: k.x, y: k.y, a: 0.8 }); var nf = Math.round(80 + 60 * k.sc); for (var qf = 0; qf < nf; qf++) { var af = R() * 6.283, vf = 2.7 * k.sc * (0.3 + 0.7 * Math.sqrt(R())); var rc2 = R(); var af2 = R() * 6.283, vf2 = 2.7 * k.sc * (0.25 + 0.75 * Math.sqrt(R())); S.pt.push({ x: k.x, y: k.y, vx: Math.cos(af2) * vf2, vy: Math.sin(af2) * vf2, l: 1, f: true, g: R() < 0.2, c: rc2 < 0.08 ? '#FFFFFF' : (rc2 < 0.56 ? k.c : k.c2) }); } }
        var rings = []; for (var rg = 0; rg < rings.length; rg++) { var rn = rings[rg][0]; for (var q = 0; q < rn; q++) { var an = q / rn * 6.283 + rg * 0.06, v = rings[rg][1] * (k.fin ? 0.7 : 0.97 + R() * 0.06); S.pt.push({ x: k.x, y: k.y, vx: Math.cos(an) * v, vy: Math.sin(an) * v, l: 1, f: k.fin, c: rings[rg][2] }); } } S.rk.splice(r, 1); } }
      for (var z = S.pt.length - 1; z >= 0; z--) { var e = S.pt[z]; var dg = e.f ? Math.pow(0.982, dt) : 0.985; var opx = e.x, opy = e.y; e.vx *= dg; e.vy = e.vy * dg + (e.f ? 0.028 * dt : 0.045 * dt); e.x += e.vx * dt; e.y += e.vy * dt; e.l -= (e.f ? 0.007 : (e.y > 240 ? 0.04 : 0.011)) * dt; if (e.l <= 0) { S.pt.splice(z, 1); continue; } x.globalAlpha = e.l; if (e.f) { var tw2 = e.g ? (0.4 + 0.6 * Math.abs(Math.sin(T * 0.02 + e.x))) : 1; x.globalAlpha = e.l * tw2; x.fillStyle = e.c; x.beginPath(); x.arc(e.x, e.y, e.g ? 1.1 : 1.6, 0, 6.283); x.fill(); } else { x.fillStyle = e.c; x.beginPath(); x.arc(e.x, e.y, 1.7, 0, 6.283); x.fill(); } }
      if (S.bl) { x.globalCompositeOperation = 'source-over'; x.lineCap = 'round'; for (var bq = 0; bq < S.bl.length; bq++) { var B = S.bl[bq], q0 = Math.min(1, (T - B.t0) / 1100), eq = 1 - Math.pow(1 - q0, 3);
        for (var sp0 = 0; sp0 < B.n; sp0++) { var a0 = sp0 / B.n * 6.283, long = sp0 % 2 === 0, rr2 = B.R * eq * (long ? 1 : 0.72), rr1 = rr2 * 0.3, dr = 7 * eq * (0.5 + 0.5 * Math.sin(a0));
          var x1 = B.x + Math.cos(a0) * rr1, y1 = B.y + Math.sin(a0) * rr1, x2 = B.x + Math.cos(a0) * rr2, y2 = B.y + Math.sin(a0) * rr2 + dr;
          var lg = x.createLinearGradient(x1, y1, x2, y2); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, long ? B.c : B.c2);
          x.globalAlpha = 0.95; x.strokeStyle = lg; x.lineWidth = long ? 1.7 : 1.2; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
          x.fillStyle = long ? B.c : B.c2; x.beginPath(); x.arc(x2, y2, long ? 2 : 1.4, 0, 6.283); x.fill();
          if (long && eq > 0.6) { x.globalAlpha = 0.5 + 0.5 * Math.sin(T * 0.02 + sp0); x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(B.x + Math.cos(a0) * rr2 * 0.62, B.y + Math.sin(a0) * rr2 * 0.62 + dr * 0.6, 1, 0, 6.283); x.fill(); } }
        x.globalAlpha = 1; x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(B.x, B.y, 2.2 * eq, 0, 6.283); x.fill(); } }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } else if (id === 'confetti') {
      x.clearRect(0, 0, W, H);
      for (var bi = 0; bi < S.burst.length; bi++) { var bb = S.burst[bi]; if (bb && T > bb[0]) { var left = bb[1] === 0; for (var u = 0; u < 120; u++) { var ang = (left ? -70 : -110) + (R() - 0.5) * 40, vv = 11 + R() * 9, rad = ang * Math.PI / 180; S.pc.push({ x: left ? 10 : W - 10, y: H * 0.72, vx: Math.cos(rad) * vv, vy: Math.sin(rad) * vv, w: 6 + R() * 6, h: 10 + R() * 8, rot: R() * 6, vr: (R() - 0.5) * 0.3, fl: R() * 6, c: rc() }); } S.burst[bi] = null; } }
      if (T > 2000 && T < 4400 && T - S.drip > 90) { S.drip = T; S.pc.push({ x: R() * W, y: -20, vx: (R() - 0.5) * 1, vy: 1.2, w: 6 + R() * 5, h: 9 + R() * 7, rot: R() * 6, vr: (R() - 0.5) * 0.15, fl: R() * 6, c: rc() }); }
      for (var pi = S.pc.length - 1; pi >= 0; pi--) { var pc = S.pc[pi]; pc.vx *= 0.985; pc.vy = Math.min(pc.vy * 0.985 + 0.22 * dt, 3.6); pc.x += (pc.vx + Math.sin(T * 0.003 + pc.fl) * 0.6) * dt; pc.y += pc.vy * dt; pc.rot += pc.vr * dt; pc.fl += 0.12 * dt; if (pc.y > H + 30) { S.pc.splice(pi, 1); continue; }
        x.save(); x.translate(pc.x, pc.y); x.rotate(pc.rot); x.scale(1, Math.cos(pc.fl)); x.fillStyle = pc.c; x.fillRect(-pc.w / 2, -pc.h / 2, pc.w, pc.h); x.restore(); }
    } else if (id === 'dust') {
      fade(0.3 * dt); x.globalCompositeOperation = add;
      var ptr = self.ptr, auto = (now - ptr.t) > 1200, px2, py2, autoAmp = el < 10000 ? 1 : Math.max(0.15, 1 - (el - 10000) / 3000);
      if (auto) { px2 = W / 2 + Math.sin(T * 0.0011) * 150; py2 = 190 + Math.sin(T * 0.0017) * 110; } else { px2 = ptr.x; py2 = ptr.y; }
      var scn = auto ? Math.round(3 * autoAmp) : 5;
      for (var si = 0; si < scn; si++) S.sp.push({ x: px2 + (R() - 0.5) * 10, y: py2 + (R() - 0.5) * 10, vx: (R() - 0.5) * 1.6, vy: (R() - 0.5) * 1.6 - 0.4, l: 1, r: 1 + R() * 2, c: rc() });
      for (var di = 0; di < S.d.length; di++) { var dd = S.d[di]; dd.x += (dd.vx + Math.sin(T * 0.001 + dd.p) * 0.2) * dt; dd.y += dd.vy * dt; if (dd.y < -10) { dd.y = H * 0.7; dd.x = R() * W; } x.globalAlpha = 0.35 + 0.4 * Math.sin(T * 0.003 + dd.p); x.fillStyle = dd.c; x.beginPath(); x.arc(dd.x, dd.y, dd.r, 0, 6.283); x.fill(); }
      for (var sj = S.sp.length - 1; sj >= 0; sj--) { var spk = S.sp[sj]; spk.x += spk.vx * dt; spk.y += spk.vy * dt; spk.l -= 0.02 * dt; if (spk.l <= 0) { S.sp.splice(sj, 1); continue; } x.globalAlpha = spk.l; x.fillStyle = spk.c; x.beginPath(); x.arc(spk.x, spk.y, spk.r * spk.l, 0, 6.283); x.fill(); }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } else if (id === 'meteors') {
      x.clearRect(0, 0, W, H);
      for (var sa = 0; sa < S.st.length; sa++) { var st0 = S.st[sa]; x.globalAlpha = 0.35 + 0.45 * Math.sin(T * 0.003 + st0.p); x.fillStyle = pal.tx; x.beginPath(); x.arc(st0.x, st0.y, st0.r, 0, 6.283); x.fill(); }
      var spawn = function (big) { var ang = (205 + R() * 18) * Math.PI / 180, sp2 = big ? 3 : 8 + R() * 6; S.mt.push({ x: big ? W + 40 : 80 + R() * (W + 120), y: big ? 30 : -20 + R() * 160, vx: Math.cos(ang) * sp2, vy: -Math.sin(ang) * sp2, len: big ? 260 : 80 + R() * 110, w: big ? 3.2 : 1.2 + R() * 1.4, l: 1, c: cols[(R() * cols.length) | 0], big: big }); };
      if (T > S.nx && el < LIMIT - 1800) { spawn(false); if (R() < 0.3) spawn(false); S.nx = T + 260 + R() * 520; }
      if (!S.big && el > LIMIT - 700) { S.big = true; spawn(true); }
      x.globalCompositeOperation = add; x.lineCap = 'round';
      for (var mq = S.mt.length - 1; mq >= 0; mq--) { var me = S.mt[mq]; me.x += me.vx * dt; me.y += me.vy * dt; if (!me.big) me.l -= 0.008 * dt; if (me.l <= 0 || me.y > H * 0.7 || me.x < -300) { S.mt.splice(mq, 1); continue; }
        var nv = Math.sqrt(me.vx * me.vx + me.vy * me.vy), tx3 = me.x - me.vx / nv * me.len, ty3 = me.y - me.vy / nv * me.len;
        var lg2 = x.createLinearGradient(me.x, me.y, tx3, ty3); lg2.addColorStop(0, me.c); lg2.addColorStop(1, 'rgba(0,0,0,0)');
        x.globalAlpha = me.l; x.strokeStyle = lg2; x.lineWidth = me.w; x.beginPath(); x.moveTo(me.x, me.y); x.lineTo(tx3, ty3); x.stroke();
        x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(me.x, me.y, me.w * 0.9, 0, 6.283); x.fill();
        x.globalAlpha = me.l * 0.3; x.fillStyle = me.c; x.beginPath(); x.arc(me.x, me.y, me.w * 4, 0, 6.283); x.fill(); }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } else if (id === 'bubbles') {
      x.clearRect(0, 0, W, H);
      var bAmp = el < 10000 ? 1 : Math.max(0.3, 1 - (el - 10000) / 3000), tp = self.tap;
      if (tp && tp.t > (S.lt || 0)) { S.lt = tp.t; for (var bt = 0; bt < S.b.length; bt++) { var bb2 = S.b[bt], dx = tp.x - bb2.x, dy = tp.y - bb2.y; if (dx * dx + dy * dy < (bb2.r + 14) * (bb2.r + 14)) { for (var dq = 0; dq < 18; dq++) { var da = dq / 18 * 6.283; S.pop.push({ x: bb2.x + Math.cos(da) * bb2.r, y: bb2.y + Math.sin(da) * bb2.r, vx: Math.cos(da) * 2.2, vy: Math.sin(da) * 2.2, l: 1, c: cols[dq % cols.length] }); } S.b[bt] = S.mkB(H + 40); break; } } }
      for (var bi2 = 0; bi2 < S.b.length; bi2++) {
        var u2 = S.b[bi2]; u2.y += u2.vy * dt * bAmp; u2.w += 0.02 * dt; var bx = u2.x + Math.sin(u2.w) * 8, by = u2.y;
        if (by < -u2.r - 10) { S.b[bi2] = S.mkB(H + 40); continue; }
        var gg = x.createRadialGradient(bx, by, u2.r * 0.55, bx, by, u2.r); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(255,255,255,.22)');
        x.globalAlpha = 1; x.fillStyle = gg; x.beginPath(); x.arc(bx, by, u2.r, 0, 6.283); x.fill();
        var lg = x.createLinearGradient(bx - u2.r, by - u2.r, bx + u2.r, by + u2.r); var sh = (Math.sin(T * 0.001 + u2.hu) + 1) / 2;
        lg.addColorStop(0, pal.c1); lg.addColorStop(0.35 + sh * 0.2, pal.c3); lg.addColorStop(0.7, '#FFF1A8'); lg.addColorStop(1, pal.c1);
        x.globalAlpha = 0.85; x.strokeStyle = lg; x.lineWidth = 1.6; x.beginPath(); x.arc(bx, by, u2.r, 0, 6.283); x.stroke();
        x.globalAlpha = 0.8; x.fillStyle = '#FFFFFF'; x.beginPath(); x.ellipse(bx - u2.r * 0.38, by - u2.r * 0.42, u2.r * 0.22, u2.r * 0.11, -0.7, 0, 6.283); x.fill();
        x.globalAlpha = 0.5; x.beginPath(); x.arc(bx + u2.r * 0.42, by + u2.r * 0.36, u2.r * 0.07, 0, 6.283); x.fill();
      }
      x.globalCompositeOperation = add;
      for (var pq = S.pop.length - 1; pq >= 0; pq--) { var pp = S.pop[pq]; pp.x += pp.vx * dt; pp.y += pp.vy * dt; pp.vx *= 0.94; pp.vy = pp.vy * 0.94 + 0.05 * dt; pp.l -= 0.03 * dt; if (pp.l <= 0) { S.pop.splice(pq, 1); continue; } x.globalAlpha = pp.l; x.fillStyle = pp.c; x.beginPath(); x.arc(pp.x, pp.y, 2 * pp.l + 0.6, 0, 6.283); x.fill(); }
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } else if (id === 'pe') {
      var en = S.en, HP = H * 0.62, ps = (0.3 + en.spd / 50) * 1.35, den = Math.round(30 + en.den * 2.4), pc3 = [en.c3, en.tx, en.c3], Q = S.P, k1;
      if (en.e === 1 || en.e === 3) fade((en.e === 3 ? 0.25 : 0.18) * dt); else x.clearRect(0, 0, W, H);
      if (en.e === 0) { while (Q.length < den) Q.push({ x: R() * W, y: R() * HP, r: 0.6 + R() * 1.8, p: R() * 6, v: (R() - 0.5) * 0.2 }); for (k1 = 0; k1 < Q.length; k1++) { var a1 = Q[k1]; a1.x += a1.v * ps * dt; if (a1.x < 0) a1.x = W; if (a1.x > W) a1.x = 0; x.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(T * 0.002 * ps + a1.p)); x.fillStyle = a1.p > 3 ? en.c3 : en.tx; x.beginPath(); x.arc(a1.x, a1.y, a1.r, 0, 6.283); x.fill(); } }
      else if (en.e === 1) { if (T > S.nb) { var bx1 = 50 + R() * (W - 100), by1 = 60 + R() * 170, nn = Math.round(40 + en.den), c1x = pc3[(R() * 3) | 0]; for (k1 = 0; k1 < nn; k1++) { var an1 = R() * 6.283, v1 = (0.9 + R() * 3) * ps; Q.push({ x: bx1, y: by1, vx: Math.cos(an1) * v1, vy: Math.sin(an1) * v1, l: 1, c: c1x }); } S.nb = T + 900 / ps; } for (k1 = Q.length - 1; k1 >= 0; k1--) { var f1 = Q[k1]; f1.vx *= 0.97; f1.vy = f1.vy * 0.97 + 0.04 * dt; f1.x += f1.vx * dt; f1.y += f1.vy * dt; f1.l -= 0.012 * ps * dt; if (f1.l <= 0) { Q.splice(k1, 1); continue; } x.globalAlpha = f1.l; x.fillStyle = f1.c; x.beginPath(); x.arc(f1.x, f1.y, 1.8, 0, 6.283); x.fill(); } }
      else if (en.e === 2) { while (Q.length < den) Q.push({ x: R() * W, y: HP * 0.2 + R() * HP * 0.8, r: 0.7 + R() * 2.2, p: R() * 6, vy: -(0.25 + R() * 0.6) }); for (k1 = 0; k1 < Q.length; k1++) { var d1 = Q[k1]; d1.y += d1.vy * ps * dt; d1.x += Math.sin(T * 0.001 + d1.p) * 0.25 * dt; if (d1.y < -5) { d1.y = HP; d1.x = R() * W; } x.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(T * 0.003 + d1.p)); x.fillStyle = d1.p > 3 ? en.c3 : en.tx; x.beginPath(); x.arc(d1.x, d1.y, d1.r, 0, 6.283); x.fill(); } }
      else if (en.e === 3) { if (R() < 0.05 * ps * (en.den / 50) * dt) Q.push({ x: 60 + R() * (W + 60), y: -10 + R() * 180, l: 1 }); for (k1 = Q.length - 1; k1 >= 0; k1--) { var m1 = Q[k1]; m1.x -= 6.5 * ps * dt; m1.y += 3 * ps * dt; m1.l -= 0.011 * dt; if (m1.l <= 0) { Q.splice(k1, 1); continue; } x.globalAlpha = m1.l; x.strokeStyle = en.c3; x.lineWidth = 2; x.beginPath(); x.moveTo(m1.x, m1.y); x.lineTo(m1.x + 34, m1.y - 15); x.stroke(); } }
      else { var cn = Math.round(den * 0.6); while (Q.length < cn) Q.push({ x: R() * W, y: -R() * H, w: 5 + R() * 5, h: 9 + R() * 7, r: R() * 6, vr: (R() - 0.5) * 0.1, vy: 1 + R() * 1.5, c: [en.c3, en.tx, en.c1][(R() * 3) | 0] }); for (k1 = 0; k1 < Q.length; k1++) { var g1 = Q[k1]; g1.y += g1.vy * ps * dt; g1.r += g1.vr * ps * dt; g1.x += Math.sin(T * 0.002 + g1.r) * 0.5 * dt; if (g1.y > H + 10 && spd > 0.5) { g1.y = -10; g1.x = R() * W; } x.save(); x.translate(g1.x, g1.y); x.rotate(g1.r); x.globalAlpha = 0.9; x.fillStyle = g1.c; x.fillRect(-g1.w / 2, -g1.h / 2, g1.w, g1.h); x.restore(); } }
      x.globalAlpha = 1;
    } else if (id === 'holo') {
      var amp = el < 10000 ? 1 : Math.max(0.3, 1 - (el - 10000) / 4000);
      var tx2 = Math.sin(T * 0.0012) * 8 * amp, ty2 = Math.cos(T * 0.0009) * 6 * amp, hp = 50 + Math.sin(T * 0.0012) * 45 * amp;
      var pr = self.ptr, o = self.ori;
      if (now - pr.t < 1500) { tx2 = (pr.x / W - 0.5) * 18; ty2 = -(pr.y / H - 0.5) * 14; hp = pr.x / W * 100; }
      else if (now - o.t < 1500) { tx2 = Math.max(-12, Math.min(12, o.g * 0.4)); ty2 = Math.max(-10, Math.min(10, (o.b - 45) * -0.3)); hp = 50 + o.g * 1.4; }
      if (self.root) { self.root.style.setProperty('--tiltY', tx2.toFixed(2) + 'deg'); self.root.style.setProperty('--tiltX', ty2.toFixed(2) + 'deg'); self.root.style.setProperty('--hp', hp.toFixed(1) + '%'); self.root.style.setProperty('--ha', (hp * 3.6).toFixed(0) + 'deg'); }
    }
    if (interactive || spd > 0) self.raf = requestAnimationFrame(frame); else { self.raf = 0; if (thumb) self.fxDone = true; if (!settledSent) { settledSent = true; self.setState({ settled: true }); } }
  }
  this.raf = requestAnimationFrame(frame);
}
renderVals() {
var self = this, s = this.state, P = this.px(), H = this.props;
function rnd(i) { var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
var v = this.pal();
var SD = { 'مدعو': ['#0E97AE', '#4CC7DA', '#086577', '24px'], 'ضيف': ['#2D5A8C', '#6E95C4', '#1A3A60', '26px'], 'عضو': ['#3F7F6A', '#77B59F', '#285445', '26px'], 'متحدث': ['#0A2A43', '#3E6688', '#04121F', '21px'], 'VIP': ['#B8892A', '#E7C873', '#7E5B14', '26px'], 'راعي': ['#7A3E5B', '#B07592', '#52253C', '24px'], 'شريك': ['#4A4682', '#7E7AB8', '#2E2B5A', '24px'], 'تحكيم': ['#8C2F39', '#C66972', '#5C1A22', '22px'] };
var gen = this.general();
var sealName = gen ? 'مدعو' : P.seal;
var sd = SD[sealName] || SD['VIP'];
var seal = { label: sealName, hex: sd[0], light: sd[1], deep: sd[2], fs: sd[3] }; if (P.customSeal && (!H.sealName || H.sealName === 'مدعو')) { seal = { label: P.customSeal.text || sealName, hex: P.customSeal.wax, light: shade(P.customSeal.wax, 0.35), deep: shade(P.customSeal.wax, -0.35), fs: (P.customSeal.text || '').length > 4 ? '18px' : '22px' }; }
var pid = this.pid();
if (!this.uid) this.uid = Math.random().toString(36).slice(2, 8);
var gid = 'ivWax-' + this.uid;
var opened = s.phase === 'open';
var strips = []; for (var si2 = 0; si2 < 10; si2++) { var tIn = si2 / 9; ['left', 'right'].forEach(function (side) { var sg = side === 'left' ? -1 : 1; strips.push({ st: 'position:absolute;top:-4px;' + side + ':' + (si2 * 20 - 5) + 'px;width:27px;height:560px;transform-origin:50% 0;border-radius:0 0 14px 14px;--dx:' + (sg * 16 * si2) + 'px;--rt:' + (-sg * (1 + tIn * 4)).toFixed(2) + 'deg;--sw:' + (sg * (0.4 + tIn * 0.9)).toFixed(2) + 'deg;background:linear-gradient(90deg,rgba(0,0,0,.42),rgba(255,255,255,.14) 48%,rgba(0,0,0,.42)),linear-gradient(180deg,var(--cu) 0%,var(--cu) 82%,rgba(0,0,0,0) 100%);' + (si2 === 9 ? 'box-shadow:' + (sg * -10) + 'px 0 22px rgba(0,0,0,.35);' : '') + 'animation:stripOpen 2.7s cubic-bezier(.65,0,.25,1) .5s both,swayS 5s ease-in-out 3.2s 2' }); }); }
var wmOn = P.preview; var wmRows = []; for (var wr = 0; wr < 14; wr++) wmRows.push({ t: 'معاينة · حيّــاك © · معاينة · حيّــاك © · معاينة · حيّــاك ©', st: 'white-space:nowrap;font-family:TD, TDx, serif;font-size:22px;color:#FFFFFF;' + (wr % 2 ? 'margin-right:-90px' : '') });
var gold = []; for (var gq = 0; gq < 26; gq++) { var gz = 3 + rnd(gq + 700) * 4; gold.push({ st: 'position:absolute;top:' + (50 + rnd(gq + 710) * 30).toFixed(0) + 'px;left:' + (8 + rnd(gq + 720) * 84).toFixed(1) + '%;width:' + gz.toFixed(1) + 'px;height:' + (gz * 1.6).toFixed(1) + 'px;border-radius:1px;background:' + (gq % 3 ? 'var(--c1)' : '#FFFFFF') + ';opacity:0;animation:goldFall ' + (3 + rnd(gq + 730) * 2.5).toFixed(1) + 's linear ' + (1.4 + rnd(gq + 740) * 2.2).toFixed(2) + 's 2' }); }
var sadu = []; if (v.sd) { var A = v.sd[0], Bk = v.sd[1], Cc = v.sd[2], Dd = v.sd[3];
  var MT = [{ h: 20, bg: 'linear-gradient(135deg,' + A + ' 25%,transparent 25%) -10px 0/20px 20px,linear-gradient(225deg,' + A + ' 25%,transparent 25%) -10px 0/20px 20px,' + Bk }, { h: 6, bg: 'repeating-linear-gradient(90deg,' + Dd + ' 0 8px,' + Cc + ' 8px 12px)' }, { h: 24, bg: 'linear-gradient(45deg,transparent 38%,' + Dd + ' 38% 62%,transparent 62%) 0 0/24px 24px,linear-gradient(-45deg,transparent 38%,' + Dd + ' 38% 62%,transparent 62%) 0 0/24px 24px,' + Bk }, { h: 6, bg: A }, { h: 18, bg: 'linear-gradient(45deg,' + Cc + ' 25%,transparent 25%) 0 0/18px 18px,linear-gradient(-45deg,' + Cc + ' 25%,transparent 25%) 0 0/18px 18px,' + A }, { h: 6, bg: 'repeating-linear-gradient(90deg,' + Bk + ' 0 4px,' + Cc + ' 4px 8px)' }];
  var rows9 = []; for (var rr9 = 0; rr9 < 8; rr9++) rows9 = rows9.concat(rr9 % 2 ? MT.slice().reverse() : MT); rows9.forEach(function (m, i) { var d = (0.55 + i * 0.1).toFixed(2); if (i > 22) d = (0.55 + 22 * 0.1 + (i - 22) * 0.02).toFixed(2); var rtl = i % 2 === 0, du = 0.42; sadu.push({ wrap: 'position:relative;flex-shrink:0;height:' + m.h + 'px;animation:beatR ' + du + 's ease-out ' + d + 's both', st: 'position:absolute;inset:0;background:' + m.bg + ';animation:' + (rtl ? 'loomR' : 'loomL') + ' ' + du + 's linear ' + d + 's both', sh: 'position:absolute;top:50%;width:22px;height:6px;margin-top:-3px;border-radius:999px;background:linear-gradient(180deg,#F2D79A,#B8892A);box-shadow:0 2px 6px rgba(0,0,0,.4),0 0 10px rgba(255,230,170,.6);opacity:0;animation:' + (rtl ? 'shR' : 'shL') + ' ' + du + 's linear ' + d + 's both' }); }); }
var motes = []; for (var mo = 0; mo < 14; mo++) motes.push({ st: 'position:absolute;left:' + (30 + rnd(mo + 400) * 40).toFixed(1) + '%;top:' + (140 + rnd(mo + 410) * 300).toFixed(0) + 'px;width:3px;height:3px;border-radius:50%;background:#FFFFFF;opacity:0;animation:moteF ' + (4 + rnd(mo + 420) * 4).toFixed(1) + 's ease-in-out ' + (3 + rnd(mo + 430) * 2).toFixed(1) + 's infinite' });
var online0 = P.place === 'عن بعد', qrText = online0 ? (P.liveUrl || '') : (P.mapUrl || (P.placeName ? 'https://maps.google.com/?q=' + encodeURIComponent(P.placeName + ' ' + P.placeArea) : 'https://hayyak.sa'));
var QR = P.thumb ? { n: 25, cells: [] } : qrCells(qrText, s.qr), qr = QR.cells;
var evT = P.title, evLoc = online0 ? (P.liveUrl || P.platform) : [P.placeName, P.placeArea].filter(Boolean).join('، ');
var st0 = P.startsAt ? new Date(P.startsAt) : new Date('2026-10-22T06:00:00Z'), en0 = new Date(st0.getTime() + P.durationMin * 60000);
function zu(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); }
function ie(t) { return String(t || '').replace(/([\\,;])/g, '\\$1').replace(/\r?\n/g, '\\n'); }
var gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(evT) + '&dates=' + zu(st0) + '/' + zu(en0) + '&details=' + encodeURIComponent('دعوة من ' + P.entity + ' عبر حيّــاك' + (P.url ? '\n' + P.url : '')) + '&location=' + encodeURIComponent(evLoc);
var icsTx = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hayyak//AR', 'BEGIN:VEVENT', 'UID:hayyak-' + P.uid, 'DTSTAMP:' + zu(new Date()), 'DTSTART:' + zu(st0), 'DTEND:' + zu(en0), 'SUMMARY:' + ie(evT), 'LOCATION:' + ie(evLoc), 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + ie(evT), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
var ics = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsTx);
var mapHref = P.mapUrl || ('https://maps.google.com/?q=' + encodeURIComponent([P.placeName, P.placeArea].filter(Boolean).join(' ') || 'الرياض'));
var online = online0, later = P.linkStatus !== 'الرابط جاهز' || !P.liveUrl && Boolean(H.info);
var ent = P.entity;
var first = gen ? ((s.gname || '').trim().split(' ')[0] || 'ضيفنا') : P.name.split(' ')[0];
var loadNamed = (!gen) || s.phase === 'load2';
function goSave(kind) {
  clearTimeout(self.ts); self.setState({ sheet: 'making', saved: kind, saveErr: '' });
  saveInvite(self, kind, pid).then(function () { if (self.gone) return; self.setState({ sheet: 'done' }); if (H.onSaved) H.onSaved(kind); }, function (e) { if (!self.gone) self.setState({ sheet: 'menu', saved: '', saveErr: (e && e.message) || '' }); });
}
var cSeal = P.customSeal;
return {
  vs: '--c1:' + v.c1 + ';--c2:' + v.c2 + ';--c3:' + v.c3 + ';--tx:' + v.tx + ';--bt:' + v.bt + ';--scA:' + v.scA + ';--scB:' + v.scB + ';--gl:' + v.gl + ';--ln:' + v.ln + ';--cu:' + v.cu + ';--lc:' + v.lc + ';--ring:' + v.ring + ';--h1:' + v.h[0] + ';--h2:' + v.h[1] + ';--h3:' + v.h[2] + ';--h4:' + v.h[3] + ';background:' + v.bg,
  setCanvas: function (el) { self.cv = el; }, setRoot: function (el) { self.root = el; },
  onMove: function (e) { if (!self.root) return; var r = self.root.getBoundingClientRect(); self.ptr = { x: (e.clientX - r.left) * 390 / r.width, y: (e.clientY - r.top) * 844 / r.height, t: performance.now() }; if (!self.state.touched && (pid === 'holo' || pid === 'dust') && self.state.phase === 'open') self.setState({ touched: true }); },
  onDown: function (e) { if (!self.root) return; var r = self.root.getBoundingClientRect(); self.ptr = { x: (e.clientX - r.left) * 390 / r.width, y: (e.clientY - r.top) * 844 / r.height, t: performance.now() }; self.tap = { x: self.ptr.x, y: self.ptr.y, t: performance.now() }; if (!self.state.touched && (pid === 'holo' || pid === 'dust' || pid === 'bubbles') && self.state.phase === 'open') self.setState({ touched: true }); },
  is_holo: pid === 'holo', showCurtain: pid === 'curtain' && opened, showBub: false, showSadu: pid === 'sadu' && opened, sadu: sadu, showPhoto: pid === 'photo', photoUrl: P.bgImage, photoDemo: !P.bgImage, gold: gold, wm: wmOn, wmRows: wmRows, motes: motes, strips: strips, ptLatin: pid === 'ptext' && opened && !!P.latin,
  cvOp: '1',
  showHint: opened && (pid === 'holo' || pid === 'dust') && !s.touched, hintText: pid === 'holo' ? 'حرّك جوالك أو مرّر إصبعك' : 'مرّر إصبعك على الشاشة', hintSub: pid === 'holo' ? 'وشوف الدعوة تلمع معك' : 'والضوء بيمشي ورا إصبعك',
  showTitle: pid !== 'ptext', hasLatin: !!(P.latin || ''), hasLabel: !!(P.eventLabel || ''), eventLabel: P.eventLabel || '',
  heroDelay: pid === 'curtain' ? '3.3s' : (pid === 'sadu' ? '2.8s' : '0s'),
  k: s.run % 2 ? 'B' : 'A', inK: s.run % 2 ? 'inB' : 'inA',
  isLoad: s.phase === 'load' || s.phase === 'load2', notLoad: s.phase !== 'load' && s.phase !== 'load2', isGate: s.phase === 'gate', isOpen: opened,
  loadNamed: loadNamed, loadPlain: !loadNamed, loadHello: s.phase === 'load2' ? 'تشرّفنا يا ' + first : 'أهلًا ' + first, loadDur: s.phase === 'load2' ? '1.8s' : '2.6s',
  qr: qr, qrBox: '0 0 ' + QR.n + ' ' + QR.n, dateTx: fullDate(st0), timeTx: time(st0, true), placeArea: P.placeArea, placeHref: online ? P.liveUrl : mapHref, mapHref: mapHref, orgLogo: P.logo, noOrgLogo: !P.logo, orgInit: ent.replace(/^\[/, '').charAt(0), sealLogo: cSeal && cSeal.logo && seal.hex === cSeal.wax ? cSeal.logo : '', sealText: cSeal && cSeal.logo && seal.hex === cSeal.wax ? '' : seal.label, loadLogo: P.customLoading ? P.customLoading.logo : '', loadSealD: P.customLoading && P.customLoading.logo ? 'none' : 'block', wax: waxPath(1.3), seal: seal, gid: gid, sealFill: 'url(#' + gid + ')',
  entity: ent, title: P.title, latin: P.latin,
  gname: s.gname, gmail: s.gmail, onGname: function (e) { self.setState({ gname: e.target.value }); }, onGmail: function (e) { self.setState({ gmail: e.target.value }); },
  gateMsg: s.gateMsg, gateBusy: s.gateBusy,
  openInv: function () {
    if (wmOn || !H.onRegister) { clearTimeout(self.t); self.setState({ phase: 'load2' }); self.t = setTimeout(function () { self.setState({ phase: 'open', run: self.state.run + 1, settled: false }); self.startFx(); }, 2000); return; }
    if (s.gateBusy) return;
    if ((s.gname || '').trim().length < 2) { self.setState({ gateMsg: 'اكتب اسمك' }); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((s.gmail || '').trim())) { self.setState({ gateMsg: 'اكتب بريد صحيح' }); return; }
    self.setState({ gateBusy: true, gateMsg: '' });
    H.onRegister({ name: s.gname.trim(), email: s.gmail.trim() }).then(function (msg) { self.setState({ gateBusy: false, gateMsg: msg || '', phase: msg ? 'gate' : 'load2' }); }, function (e) { self.setState({ gateBusy: false, gateMsg: e.message }); });
  },
  shownName: gen ? (s.gname.trim() || 'ريم الزهراني') : P.name, shownOrg: gen ? 'ضمن المدعوين' : P.org,
  inPerson: !online, isOnline: online, placeKicker: online ? 'عن بعد' : 'المكان', placeName: online ? P.platform : (P.placeName || 'اسم المكان'), placeHasLink: !online || !later, placeLink: online ? 'انضم للبث' : 'افتح في الخرائط', linkLaterOn: online && later, qrOn: !online || !later, qrOff: online && later, qrCap: online ? (later ? 'الرابط قريبًا' : 'امسح للانضمام') : 'امسح لفتح الموقع',
  rsvpTitle: s.nudge ? 'أكّد حضورك أول، وبعدها احفظ' : 'نتشرّف بحضورك؟', rsvpShadow: s.nudge ? '0 0 0 3px var(--c2)' : 'none', glowDelay: s.nudge ? '0s' : '4s',
  saveLabel: s.saved && s.sheet !== 'making' ? 'حُفظت' : 'حفظ',
  openSave: function () { if (wmOn) return; if (!s.rsvp && s.phase === 'open') { clearTimeout(self.tn); self.setState({ nudge: true }); self.tn = setTimeout(function () { self.setState({ nudge: false }); }, 3600); return; } self.setState({ sheet: 'menu' }); },
  closeSave: function () { clearTimeout(self.ts); self.setState({ sheet: '' }); },
  saveVideo: function () { goSave('video'); }, saveImage: function () { goSave('image'); }, makingTx: s.saved === 'video' ? 'نجهّز دعوتك بحركتها…' : 'نجهّز الصورة…', doneSub: s.saved === 'video' ? 'انحملت في جهازك، وتقدر تشاركها مع أي أحد' : 'انحملت في جهازك، وتقدر تشاركها مع أي أحد', undoTx: s.rsvp === 'yes' ? 'غيّر ردّك' : 'غيّرت رأيي', undo: function () { if (H.onRsvp) H.onRsvp('pending'); self.setState({ rsvp: '' }); },
  sheetOn: !!s.sheet, sheetMenu: s.sheet === 'menu', sheetMaking: s.sheet === 'making', sheetDone: s.sheet === 'done', doneTitle: s.saved === 'video' ? 'انحفظت الدعوة بحركتها' : 'انحفظت الصورة',
  replayAll: function () { self.setState({ phase: 'load', nudge: false, touched: false, settled: false, run: s.run + 1 }); self.arm(); },
  rsvpOpen: !s.rsvp && !P.ended, answered: !!s.rsvp, yes: function () { if (H.onRsvp) H.onRsvp('yes'); self.setState({ rsvp: 'yes', nudge: false }); }, no: function () { if (H.onRsvp) H.onRsvp('no'); self.setState({ rsvp: 'no', nudge: false }); },
  answerTitle: s.rsvp === 'yes' ? 'تم تأكيد حضورك' : 'شكرًا لإبلاغنا', going: s.rsvp === 'yes', addCal: function () { self.setState({ sheet: 'cal', cal: true }); }, calLabel: s.cal ? 'في تقويمك' : 'أضف للتقويم', gcal: gcal, ics: ics, sheetCal: s.sheet === 'cal', sheetTitle: s.sheet === 'cal' ? 'أضف الموعد لتقويمك' : (s.saveErr || 'خلّ الدعوة معك'),
  branded: true, thumb: P.thumb
};
}
}
