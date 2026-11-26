'use client';
import View from '@/views/Certificate.view';
import { Screen } from '@/ui/dc';
import { api, base, chipSt, radioSt, tgl, TOUR } from '@/ui/kit';
import { certVals, COLORS, TCOLS, ALIGNS, SIZES, TITLES } from '@/ui/cert';

const STEPS = [
  ['1', 'إعداد الشهادة', 'تجهّز شكل الشهادة مرة وحدة، وتطلع لكل اللي سجّلوا حضورهم'], ['2', 'القالب', 'فاتح أو غامق بلون جهتك، أو «تصميمكم»: ترفع شهادة مصممة كاملة وحنا نحط عليها الاسم'], ['11', 'لغة الشهادة', 'عربي فقط، أو عربي وإنجليزي: النص الأساسي يطلع بعمودين، العربي من اليمين والإنجليزي من اليسار'],
  ['4', 'الشعار واللون', 'ارفع شعاركم من جهازك واختر لون الشهادة. جرّب ترفع صورة وشوفها في المعاينة'], ['8', 'تصميمكم', 'ارفع تصميم الشهادة بدون الاسم، واختر وش يطلع عليه: الفعالية، التاريخ، المدة، أو حقل زيادة'], ['10', 'مكان الاسم وشكله', 'حرّك الاسم يمين ويسار وفوق وتحت، واختر محاذاته وحجمه ولونه عشان يركب على تصميمكم'],
  ['5', 'نص الشهادة', 'كل الكلام تكتبه أنت: نوع الشهادة، اسم الجهة، الجملة والنص. وإذا اخترت لغتين يطلع لك مكان النص الإنجليزي'], ['12', 'التوقيع', 'اكتب اسم الموقّع وصفته، وارفع صورة توقيعه'], ['6', 'المعاينة', 'كل تغيير تسويه يطلع هنا على طول'], ['7', 'متى تطلع؟', 'تلقائيًا لما يتسكّر كود الحضور، أو تطلعها أنت بعد ما تراجع الكشف'], ['9', 'طلبات تعديل الاسم', 'بعد ما تطلع الشهادة، المدعو يرسل طلب لو اسمه غلط، وأنت توافق أو ترفض'],
];

