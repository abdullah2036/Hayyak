'use client';
/** Helpers shared by the screens: shapes, styles, guided tour, API calls, clipboard and downloads. */

export function waxPath(seed) {
  const k = 96;
  const pts = [];
  for (let i = 0; i < k; i++) {
    const t = (i / k) * Math.PI * 2;
    const r = 44 + 2.6 * Math.sin(t * 7 + seed) + 1.4 * Math.sin(t * 11 + 1.3 + seed * 2) + 0.9 * Math.sin(t * 3 + 0.4 + seed);
    pts.push((50 + r * Math.cos(t)).toFixed(2) + ' ' + (50 + r * Math.sin(t)).toFixed(2));
  }
  return 'M' + pts.join(' L') + ' Z';
}
export function rnd(i, off = 78.233) {
  const x = Math.sin(i * 12.9898 + off) * 43758.5453;
  return x - Math.floor(x);
}
export function starField(n, size = 2) {
  const a = [];
  for (let i = 0; i < n; i++) {
    const z = 1 + rnd(i) * size;
    a.push({ st: `position:absolute;left:${(rnd(i + 50) * 100).toFixed(1)}%;top:${(rnd(i + 90) * 100).toFixed(1)}%;width:${z.toFixed(1)}px;height:${z.toFixed(1)}px;border-radius:50%;background:#FFFFFF;opacity:${(0.3 + rnd(i + 130) * 0.6).toFixed(2)}` });
  }
  return a;
}

export const IC = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', inv: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l9 6 9-6', des: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  ppl: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6', star: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z', card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  team: 'M16 11a4 4 0 1 0-8 0M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1', send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z', tag: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9zM8 8h.01', org: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M8 7h4M8 11h4M8 15h4', lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  wand: 'M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5',
};
export const HREF = { الرئيسية: '/app', الدعوات: '/app/invitations', التصاميم: '/app/designs', المدعوين: '/app/guests', 'طلبات التخصيص': '/app/requests', 'الرصيد والفواتير': '/app/buy', الإعدادات: '/app/settings', حسابي: '/app/account', الحساب: '/app/account' };

export const chipSt = (on, h = 40) => `height:${h}px;padding:0 18px;border-radius:999px;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;${on ? 'border:0;background:#0A2A43;color:#FFFFFF;font-weight:700' : 'border:1px solid rgba(10,42,67,.16);background:rgba(255,255,255,.7);color:#0A2A43'}`;
export const cntSt = (on) => `min-width:22px;height:22px;padding:0 6px;border-radius:999px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;${on ? 'background:rgba(255,255,255,.2);color:#fff' : 'background:rgba(14,151,174,.12);color:#086577'}`;
export const tgl = (on) => ({ bg: 'background:' + (on ? '#0E97AE' : '#C9D6DD'), knob: 'right:' + (on ? '25px' : '3px') });
export const radioSt = (on) => ({
  st: `display:flex;gap:12px;align-items:flex-start;width:100%;padding:14px 16px;border-radius:20px;cursor:pointer;font-family:inherit;color:#0A2A43;${on ? 'border:2px solid #0E97AE;background:rgba(230,246,249,.85)' : 'border:2px solid transparent;background:rgba(255,255,255,.7)'}`,
  dot: `width:22px;height:22px;border-radius:50%;flex:none;margin-top:2px;display:flex;align-items:center;justify-content:center;border:2px solid ${on ? '#0E97AE' : '#B8C4CC'}`,
  dotIn: `width:10px;height:10px;border-radius:50%;background:${on ? '#0E97AE' : 'transparent'}`,
});
export const STATUS_ST = { 'مُرسلة': ['#086577', 'rgba(14,151,174,.14)'], 'مسودة': ['#4A5B68', 'rgba(10,42,67,.08)'], 'انتهت': ['#3A4B58', 'rgba(184,196,204,.32)'], 'مجدولة': ['#5B4A12', 'rgba(231,200,115,.32)'] };
export const REPLY_ST = { 'أكّد': ['#086577', 'rgba(14,151,174,.14)', '✓'], 'اعتذر': ['#3A4B58', 'rgba(184,196,204,.35)', '×'], 'ما ردّ': ['#5B4A12', 'rgba(231,200,115,.32)', '…'] };

