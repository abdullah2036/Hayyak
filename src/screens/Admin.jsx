'use client';
import View from '@/views/Admin.view';
import { Screen } from '@/ui/dc';
import { api, IC, waxPath } from '@/ui/kit';
import { CHANNEL_SHORT, ENGINES, PATTERNS, SEALS, STAFF_ROLES, STAGES } from '@/lib/constants';
import { runEngine } from '@/ui/engine';
import { plural, time } from '@/lib/dates';

const V = [
  ['نظرة عامة', 'home', 'نظرة على المنصة', ''], ['طلبات الإرسال', 'send', 'طلبات الإرسال', 'يأكّدها المستخدمين ويرفعون الأسماء قبل المناسبة بـ 48 ساعة على الأقل'], ['طلبات التخصيص', 'star', 'طلبات التخصيص', 'غيّر مرحلة أي طلب، والمستخدم يشوف التحديث في صفحته'], ['خدمات التخصيص', 'tag', 'خدمات التخصيص', 'الأسعار والخدمات اللي تظهر للمستخدمين'], ['المستخدمين', 'org', 'المستخدمين', 'كل المستخدمين واستخدامهم'],
  ['الرصيد والمبيعات', 'card', 'الرصيد والمبيعات', 'طلبات الشراء وحزم الرصيد ومبيعاتها'], ['الخصوصية والسجل', 'lock', 'الخصوصية والسجل', 'مين اطّلع على وش ومتى'], ['الفريق', 'team', 'فريق الإدارة', 'مين يقدر يدخل الاستوديو'], ['محرر الأنماط', 'wand', 'محرر الأنماط', 'سوّ نمط جديد من محرك موجود، وخلّه خاص بمستخدم أو عام للكل'],
];
const NEED = ['overview', 'sends', 'requests', 'services', 'users', 'sales', 'privacy', 'team', 'design'];
const ORDER = [0, 1, 2, 3, 8, 4, 5, 6, 7];
const TOUR = { 0: 'كل شي مهم اليوم في مكان واحد: الطلبات الجديدة، الإيراد، واللي يحتاج تتابعونه', 1: 'الدعوات اللي طلب المستخدمين نرسلها عنهم. يوصلكم الطلب قبل المناسبة بـ 48 ساعة على الأقل، وتحدّثون حالته هنا', 2: 'كل طلب تخصيص بمرحلته. افتح الطلب واضغط «جهّز التخصيص» عشان تسوون الختم أو الألوان أو شاشة التحميل وتسلّمونه', 3: 'الخدمات والأسعار اللي يشوفها المستخدمين، وتقدرون تعدّلونها أو تضيفون خدمة', 8: 'تسوون نمط جديد من محرك موجود بدون برمجة، وتختارون يكون خاص بمستخدم أو عام للكل', 4: 'كل المستخدمين ورصيدهم ومتى ينتهي', 5: 'طلبات الشراء اللي تنتظر تأكيد الدفع، وحزم الرصيد والإيراد', 6: 'مين فتح أي بيانات ومتى وليش، عشان كل شي يكون واضح', 7: 'تضيفون أعضاء الفريق بإيميلاتهم الشخصية، ويدخلون برمز تحقق' };
const SQ = ['طلب جديد', 'جاري الإرسال', 'انرسلت'];
const SCOL = ['#86DCEA', '#DCEFF3', '#4FC9DC', '#0E97AE', '#0A5E78', '#B8C6CE'];
const PF = ['الكل', 'مجاني', 'بنفسه', 'إيميل', 'واتساب'];
const BP = PATTERNS.filter((p) => p !== 'صورة خاصة');
const chip = (on) => `height:40px;padding:0 18px;border-radius:999px;font-size:14px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;${on ? 'border:0;background:#86DCEA;color:#04121F;font-weight:700' : 'border:1px solid rgba(255,255,255,.18);background:transparent;color:#EAF4F7'}`;
const cnt = (on) => `min-width:22px;height:22px;padding:0 6px;border-radius:999px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;${on ? 'background:rgba(4,18,31,.15);color:#04121F' : 'background:rgba(134,220,234,.16);color:#86DCEA'}`;
const tgl = (on) => ({ bg: 'background:' + (on ? '#0E97AE' : 'rgba(255,255,255,.2)'), knob: 'right:' + (on ? '25px' : '3px') });
const box = (on) => `text-align:right;display:flex;flex-direction:column;gap:4px;padding:12px 14px;border-radius:18px;cursor:pointer;font-family:inherit;color:#EAF4F7;${on ? 'border:2px solid #86DCEA;background:rgba(134,220,234,.12)' : 'border:2px solid rgba(255,255,255,.12);background:transparent'}`;

