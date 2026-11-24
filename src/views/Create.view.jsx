import { S, txt, A } from '@/ui/dc';
import Invite from '@/screens/Invite';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:#086577}
input,button,select,textarea{font-family:'IBM Plex Sans Arabic',sans-serif}
.glass{background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(26px) saturate(1.4);backdrop-filter:blur(26px) saturate(1.4);border:1px solid rgba(255,255,255,.85);box-shadow:0 24px 60px rgba(10,42,67,.08),inset 0 1px 0 rgba(255,255,255,.9)}
.nav{transition:background .2s ease}.nav:hover{background:rgba(14,151,174,.08)}
.fld{height:48px;border-radius:14px;border:1px solid #CFD9DF;background:#FFFFFF;color:#0A2A43;padding:0 14px;font-size:15px;box-sizing:border-box;width:100%}
.fld:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
.tile{transition:transform .2s ease,box-shadow .2s ease}.tile:hover{transform:translateY(-2px)}
.in{animation:rise .4s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes up{from{transform:translateY(100%)}to{transform:none}}
@keyframes scan{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
.bnav,.pvbtn{display:none}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (min-width: 901px) and (max-width: 1180px){.side{flex-basis:76px !important;padding:20px 10px !important}.side .lbl{display:none !important}.side .nav{justify-content:center;padding:0 !important}.pat{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.body{grid-template-columns:minmax(0,1fr) 300px !important}.pvwrap{transform:scale(.7) !important}.pvbox{width:273px !important;height:591px !important}}
@media (max-width: 760px){.f3{grid-template-columns:minmax(0,1fr) !important}}
@media (max-width: 520px){.pgd{flex-direction:column;align-items:flex-start !important}}
@media (max-width: 900px){
 .side{display:none !important}.bnav{display:flex !important}.hidem-m{display:none !important}
 .pg{padding:12px 12px 100px !important}.mn{padding:4px 2px 20px !important;gap:16px !important}
 .body{grid-template-columns:minmax(0,1fr) !important}.pvcol{display:none !important}
 .pat{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.f2{grid-template-columns:minmax(0,1fr) !important}
 .steps .slbl{display:none !important}.h1m{font-size:30px !important}.card{padding:16px !important;border-radius:24px !important}
 .seals{grid-template-columns:repeat(4,minmax(0,1fr)) !important}.tblx .hidem{display:none !important}.tblx > div{grid-template-columns:minmax(0,1fr) 80px !important}
}
.tw{animation:twk 2s ease-in-out infinite}.sw{animation:swp 2.4s ease-in-out infinite}.fw{transform-box:fill-box;transform-origin:center;animation:fwp 2.4s ease-out infinite}.mt{animation:mtr 2.2s linear infinite}@keyframes twk{50%{opacity:.2}}@keyframes swp{to{transform:skewX(-20deg) translateX(240px)}}@keyframes fwp{0%{opacity:.35;transform:scale(.55)}40%{opacity:1;transform:scale(1)}100%{opacity:.35;transform:scale(1.12)}}@keyframes mtr{0%{transform:translate(-40px,-20px);opacity:0}30%{opacity:1}100%{transform:translate(60px,30px);opacity:0}}
@media (max-width: 760px){.gm4{grid-template-columns:repeat(2,minmax(0,1fr)) !important}}
h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
.tourb{height:48px;padding:0 18px;border-radius:999px;border:1px solid rgba(14,151,174,.3);background:rgba(230,246,249,.8);color:#086577;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.tspot{position:fixed;z-index:90;border-radius:28px;box-shadow:0 0 0 9999px rgba(4,18,31,.6),0 0 0 4px #86DCEA;pointer-events:none;transition:all .45s cubic-bezier(.2,.8,.2,1)}
.ttip{position:fixed;z-index:91;box-sizing:border-box;border-radius:26px;background:#FAFBFC;padding:18px 20px;display:flex;flex-direction:column;gap:10px;color:#0A2A43;box-shadow:0 30px 70px rgba(0,0,0,.35);transition:top .45s cubic-bezier(.2,.8,.2,1),left .45s cubic-bezier(.2,.8,.2,1);animation:tIn .4s ease-out both}
@keyframes tIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
@media (max-width: 599px){.tourb{height:42px;padding:0 14px;font-size:13px}}
h2,h3{font-family:TS,'IBM Plex Sans Arabic',sans-serif;font-weight:700}`;

export default function CreateView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ minHeight: "1300px", position: "relative", fontFamily: "'IBM Plex Sans Arabic', TS, sans-serif", color: "#0A2A43", background: "radial-gradient(55% 40% at 88% 4%, #CBEFF5 0%, rgba(203,239,245,0) 70%), #EDF1F3" }}>
        {" "}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="cWax" cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#4CC7DA" />
              <stop offset="55%" stopColor="#0E97AE" />
              <stop offset="100%" stopColor="#086577" />
            </radialGradient>
          </defs>
        </svg>
        {" "}
        <div className="pg" style={{ display: "flex", gap: "24px", padding: "20px", boxSizing: "border-box", minHeight: "1300px" }}>
          <nav aria-label="التنقل الرئيسي" className="glass side" style={{ flex: "0 0 250px", boxSizing: "border-box", padding: "24px 16px", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "22px", alignSelf: "flex-start", position: "sticky", top: "20px", minHeight: "860px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "0 6px" }}>
              <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cWax)" />
                <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
              </svg>
              <span className="lbl" style={{ fontFamily: "TD, serif", fontSize: "26px", lineHeight: "1" }}>حيّــاك</span>
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {(v.nav || []).map((n, $i0) => (
                <A key={n?.key ?? $i0} href={n?.href} className="nav" style={S(`${txt(n?.st)}`)}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n?.ic} /></svg>
                    <span className="lbl">{n?.label}</span>
                  </A>
              ))}
            </div>
            <div className="lbl" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px", padding: "14px", borderRadius: "20px", background: "rgba(255,255,255,.65)" }}>
              <b style={{ fontSize: "13px" }}>رصيدك</b>
              <span style={{ height: "6px", borderRadius: "6px", background: "rgba(14,151,174,.14)", overflow: "hidden", display: "block" }}>
                <span style={S(`display: block; width: ${txt(v.side?.pct)}; height: 100%; background: linear-gradient(90deg,#0E97AE,#86DCEA);`)} />
              </span>
              <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.side?.credit}</span>
            </div>
          </nav>
          <nav aria-label="التنقل" className="bnav glass" style={{ position: "fixed", left: "12px", right: "12px", bottom: "12px", zIndex: "20", height: "66px", borderRadius: "24px", padding: "0 10px", alignItems: "center", gap: "10px" }}>
            {" "}
            <button type="button" onClick={v.prev} style={{ height: "48px", padding: "0 18px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.2)", background: "transparent", color: "#0A2A43", fontSize: "14px", cursor: "pointer" }}>السابق</button>
            {" "}
            <button type="button" onClick={v.togglePv} style={{ flex: "1", height: "48px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.2)", background: "#FFFFFF", color: "#0A2A43", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>المعاينة</button>
            {" "}
            <button type="button" onClick={v.next} disabled={v.busy} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "0", background: "#0E97AE", color: "#FFFFFF", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>{v.nextLabel}</button>
            {" "}
          </nav>
          <main className="mn" style={{ flex: "1 1 auto", minWidth: "0", boxSizing: "border-box", padding: "20px 10px 40px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="tourb" onClick={v.startTour}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.6M12 17h.01" /></svg>
                دلّني
              </button>
            </div>
            <header data-t="t0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <A href="Dashboard.dc.html" style={{ fontSize: "13px", textDecoration: "none" }}>→ الدعوات</A>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.2" }}>دعوة جديدة</h1>
              </div>
              <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.saveState}</span>
            </header>
            <ol data-t="t1" className="steps" style={{ listStyle: "none", margin: "0", padding: "6px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "6px", borderRadius: "999px", background: "rgba(255,255,255,.65)", border: "1px solid rgba(255,255,255,.9)" }}>
              {(v.steps || []).map((t, $i1) => (
                <li key={t?.key ?? $i1}>
                    <button type="button" onClick={t?.go} style={S(`${txt(t?.st)}`)}><span style={S(`${txt(t?.num)}`)}>{t?.n}</span><span className="slbl">{t?.label}</span></button>
                  </li>
              ))}
            </ol>
            {v.done ? (
              <div className="in glass card" style={{ borderRadius: "30px", padding: "40px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                  <span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </span>
                  <h2 style={{ margin: "0", fontFamily: "TD, serif", fontSize: "32px" }}>{v.doneTitle}</h2>
                  <span style={{ fontSize: "14px", color: "#3A4B58", lineHeight: "1.8", maxWidth: "460px" }}>{v.doneSub}</span>
                  <span style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    <A href={v.doneHref} style={{ height: "46px", padding: "0 20px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>تابع الردود</A>
                    <button type="button" onClick={v.restart} style={{ height: "46px", padding: "0 20px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.2)", background: "transparent", color: "#0A2A43", fontSize: "14px", cursor: "pointer" }}>دعوة ثانية</button>
                  </span>
                </div>
            ) : null}
            {v.notDone ? (
              <div className="body" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: "22px", alignItems: "start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: "0" }}>
                    {v.s0 ? (
                      <><section data-t="ts0" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <h2 style={{ margin: "0", fontSize: "18px" }}>النمط</h2>
                            <span style={{ fontSize: "13px", color: "#4A5B68" }}>الحركة اللي تشتغل ورا الدعوة</span>
                          </span>
                          <div className="pat" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
                            {(v.pats || []).map((p, $i2) => (
                              <button key={p?.key ?? $i2} type="button" className="tile" onClick={p?.pick} aria-pressed={p?.on} style={S(`${txt(p?.st)}`)}>
                                  <span style={S(`${txt(p?.bg)}`)}>
                                    <span style={{ position: "absolute", left: "50%", top: "0", width: "390px", height: "844px", marginLeft: "-195px", transform: "translateY(-58px) scale(.42)", transformOrigin: "50% 0", pointerEvents: "none" }}><Invite look={p?.look} pattern={p?.n} seal={p?.seal} title={p?.tt} latin="" thumb="نعم" /></span>
                                    {p?.photo ? (
                                      <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                                            <rect x="3" y="4" width="18" height="16" rx="3" />
                                            <circle cx="9" cy="10" r="2" />
                                            <path d="M3 17l5-5 4 4 3-3 6 6" />
                                          </svg>
                                        </span>
                                    ) : null}
                                    {p?.tap ? (
                                      <span style={{ position: "absolute", top: "8px", left: "8px", fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "999px", background: "rgba(255,255,255,.85)", color: "#0A2A43" }}>تفاعلي</span>
                                    ) : null}
                                  </span>
                                  <span style={{ display: "flex", flexDirection: "column", gap: "1px", padding: "8px 4px 2px", textAlign: "right" }}><b style={{ fontSize: "14px" }}>{p?.n}</b><span style={{ fontSize: "11px", color: "#4A5B68" }}>{p?.d}</span></span>
                                </button>
                            ))}
                          </div>
                        </section>
                      {v.isPhoto ? (
                          <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <h2 style={{ margin: "0", fontSize: "18px" }}>صورة الخلفية</h2>
                                <span style={{ fontSize: "13px", color: "#4A5B68" }}>ارفع صورة من عندك وتصير خلفية الدعوة. متاحة للكل</span>
                              </span>
                              <label style={{ border: "2px dashed #9FC9D2", borderRadius: "22px", background: "rgba(230,246,249,.6)", padding: "22px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", cursor: "pointer", color: "#0A2A43" }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                                  <rect x="3" y="4" width="18" height="16" rx="3" />
                                  <circle cx="9" cy="10" r="2" />
                                  <path d="M3 17l5-5 4 4 3-3 6 6" />
                                </svg>
                                <span style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "right" }}>
                                  <b style={{ fontSize: "15px" }}>{v.photoLabel}</b>
                                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>{"JPG أو PNG · الأفضل بالطول "}<bdi dir="ltr">1080×1920</bdi></span>
                                </span>
                                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={v.pickPhoto} style={{ display: "none" }} />
                              </label>
                              <div className="pgd" style={{ display: "flex", gap: "16px", alignItems: "center", padding: "14px", borderRadius: "22px", background: "rgba(255,255,255,.7)", border: "1px solid #DCE4E8" }}>
                                <span aria-hidden="true" style={{ position: "relative", width: "76px", height: "156px", flex: "none", borderRadius: "16px", overflow: "hidden", background: "linear-gradient(180deg, #2E5A78, #C98A5E 60%, #3A2A2A)", boxShadow: "0 0 0 3px #0A2A43" }}>
                                  <span style={{ position: "absolute", left: "0", right: "0", top: "0", height: "38%", borderBottom: "1.5px dashed rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "10px", fontWeight: "700", textAlign: "center", lineHeight: "1.3" }}>يبان<br />هنا</span>
                                  <span style={{ position: "absolute", left: "6px", right: "6px", bottom: "6px", top: "44%", borderRadius: "10px", background: "rgba(250,251,252,.94)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A5B68", fontSize: "9px", fontWeight: "700", textAlign: "center", lineHeight: "1.4" }}>بطاقة<br />التفاصيل</span>
                                </span>
                                <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  <b style={{ fontSize: "14px" }}>الصورة تغطي الدعوة كاملة، فخلها واضحة</b>
                                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3A4B58", lineHeight: "1.6" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    صورة بالطول (
                                    <bdi dir="ltr">9:16</bdi>
                                    {")، مقاسها "}
                                    <bdi dir="ltr">1080×1920</bdi>
                                    {" أو أكبر"}
                                  </span>
                                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3A4B58", lineHeight: "1.6" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    الجزء المهم يكون في الثلث الفوق، لأن بطاقة التفاصيل تغطي الباقي
                                  </span>
                                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3A4B58", lineHeight: "1.6" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    ألوان هادية أو غامقة عشان العنوان يبان فوقها
                                  </span>
                                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#3A4B58", lineHeight: "1.6" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    بدون كلام أو شعارات في الصورة، العنوان نكتبه لك
                                  </span>
                                </span>
                              </div>
                              {v.hasPhoto ? (
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "13px", fontWeight: "700", alignSelf: "flex-start" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    {v.photoMsg}
                                  </span>
                              ) : null}
                            </section>
                        ) : null}
                      {v.notPhoto ? (
                          <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <h2 style={{ margin: "0", fontSize: "18px" }}>اللون</h2>
                                <span style={{ fontSize: "13px", color: "#4A5B68" }}>{"ألوان "}{v.patName}{" الثلاثة"}</span>
                              </span>
                              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                {(v.cols || []).map((c, $i3) => (
                                  <button key={c?.key ?? $i3} type="button" onClick={c?.pick} aria-pressed={c?.on} style={S(`${txt(c?.st)}`)}><span style={S(`${txt(c?.sw)}`)} /><b style={{ fontSize: "13px" }}>{c?.n}</b></button>
                                ))}
                              </div>
                            </section>
                        ) : null}
                      <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <h2 style={{ margin: "0", fontSize: "18px" }}>الختم</h2>
                            <span style={{ fontSize: "13px", color: "#4A5B68" }}>الختم الافتراضي. تقدر تحدد ختم مختلف لكل مدعو في ملف Excel</span>
                          </span>
                          <div className="seals" style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "10px" }}>
                            {(v.seals || []).map((g, $i4) => (
                              <button key={g?.key ?? $i4} type="button" onClick={g?.pick} aria-pressed={g?.on} style={S(`${txt(g?.st)}`)}>
                                  <span style={{ position: "relative", width: "52px", height: "52px" }}>
                                    <svg width="52" height="52" viewBox="0 0 100 100" aria-hidden="true">
                                      <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                                      <path d={v.wax} fill={g?.hex} />
                                      <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="2.4" />
                                    </svg>
                                    <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, serif", fontSize: "12px", color: "#FFFFFF" }}>{g?.n}</span>
                                    {g?.lock ? (
                                      <span style={{ position: "absolute", left: "-4px", top: "-4px", width: "22px", height: "22px", borderRadius: "50%", background: "#0A2A43", border: "2px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(10,42,67,.3)" }}>
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
                                        </span>
                                    ) : null}
                                  </span>
                                  <span style={{ fontSize: "11px", color: "#4A5B68" }}>{g?.sub}</span>
                                </button>
                            ))}
                          </div>
                        </section>
                      <button type="button" onClick={v.openCust} className="in" style={{ textAlign: "right", border: "1px dashed rgba(10,42,67,.3)", borderRadius: "24px", background: "rgba(255,255,255,.5)", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", color: "#0A2A43" }}>
                          <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#0A2A43", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" /></svg>
                          </span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <b style={{ fontSize: "15px" }}>ما لقيت اللي تبيه؟</b>
                            <span style={{ fontSize: "13px", color: "#3A4B58" }}>ألوانكم، ختم باسمكم، شاشة تحميل بشعاركم أو حركة جديدة. اطلب تخصيص</span>
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#086577" }}>اطلب ←</span>
                        </button></>
                    ) : null}
                    {v.s1 ? (
                      <><section data-t="ts1" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>عن المناسبة</h2>
                          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                            العنوان الكبير
                            <input className="fld" value={v.title ?? ''} onChange={v.onTitle} placeholder="مثال: الحفل الختامي" />
                          </label>
                          <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                              {"العنوان بالإنجليزي "}
                              <span style={{ fontSize: "11px", color: "#4A5B68", fontWeight: "400" }}>اختياري</span>
                              <input className="fld" value={v.latin ?? ''} onChange={v.onLatin} placeholder="CLOSING CEREMONY" style={{ direction: "ltr", textAlign: "right" }} />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                              {"اسم الفعالية "}
                              <span style={{ fontSize: "11px", color: "#4A5B68", fontWeight: "400" }}>اختياري · يطلع صغير فوق العنوان</span>
                              <input className="fld" value={v.evl ?? ''} onChange={v.onEvl} placeholder="مثال: أسبوع الكيمياء العربي" />
                            </label>
                          </div>
                          <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>التاريخ<input className="fld" type="date" value={v.date ?? ''} onChange={v.onDate} min={v.today} /></label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>الوقت<input className="fld" type="time" value={v.clock ?? ''} onChange={v.onClock} /></label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                              المدة
                              <select className="fld" value={v.dur ?? ''} onChange={v.onDur}>
                                {(v.durs || []).map((o, $i5) => (
                                  <option key={o?.key ?? $i5} value={o?.v}>{o?.n}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </section>
                      <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>المكان</h2>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {(v.placeOpts || []).map((o, $i6) => (
                              <button key={o?.key ?? $i6} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}>{o?.n}</button>
                            ))}
                          </div>
                          {v.isIn ? (
                            <><div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                                  اسم المكان
                                  <input className="fld" value={v.placeName ?? ''} onChange={v.onPlaceName} placeholder="مثال: قاعة الملك فيصل" />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                                  {"الحي والمدينة "}
                                  <input className="fld" value={v.placeArea ?? ''} onChange={v.onPlaceArea} placeholder="مثال: العزيزية، مكة" />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500", gridColumn: "1 / -1" }}>
                                  رابط الموقع من الخرائط
                                  <input className="fld" value={v.mapUrl ?? ''} onChange={v.onMap} placeholder="https://maps.app.goo.gl/..." style={{ direction: "ltr", textAlign: "right" }} />
                                </label>
                              </div>
                            <span style={S(`display: flex; align-items: center; gap: 8px; font-size: 12px; color: ${txt(v.qrCol)};`)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3z" /></svg>
                                {v.qrMsg}
                              </span></>
                          ) : null}
                          {v.isOn ? (
                            <><div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                                  المنصة
                                  <select className="fld" value={v.plat ?? ''} onChange={v.onPlat}>
                                    <option>Zoom</option>
                                    <option>Google Meet</option>
                                    <option>Microsoft Teams</option>
                                    <option>YouTube Live</option>
                                  </select>
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                                  رابط البث
                                  <input className="fld" value={v.liveUrl ?? ''} onChange={v.onLive} placeholder="اتركه فاضي لو ما جهز" style={{ direction: "ltr", textAlign: "right" }} />
                                </label>
                              </div>
                            <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>{v.liveMsg}</span></>
                          ) : null}
                        </section>
                      <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>نوع الدعوة</h2>
                          <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                            {(v.audOpts || []).map((o, $i7) => (
                              <button key={o?.key ?? $i7} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}>
                                  <b style={{ fontSize: "15px" }}>{o?.n}</b>
                                  <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>{o?.d}</span>
                                </button>
                            ))}
                          </div>
                        </section></>
                    ) : null}
                    {v.s2 ? (
                      <>{v.personal ? (
                          <section data-t="ts2" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <h2 style={{ margin: "0", fontSize: "18px" }}>المدعوين</h2>
                                  <span style={{ fontSize: "13px", color: "#4A5B68" }}>اسم كل مدعو ورقم جواله أو بريده</span>
                                </span>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px" }} className="gm4">
                                {(v.gms || []).map((m, $i8) => (
                                  <button key={m?.key ?? $i8} type="button" onClick={m?.pick} style={S(`${txt(m?.st)}`)}><b style={{ fontSize: "14px" }}>{m?.n}</b><span style={{ fontSize: "11px", opacity: ".75" }}>{m?.d}</span></button>
                                ))}
                              </div>
                              {v.gmFile ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px", borderRadius: "22px", background: "rgba(255,255,255,.75)", border: "1px solid #DCE4E8" }}>
                                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                                      <span style={{ flex: "1 1 150px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <b style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0A2A43", color: "#FFFFFF", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{"1"}</b>
                                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                          <b style={{ fontSize: "14px" }}>حمّل القالب</b>
                                          <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>ملف Excel جاهز بالأعمدة</span>
                                        </span>
                                      </span>
                                      <span style={{ flex: "1 1 150px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <b style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0A2A43", color: "#FFFFFF", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{"2"}</b>
                                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                          <b style={{ fontSize: "14px" }}>عبّي الأسماء</b>
                                          <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>الاسم، طريقة التواصل، الرقم أو الإيميل، الختم، والملاحظات</span>
                                        </span>
                                      </span>
                                      <span style={{ flex: "1 1 150px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <b style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0A2A43", color: "#FFFFFF", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{"3"}</b>
                                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                          <b style={{ fontSize: "14px" }}>ارفعه هنا</b>
                                          <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>وتتجهز الدعوات تلقائيًا</span>
                                        </span>
                                      </span>
                                    </div>
                                    <button type="button" onClick={v.dlTpl} style={{ alignSelf: "flex-start", height: "44px", padding: "0 20px", borderRadius: "999px", border: "1px solid #0A2A43", background: "#FFFFFF", color: "#0A2A43", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D6F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                                      حمّل قالب الأسماء (Excel)
                                    </button>
                                  </div>
                              ) : null}
                              {v.showUp ? (
                                <label style={{ border: "2px dashed #9FC9D2", borderRadius: "24px", background: "rgba(230,246,249,.6)", padding: "34px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", color: "#0A2A43" }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                                      <path d="M14 3v5h5M9 13l3-3 3 3M12 10v7" />
                                    </svg>
                                    <b style={{ fontSize: "16px" }}>اسحب الملف هنا أو اضغط للاختيار</b>
                                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>استخدم قالب حيّــاك عشان الأسماء تنزل صح</span>
                                    <input type="file" accept=".xlsx,.xls,.csv" onChange={v.upload} style={{ display: "none" }} />
                                  </label>
                              ) : null}
                              {v.parsing ? (
                                <div style={{ position: "relative", overflow: "hidden", borderRadius: "20px", background: "#FFFFFF", padding: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg, rgba(134,220,234,0), rgba(134,220,234,.35), rgba(134,220,234,0))", animation: "scan 1.2s linear infinite" }} />
                                    <b style={{ position: "relative", fontSize: "14px" }}>{"نقرأ "}{v.fileName}{"…"}</b>
                                  </div>
                              ) : null}
                              {v.hasFile ? (
                                <><span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "20px", background: "#E6F6F9", color: "#086577", fontSize: "14px", fontWeight: "700" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    {v.fileMsg}
                                  </span>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {(v.stats || []).map((k, $i9) => (
                                      <span key={k?.key ?? $i9} style={S(`${txt(k?.st)}`)}><b>{k?.v}</b>{" "}{k?.l}</span>
                                    ))}
                                  </div>
                                <div className="tblx" style={{ display: "flex", flexDirection: "column", gap: "4px", borderRadius: "20px", background: "#FFFFFF", padding: "8px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr) minmax(0,1.3fr) 80px", gap: "10px", padding: "8px 10px", fontSize: "12px", color: "#4A5B68" }}>
                                      <span>الاسم</span>
                                      <span className="hidem">الجوال</span>
                                      <span className="hidem">الإيميل</span>
                                      <span>الختم</span>
                                    </div>
                                    {(v.guests || []).map((r, $i10) => (
                                      <div key={r?.key ?? $i10} style={S(`${txt(r?.st)}`)}>
                                          <span style={{ display: "flex", flexDirection: "column" }}><b style={{ fontSize: "13px" }}>{r?.n}</b><span style={{ fontSize: "11px", color: "#4A5B68" }}>{r?.o}</span></span>
                                          {r?.bad ? (
                                            <span style={{ display: "contents" }}>
                                                <input className="fld" value={r?.p ?? ''} onChange={r?.onP} placeholder="الجوال" aria-label={`جوال ${txt(r?.n)}`} style={{ height: "36px", fontSize: "12px", padding: "0 10px", direction: "ltr" }} />
                                                <input className="fld" value={r?.e ?? ''} onChange={r?.onE} placeholder="الإيميل" aria-label={`إيميل ${txt(r?.n)}`} style={{ height: "36px", fontSize: "12px", padding: "0 10px", direction: "ltr" }} />
                                              </span>
                                          ) : null}
                                          {r?.good ? (
                                            <span style={{ display: "contents" }}>
                                                <span className="hidem" style={{ fontSize: "12px", direction: "ltr", textAlign: "right", color: "#3A4B58", overflow: "hidden", textOverflow: "ellipsis" }}>{r?.p}</span>
                                                <span className="hidem" style={{ fontSize: "12px", direction: "ltr", textAlign: "right", color: "#3A4B58", overflow: "hidden", textOverflow: "ellipsis" }}>{r?.e}</span>
                                              </span>
                                          ) : null}
                                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}><span style={S(`width: 10px; height: 10px; border-radius: 50%; background: ${txt(r?.sc)};`)} />{r?.s}</span>
                                        </div>
                                    ))}
                                    <span style={{ padding: "8px 10px", fontSize: "12px", color: "#4A5B68" }}>{v.moreRows}</span>
                                  </div>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {v.hasBad ? (
                                      <button type="button" onClick={v.fix} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "0", background: "#0A2A43", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>{v.fixLabel}</button>
                                    ) : null}
                                    <button type="button" onClick={v.reupload} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.2)", background: "transparent", color: "#0A2A43", fontSize: "13px", cursor: "pointer" }}>ملف ثاني</button>
                                  </div></>
                              ) : null}
                              {v.gmPaste ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <textarea value={v.pt ?? ''} onChange={v.onPt} placeholder={"سارة أحمد، 0551234567\nفهد العتيبي، fahad@example.com\nكل سطر: الاسم ثم رقم الجوال أو الإيميل"} aria-label="الصق الأسماء" style={{ minHeight: "130px", borderRadius: "22px", border: "1px solid #DCE4E8", background: "#FFFFFF", padding: "14px 18px", fontSize: "14px", lineHeight: "1.9", fontFamily: "inherit", color: "#0A2A43", resize: "vertical" }} />
                                    <span style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                      <button type="button" onClick={v.parsePt} style={{ height: "42px", padding: "0 20px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>أضفهم</button>
                                      <span style={{ fontSize: "12px", color: "#4A5B68" }}>تقدر تنسخ القائمة من واتساب أو الملاحظات أو أي مكان</span>
                                    </span>
                                  </div>
                              ) : null}
                              {v.gmContacts ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "24px 16px", borderRadius: "24px", background: "rgba(230,246,249,.6)", textAlign: "center" }}>
                                    <b style={{ fontSize: "15px" }}>اختر من جهات الاتصال في جوالك</b>
                                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>نجيب الاسم والرقم بس، وما نحفظ باقي جهاتك</span>
                                    <button type="button" onClick={v.pickContacts} style={{ height: "44px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>افتح جهات الاتصال</button>
                                  </div>
                              ) : null}
                              {v.guestErr ? (
                                <span role="alert" style={{ fontSize: "13px", fontWeight: "700", color: "#9A5226" }}>{v.guestErr}</span>
                              ) : null}
                              {v.hasMan ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderRadius: "20px", background: "#FFFFFF", padding: "8px" }}>
                                    <span style={{ padding: "6px 10px", fontSize: "12px", color: "#4A5B68" }}>{"المدعوين المضافين · "}{v.manN}</span>
                                    {(v.man || []).map((r, $i11) => (
                                      <div key={r?.key ?? $i11} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "12px" }}>
                                          <span style={{ flex: "1", display: "flex", flexDirection: "column", minWidth: "0" }}>
                                            <b style={{ fontSize: "13px" }}>{r?.n}</b>
                                            <span style={{ fontSize: "11px", color: "#4A5B68", direction: "ltr", textAlign: "right" }}>{r?.c}</span>
                                          </span>
                                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}><span style={S(`width: 10px; height: 10px; border-radius: 50%; background: ${txt(r?.sc)};`)} />{r?.s}</span>
                                          <button type="button" onClick={r?.del} aria-label="حذف" style={{ width: "30px", height: "30px", border: "0", borderRadius: "50%", background: "#EDF1F3", color: "#0A2A43", cursor: "pointer" }}>{"✕"}</button>
                                        </div>
                                    ))}
                                  </div>
                              ) : null}
                              {v.adding ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "20px", background: "#FFFFFF", border: "1px solid #DCE4E8" }}>
                                    <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                                      <input className="fld" value={v.mn ?? ''} onChange={v.onMn} placeholder="الاسم" />
                                      <select className="fld" onChange={v.onMs}>
                                        {(v.sealOpts || []).map((o, $i12) => (
                                          <option key={o?.key ?? $i12}>{o}</option>
                                        ))}
                                      </select>
                                      <input className="fld" type="tel" value={v.mp ?? ''} onChange={v.onMp} placeholder="رقم الجوال" style={{ direction: "ltr", textAlign: "right" }} />
                                      <input className="fld" type="email" value={v.me ?? ''} onChange={v.onMe} placeholder="الإيميل" style={{ direction: "ltr", textAlign: "right" }} />
                                    </div>
                                    {v.addErr ? (
                                      <span style={{ fontSize: "12px", color: "#9A5226" }}>اكتب الاسم ورقم الجوال أو البريد</span>
                                    ) : null}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                      <button type="button" onClick={v.addGuest} style={{ height: "42px", padding: "0 18px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>أضف</button>
                                      <button type="button" onClick={v.cancelAdd} style={{ height: "42px", padding: "0 16px", border: "1px solid rgba(10,42,67,.2)", borderRadius: "999px", background: "transparent", color: "#0A2A43", fontSize: "13px", cursor: "pointer" }}>إلغاء</button>
                                    </div>
                                  </div>
                              ) : null}
                              {v.notAdding ? (
                                <button type="button" onClick={v.startAdd} style={{ alignSelf: "flex-start", height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px dashed rgba(10,42,67,.3)", background: "transparent", color: "#0A2A43", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>+ أضف مدعو يدوي</button>
                              ) : null}
                            </section>
                        ) : null}
                      {v.general ? (
                          <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <h2 style={{ margin: "0", fontSize: "18px" }}>الدعوة العامة</h2>
                                <span style={{ fontSize: "13px", color: "#4A5B68" }}>رابط واحد تنشره، وكل شخص يكتب اسمه وإيميله وتطلع له دعوة باسمه</span>
                              </span>
                              <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                                  الحد الأقصى للتسجيل
                                  <input className="fld" type="number" min="1" value={v.cap ?? ''} onChange={v.onCap} />
                                  <span style={S(`font-size: 12px; font-weight: 400; color: ${txt(v.capCol)}; line-height: 1.6;`)}>{v.capMsg}</span>
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>يقفل التسجيل<input className="fld" type="date" value={v.closes ?? ''} onChange={v.onCloses} /></label>
                              </div>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: "#4A5B68" }}>رابط الدعوة العامة</span>
                              <span style={{ display: "flex", alignItems: "center", gap: "8px", height: "46px", padding: "0 6px 0 16px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #DCE4E8", fontSize: "14px", direction: "ltr", justifyContent: "space-between" }}>
                                {v.shLink}
                                <button type="button" onClick={v.copyLink} style={{ cursor: "pointer", height: "34px", padding: "0 14px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontSize: "12px", fontWeight: "700" }}>نسخ</button>
                              </span>
                            </section>
                        ) : null}</>
                    ) : null}
                    {v.s3 ? (
                      <>{v.personal ? (
                          <section data-t="ts3" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <h2 style={{ margin: "0", fontSize: "18px" }}>مين يرسل الدعوات؟</h2>
                                <span style={{ fontSize: "13px", color: "#4A5B68" }}>اختر الطريقة اللي تناسبك</span>
                              </span>
                              <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                                {(v.sendOpts || []).map((o, $i13) => (
                                  <button key={o?.key ?? $i13} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}>
                                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}><b style={{ fontSize: "16px" }}>{o?.n}</b><span style={S(`${txt(o?.tagSt)}`)}>{o?.tag}</span></span>
                                      <span style={{ fontSize: "13px", color: "#4A5B68", lineHeight: "1.7" }}>{o?.d}</span>
                                    </button>
                                ))}
                              </div>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: "#4A5B68", marginTop: "4px" }}>{v.chHead}</span>
                              {(v.chans || []).map((c, $i14) => (
                                <button key={c?.key ?? $i14} type="button" onClick={c?.tog} style={S(`${txt(c?.st)}`)}>
                                    <span style={S(`${txt(c?.box)}`)}>
                                      {c?.on ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                      ) : null}
                                    </span>
                                    <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px", textAlign: "right" }}><b style={{ fontSize: "15px" }}>{c?.n}</b><span style={{ fontSize: "12px", color: "#4A5B68" }}>{c?.d}</span></span>
                                  </button>
                              ))}
                              {v.selfSend ? (
                                <div className="shb" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", borderRadius: "24px", background: "rgba(255,255,255,.85)", border: "1px solid #DCE4E8" }}>
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                                      <b style={{ fontSize: "15px" }}>{v.shHead}</b>
                                      <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.shSub}</span>
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px", height: "42px", padding: "0 16px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "14px", fontWeight: "700", direction: "ltr", justifyContent: "flex-end" }}>{v.shLink}</span>
                                    <button type="button" onClick={v.togMsg} style={{ display: "flex", alignItems: "center", gap: "10px", border: "0", background: "transparent", padding: "0", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", color: "#0A2A43", textAlign: "right" }}>
                                      <span style={S(`${txt(v.msgBox)}`)}>
                                        {v.withMsg ? (
                                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                        ) : null}
                                      </span>
                                      انسخ معه رسالة جاهزة
                                    </button>
                                    {v.withMsg ? (
                                      <><textarea className="fld" rows="3" value={v.msg ?? ''} onChange={v.onMsg} aria-label="نص الرسالة" style={{ height: "auto", minHeight: "96px", borderRadius: "22px", padding: "12px 16px", lineHeight: "1.8", resize: "vertical" }} />
                                      <span style={{ fontSize: "12px", color: "#4A5B68" }}>{"عدّلها مثل ما تبي أو امسحها، والرابط ينضاف تحتها تلقائيًا"}{v.msgNote}</span></>
                                    ) : null}
                                    <button type="button" onClick={v.copyShare} style={S(`${txt(v.copySt)}`)}>{v.copyTx}</button>
                                  </div>
                              ) : null}
                            </section>
                        ) : null}
                      {v.general ? (
                          <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <h2 style={{ margin: "0", fontSize: "18px" }}>انشر رابط الدعوة</h2>
                                <span style={{ fontSize: "13px", color: "#4A5B68" }}>في حساباتك أو القروبات، وكل شخص يسجّل ويوصله دعوته باسمه</span>
                              </span>
                              <div className="shb" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", borderRadius: "24px", background: "rgba(255,255,255,.85)", border: "1px solid #DCE4E8" }}>
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                                  <b style={{ fontSize: "15px" }}>{v.shHead}</b>
                                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.shSub}</span>
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", height: "42px", padding: "0 16px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "14px", fontWeight: "700", direction: "ltr", justifyContent: "flex-end" }}>{v.shLink}</span>
                                <button type="button" onClick={v.togMsg} style={{ display: "flex", alignItems: "center", gap: "10px", border: "0", background: "transparent", padding: "0", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", color: "#0A2A43", textAlign: "right" }}>
                                  <span style={S(`${txt(v.msgBox)}`)}>
                                    {v.withMsg ? (
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    ) : null}
                                  </span>
                                  انسخ معه رسالة جاهزة
                                </button>
                                {v.withMsg ? (
                                  <><textarea className="fld" rows="3" value={v.msg ?? ''} onChange={v.onMsg} aria-label="نص الرسالة" style={{ height: "auto", minHeight: "96px", borderRadius: "22px", padding: "12px 16px", lineHeight: "1.8", resize: "vertical" }} />
                                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>{"عدّلها مثل ما تبي أو امسحها، والرابط ينضاف تحتها تلقائيًا"}{v.msgNote}</span></>
                                ) : null}
                                <button type="button" onClick={v.copyShare} style={S(`${txt(v.copySt)}`)}>{v.copyTx}</button>
                              </div>
                            </section>
                        ) : null}
                      <section className="in" style={{ borderRadius: "26px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start", background: "linear-gradient(150deg, rgba(14,151,174,.16), rgba(255,255,255,.65))", border: "1px solid rgba(14,151,174,.25)" }}>
                          <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#0E97AE", flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                          </span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <b style={{ fontSize: "15px" }}>كل دعوة ترسلها تنحسب من رصيدك</b>
                            <span style={{ fontSize: "13px", color: "#3A4B58", lineHeight: "1.7" }}>والرصيد صالح 30 يوم من يوم الشراء، واللي ما تستخدمه ينتهي معه. والمجاني 10 دعوات مرة وحدة</span>
                          </span>
                        </section>
                      <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>متى ترسل؟</h2>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {(v.whenOpts || []).map((o, $i15) => (
                              <button key={o?.key ?? $i15} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}>{o?.n}</button>
                            ))}
                          </div>
                          {v.sched ? (
                            <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                                <input className="fld" type="date" value={v.schedDate ?? ''} onChange={v.onSchedDate} aria-label="تاريخ الإرسال" />
                                <input className="fld" type="time" value={v.schedTime ?? ''} onChange={v.onSchedTime} aria-label="وقت الإرسال" />
                              </div>
                          ) : null}
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px" }}>
                            <b style={{ fontSize: "15px" }}>مين يذكّر اللي ما ردّوا؟</b>
                            <span style={{ fontSize: "12px", color: "#4A5B68" }}>قرّر الحين قبل ما ترسل، عشان يكون واضح للكل</span>
                          </span>
                          <div className="f3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
                            {(v.remOpts || []).map((o, $i16) => (
                              <button key={o?.key ?? $i16} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}>
                                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}><b style={{ fontSize: "15px" }}>{o?.n}</b><span style={S(`${txt(o?.tagSt)}`)}>{o?.tag}</span></span>
                                  <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.7" }}>{o?.d}</span>
                                </button>
                            ))}
                          </div>
                          {v.remOn ? (
                            <><span style={{ fontSize: "13px", fontWeight: "700", marginTop: "4px" }}>متى يوصل التذكير؟</span>
                            {(v.rems || []).map((r, $i17) => (
                                <button key={r?.key ?? $i17} type="button" onClick={r?.tog} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "16px", border: "1px solid #DCE4E8", background: "#FFFFFF", color: "#0A2A43", cursor: "pointer", fontSize: "14px" }}><span>{r?.n}</span><span style={S(`${txt(r?.sw)}`)}><span style={S(`${txt(r?.kn)}`)} /></span></button>
                              ))}
                            <span style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px 14px", borderRadius: "18px", background: "rgba(231,200,115,.18)", border: "1px solid rgba(184,137,42,.25)", fontSize: "12px", color: "#5B4A12", lineHeight: "1.8" }}>
                                <b style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#B8892A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>{"!"}</b>
                                <span>{v.remRule}</span>
                              </span></>
                          ) : null}
                        </section>
                      <section className="in card" style={{ borderRadius: "30px", padding: "22px 24px", background: "#0A2A43", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>الملخص</h2>
                          {(v.summary || []).map((m, $i18) => (
                            <span key={m?.key ?? $i18} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "14px", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.12)" }}><span style={{ color: "#B8D4DE" }}>{m?.k}</span><b>{m?.v}</b></span>
                          ))}
                          <span style={{ fontSize: "12px", color: "#B8D4DE", lineHeight: "1.7" }}>لو لقيت غلط بعد الإرسال، عدّله من صفحة الدعوة وبيتحدث عند الكل تلقائي على نفس الرابط</span>
                        </section></>
                    ) : null}
                    {v.err ? (
                      <div role="alert" className="in" style={{ padding: "14px 18px", borderRadius: "20px", background: "rgba(201,115,58,.14)", color: "#7A3F16", fontSize: "14px", fontWeight: "700" }}>{v.err}</div>
                    ) : null}
                    <div className="hidem-m" style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <button type="button" onClick={v.prev} style={S(`height: 50px; padding: 0 22px; border-radius: 999px; border: 1px solid rgba(10,42,67,.2); background: transparent; color: #0A2A43; font-size: 15px; cursor: pointer; visibility: ${txt(v.prevVis)};`)}>السابق</button>
                      <button type="button" onClick={v.next} disabled={v.busy} style={{ height: "50px", padding: "0 28px", borderRadius: "999px", border: "0", background: "#0E97AE", color: "#FFFFFF", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 24px rgba(14,151,174,.3)" }}>{v.nextLabel}</button>
                    </div>
                  </div>
                  <aside className="pvcol" style={{ position: "sticky", top: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>معاينة مباشرة · كما يشوفها المدعو</span>
                    <div className="pvbox" style={{ position: "relative", width: "312px", height: "675px", borderRadius: "40px", overflow: "hidden", boxShadow: "0 30px 60px rgba(10,42,67,.25), 0 0 0 8px #0A2A43" }}>
                      {" "}
                      <div className="pvwrap" style={{ position: "absolute", left: "0", top: "0", width: "390px", height: "844px", transform: "scale(.8)", transformOrigin: "0 0" }}>
                        <Invite info={v.pv?.info} look={v.pv?.look} pattern={v.pv?.pattern} color={v.pv?.color} seal={v.pv?.seal} title={v.pv?.title} latin={v.pv?.latin} eventLabel={v.pv?.evl} place={v.pv?.place} platform={v.pv?.platform} linkStatus={v.pv?.link} audience={v.pv?.aud} bgImage={v.pv?.bg} preview="نعم" />
                      </div>
                      {" "}
                    </div>
                  </aside>
                </div>
            ) : null}
          </main>
        </div>
        {" "}
        {v.pvOpen ? (
          <>{" "}
          <div style={{ position: "fixed", inset: "0", zIndex: "40", background: "rgba(4,18,31,.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div style={{ position: "relative", width: "312px", height: "675px", borderRadius: "36px", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "0", top: "0", width: "390px", height: "844px", transform: "scale(.8)", transformOrigin: "0 0" }}>
                  <Invite info={v.pv?.info} look={v.pv?.look} pattern={v.pv?.pattern} color={v.pv?.color} seal={v.pv?.seal} title={v.pv?.title} latin={v.pv?.latin} eventLabel={v.pv?.evl} place={v.pv?.place} platform={v.pv?.platform} linkStatus={v.pv?.link} audience={v.pv?.aud} bgImage={v.pv?.bg} preview="نعم" />
                </div>
              </div>
              <button type="button" onClick={v.togglePv} style={{ height: "46px", padding: "0 24px", borderRadius: "999px", border: "0", background: "#FFFFFF", color: "#0A2A43", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>رجوع</button>
            </div>
          {" "}</>
        ) : null}
        {" "}
        {v.custOpen ? (
          <>{" "}
          <div style={{ position: "fixed", inset: "0", zIndex: "50", background: "rgba(4,18,31,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", boxSizing: "border-box" }}>
              <div className="in" style={{ width: "100%", maxWidth: "520px", maxHeight: "100%", overflow: "auto", borderRadius: "28px", background: "#FAFBFC", padding: "24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: "20px" }}>طلب تخصيص</b>
                  <button type="button" onClick={v.closeCust} aria-label="إغلاق" style={{ width: "36px", height: "36px", border: "0", borderRadius: "50%", background: "#EDF1F3", cursor: "pointer" }}>{"✕"}</button>
                </div>
                {v.custSent ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center", padding: "20px 0" }}>
                      <span style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                      </span>
                      <b style={{ fontSize: "17px" }}>وصلنا طلبك</b>
                      <span style={{ fontSize: "13px", color: "#4A5B68", lineHeight: "1.7" }}>بنتواصل معك خلال يومين عمل عشان نفهم فكرتك ونتفق على السعر</span>
                    </div>
                ) : null}
                {v.custForm ? (
                  <><span style={{ fontSize: "13px", color: "#4A5B68", lineHeight: "1.7", marginTop: "-6px" }}>
                      اختر وش تبي واكتب فكرتك، وبنتواصل معك شخصيًا. التخصيص خدمة منفصلة عن الرصيد وسعره مستقل، ومتاح مع الرصيد المدفوع
                    </span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(v.custTypes || []).map((t, $i19) => (
                        <button key={t?.key ?? $i19} type="button" onClick={t?.tog} style={S(`${txt(t?.st)}`)}>{t?.n}</button>
                      ))}
                    </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                      فكرتك
                      <textarea className="fld" rows="3" value={v.cuDesc ?? ''} onChange={v.onCuDesc} placeholder="مثال: نبي ختم «سفير النادي» بألوان هويتنا" style={{ height: "auto", padding: "12px 14px", resize: "vertical" }} />
                    </label>
                  <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                        رقم للتواصل
                        <input className="fld" type="tel" value={v.cuPhone ?? ''} onChange={v.onCuPhone} placeholder="05X XXX XXXX" style={{ direction: "ltr", textAlign: "right" }} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                        أو إيميل
                        <input className="fld" type="email" value={v.cuMail ?? ''} onChange={v.onCuMail} placeholder="name@example.com" style={{ direction: "ltr", textAlign: "right" }} />
                      </label>
                    </div>
                  {v.cuErr ? (
                      <span role="alert" style={{ fontSize: "13px", fontWeight: "700", color: "#9A5226" }}>{v.cuErr}</span>
                    ) : null}
                  <button type="button" onClick={v.sendCust} style={{ height: "50px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>أرسل الطلب</button></>
                ) : null}
              </div>
            </div>
          {" "}</>
        ) : null}
        {v.tourOn ? (
          <div>
              <span className="tspot" style={S(`${txt(v.spotSt)}`)} />
              <div className="ttip" role="dialog" aria-label="شرح الصفحة" style={S(`${txt(v.tipSt)}`)}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0E97AE" }}>{v.tStep}</span>
                <b style={{ fontSize: "17px" }}>{v.tTitle}</b>
                <span style={{ fontSize: "14px", lineHeight: "1.8", color: "#3A4B58" }}>{v.tBody}</span>
                <div style={{ display: "flex", gap: "8px", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <button type="button" onClick={v.tEnd} style={{ height: "40px", padding: "0 12px", border: "0", background: "none", color: "#4A5B68", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>تخطّي</button>
                  <span style={{ display: "flex", gap: "8px" }}>
                    {v.tHasPrev ? (
                      <button type="button" onClick={v.tPrev} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "#FFFFFF", color: "#0A2A43", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>السابق</button>
                    ) : null}
                    <button type="button" onClick={v.tNext} style={{ height: "40px", padding: "0 18px", borderRadius: "999px", border: "0", background: "#0E97AE", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>{v.tNextL}</button>
                  </span>
                </div>
              </div>
            </div>
        ) : null}
        <FAQ open="لا" />
      </div>
    </>
  );
}