/** Sidebar, bottom bar and account block that every workspace screen shows. */
export function base(active, shell) {
  const nav = (label, ic, badge) => {
    const on = label === active;
    return { key: label, href: HREF[label], label, ic: IC[ic], hasBadge: Boolean(badge), badge: badge ? String(badge) : '', bar: on ? 'position:absolute;left:-16px;top:9px;width:4px;height:26px;border-radius:4px;background:#0E97AE' : 'display:none', st: `position:relative;display:flex;align-items:center;gap:12px;height:44px;padding:0 12px;border-radius:14px;text-decoration:none;font-size:15px;${on ? 'background:rgba(14,151,174,.12);color:#0A2A43;font-weight:700' : 'color:#2C4A5C'}` };
  };
  const c = shell.credit;
  return {
    wax: waxPath(1.3),
    nav1: [nav('الرئيسية', 'home'), nav('الدعوات', 'inv'), nav('التصاميم', 'des'), nav('المدعوين', 'ppl'), nav('طلبات التخصيص', 'star', shell.requests)],
    nav2: [nav('حسابي', 'user'), nav('الرصيد والفواتير', 'card'), nav('الإعدادات', 'gear')],
    nav: ['الرئيسية', 'الدعوات', 'التصاميم', 'المدعوين', 'طلبات التخصيص', 'حسابي', 'الرصيد والفواتير', 'الإعدادات'].map((l, i) => nav(l, ['home', 'inv', 'des', 'ppl', 'star', 'user', 'card', 'gear'][i])),
    bnav: [['الرئيسية', 'home', 1], ['الدعوات', 'inv', 1], ['المدعوين', 'ppl', 3], ['الحساب', 'gear', 3]].map((b) => {
      const on = b[0] === active || (b[0] === 'الحساب' && (active === 'الإعدادات' || active === 'حسابي'));
      return { key: b[0], href: HREF[b[0]], label: b[0], ic: IC[b[1]], st: `order:${b[2]};display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;text-decoration:none;${on ? 'color:#0A2A43;font-weight:700' : 'color:#4A5B68'}` };
    }),
    side: {
      credit: c.total ? `باقي ${c.left} من ${c.total}${c.expires ? ' · صالح لين ' + c.expires : ''}` : 'ما عندك رصيد', pct: (c.total ? Math.round((c.left / c.total) * 100) : 0) + '%', org: shell.org.name, user: `${shell.user.name} · ${shell.roleLabel}`, logo: shell.org.logo, hasLogo: Boolean(shell.org.logo), noLogo: !shell.org.logo, logout,
    },
  };
}

/* ---------- network ---------- */
export class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
async function call(method, path, body, form) {
  const init = { method, credentials: 'same-origin' };
  if (form) init.body = form;
  else if (method !== 'GET') {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body ?? {});
  }
  let res;
  try {
    res = await fetch('/api' + path, init);
  } catch {
    throw new ApiError(0, 'النت فاصل، تأكد من الاتصال وجرّب مرة ثانية', 'offline');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && json.code === 'signed_out') {
      if (api.signedOut) api.signedOut();
      else window.location.assign(`/signup?mode=old&next=${encodeURIComponent(window.location.pathname)}`);
    }
    throw new ApiError(res.status, json.error || 'صار خطأ، جرّب مرة ثانية', json.code);
  }
  return json;
}
export const api = {
  get: (p) => call('GET', p),
  post: (p, b) => call('POST', p, b),
  patch: (p, b) => call('PATCH', p, b),
  del: (p) => call('DELETE', p),
  upload: (p, file, fields) => {
    const f = new FormData();
    for (const [k, val] of Object.entries(fields || {})) f.append(k, val);
    f.append('file', file);
    return call('POST', p, undefined, f);
  },
};
export async function logout() {
  await api.post('/auth/logout').catch(() => {});
  window.location.assign('/');
}

