'use client';
import View from '@/views/GuestJourney.view';
import { Screen } from '@/ui/dc';
import { starField, TOUR, waxPath } from '@/ui/kit';

const STEPS = [['1', 'رحلة المدعو', 'هذي الصفحة توريك وش يشوف المدعو في رابط دعوته من البداية للنهاية'], ['2', 'المراحل', 'اضغط أي مرحلة وشوف شكلها في الجوال. أو امشِ عليها خطوة خطوة من الجوال نفسه'], ['3', 'الجوال', 'جرّب: أكّد الحضور، عدّل الاسم، اكتب الكود 4827، وبعدها شوف الشهادة باسمك'], ['4', 'حضوري أو أونلاين', 'الأونلاين ما فيه باركود، والكود ينزل في الشات']];
const chip = (on) => `height:40px;padding:0 16px;border-radius:999px;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;${on ? 'border:0;background:#0A2A43;color:#FFFFFF;font-weight:700' : 'border:1px solid rgba(10,42,67,.16);background:rgba(255,255,255,.7);color:#0A2A43'}`;

/** A walk-through for organisers: what a guest sees before, during and after the event. Nothing here is saved. */
export default class GuestJourney extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { stage: 0, mode: p.data.online ? 1 : 0, rsvp: '', name: 'سارة أحمد الغامدي', code: '', err: false, dl: false, tour: -1, tr: null };
  }

  componentWillUnmount() { clearTimeout(this.tto); }

  renderVals() {
    const s = this.state;
    const { data: d } = this.props;
    const set = (o) => this.setState(o);
    const on = s.mode === 1;
    const ok = () => set({ stage: 2, err: false });
    const submit = () => { const c = s.code.replace(/[٠-٩]/g, (x) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(x))); if (c === '4827') ok(); else set({ err: true }); };
    const ST = [['قبل الفعالية', 'يأكّد حضوره ويكتب اسمه مثل ما يبيه في الشهادة، ومعه الحقل الزيادة لو فعّلته'], ['وقت الفعالية', on ? 'في آخر اللقاء تلصق الكود في الشات، ويكتبه في رابطه' : 'في آخر الفعالية تعرض الكود والباركود على الشاشة، ويكتب الكود أو يمسح الباركود من رابطه'], ['انسجل حضوره', 'يشوف تأكيد على طول. ما يحتاج أحد عند الباب ولا ورق'], ['بعد الفعالية', 'تطلع شهادته في نفس الرابط، ومعها رسالة الشكر لو نشرتها']];
    return {
      wax: waxPath(2.1), stars: starField(24), back: `/app/invitations/${d.id}/attendance`, evTitle: d.title || 'مناسبتك', evLine: [d.org, d.when].filter(Boolean).join(' · '), org: d.org, certLine: d.cert.certLine, certPara: d.cert.para,
      modes: ['حضوري', 'أونلاين'].map((m, i) => ({ key: m, l: m, pr: s.mode === i ? 'true' : 'false', on: () => set({ mode: i }), st: chip(s.mode === i) })),
      stages: ST.map((g, i) => { const o = s.stage === i; return { key: i, i: i + 1, t: g[0], d: g[1], pr: o ? 'true' : 'false', go: () => set({ stage: i, err: false, rsvp: i > 0 ? 'yes' : s.rsvp }), st: `display:flex;gap:14px;align-items:flex-start;width:100%;padding:16px 18px;border-radius:22px;cursor:pointer;font-family:inherit;color:#0A2A43;transition:all .25s ease;${o ? 'border:2px solid #0E97AE;background:rgba(255,255,255,.9);box-shadow:0 16px 40px rgba(10,42,67,.1)' : 'border:2px solid transparent;background:rgba(255,255,255,.5)'}`, num: `width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;${o ? 'background:#0E97AE;color:#FFFFFF' : 'background:rgba(10,42,67,.08);color:#0A2A43'}` }; }),
      s0: s.stage === 0, s1: s.stage === 1, s2: s.stage === 2, s3: s.stage === 3, noRsvp: !s.rsvp, rsvpYes: s.rsvp === 'yes', rsvpNo: s.rsvp === 'no', yes: () => set({ rsvp: 'yes' }), no: () => set({ rsvp: 'no' }), undo: () => set({ rsvp: '' }), name: s.name, onName: (e) => set({ name: e.target.value }), first: (s.name || 'سارة').split(' ')[0],
      livePill: on ? 'اللقاء شغّال' : 'الفعالية بدأت', inPerson: !on, codeHint: on ? 'اكتب الكود اللي نزل في الشات' : 'اكتب الكود اللي على الشاشة', code: s.code, onCode: (e) => set({ code: e.target.value.replace(/[^0-9٠-٩]/g, '').slice(0, 4), err: false }), codeSt: `height:64px;border-radius:20px;border:2px solid ${s.err ? '#8A2D3B' : '#CFD9DF'};background:#F4F7F8;text-align:center;font-family:TD, TDx, serif;font-size:34px;letter-spacing:.4em;color:#0A2A43;direction:ltr;width:100%;box-sizing:border-box;outline:none`,
      submit, codeKey: (e) => { if (e.key === 'Enter') submit(); }, err: s.err, scan: ok, toAfter: () => set({ stage: 3 }), toDuring: () => set({ stage: 1 }), dl: () => set({ dl: true }), dlL: s.dl ? 'انحملت الشهادة ✓' : 'حمّل الشهادة PDF',
      ...TOUR(this, STEPS),
    };
  }
}
