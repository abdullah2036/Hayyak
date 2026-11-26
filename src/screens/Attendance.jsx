'use client';
import View from '@/views/Attendance.view';
import { Screen } from '@/ui/dc';
import { api, base, chipSt, cntSt, copyText, loadQr, qrCells, saveXlsx, tgl, TOUR } from '@/ui/kit';

const STEPS = [
  ['1', 'مراحل الفعالية', 'الصفحة تتغير حسب وقت الفعالية: قبلها، وقتها، وبعدها'], ['2', 'تسجيل الحضور', 'في آخر الفعالية تضغط «افتح تسجيل الحضور». يطلع كود من 4 أرقام وباركود، والمدعو يسجّل من رابط دعوته. حضوري تعرضه على الشاشة، وأونلاين تلصقه في الشات'], ['3', 'إضافة حضور يدوي', 'لو أحد حضر بدون دعوة أو جواله فاضي، تضيفه هنا وتطلع له شهادة مثل الباقي'],
  ['4', 'الأرقام', 'كم مدعو، كم أكّد، كم حضر فعلًا، مين أكّد وما جا، وكم شهادة طلعت. تتحدث لحالها'], ['5', 'من الدعوة للشهادة', 'تشوف وين يوقف الناس: كم فتح الدعوة، كم أكّد، كم حضر، وكم حمّل شهادته. وجنبها التوزيع حسب الختم ووقت التسجيل'], ['6', 'كشف الحضور', 'فلتر حسب الحالة، وسجّل حضور أي أحد نسي. وتحمّل الكشف Excel أو تروح لتقرير الفصل'], ['7', 'رسائل الشكر', 'اختر الفئة واكتب رسالتك، وتطلع لهم في نفس رابط دعوتهم. وللمتحدثين والرعاة والمتطوعين تقدر ترفق شهادة شكر'],
];

