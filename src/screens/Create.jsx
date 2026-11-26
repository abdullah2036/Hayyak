'use client';
import View from '@/views/Create.view';
import { Screen } from '@/ui/dc';
import { api, base, copyText, guestTemplate, TOUR } from '@/ui/kit';
import { DURATIONS, PAID_SEALS, SEALS } from '@/lib/constants';
import { fromInputs, inputDate } from '@/lib/dates';
import { guestsFromRows, okEmail, okPhone, readCsv, readXlsx } from '@/lib/xlsx';

const NV = ['#123E5C', '#0A2A43', '#04121F', '#86DCEA'];
const BK = ['#26262C', '#0E0E12', '#000000', '#FFFFFF'];
const SE = ['#12A3BA', '#0A5E78', '#071D30', '#86DCEA'];
const PR = ['#FFFFFF', '#EDF1F3', '#CFE7EE', '#0E97AE'];
// name, line, colours, demo seal, demo title
const PAT = [
  { n: 'لمّة نجوم', d: 'العنوان يتكوّن من نجوم', c: [['ليلي', NV], ['أسود', BK], ['زمردي', ['#0F4A3C', '#062A20', '#02130E', '#E7C873']]], seal: 'VIP', tt: 'ليلة التكريم' },
  { n: 'لمعة لؤلؤ', d: 'لمعة تتحرك مع الجوال', tap: true, c: [['لؤلؤي', PR], ['تركوازي', ['#3CC3D6', '#0E97AE', '#06606F', '#FFFFFF']], ['ليلي', NV]], seal: 'متحدث', tt: 'ملتقى الرواد' },
  { n: 'من القلب', d: 'نجوم تنطلق وتهدأ', c: [['ليلي', NV], ['أسود', BK], ['درب التبانة', ['#2B1B4F', '#120A2A', '#05030F', '#C9B8FF']]], seal: 'ضيف', tt: 'إطلاق المشروع' },
  { n: 'ألعاب نارية', d: 'سما تحتفل وتوقف', c: [['بحري', SE], ['أسود', ['#26262C', '#0E0E12', '#000000', '#FFD166']], ['بنفسجي ملكي', ['#3A1F6E', '#1C0F3A', '#0A0518', '#E7C873']]], seal: 'مدعو', tt: 'حفل التخرج' },
  { n: 'رشّة فرح', d: 'قصاصات من الجنبين', c: [['لؤلؤي', PR], ['وردي', ['#FFFFFF', '#FFF4F6', '#FADDE4', '#E8577A']], ['ليلي', NV]], seal: 'عضو', tt: 'الحفل الختامي' },
  { n: 'انفتح الستار', d: 'ستارة تنفتح على المسرح', c: [['عنابي', ['#3A0F18', '#1E070D', '#0A0205', '#8C1D2C']], ['كحلي', ['#123E5C', '#0A2A43', '#04121F', '#0E3B5A']], ['زمردي', ['#0F4A3C', '#06281F', '#021410', '#0E5A45']]], seal: 'راعي', tt: 'أمسية ثقافية' },
  { n: 'مرّ شهاب', d: 'شهب تعبر السما', c: [['ليلي', NV], ['أسود', BK], ['بحري', SE]], seal: 'تحكيم', tt: 'ليلة الشتاء' },
  { n: 'سدو ينتسج', d: 'نقشة تنسج نفسها', c: [['بحري', NV], ['تقليدي', ['#4A2418', '#2A140E', '#120806', '#9E2B2B']], ['رملي', ['#FFFFFF', '#F4EEE4', '#E6D7BC', '#B8892A']]], seal: 'عضو', tt: 'ليلة التراث' },
  { n: 'ضوء يلحقك', d: 'يمشي ورا الإصبع', tap: true, c: [['بنفسجي', ['#4A2C78', '#2C1550', '#140826', '#F2B8C6']], ['ليلي', NV], ['أسود ذهبي', ['#26262C', '#0E0E12', '#000000', '#E7C873']]], seal: 'شريك', tt: 'حفل الختام' },
  { n: 'صورة خاصة', d: 'صورة من عندك · مجاني', photo: true, c: [['صورة', ['#2A3540', '#141B22', '#06090C', '#FFFFFF']]], seal: 'مدعو', tt: 'حفل التخرج' },
];
const SD = Object.fromEntries(SEALS.map((x) => [x[0], x[1]]));
const ST = ['التصميم', 'المحتوى', 'المدعوين', 'الإرسال'];
const STEPS = [['t0', 'دعوة جديدة', 'تتحفظ مسودة تلقائيًا، فتقدر تكمل بعدين'], ['t1', 'الخطوات', 'أربع خطوات: التصميم، المحتوى، المدعوين، والإرسال. تقدر ترجع لأي خطوة'], ['ts0', 'التصميم', 'اختر النمط اللي يتحرك ورا الدعوة ولونه والختم، أو ارفع صورة من عندك'], ['ts1', 'المحتوى', 'عنوان المناسبة وموعدها ومكانها، حضوري أو أونلاين'], ['ts2', 'المدعوين', 'حمّل القالب وعبّه، أو أضفهم واحد واحد. ولكل مدعو ختمه'], ['ts3', 'الإرسال', 'اختر مين يرسلها: أنت أو حيّــاك، والتذكير قبل الموعد']];
const CUST = ['ألوان خاصة', 'ختم خاص', 'شاشة تحميل', 'هويتك', 'حركة جديدة', 'باقة كاملة'];
const grad = (c) => `radial-gradient(120% 90% at 70% 0%,${c[0]} 0%,${c[1]} 55%,${c[2]} 100%)`;
const pill = (on) => `height:42px;padding:0 18px;border-radius:999px;font-size:14px;cursor:pointer;${on ? 'border:0;background:#0A2A43;color:#FFFFFF;font-weight:700' : 'border:1px solid rgba(10,42,67,.18);background:#FFFFFF;color:#0A2A43'}`;

