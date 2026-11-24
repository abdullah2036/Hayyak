import { S, txt, A } from '@/ui/dc';

const CSS = `h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
body{margin:0;background:#061C2E}
.orb{position:absolute;width:560px;height:560px;border-radius:50%;background:radial-gradient(closest-side,rgba(14,151,174,.35),rgba(14,151,174,0));animation:drift 20s ease-in-out infinite;pointer-events:none}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(60px,-40px)}}
.bob{animation:bob 5s ease-in-out infinite}@keyframes bob{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-12px) rotate(-4deg)}}
.sweep{position:absolute;top:0;bottom:0;width:180px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.12),rgba(255,255,255,0));animation:sweep 6s ease-in-out infinite;pointer-events:none}@keyframes sweep{0%{right:-200px}60%,100%{right:110%}}
.glow{box-shadow:0 0 0 0 rgba(134,220,234,.5);animation:glow 2.6s ease-out infinite}@keyframes glow{0%{box-shadow:0 0 0 0 rgba(134,220,234,.45)}100%{box-shadow:0 0 0 16px rgba(134,220,234,0)}}
.kpi{transition:transform .3s ease,background .3s ease}.kpi:hover{transform:translateY(-4px);background:rgba(255,255,255,.1) !important}
.card2{transition:transform .25s ease}
a{color:#086577}
input,button,select,textarea{font-family:'IBM Plex Sans Arabic',sans-serif}
.fld{height:50px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);padding:0 18px;font-size:15px;color:#EAF4F7;width:100%;box-sizing:border-box}
.fld:focus,select:focus,textarea:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
.tg{position:relative;width:52px;height:30px;border-radius:999px;border:0;cursor:pointer;transition:background .25s ease;flex:none}
.tg span{position:absolute;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);transition:right .25s ease}
.nv{transition:background .2s ease}.nv:hover{background:rgba(134,220,234,.1)}
.in{animation:rise .5s cubic-bezier(.2,.8,.2,1) both}
.growX{transform-origin:100% 50%;animation:growX 1s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes growX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (max-width: 1180px){.g4{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.split{grid-template-columns:minmax(0,1fr) !important}}
@media (max-width: 900px){.pg{flex-direction:column !important;padding:12px !important}.side{flex:0 0 auto !important;width:100% !important}.navs{flex-direction:row !important;overflow-x:auto;gap:6px !important}.navs button{flex:none}.sidefoot{display:none !important}.g3{grid-template-columns:minmax(0,1fr) !important}.gt{grid-template-columns:minmax(0,1fr) auto !important}.hidem{display:none !important}.h1m{font-size:32px !important}}
@media (max-width: 560px){.hero .bob{display:none}.hero b{font-size:34px !important}.kpi b{font-size:30px !important}}
.fld::placeholder,textarea::placeholder{color:#7FA0B2}
select option{color:#0A2A43}
.tspot{position:fixed;z-index:90;border-radius:20px;box-shadow:0 0 0 9999px rgba(2,12,22,.62),0 0 0 3px #86DCEA;pointer-events:none;transition:all .45s cubic-bezier(.2,.8,.2,1)}
.ttip{position:fixed;z-index:91;box-sizing:border-box;border-radius:26px;background:#FAFBFC;color:#0A2A43;padding:18px 20px;display:flex;flex-direction:column;gap:10px;box-shadow:0 30px 70px rgba(0,0,0,.4);transition:top .45s cubic-bezier(.2,.8,.2,1),left .45s cubic-bezier(.2,.8,.2,1);animation:tIn .4s ease-out both}
.tin{animation:tIn .45s cubic-bezier(.2,.8,.2,1) both}
@keyframes tIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
@keyframes lpulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}
@keyframes bob{0%,100%{translate:0 0}50%{translate:0 -8px}}
.tw{animation:twk 2.4s ease-in-out infinite}@keyframes twk{0%,100%{opacity:.2}50%{opacity:1}}
@media (max-width: 900px){.bld{padding:18px !important;border-radius:26px !important}}
h2,h3{font-family:TS,'IBM Plex Sans Arabic',sans-serif;font-weight:700}`;

