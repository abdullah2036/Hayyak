import { S, txt, A } from '@/ui/dc';
import Mark from '@/ui/Mark';
import Invite from '@/screens/Invite';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:#086577}a:hover{color:#0A2A43}
input,button{font-family:TS, 'IBM Plex Sans Arabic', sans-serif}
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
.fld{height:50px;border-radius:999px;border:1px solid rgba(10,42,67,.16);background:#fff;padding:0 20px;font-size:15px;color:#0A2A43;width:100%;box-sizing:border-box;font-family:TS, 'IBM Plex Sans Arabic', sans-serif}
.fld:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
@media (max-width: 900px){.g4{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.gcards{grid-template-columns:minmax(0,1fr) !important}.split{grid-template-columns:minmax(0,1fr) !important}.gt{grid-template-columns:minmax(0,1fr) auto !important}}
@media (min-width: 901px) and (max-width: 1180px){.gcards{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.split{grid-template-columns:minmax(0,1fr) !important}}
@media (max-width: 640px){.dz{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important}.dz > div{padding:10px !important;border-radius:22px !important}.ph{width:140px !important;height:290px !important;border-radius:26px !important}.phi{left:6px !important;top:6px !important;transform:scale(.328) !important}.dz b{font-size:18px !important}.dz button{height:30px !important;font-size:11px !important;padding:0 8px !important}}
h2,h3{font-family:TS, 'IBM Plex Sans Arabic', sans-serif;font-weight:700}`;

export default function DesignsView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43", background: "radial-gradient(55% 40% at 88% 4%, #CBEFF5 0%, rgba(203,239,245,0) 70%), radial-gradient(45% 40% at 6% 96%, #DCE4E8 0%, rgba(220,228,232,0) 70%), #EDF1F3" }}>
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
              <Mark size={40} />
              <span style={{ fontFamily: "TD, TDx, serif", fontSize: "26px", lineHeight: "1" }}>حيّــاك</span>
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
            <header data-t="t0" className="in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.15" }}>التصاميم</h1>
                <p style={{ margin: "0", fontSize: "15px", color: "#3A4B58" }}>الأنماط والأختام اللي تقدر تستخدمها في دعواتك</p>
              </div>
              <A href="Create.dc.html" style={{ height: "48px", padding: "0 22px", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 24px rgba(14,151,174,.3)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                دعوة جديدة
              </A>
            </header>
            <section data-t="t1" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                <h3 style={{ margin: "0", fontSize: "18px" }}>الأنماط</h3>
                <span style={{ fontSize: "13px", color: "#4A5B68" }}>اختر اللون وشوف الدعوة مباشرة</span>
              </div>
              <div className="gcards dz" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px" }}>
                {(v.pats || []).map((p, $i3) => (
                  <div key={p?.key ?? $i3} className="lift" style={{ borderRadius: "30px", background: "rgba(255,255,255,.75)", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                      <button type="button" onClick={p?.open} className="ph" aria-label={p?.n} style={{ position: "relative", display: "block", width: "214px", height: "440px", borderRadius: "38px", background: "#04121F", boxShadow: "0 0 0 6px #0b2233, 0 24px 50px rgba(10,42,67,.25)", overflow: "hidden", textDecoration: "none" }}>
                        <span className="phi" style={{ position: "absolute", left: "9px", top: "9px", width: "390px", height: "844px", transform: "scale(.5026)", transformOrigin: "0 0", borderRadius: "60px", overflow: "hidden", pointerEvents: "none" }}>
                          <Invite pattern={p?.n} color={p?.col} seal={p?.seal} title={p?.title} latin={p?.latin} look={p?.look} thumb="نعم" />
                        </span>
                      </button>
                      <b style={{ fontFamily: "TD, TDx, serif", fontSize: "24px" }}>{p?.n}</b>
                      <span style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                        {(p?.cols || []).map((c, $i4) => (
                          <button key={c?.key ?? $i4} type="button" onClick={c?.pick} aria-label={c?.n} style={S(`${txt(c?.st)}`)}><span style={S(`${txt(c?.dot)}`)} />{c?.n}</button>
                        ))}
                      </span>
                      <A href={p?.use} style={{ width: "100%", height: "46px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", textDecoration: "none", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>استخدم هذا النمط</A>
                    </div>
                ))}
              </div>
            </section>
            <div data-t="t2" className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "20px", alignItems: "start" }}>
              <section className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: "0", fontSize: "18px" }}>الأختام</h3>
                  <span style={{ fontSize: "13px", color: "#4A5B68" }}>تحدد نوع المدعو داخل الدعوة</span>
                </div>
                <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
                  {(v.seals || []).map((x, $i5) => (
                    <span key={x?.key ?? $i5} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "92px" }}>
                        <svg width="84" height="84" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible" }}>
                          <defs>
                            <radialGradient id={x?.gid} cx="34%" cy="28%" r="80%">
                              <stop offset="0%" stopColor={x?.c2} />
                              <stop offset="50%" stopColor={x?.c} />
                              <stop offset="100%" stopColor={x?.c3} />
                            </radialGradient>
                          </defs>
                          <path d={v.wax} fill={x?.c3} transform="translate(0 2.4)" />
                          <path d={v.wax} fill={`url(#${txt(x?.gid)})`} />
                          <circle cx="50" cy="50" r="31" fill="none" stroke="#000" strokeOpacity=".22" strokeWidth="2.5" />
                          <circle cx="50" cy="50.8" r="31" fill="none" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="1.1" />
                          <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity="0.3" />
                          <text x="50" y="57" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize={x?.fs} fill="#FFFFFF">{x?.t}</text>
                        </svg>
                        <span style={{ fontSize: "13px", fontWeight: "700" }}>{x?.n}</span>
                      </span>
                  ))}
                  <A href="Requests.dc.html" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "92px", textDecoration: "none" }}>
                    <span style={{ width: "78px", height: "78px", borderRadius: "50%", border: "2px dashed rgba(14,151,174,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#086577" }}>ختم خاص</span>
                  </A>
                </div>
              </section>
              <section className="in glass card" style={{ borderRadius: "30px", padding: "22px", display: "flex", flexDirection: "column", gap: "12px", background: "linear-gradient(150deg, rgba(14,151,174,.16), rgba(255,255,255,.6) 60%)" }}>
                <h3 style={{ margin: "0", fontSize: "18px" }}>تصميم بهويتك</h3>
                <span style={{ fontSize: "14px", color: "#3A4B58", lineHeight: "1.8" }}>ألوانكم، ختم بشعاركم، شاشة تحميل خاصة، أو حركة جديدة كليًا</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                  {(v.svc || []).map((x, $i6) => (
                    <span key={x?.key ?? $i6} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                        <span style={{ display: "flex", flexDirection: "column" }}><span>{x?.n}</span><span style={{ fontSize: "12px", color: "#4A5B68" }}>{x?.d}</span></span>
                        <b>{x?.p}</b>
                      </span>
                  ))}
                </div>
                <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.7" }}>سعر التخصيص منفصل عن رصيدك وتدفعه مرة وحدة، ويبقى في حسابك تستخدمه كل شهر ما دام عندك رصيد مدفوع</span>
                <A href="Requests.dc.html" style={{ height: "48px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "4px" }}>اطلب تخصيص</A>
              </section>
            </div>
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
