'use client';
import View from '@/views/Requests.view';
import { Screen } from '@/ui/dc';
import { api, base, chipSt, TOUR } from '@/ui/kit';

const STG = ['طلب جديد', 'بانتظار التواصل معك', 'تم التواصل', 'قيد التصميم', 'بانتظار موافقتك', 'تم التسليم'];
const SC = [['#086577', 'rgba(134,220,234,.3)'], ['#086577', '#E6F6F9'], ['#086577', 'rgba(76,199,218,.25)'], ['#FFFFFF', '#0E97AE'], ['#FFFFFF', '#0A2A43'], ['#3A4B58', '#DCE4E8']];
const NOTE = ['استلمنا طلبك، وبنتواصل معك خلال يوم عمل', 'نحاول نوصلك، تأكد من رقمك أو بريدك', 'تواصلنا معك، وبعد ما نتفق على الفكرة والسعر نبدأ', 'نشتغل على تصميمك الحين', 'المعاينة جاهزة وتنتظر موافقتك', 'جاهز وموجود في التصاميم، تقدر تستخدمه في أي دعوة'];
const STEPS = [['t0', 'طلبات التخصيص', 'اطلب تصميم بهويتك: ألوانكم، ختم خاص، أو شاشة تحميل'], ['t1', 'طلب جديد', 'اختر نوع التخصيص واكتب وش تبي'], ['t2', 'متابعة طلبك', 'كل طلب يمشي بمراحل، ولما تجهز المعاينة توافق أو تطلب تعديل'], ['t3', 'الطلبات المكتملة', 'اللي خلص منها، وتلقاه جاهز في التصاميم']];

export default class Requests extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { tour: -1, tr: null, showNew: false, type: 0, ch: 0, desc: '', contact: p.data.phone || '', err: '', busy: false };
  }

  componentWillUnmount() { clearTimeout(this.tto); }

  async answer(id, a) {
    try {
      await api.post(`/requests/${id}/${a}`);
      this.props.router.refresh();
    } catch (e) {
      this.setState({ err: e.message });
    }
  }

  async submit() {
    const s = this.state;
    const { services, email } = this.props.data;
    if (s.busy) return;
    this.setState({ busy: true, err: '' });
    try {
      await api.post('/requests', { title: services[s.type]?.name || 'فكرة ثانية', description: s.desc, via: s.ch === 0 ? 'واتساب' : 'إيميل', phone: s.ch === 0 ? s.contact : '', email: s.ch === 1 ? s.contact || email : '' });
      this.setState({ showNew: false, desc: '', busy: false });
      this.props.router.refresh();
    } catch (e) {
      this.setState({ err: e.message, busy: false });
    }
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const card = (on) => `height:44px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;${on ? 'border:0;background:#0A2A43;color:#FFFFFF' : 'border:1px solid rgba(10,42,67,.16);background:#FFFFFF;color:#0A2A43'}`;
    const look = (x) => (x.kind === 'seal' ? `ختم «${x.data.text || 'شعاركم'}»` : x.kind === 'colors' ? 'ألوان على نمط ' + x.data.pattern : 'شاشة تحميل بشعاركم');
    const swatch = (x) => (x.kind === 'seal' ? `background:${x.data.wax}` : x.kind === 'colors' ? `background:radial-gradient(120% 90% at 70% 0%,${x.data.c1},${x.data.c2})` : `background:${x.data.bg}`);
    return {
      ...base('طلبات التخصيص', shell), showNew: s.showNew, openNew: () => this.setState({ showNew: !s.showNew, err: '' }), err: s.err,
      types: d.services.map((t, i) => ({ key: t.id, n: t.name, d: t.description, p: t.price === null ? 'حسب الطلب' : `${t.price} ر.س · ${t.duration}`, st: card(s.type === i), pick: () => this.setState({ type: i }) })),
      desc: s.desc, onDesc: (e) => this.setState({ desc: e.target.value.slice(0, 1500) }), chans: ['واتساب', 'إيميل'].map((c, i) => ({ key: c, n: c, st: chipSt(s.ch === i), pick: () => this.setState({ ch: i, contact: i === 0 ? d.phone : d.email }) })),
      contact: s.contact, contactPh: s.ch === 0 ? '05X XXX XXXX' : 'name@example.com', onContact: (e) => this.setState({ contact: e.target.value }), submit: () => this.submit(),
      reqs: d.requests.filter((r) => r.st < 5).map((r) => ({ key: r.id, t: r.t, meta: r.meta, stage: STG[r.st], sc: SC[r.st][0], sb: SC[r.st][1], note: r.message || NOTE[r.st], step: `المرحلة ${r.st + 1} من 6`, review: r.st === 4, approve: () => this.answer(r.id, 'approve'), change: () => this.answer(r.id, 'change'), preview: r.design ? look(r.design) : 'المعاينة جاهزة', sw: r.design ? swatch(r.design) : '', segs: STG.map((n, i) => ({ key: n, st: `flex:1;height:8px;border-radius:999px;background:${i < r.st ? '#0E97AE' : i === r.st ? '#0A2A43' : '#DCE4E8'}` })) })),
      done: d.requests.filter((r) => r.st === 5).map((r) => ({ key: r.id, t: r.t, meta: r.meta })), hasDone: d.requests.some((r) => r.st === 5),
      ...TOUR(this, STEPS),
    };
  }
}
