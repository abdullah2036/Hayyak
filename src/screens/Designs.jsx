'use client';
import View from '@/views/Designs.view';
import { Screen } from '@/ui/dc';
import { base, TOUR } from '@/ui/kit';
import { SEALS } from '@/lib/constants';

const NV = ['#0A2A43', 'ليلي'];
const BK = ['#0E0E12', 'أسود'];
const SE = ['#0A5E78', 'بحري'];
const PR = ['#EDF1F3', 'لؤلؤي'];
const P = [
  ['لمّة نجوم', 'ليلة التكريم', 'HONOR NIGHT', 'VIP', [NV, BK, ['#062A20', 'زمردي']]], ['لمعة لؤلؤ', 'ملتقى الرواد', 'PIONEERS FORUM', 'متحدث', [PR, ['#0E97AE', 'تركوازي'], NV]], ['من القلب', 'إطلاق المشروع', 'PROJECT LAUNCH', 'ضيف', [NV, BK, ['#120A2A', 'درب التبانة']]],
  ['ألعاب نارية', 'حفل التخرج', 'GRADUATION', 'مدعو', [SE, BK, ['#1C0F3A', 'بنفسجي ملكي']]], ['رشّة فرح', 'الحفل الختامي', 'CLOSING CEREMONY', 'عضو', [PR, ['#FADDE4', 'وردي'], NV]], ['انفتح الستار', 'أمسية ثقافية', 'CULTURAL EVENING', 'راعي', [['#1E070D', 'عنابي'], ['#0A2A43', 'كحلي'], ['#06281F', 'زمردي']]],
  ['مرّ شهاب', 'ليلة الشتاء', 'WINTER NIGHT', 'تحكيم', [NV, BK, SE]], ['ضوء يلحقك', 'حفل الختام', 'FINALE', 'شريك', [['#2C1550', 'بنفسجي'], NV, ['#0E0E12', 'أسود ذهبي']]], ['سدو ينتسج', 'ليلة التراث', 'HERITAGE NIGHT', 'عضو', [NV, ['#2A140E', 'تقليدي'], ['#E6D7BC', 'رملي']]],
];
const STEPS = [['t0', 'التصاميم', 'الأنماط والأختام اللي تقدر تستخدمها في دعواتك'], ['t1', 'الأنماط', 'اختر النمط واللون وشوف الدعوة مباشرة، وابدأ فيه دعوة جديدة'], ['t2', 'الأختام', 'الختم يحدد صفة المدعو. ولو تبي ختم بشعاركم تطلبه من هنا']];

export default class Designs extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { tour: -1, tr: null, col: {} };
  }

  componentWillUnmount() { clearTimeout(this.tto); }

  renderVals() {
    const s = this.state;
    const { data, shell, router } = this.props;
    const dot = (c) => `width:16px;height:16px;border-radius:50%;background:${c};box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(10,42,67,.15)`;
    const btn = (on) => `height:36px;padding:0 12px 0 10px;border-radius:999px;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-family:inherit;${on ? 'border:0;background:#0A2A43;color:#fff;font-weight:700' : 'border:1px solid rgba(10,42,67,.14);background:#fff;color:#0A2A43'}`;
    const extra = data.designs.filter((x) => x.kind === 'pattern').map((x) => ({ key: x.id, n: x.name, title: 'مناسبتك', latin: '', seal: 'مدعو', col: 'لون 1', look: { pattern: 'لمّة نجوم', color: 0, seal: 'مدعو', title: 'مناسبتك', latin: '', eventLabel: '', engine: x.data }, use: `/app/create?pattern=${encodeURIComponent(x.name)}`, open: () => router.push(`/app/create?pattern=${encodeURIComponent(x.name)}`), cols: [{ key: 1, n: x.mine ? 'خاص فيكم' : 'جديد', pick: () => {}, dot: dot(x.data.c2), st: btn(true) }] }));
    return {
      ...base('التصاميم', shell),
      pats: [
        ...extra,
        ...P.map((p, pi) => { const ci = s.col[pi] || 0; const use = `/app/create?pattern=${encodeURIComponent(p[0])}&color=${ci}`; return { key: p[0], n: p[0], title: p[1], latin: p[2], seal: p[3], col: `لون ${ci + 1}`, use, open: () => router.push(use), cols: p[4].map((c, i) => ({ key: c[1], n: c[1], pick: () => this.setState({ col: { ...s.col, [pi]: i } }), dot: dot(c[0]), st: btn(ci === i) })) }; }),
      ],
      seals: [...SEALS.map((x, i) => ({ key: x[0], n: x[0], t: x[0], c: x[1], c2: x[2], c3: x[3], fs: x[4], gid: 'sg' + i })), ...data.designs.filter((x) => x.kind === 'seal').map((x, i) => ({ key: x.id, n: x.data.text || x.name, t: x.data.text || '★', c: x.data.wax, c2: x.data.wax, c3: x.data.wax, fs: 20, gid: 'sgx' + i }))],
      svc: data.services.map((x) => ({ key: x.id, n: x.name, d: [x.description, x.duration].filter(Boolean).join(' · '), p: x.price === null ? 'حسب الطلب' : `${x.price} ر.س` })),
      ...TOUR(this, STEPS),
    };
  }
}
