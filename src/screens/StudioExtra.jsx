'use client';
/** Studio panels that came after the design: analytics, prices and discounts, ready designs. */
import { useEffect, useState } from 'react';
import { api, saveXlsx } from '@/ui/kit';
import { dayMonth } from '@/lib/dates';

const C = { ink: '#EAF4F7', soft: '#B8CCD6', mute: '#9FB8C6', mark: '#1FA3BA', hover: '#86DCEA' };
const card = { borderRadius: 30, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' };
const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', padding: '12px 14px', borderRadius: 20, background: 'rgba(255,255,255,.07)' };
const main = { height: 46, padding: '0 24px', border: 0, borderRadius: 999, background: '#86DCEA', color: '#04121F', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer' };
const line = { height: 40, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(134,220,234,.4)', background: 'transparent', color: '#86DCEA', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' };
const chip = (on) => ({ height: 40, padding: '0 18px', borderRadius: 999, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', ...(on ? { border: 0, background: '#86DCEA', color: '#04121F', fontWeight: 700 } : { border: '1px solid rgba(255,255,255,.18)', background: 'transparent', color: C.ink }) });
const label = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: C.soft };
const num = (v) => Number(String(v).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g, '').slice(0, 6) || 0);
const fmt = (n) => n.toLocaleString('en-US');

function Toggle({ on, set, text }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
      <button type="button" className="tg" role="switch" aria-checked={on} aria-label={text} onClick={() => set(!on)} style={{ background: on ? '#0E97AE' : 'rgba(255,255,255,.2)' }}><span style={{ right: on ? 25 : 3 }} /></button>
      {text}
    </span>
  );
}

/* ---------- analytics ---------- */

const TITLES = { signups: 'حسابات جديدة', published: 'دعوات انرسلت', invited: 'مدعوين', opened: 'فتحوا الدعوة', replied: 'ردّوا', attended: 'سجّلوا حضور' };

/** One measure over time. The bar under the pointer (or the keyboard) shows its day and value. */
function Days({ labels, s }) {
  const [at, setAt] = useState(-1);
  const max = Math.max(1, ...s.values);
  const diff = s.total - s.before;
  const n = labels.length;
  return (
    <section style={{ ...card, padding: 20, gap: 8 }} aria-label={TITLES[s.key]}>
      <span style={{ fontSize: 14, color: C.soft }}>{TITLES[s.key]}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <b style={{ fontFamily: 'TD, serif', fontSize: 34, lineHeight: 1.1 }}>{fmt(s.total)}</b>
        <span style={{ fontSize: 13, color: C.mute }}>{s.before || s.total ? `${diff > 0 ? '▲' : diff < 0 ? '▼' : '='} ${fmt(Math.abs(diff))} عن الفترة قبلها` : 'ما فيه شي للحين'}</span>
      </span>
      <div style={{ position: 'relative' }} onPointerLeave={() => setAt(-1)}>
        <div role="img" aria-label={`${TITLES[s.key]}: ${fmt(s.total)}، أعلى يوم ${fmt(max === 1 && !s.total ? 0 : max)}`} style={{ display: 'flex', direction: 'ltr', alignItems: 'flex-end', gap: n > 40 ? 1 : 2, height: 72, borderBottom: '1px solid rgba(255,255,255,.18)' }}>
          {s.values.map((v, i) => (
            <span key={labels[i]} onPointerEnter={() => setAt(i)} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ display: 'block', width: '100%', maxWidth: 18, height: v ? `max(3px, ${(v / max) * 100}%)` : 0, borderRadius: '4px 4px 0 0', background: at === i ? C.hover : C.mark }} />
            </span>
          ))}
        </div>
        <span style={{ display: 'flex', justifyContent: 'space-between', direction: 'ltr', fontSize: 12, color: C.mute, paddingTop: 6 }}><span>{dayMonth(labels[0])}</span><span>{dayMonth(labels[n - 1])}</span></span>
        {at >= 0 ? (
          <span role="status" style={{ position: 'absolute', bottom: 'calc(100% - 4px)', left: `clamp(0px, calc(${((at + 0.5) / n) * 100}% - 60px), calc(100% - 120px))`, width: 120, boxSizing: 'border-box', textAlign: 'center', padding: '6px 10px', borderRadius: 12, background: '#FAFBFC', color: '#0A2A43', fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,.4)', pointerEvents: 'none' }}>
            <b style={{ fontSize: 15 }}>{fmt(s.values[at])}</b> · {dayMonth(labels[at])}
          </span>
        ) : null}
      </div>
    </section>
  );
}

function Bars({ title, note, rows, empty }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <section style={card}>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h3 style={{ margin: 0, fontSize: 19 }}>{title}</h3>
        {note ? <span style={{ fontSize: 13, color: C.mute }}>{note}</span> : null}
      </span>
      {rows.length ? (
        rows.map(([k, v, extra]) => (
          <span key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 14 }}><span>{k}</span><span style={{ color: C.soft }}><b style={{ color: C.ink }}>{fmt(v)}</b>{extra ? ` · ${extra}` : ''}</span></span>
            <span style={{ height: 10, borderRadius: 4, background: 'rgba(255,255,255,.08)', display: 'block' }}><span style={{ display: 'block', height: '100%', width: `${(v / max) * 100}%`, borderRadius: '4px 0 0 4px', background: C.mark }} /></span>
          </span>
        ))
      ) : (
        <span style={{ fontSize: 14, color: C.mute }}>{empty || 'ما فيه بيانات في هذي الفترة'}</span>
      )}
    </section>
  );
}

