import { S, txt } from '@/ui/dc';

const CSS = `h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
body{margin:0;background:#EDF1F3}
input,button{font-family:TS, 'IBM Plex Sans Arabic', sans-serif}
.f{height:56px;border-radius:999px;border:1px solid rgba(10,42,67,.16);background:#FFFFFF;padding:0 22px;font-size:16px;color:#0A2A43;width:100%;box-sizing:border-box;transition:border-color .2s ease,box-shadow .2s ease}
.f:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 5px rgba(14,151,174,.14)}
.btn{transition:transform .25s ease,box-shadow .25s ease}.btn:hover{transform:translateY(-2px)}
@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes drop{0%{opacity:0;transform:translateY(-120px) scale(1.8) rotate(-40deg)}60%{opacity:1;transform:scale(.94) rotate(-6deg)}100%{opacity:1;transform:rotate(-9deg)}}
@keyframes ring{0%{transform:scale(.6);opacity:0}20%{opacity:.8}100%{transform:scale(2);opacity:0}}
@keyframes tw{0%,100%{opacity:.2}50%{opacity:.9}}
.in{animation:rise .6s cubic-bezier(.2,.8,.2,1) both}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (max-width: 900px){.split{flex-direction:column !important}.brand{min-height:0 !important;flex:0 0 auto !important;padding:34px 20px 64px !important;gap:12px !important}.bseal{transform:scale(.42);margin:-84px !important}.bword{font-size:48px !important}.form{position:relative;z-index:2;margin-top:-34px;border-radius:34px 34px 0 0;background:#EDF1F3;padding:34px 20px 44px !important;align-items:flex-start !important}.ttl{font-size:32px !important}}`;