/* ---------- clipboard and downloads ---------- */
export function copyText(t) {
  const fallback = () => {
    const a = document.createElement('textarea');
    a.value = t;
    a.style.position = 'fixed';
    a.style.opacity = '0';
    document.body.appendChild(a);
    a.select();
    try { document.execCommand('copy'); } catch { /* nothing else to try */ }
    a.remove();
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t).catch(fallback);
  else fallback();
}
export function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
export async function saveXlsx(name, sheets) {
  const { writeXlsx, XLSX_MIME } = await import('@/lib/xlsx');
  saveBlob(new Blob([writeXlsx(sheets)], { type: XLSX_MIME }), name);
}
export const guestTemplate = () => saveXlsx('حياك - قالب أسماء المدعوين.xlsx', [{ name: 'المدعوين', rows: [['الاسم', 'رقم الجوال', 'الإيميل', 'الختم', 'الصفة', 'ملاحظات'], ['سارة أحمد', '0551234567', '', 'مدعو', 'ضيفة', ''], ['فهد العتيبي', '', 'fahad@example.com', 'متحدث', '', '']] }]);

/** Real, scannable QR as a list of squares. */
export function qrCells(text, lib) {
  if (!lib || !text) return { n: 25, cells: [] };
  const m = lib.create(text, { errorCorrectionLevel: 'M' }).modules;
  const n = m.size + 2;
  const cells = [];
  for (let y = 0; y < m.size; y++) for (let x = 0; x < m.size; x++) if (m.data[y * m.size + x]) cells.push({ x: x + 1, y: y + 1 });
  return { n, cells };
}
let qrLib;
export const loadQr = () => (qrLib ||= import('qrcode').then((m) => m.default || m));

/* ---------- step by step guide ("دلّني") ---------- */
export function TOUR(self, steps) {
  const s = self.state;
  const i = s.tour;
  const r = s.tr;
  const has = (n) => {
    const el = document.querySelector('[data-t="' + steps[n][0] + '"]');
    return el && el.getBoundingClientRect().height > 0 ? el : null;
  };
  const go = (n, d) => {
    while (n >= 0 && n < steps.length && !has(n)) n += d;
    if (n < 0 || n >= steps.length) { self.setState({ tour: -1, tr: null }); return; }
    const el = has(n);
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    self.setState({ tour: n });
    clearTimeout(self.tto);
    self.tto = setTimeout(() => {
      const b = el.getBoundingClientRect();
      self.setState({ tr: { t: b.top, l: b.left, w: b.width, h: b.height } });
    }, 480);
  };
  const on = i > -1 && Boolean(r);
  const vis = [];
  if (on) for (let k = 0; k < steps.length; k++) if (has(k)) vis.push(k);
  const vw = typeof window === 'undefined' ? 1200 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight;
  const tw = Math.min(340, vw - 24);
  let top = 0;
  let left = 0;
  if (r) {
    const bt = Math.max(r.t, 8);
    const bb = Math.min(r.t + r.h, vh - 8);
    top = bb + 240 < vh ? bb + 16 : bt - 240 > 0 ? bt - 236 : vh - 250;
    left = Math.min(Math.max(12, r.l + r.w / 2 - tw / 2), vw - tw - 12);
  }
  const st = steps[i] || ['', '', ''];
  const pos = vis.indexOf(i);
  return {
    tourOn: on, startTour: () => go(0, 1), tNext: () => go(i + 1, 1), tPrev: () => go(i - 1, -1), tEnd: () => self.setState({ tour: -1, tr: null }), tStep: pos + 1 + ' من ' + vis.length, tTitle: st[1], tBody: st[2], tHasPrev: pos > 0, tNextL: pos === vis.length - 1 ? 'تمام، فهمت' : 'التالي',
    spotSt: r ? `top:${r.t - 8}px;left:${r.l - 8}px;width:${r.w + 16}px;height:${r.h + 16}px` : 'display:none', tipSt: `top:${top}px;left:${left}px;width:${tw}px`,
  };
}
