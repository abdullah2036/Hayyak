import { S, txt, A } from '@/ui/dc';
import Mark from '@/ui/Mark';
import Thumb from '@/ui/Thumb';
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
h2,h3{font-family:TS, 'IBM Plex Sans Arabic', sans-serif;font-weight:700}`;

export default function DashboardView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ minHeight: "1560px", position: "relative", overflow: "hidden", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43", background: "radial-gradient(55% 40% at 88% 4%, #CBEFF5 0%, rgba(203,239,245,0) 70%), radial-gradient(45% 40% at 6% 96%, #DCE4E8 0%, rgba(220,228,232,0) 70%), #EDF1F3" }}>
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
        <div className="pg" style={{ position: "relative", display: "flex", gap: "24px", padding: "20px", boxSizing: "border-box", minHeight: "1560px" }}>
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
            <header className="in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.15" }}>{"أهلًا، "}{v.hello}</h1>
                <p style={{ margin: "0", fontSize: "15px", color: "#3A4B58" }}>{v.headline}</p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <button type="button" onClick={v.tourStart} className="tourb">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M14.8 9.2l-1.9 4.7-4.7 1.9 1.9-4.7z" /></svg>
                  دلّني
                </button>
                <label className="glass srch" style={{ display: "flex", alignItems: "center", gap: "10px", height: "48px", width: "300px", maxWidth: "100%", padding: "0 18px", borderRadius: "999px", boxSizing: "border-box" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3A4B58" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
                  <input type="search" value={v.q ?? ''} onChange={v.onQ} placeholder="ابحث عن دعوة" aria-label="بحث" style={{ border: "0", outline: "0", background: "transparent", fontSize: "14px", width: "100%", color: "#0A2A43" }} />
                </label>
                <A href="Create.dc.html" className="hidem" style={{ height: "48px", padding: "0 22px", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  دعوة جديدة
                </A>
              </div>
            </header>
            <div className="kp" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.8fr) repeat(3, minmax(0,1fr))", gap: "16px" }}>
              <section className="in kq" data-tour="2" style={{ borderRadius: "30px", padding: "20px 22px", color: "#FFFFFF", background: "radial-gradient(90% 120% at 15% 0%, rgba(14,151,174,.55), rgba(14,151,174,0) 60%), linear-gradient(160deg, #123E5C, #0A2A43 60%, #072538)", display: "flex", alignItems: "center", gap: "18px", boxShadow: "0 20px 44px rgba(10,42,67,.22)" }}>
                <div style={{ position: "relative", width: "108px", height: "108px", flex: "none" }}>
                  <svg width="108" height="108" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
                    <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="4" />
                    <circle cx="21" cy="21" r="17" fill="none" stroke="#86DCEA" strokeWidth="4" strokeLinecap="round" strokeDasharray={v.ringDa} />
                  </svg>
                  <span style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <b style={{ fontFamily: "TD, TDx, serif", fontSize: "32px", lineHeight: "1" }}>{v.left}</b>
                    <span style={{ fontSize: "11px", color: "#B8D4DE" }}>باقية</span>
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                  <span style={{ fontSize: "13px", color: "#B8D4DE" }}>{v.creditTop}</span>
                  <b style={{ fontSize: "20px", lineHeight: "1.35" }}>{"باقي لك "}{v.left}{" دعوة من "}{v.creditTotal}</b>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", alignSelf: "flex-start", height: "32px", padding: "0 12px", borderRadius: "999px", background: "rgba(134,220,234,.16)", color: "#CFF3F8", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    {v.creditUntil}
                  </span>
                  <span style={{ fontSize: "12px", color: "#9FB4C2", lineHeight: "1.6" }}>
                    {v.creditNote}
                    <A href="Subscribe.dc.html" style={{ color: "#86DCEA", fontWeight: "700", textDecoration: "none" }}>اشترِ رصيد</A>
                  </span>
                </div>
              </section>
              {(v.tiles || []).map((k, $i3) => (
                <section key={k?.key ?? $i3} className="in glass card" style={{ borderRadius: "30px", padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "14px", color: "#4A5B68", fontWeight: "500" }}>{k?.l}</span>
                      <span style={S(`width: 36px; height: 36px; border-radius: 50%; background: ${txt(k?.bg)}; display: flex; align-items: center; justify-content: center;`)}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={k?.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={k?.ic} /></svg>
                      </span>
                    </span>
                    <b style={{ fontFamily: "TD, TDx, serif", fontSize: "40px", lineHeight: "1", color: "#0A2A43" }}>{k?.v}</b>
                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>{k?.d}</span>
                    <span style={{ height: "6px", borderRadius: "6px", background: "rgba(14,151,174,.12)", overflow: "hidden", display: "block" }}>
                      <span className="growX" style={S(`display: block; height: 100%; width: ${txt(k?.pct)}; border-radius: 6px; background: ${txt(k?.fg)};`)} />
                    </span>
                  </section>
              ))}
            </div>
            <div className="mid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.9fr) minmax(0,1fr)", gap: "20px" }}>
              <article className="lift in glass" data-tour="3" style={{ borderRadius: "30px", padding: "10px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 12px" }}>
                  <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>دعوتك الجاية</h3>
                  <span style={{ fontSize: "13px", color: "#0E97AE", fontWeight: "700" }}>{v.nx?.until}</span>
                </div>
                <div className="hero" style={{ position: "relative", height: "240px", borderRadius: "22px", overflow: "hidden", background: "radial-gradient(120% 90% at 80% 0%, #123E5C 0%, #0A2A43 50%, #04121F 100%)", color: "#FFFFFF", display: "flex" }}>
                  {(v.stars || []).map((s, $i4) => (
                    <span key={s?.key ?? $i4} style={S(`${txt(s?.st)}`)} />
                  ))}
                  <div style={{ position: "relative", flex: "1", padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)", fontSize: "12px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#86DCEA" }} />{v.nx?.badge}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "14px", color: "#CFE7EE" }}>{v.nx?.when}</span>
                      <A href={v.nx?.href} style={{ color: "#FFFFFF", textDecoration: "none" }}><h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "44px", lineHeight: "1.15" }}>{v.nx?.title}</h2></A>
                      <span style={{ fontFamily: "TD, TDx, serif", letterSpacing: "4px", fontSize: "12px", opacity: ".7", direction: "ltr", textAlign: "right" }}>{v.nx?.latin}</span>
                    </div>
                  </div>
                  <div className="hidem" style={{ position: "relative", width: "190px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ position: "relative", width: "112px", height: "220px", borderRadius: "22px", background: "#04121F", boxShadow: "0 0 0 4px #0b2233, 0 20px 40px rgba(0,0,0,.4)", overflow: "hidden", transform: "rotate(-5deg)" }}>
                      <span style={{ position: "absolute", left: "4px", top: "4px", width: "390px", height: "844px", transform: "scale(.267)", transformOrigin: "0 0", pointerEvents: "none" }}>
                        {v.nx?.look ? (
                          <Thumb look={v.nx?.look} />
                        ) : null}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="ust" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px", padding: "14px 6px 4px" }}>
                  {(v.ust || []).map((u, $i5) => (
                    <span key={u?.key ?? $i5} style={{ borderRadius: "20px", background: "rgba(255,255,255,.7)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <b style={S(`font-family: TD, TDx, serif; font-size: 28px; line-height: 1.1; color: ${txt(u?.c)};`)}>{u?.v}</b>
                        <span style={{ fontSize: "12px", color: "#4A5B68" }}>{u?.l}</span>
                      </span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 6px 6px", flexWrap: "wrap" }}>
                  <span style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#4A5B68", fontWeight: "700" }}>رابط الدعوة · ينسخ معه رسالة جاهزة</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 5px 0 14px", borderRadius: "999px", background: "rgba(255,255,255,.85)", border: "1px solid #DCE4E8", fontSize: "13px", direction: "ltr", justifyContent: "space-between", minWidth: "0" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.nx?.link}</span>
                      <button type="button" onClick={v.copy} style={S(`height: 34px; padding: 0 14px; border: 0; border-radius: 999px; background: ${txt(v.copyBg)}; color: #FFFFFF; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit;`)}>{v.copyLabel}</button>
                    </span>
                  </span>
                  <A href={v.nx?.href} style={{ height: "44px", padding: "0 18px", display: "inline-flex", alignItems: "center", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "14px", alignSelf: "flex-end" }}>تفاصيل الدعوة</A>
                </div>
              </article>
              <section className="lift in glass card" data-tour="4" style={{ borderRadius: "30px", padding: "22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>ما ردّوا للحين</h3>
                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.pendingCount}</span>
                </div>
                {(v.pending || []).map((p, $i6) => (
                  <div key={p?.key ?? $i6} className="row" style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px", borderRadius: "16px" }}>
                      <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#DCE4E8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "15px", flexShrink: "0" }}>{p?.init}</span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                        <b style={{ fontSize: "14px" }}>{p?.name}</b>
                        <span style={{ fontSize: "12px", color: "#4A5B68" }}>{p?.st}</span>
                      </span>
                      <span style={{ fontSize: "11px", color: "#4A5B68" }}>{p?.ch}</span>
                    </div>
                ))}
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px", padding: "14px", borderRadius: "20px", background: "rgba(14,151,174,.08)" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>{v.remHead}</span>
                  <span style={{ fontSize: "12px", color: "#3A4B58", lineHeight: "1.7" }}>{v.remNote}</span>
                  <button type="button" onClick={v.remind} style={{ height: "42px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>{v.remindLabel}</button>
                </div>
              </section>
            </div>
            <section className="lift in glass card" data-tour="5" style={{ borderRadius: "30px", padding: "22px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "12px", flexWrap: "wrap" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>الدعوات</h3>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(v.filters || []).map((f, $i7) => (
                    <button key={f?.key ?? $i7} type="button" onClick={f?.on} style={S(`${txt(f?.st)}`)}>{f?.label}</button>
                  ))}
                </div>
              </div>
              <div className="tbl hidem" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) 90px minmax(0,1fr) 96px", gap: "14px", padding: "0 10px 6px", fontSize: "12px", color: "#4A5B68" }}><span>الدعوة</span><span>الفعالية</span><span>الختم</span><span>الردود</span><span>الحالة</span></div>
              {(v.rows || []).map((r, $i8) => (
                <div key={r?.key ?? $i8} className="row tbl" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) 90px minmax(0,1fr) 96px", alignItems: "center", gap: "14px", padding: "11px 10px", borderRadius: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
                      <span style={S(`width: 34px; height: 46px; border-radius: 9px; background: ${txt(r?.bg)}; flex-shrink: 0;`)} />
                      <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                        <A href={r?.href} style={{ fontSize: "14px", fontWeight: "700", color: "#0A2A43", textDecoration: "none" }}>{r?.title}</A>
                        <span style={{ fontSize: "12px", color: "#4A5B68" }}>{r?.date}{" · "}{r?.pattern}</span>
                      </span>
                    </div>
                    <span className="hidem" style={{ fontSize: "13px", color: "#3A4B58" }}>{r?.event}</span>
                    <span className="hidem" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}><span style={S(`width: 12px; height: 12px; border-radius: 50%; background: ${txt(r?.sc)};`)} />{r?.seal}</span>
                    <span className="hidem" style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#3A4B58" }}>
                      {r?.resp}
                      <span style={{ height: "4px", borderRadius: "4px", background: "rgba(14,151,174,.12)", overflow: "hidden", display: "block" }}><span style={S(`display: block; height: 100%; width: ${txt(r?.pct)}; background: #0E97AE;`)} /></span>
                    </span>
                    <span style={S(`justify-self: start; font-size: 12px; font-weight: 700; padding: 5px 11px; border-radius: 999px; color: ${txt(r?.stc)}; background: ${txt(r?.stb)};`)}>{r?.status}</span>
                  </div>
              ))}
              <A href="Invitations.dc.html" style={{ alignSelf: "center", marginTop: "8px", height: "40px", padding: "0 18px", display: "inline-flex", alignItems: "center", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", color: "#0A2A43", textDecoration: "none", fontWeight: "700", fontSize: "13px" }}>كل الدعوات</A>
            </section>
            <div className="bot" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "20px" }}>
              <section className="in glass card" data-tour="6" style={{ borderRadius: "30px", padding: "22px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>إحصائياتك</h3>
                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>{"كل دعواتك لين "}{v.today}</span>
                  </span>
                  <A href="#" onClick={v.dlStats} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid rgba(10,42,67,.16)", color: "#0A2A43", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                    حمّل الإحصائيات Excel
                  </A>
                </div>
                <div className="stg2" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "28px", alignItems: "center" }}>
                  <div className="ovd" style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                    <div style={{ position: "relative", width: "150px", height: "150px", flex: "0 0 150px" }}>
                      {" "}
                      <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(14,151,174,.1)" strokeWidth="5" />
                        {(v.donut || []).map((d, $i9) => (
                          <circle key={d?.key ?? $i9} cx="21" cy="21" r="15.9" fill="none" stroke={d?.c} strokeWidth="5" strokeDasharray={d?.da} strokeDashoffset={d?.off} style={S(`${txt(d?.an)}`)} />
                        ))}
                      </svg>
                      {" "}
                      <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "TD, TDx, serif", fontSize: "34px", lineHeight: "1" }}>{v.total}</span>
                        <span style={{ fontSize: "12px", color: "#4A5B68" }}>دعوة مُرسلة</span>
                      </div>
                      {" "}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "13px", color: "#3A4B58" }}>
                      {(v.donut || []).map((d, $i10) => (
                        <span key={d?.key ?? $i10} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={S(`width: 9px; height: 9px; border-radius: 3px; background: ${txt(d?.c)};`)} />
                            {d?.label}{" · "}{d?.n}
                          </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700" }}>قنوات الإرسال · نسبة الفتح</span>
                    {(v.chans || []).map((c, $i11) => (
                      <div key={c?.key ?? $i11} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <span>{c?.name}</span>
                            <span style={{ color: "#4A5B68" }}>{c?.sent}{" · فتح "}<b style={{ color: "#0A2A43" }}>{c?.open}</b></span>
                          </span>
                          <span style={{ height: "8px", borderRadius: "8px", background: "rgba(14,151,174,.1)", overflow: "hidden", display: "block" }}>
                            <span className="growX" style={S(`display: block; height: 100%; width: ${txt(c?.open)}; background: ${txt(c?.col)}; border-radius: 8px; animation-delay: ${txt(c?.dl)};`)} />
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
              </section>
              <section className="lift in glass card" style={{ borderRadius: "30px", padding: "22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>مجموعات الدعوات</h3>
                <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.7", marginTop: "-6px" }}>الدعوات اللي لنفس المناسبة تنعرض مع بعض</span>
                {(v.events || []).map((e, $i12) => (
                  <div key={e?.key ?? $i12} className="row" style={{ padding: "14px", borderRadius: "20px", background: "rgba(255,255,255,.6)", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <b style={{ fontSize: "15px" }}>{e?.name}</b>
                        <span style={{ fontSize: "12px", color: "#4A5B68" }}>{e?.count}</span>
                      </span>
                      <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {(e?.invs || []).map((iv, $i13) => (
                          <span key={iv?.key ?? $i13} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px 5px 6px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #DCE4E8", fontSize: "12px" }}><span style={S(`width: 14px; height: 18px; border-radius: 4px; background: ${txt(iv?.bg)};`)} />{iv?.t}</span>
                        ))}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#3A4B58" }}>
                        {e?.sub}
                        <span style={{ height: "5px", borderRadius: "5px", background: "rgba(14,151,174,.12)", overflow: "hidden", display: "block" }}>
                          <span className="growX" style={S(`display: block; height: 100%; width: ${txt(e?.pct)}; background: #0E97AE;`)} />
                        </span>
                      </span>
                    </div>
                ))}
                <A href="Requests.dc.html" style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "20px", background: "linear-gradient(150deg, rgba(14,151,174,.14), rgba(255,255,255,.6))", border: "1px solid rgba(14,151,174,.22)", textDecoration: "none", color: "#0A2A43" }}>
                  <span style={{ width: "40px", height: "40px", borderRadius: "14px", background: "#0A2A43", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" /></svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <b style={{ fontSize: "14px" }}>تبون دعوة بهويتكم؟</b>
                    <span style={{ fontSize: "12px", color: "#4A5B68" }}>ألوانكم وختمكم وشاشة تحميل بشعاركم</span>
                  </span>
                </A>
              </section>
            </div>
          </main>
        </div>
        {v.tourAsk ? (
          <div style={{ position: "fixed", inset: "0", zIndex: "95", background: "rgba(4,18,31,.55)", WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
              <div className="tin" style={{ width: "100%", maxWidth: "440px", borderRadius: "34px", background: "#FAFBFC", padding: "30px 26px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", boxShadow: "0 40px 90px rgba(0,0,0,.35)" }}>
                <svg width="78" height="78" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible" }}>
                  <defs>
                    <radialGradient id="tgS" cx="34%" cy="26%" r="85%">
                      <stop offset="0%" stopColor="#A6EEF7" />
                      <stop offset="30%" stopColor="#4FC9DC" />
                      <stop offset="65%" stopColor="#0E97AE" />
                      <stop offset="100%" stopColor="#05505E" />
                    </radialGradient>
                  </defs>
                  <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                  <path d={v.wax} fill="url(#tgS)" />
                  <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity=".45" strokeWidth="2.5" />
                  <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                  <text x="50" y="58.8" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="42" fill="#FFFFFF">{"ح"}</text>
                </svg>
                <b style={{ fontFamily: "TD, TDx, serif", fontSize: "30px", lineHeight: "1.3" }}>أهلًا في لوحتك 👋</b>
                <span style={{ fontSize: "15px", color: "#3A4B58", lineHeight: "1.8" }}>تبي نعرّفك عليها خطوة بخطوة في أقل من دقيقة، ولا تستكشفها بنفسك؟</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "6px" }}>
                  <button type="button" onClick={v.tourGo} style={{ height: "54px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>عرّفني عليها</button>
                  <button type="button" onClick={v.tourSkip} style={{ height: "50px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "transparent", color: "#0A2A43", fontFamily: "inherit", fontSize: "15px", fontWeight: "500", cursor: "pointer" }}>أستكشفها بنفسي</button>
                </div>
                <span style={{ fontSize: "12px", color: "#4A5B68" }}>تقدر ترجع للجولة وقت ما تبي من «دلّني»</span>
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
              <span style={{ display: "flex", gap: "4px" }}>
                {(v.tDots || []).map((d, $i14) => (
                  <span key={d?.key ?? $i14} style={S(`${txt(d?.st)}`)} />
                ))}
              </span>
              <span style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
                <button type="button" onClick={v.tNext} style={{ height: "44px", padding: "0 22px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontFamily: "inherit", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>{v.tNextTx}</button>
                {v.tHasPrev ? (
                  <button type="button" onClick={v.tPrev} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "transparent", color: "#0A2A43", fontFamily: "inherit", fontSize: "14px", cursor: "pointer" }}>السابق</button>
                ) : null}
              </span>
            </div></>
        ) : null}
        <FAQ open="لا" />
      </div>
    </>
  );
}
