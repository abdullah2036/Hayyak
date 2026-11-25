'use client';
import View from '@/views/Subscribe.view';
import { Screen } from '@/ui/dc';
import { api, waxPath } from '@/ui/kit';
import { betaText, freeText } from '@/ui/pricing';
import { CHANNELS } from '@/lib/constants';

const WAY = [['أرسلها بنفسي', 'رابط ورسالة جاهزة ترسلها من أي تطبيق'], ['حيّــاك ترسلها بالإيميل', 'نرسلها عنك باسمك'], ['حيّــاك ترسلها بالواتساب', 'نرسلها عنك باسمك']];
const SOCIAL = [{ n: 'X', h: '@its_hayyak', u: 'https://x.com/its_hayyak' }, { n: 'إنستقرام', h: '@its_hayyak', u: 'https://www.instagram.com/its_hayyak' }, { n: 'تيك توك', h: '@its_hayyak', u: 'https://www.tiktok.com/@its_hayyak' }, { n: 'الإيميل', h: 'hayyakinfo@gmail.com', u: 'mailto:hayyakinfo@gmail.com' }];

/**
 * Credit packs. There is no payment gateway yet: an order reaches the Studio, which confirms payment and adds the credit.
 * One that costs nothing (beta, or a full discount) is fulfilled at once. The server works out every total.
 */
