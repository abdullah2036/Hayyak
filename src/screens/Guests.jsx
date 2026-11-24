'use client';
import View from '@/views/Guests.view';
import { Screen } from '@/ui/dc';
import { base, chipSt, guestTemplate, saveXlsx, TOUR } from '@/ui/kit';

const GS = { 'أكّد': ['#086577', 'rgba(14,151,174,.16)', '✓'], 'اعتذر': ['#3A4B58', 'rgba(184,196,204,.4)', '×'], 'ما ردّ': ['#5B4A12', 'rgba(231,200,115,.4)', '…'] };
const SF = [['الكل', null], ['أكّدوا', 'أكّد'], ['اعتذروا', 'اعتذر'], ['ما ردّوا', 'ما ردّ']];
const STEPS = [['t0', 'المدعوين', 'كل المدعوين في كل دعواتك، مع البحث وتحميل القائمة وقالب الأسماء'], ['t1', 'الأرقام', 'مجموع الردود في كل الدعوات'], ['t2', 'القائمة', 'فلتر حسب الدعوة أو الحالة، وشوف رد كل شخص في كل دعوة']];
const digits = (t) => t.replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));

export default class Guests extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { tour: -1, tr: null, q: '', iv: 0, sf: 0 };
  }

  componentWillUnmount() { clearTimeout(this.tto); }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const q = digits(s.q.trim());
    const rows = d.people.filter((g) => g.inv.some((x) => (s.iv === 0 || x.id === d.invs[s.iv - 1].id) && (s.sf === 0 || x.st === SF[s.sf][1])) && (!q || g.n.includes(q) || g.phone.includes(q.replace(/^0/, '')) || g.email.includes(q.toLowerCase())));
    return {
      ...base('المدعوين', shell), q: s.q, onQ: (e) => this.setState({ q: e.target.value }), countLine: `${d.people.length} اسم`,
      kpis: [{ key: 1, l: 'كل المدعوين', v: d.kpis.all, c: '#0A2A43' }, { key: 2, l: 'أكّدوا', v: d.kpis.yes, c: '#0E97AE' }, { key: 3, l: 'اعتذروا', v: d.kpis.no, c: '#4A5B68' }, { key: 4, l: 'ما ردّوا', v: d.kpis.pending, c: '#B8892A' }],
      invF: ['كل الدعوات', ...d.invs.map((i) => i.t)].map((l, i) => ({ key: i, label: l, on: () => this.setState({ iv: i }), st: chipSt(s.iv === i) })),
      stF: SF.map((f, i) => ({ key: f[0], label: f[0], on: () => this.setState({ sf: i }), st: chipSt(s.sf === i) })),
      rows: rows.slice(0, 200).map((g, i) => ({ key: i, i: g.i, n: g.n, c: g.c, when: g.when, inv: g.inv.slice(0, 5).map((x, k) => ({ key: k, t: x.t, ic: GS[x.st][2], sc: GS[x.st][0], sb: GS[x.st][1] })) })),
      empty: rows.length === 0, dlTpl: (e) => { e?.preventDefault(); guestTemplate(); },
      dlX: (e) => { e?.preventDefault(); saveXlsx('حياك - كل المدعوين.xlsx', [{ name: 'المدعوين', rows: [['الاسم', 'الجوال', 'الإيميل', 'الدعوة', 'الحالة'], ...d.people.flatMap((g) => g.inv.map((x) => [g.n, g.phone, g.email, x.t, x.st]))] }]); },
      ...TOUR(this, STEPS),
    };
  }
}
