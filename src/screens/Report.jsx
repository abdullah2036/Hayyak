'use client';
import View from '@/views/Report.view';
import { Screen } from '@/ui/dc';
import { base, chipSt, copyText, saveXlsx, TOUR, waxPath } from '@/ui/kit';

const STEPS = [
  ['1', 'تقرير الفصل', 'يجمع كل فعالياتك تلقائيًا. تحمّله PDF أو Excel، أو تنسخ رابطه وترسله للعمادة'], ['2', 'اختر الفصل', 'تقدر تقارن بين الفصول'], ['3', 'الأرقام الكبيرة', 'عدد الفعاليات والحضور ومتوسط نسبة الحضور وكم شهادة حُمّلت'], ['4', 'نسبة الحضور', 'كل عمود فعالية، والأعلى ملوّن. تعرف وش الفعاليات اللي تجيب ناس فعلًا'],
  ['6', 'أكثر الأعضاء حضورًا', 'تفيدك في التكريم آخر الفصل أو حساب ساعات التطوع'], ['5', 'الفعاليات', 'تفاصيل كل فعالية: المدعوين، اللي أكّدوا، اللي حضروا، والنسبة'],
];
const EMPTY = { label: 'هذا الفصل', ev: [], top: [] };

export default class Report extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { sem: 0, copied: false, tour: -1, tr: null };
  }

  componentWillUnmount() {
    clearTimeout(this.tto);
    clearTimeout(this.tc);
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const S = d.terms[s.sem] || EMPTY;
    const ev = S.ev;
    const sum = (k) => ev.reduce((a, e) => a + e[k], 0);
    const rate = (e) => (e.c ? Math.min(1, e.a / e.c) : 0);
    const best = Math.max(0, ...ev.map(rate));
    const fmt = (n) => n.toLocaleString('en-US');
    return {
      ...(shell ? base('الدعوات', shell) : { wax: waxPath(1.3), nav1: [], nav2: [], bnav: [], side: {} }), shared: d.shared, notShared: !d.shared, repSub: d.shared ? `فعاليات ${d.org}` : 'كل فعالياتك في مكان واحد، جاهز ترفعه للعمادة أو الجهة المشرفة',
      sems: d.terms.map((m, i) => ({ key: m.key, l: m.label, pr: s.sem === i ? 'true' : 'false', on: () => this.setState({ sem: i }), st: chipSt(s.sem === i, 42) })),
      kpis: [{ key: 1, l: 'الفعاليات', v: ev.length, s: S.label, c: '#0A2A43' }, { key: 2, l: 'المدعوين', v: fmt(sum('i')), s: 'في كل الفعاليات', c: '#0A2A43' }, { key: 3, l: 'الحضور', v: fmt(sum('a')), s: 'سجّلوا حضورهم', c: '#0E97AE' }, { key: 4, l: 'متوسط نسبة الحضور', v: (sum('c') ? Math.min(100, Math.round((sum('a') / sum('c')) * 100)) : 0) + '%', s: 'من اللي أكّدوا', c: '#086577' }, { key: 5, l: 'شهادات محمّلة', v: fmt(sum('dl')), s: `من ${fmt(sum('certs'))} شهادة طلعت`, c: '#B8892A' }],
      bars: ev.map((e, i) => { const p = rate(e); const top = p === best && p > 0; return { key: i, p: Math.round(p * 100) + '%', n: i + 1, tc: top ? '#086577' : '#4A5B68', bar: `display:block;width:100%;max-width:44px;border-radius:10px 10px 4px 4px;animation-delay:${i * 0.04}s;height:${Math.round(p * 120 + 8)}px;background:${top ? '#0E97AE' : '#B8DDE5'}` }; }),
      chartLabel: ev.length ? `أعلى نسبة حضور ${Math.round(best * 100)}%` : 'ما فيه فعاليات في هذا الفصل',
      evs: ev.map((e, i) => { const p = Math.round(rate(e) * 100); return { key: i, n: `${i + 1} · ${e.n}`, sub: `${e.d} · حضر ${e.a} من ${e.i}`, d: e.d, i: e.i, c: e.c, a: e.a, p: p + '%', bar: `display:block;height:100%;border-radius:8px;background:#0E97AE;width:${p}%` }; }),
      tops: S.top.map((t, i) => ({ key: i, r: i + 1, n: t.n, c: `${t.c} من ${ev.length} فعالية`, rk: `width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex:none;${i === 0 ? 'background:#E7C873;color:#5B4A12' : 'background:rgba(14,151,174,.12);color:#086577'}` })),
      pdf: () => window.print(), pdfL: 'حمّل التقرير PDF',
      xl: () => saveXlsx(`حياك - تقرير ${S.label}.xlsx`, [{ name: S.label, rows: [['الفعالية', 'التاريخ', 'المدعوين', 'أكّدوا', 'حضروا', 'نسبة الحضور', 'شهادات محمّلة'], ...ev.map((e) => [e.n, e.d, e.i, e.c, e.a, Math.round(rate(e) * 100) + '%', e.dl])] }]),
      share: () => { copyText(`تقرير ${S.label} من ${d.org}\n${d.link}`); clearTimeout(this.tc); this.setState({ copied: true }); this.tc = setTimeout(() => this.setState({ copied: false }), 1600); }, shareL: s.copied ? 'تم النسخ ✓' : 'انسخ رابط التقرير',
      ...TOUR(this, STEPS),
    };
  }
}