export default class Subscribe extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    const c = p.data.contact;
    this.state = { step: 'pick', plan: 1, way: 0, cu: [], showCu: false, name: c.name, mail: c.email, phone: c.phone, err: '', busy: false, order: null, code: '', applied: '', q: null, codeErr: '' };
    this.seq = 0;
  }

  componentDidMount() { this.requote(); }

  componentWillUnmount() { this.gone = true; }

  body(code) {
    const s = this.state;
    return { count: this.props.data.pricing.packs[s.plan - 1].count, channel: CHANNELS[s.way], services: s.cu, code };
  }

  /** Asks the server for the total whenever the choice changes. */
  async requote(code = this.state.applied) {
    if (this.state.plan === 0) { this.setState({ q: null, codeErr: '' }); return; }
    const mine = ++this.seq;
    try {
      const q = await api.post('/orders/quote', this.body(code));
      if (this.gone || mine !== this.seq) return;
      this.setState({ q, applied: q.codeError ? '' : code, codeErr: q.codeError });
    } catch (e) {
      if (!this.gone && mine === this.seq) this.setState({ q: null, err: e.message });
    }
  }

  pick(o) { this.setState({ ...o, err: '' }, () => this.requote()); }

  async go() {
    const s = this.state;
    if (s.busy) return;
    if (s.plan === 0) { window.location.assign('/app'); return; }
    this.setState({ busy: true, err: '' });
    try {
      const order = await api.post('/orders', { ...this.body(s.applied), contact: { name: s.name, email: s.mail, phone: s.phone } });
      this.setState({ step: 'done', order, busy: false });
      this.props.router?.refresh();
      window.scrollTo({ top: 0 });
    } catch (e) {
      this.setState({ err: e.message, busy: false });
    }
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const set = (o) => this.setState(o);
    const { packs, free: freeN, beta } = d.pricing;
    const way = s.plan === 0 ? 0 : s.way;
    const ch = CHANNELS[way];
    const betaOn = Boolean(beta && beta.channels.includes(ch));
    const PL = [{ n: 'مجاني', m: 0, d: `${freeText(freeN)} · ترسلها بنفسك` }, ...packs.map((r) => ({ n: `${r.count} دعوة`, m: betaOn ? 0 : r[ch], d: betaOn ? `مجانًا خلال البيتا · بعدها ${r[ch]} ر.س` : `الدعوة بـ ${(r[ch] / r.count).toFixed(2)} ر.س` }))];
    const free = s.plan === 0;
    const P = PL[s.plan];
    const items = s.order?.items || (free ? [{ k: P.n, v: 'مجانًا' }, { k: 'الإرسال', v: WAY[0][0] }] : s.q?.items || [{ k: P.n, v: '…' }]);
    const lines = [...items.map((i, k) => ({ key: k, k: i.k, v: i.v })), ...(s.order ? [] : [{ key: 'until', k: 'صالحة لين', v: free ? 'للتجربة مرة وحدة' : '30 يوم من التفعيل' }])];
    const total = s.order ? s.order.total : free ? 0 : s.q?.total;
    const now = !free && s.q && s.q.total === 0 && (s.q.beta || s.q.discount > 0);
    const cuFree = betaOn && beta.services;
    const pending = d.orders.filter((o) => o.status === 'pending');
    return {
      wax: waxPath(1.3), isPick: s.step === 'pick', isDone: s.step === 'done', err: s.err, backHref: '/app', backL: shell.credit.left ? `باقي لك ${shell.credit.left} دعوة · لوحتك ←` : 'لوحتك ←',
      banner: beta ? `${betaText(beta)}${beta.channels.length < 3 ? ` · ${beta.channels.map((c) => WAY[CHANNELS.indexOf(c)][0]).join('، ')}` : ''}` : d.special ? (d.special === 100 ? 'حسابكم معفي من الرسوم' : `لكم سعر خاص: خصم ${d.special}% ينحسب لحاله`) : '',
      moreTx: `أكثر من ${packs[packs.length - 1].count}؟`,
      sendWays: WAY.map((w, i) => { const on = way === i; const dis = free && i > 0; return { key: i, n: w[0], d: dis ? 'متاحة مع الرصيد المدفوع' : w[1], pick: () => this.pick(s.plan === 0 && i > 0 ? { way: i, plan: 1 } : { way: i }), st: `text-align:right;display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-radius:20px;cursor:pointer;font-family:inherit;color:#0A2A43;background:#FFFFFF;${on ? 'border:2px solid #0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)' : 'border:2px solid transparent'}${dis ? ';opacity:.6' : ''}` }; }),
      plans: PL.map((p, i) => { const on = s.plan === i; return { key: i, n: p.n, price: String(p.m), per: 'ر.س', d: p.d, on: on ? 'true' : 'false', pick: () => this.pick({ plan: i }), st: `text-align:right;display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:18px;border-radius:24px;cursor:pointer;${on ? 'background:#0A2A43;color:#FFFFFF;border:2px solid #0E97AE;box-shadow:0 20px 40px rgba(10,42,67,.2)' : 'background:rgba(255,255,255,.7);color:#0A2A43;border:2px solid rgba(255,255,255,.9)'}`, radio: `width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid ${on ? '#86DCEA' : '#CFD9DF'}`, dot: `width:10px;height:10px;border-radius:50%;background:${on ? '#86DCEA' : 'transparent'}`, line: on ? 'rgba(255,255,255,.15)' : 'rgba(10,42,67,.1)', bul: on ? '#86DCEA' : '#0E97AE' }; }),
      custNote: free ? 'التخصيص خدمة منفصلة وسعره مستقل، ومتاح مع الرصيد المدفوع' : cuFree ? 'التخصيص مجاني خلال النسخة التجريبية، وفريقنا يتواصل معك قبل ما يبدأ' : 'سعر التخصيص منفصل عن الرصيد وتدفعه مرة وحدة. واللي سويته قبل يبقى في حسابك، فما تدفعه مرة ثانية', showCu: s.showCu, togCu: () => set({ showCu: !s.showCu }), cuIc: s.showCu ? '−' : '+',
      custom: d.services.map((c) => { const on = !free && s.cu.includes(c.id); return { key: c.id, n: c.name, d: [c.description, c.duration].filter(Boolean).join(' · '), p: cuFree ? 'مجانًا' : `${c.price} ر.س`, on, tog: () => { if (!free) this.pick({ cu: on ? s.cu.filter((x) => x !== c.id) : s.cu.concat(c.id) }); }, st: `display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:14px;border-radius:18px;background:#FFFFFF;color:#0A2A43;cursor:${free ? 'not-allowed' : 'pointer'};opacity:${free ? '.5' : '1'};border:2px solid ${on ? '#0E97AE' : '#DCE4E8'}`, box: `width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;${on ? 'background:#0E97AE' : 'border:2px solid #CFD9DF'}` }; }),
      cName: s.name, cMail: s.mail, cPhone: s.phone, onName: (e) => set({ name: e.target.value.slice(0, 80) }), onMail: (e) => set({ mail: e.target.value }), onPhone: (e) => set({ phone: e.target.value }),
      codeOn: !free && Boolean(s.q && (s.q.subtotal > 0 || s.applied)), code: s.code, onCode: (e) => set({ code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24), codeErr: '' }), codeKey: (e) => { if (e.key === 'Enter') this.requote(s.code); }, applyCode: () => { if (s.code) this.requote(s.code); }, codeErr: s.codeErr, codeOk: Boolean(s.applied), dropCode: () => { set({ code: '' }); this.requote(''); }, codeTx: s.applied ? `انطبق الكود ${s.applied} ✓` : '',
      hasReq: Boolean(s.order?.items.some((i) => i.v === 'حسب الطلب')), lines, total: total === undefined ? '…' : `${total} ر.س`, cta: s.busy ? 'لحظة…' : free ? 'ابدأ مجانًا' : now ? 'فعّل الرصيد الحين' : `أرسل الطلب${total === undefined ? '' : ` · ${total} ر.س`}`, go: () => this.go(), orderNo: s.order?.number || '', paidL: 'الإجمالي', footTx: now || free ? 'ينزل الرصيد في حسابك على طول' : 'يوصلنا طلبك ونتواصل معك لتأكيد الدفع، وبعدها ينزل رصيدك',
      doneMsg: s.order?.done ? 'نزل الرصيد في حسابك، وتقدر ترسل دعواتك الحين' : 'وصلنا طلبك. بنتواصل معك على جوالك أو إيميلك لتأكيد الدفع، وبعدها ينزل الرصيد في حسابك ونبلّغك', socials: SOCIAL.map((x) => ({ key: x.n, ...x })), pending: pending.map((o) => ({ key: o.number, t: `${o.number} · ${o.count} دعوة · ${o.total} ر.س`, d: `بانتظار تأكيد الدفع · ${o.date}` })), hasPending: pending.length > 0,
      past: d.orders.filter((o) => o.status !== 'pending').map((o) => ({ key: o.number, t: `${o.number} · ${o.count} دعوة · ${o.total} ر.س`, d: `${o.status === 'paid' ? (o.total ? 'مدفوع' : 'مجاني') : 'ملغي'} · ${o.date}` })), hasPast: d.orders.some((o) => o.status !== 'pending'),
    };
  }
}
