'use client';
import View from '@/views/Dashboard.view';
import { Screen } from '@/ui/dc';
import { api, base, copyText, rnd, saveXlsx, STATUS_ST } from '@/ui/kit';

const STEPS = [
  ['ابدأ من هنا', 'من «إنشاء دعوة» تسوي دعوتك بأربع خطوات: التفاصيل، التصميم، المدعوين، والإرسال'], ['رصيدك', 'تشوف كم دعوة باقية لك ومتى ينتهي رصيدك. الرصيد صالح 30 يوم من يوم الشراء'], ['دعوتك الجاية', 'أقرب مناسبة عندك: كم أرسلت وكم أكّد، وتنسخ رابطها مع رسالة جاهزة'], ['ما ردّوا للحين', 'اللي ما ردّوا يطلعون هنا، ومنها تجهّز رسالة التذكير'],
  ['كل دعواتك', 'كل دعوة بحالتها: مُرسلة أو مجدولة أو مسودة. اضغط عليها وتشوف تفاصيلها'], ['إحصائياتك', 'أرقام دعواتك كلها، وتقدر تحمّلها ملف Excel'], ['عندك سؤال؟', 'المساعد هنا دايم، اسأله عن أي شي في المنصة'],
];
const FL = ['الكل', 'مُرسلة', 'مجدولة', 'مسودة'];
const EMPTY = { until: '', badge: 'ابدأ أول دعوة', when: 'ما عندك مناسبة جاية', title: 'دعوتك الجاية تطلع هنا', latin: '', href: '/app/create', look: null, link: 'hayyak' };

