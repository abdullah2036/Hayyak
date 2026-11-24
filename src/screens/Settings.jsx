'use client';
import View from '@/views/Settings.view';
import { Screen } from '@/ui/dc';
import { api, base, chipSt, tgl, TOUR } from '@/ui/kit';

const PHONE = 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM11 18h2';
const LAPTOP = 'M4 5h16v11H4zM2 19h20';
const N = [['ملخص يومي للردود', 'كل يوم 8 مساءً وقت ما فيه دعوة نشطة', 'daily'], ['كل رد جديد', 'إشعار مع كل تأكيد أو اعتذار', 'each'], ['قرب نهاية الرصيد', 'لما يبقى 10% من دعواتك', 'low'], ['تحديث طلبات التخصيص', 'لما يتغير وضع طلبك', 'requests'], ['عروض حيّــاك الخاصة', 'خصومات وعروض، توقفها متى ما تبي', 'offers']];
const STEPS = [['t0', 'الإعدادات', 'بياناتك وأمان حسابك والإشعارات'], ['t1', 'الأقسام', 'تنقّل بين البيانات والأمان والإشعارات والفريق'], ['t2', 'بيانات الحساب', 'شعارك واسم الجهة وطريقة التواصل. الشعار يطلع في دعواتك وشهاداتك'], ['t3', 'الأمان', 'غيّر كلمة المرور وشوف الأجهزة المسجّلة'], ['t4', 'الإشعارات', 'اختر وش يوصلك على الإيميل'], ['t5', 'حذف الحساب', 'لو تبي تحذف حسابك راسلنا']];

export function strength(pw) {
  let sc = pw.length < 8 ? (pw ? 1 : 0) : 1 + (/[0-9]/.test(pw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pw) || /[A-Z]/.test(pw) ? 1 : 0);
  if (pw.length >= 14) sc = 3;
  return [['8 أحرف على الأقل', 'transparent', 0], ['قصيرة', '#E08A8A', 25], ['مقبولة', '#E7C873', 60], ['قوية', '#0E97AE', 100]][Math.min(3, sc)];
}

export default class Settings extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    const o = p.data.org;
    this.state = { tour: -1, tr: null, tab: 0, ent: o.name, kind: o.kind, mail: o.contactEmail, phone: o.phone, saved: '', err: '', cp: '', np: '', pwTx: '', notify: p.data.notify, nm: '', nr: 0, teamMsg: '', logoTx: 'رفع الشعار' };
  }

  componentWillUnmount() { clearTimeout(this.tto); }

  async run(fn, ok) {
    try {
      await fn();
      this.setState({ err: '', ...ok });
      this.props.router.refresh();
    } catch (e) {
      this.setState({ err: e.message });
    }
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const set = (o) => this.setState(o);
    const mt = strength(s.np);
    const owner = shell.role === 'owner';
    return {
      ...base('الإعدادات', shell), err: s.err, tabs: ['بيانات الحساب', 'الأمان', 'الإشعارات', 'الفريق'].map((n, i) => ({ key: n, n, on: () => set({ tab: i, err: '' }), st: chipSt(s.tab === i) })), t0: s.tab === 0, t1: s.tab === 1, t2: s.tab === 2, t3: s.tab === 3,
      ent: s.ent, kind: s.kind, mail: s.mail, phone: s.phone, onEnt: (e) => set({ ent: e.target.value.slice(0, 80), saved: '' }), onKind: (e) => set({ kind: e.target.value.slice(0, 40), saved: '' }), onMail: (e) => set({ mail: e.target.value, saved: '' }), onPhone: (e) => set({ phone: e.target.value, saved: '' }),
      logoTx: s.logoTx, upLogo: async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (!f) return; set({ logoTx: 'نرفع…' }); try { await api.upload('/assets', f, { kind: 'logo', set: '1' }); set({ logoTx: 'انرفع ✓', err: '' }); this.props.router.refresh(); } catch (er) { set({ logoTx: 'رفع الشعار', err: er.message }); } },
      save: () => (owner ? this.run(() => api.patch('/org', { name: s.ent, kind: s.kind, contactEmail: s.mail, phone: s.phone }), { saved: 'انحفظت ✓' }) : set({ err: 'التعديل لمالك الحساب بس' })), saveTx: s.saved || 'احفظ التغييرات',
      cp: s.cp, onCp: (e) => set({ cp: e.target.value, pwTx: '' }), np: s.np, onNp: (e) => set({ np: e.target.value, pwTx: '' }), meter: `display:block;height:100%;border-radius:999px;transition:width .3s ease;width:${mt[2]}%;background:${mt[1]}`, meterTx: mt[0],
      savePw: async () => { if (s.np.length < 8) return set({ pwTx: '8 أحرف على الأقل' }); try { await api.post('/auth/password', { current: s.cp, next: s.np }); set({ pwTx: 'تغيّرت كلمة المرور ✓', cp: '', np: '' }); this.props.router.refresh(); } catch (e) { set({ pwTx: e.message }); } return undefined; }, pwTx: s.pwTx || 'غيّر كلمة المرور',
      devices: d.devices.map((x) => ({ key: x.id, n: x.n, w: x.w, ic: /آيفون|آيباد|أندرويد/.test(x.n) ? PHONE : LAPTOP, cur: x.cur, can: !x.cur, out: () => this.run(() => api.post(`/auth/sessions/${x.id}/end`)) })),
      access: d.access.map((a, i) => ({ key: i, t: a.what, d: [a.who, a.when, a.why && `السبب: ${a.why}`].filter(Boolean).join(' · ') })), noAccess: d.access.length === 0,
      notifs: N.map((r) => { const on = Boolean(s.notify[r[2]]); const t = tgl(on); return { key: r[2], t: r[0], d: r[1], bg: t.bg, knob: t.knob, tog: () => { const n = { ...s.notify, [r[2]]: !on }; set({ notify: n }); this.run(() => api.patch('/me', { notify: { [r[2]]: !on } })); } }; }),
      isOwner: owner, members: d.members.map((m) => ({ key: m.id, i: m.i, n: m.n, mail: m.mail, role: m.role, rm: owner && !m.owner ? () => this.run(() => api.post(`/org/members/${m.id}/remove`), { teamMsg: 'تم ✓' }) : null })),
      nm: s.nm, onNm: (e) => set({ nm: e.target.value, teamMsg: '' }), roleOpts: ['مشرف', 'مشاهد'].map((n, i) => ({ key: n, n, on: () => set({ nr: i }), st: chipSt(s.nr === i) })), addMember: async () => { try { await api.post('/org/members', { email: s.nm, role: s.nr === 0 ? 'manager' : 'viewer' }); set({ nm: '', teamMsg: 'أرسلنا له دعوة على إيميله ✓' }); this.props.router.refresh(); } catch (e) { set({ teamMsg: e.message }); } }, teamMsg: s.teamMsg,
      ...TOUR(this, STEPS),
    };
  }
}