export default class Admin extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = {
      tour: -1, sp: null, v: 0, sf: 0, sel: p.data.requests.find((r) => r.st < 5)?.id || p.data.requests[0]?.id || null, msg: '', q: '', pf: 0, adding: false, nN: '', nD: '', nP: '', price: {}, svcP: {}, addOpen: false, mName: '', mMail: '', mRole: 1, mErr: false, mSent: false, toast: '',
      bOpen: false, bTab: 0, bWax: '#0A2A43', bText: 'سفير', bLogo: '', bPat: 0, bC1: '#1B3B6F', bC2: '#060E1F', bC3: '#E7C873', bLoadBg: '#0A2A43', bScope: 0, bName: '', bDone: '', peE: 0, peC1: '#123E5C', peC2: '#04121F', peC3: '#86DCEA', peTx: '#FFFFFF', peDen: 60, peSpd: 50, peTitle: '', peLogo: '', peScope: 0, peUser: p.data.customers[0]?.id || '', peName: '', peSaved: '', g: null, gCount: 30, gCh: 0, gReason: '', wa: null,
    };
  }

  // Kept as one function so the preview does not restart on every keystroke.
  setPE = (el) => {
    this.peStop?.();
    this.peStop = el ? runEngine(el, () => ({ e: this.state.peE, c1: this.state.peC1, c3: this.state.peC3, tx: this.state.peTx, den: this.state.peDen, spd: this.state.peSpd })) : null;
  };

  componentDidMount() {
    this.tMeasure = () => this.measure();
    window.addEventListener('scroll', this.tMeasure, { passive: true });
    window.addEventListener('resize', this.tMeasure);
    this.poll = setInterval(() => { if (!document.hidden) this.props.router.refresh(); }, 60000);
  }

  componentWillUnmount() {
    clearTimeout(this.tc);
    clearTimeout(this.tt1);
    clearInterval(this.poll);
    this.peStop?.();
    window.removeEventListener('scroll', this.tMeasure);
    window.removeEventListener('resize', this.tMeasure);
  }

  has(i) { return this.props.perms.includes(NEED[i]); }

  navOrder() { return ORDER.filter((i) => this.has(i)); }

  tEl(n) {
    for (const el of document.querySelectorAll(`[data-tour="${n}"]`)) { const b = el.getBoundingClientRect(); if (b.width > 0 && b.height > 0) return el; }
    return null;
  }

  goStep(n) {
    this.setState({ tour: n, v: this.navOrder()[n - 1] });
    this.tEl(n)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    clearTimeout(this.tt1);
    setTimeout(() => this.measure(), 30);
    this.tt1 = setTimeout(() => this.measure(), 450);
  }

  measure() {
    if (!(this.state.tour > 0)) return;
    const el = this.tEl(this.state.tour);
    if (!el) return;
    const b = el.getBoundingClientRect();
    this.setState({ sp: { t: b.top, l: b.left, w: b.width, h: b.height } });
  }

  toast(t) {
    clearTimeout(this.tc);
    this.setState({ toast: t });
    this.tc = setTimeout(() => this.setState({ toast: '' }), 3600);
  }

  async run(fn, ok) {
    try {
      const r = await fn();
      if (ok) this.toast(ok);
      this.props.router.refresh();
      return r ?? true;
    } catch (e) {
      this.toast(e.message);
      return null;
    }
  }

  async logo(e, key) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const r = await this.run(() => api.upload('/studio/assets', f));
    if (r) this.setState({ [key]: r.url });
  }

  deliver(final) {
    const s = this.state;
    const sel = this.props.data.requests.find((r) => r.id === s.sel);
    if (!sel) return;
    const design = s.bTab === 0 ? { kind: 'seal', data: { text: s.bLogo ? '' : s.bText, wax: s.bWax, logo: s.bLogo } } : s.bTab === 1 ? { kind: 'colors', data: { pattern: BP[s.bPat], c1: s.bC1, c2: s.bC2, c3: s.bC3 } } : { kind: 'loading', data: { bg: s.bLoadBg, logo: s.bLogo } };
    const name = s.bName.trim() || ['ختم ' + (s.bText || 'خاص'), 'ألوان ' + sel.who, 'شاشة تحميل ' + sel.who][s.bTab].slice(0, 40);
    this.run(() => api.post(`/studio/requests/${sel.id}/deliver`, { name, scope: s.bScope ? 'public' : 'org', final, design })).then((r) => { if (r) this.setState({ bDone: final ? (s.bScope ? `انحفظ كتصميم عام باسم «${name}»، وانسلّم الطلب ✓` : `انحفظ في تصاميم ${sel.who} الخاصة، وانسلّم الطلب ✓`) : 'وصلت المعاينة للمستخدم، وتنتظر موافقته ✓' }); });
  }

  renderVals() {
    const s = this.state;
    const { data: d } = this.props;
    const set = (o) => this.setState(o);
    const o = d.overview;
    const openN = d.requests.filter((r) => r.st < 5).length;
    const sendN = d.sends.filter((q) => q.status < 2).length;
    const list = d.requests.filter((r) => s.sf === 0 || r.st === s.sf - 1);
    const sel = d.requests.find((r) => r.id === s.sel);
    const nav = this.navOrder();
    const hr = new Date().getHours();
    const q = s.q.trim();
    const founder = d.me.role === 'founder';
    const share = o.byHayyak + o.bySelf ? Math.round((o.byHayyak / (o.byHayyak + o.bySelf)) * 100) : 0;
    const growth = o.lastRevenue ? Math.round(((o.revenue - o.lastRevenue) / o.lastRevenue) * 100) : null;
    const patch = (id, body, ok) => this.run(() => api.patch(`/studio/requests/${id}`, body), ok);
    const W = typeof window === 'undefined' ? 1200 : window.innerWidth;
    const H = typeof window === 'undefined' ? 800 : window.innerHeight;
    const sp = s.sp;
    const attn = [
      ...(d.sales?.pending || []).slice(0, 3).map((x) => ({ key: x.id, t: `طلب شراء HY-${x.number}`, d: `${x.who} · ${x.total} ر.س`, cta: 'أكّد الدفع', c: '#E7C873', go: () => set({ v: 5 }) })), ...d.sends.filter((x) => x.status === 0).slice(0, 2).map((x) => ({ key: x.id, t: `طلب إرسال · ${x.inv}`, d: `${x.who} · ${x.when}`, cta: 'افتح', c: '#0E97AE', go: () => set({ v: 1 }) })),
      ...d.requests.filter((r) => r.st < 2).slice(0, 3).map((r) => ({ key: r.id, t: r.st === 0 ? 'طلب تخصيص جديد' : 'بانتظار التواصل', d: `${r.who} · ${r.what}`, cta: r.st === 0 ? 'افتح' : 'تواصل', c: '#86DCEA', go: () => set({ v: 2, sf: 0, sel: r.id }) })),
      ...d.customers.filter((e) => e.total && e.plan !== 'مجاني' && e.used / e.total >= 0.9).slice(0, 2).map((e) => ({ key: e.id, t: `${e.n} قرب ينتهي رصيده`, d: `${e.used} من ${e.total} · ${e.end}`, cta: 'المستخدمين', c: '#B8C6CE', go: () => set({ v: 4 }) })),
    ];
    const svc = (c) => ({ tq: tgl(c.price === null), ta: tgl(c.available) });
    return {
      wax: waxPath(1.3), toast: s.toast, vt: V[s.v][2], vs: s.v === 0 ? 'أرقام المنصة هذا الشهر' : V[s.v][3], meI: d.me.name.charAt(0), meN: d.me.name, meR: `${STAFF_ROLES[d.me.role]} · الجلسة تقفل بعد 30 دقيقة خمول`, isFounder: founder, canCredit: this.props.perms.includes('credit'), logout: async () => { await api.post('/studio/logout').catch(() => {}); window.location.assign('/studio/login'); },
      vHome: s.v === 0, vSend: s.v === 1, vReq: s.v === 2, vSvc: s.v === 3, vOrg: s.v === 4, vSub: s.v === 5, vPriv: s.v === 6, vTeam: s.v === 7, vPE: s.v === 8,
      nav: nav.map((i, k) => ({ key: String(i), k: String(k + 1), n: V[i][0], ic: IC[V[i][1]], hasB: (i === 1 && sendN > 0) || (i === 2 && openN > 0) || (i === 5 && (d.sales?.pending.length || 0) > 0), b: String(i === 1 ? sendN : i === 2 ? openN : d.sales?.pending.length || 0), go: () => set({ v: i }), st: `display:flex;align-items:center;gap:12px;height:46px;padding:0 14px;border-radius:16px;border:0;cursor:pointer;font-size:15px;font-family:inherit;text-align:right;${s.v === i ? 'background:rgba(134,220,234,.18);color:#FFFFFF;font-weight:700' : 'background:transparent;color:#C9DCE4'}` })),
      greet: `${hr < 12 ? 'صباح الخير' : 'مساء الخير'} ${d.me.name.split(' ')[0]}`, openTx: openN ? `اليوم عندك ${openN === 1 ? 'طلب واحد ينتظرك' : `${plural(openN, 'طلب', 'طلبين', 'طلبات')} تنتظرك`}` : 'ما فيه شي ينتظرك اليوم', sendTx: sendN ? `و${plural(sendN, 'طلب إرسال', 'طلبين إرسال', 'طلبات إرسال')} من المستخدمين` : 'وما فيه طلبات إرسال من المستخدمين', goReq: () => set({ v: 2 }), goSend: () => { if (this.has(1)) set({ v: 1 }); },
      kpis: [{ key: 1, l: 'مستخدمين نشطين', v: String(o.activeOrgs), d: `+${o.newOrgs} هذا الشهر`, ic: IC.org }, { key: 2, l: 'الإيراد', v: `${o.revenue.toLocaleString('en-US')} ر.س`, d: growth === null ? 'هذا الشهر' : `${growth >= 0 ? '+' : ''}${growth}% عن الشهر الماضي`, ic: IC.card }, { key: 3, l: 'دعوات انرسلت', v: o.sent.toLocaleString('en-US'), d: 'هذا الشهر من كل المستخدمين', ic: IC.star }, { key: 4, l: 'طلبات مفتوحة', v: String(openN), d: `${d.requests.filter((r) => r.st === 0).length} جديد`, ic: IC.tag }],
      attn: (attn.length ? attn : [{ key: 'ok', t: 'ما فيه شي ينتظرك', d: 'كل الطلبات متابعة', cta: '', c: '#0E97AE', go: () => {} }]).map((a) => ({ ...a, dot: `width:12px;height:12px;border-radius:50%;flex:none;background:${a.c}` })),
      plansBar: (() => { const ch = [['مجاني', o.free, 0, '#B8C6CE'], ...[['self', 'ترسلها بنفسها', '#86DCEA'], ['email', 'حيّــاك بالإيميل', '#0E97AE'], ['whatsapp', 'حيّــاك بالواتساب', '#E7C873']].map((x) => { const r = o.sales.find((y) => y.channel === x[0]); return [x[1], r?.c || 0, r?.r || 0, x[2]]; })]; const m = Math.max(1, ...ch.map((x) => x[1])); return ch.map((x) => ({ key: x[0], n: x[0], c: x[1], r: `${x[2].toLocaleString('en-US')} ر.س`, bar: `display:block;height:100%;border-radius:999px;width:${Math.round((x[1] / m) * 100)}%;background:${x[3]}` })); })(), shareA: share + '%', shareB: 100 - share + '%',
      noSends: !d.sends.length, waOpen: Boolean(s.wa), waClose: () => set({ wa: null }), waList: (s.wa || []).map((w, i) => ({ key: i, name: w.name + (w.done ? ' ✓' : ''), url: w.url, mark: () => set({ wa: s.wa.map((y, k) => (k === i ? { ...y, done: true } : y)) }), st: `padding:10px 16px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;${w.done ? 'background:rgba(255,255,255,.1);color:#9FB8C6' : 'background:#0E97AE;color:#fff'}` })),
      sends: d.sends.map((x) => ({ key: x.id, inv: x.kind === 'reminder' ? `تذكير · ${x.inv}` : x.inv, who: x.who, n: x.n, ch: x.ch, when: x.when, st: SQ[x.status], cta: x.status === 0 ? 'ابدأ الإرسال' : x.status === 1 ? 'تم الإرسال' : 'انرسلت ✓', go: () => { if (x.status < 2) this.run(() => api.post(`/studio/sends/${x.id}/advance`), x.status === 0 ? 'بدأ الإرسال، والإيميلات تطلع الحين' : 'انتهى الإرسال ✓'); }, wa: x.status === 1 && x.whatsapp ? async () => { const r = await this.run(() => api.post(`/studio/sends/${x.id}/recipients`)); if (r) set({ wa: r.rows }); } : null, pill: `justify-self:start;font-size:13px;font-weight:700;padding:7px 14px;border-radius:999px;${x.status === 0 ? 'background:#86DCEA;color:#04121F' : x.status === 1 ? 'background:rgba(231,200,115,.25);color:#F2DC9B' : 'background:rgba(255,255,255,.1);color:#B8CCD6'}`, btn: `height:46px;border-radius:999px;font-weight:700;font-size:14px;font-family:inherit;cursor:${x.status >= 2 ? 'default' : 'pointer'};${x.status === 0 ? 'border:0;background:#0E97AE;color:#fff' : x.status === 1 ? 'border:1px solid #86DCEA;background:transparent;color:#86DCEA' : 'border:0;background:transparent;color:#9FB8C6'}` })),
      stF: [['الكل', d.requests.length], ...STAGES.map((g, i) => [g[0], d.requests.filter((r) => r.st === i).length])].map((f, i) => ({ key: f[0], n: f[0], c: f[1], on: () => set({ sf: i }), st: chip(s.sf === i), cst: cnt(s.sf === i) })), stageOpts: STAGES.map((g, i) => ({ key: i, v: String(i), n: g[0] })),
      reqs: list.map((r) => ({ key: r.id, what: r.what, who: r.who, plan: r.plan, when: r.when, v: String(r.st), pick: () => set({ sel: r.id, msg: '' }), onSt: (e) => patch(r.id, { stage: Number(e.target.value) }, 'تحدّثت المرحلة ✓'), row: `display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:22px;${r.id === s.sel ? 'background:rgba(255,255,255,.07);box-shadow:0 0 0 2px #0E97AE' : 'background:rgba(255,255,255,.04)'}`, selSt: `flex:none;height:42px;border-radius:999px;padding:0 14px;font-size:13px;font-weight:700;cursor:pointer;border:0;color:${r.st >= 3 && r.st < 5 ? '#FFFFFF' : '#0A2A43'};background:${SCOL[r.st]}` })), noReq: !list.length, hasSel: Boolean(sel),
      sel: sel ? { what: sel.what, who: sel.who, plan: sel.plan, when: sel.when, note: `${sel.note}${sel.via ? ` · يفضّل ${sel.via}` : ''}`, phone: sel.phone || '—', wa: sel.phone ? 'https://wa.me/' + sel.phone.replace(/\D/g, '') : undefined, mailto: sel.mail ? 'mailto:' + sel.mail : undefined, price: s.price[sel.id] ?? sel.price, onPrice: (e) => { const val = e.target.value.slice(0, 40); set({ price: { ...s.price, [sel.id]: val } }); clearTimeout(this.tp); this.tp = setTimeout(() => patch(sel.id, { price: val }, 'انحفظ السعر ✓'), 900); }, steps: STAGES.map((g, i) => { const cur = sel.st === i; const done = sel.st > i; return { key: i, n: g[0], client: g[1], ic: done ? '✓' : String(i + 1), go: () => patch(sel.id, { stage: i }, 'تحدّثت المرحلة ✓'), st: `display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:18px;cursor:pointer;font-family:inherit;text-align:right;border:0;${cur ? 'background:#0E97AE;color:#FFFFFF' : 'color:#EAF4F7;background:rgba(255,255,255,.07)'}`, dot: `width:32px;height:32px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;${cur ? 'background:#86DCEA;color:#04121F' : done ? 'background:#0E97AE;color:#fff' : 'background:rgba(255,255,255,.1);color:#9FB8C6'}` }; }) } : {},
      msg: s.msg, onMsg: (e) => set({ msg: e.target.value.slice(0, 600) }), sendMsg: () => { if (s.msg.trim()) patch(sel.id, { message: s.msg.trim() }, 'انرسل التحديث للمستخدم ✓').then((r) => { if (r) set({ msg: '' }); }); }, msgTx: 'أرسل التحديث للمستخدم',
      adding: s.adding, openAdd: () => (s.v === 7 ? set({ addOpen: !s.addOpen, mErr: false, mSent: false }) : set({ adding: !s.adding })), nN: s.nN, nD: s.nD, nP: s.nP, onNN: (e) => set({ nN: e.target.value }), onND: (e) => set({ nD: e.target.value }), onNP: (e) => set({ nP: e.target.value.replace(/\D/g, '') }), addSvc: () => this.run(() => api.post('/studio/services', { name: s.nN, description: s.nD, price: s.nP ? Number(s.nP) : null }), 'انضافت الخدمة ✓').then((r) => { if (r) set({ adding: false, nN: '', nD: '', nP: '' }); }),
      svcs: d.services.map((c) => { const { tq, ta } = svc(c); const upd = (b) => this.run(() => api.patch(`/studio/services/${c.id}`, b), 'انحفظ ✓'); return { key: c.id, n: c.name, d: c.description, p: c.price === null ? 'حسب الطلب' : String(s.svcP[c.id] ?? c.price), quote: c.price === null, pSt: `height:44px;width:110px;padding:0 14px;${c.price === null ? 'background:rgba(255,255,255,.1);color:#9FB8C6' : ''}`, onP: (e) => { const n = e.target.value.replace(/\D/g, '').slice(0, 5); set({ svcP: { ...s.svcP, [c.id]: n } }); clearTimeout(this.tsv); if (n) this.tsv = setTimeout(() => upd({ price: Number(n) }), 900); }, togQ: () => upd({ price: c.price === null ? 49 : null }), togA: () => upd({ available: !c.available }), qbg: tq.bg, qknob: tq.knob, abg: ta.bg, aknob: ta.knob }; }),
      q: s.q, onQ: (e) => set({ q: e.target.value }), orgCount: `${d.customers.length} مستخدم`, pf: PF.map((l, i) => ({ key: l, n: l, on: () => set({ pf: i }), st: chip(s.pf === i) })),
      ents: d.customers.filter((e) => (!q || e.n.includes(q) || e.owner.includes(q)) && (s.pf === 0 || e.plan === PF[s.pf])).map((e) => { const p = e.total ? e.used / e.total : 0; return { key: e.id, i: e.n.replace(/^(شركة|جمعية|مبادرة|مكتب|مدرسة|عيادات|نادي|فريق)\s+/, '').charAt(0), n: e.n + (e.status === 'suspended' ? ' · موقوف' : ''), kind: `${e.kind} · ${e.invitations} دعوة · ${e.owner}`, plan: e.plan, use: `${e.used} من ${e.total} دعوة · ${e.end}`, last: e.last, bar: `display:block;height:100%;border-radius:999px;width:${Math.round(p * 100)}%;background:${p > 0.85 ? '#E7C873' : '#0E97AE'}`, grant: () => set({ g: { id: e.id, n: e.n, kind: 'credit' }, gReason: '' }), toggle: () => set({ g: { id: e.id, n: e.n, kind: e.status === 'active' ? 'suspended' : 'active' }, gReason: '' }), toggleL: e.status === 'active' ? 'إيقاف' : 'تفعيل' }; }),
      gOpen: Boolean(s.g), gCredit: s.g?.kind === 'credit', gTitle: s.g ? (s.g.kind === 'credit' ? `إضافة رصيد لـ ${s.g.n}` : `${s.g.kind === 'active' ? 'تفعيل' : 'إيقاف'} حساب ${s.g.n}`) : '', gCount: s.gCount, onGCount: (e) => set({ gCount: e.target.value.replace(/\D/g, '').slice(0, 4) }), gChans: ['self', 'email', 'whatsapp'].map((c, i) => ({ key: c, n: CHANNEL_SHORT[c], pick: () => set({ gCh: i }), st: chip(s.gCh === i) })), gReason: s.gReason, onGReason: (e) => set({ gReason: e.target.value.slice(0, 200) }), gClose: () => set({ g: null }),
      gSave: () => this.run(() => (s.g.kind === 'credit' ? api.post(`/studio/customers/${s.g.id}/credit`, { count: Number(s.gCount), channel: ['self', 'email', 'whatsapp'][s.gCh], reason: s.gReason }) : api.post(`/studio/customers/${s.g.id}/status`, { status: s.g.kind, reason: s.gReason })), 'تم ✓').then((r) => { if (r) set({ g: null }); }),
      plansFull: (d.sales?.packs || []).map((p) => ({ key: p.n, ...p })), pend: (d.sales?.pending || []).map((x) => ({ key: x.id, t: `HY-${x.number} · ${x.who}`, d: `${x.what}${x.items.length > 2 ? ' + ' + x.items.slice(2).map((y) => y.k).join('، ') : ''} · ${x.when}`, c: [x.contact.phone, x.contact.email].filter(Boolean).join(' · '), p: `${x.total} ر.س`, ok: () => this.run(() => api.post(`/studio/orders/${x.id}`, { ok: true }), 'نزل الرصيد ✓'), no: () => this.run(() => api.post(`/studio/orders/${x.id}`, { ok: false }), 'انلغى الطلب') })), noPend: !d.sales?.pending.length,
      rules: [{ key: 1, t: 'ما نشوف بيانات المدعوين', d: 'الاستوديو يعرض أرقام إجمالية بس، بدون أسماء أو جوالات' }, { key: 2, t: 'الاطلاع بإذن المستخدم', d: 'قائمة المدعوين تنفتح بس وقت تنفيذ طلب إرسال أكّده المستخدم بنفسه' }, { key: 3, t: 'كل اطلاع ينسجل', d: 'مين فتح وإيش ومتى وليش، والمستخدم يشوف السجل في إعداداته' }, { key: 4, t: 'أرشيف 90 يوم ثم حذف', d: 'بعد المناسبة بـ 90 يوم تنتقل البيانات لأرشيف مشفّر، وبعد 90 يوم ثانية تنحذف' }], audit: d.audit.map((a, i) => ({ key: i, ...a })),
      addOpen: s.addOpen, mName: s.mName, mMail: s.mMail, mErr: s.mErr, mSent: s.mSent, onMName: (e) => set({ mName: e.target.value }), onMMail: (e) => set({ mMail: e.target.value }), roles: ['founder', 'support', 'design'].map((r, i) => ({ key: r, n: STAFF_ROLES[r], pick: () => set({ mRole: i }), st: chip(s.mRole === i) })), addMember: () => { if (!s.mName.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.mMail.trim())) return set({ mErr: true }); return this.run(() => api.post('/studio/team', { name: s.mName.trim(), email: s.mMail.trim(), role: ['founder', 'support', 'design'][s.mRole] })).then((r) => { if (r) set({ addOpen: false, mName: '', mMail: '', mErr: false, mSent: true }); }); },
      team: d.team.map((m) => ({ key: m.id, i: m.n.charAt(0), n: m.n, mail: m.mail, role: m.status === 'pending' ? 'بانتظار التفعيل' : STAFF_ROLES[m.role], rm: m.me ? null : () => { if (window.confirm(`تشيل ${m.n} من الفريق؟`)) this.run(() => api.post(`/studio/team/${m.id}/remove`), 'تم ✓'); } })),
      /* builder */
      bOpen: s.bOpen, openB: () => { if (!this.props.perms.includes('design')) { this.toast('تجهيز التصاميم من صلاحية فريق التصميم'); return; } const w = sel?.what || ''; set({ bOpen: true, bDone: '', bLogo: '', bName: '', bTab: w.includes('ألوان') ? 1 : w.includes('شاشة') ? 2 : 0 }); }, closeB: () => set({ bOpen: false }), bWho: sel?.who || '', bWhat: sel?.what || '', bTabs: ['ختم خاص', 'ألوان نمط', 'شاشة تحميل'].map((n, i) => ({ key: n, n, pick: () => set({ bTab: i }), st: chip(s.bTab === i) })), bT0: s.bTab === 0, bT1: s.bTab === 1, bT2: s.bTab === 2,
      bSw: SEALS.map((c) => ({ key: c[0], c: c[1], n: c[0], pick: () => set({ bWax: c[1] }), st: `width:38px;height:38px;border-radius:50%;cursor:pointer;background:${c[1]};border:3px solid ${s.bWax === c[1] ? '#86DCEA' : 'rgba(255,255,255,.15)'}` })), bWax: s.bWax, onWax: (e) => set({ bWax: e.target.value }), bText: s.bText, onBText: (e) => set({ bText: e.target.value.slice(0, 8) }), bTextFs: String(s.bText.length > 5 ? 18 : s.bText.length > 3 ? 22 : 28), bHasLogo: Boolean(s.bLogo), bNoLogo: !s.bLogo, bLogo: s.bLogo || undefined, bLogoH: s.bLogo || 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', bTxtOp: s.bLogo ? '0' : '1', bLogoOp: s.bLogo ? '1' : '0', clearLogo: () => set({ bLogo: '' }), onLogo: (e) => this.logo(e, 'bLogo'),
      bPats: BP.map((n, i) => ({ key: n, n, pick: () => set({ bPat: i }), st: chip(s.bPat === i) })), bPatName: BP[s.bPat], bC1: s.bC1, bC2: s.bC2, bC3: s.bC3, onC1: (e) => set({ bC1: e.target.value }), onC2: (e) => set({ bC2: e.target.value }), onC3: (e) => set({ bC3: e.target.value }), bPhoneBg: `position:absolute;inset:0;background:radial-gradient(120% 70% at 70% 0%,${s.bC1},${s.bC2} 70%)`, bLoadBg: s.bLoadBg, onLoadBg: (e) => set({ bLoadBg: e.target.value }),
      bScopes: [['خاص بـ ' + (sel?.who || 'المستخدم'), 'يطلع له بس في «تصاميمكم الخاصة»'], ['عام لكل المستخدمين', founder ? 'ينضاف للتصاميم ويشوفه الكل' : 'للمؤسسين بس']].map((x, i) => ({ key: i, n: x[0], d: x[1], pick: () => { if (i === 0 || founder) set({ bScope: i }); }, st: box(s.bScope === i) })), bPublic: s.bScope === 1, bName: s.bName, onBName: (e) => set({ bName: e.target.value.slice(0, 40) }), bApprove: () => this.deliver(true), bPreview: () => this.deliver(false), bDone: Boolean(s.bDone), bNotDone: !s.bDone, bDoneTx: s.bDone,
      /* pattern editor */
      peEng: ENGINES.map((e, i) => ({ key: e[0], n: e[0], d: e[1], pick: () => set({ peE: i, peSaved: '' }), st: box(s.peE === i) })), peC1: s.peC1, peC2: s.peC2, peC3: s.peC3, peTx: s.peTx, onPe1: (e) => set({ peC1: e.target.value }), onPe2: (e) => set({ peC2: e.target.value }), onPe3: (e) => set({ peC3: e.target.value }), onPeTx: (e) => set({ peTx: e.target.value }), peDen: String(s.peDen), peSpd: String(s.peSpd), onPeDen: (e) => set({ peDen: Number(e.target.value) }), onPeSpd: (e) => set({ peSpd: Number(e.target.value) }), peTitle: s.peTitle, onPeTitle: (e) => set({ peTitle: e.target.value }), peTitleShow: s.peTitle || 'اسم المناسبة', peHasLogo: Boolean(s.peLogo), peLogo: s.peLogo || undefined, onPeLogo: (e) => this.logo(e, 'peLogo'), clearPeLogo: () => set({ peLogo: '' }), peBg: `position:absolute;inset:0;background:radial-gradient(120% 70% at 70% 0%,${s.peC1},${s.peC2} 75%)`,
      peScopes: [['خاص بمستخدم', 'يطلع له بس'], ['عام لكل المستخدمين', founder ? 'ينضاف للأنماط' : 'للمؤسسين بس']].map((x, i) => ({ key: i, n: x[0], d: x[1], pick: () => { if (i === 0 || founder) set({ peScope: i, peSaved: '' }); }, st: box(s.peScope === i) })), pePriv: s.peScope === 0, peUsers: d.customers.map((c) => ({ key: c.id, v: c.id, n: c.n })), peUser: s.peUser, onPeUser: (e) => set({ peUser: e.target.value }), peName: s.peName, onPeName: (e) => set({ peName: e.target.value.slice(0, 40), peSaved: '' }),
      peSave: () => this.run(() => api.post('/studio/patterns', { name: s.peName.trim(), scope: s.peScope ? 'public' : 'org', orgId: s.peScope ? undefined : s.peUser || undefined, data: { e: s.peE, c1: s.peC1, c2: s.peC2, c3: s.peC3, tx: s.peTx, den: s.peDen, spd: s.peSpd, logo: s.peLogo } })).then((r) => { if (r) set({ peSaved: s.peScope ? `انحفظ النمط «${s.peName}» وصار متاح لكل المستخدمين ✓` : `انحفظ النمط «${s.peName}» في حساب ${d.customers.find((c) => c.id === s.peUser)?.n || ''} ✓` }); }), peSaved: Boolean(s.peSaved), peSavedTx: s.peSaved, setPE: this.setPE,
      /* guide */
      tourAsk: s.tour === 0, touring: s.tour > 0, tourStart: () => set({ tour: 0 }), tourGo: () => this.goStep(1), tourSkip: () => set({ tour: -1 }), tNext: () => (s.tour >= nav.length ? set({ tour: -1 }) : this.goStep(s.tour + 1)), tPrev: () => { if (s.tour > 1) this.goStep(s.tour - 1); }, tHasPrev: s.tour > 1, tNextTx: s.tour >= nav.length ? 'يلا نبدأ' : 'التالي', tStep: `${s.tour > 0 ? s.tour : 1} من ${nav.length}`, tTitle: s.tour > 0 ? V[nav[s.tour - 1]][0] : '', tText: s.tour > 0 ? TOUR[nav[s.tour - 1]] : '', tDots: nav.map((t, i) => ({ key: t, st: `height:6px;border-radius:6px;transition:all .3s ease;width:${i + 1 === s.tour ? '22px' : '6px'};background:${i + 1 === s.tour ? '#0E97AE' : '#CFE7EE'}` })),
      spot: sp ? `top:${sp.t - 6}px;left:${sp.l - 6}px;width:${sp.w + 12}px;height:${sp.h + 12}px` : 'display:none',
      tip: (() => { if (!sp) return `top:${H / 2 - 100}px;left:${W / 2 - 170}px`; const tw = Math.min(340, W - 24); const th = 240; let top; let left; if (W > 900) { left = Math.max(12, sp.l - tw - 22); top = Math.max(12, Math.min(H - th - 12, sp.t + sp.h / 2 - th / 2)); } else { left = Math.max(12, Math.min(W - tw - 12, sp.l + sp.w / 2 - tw / 2)); top = sp.t + sp.h + 18; if (top + th > H) top = Math.max(12, sp.t - th - 18); } return `top:${top}px;left:${left}px;width:${tw}px`; })(), now: time(new Date()),
    };
  }
}