export function StudioAnalytics() {
  const [days, setDays] = useState(30);
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [table, setTable] = useState(false);
  useEffect(() => {
    let live = true;
    api.get(`/studio/analytics?days=${days}`).then((r) => { if (live) { setD(r); setErr(''); } }, (e) => live && setErr(e.message));
    return () => { live = false; };
  }, [days]);
  const total = (k) => d.series.find((s) => s.key === k).total;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const tiles = d ? [
    ['حسابات نشطة', fmt(d.active), 'دخلوا المنصة في الفترة'], ['نسبة الفتح', `${pct(total('opened'), total('invited'))}%`, 'من المدعوين في الفترة'], ['نسبة الرد', `${pct(total('replied'), total('invited'))}%`, 'من المدعوين في الفترة'], ['شهادات', fmt(d.certs), 'طلعت في الفترة'], ['طلبات تخصيص', fmt(d.requests), 'في الفترة'],
    ...(d.money ? [['الإيراد', `${fmt(d.money.paid)} ر.س`, `${fmt(d.money.orders)} طلب · ${fmt(d.money.beta)} بيتا`], ['خصومات', `${fmt(d.money.off)} ر.س`, 'على الطلبات المدفوعة']] : []),
  ] : [];
  const sheet = () => saveXlsx(`حياك - تحليلات ${days} يوم.xlsx`, [{ name: 'يومي', rows: [['اليوم', ...d.series.map((s) => TITLES[s.key])], ...d.labels.map((l, i) => [l, ...d.series.map((s) => String(s.values[i]))])] }]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {[[7, 'أسبوع'], [30, '30 يوم'], [90, '90 يوم']].map(([k, t]) => <button key={k} type="button" aria-pressed={days === k} onClick={() => setDays(k)} style={chip(days === k)}>{t}</button>)}
        <span style={{ flex: 1 }} />
        {d ? <><button type="button" style={line} aria-pressed={table} onClick={() => setTable(!table)}>{table ? 'الرسوم' : 'جدول'}</button><button type="button" style={line} onClick={sheet}>حمّل Excel</button></> : null}
      </div>
      {err ? <span role="alert" style={{ color: '#F2B8B8', fontWeight: 700 }}>{err}</span> : null}
      {!d ? <span style={{ color: C.mute }}>لحظة…</span> : (
        <>
          <div className="g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
            {tiles.map(([t, v, n]) => <section key={t} style={{ ...card, padding: 20, gap: 4 }}><span style={{ fontSize: 14, color: C.soft }}>{t}</span><b style={{ fontFamily: 'TD, serif', fontSize: 32, lineHeight: 1.15 }}>{v}</b><span style={{ fontSize: 12, color: C.mute }}>{n}</span></section>)}
          </div>
          {table ? (
            <section style={{ ...card, overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                <thead><tr>{['اليوم', ...d.series.map((s) => TITLES[s.key])].map((h) => <th key={h} scope="col" style={{ textAlign: 'right', padding: '8px 10px', color: C.mute, fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
                <tbody>{d.labels.map((l, i) => [l, i]).reverse().map(([l, i]) => <tr key={l} style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}><td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{dayMonth(l)}</td>{d.series.map((s) => <td key={s.key} style={{ padding: '8px 10px' }}>{fmt(s.values[i])}</td>)}</tr>)}</tbody>
              </table>
            </section>
          ) : (
            <div className="g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 14 }}>{d.series.map((s) => <Days key={s.key + days} labels={d.labels} s={s} />)}</div>
          )}
          <div className="split" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 18, alignItems: 'start' }}>
            <Bars title="من التسجيل للحضور" note="اللي سجّلوا في هذي الفترة، ووين وصلوا" rows={d.funnel.map(([k, v], i) => [k, v, i ? `${pct(v, d.funnel[0][1])}%` : ''])} />
            <Bars title="الأنماط الأكثر استخدام" rows={d.patterns.map((x) => [x.k, x.n])} />
            <Bars title="كيف تنرسل الدعوات" rows={d.audience.map((x) => [x.k, x.n])} />
            <Bars title="أكثر الحسابات استخدام" note="حسب عدد المدعوين" rows={d.top.map((x) => [x.k, x.n])} />
            {d.money ? <Bars title="أكواد الخصم" note="مرات الاستخدام من البداية" rows={d.codes.map((x) => [x.k, x.n])} empty="ما انستخدم أي كود" /> : null}
          </div>
          <span style={{ fontSize: 13, color: C.mute }}>الأرقام إجمالية وبتوقيت الرياض، وحسابات التجربة ما تنحسب</span>
        </>
      )}
    </div>
  );
}

/* ---------- prices, beta and discounts (founders) ---------- */

const CH = [['self', 'بنفسه'], ['email', 'إيميل'], ['whatsapp', 'واتساب']];

export function StudioPricing({ pricing, discounts, customers, run }) {
  const [p, setP] = useState(pricing);
  const [dirty, setDirty] = useState(false);
  const blank = { code: '', kind: 'percent', value: 10, maxUses: '', perOrg: 1, orgId: '', until: '', note: '' };
  const [n, setN] = useState(blank);
  const [open, setOpen] = useState(false);
  const edit = (o) => { setP({ ...p, ...o }); setDirty(true); };
  const pack = (i, o) => edit({ packs: p.packs.map((x, k) => (k === i ? { ...x, ...o } : x)) });
  const save = () => run(() => api.post('/studio/pricing', p), 'انحفظت الأسعار، وتطلع للكل الحين ✓').then((r) => r && setDirty(false));
  const add = () => run(() => api.post('/studio/discounts', { code: n.code, kind: n.kind, value: num(n.value), maxUses: n.maxUses ? num(n.maxUses) : null, perOrg: num(n.perOrg) || 1, orgId: n.orgId || null, expiresAt: n.until ? new Date(`${n.until}T23:59:59+03:00`).toISOString() : null, note: n.note }), 'انضاف الكود ✓').then((r) => { if (r) { setN(blank); setOpen(false); } });
  const beta = (o) => edit({ beta: { ...p.beta, ...o } });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <section className="in" style={card}>
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 19 }}>أكواد الخصم</h3>
            <span style={{ fontSize: 13, color: C.mute }}>كود 100% يخلي الطلب مجاني والرصيد ينزل على طول بدون تأكيد منكم. حددوا كم مرة ينستخدم ومتى ينتهي، أو خلّوه لحساب واحد</span>
          </span>
          <button type="button" style={main} onClick={() => setOpen(!open)}>+ كود جديد</button>
        </span>
        {open ? (
          <div style={{ ...row, alignItems: 'flex-end', background: 'rgba(134,220,234,.1)' }}>
            <label style={label}>الكود<input className="fld" value={n.code} onChange={(e) => setN({ ...n, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24) })} placeholder="BETA50" style={{ width: 160, direction: 'ltr' }} /></label>
            <span style={label}>النوع<span style={{ display: 'flex', gap: 8 }}><button type="button" style={chip(n.kind === 'percent')} onClick={() => setN({ ...n, kind: 'percent' })}>نسبة %</button><button type="button" style={chip(n.kind === 'amount')} onClick={() => setN({ ...n, kind: 'amount' })}>مبلغ ر.س</button></span></span>
            <label style={label}>القيمة<input className="fld" inputMode="numeric" value={n.value} onChange={(e) => setN({ ...n, value: num(e.target.value) })} style={{ width: 100 }} /></label>
            <label style={label}>كل المرات<input className="fld" inputMode="numeric" value={n.maxUses} onChange={(e) => setN({ ...n, maxUses: e.target.value ? num(e.target.value) : '' })} placeholder="بلا حد" style={{ width: 110 }} /></label>
            <label style={label}>لكل حساب<input className="fld" inputMode="numeric" value={n.perOrg} onChange={(e) => setN({ ...n, perOrg: num(e.target.value) })} style={{ width: 100 }} /></label>
            <label style={label}>ينتهي<input className="fld" type="date" value={n.until} onChange={(e) => setN({ ...n, until: e.target.value })} style={{ width: 170, colorScheme: 'dark' }} /></label>
            <label style={label}>لمين<select className="fld" value={n.orgId} onChange={(e) => setN({ ...n, orgId: e.target.value })} style={{ width: 190 }}><option value="">أي أحد</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.n}</option>)}</select></label>
            <label style={label}>ملاحظة لكم<input className="fld" value={n.note} onChange={(e) => setN({ ...n, note: e.target.value.slice(0, 120) })} style={{ width: 200 }} /></label>
            <button type="button" style={main} onClick={add}>أضف الكود</button>
          </div>
        ) : null}
        {discounts.map((c) => (
          <div key={c.id} style={{ ...row, opacity: c.active && !c.ended ? 1 : 0.6 }}>
            <b style={{ direction: 'ltr', fontSize: 16, minWidth: 110, textAlign: 'right' }}>{c.code}</b>
            <span style={{ fontSize: 14, color: C.ink }}>{c.off}</span>
            <span style={{ flex: '1 1 220px', fontSize: 13, color: C.mute }}>{[`انستخدم ${c.uses}${c.max ? ` من ${c.max}` : ''}`, `${c.perOrg} لكل حساب`, c.org && `لـ ${c.org}`, c.until && (c.ended ? 'انتهى' : `لين ${c.until}`), c.note].filter(Boolean).join(' · ')}</span>
            <Toggle on={c.active} set={(v) => run(() => api.patch(`/studio/discounts/${c.id}`, { active: v }), 'تم ✓')} text={c.active ? 'شغّال' : 'متوقف'} />
          </div>
        ))}
        {!discounts.length ? <span style={{ fontSize: 14, color: C.mute }}>ما فيه أكواد للحين</span> : null}
      </section>

      <section className="in" style={{ ...card, ...(p.beta.on ? { border: '1px solid rgba(134,220,234,.5)', background: 'rgba(134,220,234,.1)' } : {}) }}>
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 19 }}>رصيد مجاني مفتوح لأي أحد (بيتا)</h3>
            <span style={{ fontSize: 13, color: C.soft, lineHeight: 1.7 }}>لو شغّلتها، أي أحد يسجّل ياخذ رصيد مجاني من صفحة الشراء لين يوصل حده. خلّوها متوقفة لو تبون المجاني لناس محددين، وعطوهم كود خصم 100%</span>
          </span>
          <Toggle on={p.beta.on} set={(v) => beta({ on: v })} text={p.beta.on ? 'شغّالة' : 'متوقفة'} />
        </span>
        {p.beta.on ? (
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <label style={label}>حد كل حساب (دعوة)<input className="fld" inputMode="numeric" value={p.beta.quota} onChange={(e) => beta({ quota: num(e.target.value) })} style={{ width: 150 }} /></label>
            <span style={label}>مجاني لطرق الإرسال<span style={{ display: 'flex', gap: 8 }}>{CH.map(([k, t]) => { const on = p.beta.channels.includes(k); return <button key={k} type="button" aria-pressed={on} style={chip(on)} onClick={() => beta({ channels: on ? p.beta.channels.filter((x) => x !== k) : [...p.beta.channels, k] })}>{t}</button>; })}</span></span>
            <Toggle on={p.beta.services} set={(v) => beta({ services: v })} text="التخصيص مجاني بعد" />
          </div>
        ) : null}
        {p.beta.on && p.beta.channels.includes('whatsapp') ? <span style={{ fontSize: 13, color: '#F2DC9B' }}>انتبهوا: الواتساب ترسلونه بأيديكم، وكل حساب يقدر يطلب لين {fmt(p.beta.quota)} دعوة</span> : null}
      </section>

      <section className="in" style={card}>
        <h3 style={{ margin: 0, fontSize: 19 }}>حزم الرصيد</h3>
        <span style={{ fontSize: 13, color: C.mute }}>الأسعار بالريال. التعديل يطلع في صفحة الشراء والصفحة الرئيسية والمساعد على طول، والطلبات القديمة ما تتغير</span>
        {p.packs.map((x, i) => (
          <div key={i} style={row}>
            <label style={label}>عدد الدعوات<input className="fld" inputMode="numeric" value={x.count} onChange={(e) => pack(i, { count: num(e.target.value) })} style={{ width: 110 }} /></label>
            {CH.map(([k, t]) => <label key={k} style={label}>{t}<input className="fld" inputMode="numeric" value={x[k]} onChange={(e) => pack(i, { [k]: num(e.target.value) })} style={{ width: 100 }} /></label>)}
            <span style={{ flex: 1 }} />
            <Toggle on={x.on} set={(v) => pack(i, { on: v })} text={x.on ? 'معروضة' : 'مخفية'} />
            <button type="button" style={line} onClick={() => edit({ packs: p.packs.filter((_, k) => k !== i) })} aria-label={`احذف حزمة ${x.count}`}>حذف</button>
          </div>
        ))}
        <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <button type="button" style={line} onClick={() => edit({ packs: [...p.packs, { count: (Math.max(0, ...p.packs.map((x) => x.count)) || 0) + 100, self: 0, email: 0, whatsapp: 0, on: false }] })}>+ حزمة</button>
          <label style={label}>رصيد مجاني لكل حساب جديد<input className="fld" inputMode="numeric" value={p.free} onChange={(e) => edit({ free: num(e.target.value) })} style={{ width: 150 }} /></label>
          <span style={{ flex: 1 }} />
          {dirty ? <button type="button" style={line} onClick={() => { setP(pricing); setDirty(false); }}>تراجع</button> : null}
          <button type="button" style={{ ...main, opacity: dirty ? 1 : 0.5 }} disabled={!dirty} onClick={save}>احفظ الأسعار</button>
        </span>
      </section>
    </div>
  );
}

