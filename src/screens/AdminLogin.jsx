'use client';
import View from '@/views/AdminLogin.view';
import { Screen } from '@/ui/dc';
import { api, rnd, waxPath } from '@/ui/kit';

/** Studio sign-in: a code sent to a team member's email. The answer is the same for addresses that are not on the team. */
export default class AdminLogin extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { step: 'email', mail: '', code: '', err: '', busy: false, name: '' };
    this.stars = [];
    for (let i = 0; i < 50; i++) {
      const z = 1 + rnd(i) * 2;
      this.stars.push({ key: i, st: `position:absolute;left:${(rnd(i + 50) * 100).toFixed(1)}%;top:${(rnd(i + 90) * 100).toFixed(1)}%;width:${z.toFixed(1)}px;height:${z.toFixed(1)}px;border-radius:50%;background:#FFFFFF;animation:tw ${(2 + rnd(i + 7) * 3).toFixed(1)}s ease-in-out ${(rnd(i + 3) * 3).toFixed(1)}s infinite` });
    }
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

  renderVals() {
    const s = this.state;
    const set = (o) => this.setState(o);
    const boxes = [];
    for (let b = 0; b < 6; b++) { const on = b === s.code.length; boxes.push({ key: b, v: s.code.charAt(b), st: `width:52px;height:62px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;background:#FFFFFF;border:1px solid ${on ? '#0E97AE' : 'rgba(10,42,67,.16)'};box-shadow:${on ? '0 0 0 5px rgba(14,151,174,.14)' : 'none'}` }); }
    const verify = () => { if (s.code.length === 6) this.run(async () => { const r = await api.post('/studio/verify', { email: s.mail.trim(), code: s.code }); set({ step: 'in', name: r.name }); }); };
    const send = () => { if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.mail.trim())) return set({ err: 'اكتب بريد صحيح' }); return this.run(async () => { await api.post('/studio/login', { email: s.mail.trim() }); set({ step: 'otp', code: '' }); }); };
    return {
      wax: waxPath(1.3), stars: this.stars, boxes, busy: s.busy, isEmail: s.step === 'email', isOtp: s.step === 'otp', isIn: s.step === 'in', name: s.name, mail: s.mail, onMail: (e) => set({ mail: e.target.value, err: '' }), mailErr: Boolean(s.err), mailErrTx: s.err, codeErr: s.err,
      send, mailKey: (e) => { if (e.key === 'Enter') send(); },
      code: s.code, onCode: (e) => set({ code: e.target.value.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[^0-9]/g, '').slice(0, 6), err: '' }), codeKey: (e) => { if (e.key === 'Enter') verify(); }, verify, back: () => set({ step: 'email', code: '', err: '' }),
    };
  }
}
