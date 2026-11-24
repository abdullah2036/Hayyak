'use client';
import View from '@/views/Invitations.view';
import { Screen } from '@/ui/dc';
import { base, chipSt, cntSt, STATUS_ST, TOUR } from '@/ui/kit';
import { plural } from '@/lib/dates';

const FL = ['الكل', 'مُرسلة', 'مجدولة', 'مسودة', 'انتهت'];
const LIGHT = new Set(['لمعة لؤلؤ', 'رشّة فرح']);
const STEPS = [['t0', 'الدعوات', 'كل دعواتك في مكان واحد، ومنها تبدأ دعوة جديدة'], ['t1', 'الفلاتر', 'فلتر الدعوات حسب حالتها'], ['t3', 'بطاقات الدعوات', 'كل بطاقة فيها الموعد والمكان ونسبة الردود. افتحها عشان تشوف التفاصيل والحضور والشهادات']];

export default class Invitations extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { tour: -1, tr: null, f: 0, q: '' };
  }

  componentWillUnmount() { clearTimeout(this.tto); }

  renderVals() {
    const s = this.state;
    const { data, shell } = this.props;
    const all = data.cards;
    const q = s.q.trim();
    const list = all.filter((c) => (s.f === 0 || c.status === FL[s.f]) && (!q || c.title.includes(q)));
    const priv = all.filter((c) => c.audience === 'خاصة').length;
    return {
      ...base('الدعوات', shell), q: s.q, onQ: (e) => this.setState({ q: e.target.value }),
      summary: all.length ? `${plural(all.length, 'دعوة وحدة', 'دعوتين', 'دعوات')} · ${priv} خاصة و${all.length - priv} عامة` : 'ما عندك دعوات للحين، ابدأ أول وحدة',
      filters: FL.map((l, i) => ({ key: l, label: l, n: i === 0 ? all.length : all.filter((c) => c.status === l).length, on: () => this.setState({ f: i }), st: chipSt(s.f === i), cst: cntSt(s.f === i) })),
      empty: all.length > 0 && list.length === 0, leftLine: `باقي لك ${shell.credit.left} دعوة`,
      cards: list.map((c, i) => {
        const dark = !LIGHT.has(c.look.pattern) || c.look.color === 2 || Boolean(c.look.engine);
        const pct = c.stats.sent ? Math.round((c.stats.ok / c.stats.sent) * 100) : 0;
        const draft = c.status === 'مسودة';
        return {
          key: c.id, t: c.title, ty: c.audience, look: c.look, pat: `${c.look.engine ? 'نمط خاص' : c.look.pattern} · ${c.by}`, bg: dark ? 'radial-gradient(120% 90% at 80% 0%,#123E5C,#0A2A43 50%,#04121F)' : 'radial-gradient(120% 90% at 70% 0%,#FFFFFF,#EDF1F3 50%,#CFE7EE)', fg: dark ? '#FFFFFF' : '#0A2A43',
          st: c.status, stc: dark ? '#FFFFFF' : STATUS_ST[c.status][0], stb: dark ? 'rgba(255,255,255,.16)' : STATUS_ST[c.status][1], when: c.time ? `${c.date} · ${c.time}` : c.date, pl: c.place || 'المكان ما تحدد', resp: c.stats.sent ? `${c.stats.ok} أكّدوا من ${c.stats.sent}` : c.status === 'مجدولة' ? (c.scheduled ? `ترسل ${c.scheduled}` : 'بانتظار الإرسال') : 'ما أُرسلت', pct: pct + '%', dl: `${(i * 0.06).toFixed(2)}s`,
          href: draft ? `/app/create?id=${c.id}` : `/app/invitations/${c.id}`, openL: draft ? 'كمّلها' : 'التفاصيل', preview: `/app/invitations/${c.id}/preview`,
        };
      }),
      ...TOUR(this, STEPS),
    };
  }
}
