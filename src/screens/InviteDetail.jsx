'use client';
import View from '@/views/InviteDetail.view';
import { Screen } from '@/ui/dc';
import { api, base, chipSt, cntSt, copyText, loadQr, qrCells, REPLY_ST, saveXlsx, starField, tgl, TOUR } from '@/ui/kit';
import { fromInputs } from '@/lib/dates';

const STEPS = [
  ['1', 'الدعوة', 'شكل دعوتك وموعدها. تقدر تعاينها، تعدّل الموعد والمكان، أو تكررها لمناسبة ثانية'], ['2', 'رابط الدعوة', 'انسخ الرابط مع رسالة جاهزة، أو خلهم يمسحون الباركود'], ['3', 'التذكير', 'شغّل أو وقّف التذكير التلقائي، أو أرسل تذكير الحين للي ما ردّوا'],
  ['4', 'الأرقام', 'كم أُرسلت، كم فتحوها، كم أكّد واعتذر، وكم ما ردّ'], ['5', 'الحضور والشهادات', 'يوم المناسبة تفتح كود الحضور، وبعدها تطلع الشهادات والإحصائيات لحالها'], ['6', 'المدعوين', 'فلتر حسب الرد، وحمّل القائمة Excel'], ['7', 'سجل الدعوة', 'كل اللي صار للدعوة بالترتيب، ومتى التذكير الجاي'],
];