export default class Certificate extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { c: p.data.config, saved: '', tour: -1, tr: null, dirty: false };
  }

  componentWillUnmount() {
    clearTimeout(this.tto);
    clearTimeout(this.ts);
  }

  up(o) { this.setState((st) => ({ c: { ...st.c, ...o }, dirty: true, saved: '' })); }

  async upload(e, kind, key) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    this.setState({ saved: 'نرفع الصورة…' });
    try {
      const a = await api.upload('/assets', f, { kind });
      this.up({ [key]: a.url });
      this.setState({ saved: '' });
    } catch (er) {
      this.setState({ saved: er.message });
    }
  }

  async save() {
    this.setState({ saved: 'لحظة…' });
    try {
      await api.post(`/invitations/${this.props.data.id}/certificate`, this.state.c);
      this.setState({ saved: 'تم الحفظ ✓', dirty: false });
      this.props.router.refresh();
    } catch (e) {
      this.setState({ saved: e.message });
    }
    clearTimeout(this.ts);
    this.ts = setTimeout(() => this.setState({ saved: '' }), 2600);
  }

  renderVals() {
    const s = this.state;
    const c = s.c;
    const { data: d, shell } = this.props;
    const up = (o) => this.up(o);
    const txt = (k, max) => (e) => up({ [k]: e.target.value.slice(0, max) });
    const V = certVals(c, { nameAr: 'سارة أحمد الغامدي', nameEn: 'Sara Ahmed Alghamdi', extraValue: '443•••112', event: d.event });
    const et = tgl(c.extra);
    const cust = c.tpl === 2;
    const fields = [['ev', 'الفعالية'], ['dt', 'التاريخ'], ['du', 'المدة'], ['ex', c.extraL || 'حقل زيادة']];
    const sw = (on) => `height:42px;padding:0 14px 0 10px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;font-family:inherit;color:#0A2A43;${on ? 'border:2px solid #0A2A43;background:#FFFFFF' : 'border:2px solid transparent;background:rgba(255,255,255,.7)'}`;
    return {
      ...base('الدعوات', shell), accent: V.accent, accentD: V.accentD, cfg: c, cdata: { sample: true, nameAr: 'سارة أحمد الغامدي', nameEn: 'Sara Ahmed Alghamdi', extraValue: '443•••112', event: d.event }, back: `/app/invitations/${d.id}/attendance`, evTitle: d.title, save: () => this.save(), saveL: s.saved || (s.dirty ? 'احفظ الإعداد' : 'احفظ الإعداد'),
      tpls: [['فاتح', '#F8FAFB', V.accent, '#0A2A43', '#B8892A', 'border:1px solid #DCE4E8'], ['غامق', 'radial-gradient(90% 80% at 50% 0%,#123E5C,#0A2A43 55%,#061C2D)', V.accentD, '#FFFFFF', V.accentD, 'border:1px solid #0A2A43'], ['تصميمكم', '#EDF1F3', '', '', '', 'border:2px dashed #B8C4CC']].map((t, i) => { const on = c.tpl === i; return { key: t[0], l: t[0], c1: t[2], c2: t[3], c3: t[4], isImg: i === 2, notImg: i !== 2, pr: on ? 'true' : 'false', on: () => up({ tpl: i }), st: `display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px;border-radius:20px;cursor:pointer;font-family:inherit;color:#0A2A43;${on ? 'border:2px solid #0E97AE;background:rgba(230,246,249,.85)' : 'border:2px solid transparent;background:rgba(255,255,255,.7)'}`, mini: `position:relative;width:100%;aspect-ratio:1.41;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-sizing:border-box;background:${t[1]};${t[5]}` }; }),
      notCustom: !cust, isCustom: cust, logo: c.logo, hasLogo: Boolean(c.logo), noLogo: !c.logo, onLogo: (e) => this.upload(e, 'logo', 'logo'), rmLogo: () => up({ logo: '' }),
      colors: COLORS.map((x, i) => ({ key: x[0], l: x[0], v: x[1], pr: c.color === i ? 'true' : 'false', on: () => up({ color: i }), st: sw(c.color === i) })), titles: TITLES.map((t, i) => ({ key: t, l: t, pr: c.title === i ? 'true' : 'false', on: () => up({ title: i }), st: chipSt(c.title === i, 42) })),
      org: c.org, onOrg: txt('org', 80), signer: c.signer, onSigner: txt('signer', 80), role: c.role, onRole: txt('role', 80), extra: c.extra, exPr: c.extra ? 'true' : 'false', exBg: et.bg, exKnob: et.knob, togEx: () => up({ extra: !c.extra }), extraL: c.extraL, onExL: txt('extraL', 40),
      whens: [['أول ما يتسكّر كود الحضور', 'تطلع تلقائيًا لكل اللي سجّلوا، وتوصلهم في رابط دعوتهم'], ['أطلعها أنا', 'تراجع الكشف أول، وبعدها تضغط «طلّع الشهادات» من صفحة الحضور']].map((w, i) => { const r = radioSt(c.when === i); return { key: i, t: w[0], d: w[1], pr: c.when === i ? 'true' : 'false', on: () => up({ when: i }), st: r.st, dot: r.dot, dotIn: r.dotIn }; }),
      bg: c.bg, hasBg: Boolean(c.bg), noBg: !c.bg, bgBtn: c.bg ? 'غيّر التصميم' : 'ارفع تصميم الشهادة', onBg: (e) => this.upload(e, 'certbg', 'bg'), rmBg: () => up({ bg: '' }),
      fields: fields.map((f) => { const on = f[0] === 'ex' ? c.extra : Boolean(c.fields[f[0]]); return { key: f[0], l: f[1], pr: on ? 'true' : 'false', st: chipSt(on, 42), on: () => (f[0] === 'ex' ? up({ extra: !c.extra }) : up({ fields: { ...c.fields, [f[0]]: !on } })) }; }),
      px: c.px, py: c.py, onPx: (e) => up({ px: Number(e.target.value) }), onPy: (e) => up({ py: Number(e.target.value) }),
      aligns: ALIGNS.map((a, i) => ({ key: a[0], l: a[0], pr: c.al === i ? 'true' : 'false', st: chipSt(c.al === i, 42), on: () => up({ al: i }) })), sizes: SIZES.map((a, i) => ({ key: a[0], l: a[0], pr: c.sz === i ? 'true' : 'false', st: chipSt(c.sz === i, 42), on: () => up({ sz: i }) })), tcols: TCOLS.map((x, i) => ({ key: x[0], l: x[0], v: x[1], pr: c.tc === i ? 'true' : 'false', on: () => up({ tc: i }), st: sw(c.tc === i) })),
      langs: [['ar', 'عربي فقط'], ['bi', 'عربي وإنجليزي']].map((l) => ({ key: l[0], l: l[1], pr: c.lang === l[0] ? 'true' : 'false', st: chipSt(c.lang === l[0], 42), on: () => up({ lang: l[0] }) })), isAr: c.lang !== 'bi', isBi: c.lang === 'bi',
      orgSub: c.orgSub, onOrgSub: txt('orgSub', 80), certLine: c.certLine, onCertLine: txt('certLine', 160), para: c.para, onPara: txt('para', 700), enLine: c.enLine, onEnLine: txt('enLine', 160), enPara: c.enPara, onEnPara: txt('enPara', 700), sigImg: c.sigImg, hasSig: Boolean(c.sigImg), noSig: !c.sigImg, onSig: (e) => this.upload(e, 'signature', 'sigImg'), rmSig: () => up({ sigImg: '' }),
      hasReqs: d.requests.length > 0,
      reqs: d.requests.map((r) => ({ key: r.id, from: r.from, to: r.to, pending: r.st === 'pending', done: r.st !== 'pending', res: r.st === 'ok' ? 'وافقت · طلعت له شهادة جديدة بالاسم الصحيح' : 'رفضت · وصله إشعار', c: r.st === 'ok' ? '#086577' : '#4A5B68', ok: () => this.decide(r.id, true), no: () => this.decide(r.id, false) })),
      ...TOUR(this, STEPS),
    };
  }

  async decide(id, ok) {
    try {
      await api.post(`/invitations/${this.props.data.id}/names/${id}`, { ok });
      this.props.router.refresh();
    } catch (e) {
      this.setState({ saved: e.message });
    }
  }
}