export default class Attendance extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { mode: p.data.online ? 1 : 0, dur: 10, second: false, auto: true, proj: false, copied: false, nCopied: false, walk: '', f: 0, grp: 0, msgs: {}, cert: { 1: true, 2: true, 3: true }, tour: -1, tr: null, now: Date.now(), qr: null, err: '', busy: false, again: false };
  }

  componentDidMount() {
    loadQr().then((qr) => this.setState({ qr }));
    this.clock = setInterval(() => {
      const c = this.props.data.session;
      if (!c) return;
      this.setState({ now: Date.now() });
      if (new Date(c.closesAt).getTime() <= Date.now() && !this.closing) {
        this.closing = true;
        setTimeout(() => { this.closing = false; this.props.router.refresh(); }, 1200);
      }
    }, 1000);
    // While the code is open the count refreshes on its own.
    this.poll = setInterval(() => { if (this.props.data.session && !document.hidden) this.props.router.refresh(); }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.clock);
    clearInterval(this.poll);
    clearTimeout(this.tto);
    clearTimeout(this.tc);
  }

  async act(path, body) {
    if (this.state.busy) return false;
    this.setState({ busy: true, err: '' });
    try {
      await api.post(`/invitations/${this.props.data.id}${path}`, body);
      this.props.router.refresh();
      this.setState({ busy: false });
      return true;
    } catch (e) {
      this.setState({ err: e.message, busy: false });
      return false;
    }
  }

  flash(k) {
    clearTimeout(this.tc);
    this.setState({ [k]: true });
    this.tc = setTimeout(() => this.setState({ [k]: false }), 1600);
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell } = this.props;
    const set = (o) => this.setState(o);
    const c = d.counts;
    const ph = d.phase === 'done' && s.again ? 'before' : d.phase;
    const live = d.phase !== 'before';
    const mode = d.session ? (d.session.mode === 'online' ? 1 : 0) : s.mode;
    const secs = d.session ? Math.max(0, Math.floor((new Date(d.session.closesAt).getTime() - s.now) / 1000)) : 0;
    const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    const qr = qrCells(d.session?.qr, s.qr);
    const home = `/app/invitations/${d.id}`;
    const rows = d.rows.map((g) => {
      let st = 'لسا';
      let sc = '#3A4B58';
      let sb = 'rgba(184,196,204,.3)';
      if (g.att) { st = g.walkin ? 'حضر · إضافة يدوية' : g.r === 'أكّد' ? 'حضر' : 'حضر بدون تأكيد'; sc = '#086577'; sb = 'rgba(14,151,174,.14)'; } else if (live && g.r === 'أكّد') { st = 'أكّد وما حضر'; sc = '#5B4A12'; sb = 'rgba(231,200,115,.32)'; } else if (live) { st = 'ما حضر'; sb = 'rgba(184,196,204,.35)'; }
      return { key: g.id, i: g.n.charAt(0), n: g.n, r: g.r, seal: g.seal, t: g.att ? g.t : '—', st, sc, sb, can: live && !g.att && shell.canEdit, k: g.att ? 1 : g.r === 'أكّد' ? 3 : 2, mark: () => this.act('/attendance/mark', { guestId: g.id }) };
    });
    const tabs = [['الكل', 0, rows.length], ['حضروا', 1, rows.filter((r) => r.k === 1).length], ['ما حضروا', 2, live ? rows.filter((r) => r.k !== 1).length : 0], ['أكّدوا وما حضروا', 3, live ? rows.filter((r) => r.k === 3).length : 0]];
    const list = rows.filter((r) => s.f === 0 || r.k === s.f || (s.f === 2 && r.k === 3));
    const def = [`شكرًا لحضوركم «${d.title}»، وجودكم فرق معنا. شهادتكم موجودة في نفس رابط الدعوة`, 'شكرًا على مشاركتكم وعلى الوقت اللي عطيتونا إياه، أثركم وصل لكل الحاضرين', `شكرًا على دعمكم لـ «${d.title}»، ما كان بيطلع بهالشكل بدونكم`, 'شكرًا على تعبكم وتنظيمكم، أنتم سبب النجاح'];
    const gi = s.grp;
    const g0 = d.groups[gi];
    const msg = s.msgs[gi] ?? g0.note?.text ?? def[gi];
    const posted = Boolean(g0.note) && msg === g0.note.text;
    const certOn = gi > 0 && (g0.note ? g0.note.withCert || Boolean(s.cert[gi]) : Boolean(s.cert[gi]));
    const ct = tgl(certOn);
    const funnel = [['أُرسلت الدعوة', c.invited], ['فتحوا الدعوة', c.opened], ['أكّدوا', c.confirmed], ['حضروا', c.attended], ['حمّلوا الشهادة', c.downloads]];
    const maxA = Math.max(1, ...d.arr.map((a) => a.n));
    const peak = d.arr.find((a) => a.n === maxA);
    return {
      ...base('الدعوات', shell), back: home, title: d.title, when: d.when, hCert: `${home}/certificate`, hJourney: `${home}/journey`, err: s.err,
      isBefore: ph === 'before', isOpen: ph === 'open', isDone: ph === 'done', notDone: ph !== 'done', stLabel: ph === 'before' ? (d.sent ? 'ما انفتح لسا' : 'أرسل الدعوة أول') : ph === 'open' ? 'مفتوح الحين' : 'مغلق', stDotC: ph === 'open' ? 'pulse' : '',
      stPill: `display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:700;${ph === 'open' ? 'background:rgba(14,151,174,.14);color:#086577' : ph === 'done' ? 'background:rgba(10,42,67,.08);color:#0A2A43' : 'background:rgba(231,200,115,.3);color:#5B4A12'}`,
      modes: ['حضوري', 'أونلاين'].map((m, i) => ({ key: m, l: m, pr: mode === i ? 'true' : 'false', on: () => { if (!d.session) set({ mode: i }); }, st: chipSt(mode === i, 42) })), inPerson: mode === 0,
      durs: [5, 10, 15].map((x) => ({ key: x, l: `${x} ${x > 10 ? 'دقيقة' : 'دقايق'}`, pr: s.dur === x ? 'true' : 'false', on: () => set({ dur: x }), st: chipSt(s.dur === x, 42) })),
      opts: [['كود ثاني في بداية الفعالية', 'يسجّلون مرتين (البداية والنهاية) عشان تتأكد إنهم حضروا كامل الفعالية', 'second'], ['الشهادات تطلع تلقائيًا', 'أول ما يتسكّر الكود تطلع الشهادة لكل اللي سجّلوا', 'auto']].map((o) => { const t = tgl(s[o[2]]); return { key: o[2], t: o[0], d: o[1], pr: s[o[2]] ? 'true' : 'false', bg: t.bg, knob: t.knob, tog: () => set({ [o[2]]: !s[o[2]] }) }; }),
      openReg: async () => { if (await this.act('/attendance/open', { mode: s.mode === 1 ? 'online' : 'person', minutes: s.dur, second: s.second || d.startDone !== null, autoCert: s.auto })) set({ again: false, now: Date.now() }); },
      beforeTip: d.startDone !== null && d.phase === 'before' ? `كود البداية أُغلق وسجّل فيه ${d.startDone}. افتح كود النهاية في آخر الفعالية` : s.mode === 0 ? 'افتحه في آخر الفعالية واعرضه على الشاشة، عشان يسجّل اللي حضر للنهاية. ما تحتاج أحد عند الباب' : 'افتحه في آخر اللقاء والصق الكود في الشات أو حطه في آخر شريحة',
      qr: qr.cells, qrBox: `0 0 ${qr.n} ${qr.n}`, code: d.session?.code || '', clock, liveCount: d.session?.phase === 'start' ? d.startDone || 0 : c.attended, confirmed: c.confirmed, codeLabel: d.session?.phase === 'start' ? 'كود البداية' : d.startDone !== null ? `كود النهاية · كود البداية أُغلق وسجّل فيه ${d.startDone}` : 'كود الحضور', liveBar: `display:block;height:100%;border-radius:10px;background:linear-gradient(90deg,#0E97AE,#86DCEA);transition:width .6s ease;width:${Math.min(100, pct(c.attended, c.confirmed || c.invited))}%`,
      showProj: () => set({ proj: true }), hideProj: () => set({ proj: false }), proj: s.proj && ph === 'open', copyCls: mode === 1 ? 'btnp' : 'btn', copyCode: () => { copyText(`كود الحضور: ${d.session.code}\nاكتبه في رابط دعوتك قبل ما يتسكّر (باقي ${clock})`); this.flash('copied'); }, copyL: s.copied ? 'تم النسخ ✓' : 'انسخ الكود للشات',
      extend: () => this.act('/attendance/extend'), closeReg: () => this.act('/attendance/close'), openTip: mode === 0 ? 'المدعو يفتح رابط دعوته ويمسح الباركود أو يكتب الكود. ويتسكّر لحاله لما يخلص الوقت' : 'الصق الكود في شات اللقاء، والمدعو يكتبه في رابط دعوته. ويتسكّر لحاله لما يخلص الوقت',
      attended: c.attended, certLine: d.certIssued ? `طلعت ${c.certs} شهادة ووصلت لهم في رابط دعوتهم` : 'الشهادات جاهزة، طلّعها وقت ما تبي', canIssue: !d.certIssued && c.attended > 0 && shell.canEdit, issue: () => this.act('/certificate/issue'), issueL: s.busy ? 'لحظة…' : 'طلّع الشهادات', reopen: () => set({ again: true }),
      walk: s.walk, onWalk: (e) => set({ walk: e.target.value.slice(0, 80) }), addWalk: async () => { if (live && s.walk.trim() && (await this.act('/attendance/walkin', { name: s.walk.trim() }))) set({ walk: '' }); }, walkKey: async (e) => { if (e.key === 'Enter' && live && s.walk.trim() && (await this.act('/attendance/walkin', { name: s.walk.trim() }))) set({ walk: '' }); },
      walkBtn: 'أضفه وسجّل حضوره', walkNote: !live, hasWalk: d.walkins.length > 0, walkList: d.walkins.slice(-12),
      kpis: [{ key: 1, l: 'المدعوين', v: c.invited, s: 'أُرسلت لهم الدعوة', c: '#0A2A43' }, { key: 2, l: 'أكّدوا', v: c.confirmed, s: `${pct(c.confirmed, c.invited)}% من المدعوين`, c: '#0A2A43' }, { key: 3, l: 'حضروا', v: live ? c.attended : '—', s: live ? (ph === 'open' ? 'يتحدث الحين' : `منهم ${c.noConfirm} بدون تأكيد`) : 'يبدأ لما تفتح التسجيل', c: '#0E97AE' }, { key: 4, l: 'أكّدوا وما حضروا', v: d.phase === 'done' ? c.noShow : '—', s: d.phase === 'done' ? 'تقدر تسجّل حضورهم يدويًا' : 'يطلع بعد الفعالية', c: '#B8892A' }, { key: 5, l: 'الشهادات', v: d.certIssued ? c.certs : '—', s: d.certIssued ? `حمّلها ${c.downloads} لين الحين` : d.phase === 'done' ? 'بانتظار إطلاقك' : 'تطلع لما يتسكّر الكود', c: '#086577' }],
      funnel: funnel.map((f, i) => { const w = pct(f[1], c.invited); return { key: f[0], l: f[0], n: f[1], p: w + '%', bar: `display:block;height:100%;border-radius:10px;width:${Math.min(100, w)}%;animation-delay:${i * 0.08}s;background:${i === 3 ? 'linear-gradient(90deg,#0E97AE,#4FC9DC)' : i === 4 ? '#086577' : '#B8C9D3'}` }; }),
      rates: [{ key: 1, v: pct(c.confirmed, c.invited) + '%', l: 'أكّدوا من المدعوين' }, { key: 2, v: pct(c.attended - c.noConfirm, c.confirmed) + '%', l: 'حضروا من اللي أكّدوا' }, { key: 3, v: c.noConfirm, l: 'حضروا بدون ما يأكّدون' }],
      seals: d.seals.map((x) => ({ key: x.l, l: x.l, n: `${x.n} من ${x.all}`, bar: `display:block;height:100%;border-radius:10px;background:#0E97AE;width:${pct(x.n, x.all)}%` })),
      arr: d.arr.map((a, i) => ({ key: i, n: a.n, bar: `display:block;width:100%;border-radius:8px 8px 3px 3px;animation-delay:${i * 0.05}s;height:${Math.round((a.n / maxA) * 90)}px;background:${a.n === maxA ? '#0E97AE' : '#B8DDE5'}` })), arrLabel: peak ? `أكثر وقت سجّلوا فيه ${peak.t}` : 'ما فيه تسجيل بالكود للحين', arrA: d.arr[0]?.t.slice(0, -2) || '', arrB: d.arr[4]?.t.slice(0, -2) || '', arrC: d.arr[8]?.t.slice(0, -2) || '',
      tabs: tabs.map((t, i) => ({ key: t[0], label: t[0], n: t[2], pr: s.f === i ? 'true' : 'false', on: () => set({ f: i }), st: chipSt(s.f === i, 42), cst: cntSt(s.f === i) })), rows: list.slice(0, 120), rosterNote: list.length > 120 ? 'أول 120 اسم · الكشف الكامل في ملف Excel' : rows.length ? 'الكشف الكامل في ملف Excel' : 'ما فيه مدعوين للحين',
      dl: () => saveXlsx(`حياك - كشف حضور ${d.title}.xlsx`, [{ name: 'كشف الحضور', rows: [['الاسم', 'الرد', 'الختم', 'وقت التسجيل', 'الحضور'], ...rows.map((r) => [r.n, r.r, r.seal, r.t, r.st])] }]),
      grps: d.groups.map((g, i) => ({ key: g.l, l: g.l, n: g.n, pr: gi === i ? 'true' : 'false', on: () => set({ grp: i }), st: chipSt(gi === i, 42), cst: cntSt(gi === i) })), msg, onMsg: (e) => set({ msgs: { ...s.msgs, [gi]: e.target.value.slice(0, 600) } }), canCert: gi > 0, allGrp: gi === 0, certOn: certOn ? 'true' : 'false', certBg: ct.bg, certKnob: ct.knob, togCert: () => set({ cert: { ...s.cert, [gi]: !s.cert[gi] } }),
      posted, post: () => { if (!posted && g0.n) this.act('/thanks', { group: gi, text: msg, withCert: certOn }); }, postL: posted ? `انتشرت لـ ${g0.n} في رابط دعوتهم ✓` : g0.n ? 'انشر الرسالة' : 'ما فيه أحد في هذي الفئة', copyNote: () => { copyText(msg); this.flash('nCopied'); }, copyNoteL: s.nCopied ? 'تم النسخ ✓' : 'انسخها وأرسلها بنفسك بعد',
      ...TOUR(this, STEPS),
    };
  }
}
