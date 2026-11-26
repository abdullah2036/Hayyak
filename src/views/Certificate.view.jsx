import { S, txt, A } from '@/ui/dc';
import Mark from '@/ui/Mark';
import CertSheet from '@/screens/CertSheet';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:#086577}a:hover{color:#0A2A43}
input,button,textarea{font-family:TS, 'IBM Plex Sans Arabic', sans-serif}
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
.fld{height:50px;border-radius:999px;border:1px solid rgba(10,42,67,.16);background:#fff;padding:0 20px;font-size:15px;color:#0A2A43;width:100%;box-sizing:border-box;font-family:TS, 'IBM Plex Sans Arabic', sans-serif}
.fld:focus,.ta:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
.ta{border-radius:22px;border:1px solid rgba(10,42,67,.16);background:#fff;padding:14px 18px;font-size:15px;line-height:1.8;color:#0A2A43;width:100%;box-sizing:border-box;resize:vertical;min-height:110px}
.btn{height:48px;padding:0 20px;border-radius:999px;border:1px solid rgba(10,42,67,.18);background:rgba(255,255,255,.75);color:#0A2A43;text-decoration:none;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}
.btnp{height:50px;padding:0 22px;border-radius:999px;border:0;background:#0E97AE;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:0 10px 24px rgba(14,151,174,.3)}
.btnd{height:50px;padding:0 22px;border-radius:999px;border:0;background:#0A2A43;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}
.btn:hover,.btnp:hover,.btnd:hover{filter:brightness(1.05)}
.lbl{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#4A5B68}
.sub{font-size:13px;color:#4A5B68;line-height:1.7}
h2,h3{font-family:TS, 'IBM Plex Sans Arabic', sans-serif;font-weight:700}`;

export default function CertificateView({ v }) {
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
          <nav aria-label="التنقل الرئيسي" className="glass side" style={{ flex: "0 0 250px", boxSizing: "border-box", padding: "24px 16px", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "22px", alignSelf: "flex-start", position: "sticky", top: "20px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "0 6px" }}>
              <Mark size={40} />
              <span style={{ fontFamily: "TD, TDx, serif", fontSize: "26px", lineHeight: "1" }}>حيّــاك</span>
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
          <main className="mn" style={{ flex: "1 1 auto", minWidth: "0", boxSizing: "border-box", padding: "24px 14px 40px", display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <A href={v.back} className="in" style={{ fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>→ الحضور والشهادات</A>
              <button type="button" className="tourb" onClick={v.startTour}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.6M12 17h.01" /></svg>
                دلّني
              </button>
            </div>
            <header className="in" data-t="1" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.2" }}>إعداد الشهادة</h1>
                <span style={{ fontSize: "15px", color: "#4A5B68" }}>{v.evTitle}{" · تجهّزها مرة وحدة وتطلع لكل اللي حضروا"}</span>
              </div>
              <button type="button" className="btnp" onClick={v.save}>{v.saveL}</button>
            </header>
            <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: "20px", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <section data-t="2" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h2 style={{ margin: "0", fontSize: "18px" }}>القالب</h2>
                    <span className="sub">فاتح أو غامق، أو ارفع تصميمكم وحنا نحط عليه الاسم</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px" }}>
                    {(v.tpls || []).map((t, $i3) => (
                      <button key={t?.key ?? $i3} type="button" onClick={t?.on} aria-pressed={t?.pr} style={S(`${txt(t?.st)}`)}>
                          <span style={S(`${txt(t?.mini)}`)}>
                            {t?.isImg ? (
                              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4A5B68" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01" /></svg>
                            ) : null}
                            {t?.notImg ? (
                              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", width: "100%" }}>
                                  <span style={S(`width: 40%; height: 5px; border-radius: 3px; background: ${txt(t?.c1)};`)} />
                                  <span style={S(`width: 62%; height: 8px; border-radius: 3px; background: ${txt(t?.c2)};`)} />
                                  <span style={S(`width: 46%; height: 3px; border-radius: 3px; background: ${txt(t?.c3)};`)} />
                                </span>
                            ) : null}
                          </span>
                          <b style={{ fontSize: "14px" }}>{t?.l}</b>
                        </button>
                    ))}
                  </div>
                </section>
                {v.notCustom ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <section data-t="11" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>لغة الشهادة</h2>
                          <span className="sub">العناوين والتوقيع والتاريخ بالعربي دائمًا، والنص الأساسي بلغة أو لغتين</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {(v.langs || []).map((t, $i4) => (
                            <button key={t?.key ?? $i4} type="button" className="chip" onClick={t?.on} aria-pressed={t?.pr} style={S(`${txt(t?.st)}`)}>{t?.l}</button>
                          ))}
                        </div>
                        {v.isBi ? (
                          <span className="sub">المدعو يكتب اسمه بالإنجليزي وقت ما يأكّد حضوره</span>
                        ) : null}
                      </section>
                      <section data-t="4" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><h2 style={{ margin: "0", fontSize: "18px" }}>الشعار واللون</h2></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                          <span style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid #DCE4E8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flex: "none" }}>
                            {v.hasLogo ? (
                              <img src={v.logo} alt="شعار الجهة" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            ) : null}
                            {v.noLogo ? (
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#4A5B68" }}>شعار</span>
                            ) : null}
                          </span>
                          <label className="btn" style={{ position: "relative", overflow: "hidden" }}>
                            ارفع شعاركم
                            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={v.onLogo} aria-label="ارفع شعار الجهة" style={{ position: "absolute", inset: "0", opacity: "0", cursor: "pointer" }} />
                          </label>
                          {v.hasLogo ? (
                            <button type="button" onClick={v.rmLogo} style={{ height: "40px", padding: "0 12px", border: "0", background: "none", color: "#4A5B68", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>شيله</button>
                          ) : null}
                        </div>
                        <span className="sub">PNG بخلفية شفافة يطلع أحلى</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "700" }}>لون الشهادة</span>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {(v.colors || []).map((c, $i5) => (
                              <button key={c?.key ?? $i5} type="button" onClick={c?.on} aria-pressed={c?.pr} aria-label={c?.l} style={S(`${txt(c?.st)}`)}><span style={S(`width: 22px; height: 22px; border-radius: 50%; background: ${txt(c?.v)};`)} />{c?.l}</button>
                            ))}
                          </div>
                        </div>
                      </section>
                      <section data-t="5" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>نص الشهادة</h2>
                          <span className="sub">كل الكلام تكتبه أنت. اسم الفعالية والتاريخ والمدة نعبّيها لك وتقدر تعدّلها</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {(v.titles || []).map((t, $i6) => (
                            <button key={t?.key ?? $i6} type="button" className="chip" onClick={t?.on} aria-pressed={t?.pr} style={S(`${txt(t?.st)}`)}>{t?.l}</button>
                          ))}
                        </div>
                        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <label className="lbl">اسم الجهة<input className="fld" value={v.org ?? ''} onChange={v.onOrg} /></label>
                          <label className="lbl">
                            تحته (اختياري)
                            <input className="fld" value={v.orgSub ?? ''} onChange={v.onOrgSub} placeholder="مثل اسم الجامعة" />
                          </label>
                        </div>
                        <label className="lbl">جملة الشهادة<input className="fld" value={v.certLine ?? ''} onChange={v.onCertLine} /></label>
                        <label className="lbl">النص<textarea className="ta" value={v.para ?? ''} onChange={v.onPara} aria-label="نص الشهادة" /></label>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "20px", background: "rgba(255,255,255,.7)" }}>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <b style={{ fontSize: "14px" }}>حقل زيادة (اختياري)</b>
                            <span style={{ fontSize: "12px", color: "#4A5B68" }}>مثل الرقم الجامعي أو الوظيفي. المدعو يكتبه لما يأكّد</span>
                          </span>
                          <button type="button" className="tg" aria-label="حقل زيادة" aria-pressed={v.exPr} onClick={v.togEx} style={S(`${txt(v.exBg)}`)}><span style={S(`${txt(v.exKnob)}`)} /></button>
                        </div>
                        {v.extra ? (
                          <label className="lbl">اسم الحقل<input className="fld" value={v.extraL ?? ''} onChange={v.onExL} /></label>
                        ) : null}
                        {v.isBi ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", borderRadius: "22px", background: "rgba(255,255,255,.6)" }}>
                              <b style={{ fontSize: "14px" }}>النص بالإنجليزي</b>
                              <label className="lbl">
                                Certificate line
                                <input className="fld" dir="ltr" value={v.enLine ?? ''} onChange={v.onEnLine} style={{ textAlign: "left" }} />
                              </label>
                              <label className="lbl">
                                Text
                                <textarea className="ta" dir="ltr" value={v.enPara ?? ''} onChange={v.onEnPara} aria-label="English text" style={{ textAlign: "left" }} />
                              </label>
                            </div>
                        ) : null}
                      </section>
                      <section data-t="12" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>التوقيع</h2>
                          <span className="sub">ارفع صورة التوقيع بخلفية شفافة، ويطلع فوق الخط تحت الاسم</span>
                        </div>
                        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <label className="lbl">اسم الموقّع<input className="fld" value={v.signer ?? ''} onChange={v.onSigner} /></label>
                          <label className="lbl">صفته<input className="fld" value={v.role ?? ''} onChange={v.onRole} /></label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                          <span style={{ width: "140px", height: "64px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #DCE4E8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flex: "none" }}>
                            {v.hasSig ? (
                              <img src={v.sigImg} alt="التوقيع" style={{ maxWidth: "90%", maxHeight: "80%", objectFit: "contain" }} />
                            ) : null}
                            {v.noSig ? (
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#4A5B68" }}>توقيع</span>
                            ) : null}
                          </span>
                          <label className="btn" style={{ position: "relative", overflow: "hidden" }}>
                            ارفع التوقيع
                            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={v.onSig} aria-label="ارفع صورة التوقيع" style={{ position: "absolute", inset: "0", opacity: "0", cursor: "pointer" }} />
                          </label>
                          {v.hasSig ? (
                            <button type="button" onClick={v.rmSig} style={{ height: "40px", padding: "0 12px", border: "0", background: "none", color: "#4A5B68", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>شيله</button>
                          ) : null}
                        </div>
                        <span className="sub">بدون توقيع يطلع الاسم والصفة بس</span>
                      </section>
                    </div>
                ) : null}
                {v.isCustom ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <section data-t="8" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <h2 style={{ margin: "0", fontSize: "18px" }}>تصميمكم</h2>
                          <span className="sub">صمّموا الشهادة كاملة بشعاركم وتوقيعكم، وخلّوا مكان الاسم فاضي. حنا نحط الاسم والمعلومات اللي تختارونها</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                          <label className="btnp" style={{ position: "relative", overflow: "hidden" }}>
                            {v.bgBtn}
                            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={v.onBg} aria-label="ارفع تصميم الشهادة" style={{ position: "absolute", inset: "0", opacity: "0", cursor: "pointer" }} />
                          </label>
                          {v.hasBg ? (
                            <button type="button" onClick={v.rmBg} style={{ height: "40px", padding: "0 12px", border: "0", background: "none", color: "#4A5B68", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>شيله</button>
                          ) : null}
                        </div>
                        <span className="sub">صورة بالعرض بمقاس A4 (مثل 3508×2480) · PNG أو JPG</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "700" }}>وش يطلع على تصميمكم</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ height: "42px", padding: "0 18px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontSize: "14px", fontWeight: "700", display: "inline-flex", alignItems: "center" }}>الاسم</span>
                            {(v.fields || []).map((f, $i7) => (
                              <button key={f?.key ?? $i7} type="button" className="chip" onClick={f?.on} aria-pressed={f?.pr} style={S(`${txt(f?.st)}`)}>{f?.l}</button>
                            ))}
                          </div>
                        </div>
                        {v.extra ? (
                          <label className="lbl">اسم الحقل الزيادة (المدعو يكتبه لما يأكّد)<input className="fld" value={v.extraL ?? ''} onChange={v.onExL} /></label>
                        ) : null}
                      </section>
                      <section data-t="10" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><h2 style={{ margin: "0", fontSize: "18px" }}>مكان الاسم وشكله</h2></div>
                        <label className="lbl">
                          يمين ويسار
                          <input type="range" min="15" max="85" value={v.px ?? ''} onChange={v.onPx} style={{ accentColor: "#0E97AE" }} />
                        </label>
                        <label className="lbl">
                          فوق وتحت
                          <input type="range" min="15" max="85" value={v.py ?? ''} onChange={v.onPy} style={{ accentColor: "#0E97AE" }} />
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "700" }}>المحاذاة</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {(v.aligns || []).map((a, $i8) => (
                              <button key={a?.key ?? $i8} type="button" className="chip" onClick={a?.on} aria-pressed={a?.pr} style={S(`${txt(a?.st)}`)}>{a?.l}</button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "700" }}>الحجم</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {(v.sizes || []).map((a, $i9) => (
                              <button key={a?.key ?? $i9} type="button" className="chip" onClick={a?.on} aria-pressed={a?.pr} style={S(`${txt(a?.st)}`)}>{a?.l}</button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "700" }}>لون النص</span>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {(v.tcols || []).map((c, $i10) => (
                              <button key={c?.key ?? $i10} type="button" onClick={c?.on} aria-pressed={c?.pr} aria-label={c?.l} style={S(`${txt(c?.st)}`)}>
                                  <span style={S(`width: 22px; height: 22px; border-radius: 50%; border: 1px solid #CFD9DF; background: ${txt(c?.v)};`)} />
                                  {c?.l}
                                </button>
                            ))}
                          </div>
                        </div>
                      </section>
                    </div>
                ) : null}
                <section data-t="7" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h2 style={{ margin: "0", fontSize: "18px" }}>متى تطلع؟</h2>
                    <span className="sub">الشهادة داخلة مع الدعوة، ما تتحسب من رصيدك</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(v.whens || []).map((w, $i11) => (
                      <button key={w?.key ?? $i11} type="button" onClick={w?.on} aria-pressed={w?.pr} style={S(`${txt(w?.st)}`)}>
                          <span style={S(`${txt(w?.dot)}`)}><span style={S(`${txt(w?.dotIn)}`)} /></span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px", textAlign: "right" }}>
                            <b style={{ fontSize: "14px" }}>{w?.t}</b>
                            <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>{w?.d}</span>
                          </span>
                        </button>
                    ))}
                  </div>
                </section>
              </div>
              <section data-t="6" className="in glass card sticky" style={{ borderRadius: "30px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", position: "sticky", top: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "0 6px" }}>
                  <h2 style={{ margin: "0", fontSize: "18px" }}>المعاينة</h2>
                  <span style={{ fontSize: "12px", color: "#4A5B68" }}>باسم مدعو تجريبي · تتحدث مع كل تغيير</span>
                </div>
                <CertSheet config={v.cfg} data={v.cdata} />
              </section>
            </div>
            <div className="split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: "20px", alignItems: "start" }}>
              {v.hasReqs ? (
                <section data-t="9" className="in glass card" style={{ borderRadius: "30px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <h2 style={{ margin: "0", fontSize: "18px" }}>طلبات تعديل الاسم</h2>
                      <span className="sub">المدعو يعدّل اسمه بنفسه لين تطلع الشهادة. بعدها يرسل لك طلب من نفس رابطه</span>
                    </div>
                    {(v.reqs || []).map((r, $i12) => (
                      <div key={r?.key ?? $i12} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "20px", background: "rgba(255,255,255,.7)" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
                            <span style={{ color: "#4A5B68", textDecoration: "line-through" }}>{r?.from}</span>
                            <b style={{ fontSize: "15px" }}>{r?.to}</b>
                          </span>
                          {r?.pending ? (
                            <span style={{ display: "flex", gap: "8px" }}>
                                <button type="button" onClick={r?.ok} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "0", background: "#0E97AE", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>وافق وطلّع شهادة جديدة</button>
                                <button type="button" onClick={r?.no} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid rgba(10,42,67,.18)", background: "#FFFFFF", color: "#0A2A43", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>ارفض</button>
                              </span>
                          ) : null}
                          {r?.done ? (
                            <span style={S(`font-size: 13px; font-weight: 700; color: ${txt(r?.c)};`)}>{r?.res}</span>
                          ) : null}
                        </div>
                    ))}
                  </section>
              ) : null}
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