export default class InviteDetail extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { editing: false, saved: '', eDate: '', eTime: '', ePlace: '', copied: false, cp: '', remindTx: '', tab: 0, tour: -1, tr: null, qr: null, busy: false };
  }

  componentDidMount() { loadQr().then((qr) => this.setState({ qr })); }

  componentWillUnmount() { clearTimeout(this.tc); clearTimeout(this.tto); }

  flash(k) {
    clearTimeout(this.tc);
    this.setState({ cp: k });
    this.tc = setTimeout(() => this.setState({ cp: '' }), 1600);
  }

  async links() {
    this.linksCache ||= (await api.get(`/invitations/${this.props.data.id}/links`)).rows;
    return this.linksCache;
  }

  renderVals() {
    const s = this.state;
    const { data: d, shell, router } = this.props;
    const set = (o) => this.setState(o);
    const pub = d.raw.audience === 'public';
    const live = d.raw.status === 'sent';
    const count = (st) => d.guests.filter((g) => g.st === st).length;
    const tabs = [['الكل', null, d.guests.length], ['أكّدوا', 'أكّد', count('أكّد')], ['اعتذروا', 'اعتذر', count('اعتذر')], ['ما ردّوا', 'ما ردّ', count('ما ردّ')]];
    const rems = [['قبل المناسبة بيوم', d.reminders.dayText, 'day'], ['قبل المناسبة بـ 3 ساعات', d.reminders.hoursText, 'hours']];
    const qr = qrCells(d.url, s.qr);
    const home = `/app/invitations/${d.id}`;
    return {
      ...base('الدعوات', shell), stars: starField(30), qr: qr.cells, qrBox: `0 0 ${qr.n} ${qr.n}`, look: d.look, title: d.title, badge: `${d.status} · دعوة ${d.audience} · ${d.by}`, when: d.time ? `${d.date} · ${d.time}` : d.date, place: d.place || 'المكان ما تحدد',
      preview: `${home}/preview`, hAtt: `${home}/attendance`, hCert: `${home}/certificate`, hJourney: `${home}/journey`, certLine: `${d.cert.tpl} · ${d.cert.lang}`,
      editing: s.editing, saved: Boolean(s.saved), savedTx: s.saved, editLabel: s.editing ? 'إلغاء التعديل' : 'تعديل الموعد والمكان',
      toggleEdit: () => set({ editing: !s.editing, saved: '', eDate: d.raw.date, eTime: d.raw.time, ePlace: d.raw.placeName }),
      eDate: s.eDate, eTime: s.eTime, ePlace: s.ePlace, onDate: (e) => set({ eDate: e.target.value }), onTime: (e) => set({ eTime: e.target.value }), onPlace: (e) => set({ ePlace: e.target.value }),
      saveEdit: async () => {
        const startsAt = fromInputs(s.eDate, s.eTime);
        if (!startsAt) return set({ saved: 'حدد التاريخ والوقت' });
        try {
          const r = await api.post(`/invitations/${d.id}/event`, { startsAt: startsAt.toISOString(), placeName: s.ePlace });
          set({ editing: false, saved: r.notified ? `تم حفظ التعديل، ووصل إيميل لـ ${r.notified} مدعو` : 'تم حفظ التعديل، ويطلع للكل على نفس الرابط' });
          router.refresh();
        } catch (e) { set({ saved: e.message }); }
      },
      dup: async () => { try { const r = await api.post(`/invitations/${d.id}/duplicate`); router.push(`/app/create?id=${r.id}`); } catch (e) { set({ saved: e.message }); } },
      link: d.link, linkNote: pub ? 'رابط الدعوة، وينسخ معه رسالة جاهزة فيها اسم المناسبة' : 'الدعوة خاصة: كل مدعو له رابط باسمه، تنسخه من القائمة تحت أو تحمّل كل الروابط',
      copy: async () => {
        if (pub) copyText(d.message);
        else { try { copyText((await this.links()).map((l) => `${l.name}: ${l.link}`).join('\n')); } catch (e) { set({ saved: e.message }); return; } }
        this.flash('all');
      },
      copyLabel: s.cp === 'all' ? 'تم النسخ ✓' : pub ? 'انسخ مع الرسالة' : 'انسخ كل الروابط',
      rems: rems.map((r) => {
        const on = d.reminders.by !== 'none' && d.reminders[r[2]];
        const t = tgl(on);
        return { key: r[2], t: r[0], d: on ? r[1] : 'متوقف', bg: t.bg, knob: t.knob, tog: async () => { try { await api.post(`/invitations/${d.id}/reminders`, { day: r[2] === 'day' ? !on : d.reminders.by !== 'none' && d.reminders.day, hours: r[2] === 'hours' ? !on : d.reminders.by !== 'none' && d.reminders.hours }); router.refresh(); } catch (e) { set({ remindTx: e.message }); } } };
      }),
      remind: async () => {
        if (s.busy || !live) return;
        set({ busy: true });
        try {
          const r = await api.post(`/invitations/${d.id}/remind`);
          if (r.mode === 'copy') copyText(r.text);
          set({ remindTx: r.mode === 'none' ? 'كلهم ردّوا ✓' : r.mode === 'copy' ? `تم نسخ رسالة التذكير لـ ${r.count} مدعو ✓` : `أُرسل التذكير لـ ${r.count} مدعو ✓` });
          router.refresh();
        } catch (e) { set({ remindTx: e.message }); }
        set({ busy: false });
      },
      remindLabel: s.remindTx || (!live ? 'التذكير متاح بعد الإرسال' : d.reminders.by === 'hayyak' ? 'أرسل تذكير الحين للي ما ردّوا' : 'انسخ رسالة تذكير للي ما ردّوا'),
      kpis: [{ key: 1, l: 'أُرسلت · من رصيدك', v: d.stats.sent, c: '#0A2A43' }, { key: 2, l: 'فتحوا', v: d.stats.open, c: '#0A2A43' }, { key: 3, l: 'أكّدوا', v: d.stats.ok, c: '#0E97AE' }, { key: 4, l: 'اعتذروا', v: d.stats.no, c: '#4A5B68' }, { key: 5, l: 'ما ردّوا', v: d.stats.pending, c: '#B8892A' }],
      tabs: tabs.map((t, i) => ({ key: t[0], label: t[0], n: t[2], on: () => set({ tab: i }), st: chipSt(s.tab === i), cst: cntSt(s.tab === i) })),
      guests: d.guests.filter((g) => s.tab === 0 || g.st === tabs[s.tab][1]).slice(0, 300).map((g) => ({
        key: g.id, i: g.i, n: g.n, c: g.c, ch: g.ch, st: g.st, when: g.when, sc: REPLY_ST[g.st][0], sb: REPLY_ST[g.st][1], cpL: s.cp === g.id ? 'تم النسخ ✓' : 'انسخ دعوته',
        cp: shell.canEdit && d.raw.status !== 'draft' ? async () => { try { const l = (await this.links()).find((x) => x.link.endsWith('/' + g.token)); if (l) { copyText(l.message); this.flash(g.id); } } catch (e) { set({ saved: e.message }); } } : null,
      })),
      hasLinks: !pub && shell.canEdit && d.guests.length > 0, dlLinksL: 'حمّل كل الروابط',
      dlLinks: async () => { try { const l = await this.links(); saveXlsx(`حياك - روابط ${d.title}.xlsx`, [{ name: 'الروابط', rows: [['الاسم', 'الجوال', 'الإيميل', 'الرابط', 'الرسالة'], ...l.map((x) => [x.name, x.phone, x.email, x.link, x.message])] }]); } catch (e) { set({ saved: e.message }); } },
      dlX: async (e) => { e?.preventDefault(); saveXlsx(`حياك - مدعوين ${d.title}.xlsx`, [{ name: 'المدعوين', rows: [['الاسم', 'الجوال', 'الإيميل', 'الختم', 'الحالة', 'آخر نشاط'], ...d.guests.map((g) => [g.n, g.p, g.e, g.s, g.st, g.when])] }]); },
      log: d.log.map((l, i) => ({ key: i, ...l })),
      ...TOUR(this, STEPS),
    };
  }
}