export default class Dashboard extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { p: 0, f: 0, q: '', copied: false, reminded: false, tour: -1, sp: null };
  }

  componentDidMount() {
    const t0 = performance.now();
    this.tMeasure = () => this.measure();
    window.addEventListener('scroll', this.tMeasure, { passive: true });
    window.addEventListener('resize', this.tMeasure);
    if (!this.props.shell.user.tourSeen) this.tt0 = setTimeout(() => this.setState({ tour: 0 }), 900);
    const step = (now) => {
      const q = Math.min(1, (now - t0) / 1200);
      this.setState({ p: 1 - Math.pow(1 - q, 3) });
      if (q < 1) this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.tc);
    clearTimeout(this.tt0);
    clearTimeout(this.tt1);
    window.removeEventListener('scroll', this.tMeasure);
    window.removeEventListener('resize', this.tMeasure);
  }

  tEl(n) {
    const c = document.querySelectorAll(n === 7 ? '.fqb' : '[data-tour="' + n + '"]');
    for (const el of c) {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) return el;
    }
    return null;
  }

  goStep(n) {
    this.setState({ tour: n });
    const el = this.tEl(n);
    if (el && n !== 7) {
      const b = el.getBoundingClientRect();
      if (b.top < 70 || b.bottom > window.innerHeight - 40) el.scrollIntoView({ behavior: 'smooth', block: b.height > window.innerHeight * 0.6 ? 'start' : 'center' });
    }
    clearTimeout(this.tt1);
    this.measure();
    this.tt1 = setTimeout(() => this.measure(), 500);
  }

  measure() {
    if (!(this.state.tour > 0)) return;
    const el = this.tEl(this.state.tour);
    if (!el) return;
    const b = el.getBoundingClientRect();
    this.setState({ sp: { t: b.top, l: b.left, w: b.width, h: b.height } });
  }

  endTour() {
    this.setState({ tour: -1 });
    if (!this.props.shell.user.tourSeen) api.patch('/me', { tourSeen: true }).catch(() => {});
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const c = shell.credit;
    const n = (val) => Math.round(val * s.p).toLocaleString('en-US');
    const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    const stars = [];
    for (let i = 0; i < 40; i++) {
      const z = 1 + rnd(i) * 2;
      stars.push({ st: `position:absolute;left:${(rnd(i + 50) * 100).toFixed(1)}%;top:${(rnd(i + 90) * 100).toFixed(1)}%;width:${z.toFixed(1)}px;height:${z.toFixed(1)}px;border-radius:50%;background:#FFFFFF;opacity:${(0.3 + rnd(i + 130) * 0.6).toFixed(2)}` });
    }
    const t = d.totals;
    const tot = t.sent;
    let acc = 0;
    const donut = [['أكّدوا', t.yes, '#0E97AE'], ['فتحوا وما ردّوا', t.openNo, '#86DCEA'], ['ما فتحوا', t.unopened, '#0A2A43'], ['اعتذروا', t.no, '#B8C4CC']].map((x, i) => {
      const p = tot ? (x[1] / tot) * 100 : 0;
      const r = { key: x[0], label: x[0], n: n(x[1]), c: x[2], da: `${Math.max(0, p - 0.6).toFixed(2)} ${(100 - Math.max(0, p - 0.6)).toFixed(2)}`, off: (-acc).toFixed(2), an: `animation:dash 1.2s cubic-bezier(.2,.8,.2,1) ${0.2 + i * 0.25}s both` };
      acc += p;
      return r;
    });
    const q = s.q.trim();
    const rows = d.rows.filter((r) => (s.f === 0 || r.status === FL[s.f]) && (!q || r.title.includes(q))).slice(0, 8).map((r) => ({
      key: r.id, href: r.status === 'مسودة' ? `/app/create?id=${r.id}` : `/app/invitations/${r.id}`, title: r.title, date: r.short, pattern: r.look.engine ? 'نمط خاص' : r.look.pattern, event: r.eventLabel || '—', seal: r.look.seal, sc: SEAL[r.look.seal] || '#0E97AE', resp: r.stats.sent ? `${r.stats.ok} من ${r.stats.sent} أكّدوا` : 'ما أُرسلت', pct: pc(r.stats.ok, r.stats.sent) + '%', status: r.status, stc: STATUS_ST[r.status][0], stb: STATUS_ST[r.status][1], bg: LOOKBG[r.look.pattern] || LOOKBG['لمّة نجوم'],
    }));
    const nx = d.next ? { until: d.next.until, badge: [d.next.status, d.next.eventLabel].filter(Boolean).join(' · '), when: d.next.when, title: d.next.title, latin: d.next.latin, href: `/app/invitations/${d.next.id}`, look: d.next.look, link: d.next.link } : { ...EMPTY, link: shell.host };
    const self = this;
    return {
      ...base('الرئيسية', shell), stars, nx,
      hello: shell.org.name, headline: `${d.today} · ${d.active ? (d.active === 1 ? 'عندك دعوة نشطة' : d.active === 2 ? 'عندك دعوتين نشطة' : `عندك ${d.active} دعوات نشطة`) : 'ما عندك دعوات نشطة'}${d.pendingCount ? ` و ${d.pendingCount} مدعو ما ردّوا` : ''}`,
      creditTop: c.paid || c.bought ? `رصيد ${c.total} دعوة${c.bought ? ' · اشتريته ' + c.bought : ''}` : 'رصيدك المجاني للتجربة', creditTotal: c.total, creditUntil: c.days !== null ? `صالح لين ${c.expires} · باقي ${c.days} يوم` : 'للتجربة مرة وحدة', creditNote: c.days !== null ? 'اللي ما تستخدمه ينتهي مع الرصيد · ' : 'تحتاج أكثر؟ · ', left: n(c.left), days: c.days ?? '', ringDa: `${(c.total ? (106.8 * c.left * s.p) / c.total : 0).toFixed(1)} 200`,
      tiles: [
        { key: 1, l: 'دعوات انرسلت', v: n(c.used), d: 'من رصيدك الحالي', pct: pc(c.used, c.total) + '%', ic: 'M22 2L11 13M22 2l-7 20-4-9-9-4z', fg: '#0A2A43', bg: 'rgba(10,42,67,.08)' },
        { key: 2, l: 'نسبة التأكيد', v: n(pc(t.yes, tot)) + '%', d: `${t.yes} أكّدوا حضورهم`, pct: pc(t.yes, tot) + '%', ic: 'M5 12.5l4.5 4.5L19 7.5', fg: '#0E97AE', bg: 'rgba(14,151,174,.12)' },
        { key: 3, l: 'نسبة الفتح', v: n(pc(t.open, tot)) + '%', d: 'فتحوا الدعوة', pct: pc(t.open, tot) + '%', ic: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', fg: '#086577', bg: 'rgba(8,101,119,.1)' },
      ],
      ust: [{ key: 1, v: n(d.next?.stats.sent ?? 0), l: 'أُرسلت', c: '#0A2A43' }, { key: 2, v: n(d.next?.stats.ok ?? 0), l: 'أكّدوا', c: '#0E97AE' }, { key: 3, v: n(d.next?.stats.pending ?? 0), l: 'ما ردّوا', c: '#B8892A' }],
      copy: () => { if (!d.next) return; copyText(d.next.message); clearTimeout(this.tc); this.setState({ copied: true }); this.tc = setTimeout(() => this.setState({ copied: false }), 1600); },
      copyLabel: s.copied ? 'تم النسخ ✓' : 'انسخ مع الرسالة', copyBg: s.copied ? '#0E97AE' : '#0A2A43',
      remind: () => { if (d.next) { copyText(`${d.next.remind}\n${d.next.isPublic ? d.next.link : ''}`.trim()); this.setState({ reminded: true }); } }, remindLabel: s.reminded ? 'تم نسخ رسالة التذكير ✓' : 'جهّز رسالة التذكير',
      remHead: d.next?.reminder.by === 'hayyak' ? 'التذكير الجاي · حيّــاك تذكّرهم' : 'التذكير الجاي · قبل المناسبة بيوم', remNote: d.next?.reminder.by === 'none' ? 'التذكير متوقف لهذي الدعوة' : d.next?.reminder.by === 'hayyak' ? 'نذكّرهم باسمك قبل المناسبة بيوم' : 'بننبّهك وقت التذكير، وتنسخ رسالة جاهزة لكل اللي ما ردّوا وترسلها من أي تطبيق',
      pending: d.pending.map((p, i) => ({ key: i, ...p })), pendingCount: d.pendingCount ? `${d.pendingCount} مدعو` : 'كلهم ردّوا',
      donut, total: n(tot), today: d.today,
      chans: d.channels.map((x, i) => ({ key: x.name, name: x.name, sent: x.sent, open: x.open + '%', col: ['#0E97AE', '#0A2A43', '#86DCEA', '#B8C4CC'][i % 4], dl: `.${2 + i}s` })),
      filters: FL.map((l, i) => ({ key: l, label: l, on: () => this.setState({ f: i }), st: `height:32px;padding:0 14px;border-radius:999px;font-size:12px;cursor:pointer;${s.f === i ? 'border:0;background:#0A2A43;color:#FFFFFF;font-weight:700' : 'border:1px solid rgba(10,42,67,.18);background:transparent;color:#0A2A43'}` })),
      rows, q: s.q, onQ: (e) => this.setState({ q: e.target.value }),
      events: d.groups.map((g) => ({ key: g.name, name: g.name, count: g.count, sub: g.sub, pct: g.pct + '%', invs: g.invs.map((x, i) => ({ key: i, t: x, bg: i % 2 ? 'linear-gradient(160deg,#FFFFFF,#CFE7EE)' : 'linear-gradient(160deg,#123E5C,#04121F)' })) })),
      dlStats: (e) => { e?.preventDefault(); saveXlsx('حياك - إحصائيات.xlsx', [{ name: 'الدعوات', rows: [['الدعوة', 'الفعالية', 'التاريخ', 'الحالة', 'أُرسلت', 'فتحوا', 'أكّدوا', 'اعتذروا', 'ما ردّوا'], ...d.rows.map((r) => [r.title, r.eventLabel, r.startsAt ? r.startsAt.slice(0, 10) : '', r.status, r.stats.sent, r.stats.open, r.stats.ok, r.stats.no, r.stats.pending])] }, { name: 'القنوات', rows: [['القناة', 'أُرسلت', 'نسبة الفتح'], ...d.channels.map((x) => [x.name, x.sent, x.open + '%'])] }]); },
      tourAsk: s.tour === 0, touring: s.tour > 0, tourGo: () => this.goStep(1), tourSkip: () => this.endTour(), tourStart: () => this.setState({ tour: 0 }),
      tNext: () => (s.tour >= STEPS.length ? this.endTour() : this.goStep(s.tour + 1)), tPrev: () => { if (s.tour > 1) this.goStep(s.tour - 1); }, tHasPrev: s.tour > 1, tNextTx: s.tour >= STEPS.length ? 'يلا نبدأ' : 'التالي', tStep: `${s.tour > 0 ? s.tour : 1} من ${STEPS.length}`,
      tTitle: s.tour > 0 ? STEPS[s.tour - 1][0] : '', tText: s.tour > 0 ? STEPS[s.tour - 1][1] : '', tDots: STEPS.map((x, i) => ({ key: i, st: `height:6px;border-radius:6px;transition:all .3s ease;width:${i + 1 === s.tour ? '22px' : '6px'};background:${i + 1 === s.tour ? '#0E97AE' : '#CFE7EE'}` })),
      ...spot(self),
    };
  }
}