export default function AdminView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ position: "relative", overflow: "hidden", minHeight: "100vh", fontFamily: "'IBM Plex Sans Arabic', TS, sans-serif", color: "#EAF4F7", background: "radial-gradient(50% 40% at 85% 0%, rgba(14,151,174,.45), rgba(14,151,174,0) 70%), radial-gradient(45% 40% at 10% 100%, rgba(134,220,234,.18), rgba(134,220,234,0) 70%), linear-gradient(180deg, #0B3550, #061C2E)" }}>
        <span aria-hidden="true" className="orb" style={{ right: "20%", top: "-120px" }} />
        <span aria-hidden="true" className="orb" style={{ left: "-10%", bottom: "10%", animationDuration: "26s", animationDirection: "reverse" }} />
        {" "}
        <div className="pg" style={{ position: "relative", display: "flex", gap: "22px", padding: "20px", boxSizing: "border-box", minHeight: "100vh" }}>
          <aside className="side" style={{ flex: "0 0 260px", boxSizing: "border-box", borderRadius: "30px", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "22px", color: "#FFFFFF", background: "radial-gradient(80% 40% at 30% 0%, rgba(14,151,174,.45), rgba(14,151,174,0) 70%), linear-gradient(180deg, #0B3550, #072538)", boxShadow: "0 30px 60px rgba(7,37,56,.25)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 6px" }}>
              <svg width="46" height="46" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible" }}>
                <defs>
                  <radialGradient id="sg46" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#A6EEF7" />
                    <stop offset="25%" stopColor="#4FC9DC" />
                    <stop offset="60%" stopColor="#0E97AE" />
                    <stop offset="100%" stopColor="#05505E" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="#033A44" transform="translate(0 2.4)" />
                <path d={v.wax} fill="url(#sg46)" />
                <circle cx="50" cy="50" r="31.5" fill="none" stroke="#05505E" strokeOpacity=".55" strokeWidth="2.6" />
                <circle cx="50" cy="50.9" r="31.5" fill="none" stroke="#C9F4FA" strokeOpacity=".55" strokeWidth="1.1" />
                <ellipse cx="34" cy="24" rx="16" ry="6" transform="rotate(-30 34 24)" fill="#FFFFFF" fillOpacity=".35" />
                <text x="50" y="60.4" textAnchor="middle" fontFamily="TD" fontSize="42" fill="#033A44" fillOpacity=".7">{"ح"}</text>
                <text x="50" y="58.8" textAnchor="middle" fontFamily="TD" fontSize="42" fill="#FFFFFF">{"ح"}</text>
              </svg>
              <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
                <span style={{ fontFamily: "TD, serif", fontSize: "28px", lineHeight: "1.1" }}>حيّــاك</span>
                <span style={{ display: "flex", justifyContent: "space-between", direction: "ltr", fontWeight: "700", fontSize: "11px", color: "#86DCEA" }}><span>{"S"}</span><span>{"T"}</span><span>{"U"}</span><span>{"D"}</span><span>{"I"}</span><span>{"O"}</span></span>
              </span>
            </span>
            <nav className="navs" aria-label="الاستوديو" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {(v.nav || []).map((n, $i0) => (
                <button key={n?.key ?? $i0} type="button" className="nv" data-tour={n?.k} onClick={n?.go} style={S(`${txt(n?.st)}`)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n?.ic} /></svg>
                    {n?.n}
                    {n?.hasB ? (
                      <span style={{ marginRight: "auto", minWidth: "22px", height: "22px", padding: "0 6px", borderRadius: "999px", background: "#86DCEA", color: "#04121F", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>{n?.b}</span>
                    ) : null}
                  </button>
              ))}
            </nav>
            <div className="sidefoot" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="button" onClick={v.tourStart} style={{ height: "44px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.35)", background: "rgba(134,220,234,.1)", color: "#86DCEA", fontFamily: "inherit", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M14.8 9.2l-1.9 4.7-4.7 1.9 1.9-4.7z" /></svg>
                دلّني
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "20px", background: "rgba(255,255,255,.08)" }}>
                <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#86DCEA", color: "#04121F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, serif", fontSize: "17px" }}>{v.meI}</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <b style={{ fontSize: "14px" }}>{v.meN}</b>
                  <span style={{ fontSize: "12px", color: "#B8D4DE" }}>{v.meR}</span>
                </span>
              </span>
              <button type="button" onClick={v.logout} style={{ height: "44px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.25)", color: "#FFFFFF", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", fontFamily: "inherit", cursor: "pointer" }}>تسجيل خروج</button>
            </div>
          </aside>
          <main style={{ flex: "1 1 auto", minWidth: "0", display: "flex", flexDirection: "column", gap: "22px", padding: "14px 6px 40px" }}>
            {v.toast ? (
              <div role="status" style={{ position: "fixed", left: "24px", bottom: "24px", zIndex: "95", padding: "14px 20px", borderRadius: "18px", background: "#86DCEA", color: "#04121F", fontWeight: "700", fontSize: "14px", boxShadow: "0 20px 50px rgba(0,0,0,.4)", maxWidth: "80vw" }}>{v.toast}</div>
            ) : null}
            <header className="in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.15" }}>{v.vt}</h1>
                <span style={{ fontSize: "15px", color: "#B8CCD6" }}>{v.vs}</span>
              </span>
            </header>
            {v.vHome ? (
              <section className="in hero" style={{ position: "relative", overflow: "hidden", borderRadius: "34px", padding: "30px 34px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", background: "radial-gradient(70% 120% at 15% 0%, rgba(14,151,174,.55), rgba(14,151,174,0) 60%), linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.03))", border: "1px solid rgba(255,255,255,.14)" }}>
                  <span aria-hidden="true" className="sweep" />
                  <span style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "15px", color: "#86DCEA", fontWeight: "700" }}>{v.greet}</span>
                    <b style={{ fontFamily: "TD, serif", fontSize: "44px", lineHeight: "1.2" }}>{v.openTx}</b>
                    <span style={{ fontSize: "15px", color: "#B8CCD6" }}>{v.sendTx}</span>
                    <span style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
                      <button type="button" onClick={v.goReq} className="glow" style={{ height: "50px", padding: "0 24px", border: "0", borderRadius: "999px", background: "#86DCEA", color: "#04121F", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>افتح الطلبات</button>
                      <button type="button" onClick={v.goSend} style={{ height: "50px", padding: "0 24px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#FFFFFF", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>طلبات الإرسال</button>
                    </span>
                  </span>
                  <span className="bob" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.45))" }}>
                    <svg width="170" height="170" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible" }}>
                      <defs>
                        <radialGradient id="sg170" cx="34%" cy="26%" r="85%">
                          <stop offset="0%" stopColor="#A6EEF7" />
                          <stop offset="25%" stopColor="#4FC9DC" />
                          <stop offset="60%" stopColor="#0E97AE" />
                          <stop offset="100%" stopColor="#05505E" />
                        </radialGradient>
                      </defs>
                      <path d={v.wax} fill="#033A44" transform="translate(0 2.4)" />
                      <path d={v.wax} fill="url(#sg170)" />
                      <circle cx="50" cy="50" r="31.5" fill="none" stroke="#05505E" strokeOpacity=".55" strokeWidth="2.6" />
                      <circle cx="50" cy="50.9" r="31.5" fill="none" stroke="#C9F4FA" strokeOpacity=".55" strokeWidth="1.1" />
                      <ellipse cx="34" cy="24" rx="16" ry="6" transform="rotate(-30 34 24)" fill="#FFFFFF" fillOpacity=".35" />
                      <text x="50" y="60.4" textAnchor="middle" fontFamily="TD" fontSize="42" fill="#033A44" fillOpacity=".7">{"ح"}</text>
                      <text x="50" y="58.8" textAnchor="middle" fontFamily="TD" fontSize="42" fill="#FFFFFF">{"ح"}</text>
                    </svg>
                  </span>
                </section>
            ) : null}
            {v.vHome ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "14px" }}>
                    {(v.kpis || []).map((k, $i1) => (
                      <div key={k?.key ?? $i1} className="in kpi" style={{ borderRadius: "26px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "8px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "14px", color: "#9FB8C6" }}>{k?.l}</span>
                            <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(134,220,234,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={k?.ic} /></svg>
                            </span>
                          </span>
                          <b style={{ fontFamily: "TD, serif", fontSize: "38px", lineHeight: "1.1" }}>{k?.v}</b>
                          <span style={{ fontSize: "13px", color: "#86DCEA", fontWeight: "700" }}>{k?.d}</span>
                        </div>
                    ))}
                  </div>
                  <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
                    <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}><h3 style={{ margin: "0", fontSize: "19px" }}>يحتاج انتباهك</h3></span>
                      {(v.attn || []).map((a, $i2) => (
                        <button key={a?.key ?? $i2} type="button" onClick={a?.go} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "22px", border: "0", background: "rgba(255,255,255,.07)", cursor: "pointer", textAlign: "right", fontFamily: "inherit", color: "#EAF4F7", boxShadow: "0 6px 16px rgba(10,42,67,.05)" }}>
                            <span style={S(`${txt(a?.dot)}`)} />
                            <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}><b style={{ fontSize: "15px" }}>{a?.t}</b><span style={{ fontSize: "13px", color: "#9FB8C6" }}>{a?.d}</span></span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#86DCEA" }}>{a?.cta}{" ←"}</span>
                          </button>
                      ))}
                    </section>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}><h3 style={{ margin: "0", fontSize: "19px" }}>مبيعات الرصيد حسب الإرسال</h3></span>
                        {(v.plansBar || []).map((p, $i3) => (
                          <div key={p?.key ?? $i3} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><b>{p?.n}</b><span style={{ color: "#9FB8C6" }}>{p?.c}{" مستخدم · "}{p?.r}</span></span>
                              <span style={{ height: "10px", borderRadius: "999px", background: "rgba(14,151,174,.1)", overflow: "hidden", display: "block" }}><span className="growX" style={S(`${txt(p?.bar)}`)} /></span>
                            </div>
                        ))}
                      </section>
                      <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <h3 style={{ margin: "0", fontSize: "19px" }}>مين يرسل الدعوات</h3>
                          <span style={{ fontSize: "13px", color: "#9FB8C6" }}>الدعوات الخاصة هذا الشهر</span>
                        </span>
                        <div style={{ display: "flex", height: "16px", borderRadius: "999px", overflow: "hidden" }}>
                          <span style={S(`width: ${txt(v.shareA)}; background: #0E97AE;`)} />
                          <span style={S(`width: ${txt(v.shareB)}; background: #86DCEA;`)} />
                        </div>
                        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#0E97AE" }} />
                            {"حيّــاك ترسلها · "}{v.shareA}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#86DCEA" }} />
                            {"يرسلونها بأنفسهم · "}{v.shareB}
                          </span>
                        </span>
                      </section>
                    </div>
                  </div>
                </div>
            ) : null}
            {v.vSend ? (
              <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                  <span style={{ fontSize: "14px", color: "#B8CCD6", lineHeight: "1.7" }}>المستخدم يرسل الطلب من حسابه، ونرسل الدعوات من حساب حيّــاك باسمه. ما نحتاج ندخل حساباتهم</span>
                  {(v.sends || []).map((q, $i4) => (
                    <div key={q?.key ?? $i4} className="gt" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) 150px 170px", gap: "14px", alignItems: "center", padding: "16px", borderRadius: "24px", background: "rgba(255,255,255,.07)" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                          <b style={{ fontSize: "16px" }}>{q?.inv}</b>
                          <span style={{ fontSize: "13px", color: "#9FB8C6" }}>{q?.who}{" · "}{q?.when}</span>
                        </span>
                        <span className="hidem" style={{ fontSize: "14px", color: "#B8CCD6" }}>{q?.n}{" مدعو · "}{q?.ch}</span>
                        <span style={S(`${txt(q?.pill)}`)}>{q?.st}</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <button type="button" onClick={q?.go} style={S(`${txt(q?.btn)}`)}>{q?.cta}</button>
                          {q?.wa ? (
                            <button type="button" onClick={q?.wa} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>قائمة الواتساب</button>
                          ) : null}
                        </span>
                      </div>
                  ))}
                  {v.noSends ? (
                    <span style={{ fontSize: "15px", color: "#9FB8C6" }}>ما فيه طلبات إرسال</span>
                  ) : null}
                  {v.waOpen ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "18px", borderRadius: "24px", background: "rgba(255,255,255,.06)" }}>
                        <span style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
                          <b style={{ fontSize: "16px" }}>أرسل من واتساب حيّــاك · فتح هذي القائمة انسجل في سجل المستخدم</b>
                          <button type="button" onClick={v.waClose} aria-label="إغلاق" style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>{"×"}</button>
                        </span>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", maxHeight: "340px", overflow: "auto" }}>
                          {(v.waList || []).map((w, $i5) => (
                            <A key={w?.key ?? $i5} href={w?.url} onClick={w?.mark} style={S(`${txt(w?.st)}`)}>{w?.name}</A>
                          ))}
                        </div>
                      </div>
                  ) : null}
                </section>
            ) : null}
            {v.vReq ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(v.stF || []).map((f, $i6) => (
                      <button key={f?.key ?? $i6} type="button" onClick={f?.on} style={S(`${txt(f?.st)}`)}>{f?.n}<span style={S(`${txt(f?.cst)}`)}>{f?.c}</span></button>
                    ))}
                  </div>
                  <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
                    <section className="in" style={{ borderRadius: "30px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                      {(v.reqs || []).map((r, $i7) => (
                        <div key={r?.key ?? $i7} style={S(`${txt(r?.row)}`)}>
                            <button type="button" onClick={r?.pick} style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", textAlign: "right", cursor: "pointer", fontFamily: "inherit", color: "#EAF4F7", display: "flex", flexDirection: "column", gap: "4px", padding: "0" }}>
                              <b style={{ fontSize: "15px" }}>{r?.what}</b>
                              <span style={{ fontSize: "13px", color: "#9FB8C6" }}>{r?.who}{" · رصيد "}{r?.plan}{" · "}{r?.when}</span>
                            </button>
                            <select value={r?.v ?? ''} onChange={r?.onSt} aria-label="المرحلة" style={S(`${txt(r?.selSt)}`)}>
                              {(v.stageOpts || []).map((o, $i8) => (
                                <option key={o?.key ?? $i8} value={o?.v}>{o?.n}</option>
                              ))}
                            </select>
                          </div>
                      ))}
                      {v.noReq ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#9FB8C6", fontSize: "14px" }}>ما فيه طلبات في هذي المرحلة</div>
                      ) : null}
                    </section>
                    {v.hasSel ? (
                      <section className="in" style={{ borderRadius: "30px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <b style={{ fontFamily: "TD, serif", fontSize: "28px", lineHeight: "1.3" }}>{v.sel?.what}</b>
                            <span style={{ fontSize: "14px", color: "#9FB8C6" }}>{v.sel?.who}{" · رصيد "}{v.sel?.plan}{" · "}{v.sel?.when}</span>
                          </span>
                          <span style={{ fontSize: "15px", lineHeight: "1.8", padding: "14px 16px", borderRadius: "20px", background: "rgba(255,255,255,.07)" }}>{v.sel?.note}</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <A href={v.sel?.wa} target="_blank" rel="noopener" style={{ height: "46px", padding: "0 20px", borderRadius: "999px", background: "rgba(134,220,234,.15)", color: "#86DCEA", textDecoration: "none", fontWeight: "700", fontSize: "14px", display: "inline-flex", alignItems: "center" }}>واتساب</A>
                            <A href={v.sel?.mailto} style={{ height: "46px", padding: "0 20px", borderRadius: "999px", background: "rgba(255,255,255,.1)", color: "#EAF4F7", textDecoration: "none", fontWeight: "700", fontSize: "14px", display: "inline-flex", alignItems: "center" }}>إيميل</A>
                            <span style={{ height: "46px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.18)", display: "inline-flex", alignItems: "center", fontSize: "14px", direction: "ltr" }}>{v.sel?.phone}</span>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "700" }}>المرحلة</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {(v.sel?.steps || []).map((p, $i9) => (
                              <button key={p?.key ?? $i9} type="button" onClick={p?.go} style={S(`${txt(p?.st)}`)}>
                                  <span style={S(`${txt(p?.dot)}`)}>{p?.ic}</span>
                                  <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "1px", textAlign: "right" }}>
                                    <b style={{ fontSize: "14px" }}>{p?.n}</b>
                                    <span style={{ fontSize: "12px", opacity: ".75" }}>{"المستخدم يشوف: "}{p?.client}</span>
                                  </span>
                                </button>
                            ))}
                          </div>
                          <button type="button" onClick={v.openB} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", borderRadius: "22px", border: "1px solid rgba(134,220,234,.4)", background: "linear-gradient(150deg, rgba(14,151,174,.35), rgba(14,151,174,.08))", color: "#FFFFFF", cursor: "pointer", fontFamily: "inherit", textAlign: "right" }}>
                            <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#04121F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5" /></svg>
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <b style={{ fontSize: "16px" }}>جهّز التخصيص</b>
                              <span style={{ fontSize: "13px", color: "#B8CCD6" }}>سوّ الختم أو الألوان أو شاشة التحميل، وسلّمه لحسابهم</span>
                            </span>
                          </button>
                          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "700" }}>
                            السعر المتفق عليه
                            <input className="fld" value={v.sel?.price ?? ''} onChange={v.sel?.onPrice} placeholder="مثال: 99 ر.س" />
                          </label>
                          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: "700" }}>
                            رسالة للمستخدم
                            <textarea value={v.msg ?? ''} onChange={v.onMsg} placeholder="تظهر للمستخدم في صفحة طلباتها" style={{ minHeight: "90px", borderRadius: "22px", border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", padding: "14px 18px", fontSize: "15px", fontFamily: "inherit", color: "#EAF4F7" }} />
                          </label>
                          <button type="button" onClick={v.sendMsg} style={{ height: "52px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>{v.msgTx}</button>
                        </section>
                    ) : null}
                  </div>
                </div>
            ) : null}
            {v.vSvc ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <h3 style={{ margin: "0", fontSize: "19px" }}>خدمات التخصيص</h3>
                        <span style={{ fontSize: "13px", color: "#9FB8C6" }}>اللي يشوفه المستخدمين في صفحة الشراء والطلبات</span>
                      </span>
                      <button type="button" onClick={v.openAdd} style={{ height: "46px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>+ خدمة جديدة</button>
                    </div>
                    {v.adding ? (
                      <div className="g3" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,.8fr) auto", gap: "10px", alignItems: "center", padding: "14px", borderRadius: "24px", background: "rgba(255,255,255,.07)" }}>
                          <input className="fld" value={v.nN ?? ''} onChange={v.onNN} placeholder="اسم الخدمة" />
                          <input className="fld" value={v.nD ?? ''} onChange={v.onND} placeholder="وصف قصير" />
                          <input className="fld" value={v.nP ?? ''} onChange={v.onNP} placeholder="السعر أو فاضي = حسب الطلب" />
                          <button type="button" onClick={v.addSvc} style={{ height: "50px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>أضف</button>
                        </div>
                    ) : null}
                    <div className="hidem" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 150px 120px 90px", gap: "14px", padding: "0 14px", fontSize: "13px", color: "#9FB8C6" }}><span>الخدمة</span><span>السعر</span><span>حسب الطلب</span><span>متاحة</span></div>
                    {(v.svcs || []).map((c, $i10) => (
                      <div key={c?.key ?? $i10} className="gt" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 150px 120px 90px", gap: "14px", alignItems: "center", padding: "14px", borderRadius: "22px", background: "rgba(255,255,255,.07)" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}><b style={{ fontSize: "15px" }}>{c?.n}</b><span style={{ fontSize: "13px", color: "#9FB8C6" }}>{c?.d}</span></span>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input className="fld" value={c?.p ?? ''} onChange={c?.onP} disabled={c?.quote} aria-label="السعر" style={S(`${txt(c?.pSt)}`)} />
                            <span style={{ fontSize: "13px", color: "#9FB8C6" }}>ر.س</span>
                          </span>
                          <button type="button" className="tg" aria-label="حسب الطلب" onClick={c?.togQ} style={S(`${txt(c?.qbg)}`)}><span style={S(`${txt(c?.qknob)}`)} /></button>
                          <button type="button" className="tg" aria-label="متاحة" onClick={c?.togA} style={S(`${txt(c?.abg)}`)}><span style={S(`${txt(c?.aknob)}`)} /></button>
                        </div>
                    ))}
                    <span style={{ fontSize: "13px", color: "#9FB8C6" }}>كل الخدمات متاحة مع الرصيد المدفوع بس</span>
                  </section>
                </div>
            ) : null}
            {v.vOrg ? (
              <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h3 style={{ margin: "0", fontSize: "19px" }}>المستخدمين</h3>
                      <span style={{ fontSize: "13px", color: "#9FB8C6" }}>{v.orgCount}</span>
                    </span>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", height: "46px", width: "280px", maxWidth: "100%", padding: "0 18px", borderRadius: "999px", background: "rgba(255,255,255,.07)", boxSizing: "border-box" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A4B58" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
                      <input type="search" value={v.q ?? ''} onChange={v.onQ} placeholder="ابحث بالاسم" aria-label="بحث" style={{ border: "0", outline: "0", background: "transparent", fontSize: "14px", width: "100%", fontFamily: "inherit" }} />
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(v.pf || []).map((f, $i11) => (
                      <button key={f?.key ?? $i11} type="button" onClick={f?.on} style={S(`${txt(f?.st)}`)}>{f?.n}</button>
                    ))}
                  </div>
                  {(v.ents || []).map((e, $i12) => (
                    <div key={e?.key ?? $i12} className="gt" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1.4fr) minmax(0,.8fr)", gap: "14px", alignItems: "center", padding: "14px", borderRadius: "22px", background: "rgba(255,255,255,.07)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
                          <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(134,220,234,.15)", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, serif", fontSize: "18px", flex: "none" }}>{e?.i}</span>
                          <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                            <b style={{ fontSize: "15px" }}>{e?.n}</b>
                            <span style={{ fontSize: "12px", color: "#9FB8C6" }}>{"رصيد "}{e?.plan}{" · "}{e?.kind}</span>
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#B8CCD6" }}>
                          {e?.use}
                          <span style={{ height: "8px", borderRadius: "999px", background: "rgba(14,151,174,.1)", overflow: "hidden", display: "block" }}><span style={S(`${txt(e?.bar)}`)} /></span>
                        </span>
                        <span style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <span className="hidem" style={{ fontSize: "13px", color: "#9FB8C6" }}>{e?.last}</span>
                          {v.canCredit ? (
                            <button type="button" onClick={e?.grant} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>+ رصيد</button>
                          ) : null}
                          {v.isFounder ? (
                            <button type="button" onClick={e?.toggle} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>{e?.toggleL}</button>
                          ) : null}
                        </span>
                      </div>
                  ))}
                  {v.gOpen ? (
                    <div className="in" style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "20px", borderRadius: "26px", background: "rgba(134,220,234,.1)", border: "1px solid rgba(134,220,234,.35)" }}>
                        <b style={{ fontSize: "17px" }}>{v.gTitle}</b>
                        {v.gCredit ? (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <input className="fld" type="number" min="1" max="1000" value={v.gCount ?? ''} onChange={v.onGCount} aria-label="عدد الدعوات" style={{ width: "140px" }} />
                              {(v.gChans || []).map((c, $i13) => (
                                <button key={c?.key ?? $i13} type="button" onClick={c?.pick} style={S(`${txt(c?.st)}`)}>{c?.n}</button>
                              ))}
                            </div>
                        ) : null}
                        <input className="fld" value={v.gReason ?? ''} onChange={v.onGReason} placeholder="السبب (يطلع للمستخدم في سجله)" aria-label="السبب" />
                        <span style={{ display: "flex", gap: "8px" }}>
                          <button type="button" onClick={v.gSave} style={{ height: "46px", padding: "0 24px", border: "0", borderRadius: "999px", background: "#86DCEA", color: "#04121F", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>تأكيد</button>
                          <button type="button" onClick={v.gClose} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>إلغاء</button>
                        </span>
                      </div>
                  ) : null}
                </section>
            ) : null}
            {v.vSub ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <section className="in" style={{ borderRadius: "30px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                    <h3 style={{ margin: "0", fontSize: "19px" }}>طلبات شراء تنتظر تأكيد الدفع</h3>
                    {(v.pend || []).map((o, $i14) => (
                      <div key={o?.key ?? $i14} style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", padding: "14px 16px", borderRadius: "22px", background: "rgba(255,255,255,.07)" }}>
                          <span style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "3px" }}>
                            <b style={{ fontSize: "15px" }}>{o?.t}</b>
                            <span style={{ fontSize: "13px", color: "#9FB8C6" }}>{o?.d}</span>
                            <span style={{ fontSize: "13px", color: "#B8CCD6", direction: "ltr", textAlign: "right" }}>{o?.c}</span>
                          </span>
                          <b style={{ fontFamily: "TD, serif", fontSize: "24px" }}>{o?.p}</b>
                          <button type="button" onClick={o?.ok} style={{ height: "44px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#fff", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>انقبض المبلغ · نزّل الرصيد</button>
                          <button type="button" onClick={o?.no} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>إلغاء</button>
                        </div>
                    ))}
                    {v.noPend ? (
                      <span style={{ fontSize: "14px", color: "#9FB8C6" }}>ما فيه طلبات معلّقة</span>
                    ) : null}
                  </section>
                  <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "14px" }}>
                    {(v.plansFull || []).map((p, $i15) => (
                      <div key={p?.key ?? $i15} className="in" style={{ borderRadius: "28px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                          <b style={{ fontSize: "20px" }}>{p?.n}</b>
                          <span style={{ fontFamily: "TD, serif", fontSize: "36px", lineHeight: "1.1" }}>{p?.price}</span>
                          <span style={{ fontSize: "14px", color: "#B8CCD6", lineHeight: "1.7" }}>{p?.lim}</span>
                          <span style={{ height: "1px" }} />
                          <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span>انباعت</span><b>{p?.c}</b></span>
                          <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}><span>الإيراد</span><b>{p?.r}</b></span>
                        </div>
                    ))}
                  </div>
                </div>
            ) : null}
            {v.vPriv ? (
              <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
                  <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}><h3 style={{ margin: "0", fontSize: "19px" }}>قواعد الخصوصية</h3></span>
                    {(v.rules || []).map((r, $i16) => (
                      <div key={r?.key ?? $i16} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 14px", borderRadius: "20px", background: "rgba(255,255,255,.07)" }}>
                          <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#0E97AE", color: "#fff", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{"✓"}</span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <b style={{ fontSize: "15px" }}>{r?.t}</b>
                            <span style={{ fontSize: "13px", color: "#9FB8C6", lineHeight: "1.7" }}>{r?.d}</span>
                          </span>
                        </div>
                    ))}
                  </section>
                  <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h3 style={{ margin: "0", fontSize: "19px" }}>سجل الاطلاع</h3>
                      <span style={{ fontSize: "13px", color: "#9FB8C6" }}>المستخدم يشوف سجله</span>
                    </span>
                    {(v.audit || []).map((a, $i17) => (
                      <div key={a?.key ?? $i17} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 14px", borderRadius: "20px", background: "rgba(255,255,255,.07)" }}>
                          <span style={{ flex: "none", width: "56px", fontSize: "13px", color: "#9FB8C6", direction: "ltr", textAlign: "right" }}>{a?.time}</span>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <b style={{ fontSize: "14px" }}>{a?.who}{" · "}{a?.what}</b>
                            <span style={{ fontSize: "13px", color: "#9FB8C6" }}>{"السبب: "}{a?.why}</span>
                          </span>
                        </div>
                    ))}
                  </section>
                </div>
            ) : null}
            {v.vPE ? (
              <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <b style={{ fontSize: "16px" }}>1. اختر المحرك</b>
                        <span style={{ fontSize: "13px", color: "#9FB8C6" }}>النمط الجديد يتبني على حركة موجودة</span>
                      </span>
                      <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px" }}>
                        {(v.peEng || []).map((e, $i18) => (
                          <button key={e?.key ?? $i18} type="button" onClick={e?.pick} style={S(`${txt(e?.st)}`)}><b style={{ fontSize: "14px" }}>{e?.n}</b><span style={{ fontSize: "12px", color: "#9FB8C6" }}>{e?.d}</span></button>
                        ))}
                        <A href="#" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "2px", padding: "12px 14px", borderRadius: "18px", border: "2px dashed rgba(134,220,234,.35)", color: "#86DCEA" }}>
                          <b style={{ fontSize: "14px" }}>حركة جديدة كليًا</b>
                          <span style={{ fontSize: "12px", color: "#9FB8C6" }}>تحتاج مبرمج، وبعدها تصير محرك هنا</span>
                        </A>
                      </div>
                    </div>
                    <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                      <b style={{ fontSize: "16px" }}>2. الألوان</b>
                      <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "10px" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                          الخلفية فوق
                          <input type="color" value={v.peC1 ?? ''} onChange={v.onPe1} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                          الخلفية تحت
                          <input type="color" value={v.peC2 ?? ''} onChange={v.onPe2} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                          لون الحركة
                          <input type="color" value={v.peC3 ?? ''} onChange={v.onPe3} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                          لون العنوان
                          <input type="color" value={v.peTx ?? ''} onChange={v.onPeTx} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                        </label>
                      </div>
                    </div>
                    <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                      <b style={{ fontSize: "16px" }}>3. الحركة</b>
                      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                          الكثافة
                          <input type="range" min="10" max="100" value={v.peDen ?? ''} onChange={v.onPeDen} style={{ width: "100%", accentColor: "#86DCEA" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                          السرعة
                          <input type="range" min="10" max="100" value={v.peSpd ?? ''} onChange={v.onPeSpd} style={{ width: "100%", accentColor: "#86DCEA" }} />
                        </label>
                      </div>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                        عنوان للمعاينة
                        <input className="fld" value={v.peTitle ?? ''} onChange={v.onPeTitle} placeholder="اسم المناسبة" />
                      </label>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "46px", padding: "0 18px", borderRadius: "999px", border: "1px dashed rgba(134,220,234,.5)", background: "rgba(134,220,234,.08)", color: "#86DCEA", fontSize: "14px", fontWeight: "700", cursor: "pointer", alignSelf: "flex-start" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
                          حط شعار داخل الحركة (اختياري)
                          <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={v.onPeLogo} style={{ display: "none" }} />
                        </label>
                        {v.peHasLogo ? (
                          <button type="button" onClick={v.clearPeLogo} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "#EAF4F7", fontSize: "13px", cursor: "pointer" }}>شيل الشعار</button>
                        ) : null}
                      </div>
                    </div>
                    <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                      <b style={{ fontSize: "16px" }}>4. احفظه</b>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                        اسم النمط
                        <input className="fld" value={v.peName ?? ''} onChange={v.onPeName} placeholder="مثال: نجوم ذهبية" />
                      </label>
                      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {(v.peScopes || []).map((o, $i19) => (
                          <button key={o?.key ?? $i19} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}><b style={{ fontSize: "14px" }}>{o?.n}</b><span style={{ fontSize: "12px", color: "#9FB8C6" }}>{o?.d}</span></button>
                        ))}
                      </div>
                      {v.pePriv ? (
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                            المستخدم
                            <select className="fld" value={v.peUser ?? ''} onChange={v.onPeUser}>
                              {(v.peUsers || []).map((u, $i20) => (
                                <option key={u?.key ?? $i20} value={u?.v}>{u?.n}</option>
                              ))}
                            </select>
                          </label>
                      ) : null}
                      <button type="button" onClick={v.peSave} style={{ height: "54px", border: "0", borderRadius: "999px", background: "#86DCEA", color: "#04121F", fontWeight: "700", fontSize: "16px", cursor: "pointer", fontFamily: "inherit" }}>احفظ النمط</button>
                      {v.peSaved ? (
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#86DCEA" }}>{v.peSavedTx}</span>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ position: "sticky", top: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "22px", borderRadius: "30px", background: "rgba(0,0,0,.18)", border: "1px solid rgba(255,255,255,.08)" }}>
                    <span style={{ fontSize: "13px", color: "#9FB8C6", fontWeight: "700" }}>معاينة مباشرة</span>
                    <div style={{ position: "relative", width: "230px", height: "470px", borderRadius: "38px", background: "#04121F", boxShadow: "0 0 0 6px #0b2233, 0 30px 60px rgba(0,0,0,.45)", overflow: "hidden", flex: "none" }}>
                      <span style={S(`${txt(v.peBg)}`)} />
                      <canvas ref={v.setPE} aria-hidden="true" style={{ position: "absolute", inset: "0", width: "230px", height: "470px" }} />
                      {v.peHasLogo ? (
                        <img src={v.peLogo} alt="" style={{ position: "absolute", left: "50%", top: "150px", width: "70px", marginLeft: "-35px", opacity: ".9", animation: "bob 5s ease-in-out infinite" }} />
                      ) : null}
                      <span style={S(`position: absolute; left: 12px; right: 12px; top: 78px; text-align: center; font-family: TD, serif; font-size: 28px; line-height: 1.3; color: ${txt(v.peTx)}; text-shadow: 0 2px 16px rgba(0,0,0,.4);`)}>{v.peTitleShow}</span>
                      <span style={{ position: "absolute", left: "14px", right: "14px", bottom: "14px", height: "220px", borderRadius: "22px", background: "#FAFBFC" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#9FB8C6", textAlign: "center", lineHeight: "1.7" }}>المعاينة تقريبية، والنمط النهائي يطلع بنفس جودة الأنماط الحالية</span>
                  </div>
                </div>
            ) : null}
            {v.vTeam ? (
              <section className="in" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h3 style={{ margin: "0", fontSize: "19px" }}>فريق الإدارة</h3>
                      <span style={{ fontSize: "13px", color: "#9FB8C6" }}>الدخول بالإيميلات الشخصية المسموحة بس، ويوصل رمز التحقق عليها</span>
                    </span>
                    <button type="button" onClick={v.openAdd} style={{ height: "46px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>+ أضف عضو</button>
                  </div>
                  {v.addOpen ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "18px", borderRadius: "24px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(134,220,234,.3)" }}>
                        <b style={{ fontSize: "16px" }}>عضو جديد في الفريق</b>
                        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <input className="fld" value={v.mName ?? ''} onChange={v.onMName} placeholder="الاسم" aria-label="الاسم" />
                          <input className="fld" type="email" value={v.mMail ?? ''} onChange={v.onMMail} placeholder="الإيميل الشخصي" aria-label="الإيميل" style={{ direction: "ltr", textAlign: "right" }} />
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", opacity: ".8" }}>الدور</span>
                          {(v.roles || []).map((o, $i21) => (
                            <button key={o?.key ?? $i21} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}>{o?.n}</button>
                          ))}
                        </div>
                        <span style={{ fontSize: "12px", opacity: ".75", lineHeight: "1.7" }}>نرسل له رمز تفعيل على إيميله، وأول ما يفعّله يقدر يدخل الاستوديو بنفس الإيميل</span>
                        {v.mErr ? (
                          <span style={{ fontSize: "13px", color: "#FFB4B4" }}>اكتب اسم وإيميل صحيح</span>
                        ) : null}
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button type="button" onClick={v.addMember} style={{ height: "46px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#86DCEA", color: "#04121F", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>أرسل رمز التفعيل</button>
                          <button type="button" onClick={v.openAdd} style={{ height: "46px", padding: "0 20px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "inherit", fontSize: "14px", cursor: "pointer" }}>إلغاء</button>
                        </div>
                      </div>
                  ) : null}
                  {v.mSent ? (
                    <span style={{ fontSize: "13px", color: "#86DCEA", fontWeight: "700" }}>أرسلنا رمز التفعيل ✓ ويطلع العضو هنا «بانتظار التفعيل» لين يفعّله</span>
                  ) : null}
                  {(v.team || []).map((m, $i22) => (
                    <div key={m?.key ?? $i22} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", borderRadius: "22px", background: "rgba(255,255,255,.07)" }}>
                        <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, serif", fontSize: "18px" }}>{m?.i}</span>
                        <span style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                          <b style={{ fontSize: "15px" }}>{m?.n}</b>
                          <span style={{ fontSize: "13px", color: "#9FB8C6", direction: "ltr", textAlign: "right" }}>{m?.mail}</span>
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "700", padding: "6px 14px", borderRadius: "999px", background: "rgba(134,220,234,.15)", color: "#86DCEA" }}>{m?.role}</span>
                        {m?.rm ? (
                          <button type="button" onClick={m?.rm} aria-label={`شيل ${txt(m?.n)}`} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(134,220,234,.4)", background: "transparent", color: "#86DCEA", fontFamily: "inherit", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>شيل</button>
                        ) : null}
                      </div>
                  ))}
                </section>
            ) : null}
            {v.bOpen ? (
              <div style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(2,12,22,.7)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                  <div className="bld" style={{ width: "100%", maxWidth: "1080px", maxHeight: "94vh", overflow: "auto", boxSizing: "border-box", borderRadius: "34px", padding: "26px", background: "linear-gradient(160deg, #0B3550, #061C2E)", border: "1px solid rgba(134,220,234,.25)", boxShadow: "0 40px 90px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", gap: "18px", color: "#EAF4F7" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <b style={{ fontFamily: "TD, serif", fontSize: "30px", lineHeight: "1.3" }}>جهّز التخصيص</b>
                        <span style={{ fontSize: "14px", color: "#9FB8C6" }}>{v.bWhat}{" · لـ "}{v.bWho}</span>
                      </span>
                      <button type="button" onClick={v.closeB} aria-label="إغلاق" style={{ width: "42px", height: "42px", borderRadius: "50%", border: "0", background: "rgba(255,255,255,.1)", color: "#FFFFFF", fontSize: "18px", cursor: "pointer" }}>{"×"}</button>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(v.bTabs || []).map((t, $i23) => (
                        <button key={t?.key ?? $i23} type="button" onClick={t?.pick} style={S(`${txt(t?.st)}`)}>{t?.n}</button>
                      ))}
                    </div>
                    <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {v.bT0 ? (
                          <><div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                              <b style={{ fontSize: "15px" }}>لون الشمع</b>
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                                {(v.bSw || []).map((w, $i24) => (
                                  <button key={w?.key ?? $i24} type="button" onClick={w?.pick} aria-label={w?.n} style={S(`${txt(w?.st)}`)} />
                                ))}
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#9FB8C6" }}>
                                  لون ثاني
                                  <input type="color" value={v.bWax ?? ''} onChange={v.onWax} style={{ width: "44px", height: "38px", border: "0", borderRadius: "12px", background: "transparent", cursor: "pointer" }} />
                                </label>
                              </div>
                            </div>
                          <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                              <b style={{ fontSize: "15px" }}>داخل الختم</b>
                              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                                نص الختم (8 حروف بالكثير)
                                <input className="fld" value={v.bText ?? ''} onChange={v.onBText} placeholder="مثال: سفير" />
                              </label>
                              <span style={{ fontSize: "13px", color: "#9FB8C6" }}>أو حط شعارهم بدل النص</span>
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "46px", padding: "0 18px", borderRadius: "999px", border: "1px dashed rgba(134,220,234,.5)", background: "rgba(134,220,234,.08)", color: "#86DCEA", fontSize: "14px", fontWeight: "700", cursor: "pointer", alignSelf: "flex-start" }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
                                  ارفع الشعار (SVG أو PNG شفاف)
                                  <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={v.onLogo} style={{ display: "none" }} />
                                </label>
                                {v.bHasLogo ? (
                                  <button type="button" onClick={v.clearLogo} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "#EAF4F7", fontSize: "13px", cursor: "pointer" }}>شيل الشعار</button>
                                ) : null}
                              </div>
                            </div></>
                        ) : null}
                        {v.bT1 ? (
                          <><div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                              <b style={{ fontSize: "15px" }}>النمط</b>
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {(v.bPats || []).map((p, $i25) => (
                                  <button key={p?.key ?? $i25} type="button" onClick={p?.pick} style={S(`${txt(p?.st)}`)}>{p?.n}</button>
                                ))}
                              </div>
                            </div>
                          <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                              <b style={{ fontSize: "15px" }}>ألوان هويتهم</b>
                              <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                                  الخلفية فوق
                                  <input type="color" value={v.bC1 ?? ''} onChange={v.onC1} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                                  الخلفية تحت
                                  <input type="color" value={v.bC2 ?? ''} onChange={v.onC2} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                                  لون الحركة والعنوان
                                  <input type="color" value={v.bC3 ?? ''} onChange={v.onC3} style={{ width: "100%", height: "46px", border: "0", borderRadius: "14px", background: "transparent", cursor: "pointer" }} />
                                </label>
                              </div>
                            </div></>
                        ) : null}
                        {v.bT2 ? (
                          <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                              <b style={{ fontSize: "15px" }}>شاشة التحميل</b>
                              <span style={{ fontSize: "13px", color: "#9FB8C6", lineHeight: "1.7" }}>تطلع أول ما المدعو يفتح الدعوة، بدل ختم حيّــاك</span>
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "46px", padding: "0 18px", borderRadius: "999px", border: "1px dashed rgba(134,220,234,.5)", background: "rgba(134,220,234,.08)", color: "#86DCEA", fontSize: "14px", fontWeight: "700", cursor: "pointer", alignSelf: "flex-start" }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
                                  ارفع الشعار
                                  <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={v.onLogo} style={{ display: "none" }} />
                                </label>
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#9FB8C6" }}>
                                  لون الخلفية
                                  <input type="color" value={v.bLoadBg ?? ''} onChange={v.onLoadBg} style={{ width: "44px", height: "38px", border: "0", borderRadius: "12px", background: "transparent", cursor: "pointer" }} />
                                </label>
                              </div>
                            </div>
                        ) : null}
                        <div style={{ borderRadius: "26px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                          <b style={{ fontSize: "15px" }}>وين ينحفظ؟</b>
                          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {(v.bScopes || []).map((o, $i26) => (
                              <button key={o?.key ?? $i26} type="button" onClick={o?.pick} style={S(`${txt(o?.st)}`)}><b style={{ fontSize: "14px" }}>{o?.n}</b><span style={{ fontSize: "12px", color: "#9FB8C6" }}>{o?.d}</span></button>
                            ))}
                          </div>
                          {v.bPublic ? (
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                                اسم التصميم للكل
                                <input className="fld" value={v.bName ?? ''} onChange={v.onBName} placeholder="مثال: ليلي ذهبي" />
                              </label>
                          ) : null}
                        </div>
                      </div>
                      <div style={{ position: "sticky", top: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "20px", borderRadius: "28px", background: "rgba(0,0,0,.2)" }}>
                        <span style={{ fontSize: "13px", color: "#9FB8C6", fontWeight: "700" }}>معاينة مباشرة</span>
                        {v.bT0 ? (
                          <><div style={{ width: "190px", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.45))", animation: "bob 5s ease-in-out infinite" }}>
                              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                                <defs>
                                  <radialGradient id="bWg" cx="34%" cy="26%" r="85%">
                                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".55" />
                                    <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
                                  </radialGradient>
                                  <clipPath id="bClip"><circle cx="50" cy="50" r="27" /></clipPath>
                                </defs>
                                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                                <path d={v.wax} fill={v.bWax} />
                                <path d={v.wax} fill="url(#bWg)" />
                                <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="2.5" />
                                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                                <foreignObject x="18" y="30" width="64" height="40" opacity={v.bTxtOp}>
                                  <div xmlns="http://www.w3.org/1999/xhtml" style={S(`width: 64px; height: 40px; display: flex; align-items: center; justify-content: center; font-family: TD, serif; font-weight: 700; font-size: ${txt(v.bTextFs)}px; line-height: 1; color: #FFFFFF; text-shadow: 0 1px 2px rgba(0,0,0,.3); white-space: nowrap;`)}>{v.bText}</div>
                                </foreignObject>
                                <image href={v.bLogoH} x="23" y="23" width="54" height="54" preserveAspectRatio="xMidYMid meet" clipPath="url(#bClip)" opacity={v.bLogoOp} />
                              </svg>
                            </div>
                          <div style={{ width: "100%", maxWidth: "280px", borderRadius: "22px", background: "#FAFBFC", color: "#0A2A43", padding: "16px 16px 16px 70px", position: "relative", boxSizing: "border-box" }}>
                              <span style={{ position: "absolute", left: "10px", top: "-14px", width: "64px" }}>
                                <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                                  <defs>
                                    <radialGradient id="bWg2" cx="34%" cy="26%" r="85%">
                                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity=".55" />
                                      <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
                                    </radialGradient>
                                    <clipPath id="bClip2"><circle cx="50" cy="50" r="27" /></clipPath>
                                  </defs>
                                  <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                                  <path d={v.wax} fill={v.bWax} />
                                  <path d={v.wax} fill="url(#bWg2)" />
                                  <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="2.5" />
                                  <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                                  <foreignObject x="18" y="30" width="64" height="40" opacity={v.bTxtOp}>
                                    <div xmlns="http://www.w3.org/1999/xhtml" style={S(`width: 64px; height: 40px; display: flex; align-items: center; justify-content: center; font-family: TD, serif; font-weight: 700; font-size: ${txt(v.bTextFs)}px; line-height: 1; color: #FFFFFF; text-shadow: 0 1px 2px rgba(0,0,0,.3); white-space: nowrap;`)}>{v.bText}</div>
                                  </foreignObject>
                                  <image href={v.bLogoH} x="23" y="23" width="54" height="54" preserveAspectRatio="xMidYMid meet" clipPath="url(#bClip2)" opacity={v.bLogoOp} />
                                </svg>
                              </span>
                              <span style={{ fontSize: "11px", color: "#4A5B68" }}>نتشرّف بدعوة</span>
                              <b style={{ display: "block", fontFamily: "TD, serif", fontSize: "22px" }}>سارة أحمد</b>
                              <span style={{ fontSize: "11px", color: "#4A5B68" }}>كذا يطلع الختم على بطاقة المدعو</span>
                            </div></>
                        ) : null}
                        {v.bT1 ? (
                          <div style={{ position: "relative", width: "230px", height: "470px", borderRadius: "38px", background: "#04121F", boxShadow: "0 0 0 6px #0b2233, 0 30px 60px rgba(0,0,0,.45)", overflow: "hidden", flex: "none" }}>
                              <span style={S(`${txt(v.bPhoneBg)}`)} />
                              <span style={S(`position: absolute; left: 0; right: 0; top: 70px; text-align: center; font-family: TD, serif; font-size: 30px; color: ${txt(v.bC3)}; text-shadow: 0 0 18px ${txt(v.bC3)};`)}>الحفل الختامي</span>
                              <span style={{ position: "absolute", left: "0", right: "0", top: "116px", textAlign: "center", fontSize: "11px", letterSpacing: "3px", color: "rgba(255,255,255,.7)" }}>{v.bPatName}</span>
                              <span className="tw" style={S(`position: absolute; left: 30px; top: 40px; width: 4px; height: 4px; border-radius: 50%; background: ${txt(v.bC3)};`)} />
                              <span className="tw" style={S(`position: absolute; left: 180px; top: 150px; width: 3px; height: 3px; border-radius: 50%; background: ${txt(v.bC3)}; animation-delay: .7s;`)} />
                              <span className="tw" style={{ position: "absolute", left: "120px", top: "30px", width: "3px", height: "3px", borderRadius: "50%", background: "#FFFFFF", animationDelay: "1.4s" }} />
                              <span style={{ position: "absolute", left: "14px", right: "14px", bottom: "14px", height: "250px", borderRadius: "22px", background: "#FAFBFC" }} />
                            </div>
                        ) : null}
                        {v.bT2 ? (
                          <div style={S(`position: relative; width: 230px; height: 470px; border-radius: 38px; background: #04121F; box-shadow: 0 0 0 6px #0b2233, 0 30px 60px rgba(0,0,0,.45); overflow: hidden; flex: none; background: ${txt(v.bLoadBg)}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;`)}>
                              <span style={{ width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", animation: "lpulse 1.8s ease-in-out infinite" }}>
                                {v.bHasLogo ? (
                                  <img src={v.bLogo} alt="الشعار" style={{ maxWidth: "76px", maxHeight: "76px" }} />
                                ) : null}
                                {v.bNoLogo ? (
                                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,.7)" }}>شعارهم هنا</span>
                                ) : null}
                              </span>
                              <span style={{ fontSize: "13px", color: "rgba(255,255,255,.8)" }}>نجهّز دعوتك…</span>
                            </div>
                        ) : null}
                      </div>
                    </div>
                    {v.bNotDone ? (
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-start", flexWrap: "wrap" }}>
                          <button type="button" onClick={v.bApprove} style={{ height: "54px", padding: "0 30px", border: "0", borderRadius: "999px", background: "#86DCEA", color: "#04121F", fontWeight: "700", fontSize: "16px", cursor: "pointer", fontFamily: "inherit" }}>اعتمد وسلّم</button>
                          <button type="button" onClick={v.bPreview} style={{ height: "54px", padding: "0 24px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.25)", background: "transparent", color: "#EAF4F7", fontSize: "15px", cursor: "pointer", fontFamily: "inherit" }}>أرسل معاينة للمستخدم</button>
                        </div>
                    ) : null}
                    {v.bDone ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderRadius: "20px", background: "rgba(134,220,234,.15)", color: "#86DCEA", fontWeight: "700", fontSize: "15px" }}>{v.bDoneTx}</span>
                    ) : null}
                  </div>
                </div>
            ) : null}
          </main>
          {v.tourAsk ? (
            <div style={{ position: "fixed", inset: "0", zIndex: "95", background: "rgba(2,12,22,.6)", WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div className="tin" style={{ width: "100%", maxWidth: "440px", borderRadius: "34px", background: "#FAFBFC", color: "#0A2A43", padding: "30px 26px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", boxShadow: "0 40px 90px rgba(0,0,0,.4)" }}>
                  <svg width="72" height="72" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible" }}>
                    <defs>
                      <radialGradient id="taS" cx="34%" cy="26%" r="85%">
                        <stop offset="0%" stopColor="#A6EEF7" />
                        <stop offset="30%" stopColor="#4FC9DC" />
                        <stop offset="65%" stopColor="#0E97AE" />
                        <stop offset="100%" stopColor="#05505E" />
                      </radialGradient>
                    </defs>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#taS)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity=".45" strokeWidth="2.5" />
                    <text x="50" y="58.8" textAnchor="middle" fontFamily="TD" fontSize="42" fill="#FFFFFF">{"ح"}</text>
                  </svg>
                  <b style={{ fontFamily: "TD, serif", fontSize: "30px", lineHeight: "1.3" }}>أهلًا في الاستوديو 👋</b>
                  <span style={{ fontSize: "15px", color: "#3A4B58", lineHeight: "1.8" }}>نعرّفك على أقسامه خطوة بخطوة، ولا تستكشفه بنفسك؟</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "6px" }}>
                    <button type="button" onClick={v.tourGo} style={{ height: "54px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>عرّفني عليه</button>
                    <button type="button" onClick={v.tourSkip} style={{ height: "50px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "transparent", color: "#0A2A43", fontFamily: "inherit", fontSize: "15px", cursor: "pointer" }}>أستكشفه بنفسي</button>
                  </div>
                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>ترجع للجولة من زر «دلّني» تحت</span>
                </div>
              </div>
          ) : null}
          {v.touring ? (
            <><div style={{ position: "fixed", inset: "0", zIndex: "89" }} />
            <span className="tspot" style={S(`${txt(v.spot)}`)} />
            <div className="ttip" style={S(`${txt(v.tip)}`)}>
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0E97AE" }}>{v.tStep}</span>
                  <button type="button" onClick={v.tourSkip} style={{ border: "0", background: "transparent", color: "#4A5B68", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}>تخطّ الجولة</button>
                </span>
                <b style={{ fontSize: "19px", lineHeight: "1.4" }}>{v.tTitle}</b>
                <span style={{ fontSize: "14px", color: "#3A4B58", lineHeight: "1.8" }}>{v.tText}</span>
                <span style={{ display: "flex", gap: "4px", direction: "ltr", justifyContent: "flex-end" }}>
                  {(v.tDots || []).map((d, $i27) => (
                    <span key={d?.key ?? $i27} style={S(`${txt(d?.st)}`)} />
                  ))}
                </span>
                <span style={{ display: "flex", gap: "8px" }}>
                  <button type="button" onClick={v.tNext} style={{ height: "44px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontFamily: "inherit", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>{v.tNextTx}</button>
                  {v.tHasPrev ? (
                    <button type="button" onClick={v.tPrev} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "transparent", color: "#0A2A43", fontFamily: "inherit", fontSize: "14px", cursor: "pointer" }}>السابق</button>
                  ) : null}
                </span>
              </div></>
          ) : null}
        </div>
      </div>
    </>
  );
}
