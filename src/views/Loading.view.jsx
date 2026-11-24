import { S, txt, A } from '@/ui/dc';

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

.ls{position:relative;width:132px;height:132px}
.ls svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.ls .press{transform-origin:50% 50%;animation:lsPress 2.2s cubic-bezier(.5,0,.3,1) infinite}
@keyframes lsPress{0%{transform:scale(1.18) translateY(-8px);filter:drop-shadow(0 26px 22px rgba(0,0,0,.45))}38%{transform:scale(1);filter:drop-shadow(0 6px 6px rgba(0,0,0,.45))}70%{transform:scale(1)}100%{transform:scale(1.18) translateY(-8px);filter:drop-shadow(0 26px 22px rgba(0,0,0,.45))}}
.ls .rip{position:absolute;inset:6px;border-radius:50%;border:2px solid rgba(134,220,234,.7);opacity:0;animation:lsRip 2.2s ease-out infinite}
.ls .rip.r2{animation-delay:.25s;border-color:rgba(134,220,234,.4)}
@keyframes lsRip{0%,36%{opacity:0;transform:scale(1)}40%{opacity:1}80%,100%{opacity:0;transform:scale(1.9)}}
.ls.still .press{animation:none;filter:grayscale(.55) drop-shadow(0 8px 10px rgba(0,0,0,.4));transform:rotate(-8deg)}
.ls.still .rip{display:none}
.lw{font-family:TD,serif;font-size:40px;line-height:1.2;background:linear-gradient(90deg,#86DCEA 0%,#FFFFFF 50%,#86DCEA 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:lwShine 2.6s linear infinite}
@keyframes lwShine{to{background-position:-200% 0}}
.dots{display:inline-flex;gap:6px}.dots i{width:7px;height:7px;border-radius:50%;background:#86DCEA;animation:dt 1.2s ease-in-out infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}
@keyframes dt{0%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-5px)}}
.msg{animation:msgIn .6s cubic-bezier(.2,.8,.2,1) both}
@keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.bar{width:220px;height:4px;border-radius:4px;background:rgba(134,220,234,.15);overflow:hidden}.bar i{display:block;width:40%;height:100%;border-radius:4px;background:linear-gradient(90deg,rgba(134,220,234,0),#86DCEA,rgba(134,220,234,0));animation:bar 1.6s ease-in-out infinite}
@keyframes bar{from{transform:translateX(160%)}to{transform:translateX(-260%)}}
.pv{position:absolute;top:18px;right:18px;left:18px;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.pvb{height:38px;padding:0 14px;border-radius:999px;font-size:13px;font-family:inherit;cursor:pointer}
.lbtn{height:50px;padding:0 24px;border-radius:999px;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.badge{position:absolute;left:-6px;bottom:-2px;width:40px;height:40px;border-radius:50%;background:#0A2A43;border:3px solid #072538;display:grid;place-items:center}
@media (prefers-reduced-motion: reduce){.ls .press,.ls .rip,.lw,.dots i,.bar i{animation:none !important}}
@media (max-width: 600px){.pv{top:12px;right:12px;left:12px}.pvl{display:none}.lw{font-size:34px}.ls{width:112px;height:112px}}`;

export default function LoadingView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "'IBM Plex Sans Arabic', TS, sans-serif", color: "#FAFBFC", background: "radial-gradient(60% 50% at 50% 42%, rgba(18,74,104,.95), rgba(7,37,56,0) 100%), radial-gradient(45% 35% at 15% 85%, rgba(14,151,174,.22), rgba(14,151,174,0) 70%), linear-gradient(180deg, #0B3550, #072538)" }}>
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
        <main data-t="2" style={{ position: "relative", minHeight: "100vh", boxSizing: "border-box", padding: "90px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "22px", textAlign: "center" }}>
          <div className={v.sealCls}>
            <span className="rip" />
            <span className="rip r2" />
            <svg className="press" viewBox="0 0 100 100" aria-hidden="true">
              <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
              <path d={v.wax} fill="url(#dWax)" />
              <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity="0.45" strokeWidth="2.5" />
              <ellipse cx="36" cy="28" rx="15" ry="7" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity="0.3" />
              <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
              <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
            </svg>
            {v.isOff ? (
              <span className="badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E7C873" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 8.8a15 15 0 0 1 4.2-2.6M9.9 4.2A15 15 0 0 1 22 8.8M5 12.6a10 10 0 0 1 3.2-2M15.6 10.3A10 10 0 0 1 19 12.6M8.6 16.2a5 5 0 0 1 6.8 0M12 20h.01M3 3l18 18" />
                  </svg>
                </span>
            ) : null}
          </div>
          <span className="lw">حيّــاك</span>
          {v.isLoad ? (
            <span className="dots" role="status" aria-label="جاري التحميل"><i /><i /><i /></span>
          ) : null}
          {v.isSlow ? (
            <div className="msg" role="status" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", maxWidth: "420px" }}>
                <b style={{ fontSize: "22px", fontWeight: "700" }}>شوي بس، نجهّز لك الصفحة</b>
                <span style={{ fontSize: "16px", lineHeight: "1.8", color: "#B9CCD6" }}>النت عندك يمشي على مهله، خلّك معنا ثواني</span>
                <span className="bar"><i /></span>
              </div>
          ) : null}
          {v.isStuck ? (
            <div className="msg" role="alert" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", maxWidth: "460px" }}>
                <b style={{ fontSize: "24px", fontWeight: "700" }}>الصفحة علّقت معنا</b>
                <span style={{ fontSize: "16px", lineHeight: "1.8", color: "#B9CCD6" }}>ممكن من النت، أو عندنا زحمة. جرّب مرة ثانية، وكل شي حفظته باقي مكانه</span>
                <span style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "4px" }}>
                  <button type="button" className="lbtn" onClick={v.retry} style={{ border: "0", background: "#FAFBFC", color: "#0A2A43", boxShadow: "0 0 0 6px rgba(250,251,252,.08)" }}>جرّب مرة ثانية</button>
                  <A href="LuxC.dc.html" className="lbtn" style={{ border: "1px solid rgba(220,228,232,.45)", color: "#FAFBFC" }}>ارجع للرئيسية</A>
                </span>
                <span style={{ fontSize: "13px", color: "#9FB8C6" }}>إذا تكرر، راسلنا على hayyakinfo@gmail.com</span>
              </div>
          ) : null}
          {v.isOff ? (
            <div className="msg" role="alert" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", maxWidth: "440px" }}>
                <b style={{ fontSize: "24px", fontWeight: "700" }}>النت فاصل</b>
                <span style={{ fontSize: "16px", lineHeight: "1.8", color: "#B9CCD6" }}>أول ما يرجع النت نكمل من حيث وقفت، وما يضيع شي</span>
                <button type="button" className="lbtn" onClick={v.retry} style={{ border: "0", background: "#FAFBFC", color: "#0A2A43" }}>جرّب الحين</button>
              </div>
          ) : null}
        </main>
        {" "}
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
      </div>
    </>
  );
}