const SEAL = { 'مدعو': '#0E97AE', 'ضيف': '#2D5A8C', 'عضو': '#3F7F6A', 'متحدث': '#0A2A43', VIP: '#B8892A', 'راعي': '#7A3E5B', 'شريك': '#4A4682', 'تحكيم': '#8C2F39' };
const R = (a, b, c) => `radial-gradient(120% 80% at 70% 0%,${a},${b} 50%,${c})`;
const LOOKBG = { 'لمّة نجوم': R('#123E5C', '#0A2A43', '#04121F'), 'لمعة لؤلؤ': R('#FFFFFF', '#EDF1F3', '#CFE7EE'), 'من القلب': R('#123E5C', '#0A2A43', '#04121F'), 'ألعاب نارية': R('#12A3BA', '#0A5E78', '#071D30'), 'رشّة فرح': R('#FFFFFF', '#EDF1F3', '#CFE7EE'), 'انفتح الستار': R('#3A0F18', '#1E070D', '#0A0205'), 'مرّ شهاب': R('#123E5C', '#0A2A43', '#04121F'), 'ضوء يلحقك': R('#4A2C78', '#2C1550', '#140826'), 'سدو ينتسج': R('#4A2418', '#2A140E', '#120806'), 'صورة خاصة': R('#2A3540', '#141B22', '#06090C') };

function spot(self) {
  const q = self.state.sp;
  const W = typeof window === 'undefined' ? 1200 : window.innerWidth;
  const H = typeof window === 'undefined' ? 800 : window.innerHeight;
  if (!q) return { spot: 'display:none', tip: `top:${H / 2 - 100}px;left:${W / 2 - 170}px` };
  const pd = 8;
  const tw = Math.min(340, W - 24);
  const th = 230;
  const top = q.t + q.h + th + 24 < H ? q.t + q.h + 18 : q.t - th - 18 > 8 ? q.t - th - 18 : H - th - 16;
  const left = Math.max(12, Math.min(W - tw - 12, q.l + q.w / 2 - tw / 2));
  return { spot: `top:${q.t - pd}px;left:${q.l - pd}px;width:${q.w + pd * 2}px;height:${q.h + pd * 2}px;${self.state.tour === 1 || self.state.tour === 7 ? 'border-radius:999px' : ''}`, tip: `top:${Math.max(8, top)}px;left:${left}px;width:${tw}px` };
}
