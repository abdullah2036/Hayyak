'use client';
import View from '@/views/Account.view';
import { Screen } from '@/ui/dc';
import { api, base, chipSt, copyText, saveXlsx, TOUR } from '@/ui/kit';

const STEPS = [
  ['1', 'حسابي', 'هنا كل شي يخصك أنت، سواء كنت عضو أو منظّم أو ضيف'], ['2', 'أرقامك', 'كم فعالية حضرت، وكم شهادة عندك، ومجموع ساعاتك'], ['3', 'دعواتك الجاية', 'الدعوات اللي وصلتك باسمك، وتفتحها من هنا'], ['4', 'شهاداتي', 'كل شهاداتك في مكان واحد، تحمّلها أو تنسخ رابطها، وتفرزها حسب الجهة'], ['5', 'سجل ساعاتي', 'كل فعالية حضرتها ومدتها، وتحمّله Excel للسجل المهاري'], ['6', 'اسمك في الشهادات', 'اكتبه مرة وحدة بالعربي والإنجليزي، ويطلع تلقائي في كل شهادة'], ['7', 'الجهات اللي تديرها', 'لو تسوي دعوات لنادي أو فريق، تدخل لوحته من هنا'],
];
const hrs = (n) => { const w = Math.floor(n); const h = n % 1 ? ' ونص' : ''; return (w === 0 ? 'نص ساعة' : w === 1 ? 'ساعة' : w === 2 ? 'ساعتين' : w + ' ساعات') + (w === 0 ? '' : h); };

export default class Account extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    const m = p.data.me;
    this.state = { org: 0, tour: -1, tr: null, nAr: m.certNameAr, nEn: m.certNameEn, uid: m.uniId, saveL: 'احفظ', cp: '', adding: false, newOrg: '', err: '' };
  }

  componentWillUnmount() {
    clearTimeout(this.tto);
    clearTimeout(this.tc);
  }

  async go(fn, to) {
    try {
      await fn();
      if (to) window.location.assign(to);
      else this.props.router.refresh();
    } catch (e) {
      this.setState({ err: e.message, saveL: e.message });
    }
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const set = (o) => this.setState(o);
    const orgs = ['الكل', ...d.orgNames];
    const tot = d.hours.reduce((a, h) => a + h.h, 0);
    const num = (n) => String(n).replace('.', '٫');
    const certs = d.certs.filter((c) => s.org === 0 || c.o === orgs[s.org]);
    const big = (c) => `font-family:TD,serif;font-size:36px;line-height:1.1;color:${c}`;
    return {
      ...base('حسابي', shell), name: d.me.name, init: d.me.name.charAt(0), emailLine: d.me.email,
      kpis: [{ key: 1, l: 'فعاليات حضرتها', v: d.hours.length, s: `${d.hours.filter((h) => h.term).length} هالفصل`, st: big('#0A2A43') }, { key: 2, l: 'شهاداتي', v: d.certs.length, s: 'جاهزة للتحميل', st: big('#0E97AE') }, { key: 3, l: 'ساعاتي', v: num(tot), s: 'ساعة حضور', st: big('#B8892A') }, { key: 4, l: 'دعوات جاية', v: d.upcoming.length, s: d.upcoming.some((u) => u.st === 'pending') ? 'فيها اللي ينتظر ردّك' : 'كلها رديت عليها', st: big('#0A2A43') }],
      ups: d.upcoming.map((u, i) => ({ key: i, d: u.d, m: u.m, t: u.t, o: u.o, w: u.w, href: u.href, st: u.st === 'yes' ? 'أكّدت حضورك ✓' : u.st === 'no' ? 'اعتذرت' : 'تنتظر ردّك', bs: `font-size:12px;font-weight:700;color:${u.st === 'yes' ? '#086577' : u.st === 'no' ? '#4A5B68' : '#8A6418'}` })),
      orgs: orgs.map((o, i) => ({ key: o, l: o, pr: s.org === i ? 'true' : 'false', on: () => set({ org: i }), st: chipSt(s.org === i) })),
      certs: certs.map((c) => ({ key: c.code, img: c.kind === 'thanks' ? '/img/cert-thanks.svg' : '/img/cert-attend.svg', alt: `شهادة ${c.t}`, t: c.t, o: c.o, d: c.d, h: hrs(c.h), dl: () => window.open(`/c/${c.code}`, '_blank', 'noopener'), dlL: 'افتح وحمّل', cp: () => { copyText(`شهادتي من ${c.o} · ${c.t}\n${window.location.origin}/c/${c.code}`); clearTimeout(this.tc); set({ cp: c.code }); this.tc = setTimeout(() => set({ cp: '' }), 1600); }, cpL: s.cp === c.code ? 'تم النسخ ✓' : 'انسخ الرابط' })),
      hrs: d.hours.map((h, i) => ({ key: i, t: h.t, o: h.o, d: h.d, h: hrs(h.h) })), totalH: num(tot) + ' ساعة', xl: () => saveXlsx('حياك - سجل ساعاتي.xlsx', [{ name: 'سجل الساعات', rows: [['الفعالية', 'الجهة', 'التاريخ', 'الساعات', 'شهادة'], ...d.hours.map((h) => [h.t, h.o, h.d, h.h, h.cert ? 'نعم' : 'لا'])] }]),
      nAr: s.nAr, nEn: s.nEn, uid: s.uid, onAr: (e) => set({ nAr: e.target.value.slice(0, 80), saveL: 'احفظ' }), onEn: (e) => set({ nEn: e.target.value.slice(0, 80), saveL: 'احفظ' }), onUid: (e) => set({ uid: e.target.value.slice(0, 30), saveL: 'احفظ' }), save: async () => { await this.go(() => api.patch('/me', { certNameAr: s.nAr, certNameEn: s.nEn, uniId: s.uid })); if (!this.state.err) set({ saveL: 'انحفظ ✓' }); }, saveL: s.saveL,
      myOrgs: d.orgs.map((o) => ({ key: o.id, i: o.name.replace(/^(نادي|جمعية|مبادرة|فريق)\s+/, '').charAt(0), n: o.name, sub: `${o.role} · ${o.n} دعوة`, cta: o.current ? 'افتح اللوحة ←' : 'بدّل لها ←', go: () => this.go(() => (o.current ? Promise.resolve() : api.post('/org/switch', { orgId: o.id })), '/app') })),
      invites: d.invites.map((i) => ({ key: i.id, t: `دعوة لفريق ${i.name} (${i.role})`, ok: () => this.go(() => api.post(`/me/invites/${i.id}/accept`)), no: () => this.go(() => api.post(`/me/invites/${i.id}/decline`)) })),
      adding: s.adding, newOrg: s.newOrg, onNewOrg: (e) => set({ newOrg: e.target.value.slice(0, 80) }), toggleAdd: () => set({ adding: !s.adding, err: '' }), addL: s.adding ? 'إلغاء' : 'أضف جهة جديدة', addOrg: () => this.go(() => api.post('/org/new', { name: s.newOrg }), '/app'),
      ...TOUR(this, STEPS),
    };
  }
}
