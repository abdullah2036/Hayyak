'use client';
import View from '@/views/Signup.view';
import { Screen } from '@/ui/dc';
import { api, waxPath } from '@/ui/kit';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** New account, sign in, and forgotten password, each confirmed by a code sent to the email. */
export default class Signup extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { mode: p.mode === 'old' ? 'old' : 'new', step: 'form', ent: '', mail: '', pw: '', see: false, code: '', err: '', busy: false, left: 0 };
  }

  componentWillUnmount() { clearInterval(this.iv); }

  countdown() {
    clearInterval(this.iv);
    this.setState({ left: 45 });
    this.iv = setInterval(() => this.setState((s) => { if (s.left <= 1) clearInterval(this.iv); return { left: Math.max(0, s.left - 1) }; }), 1000);
  }

  async run(fn) {
    if (this.state.busy) return;
    this.setState({ busy: true, err: '' });
    try {
      await fn();
    } catch (e) {
      this.setState({ err: e.message });
    }
    this.setState({ busy: false });
  }

  enter() {
    // Only our own pages may be the next stop.
    const n = this.props.next;
    window.location.assign(n && /^\/(app|i)(\/|$|\?)/.test(n) ? n : '/app');
  }

  async request() {
    const s = this.state;
    const email = s.mail.trim();
    if (s.mode === 'new') await api.post('/auth/signup', { name: s.ent.trim(), email, password: s.pw });
    else if (s.mode === 'reset') await api.post('/auth/forgot', { email });
    else {
      const r = await api.post('/auth/login', { email, password: s.pw });
      if (!r.otp) return this.enter();
    }
    this.setState({ step: 'otp', code: '' });
    this.countdown();
    return undefined;
  }

  send() {
    const s = this.state;
    if (s.mode === 'new' && s.ent.trim().length < 2) return this.setState({ err: 'اكتب اسمك' });
    if (!EMAIL.test(s.mail.trim())) return this.setState({ err: 'اكتب بريد صحيح' });
    if (s.mode !== 'reset' && s.pw.length < (s.mode === 'new' ? 8 : 1)) return this.setState({ err: s.mode === 'new' ? 'كلمة المرور لازم تكون 8 أحرف على الأقل' : 'اكتب كلمة المرور' });
    return this.run(() => this.request());
  }

  verify() {
    const s = this.state;
    const email = s.mail.trim();
    if (s.code.length !== 6) return this.setState({ err: 'الرمز 6 أرقام' });
    if (s.mode === 'reset') return this.setState({ step: 'newpw', pw: '', err: '' });
    return this.run(async () => {
      await api.post(s.mode === 'new' ? '/auth/verify' : '/auth/login/verify', { email, code: s.code });
      if (s.mode === 'new') this.setState({ step: 'done' });
      else this.enter();
    });
  }

  renderVals() {
    const s = this.state;
    const set = (o) => this.setState(o);
    const isNew = s.mode === 'new';
    const isReset = s.mode === 'reset';
    const pw = s.pw;
    let sc = (pw.length >= 8 ? 1 : 0) + (/[0-9]/.test(pw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(pw) || /[A-Z]/.test(pw) ? 1 : 0);
    if (pw.length < 8) sc = Math.min(sc, 1);
    if (pw.length >= 14) sc = 3;
    const mt = pw ? [['قصيرة', '#FFC2C2', 25], ['قصيرة', '#FFC2C2', 25], ['مقبولة', '#F2D58A', 60], ['قوية', '#86DCEA', 100]][sc] : ['8 أحرف على الأقل', 'transparent', 0];
    const boxes = [];
    for (let b = 0; b < 6; b++) { const on = b === s.code.length; boxes.push({ key: b, v: s.code.charAt(b), st: `width:50px;height:60px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;background:rgba(255,255,255,.08);border:1px solid ${on ? '#86DCEA' : 'rgba(220,228,232,.3)'};box-shadow:${on ? '0 0 0 5px rgba(134,220,234,.16)' : 'none'}` }); }
    return {
      wax: waxPath(1.3), busy: s.busy, showTabs: s.step === 'form' && !isReset, tabs: [['new', 'حساب جديد'], ['old', 'عندي حساب']].map((t) => ({ key: t[0], n: t[1], go: () => set({ mode: t[0], err: '' }), st: `height:46px;border:0;border-radius:999px;font-size:16px;cursor:pointer;transition:background .3s ease,color .3s ease;${s.mode === t[0] ? 'background:#FAFBFC;color:#0A2A43;font-weight:500' : 'background:transparent;color:#DCE4E8'}` })),
      isForm: s.step === 'form', isOtp: s.step === 'otp', isNewPw: s.step === 'newpw', isDone: s.step === 'done', isNew, showPw: !isReset, showMeter: isNew, showPw2: true, showMeter2: true, pw, pwType: s.see ? 'text' : 'password', pwEye: s.see ? 'إخفاء' : 'إظهار', pwPh: 'كلمة المرور', togglePw: () => set({ see: !s.see }), onPw: (e) => set({ pw: e.target.value, err: '' }),
      meterSt: `display:block;height:100%;border-radius:999px;transition:width .4s ease,background .4s ease;width:${mt[2]}%;background:${mt[1]}`, meterTx: mt[0], sendTx: s.busy ? 'لحظة…' : isNew ? 'إنشاء الحساب' : isReset ? 'أرسل رمز الاستعادة' : 'دخول', showForgot: s.mode === 'old', showCancel: isReset, forgot: () => set({ mode: 'reset', err: '', pw: '' }), cancelReset: () => set({ mode: 'old', err: '' }),
      formNote: isNew ? 'بنرسل رمز على إيميلك نتأكد فيه إنه لك' : isReset ? 'بنرسل رمز على إيميلك، وبعدها تختار كلمة مرور جديدة' : 'بياناتك مشفّرة، وما نطلب منك الرمز إلا من جهاز جديد',
      savePw: () => { if (pw.length < 8) return set({ err: 'كلمة المرور لازم تكون 8 أحرف على الأقل' }); return this.run(async () => { try { await api.post('/auth/reset', { email: s.mail.trim(), code: s.code, password: pw }); set({ step: 'done' }); } catch (e) { if (e.code === 'bad_code') set({ step: 'otp', code: '' }); throw e; } }); },
      formTitle: isNew ? 'أنشئ حسابك' : isReset ? 'استعادة كلمة المرور' : 'أهلًا من جديد', formSub: isNew ? 'دقيقة وحدة، وتبدأ أول دعوة' : isReset ? 'اكتب بريدك المسجّل' : 'ادخل ببريدك وكلمة المرور', ent: s.ent, mail: s.mail, onEnt: (e) => set({ ent: e.target.value.slice(0, 80), err: '' }), onMail: (e) => set({ mail: e.target.value, err: '' }), err: Boolean(s.err), errMsg: s.err, send: () => this.send(), formKey: (e) => { if (e.key === 'Enter') this.send(); },
      code: s.code, onCode: (e) => set({ code: e.target.value.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[^0-9]/g, '').slice(0, 6), err: '' }), codeKey: (e) => { if (e.key === 'Enter') this.verify(); }, boxes, verify: () => this.verify(), back: () => set({ step: 'form', code: '', err: '' }), noResend: s.left > 0 || s.busy, resendTx: s.left > 0 ? `إعادة الإرسال بعد 0:${String(s.left).padStart(2, '0')}` : 'أعد إرسال الرمز', resend: () => { if (s.left === 0) this.run(() => this.request()); },
      doneTitle: isNew ? 'حيّــاكم معنا' : 'تم تغيير كلمة المرور', doneSub: isNew ? `تم تأكيد بريدك وتسجيل ${s.ent.trim() || 'حيّــاك'}${this.props.free ? `، وعندك رصيد مجاني ${this.props.free} دعوة تبدأ فيه` : ''}${this.props.beta ? `. وخلال النسخة التجريبية تاخذ رصيد مجاني لين ${this.props.beta} دعوة من صفحة الرصيد` : ''}` : 'كل شيء جاهز في لوحتك', doneCta: 'ادخل لوحتك', doneHref: '/app',
    };
  }
}