export default function AdminLoginView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" className="split" style={{ minHeight: "100vh", display: "flex", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43", background: "#EDF1F3" }}>
        <div className="brand" style={{ flex: "1 1 50%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "34px", color: "#FFFFFF", background: "radial-gradient(60% 50% at 30% 20%, rgba(14,151,174,.5), rgba(14,151,174,0) 70%), radial-gradient(50% 50% at 80% 90%, rgba(134,220,234,.22), rgba(134,220,234,0) 70%), linear-gradient(180deg, #0B3550, #072538)" }}>
          {(v.stars || []).map((x, $i0) => (
            <span key={x?.key ?? $i0} aria-hidden="true" style={S(`${txt(x?.st)}`)} />
          ))}
          <div className="bseal" style={{ position: "relative", width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="420" height="420" viewBox="0 0 100 100" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", margin: "-210px 0 0 -210px", animation: "spin 80s linear infinite" }}>
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(134,220,234,.25)" strokeWidth=".3" strokeDasharray="1 2.2" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(134,220,234,.15)" strokeWidth=".25" />
            </svg>
            <span aria-hidden="true" style={{ position: "absolute", inset: "20px", borderRadius: "50%", border: "3px solid #86DCEA", animation: "ring 1.4s ease-out 1s both" }} />
            <span style={{ animation: "drop 1s cubic-bezier(.3,.7,.2,1) .3s both", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.4))" }}>
              <svg width="230" height="230" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible" }}>
                <defs>
                  <radialGradient id="sg230" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#A6EEF7" />
                    <stop offset="25%" stopColor="#4FC9DC" />
                    <stop offset="60%" stopColor="#0E97AE" />
                    <stop offset="100%" stopColor="#05505E" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="#033A44" transform="translate(0 2.4)" />
                <path d={v.wax} fill="url(#sg230)" />
                <circle cx="50" cy="50" r="31.5" fill="none" stroke="#05505E" strokeOpacity=".55" strokeWidth="2.6" />
                <circle cx="50" cy="50.9" r="31.5" fill="none" stroke="#C9F4FA" strokeOpacity=".55" strokeWidth="1.1" />
                <ellipse cx="34" cy="24" rx="16" ry="6" transform="rotate(-30 34 24)" fill="#FFFFFF" fillOpacity=".35" />
                <text x="50" y="60.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="42" fill="#033A44" fillOpacity=".7">{"ح"}</text>
                <text x="50" y="58.8" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="42" fill="#FFFFFF">{"ح"}</text>
              </svg>
            </span>
          </div>
          <div className="in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", animationDelay: ".9s" }}>
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
              <span className="bword" style={{ fontFamily: "TD, TDx, serif", fontSize: "64px", lineHeight: "1.15", textShadow: "0 0 24px rgba(134,220,234,.4)" }}>حيّــاك</span>
              <span style={{ display: "flex", justifyContent: "space-between", direction: "ltr", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "18px", color: "#86DCEA", marginTop: "6px" }}><span>{"S"}</span><span>{"T"}</span><span>{"U"}</span><span>{"D"}</span><span>{"I"}</span><span>{"O"}</span></span>
            </span>
            <span style={{ fontSize: "16px", color: "#C9D6DD", marginTop: "8px" }}>مساحة فريق الإدارة</span>
          </div>
        </div>
        <div className="form" style={{ flex: "1 1 50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <div className="in" style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "22px", animationDelay: ".5s" }}>
            {v.isEmail ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "rise .4s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
                    <b className="ttl" style={{ fontFamily: "TD, TDx, serif", fontSize: "40px", lineHeight: "1.25" }}>أهلًا في الاستوديو</b>
                    <span style={{ fontSize: "16px", color: "#3A4B58", lineHeight: "1.7" }}>ادخل بإيميلك المسجّل في الفريق، ويوصلك رمز التحقق عليه</span>
                  </span>
                  <input className="f" type="email" autoComplete="email" onKeyDown={v.mailKey} value={v.mail ?? ''} onChange={v.onMail} placeholder="name@gmail.com" aria-label="الإيميل" style={{ direction: "ltr", textAlign: "right" }} />
                  {v.mailErr ? (
                    <span style={{ fontSize: "14px", color: "#B04A4A" }}>{v.mailErrTx}</span>
                  ) : null}
                  <button type="button" className="btn" onClick={v.send} disabled={v.busy} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "17px", cursor: "pointer", boxShadow: "0 14px 30px rgba(10,42,67,.25)" }}>أرسل الرمز</button>
                </div>
            ) : null}
            {v.isOtp ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "rise .4s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
                    <b style={{ fontFamily: "TD, TDx, serif", fontSize: "40px", lineHeight: "1.25" }}>اكتب الرمز</b>
                    <span style={{ fontSize: "16px", color: "#3A4B58" }}>
                      {"لو الإيميل مسجّل في الفريق بيوصلك الرمز على "}
                      <span style={{ direction: "ltr", display: "inline-block" }}>{v.mail}</span>
                    </span>
                  </span>
                  <div style={{ display: "flex", gap: "8px", direction: "ltr", justifyContent: "center" }}>
                    {(v.boxes || []).map((b, $i1) => (
                      <span key={b?.key ?? $i1} style={S(`${txt(b?.st)}`)}>{b?.v}</span>
                    ))}
                  </div>
                  <input className="f" inputMode="numeric" maxLength="6" value={v.code ?? ''} onChange={v.onCode} aria-label="رمز التحقق" autoComplete="one-time-code" onKeyDown={v.codeKey} placeholder="••••••" style={{ textAlign: "center", letterSpacing: "10px", direction: "ltr" }} />
                  {v.codeErr ? (
                    <span role="alert" style={{ fontSize: "14px", color: "#8A2D3B", fontWeight: "700" }}>{v.codeErr}</span>
                  ) : null}
                  <button type="button" className="btn" onClick={v.verify} disabled={v.busy} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "17px", cursor: "pointer" }}>تحقق</button>
                  <button type="button" onClick={v.back} style={{ alignSelf: "center", border: "0", background: "transparent", color: "#086577", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>غيّر الإيميل</button>
                </div>
            ) : null}
            {v.isSetup ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "rise .4s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
                    <b style={{ fontFamily: "TD, TDx, serif", fontSize: "36px", lineHeight: "1.25" }}>فعّل تطبيق التحقق</b>
                    <span style={{ fontSize: "15px", color: "#3A4B58", lineHeight: "1.8" }}>امسح الباركود بتطبيق مثل Google Authenticator أو Microsoft Authenticator أو 1Password، واكتب الرمز اللي يطلع</span>
                  </span>
                  <span style={{ alignSelf: "center", padding: "14px", borderRadius: "22px", background: "#FFFFFF", boxShadow: "0 12px 30px rgba(10,42,67,.12)" }}>
                    <svg width="180" height="180" viewBox={v.qrBox} role="img" aria-label="باركود تطبيق التحقق">
                      {v.qr.map((m, i) => <rect key={i} x={m.x} y={m.y} width="1" height="1" fill="#0A2A43" />)}
                    </svg>
                  </span>
                  <span style={{ textAlign: "center", fontSize: "13px", color: "#4A5B68" }}>ما قدرت تمسحه؟ اكتب هذا المفتاح في التطبيق<br /><b style={{ direction: "ltr", display: "inline-block", fontFamily: "monospace", fontSize: "14px", color: "#0A2A43", userSelect: "all" }}>{v.secret}</b></span>
                </div>
            ) : null}
            {v.isSetup || v.isApp ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {v.isApp ? (
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
                      <b style={{ fontFamily: "TD, TDx, serif", fontSize: "40px", lineHeight: "1.25" }}>رمز التطبيق</b>
                      <span style={{ fontSize: "15px", color: "#3A4B58", lineHeight: "1.8" }}>{v.appNote}</span>
                    </span>
                  ) : null}
                  <input className="f" inputMode={v.useRec ? 'text' : 'numeric'} value={v.app} onChange={v.onApp} onKeyDown={v.appKey} aria-label="رمز تطبيق التحقق" autoComplete="one-time-code" placeholder={v.appPh} style={{ textAlign: "center", letterSpacing: v.useRec ? "2px" : "10px", direction: "ltr" }} />
                  {v.codeErr ? (
                    <span role="alert" style={{ fontSize: "14px", color: "#8A2D3B", fontWeight: "700" }}>{v.codeErr}</span>
                  ) : null}
                  <button type="button" className="btn" onClick={v.confirm} disabled={v.busy} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "17px", cursor: "pointer" }}>تأكيد</button>
                  {v.isApp ? (
                    <button type="button" onClick={v.togRec} style={{ alignSelf: "center", border: "0", background: "transparent", color: "#086577", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>{v.recL}</button>
                  ) : null}
                </div>
            ) : null}
            {v.isCodes ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "rise .4s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
                    <b style={{ fontFamily: "TD, TDx, serif", fontSize: "36px", lineHeight: "1.25" }}>رموزك الاحتياطية</b>
                    <span style={{ fontSize: "15px", color: "#3A4B58", lineHeight: "1.8" }}>احفظها في مكان آمن غير جوالك. لو ضاع الجوال تدخل بواحد منها، وما نقدر نعرضها مرة ثانية</span>
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", direction: "ltr" }}>
                    {v.codes.map((c) => <span key={c} style={{ padding: "12px", borderRadius: "16px", background: "#FFFFFF", textAlign: "center", fontFamily: "monospace", fontSize: "16px" }}>{c}</span>)}
                  </div>
                  <button type="button" className="btn" onClick={v.copyCodes} style={{ height: "52px", borderRadius: "999px", border: "1.5px solid #0A2A43", background: "transparent", color: "#0A2A43", fontWeight: "700", fontSize: "16px", cursor: "pointer", fontFamily: "inherit" }}>{v.copyL}</button>
                  <button type="button" className="btn" onClick={v.done} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "17px", cursor: "pointer", fontFamily: "inherit" }}>حفظتها، كمّل</button>
                </div>
            ) : null}
            {v.isIn ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", textAlign: "center", animation: "rise .4s ease-out both" }}>
                  <span style={{ width: "76px", height: "76px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(14,151,174,.35)" }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </span>
                  <b style={{ fontFamily: "TD, TDx, serif", fontSize: "38px" }}>{"أهلًا "}{v.name}</b>
                  <span style={{ fontSize: "15px", color: "#3A4B58" }}>الجلسة آمنة لمدة 30 دقيقة</span>
                  <button type="button" className="btn" onClick={v.enter} style={{ marginTop: "6px", height: "58px", padding: "0 40px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", fontSize: "17px", textDecoration: "none", display: "inline-flex", alignItems: "center", border: "0", cursor: "pointer", fontFamily: "inherit" }}>ادخل الاستوديو</button>
                </div>
            ) : null}
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px", color: "#4A5B68" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
              5 محاولات غلط تقفل الدخول ساعة، وكل دخول ينسجل
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