export default class Create extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    const { data, shell, params } = p;
    const d = data.draft;
    this.engines = data.designs.filter((x) => x.kind === 'pattern').map((x) => ({ n: x.name, d: x.mine ? 'نمط خاص فيكم' : 'نمط جديد', engine: x.data, id: x.id, c: [['خاص', [x.data.c1, x.data.c2, x.data.c2, x.data.c3]]], seal: 'مدعو', tt: 'مناسبتك' }));
    this.pats = [...PAT, ...this.engines];
    const load = data.designs.find((x) => x.kind === 'loading' && x.mine);
    const pi = d ? (d.customPatternId ? this.pats.findIndex((x) => x.id === d.customPatternId) : PAT.findIndex((x) => x.n === d.pattern)) : PAT.findIndex((x) => x.n === params?.pattern);
    this.id = d?.id || null;
    this.slug = d?.slug || '';
    this.state = {
      tour: -1, tr: null, step: 0, pat: Math.max(0, pi), col: d?.color ?? Math.min(2, Math.max(0, Number(params?.color) || 0)), colorsId: d?.customColorsId || null, sealId: d?.customSealId || null, loadingId: d ? d.customLoadingId : load?.id || null, seal: d?.seal || 'مدعو',
      title: d?.title || '', latin: d?.latin || '', evl: d?.eventLabel || '', date: d?.date || '', clock: d?.time || '19:00', dur: d?.durationMin || 120, place: d?.online ? 1 : 0, placeName: d?.placeName || '', placeArea: d?.placeArea || '', map: d?.mapUrl || '', plat: d?.platform || 'Zoom', live: d?.liveUrl || '',
      aud: d?.audience === 'public' ? 1 : 0, sendBy: d?.sendBy === 'hayyak' ? 1 : 0, chS: [true, true], chH: d?.sendBy === 'hayyak' ? [d.sendChannels.includes('whatsapp'), d.sendChannels.includes('email')] : [shell.credit.whatsapp > 0, true], when: d?.schedDate ? 1 : 0, schedDate: d?.schedDate || '', schedTime: d?.schedTime || '18:00',
      rem: [d?.reminders.day ?? true, d?.reminders.hours ?? true], remBy: d ? { hayyak: 0, self: 1, none: 2 }[d.reminders.by] : 1, cap: d?.cap ?? Math.max(1, shell.credit.self), closes: d?.closes || '', photo: d?.photoAssetId ? `/api/assets/${d.photoAssetId}` : '', photoId: d?.photoAssetId || null, photoMsg: '', msg: d?.message || '', withMsg: true,
      man: data.guests, file: 'none', fileName: '', rows: [], fileMsg: '', gm: 0, pt: '', adding: false, mn: '', mp: '', me: '', ms: 'مدعو', addErr: false, guestErr: '', done: null, pv: false, cust: false, custSent: false, ct: [], cuDesc: '', cuPhone: '', cuMail: '', cuErr: '', copied: false, err: '', busy: false, save: d ? 'محفوظة' : '',
    };
  }

  // On phones the side preview is hidden; it is only made where it can be seen.
  componentDidMount() {
    this.mq = window.matchMedia('(min-width: 901px)');
    this.onMq = () => this.setState({ wide: this.mq.matches });
    this.onMq();
    this.mq.addEventListener?.('change', this.onMq);
  }

  componentWillUnmount() {
    this.mq?.removeEventListener?.('change', this.onMq);
    clearTimeout(this.tto);
    clearTimeout(this.tsave);
    clearTimeout(this.tcp);
  }

  payload() {
    const s = this.state;
    const P = this.pats[s.pat];
    const startsAt = fromInputs(s.date, s.clock);
    const sched = s.when === 1 ? fromInputs(s.schedDate, s.schedTime) : null;
    const closes = s.closes ? fromInputs(s.closes, '23:59') : null;
    return {
      audience: s.aud ? 'public' : 'private', pattern: P.engine ? 'لمّة نجوم' : P.n, color: P.engine || P.photo ? 0 : s.col, customPatternId: P.engine ? P.id : null, customColorsId: P.engine || P.photo ? null : s.colorsId, customSealId: s.sealId, customLoadingId: s.loadingId, seal: s.seal, photoAssetId: s.photoId,
      title: s.title, latin: s.latin, eventLabel: s.evl, startsAt: startsAt ? startsAt.toISOString() : null, durationMin: Number(s.dur), online: s.place === 1, placeName: s.place === 1 ? '' : s.placeName, placeArea: s.place === 1 ? '' : s.placeArea, mapUrl: /^https:\/\/./.test(s.map) ? s.map : '', platform: s.plat, liveUrl: /^https:\/\/./.test(s.live) ? s.live : '',
      sendBy: s.aud === 0 && s.sendBy === 1 ? 'hayyak' : 'self', sendChannels: s.aud === 0 && s.sendBy === 1 ? [...(s.chH[0] ? ['whatsapp'] : []), ...(s.chH[1] ? ['email'] : [])] : ['link', 'message'], message: s.msg, scheduledAt: sched ? sched.toISOString() : null, reminders: { by: ['hayyak', 'self', 'none'][s.remBy], day: s.rem[0], hours: s.rem[1] },
      cap: s.aud ? Math.max(1, Number(s.cap) || 1) : null, closesAt: closes ? closes.toISOString() : null,
    };
  }

  /** Every edit lands here: it updates the screen at once and saves the draft shortly after. */
  set(o) {
    this.setState({ ...o, err: '' });
    clearTimeout(this.tsave);
    this.setState({ save: 'تتحفظ…' });
    this.tsave = setTimeout(() => this.flush().catch(() => {}), 900);
  }

  /** Saves run one after another, so an older save can never overwrite a newer one. */
  flush() {
    clearTimeout(this.tsave);
    this.queue = (this.queue || Promise.resolve()).catch(() => {}).then(async () => {
      try {
        if (!this.id) {
          const r = await api.post('/invitations', this.payload());
          this.id = r.id;
          this.slug = r.slug;
          window.history.replaceState(null, '', `/app/create?id=${r.id}`);
        } else await api.patch(`/invitations/${this.id}`, this.payload());
        this.setState({ save: 'محفوظة ✓' });
      } catch (e) {
        this.setState({ save: 'ما تم الحفظ: ' + e.message });
        throw e;
      }
    });
    return this.queue;
  }

  async addMany(items, source) {
    if (!items.length) return;
    this.setState({ guestErr: '', busy: true });
    try {
      if (!this.id) await this.flush();
      const r = await api.post(`/invitations/${this.id}/guests`, { items, source });
      this.setState((st) => ({ man: st.man.concat(r.rows), guestErr: r.skipped ? `${r.skipped} مكرر ما أُضيف` : '' }));
    } catch (e) {
      this.setState({ guestErr: e.message });
    }
    this.setState({ busy: false });
  }

  async removeOne(g) {
    try {
      await api.del(`/invitations/${this.id}/guests/${g.id}`);
      this.setState((st) => ({ man: st.man.filter((y) => y.id !== g.id) }));
    } catch (e) {
      this.setState({ guestErr: e.message });
    }
  }

  toItem(g) {
    return { name: g.n, phone: g.p, email: g.e, seal: SD[g.s] ? g.s : undefined, title: g.t || '', note: g.x || '' };
  }

  async readFile(file) {
    if (!file) return;
    this.setState({ file: 'parsing', fileName: file.name, guestErr: '' });
    try {
      if (file.size > 2_000_000) throw new Error('الملف كبير، الحد 2 ميقا');
      const raw = /\.csv$/i.test(file.name) ? readCsv(await file.text()) : readXlsx(await file.arrayBuffer());
      const rows = guestsFromRows(raw).map((g) => ({ ...g, bad: !g.n || (!g.p && !g.e) || Boolean(g.p && !okPhone(g.p)) || Boolean(g.e && !okEmail(g.e)) }));
      if (!rows.length) throw new Error('ما لقينا أسماء في الملف، استخدم قالب حيّــاك');
      this.setState({ file: 'ok', rows });
      await this.addMany(rows.filter((r) => !r.bad).map((g) => this.toItem(g)), 'import');
      const bad = rows.filter((r) => r.bad).length;
      this.setState({ fileMsg: bad ? `نزل ${rows.length - bad} من ${rows.length}، وباقي ${bad} يحتاج تصحيح` : 'نزلت الأسماء من الملف، وتجهزت دعوة باسم كل مدعو' });
    } catch (e) {
      this.setState({ file: 'none', guestErr: e.message || 'ما قدرنا نقرأ الملف' });
    }
  }

  async fixRows() {
    const ready = this.state.rows.filter((r) => r.bad && r.n && (r.p || r.e) && (!r.p || okPhone(r.p)) && (!r.e || okEmail(r.e)));
    if (!ready.length) return this.setState({ guestErr: 'كمّل الرقم أو الإيميل في الصفوف المعلّمة أول' });
    await this.addMany(ready.map((g) => this.toItem(g)), 'import');
    this.setState((st) => ({ rows: st.rows.map((r) => (ready.includes(r) ? { ...r, bad: false } : r)), fileMsg: 'تم التصحيح' }));
  }

  async contacts() {
    if (!navigator.contacts?.select) return this.setState({ guestErr: 'متصفحك ما يدعم جهات الاتصال. انسخ الأسماء والصقها أو ارفع ملف' });
    try {
      const list = await navigator.contacts.select(['name', 'tel', 'email'], { multiple: true });
      await this.addMany(list.map((c) => ({ name: c.name?.[0] || '', phone: (c.tel?.[0] || '').replace(/[^\d+]/g, ''), email: c.email?.[0] || '' })).filter((c) => c.name && (c.phone || c.email)), 'manual');
    } catch { /* the person closed the picker */ }
  }

  async photo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    this.setState({ photoMsg: 'نرفع الصورة…' });
    try {
      const a = await api.upload('/assets', f, { kind: 'photo' });
      this.set({ photo: a.url, photoId: a.id, photoMsg: `رُفعت الصورة، المقاس ${a.width}×${a.height}${a.height / a.width < 1.5 ? ' · الأفضل صورة بالطول 9:16' : ' مناسب'}` });
    } catch (er) {
      this.setState({ photoMsg: '', err: er.message });
    }
  }

  check(step) {
    const s = this.state;
    if (step === 0 && this.pats[s.pat].photo && !s.photo) return 'ارفع صورة الخلفية أول';
    if (step === 1) {
      if (!s.title.trim()) return 'اكتب عنوان المناسبة';
      const d = fromInputs(s.date, s.clock);
      if (!d) return 'حدد تاريخ المناسبة';
      if (d < new Date()) return 'موعد المناسبة فات، عدّل التاريخ';
      if (s.place === 0 && !s.placeName.trim()) return 'اكتب اسم المكان';
      if (s.map && !/^https:\/\/./.test(s.map)) return 'رابط الخرائط لازم يبدأ بـ https://';
      if (s.live && !/^https:\/\/./.test(s.live)) return 'رابط البث لازم يبدأ بـ https://';
    }
    if (step === 2 && s.aud === 0 && !s.man.length) return 'أضف مدعو واحد على الأقل';
    return '';
  }

  async next() {
    const s = this.state;
    if (s.busy) return;
    const err = this.check(s.step);
    if (err) return this.showErr({ err });
    if (s.step < 3) {
      this.setState({ step: s.step + 1, err: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.flush().catch(() => {});
      return;
    }
    for (let i = 0; i < 3; i++) {
      const m = this.check(i);
      if (m) return this.showErr({ step: i, err: m });
    }
    if (s.when === 1 && !s.schedDate) return this.showErr({ err: 'حدد وقت الإرسال' });
    this.setState({ busy: true, err: '' });
    try {
      await this.flush();
      const r = await api.post(`/invitations/${this.id}/publish`);
      this.setState({ done: r, busy: false });
      this.props.router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      this.showErr({ err: e.message, busy: false });
    }
  }

  /** On phones the buttons stay at the bottom of the screen and the message is below the form: bring it into view. */
  showErr(o) {
    this.setState(o, () => requestAnimationFrame(() => document.querySelector('[role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' })));
  }

  async sendCust() {
    const s = this.state;
    if (!s.ct.length) return this.setState({ cuErr: 'اختر نوع التخصيص' });
    try {
      await api.post('/requests', { title: s.ct.join(' + '), description: s.cuDesc, via: s.cuPhone ? 'واتساب' : 'إيميل', phone: s.cuPhone, email: s.cuMail });
      this.setState({ custSent: true, cuErr: '' });
    } catch (e) {
      this.setState({ cuErr: e.message });
    }
  }

  renderVals() {
    const s = this.state;
    const { data, shell } = this.props;
    const set = (o) => this.set(o);
    const ui = (o) => this.setState(o);
    const P0 = this.pats[s.pat];
    const C0 = P0.c[s.col] || P0.c[0];
    const c = shell.credit;
    const personal = s.aud === 0;
    const online = s.place === 1;
    const total = s.man.length;
    const myColors = data.designs.filter((x) => x.kind === 'colors');
    const mySeals = data.designs.filter((x) => x.kind === 'seal');
    const colorsD = myColors.find((x) => x.id === s.colorsId);
    const sealD = mySeals.find((x) => x.id === s.sealId);
    const loadD = data.designs.find((x) => x.id === s.loadingId);
    const need = s.sendBy === 1 ? (s.chH[0] ? 'whatsapp' : 'email') : 'self';
    const have = c[need];
    const starts = fromInputs(s.date, s.clock);
    const defMsg = s.msg || (personal ? `حيّاك يا «اسم المدعو» 🌿\nيسعدنا حضورك «${s.title || 'مناسبتنا'}»، وهذي دعوتك باسمك:` : `حيّــاكم 🌿\nيسعدنا حضوركم «${s.title || 'مناسبتنا'}». سجّل اسمك من الرابط وتوصلك دعوتك:`);
    const shLink = personal ? `${shell.host}/i/${this.slug || '…'}/رابط-خاص` : `${shell.host}/i/${this.slug || '…'}`;
    const bad = s.rows.filter((r) => r.bad);
    const look = { pattern: P0.engine ? 'لمّة نجوم' : P0.n, color: s.col, seal: s.seal, photo: s.photo, title: s.title || ' ', latin: s.latin, eventLabel: s.evl, customColors: P0.engine || P0.photo ? undefined : colorsD?.data, customSeal: sealD?.data, customLoading: loadD?.data, engine: P0.engine };
    const info = { entity: shell.org.name, logo: shell.org.logo, startsAt: starts ? starts.toISOString() : null, durationMin: Number(s.dur), online, placeName: s.placeName, placeArea: s.placeArea, mapUrl: s.map, platform: s.plat, liveUrl: s.live };
    const done = s.done;
    const upRow = (r, o) => ui({ rows: s.rows.map((y) => (y === r ? { ...y, ...o } : y)) });
    const shown = [...bad, ...s.rows.filter((r) => !r.bad)].slice(0, Math.max(5, bad.length));
    return {
      wide: Boolean(s.wide),
      ...base('الدعوات', shell), saveState: s.save || 'تتحفظ مسودة تلقائي', today: inputDate(new Date()), err: s.err, busy: s.busy,
      steps: ST.map((l, i) => { const on = s.step === i; const past = s.step > i; return { key: l, n: past ? '✓' : String(i + 1), label: l, go: () => { if (i <= s.step) ui({ step: i, err: '' }); else this.next(); }, st: `width:100%;height:46px;border:0;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;cursor:pointer;${on ? 'background:#0A2A43;color:#FFFFFF;font-weight:700' : 'background:transparent;color:#0A2A43'}`, num: `width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;${on || past ? 'background:#0E97AE;color:#FFFFFF' : 'background:rgba(10,42,67,.08);color:#0A2A43'}` }; }),
      s0: s.step === 0, s1: s.step === 1, s2: s.step === 2, s3: s.step === 3, done: Boolean(done), notDone: !done, doneHref: this.id ? `/app/invitations/${this.id}` : '/app',
      doneTitle: done ? (done.request ? 'وصلنا طلب الإرسال' : done.status === 'scheduled' ? 'تمت جدولة الدعوات' : personal ? `تجهزت ${done.count} دعوة` : 'صار رابط دعوتك شغال') : '',
      doneSub: done ? (done.request ? 'بنرسلها باسمك ونبلّغك أول ما تترسل، وتتابع الردود من صفحة الدعوة' : personal ? 'انسخ رابط كل مدعو مع رسالته من صفحة الدعوة، وتابع مين فتح ومين أكّد. ولو عدّلت الموعد أو المكان يتحدث عند الكل' : 'انشر الرابط، وكل شخص يسجّل توصله دعوته باسمه. تابع التسجيل من صفحة الدعوة') : '',
      restart: () => window.location.assign('/app/create'),
      pats: this.pats.map((p, i) => { const on = s.pat === i; const k = p.c[0][1]; return { key: p.id || p.n, n: p.n, d: p.d, tap: Boolean(p.tap), photo: Boolean(p.photo), look: p.engine ? { pattern: 'لمّة نجوم', color: 0, seal: p.seal, title: p.tt, latin: '', eventLabel: '', engine: p.engine } : undefined, on: on ? 'true' : 'false', pick: () => set({ pat: i, col: 0, colorsId: null }), st: `display:flex;flex-direction:column;padding:6px;border-radius:20px;cursor:pointer;color:#0A2A43;background:#FFFFFF;${on ? 'border:2px solid #0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.15)' : 'border:2px solid transparent'}`, bg: `position:relative;display:block;height:150px;border-radius:15px;overflow:hidden;background:${grad(k)}`, seal: p.seal, tt: p.tt, ac: k[3] }; }),
      patName: P0.n, isPhoto: Boolean(P0.photo), notPhoto: !P0.photo,
      cols: [
        ...P0.c.map((k, i) => { const on = !s.colorsId && s.col === i; return { key: k[0], n: k[0], on: on ? 'true' : 'false', pick: () => set({ col: i, colorsId: null }), st: `display:flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;border-radius:999px;cursor:pointer;color:#0A2A43;background:#FFFFFF;${on ? 'border:2px solid #0E97AE' : 'border:2px solid #DCE4E8'}`, sw: `width:36px;height:36px;border-radius:50%;background:${grad(k[1])};box-shadow:inset 0 0 0 1px rgba(10,42,67,.12)` }; }),
        ...(P0.engine ? [] : myColors).map((x) => { const on = s.colorsId === x.id; return { key: x.id, n: x.name, on: on ? 'true' : 'false', pick: () => set({ colorsId: x.id }), st: `display:flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;border-radius:999px;cursor:pointer;color:#0A2A43;background:#FFFFFF;${on ? 'border:2px solid #0E97AE' : 'border:2px solid #DCE4E8'}`, sw: `width:36px;height:36px;border-radius:50%;background:${grad([x.data.c1, x.data.c2, x.data.c2])};box-shadow:inset 0 0 0 1px rgba(10,42,67,.12)` }; }),
      ],
      seals: [
        ...SEALS.map((x) => { const k = x[0]; const lock = PAID_SEALS.includes(k) && !c.paid; const on = !s.sealId && s.seal === k; return { key: k, n: k, hex: x[1], lock, sub: lock ? 'مع الرصيد المدفوع' : on ? 'مختار' : '', on: on ? 'true' : 'false', pick: () => { if (!lock) set({ seal: k, sealId: null }); }, st: `display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:18px;cursor:${lock ? 'not-allowed' : 'pointer'};background:${on ? '#E6F6F9' : 'transparent'};border:2px solid ${on ? '#0E97AE' : 'transparent'}${lock ? ';opacity:.78' : ''}` }; }),
        ...mySeals.map((x) => { const on = s.sealId === x.id; return { key: x.id, n: x.data.text || x.name, hex: x.data.wax, lock: false, sub: on ? 'مختار' : 'خاص فيكم', on: on ? 'true' : 'false', pick: () => set({ sealId: x.id, seal: 'مدعو' }), st: `display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:18px;cursor:pointer;background:${on ? '#E6F6F9' : 'transparent'};border:2px solid ${on ? '#0E97AE' : 'transparent'}` }; }),
      ],
      openCust: () => ui({ cust: true, custSent: false }), closeCust: () => ui({ cust: false }), custOpen: s.cust, custSent: s.custSent, custForm: !s.custSent, sendCust: () => this.sendCust(), cuDesc: s.cuDesc, cuPhone: s.cuPhone, cuMail: s.cuMail, cuErr: s.cuErr, onCuDesc: (e) => ui({ cuDesc: e.target.value }), onCuPhone: (e) => ui({ cuPhone: e.target.value }), onCuMail: (e) => ui({ cuMail: e.target.value }),
      custTypes: CUST.map((n) => { const on = s.ct.includes(n); return { key: n, n, tog: () => ui({ ct: on ? s.ct.filter((y) => y !== n) : s.ct.concat(n) }), st: pill(on).replace('height:42px', 'height:38px') }; }),
      title: s.title, onTitle: (e) => set({ title: e.target.value.slice(0, 60) }), latin: s.latin, onLatin: (e) => set({ latin: e.target.value.slice(0, 60) }), evl: s.evl, onEvl: (e) => set({ evl: e.target.value.slice(0, 80) }), date: s.date, onDate: (e) => set({ date: e.target.value }), clock: s.clock, onClock: (e) => set({ clock: e.target.value }), dur: String(s.dur), onDur: (e) => set({ dur: Number(e.target.value) }), durs: DURATIONS.map((x) => ({ key: x[0], v: String(x[0]), n: x[1] })),
      placeOpts: ['حضوري', 'عن بعد'].map((n, i) => ({ key: n, n, pick: () => set({ place: i }), st: pill(s.place === i) })), isIn: !online, isOn: online, placeName: s.placeName, onPlaceName: (e) => set({ placeName: e.target.value.slice(0, 80) }), placeArea: s.placeArea, onPlaceArea: (e) => set({ placeArea: e.target.value.slice(0, 80) }),
      mapUrl: s.map, onMap: (e) => set({ map: e.target.value.trim() }), qrMsg: s.map ? (/^https:\/\//.test(s.map) ? 'جاهز: الباركود في الدعوة يفتح هذا الموقع' : 'الرابط لازم يبدأ بـ https://') : 'الصق الرابط وبنسوي منه باركود تلقائي في الدعوة', qrCol: s.map ? '#086577' : '#4A5B68', plat: s.plat, onPlat: (e) => set({ plat: e.target.value }), liveUrl: s.live, onLive: (e) => set({ live: e.target.value.trim() }),
      liveMsg: s.live ? 'جاهز: زر «انضم للبث» والباركود يفتحون الرابط' : 'بدون رابط؟ بيطلع للمدعو «بيوصلك الرابط قبل الفعالية»، وتقدر تضيفه بعدين ويتحدث عند الكل',
      audOpts: [['خاصة', 'لأسماء محددة، وكل مدعو يوصله رابط باسمه'], ['عامة', 'رابط واحد تنشره، وأي أحد يسجّل اسمه ويحضر']].map((o, i) => { const on = s.aud === i; return { key: o[0], n: o[0], d: o[1], pick: () => set({ aud: i }), st: `text-align:right;display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-radius:20px;cursor:pointer;color:#0A2A43;background:#FFFFFF;${on ? 'border:2px solid #0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.12)' : 'border:2px solid #DCE4E8'}` }; }),
      personal, general: !personal, selfSend: s.sendBy === 0, shHead: personal ? 'رابط كل مدعو مع رسالته' : 'رابط الدعوة العامة', shSub: personal ? 'دعوة خاصة · لكل مدعو رابط باسمه' : 'دعوة عامة · رابط واحد للكل', shLink, withMsg: s.withMsg, msg: defMsg, msgNote: personal ? '، و«اسم المدعو» يتغيّر لاسم كل واحد' : '', onMsg: (e) => set({ msg: e.target.value.slice(0, 1200) }), togMsg: () => ui({ withMsg: !s.withMsg }),
      msgBox: `width:22px;height:22px;border-radius:7px;flex:none;display:flex;align-items:center;justify-content:center;${s.withMsg ? 'background:#0E97AE' : 'background:#FFFFFF;border:1.5px solid #B7C6CE'}`,
      copyShare: () => { copyText(personal ? defMsg : s.withMsg ? `${defMsg}\nhttps://${shLink}` : `https://${shLink}`); clearTimeout(this.tcp); ui({ copied: true }); this.tcp = setTimeout(() => ui({ copied: false }), 1800); }, copyLink: () => { copyText(`https://${shLink}`); ui({ copied: true }); },
      copyTx: s.copied ? 'تم النسخ ✓' : personal ? 'انسخ نص الرسالة (الروابط تجهز بعد الإرسال)' : s.withMsg ? 'انسخ الرسالة مع الرابط' : 'انسخ الرابط', copySt: `height:50px;border:0;border-radius:999px;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:background .3s ease;color:#FFFFFF;background:${s.copied ? '#0E97AE' : '#0A2A43'}`,
      gms: [['اكتب أو الصق', 'الأسرع'], ['من جهات الاتصال', 'من جوالك'], ['ملف Excel', 'للقوائم الكبيرة'], ['واحد واحد', 'يدوي']].map((m, i) => { const on = s.gm === i; return { key: m[0], n: m[0], d: m[1], pick: () => ui({ gm: i, adding: i === 3, guestErr: '' }), st: `display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 8px;border-radius:18px;cursor:pointer;font-family:inherit;${on ? 'background:#0A2A43;color:#FFFFFF;border:0' : 'color:#0A2A43;background:#FFFFFF;border:1px solid #DCE4E8'}` }; }),
      gmPaste: s.gm === 0, gmContacts: s.gm === 1, gmFile: s.gm === 2, showUp: s.gm === 2 && s.file === 'none', pt: s.pt, onPt: (e) => ui({ pt: e.target.value }),
      parsePt: async () => {
        const items = [];
        let skipped = 0;
        for (const l of s.pt.split(/\n+/)) {
          if (!l.trim()) continue;
          let p = l.split(/[،,\t;]+/).map((y) => y.trim()).filter(Boolean);
          // People paste "سارة أحمد 0551234567" without a comma: the number or email at the end tells the two apart.
          if (p.length === 1) {
            const m = p[0].match(/^(.*?)[\s:–-]+((?:\+|00)?[\d٠-٩][\d٠-٩\s-]{6,}|\S+@\S+)$/);
            if (m) p = [m[1].trim(), m[2].replace(/[\s-]/g, '')];
          }
          const em = p.slice(1).find((y) => okEmail(y)) || '';
          const ph = p.slice(1).find((y) => okPhone(y)) || '';
          if (p[0] && (em || ph)) items.push({ name: p[0], phone: ph, email: em });
          else skipped++;
        }
        await this.addMany(items, 'manual');
        if (items.length) ui({ pt: '' });
        if (skipped) ui({ guestErr: `${skipped} سطر ما فهمناه. اكتب الاسم ثم فاصلة ثم الرقم أو الإيميل` });
      },
      pickContacts: () => this.contacts(), dlTpl: () => guestTemplate(), upload: (e) => { this.readFile(e.target.files?.[0]); e.target.value = ''; }, noFile: s.file === 'none', parsing: s.gm === 2 && s.file === 'parsing', hasFile: s.gm === 2 && s.file === 'ok', fileName: s.fileName, fileMsg: s.fileMsg, reupload: () => ui({ file: 'none', rows: [], fileMsg: '' }), hasBad: bad.length > 0, fix: () => this.fixRows(), fixLabel: 'أضف اللي صححته',
      stats: [{ key: 1, v: s.rows.length, l: 'في الملف', st: 'padding:8px 14px;border-radius:999px;background:#E6F6F9;color:#086577;font-size:13px' }, { key: 2, v: s.rows.filter((r) => r.bad && (!r.p || !okPhone(r.p)) && !r.e).length, l: 'جوال ناقص', st: `padding:8px 14px;border-radius:999px;font-size:13px;${bad.length ? 'background:rgba(201,115,58,.12);color:#9A5226' : 'background:#EDF1F3;color:#4A5B68'}` }, { key: 3, v: s.rows.filter((r) => r.bad && r.e && !okEmail(r.e)).length, l: 'إيميل غلط', st: `padding:8px 14px;border-radius:999px;font-size:13px;${bad.length ? 'background:rgba(201,115,58,.12);color:#9A5226' : 'background:#EDF1F3;color:#4A5B68'}` }],
      guests: shown.map((r, i) => ({ key: i, n: r.n || 'بدون اسم', o: r.t, p: r.p, e: r.e, bad: r.bad, good: !r.bad, s: SD[r.s] ? r.s : s.seal, sc: SD[r.s] || SD[s.seal], onP: (e) => upRow(r, { p: e.target.value }), onE: (e) => upRow(r, { e: e.target.value }), st: `display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,1.3fr) 80px;gap:10px;align-items:center;padding:10px;border-radius:12px;${r.bad ? 'background:rgba(201,115,58,.08)' : 'background:transparent'}` })), moreRows: s.rows.length > shown.length ? `و ${s.rows.length - shown.length} مدعو ثاني` : '',
      guestErr: s.guestErr, hasMan: s.man.length > 0, manN: s.man.length, man: s.man.slice(-60).reverse().map((g) => ({ key: g.id, n: g.n, c: g.p || g.e, s: g.s, sc: SD[g.s], del: () => this.removeOne(g) })), adding: s.adding, notAdding: !s.adding, startAdd: () => ui({ adding: true, addErr: false }), cancelAdd: () => ui({ adding: false, mn: '', mp: '', me: '' }), mn: s.mn, mp: s.mp, me: s.me, onMn: (e) => ui({ mn: e.target.value }), onMp: (e) => ui({ mp: e.target.value }), onMe: (e) => ui({ me: e.target.value }), onMs: (e) => ui({ ms: e.target.value }), sealOpts: SEALS.map((x) => x[0]).filter((k) => c.paid || !PAID_SEALS.includes(k)), addErr: s.addErr,
      addGuest: async () => { if (!s.mn.trim() || !((s.mp && okPhone(s.mp)) || (s.me && okEmail(s.me)))) return ui({ addErr: true }); await this.addMany([{ name: s.mn, phone: s.mp, email: s.me, seal: s.ms }], 'manual'); ui({ mn: '', mp: '', me: '', addErr: false }); },
      sendOpts: [['أرسلها بنفسي', 'نجهّز لك رابط ورسالة لكل مدعو، وترسلها من أي تطبيق تبيه', 'للكل', false], ['حيّــاك ترسلها عنك', 'ترسل لنا الطلب من حسابك قبل المناسبة بـ 48 ساعة على الأقل، ونرسلها باسمك بالواتساب أو الإيميل', c.email > 0 ? 'من رصيدك' : 'مع الرصيد المدفوع', true]].map((o, i) => { const on = s.sendBy === i; return { key: o[0], n: o[0], d: o[1], tag: o[2], pick: () => set({ sendBy: i }), tagSt: `flex:none;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;${o[3] ? 'background:rgba(231,200,115,.35);color:#5B4A12' : 'background:#E6F6F9;color:#086577'}`, st: `text-align:right;display:flex;flex-direction:column;gap:6px;padding:16px 18px;border-radius:22px;cursor:pointer;color:#0A2A43;background:#FFFFFF;font-family:inherit;${on ? 'border:2px solid #0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)' : 'border:2px solid transparent'}` }; }),
      chHead: s.sendBy === 0 ? 'وش نجهّز لك' : 'نرسلها على',
      chans: (s.sendBy === 0 ? [['رابط لكل مدعو', 'رابط خاص باسمه، ترسله من أي تطبيق'], ['قائمة بكل الروابط', 'ملف فيه اسم كل مدعو ورابطه ورسالته']] : [['واتساب', `من حساب حيّــاك، والرسالة باسمك${c.whatsapp ? '' : ' · يحتاج رصيد واتساب'}`], ['الإيميل', `من إيميل حيّــاك، والمرسل باسمك${c.email ? '' : ' · يحتاج رصيد إيميل'}`]]).map((x, i) => { const key = s.sendBy === 0 ? 'chS' : 'chH'; const on = s[key][i]; return { key: x[0], n: x[0], d: x[1], on, tog: () => { const a = s[key].slice(); a[i] = !a[i]; if (a.some(Boolean)) set({ [key]: a }); }, st: `display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;cursor:pointer;color:#0A2A43;background:#FFFFFF;font-family:inherit;border:1px solid ${on ? '#0E97AE' : '#DCE4E8'}`, box: `width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;${on ? 'background:#0E97AE' : 'background:#FFFFFF;border:1px solid #B8C6CE'}` }; }),
      whenOpts: ['الحين', 'جدولة'].map((n, i) => ({ key: n, n, pick: () => set({ when: i }), st: pill(s.when === i) })), sched: s.when === 1, schedDate: s.schedDate, schedTime: s.schedTime, onSchedDate: (e) => set({ schedDate: e.target.value }), onSchedTime: (e) => set({ schedTime: e.target.value }),
      remOn: s.remBy !== 2, remRule: `${s.remBy === 0 ? 'نرسل التذكير من حسابات حيّــاك باسمك. ' : 'ننبّهك بالإيميل وقت كل تذكير، ومعه رسالة جاهزة لكل اللي ما ردّوا. '}وعشان يوصل التذكير قبل المناسبة بيوم، أرسل الدعوة قبل المناسبة بيومين على الأقل. لو أرسلتها متأخر تترسل عادي، بس بدون تذكير`,
      remOpts: [['حيّــاك تذكّرهم', 'نرسل لهم تذكير باسمك بالواتساب أو الإيميل', 'مع الرصيد المدفوع', true], ['أذكّرهم بنفسي', 'ننبّهك وقت التذكير، وتنسخ رسالة جاهزة وترسلها', 'للكل', false], ['بدون تذكير', 'ما يوصل المدعوين أي تذكير', '', false]].map((o, i) => { const on = s.remBy === i; const dis = i === 0 && !c.paid; return { key: o[0], n: o[0], d: o[1], tag: o[2], pick: () => { if (!dis) set({ remBy: i }); }, tagSt: !o[2] ? 'display:none' : `flex:none;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;${o[3] ? 'background:rgba(231,200,115,.35);color:#5B4A12' : 'background:#E6F6F9;color:#086577'}`, st: `text-align:right;display:flex;flex-direction:column;gap:6px;padding:14px 16px;border-radius:20px;cursor:${dis ? 'not-allowed' : 'pointer'};${dis ? 'opacity:.6;' : ''}color:#0A2A43;background:#FFFFFF;font-family:inherit;${on ? 'border:2px solid #0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)' : 'border:2px solid transparent'}` }; }),
      rems: [['قبل المناسبة بيوم', 0], ['قبل المناسبة بـ 3 ساعات', 1]].map((r) => { const on = s.rem[r[1]]; return { key: r[0], n: r[0], tog: () => { const a = s.rem.slice(); a[r[1]] = !a[r[1]]; set({ rem: a }); }, sw: `width:44px;height:26px;border-radius:999px;position:relative;flex-shrink:0;background:${on ? '#0E97AE' : '#CFD9DF'}`, kn: `position:absolute;top:3px;${on ? 'left:3px' : 'left:21px'};width:20px;height:20px;border-radius:50%;background:#FFFFFF;transition:left .2s ease` }; }),
      summary: [{ key: 1, k: 'الدعوة', v: s.title || '—' }, { key: 2, k: 'التصميم', v: `${P0.n} · ${colorsD ? colorsD.name : C0[0]}` }, { key: 3, k: 'المدعوين', v: personal ? `${total} مدعو` : `دعوة عامة · لين ${s.cap}` }, { key: 4, k: 'الإرسال', v: !personal ? 'رابط للنشر' : s.sendBy === 0 ? 'ترسلها بنفسك' : 'حيّــاك ترسلها: ' + ['واتساب', 'إيميل'].filter((n, i) => s.chH[i]).join(' و') }, { key: 5, k: 'التذكير', v: ['حيّــاك تذكّرهم', 'أنت تذكّرهم', 'بدون تذكير'][s.remBy] }, { key: 6, k: 'من رصيدك', v: personal ? `${total} دعوة · يبقى لك ${Math.max(0, have - total)}${total > have ? ' (ما يكفي)' : ''}` : 'دعوة لكل شخص يسجّل' }],
      cap: String(s.cap), onCap: (e) => set({ cap: e.target.value.replace(/\D/g, '').slice(0, 6) }), capMsg: Number(s.cap) > c.self ? `أكثر من المتبقي في رصيدك (${c.self}). قلّل العدد أو اشترِ رصيد` : `المتبقي في رصيدك ${c.self}. وكل شخص يسجّل يتحسب دعوة`, capCol: Number(s.cap) > c.self ? '#9A5226' : '#4A5B68', closes: s.closes, onCloses: (e) => set({ closes: e.target.value }),
      prevVis: s.step === 0 ? 'hidden' : 'visible', prev: () => { if (s.step > 0) ui({ step: s.step - 1, err: '' }); }, next: () => this.next(), nextLabel: s.busy ? 'لحظة…' : s.step < 3 ? 'التالي' : s.sendBy === 1 && personal ? 'أرسل طلب الإرسال' : s.when === 1 ? 'جدول الإرسال' : personal ? 'جهّز الدعوات' : 'انشر الرابط',
      pvOpen: s.pv, togglePv: () => ui({ pv: !s.pv }), hasPhoto: Boolean(s.photo || s.photoMsg), photoMsg: s.photoMsg || 'الصورة جاهزة', photoLabel: s.photo ? 'تم رفع الصورة · غيّرها' : 'اختر صورة', pickPhoto: (e) => this.photo(e),
      pv: { info, look, pattern: P0.n, aud: personal ? 'شخصية' : 'عامة', place: online ? 'عن بعد' : 'حضوري', platform: s.plat, link: s.live ? 'الرابط جاهز' : 'يوصل لاحقًا' },
      ...TOUR(this, STEPS),
    };
  }
}
