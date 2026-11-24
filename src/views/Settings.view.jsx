import { S, txt, A } from '@/ui/dc';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:#086577}a:hover{color:#0A2A43}
input,button{font-family:'IBM Plex Sans Arabic',sans-serif}
.glass{background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(26px) saturate(1.4);backdrop-filter:blur(26px) saturate(1.4);border:1px solid rgba(255,255,255,.85);box-shadow:0 24px 60px rgba(10,42,67,.08),inset 0 1px 0 rgba(255,255,255,.9)}
.lift{transition:transform .25s ease,box-shadow .25s ease}.lift:hover{transform:translateY(-3px);box-shadow:0 30px 70px rgba(10,42,67,.13),inset 0 1px 0 rgba(255,255,255,.9)}
.nav{transition:background .2s ease}.nav:hover{background:rgba(14,151,174,.08)}
.row{transition:background .2s ease}.row:hover{background:rgba(255,255,255,.6)}
.in{animation:rise .5s cubic-bezier(.2,.8,.2,1) both}
.growX{transform-origin:100% 50%;animation:growX 1.1s cubic-bezier(.2,.8,.2,1) both}
.grow{transform-origin:50% 100%;animation:grow 1s cubic-bezier(.2,.8,.2,1) both}
.orb{animation:drift 14s ease-in-out infinite}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes growX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-22px)}}
@keyframes dash{from{stroke-dasharray:0 100}}
@keyframes seal{0%{opacity:0;transform:scale(1.7) rotate(-30deg)}60%{opacity:1;transform:scale(.92) rotate(-8deg)}100%{opacity:1;transform:rotate(-11deg)}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
.bnav{display:none}
@media (min-width: 600px) and (max-width: 1180px){.g3{grid-template-columns:repeat(2,minmax(0,1fr)) !important;grid-auto-flow:dense}.s2,.s3{grid-column:span 2 !important}.ov{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.ov > :last-child{grid-column:span 2}.side{flex-basis:220px !important}}
@media (max-width: 599px){.g3,.ov{grid-template-columns:minmax(0,1fr) !important}.s2,.s3,.ov > :last-child{grid-column:auto !important}}
@media (max-width: 900px){.side{display:none !important}.bnav{display:flex !important}.g2,.k2{grid-template-columns:minmax(0,1fr) !important}.pg{padding:12px 12px 100px !important}.mn{padding:8px 2px 20px !important;gap:16px !important}.tbl{grid-template-columns:minmax(0,1fr) auto !important}.hidem{display:none !important}.h1m{font-size:30px !important}.hero{height:200px !important}.hero h2{font-size:34px !important}.srch{width:100% !important}.card{padding:16px !important;border-radius:24px !important}.ovd{justify-content:center}}
h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
@media (max-width: 1180px){.kp{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.kq{grid-column:span 2}.mid,.bot{grid-template-columns:minmax(0,1fr) !important}}
@media (max-width: 599px){.kp{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important}.kp > section{padding:16px !important}.kp b{font-size:30px}.kq b{font-size:17px !important}.kq{flex-direction:column;align-items:flex-start !important}.kp > section:last-child{grid-column:span 2}.stg2{grid-template-columns:minmax(0,1fr) !important}.ust b{font-size:22px !important}}
.tourb{height:48px;padding:0 18px;border-radius:999px;border:1px solid rgba(14,151,174,.3);background:rgba(230,246,249,.8);color:#086577;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.tspot{position:fixed;z-index:90;border-radius:28px;box-shadow:0 0 0 9999px rgba(4,18,31,.6),0 0 0 4px #86DCEA;pointer-events:none;transition:all .45s cubic-bezier(.2,.8,.2,1)}
.ttip{position:fixed;z-index:91;width:340px;box-sizing:border-box;border-radius:26px;background:#FAFBFC;padding:18px 20px;display:flex;flex-direction:column;gap:10px;color:#0A2A43;box-shadow:0 30px 70px rgba(0,0,0,.35);transition:top .45s cubic-bezier(.2,.8,.2,1),left .45s cubic-bezier(.2,.8,.2,1);animation:tIn .4s ease-out both}
.tin{animation:tIn .45s cubic-bezier(.2,.8,.2,1) both}
@keyframes tIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
@media (max-width: 599px){.tourb{height:42px;padding:0 14px;font-size:13px}}

h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
.chip{transition:background .2s ease,color .2s ease}
.tg{position:relative;width:52px;height:30px;border-radius:999px;border:0;cursor:pointer;transition:background .25s ease;flex:none}
.tg span{position:absolute;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);transition:right .25s ease}
.fld{height:50px;border-radius:999px;border:1px solid rgba(10,42,67,.16);background:#fff;padding:0 20px;font-size:15px;color:#0A2A43;width:100%;box-sizing:border-box;font-family:'IBM Plex Sans Arabic',sans-serif}
.fld:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
@media (max-width: 900px){.g4{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.gcards{grid-template-columns:minmax(0,1fr) !important}.split{grid-template-columns:minmax(0,1fr) !important}.gt{grid-template-columns:minmax(0,1fr) auto !important}}
@media (min-width: 901px) and (max-width: 1180px){.gcards{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.split{grid-template-columns:minmax(0,1fr) !important}}
h2,h3{font-family:TS,'IBM Plex Sans Arabic',sans-serif;font-weight:700}`;

export default function SettingsView({ v }) {
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
          <nav aria-label="التنقل الرئيسي" className="glass side" style={{ flex: "0 0 250px", boxSizing: "border-box", padding: "24px 16px", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
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
            <A href="Create.dc.html" data-tour="1" style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "15px", boxShadow: "0 10px 24px rgba(14,151,174,.35)" }}>
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
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px", padding: "14px", borderRadius: "20px", background: "rgba(255,255,255,.65)" }}>
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
          <nav aria-label="التنقل" className="bnav glass" style={{ position: "fixed", left: "12px", right: "12px", bottom: "12px", zIndex: "20", height: "66px", borderRadius: "24px", padding: "0 8px", justifyContent: "space-around", alignItems: "center" }}>
            {" "}
            {(v.bnav || []).map((b, $i2) => (
              <A key={b?.key ?? $i2} href={b?.href} style={S(`${txt(b?.st)}`)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={b?.ic} /></svg>
                  {b?.label}
                </A>
            ))}
            {" "}
            <A href="Create.dc.html" data-tour="1" aria-label="إنشاء دعوة" style={{ order: "2", width: "52px", height: "52px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(14,151,174,.4)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            </A>
            {" "}
          </nav>
          <main className="mn" style={{ flex: "1 1 auto", minWidth: "0", boxSizing: "border-box", padding: "24px 14px 40px", display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="tourb" onClick={v.startTour}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.6M12 17h.01" /></svg>
                دلّني
              </button>
            </div>
            <header data-t="t0" className="in">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.15" }}>الإعدادات</h1>
                <p style={{ margin: "0", fontSize: "15px", color: "#3A4B58" }}>بياناتك وأمان حسابك والإشعارات</p>
              </div>
            </header>
            <div data-t="t1" className="in" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(v.tabs || []).map((t, $i3) => (
                <button key={t?.key ?? $i3} type="button" className="chip" onClick={t?.on} style={S(`${txt(t?.st)}`)}>{t?.n}</button>
              ))}
            </div>
            {v.t0 ? (
              <section data-t="t2" className="in glass card" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "18px", maxWidth: "760px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                    <span style={{ width: "96px", height: "96px", borderRadius: "28px", background: "#FFFFFF", border: "2px dashed rgba(14,151,174,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#4A5B68", overflow: "hidden" }}>
                      {v.side?.hasLogo ? (
                        <img src={v.side?.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : null}
                      {v.side?.noLogo ? (
                        <>شعار</>
                      ) : null}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <b style={{ fontSize: "16px" }}>شعارك</b>
                      <span style={{ fontSize: "13px", color: "#4A5B68" }}>PNG أو SVG بخلفية شفافة</span>
                      <label style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "rgba(255,255,255,.7)", color: "#0A2A43", textDecoration: "none", fontWeight: "700", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        {v.logoTx}
                        <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={v.upLogo} style={{ display: "none" }} />
                      </label>
                    </span>
                  </div>
                  <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#4A5B68" }}>الاسم الظاهر<input className="fld" value={v.ent ?? ''} onChange={v.onEnt} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#4A5B68" }}>نوع الحساب<input className="fld" value={v.kind ?? ''} onChange={v.onKind} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#4A5B68" }}>
                      الإيميل
                      <input className="fld" type="email" value={v.mail ?? ''} onChange={v.onMail} style={{ direction: "ltr", textAlign: "right" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#4A5B68" }}>
                      رقم التواصل
                      <input className="fld" value={v.phone ?? ''} onChange={v.onPhone} style={{ direction: "ltr", textAlign: "right" }} />
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px 16px", borderRadius: "22px", background: "rgba(14,151,174,.1)", border: "1px solid rgba(14,151,174,.22)" }}>
                    <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#0E97AE", color: "#FFFFFF", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>{"؟"}</span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#3A4B58", lineHeight: "1.8" }}>
                      <b style={{ fontSize: "14px", color: "#0A2A43" }}>ليش نطلب بياناتك؟</b>
                      <span>
                        الاسم اللي يظهر في دعواتك ممكن يكون اسمك أو اسم مناسبتك أو شركتك، ويظهر معه شعارك. والإيميل ورقم التواصل نستخدمهم عشان نتواصل معك بخصوص حسابك وطلباتك، وما يظهرون للمدعوين
                      </span>
                    </span>
                  </div>
                  {v.err ? (
                    <span role="alert" style={{ fontSize: "13px", fontWeight: "700", color: "#9A5226" }}>{v.err}</span>
                  ) : null}
                  <button type="button" onClick={v.save} style={{ alignSelf: "flex-start", height: "50px", padding: "0 30px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>{v.saveTx}</button>
                </section>
            ) : null}
            {v.t1 ? (
              <div data-t="t3" style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "760px" }}>
                  <section className="in glass card" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <h3 style={{ margin: "0", fontSize: "18px" }}>تغيير كلمة المرور</h3>
                    <input className="fld" type="password" autoComplete="current-password" value={v.cp ?? ''} onChange={v.onCp} placeholder="كلمة المرور الحالية" aria-label="كلمة المرور الحالية" />
                    <input className="fld" type="password" autoComplete="new-password" value={v.np ?? ''} onChange={v.onNp} placeholder="كلمة المرور الجديدة" aria-label="كلمة المرور الجديدة" />
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ flex: "1", height: "6px", borderRadius: "999px", background: "rgba(10,42,67,.1)", overflow: "hidden" }}><span style={S(`${txt(v.meter)}`)} /></span>
                      <span style={{ fontSize: "13px", color: "#4A5B68" }}>{v.meterTx}</span>
                    </span>
                    <button type="button" onClick={v.savePw} style={{ alignSelf: "flex-start", height: "50px", padding: "0 30px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>{v.pwTx}</button>
                  </section>
                  <section className="in glass card" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h3 style={{ margin: "0", fontSize: "18px" }}>الأجهزة المسجّلة</h3>
                    {(v.devices || []).map((d, $i4) => (
                      <div key={d?.key ?? $i4} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", borderRadius: "20px", background: "rgba(255,255,255,.65)" }}>
                          <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#E6F6F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d={d?.ic} /></svg>
                          </span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column" }}><b style={{ fontSize: "14px" }}>{d?.n}</b><span style={{ fontSize: "12px", color: "#4A5B68" }}>{d?.w}</span></span>
                          {d?.cur ? (
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#086577", padding: "6px 12px", borderRadius: "999px", background: "rgba(14,151,174,.12)" }}>هذا الجهاز</span>
                          ) : null}
                          {d?.can ? (
                            <button type="button" onClick={d?.out} style={{ height: "38px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.2)", background: "#fff", color: "#0A2A43", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>تسجيل خروج</button>
                          ) : null}
                        </div>
                    ))}
                  </section>
                </div>
            ) : null}
            {v.t2 ? (
              <section data-t="t4" className="in glass card" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "760px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "18px" }}>وش يوصلك على البريد</h3>
                  {(v.notifs || []).map((r, $i5) => (
                    <div key={r?.key ?? $i5} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "20px", background: "rgba(255,255,255,.65)" }}>
                        <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}><b style={{ fontSize: "15px" }}>{r?.t}</b><span style={{ fontSize: "13px", color: "#4A5B68" }}>{r?.d}</span></span>
                        <button type="button" className="tg" aria-label={r?.t} onClick={r?.tog} style={S(`${txt(r?.bg)}`)}><span style={S(`${txt(r?.knob)}`)} /></button>
                      </div>
                  ))}
                </section>
            ) : null}
            {v.t1 ? (
              <section className="in glass card" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h3 style={{ margin: "0", fontSize: "18px" }}>سجل الاطلاع</h3>
                  <span style={{ fontSize: "13px", color: "#4A5B68" }}>كل مرة فريق حيّــاك يفتح أو يغيّر شي في حسابك تنسجل هنا</span>
                  {(v.access || []).map((a, $i6) => (
                    <div key={a?.key ?? $i6} style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "12px 14px", borderRadius: "18px", background: "rgba(255,255,255,.65)" }}><b style={{ fontSize: "14px" }}>{a?.t}</b><span style={{ fontSize: "12px", color: "#4A5B68" }}>{a?.d}</span></div>
                  ))}
                  {v.noAccess ? (
                    <span style={{ fontSize: "14px", color: "#3A4B58" }}>ما فيه أي اطلاع للحين</span>
                  ) : null}
                </section>
            ) : null}
            {v.t3 ? (
              <section className="in glass card" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", maxWidth: "760px" }}>
                  <h3 style={{ margin: "0", fontSize: "18px" }}>{"فريق "}{v.side?.org}</h3>
                  <span style={{ fontSize: "13px", color: "#4A5B68", lineHeight: "1.8" }}>المشرف يسوي الدعوات ويرسلها ويفتح الحضور. والمشاهد يشوف الأرقام والقوائم بس</span>
                  {(v.members || []).map((m, $i7) => (
                    <div key={m?.key ?? $i7} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "20px", background: "rgba(255,255,255,.65)" }}>
                        <span style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#DCE4E8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, serif", fontSize: "16px", flex: "none" }}>{m?.i}</span>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          <b style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis" }}>{m?.n}</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68", overflow: "hidden", textOverflow: "ellipsis" }}>{m?.mail}</span>
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#086577", padding: "6px 12px", borderRadius: "999px", background: "rgba(14,151,174,.12)", whiteSpace: "nowrap" }}>{m?.role}</span>
                        {m?.rm ? (
                          <button type="button" onClick={m?.rm} aria-label={`شيل ${txt(m?.n)}`} style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid rgba(10,42,67,.2)", background: "#fff", color: "#0A2A43", cursor: "pointer" }}>{"×"}</button>
                        ) : null}
                      </div>
                  ))}
                  {v.isOwner ? (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <input className="fld" type="email" value={v.nm ?? ''} onChange={v.onNm} placeholder="إيميل العضو" aria-label="إيميل العضو" style={{ flex: "1", minWidth: "200px" }} />
                        {(v.roleOpts || []).map((o, $i8) => (
                          <button key={o?.key ?? $i8} type="button" className="chip" onClick={o?.on} style={S(`${txt(o?.st)}`)}>{o?.n}</button>
                        ))}
                        <button type="button" onClick={v.addMember} style={{ height: "50px", padding: "0 24px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>أرسل دعوة</button>
                      </div>
                  ) : null}
                  {v.teamMsg ? (
                    <span role="status" style={{ fontSize: "13px", fontWeight: "700", color: "#086577" }}>{v.teamMsg}</span>
                  ) : null}
                </section>
            ) : null}
            <span className="in" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={v.side?.logout} style={{ height: "44px", padding: "0 20px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.2)", background: "rgba(255,255,255,.7)", color: "#0A2A43", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>تسجيل خروج</button>
            </span>
            <span data-t="t5" className="in" style={{ fontSize: "13px", color: "#4A5B68" }}>
              {"تبي تحذف الحساب؟ راسلنا على "}
              <A href="mailto:hayyakinfo@gmail.com" style={{ fontWeight: "700" }}>hayyakinfo@gmail.com</A>
            </span>
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
        <FAQ open="لا" />
      </div>
    </>
  );
}
