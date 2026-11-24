import { S, txt, A } from '@/ui/dc';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:#086577}a:hover{color:#0A2A43}
input,button,textarea{font-family:'IBM Plex Sans Arabic',sans-serif}
.glass{background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(26px) saturate(1.4);backdrop-filter:blur(26px) saturate(1.4);border:1px solid rgba(255,255,255,.85);box-shadow:0 24px 60px rgba(10,42,67,.08),inset 0 1px 0 rgba(255,255,255,.9)}
.nav{transition:background .2s ease}.nav:hover{background:rgba(14,151,174,.08)}
.row{transition:background .2s ease}.row:hover{background:rgba(255,255,255,.6)}
.in{animation:rise .5s cubic-bezier(.2,.8,.2,1) both}
.growX{transform-origin:100% 50%;animation:growX 1.1s cubic-bezier(.2,.8,.2,1) both}
.grow{transform-origin:50% 100%;animation:grow 1s cubic-bezier(.2,.8,.2,1) both}
.orb{animation:drift 14s ease-in-out infinite}
.pulse{animation:pls 1.6s ease-in-out infinite}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes growX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-22px)}}
@keyframes pls{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes pop{0%{opacity:0;transform:scale(.6)}70%{opacity:1;transform:scale(1.06)}100%{transform:none}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
.bnav{display:none}
@media (max-width: 900px){.side{display:none !important}.bnav{display:flex !important}.g2,.k2,.split{grid-template-columns:minmax(0,1fr) !important}.pg{padding:12px 12px 100px !important}.mn{padding:8px 2px 20px !important;gap:16px !important}.hidem{display:none !important}.h1m{font-size:30px !important}.card{padding:16px !important;border-radius:24px !important}.g5{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.g5 > :last-child{grid-column:span 2}.gt{grid-template-columns:minmax(0,1fr) auto !important}.sticky{position:static !important}.code b{font-size:44px !important}}
@media (min-width: 901px) and (max-width: 1180px){.g5{grid-template-columns:repeat(3,minmax(0,1fr)) !important}.split{grid-template-columns:minmax(0,1fr) !important}.sticky{position:static !important}}
h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
.tourb{height:48px;padding:0 18px;border-radius:999px;border:1px solid rgba(14,151,174,.3);background:rgba(230,246,249,.8);color:#086577;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.tspot{position:fixed;z-index:90;border-radius:28px;box-shadow:0 0 0 9999px rgba(4,18,31,.6),0 0 0 4px #86DCEA;pointer-events:none;transition:all .45s cubic-bezier(.2,.8,.2,1)}
.ttip{position:fixed;z-index:91;box-sizing:border-box;border-radius:26px;background:#FAFBFC;padding:18px 20px;display:flex;flex-direction:column;gap:10px;color:#0A2A43;box-shadow:0 30px 70px rgba(0,0,0,.35);transition:top .45s cubic-bezier(.2,.8,.2,1),left .45s cubic-bezier(.2,.8,.2,1);animation:tIn .4s ease-out both}
@keyframes tIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
@media (max-width: 599px){.tourb{height:42px;padding:0 14px;font-size:13px}}
.chip{transition:background .2s ease,color .2s ease}
.tg{position:relative;width:52px;height:30px;border-radius:999px;border:0;cursor:pointer;transition:background .25s ease;flex:none}
.tg span{position:absolute;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);transition:right .25s ease}
.fld{height:50px;border-radius:999px;border:1px solid rgba(10,42,67,.16);background:#fff;padding:0 20px;font-size:15px;color:#0A2A43;width:100%;box-sizing:border-box;font-family:'IBM Plex Sans Arabic',sans-serif}
.fld:focus,.ta:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
.ta{border-radius:22px;border:1px solid rgba(10,42,67,.16);background:#fff;padding:14px 18px;font-size:15px;line-height:1.8;color:#0A2A43;width:100%;box-sizing:border-box;resize:vertical;min-height:110px}
.btn{height:48px;padding:0 20px;border-radius:999px;border:1px solid rgba(10,42,67,.18);background:rgba(255,255,255,.75);color:#0A2A43;text-decoration:none;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}
.btnp{height:50px;padding:0 22px;border-radius:999px;border:0;background:#0E97AE;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:0 10px 24px rgba(14,151,174,.3)}
.btnd{height:50px;padding:0 22px;border-radius:999px;border:0;background:#0A2A43;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}
.btn:hover,.btnp:hover,.btnd:hover{filter:brightness(1.05)}
.lbl{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#4A5B68}
.sub{font-size:13px;color:#4A5B68;line-height:1.7}
h2,h3{font-family:TS,'IBM Plex Sans Arabic',sans-serif;font-weight:700}`;

export default function ReportView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "'IBM Plex Sans Arabic', TS, sans-serif", color: "#0A2A43", background: "radial-gradient(55% 40% at 88% 4%, #CBEFF5 0%, rgba(203,239,245,0) 70%), radial-gradient(45% 40% at 6% 96%, #DCE4E8 0%, rgba(220,228,232,0) 70%), #EDF1F3" }}>
        {" "}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="dWax" cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#4CC7DA" />
              <stop offset="55%" stopColor="#0E97AE" />
              <stop offset="100%" stopColor="#086577" />
            </radialGradient>
            <radialGradient id="dGold" cx="36%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#E7C873" />
              <stop offset="55%" stopColor="#B8892A" />
              <stop offset="100%" stopColor="#7E5B14" />
            </radialGradient>
          </defs>
        </svg>
        {" "}
        <span className="orb" aria-hidden="true" style={{ position: "absolute", right: "28%", top: "-140px", width: "440px", height: "440px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(134,220,234,.55), rgba(14,151,174,.12) 60%, rgba(14,151,174,0) 72%)", filter: "blur(6px)", pointerEvents: "none" }} />
        {" "}
        <div className="pg" style={{ position: "relative", display: "flex", gap: "24px", padding: "20px", boxSizing: "border-box", minHeight: "100vh" }}>
          {v.notShared ? (
            <nav aria-label="التنقل الرئيسي" className="glass side" style={{ flex: "0 0 250px", boxSizing: "border-box", padding: "24px 16px", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "22px", alignSelf: "flex-start", position: "sticky", top: "20px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "0 6px" }}>
                  <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#dWax)" />
                    <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity="0.3" />
                    <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                    <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
                  </svg>
                  <span style={{ fontFamily: "TD, serif", fontSize: "26px", lineHeight: "1" }}>حيّــاك</span>
                </span>
                <A href="Create.dc.html" style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "15px", boxShadow: "0 10px 24px rgba(14,151,174,.35)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  إنشاء دعوة
                </A>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#4A5B68", padding: "0 12px 6px" }}>المساحة</span>
                  {(v.nav1 || []).map((n, $i0) => (
                    <A key={n?.key ?? $i0} href={n?.href} className="nav" style={S(`${txt(n?.st)}`)}>
                        <span style={S(`${txt(n?.bar)}`)} />
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n?.ic} /></svg>
                        {n?.label}
                        {n?.hasBadge ? (
                          <span style={{ marginRight: "auto", minWidth: "20px", height: "20px", padding: "0 6px", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>{n?.badge}</span>
                        ) : null}
                      </A>
                  ))}
                  <span style={{ fontSize: "11px", color: "#4A5B68", padding: "16px 12px 6px" }}>الحساب</span>
                  {(v.nav2 || []).map((n, $i1) => (
                    <A key={n?.key ?? $i1} href={n?.href} className="nav" style={S(`${txt(n?.st)}`)}>
                        <span style={S(`${txt(n?.bar)}`)} />
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n?.ic} /></svg>
                        {n?.label}
                      </A>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "20px", background: "rgba(255,255,255,.65)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <b style={{ fontSize: "13px" }}>رصيدك</b>
                    <A href="Subscribe.dc.html" style={{ fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>اشترِ رصيد</A>
                  </div>
                  <span style={{ height: "6px", borderRadius: "6px", background: "rgba(14,151,174,.14)", overflow: "hidden", display: "block" }}>
                    <span className="growX" style={S(`display: block; width: ${txt(v.side?.pct)}; height: 100%; background: linear-gradient(90deg,#0E97AE,#86DCEA);`)} />
                  </span>
                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.side?.credit}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 6px" }}>
                  <span style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #DCE4E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#4A5B68", flex: "none", overflow: "hidden" }}>
                    {v.side?.hasLogo ? (
                      <img src={v.side?.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px" }} />
                    ) : null}
                    {v.side?.noLogo ? (
                      <>شعار</>
                    ) : null}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: "0", flex: "1" }}>
                    <span style={{ fontWeight: "700", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.side?.org}</span>
                    <span style={{ fontSize: "12px", color: "#4A5B68", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.side?.user}</span>
                  </div>
                  <button type="button" onClick={v.side?.logout} aria-label="تسجيل خروج" title="تسجيل خروج" style={{ width: "34px", height: "34px", border: "0", borderRadius: "50%", background: "transparent", color: "#4A5B68", cursor: "pointer", flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17l-5-5 5-5M5 12h11M14 4h5v16h-5" /></svg>
                  </button>
                </div>
              </nav>
          ) : null}
          {v.notShared ? (
            <nav aria-label="التنقل" className="bnav glass" style={{ position: "fixed", left: "12px", right: "12px", bottom: "12px", zIndex: "20", height: "66px", borderRadius: "24px", padding: "0 8px", justifyContent: "space-around", alignItems: "center" }}>
                {" "}
                {(v.bnav || []).map((b, $i2) => (
                  <A key={b?.key ?? $i2} href={b?.href} style={S(`${txt(b?.st)}`)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={b?.ic} /></svg>
                      {b?.label}
                    </A>
                ))}
                {" "}
                <A href="Create.dc.html" aria-label="إنشاء دعوة" style={{ order: "2", width: "52px", height: "52px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(14,151,174,.4)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </A>
                {" "}
              </nav>
          ) : null}
          <main className="mn" style={{ flex: "1 1 auto", minWidth: "0", boxSizing: "border-box", padding: "24px 14px 40px", display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {v.notShared ? (
                <A href="/app/invitations" className="in" style={{ fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>→ الدعوات</A>
              ) : null}
              <button type="button" className="tourb" onClick={v.startTour}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.6M12 17h.01" /></svg>
                دلّني
              </button>
            </div>
            <header className="in" data-t="1" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.2" }}>تقرير الفصل</h1>
                <span style={{ fontSize: "15px", color: "#4A5B68" }}>{v.repSub}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button type="button" className="btnp" onClick={v.pdf}>{v.pdfL}</button>
                <button type="button" className="btn" onClick={v.xl}>حمّل البيانات Excel</button>
                {v.notShared ? (
                  <button type="button" className="btn" onClick={v.share}>{v.shareL}</button>
                ) : null}
              </div>
            </header>
            <div data-t="2" className="in" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(v.sems || []).map((m, $i3) => (
                <button key={m?.key ?? $i3} type="button" className="chip" onClick={m?.on} aria-pressed={m?.pr} style={S(`${txt(m?.st)}`)}>{m?.l}</button>
              ))}
            </div>
            <div data-t="3" className="g5 in" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "14px" }}>
              {(v.kpis || []).map((k, $i4) => (
                <div key={k?.key ?? $i4} className="glass" style={{ borderRadius: "24px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "13px", color: "#4A5B68" }}>{k?.l}</span>
                    <span style={S(`font-family: TD, serif; font-size: 36px; line-height: 1.1; color: ${txt(k?.c)};`)}>{k?.v}</span>
                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>{k?.s}</span>
                  </div>
              ))}
            </div>
            <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
              <section data-t="4" className="in glass card" style={{ borderRadius: "30px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h2 style={{ margin: "0", fontSize: "18px" }}>نسبة الحضور في كل فعالية</h2>
                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>من اللي أكّدوا</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "190px" }} role="img" aria-label={v.chartLabel}>
                  {(v.bars || []).map((b, $i5) => (
                    <span key={b?.key ?? $i5} style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                        <span style={S(`font-size: 11px; font-weight: 700; color: ${txt(b?.tc)};`)}>{b?.p}</span>
                        <span className="grow" style={S(`${txt(b?.bar)}`)} />
                        <span style={{ fontSize: "11px", color: "#4A5B68" }}>{b?.n}</span>
                      </span>
                  ))}
                </div>
              </section>
              <section data-t="6" className="in glass card" style={{ borderRadius: "30px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h2 style={{ margin: "0", fontSize: "18px" }}>أكثر الأعضاء حضورًا</h2>
                  <span className="sub">ينفع للتكريم آخر الفصل أو لساعات التطوع</span>
                </div>
                {(v.tops || []).map((t, $i6) => (
                  <div key={t?.key ?? $i6} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 4px" }}>
                      <span style={S(`${txt(t?.rk)}`)}>{t?.r}</span>
                      <b style={{ flex: "1", fontSize: "15px" }}>{t?.n}</b>
                      <span style={{ fontSize: "13px", color: "#4A5B68" }}>{t?.c}</span>
                    </div>
                ))}
              </section>
            </div>
            <section data-t="5" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: "18px" }}>الفعاليات</h2>
              <div className="hidem" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 110px 80px 80px 80px minmax(0,1fr)", gap: "12px", padding: "0 10px 6px", fontSize: "12px", color: "#4A5B68", fontWeight: "700" }}>
                <span>الفعالية</span>
                <span>التاريخ</span>
                <span>المدعوين</span>
                <span>أكّدوا</span>
                <span>حضروا</span>
                <span>نسبة الحضور</span>
              </div>
              {(v.evs || []).map((e, $i7) => (
                <div key={e?.key ?? $i7} className="row gt" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 110px 80px 80px 80px minmax(0,1fr)", gap: "12px", alignItems: "center", padding: "10px", borderRadius: "16px", fontSize: "14px" }}>
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}><b>{e?.n}</b><span style={{ fontSize: "12px", color: "#4A5B68" }}>{e?.sub}</span></span>
                    <span className="hidem" style={{ color: "#4A5B68" }}>{e?.d}</span>
                    <span className="hidem">{e?.i}</span>
                    <span className="hidem">{e?.c}</span>
                    <span className="hidem"><b>{e?.a}</b></span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="hidem" style={{ flex: "1", height: "8px", borderRadius: "8px", background: "rgba(10,42,67,.06)", overflow: "hidden", display: "block" }}><span style={S(`${txt(e?.bar)}`)} /></span>
                      <b style={{ fontSize: "13px", color: "#086577", minWidth: "38px" }}>{e?.p}</b>
                    </span>
                  </div>
              ))}
            </section>
          </main>
        </div>
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
        <FAQ off={v.shared} open="لا" />
      </div>
    </>
  );
}