/* ---------- ready designs ---------- */

const KIND = { seal: 'ختم', colors: 'ألوان', loading: 'شاشة تحميل', pattern: 'نمط' };
const swatch = (x) => (x.kind === 'seal' ? [x.data.wax] : x.kind === 'loading' ? [x.data.bg] : [x.data.c1, x.data.c2, x.data.c3]);

export function StudioDesigns({ designs, founder, run, onNew, onPattern }) {
  return (
    <section className="in" style={card}>
      <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" style={main} onClick={onNew}>+ ختم أو ألوان أو شاشة تحميل</button>
        <button type="button" style={line} onClick={onPattern}>+ نمط حركة</button>
      </span>
      {designs.map((x) => (
        <div key={x.id} style={{ ...row, opacity: x.on ? 1 : 0.6 }}>
          <span style={{ display: 'flex', gap: 4 }}>{swatch(x).filter((c) => /^#[0-9a-f]{6}$/i.test(c || '')).map((c, i) => <span key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,.2)' }} />)}</span>
          <span style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 15 }}>{x.name}</b><span style={{ fontSize: 13, color: C.mute }}>{[KIND[x.kind], x.org ? `خاص بـ ${x.org}` : 'عام للكل', x.when].join(' · ')}</span></span>
          {founder || x.org ? <Toggle on={x.on} set={(v) => run(() => api.patch(`/studio/designs/${x.id}`, { on: v }), v ? 'ظاهر ✓' : 'انخفى. الدعوات اللي تستخدمه ما تتأثر ✓')} text={x.on ? 'ظاهر' : 'مخفي'} /> : null}
        </div>
      ))}
      {!designs.length ? <span style={{ fontSize: 14, color: C.mute }}>ما فيه تصاميم خاصة للحين</span> : null}
    </section>
  );
}

/* ---------- the brand typeface (founders) ---------- */

export function StudioType({ run }) {
  const [t, setT] = useState(null);
  const [sure, setSure] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    api.get('/studio/type').then((r) => live && setT(r), () => {});
    return () => { live = false; };
  }, []);
  const send = async (files) => {
    if (!files.length) return;
    const f = new FormData();
    for (const x of files) f.append('file', x);
    setBusy(true);
    const r = await run(() => api.form('/studio/type', f), 'انحفظ الخط، ويطلع في الموقع خلال دقايق ✓');
    if (r) setT(r);
    setBusy(false);
  };
  const drop = async () => {
    if (!sure) return setSure(true);
    const r = await run(() => api.del('/studio/type'), 'رجع الخط البديل ✓');
    if (r) setT(r);
    setSure(false);
  };
  return (
    <section className="in" style={{ ...card, marginTop: 18 }}>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ margin: 0, fontSize: 19 }}>خط الهوية</h3>
        <span style={{ fontSize: 13, color: C.mute, lineHeight: 1.7 }}>خط ثمانية. اختاروا الملفات الأربعة مع بعض وبأسمائها الأصلية: {(t?.need || []).join('، ')}. تنحفظ عندكم فقط، وما تطلع للزوار كملفات خط</span>
      </span>
      <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ ...main, display: 'inline-flex', alignItems: 'center', position: 'relative', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'لحظة…' : t?.on ? 'بدّل الملفات' : 'ارفع الملفات'}
          <input type="file" multiple accept=".woff2,.otf" disabled={busy} onChange={(e) => { send([...e.target.files]); e.target.value = ''; }} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer' }} />
        </label>
        {t?.on ? <button type="button" style={line} onClick={drop}>{sure ? 'أكيد؟ اضغط مرة ثانية' : 'شيل الخط'}</button> : null}
        <span role="status" style={{ fontSize: 14, color: C.soft }}>{!t ? '' : t.on ? `مرفوع ✓ ${Math.round(t.size / 1024)} كيلوبايت` : 'ما انرفع للحين، والموقع يستخدم خط بديل'}</span>
      </span>
    </section>
  );
}
