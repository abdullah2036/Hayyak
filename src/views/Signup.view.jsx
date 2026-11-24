import { S, txt, A } from '@/ui/dc';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#072538}
a{color:inherit}
input,button{font-family:'IBM Plex Sans Arabic',sans-serif}
.f{height:58px;border-radius:999px;border:1px solid rgba(220,228,232,.3);background:rgba(255,255,255,.07);color:#FAFBFC;padding:0 22px;font-size:17px;width:100%;box-sizing:border-box;transition:border-color .2s ease,box-shadow .2s ease}
.f::placeholder{color:#7FA0B2}
.f:focus{outline:none;border-color:#86DCEA;box-shadow:0 0 0 5px rgba(134,220,234,.16)}
.btn{position:relative;overflow:hidden;transition:transform .3s ease}.btn:hover{transform:translateY(-2px)}.btn::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.7) 50%,transparent 70%);transform:translateX(120%);transition:transform .8s ease}.btn:hover::after{transform:translateX(-120%)}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes reveal{0%{clip-path:inset(-30% 0 -30% 100%)}100%{clip-path:inset(-30% 0 -30% 0)}}
@keyframes orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,-40px) scale(1.12)}}
@keyframes popB{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:none}}
@keyframes drop{0%{opacity:0;transform:translateY(-80px) scale(1.7) rotate(-30deg)}60%{opacity:1;transform:scale(.9) rotate(-6deg)}100%{opacity:1;transform:rotate(-9deg)}}
@keyframes ink{0%{transform:scale(.5);opacity:0}15%{opacity:.9}100%{transform:scale(2.6);opacity:0}}
.in{animation:up .8s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (max-width: 760px){.word{font-size:72px !important}.card{padding:24px 20px !important}.wrap{padding:30px 16px !important}}
h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}`;

export default function SignupView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", fontFamily: "'IBM Plex Sans Arabic', sans-serif", color: "#FAFBFC", background: "radial-gradient(60% 50% at 18% 12%, rgba(14,151,174,.42), rgba(14,151,174,0) 70%), radial-gradient(55% 50% at 85% 80%, rgba(134,220,234,.22), rgba(134,220,234,0) 70%), linear-gradient(180deg, #0B3550, #072538)" }}>
        {" "}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="sgT" cx="34%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#6FD6E6" />
              <stop offset="45%" stopColor="#0E97AE" />
              <stop offset="100%" stopColor="#05505E" />
            </radialGradient>
          </defs>
        </svg>
        {" "}
        <span aria-hidden="true" style={{ position: "absolute", left: "-10%", top: "-10%", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(14,151,174,.4), rgba(14,151,174,0))", animation: "orb 18s ease-in-out infinite" }} />
        {" "}
        <span aria-hidden="true" style={{ position: "absolute", right: "-12%", bottom: "-15%", width: "760px", height: "760px", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.24), rgba(134,220,234,0))", animation: "orb 22s ease-in-out infinite reverse" }} />
        {" "}
        <div className="wrap" style={{ position: "relative", minHeight: "100vh", boxSizing: "border-box", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
          <A href="LuxC.dc.html" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
            <span className="word" style={{ fontFamily: "TD, serif", fontWeight: "700", fontSize: "96px", lineHeight: "1.15", color: "#FAFBFC", textShadow: "0 0 22px rgba(134,220,234,.35)", animation: "reveal 1.6s cubic-bezier(.5,0,.2,1) .2s both" }}>حيّــاك</span>
            <span style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontFamily: "TD, serif", fontWeight: "700", fontSize: "20px", direction: "ltr", color: "#86DCEA", animation: "up .8s ease-out 1s both" }}><span>{"H"}</span><span>{"A"}</span><span>{"Y"}</span><span>{"Y"}</span><span>{"A"}</span><span>{"K"}</span></span>
          </A>
          <div className="card in" style={{ width: "100%", maxWidth: "480px", boxSizing: "border-box", borderRadius: "36px", padding: "34px 32px", background: "linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04))", WebkitBackdropFilter: "blur(24px)", backdropFilter: "blur(24px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14), 0 40px 90px rgba(0,0,0,.35)", display: "flex", flexDirection: "column", gap: "20px", animationDelay: ".6s" }}>
            {v.showTabs ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", padding: "6px", borderRadius: "999px", background: "rgba(0,0,0,.18)" }}>
                  {(v.tabs || []).map((t, $i0) => (
                    <button key={t?.key ?? $i0} type="button" onClick={t?.go} style={S(`${txt(t?.st)}`)}>{t?.n}</button>
                  ))}
                </div>
            ) : null}
            {v.isForm ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "up .5s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "right" }}>
                    <b style={{ fontFamily: "TD, serif", fontSize: "32px", fontWeight: "700" }}>{v.formTitle}</b>
                    <span style={{ fontSize: "16px", lineHeight: "1.7", color: "#DCE4E8" }}>{v.formSub}</span>
                  </span>
                  {v.isNew ? (
                    <input className="f" value={v.ent ?? ''} onChange={v.onEnt} placeholder="اسمك أو اسم مناسبتك" aria-label="الاسم" autoComplete="name" />
                  ) : null}
                  <input className="f" type="email" autoComplete="email" onKeyDown={v.formKey} value={v.mail ?? ''} onChange={v.onMail} placeholder="الإيميل" aria-label="الإيميل" style={{ direction: "ltr", textAlign: "right" }} />
                  {v.showPw ? (
                    <span style={{ position: "relative", display: "block" }}>
                        <input className="f" type={v.pwType} autoComplete={v.isNew ? 'new-password' : 'current-password'} onKeyDown={v.formKey} value={v.pw ?? ''} onChange={v.onPw} placeholder={v.pwPh} aria-label="كلمة المرور" style={{ width: "100%", boxSizing: "border-box", paddingLeft: "64px" }} />
                        <button type="button" onClick={v.togglePw} aria-label="إظهار كلمة المرور" style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", height: "40px", padding: "0 14px", border: "0", borderRadius: "999px", background: "rgba(255,255,255,.1)", color: "#DCE4E8", fontSize: "13px", cursor: "pointer" }}>{v.pwEye}</button>
                      </span>
                  ) : null}
                  {v.showMeter ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ flex: "1", height: "6px", borderRadius: "999px", background: "rgba(255,255,255,.12)", overflow: "hidden" }}><span style={S(`${txt(v.meterSt)}`)} /></span>
                        <span style={{ fontSize: "13px", color: "#9FB4C2", whiteSpace: "nowrap" }}>{v.meterTx}</span>
                      </span>
                  ) : null}
                  {v.err ? (
                    <span style={{ fontSize: "14px", color: "#FFC2C2", textAlign: "right" }}>{v.errMsg}</span>
                  ) : null}
                  <button type="button" className="btn" onClick={v.send} disabled={v.busy} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", fontWeight: "500", fontSize: "17px", cursor: "pointer", marginTop: "4px" }}>{v.sendTx}</button>
                  {v.showForgot ? (
                    <button type="button" onClick={v.forgot} style={{ alignSelf: "center", border: "0", background: "transparent", color: "#86DCEA", fontSize: "15px", cursor: "pointer" }}>نسيت كلمة المرور</button>
                  ) : null}
                  {v.showCancel ? (
                    <button type="button" onClick={v.cancelReset} style={{ alignSelf: "center", border: "0", background: "transparent", color: "#86DCEA", fontSize: "15px", cursor: "pointer" }}>رجوع لتسجيل الدخول</button>
                  ) : null}
                  <span style={{ fontSize: "13px", lineHeight: "1.7", color: "#9FB4C2", textAlign: "right" }}>{v.formNote}</span>
                </div>
            ) : null}
            {v.isOtp ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "up .5s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "right" }}>
                    <b style={{ fontFamily: "TD, serif", fontSize: "32px", fontWeight: "700" }}>اكتب الرمز</b>
                    <span style={{ fontSize: "16px", lineHeight: "1.7", color: "#DCE4E8" }}>{"أرسلنا رمز من 6 أرقام إلى "}<span style={{ direction: "ltr", display: "inline-block" }}>{v.mail}</span></span>
                  </span>
                  <div style={{ display: "flex", gap: "8px", direction: "ltr", justifyContent: "center" }}>
                    {(v.boxes || []).map((b, $i1) => (
                      <span key={b?.key ?? $i1} style={S(`${txt(b?.st)}`)}>{b?.v}</span>
                    ))}
                  </div>
                  <input className="f" inputMode="numeric" maxLength="6" value={v.code ?? ''} onChange={v.onCode} aria-label="رمز التحقق" autoComplete="one-time-code" onKeyDown={v.codeKey} placeholder="••••••" style={{ textAlign: "center", letterSpacing: "10px", direction: "ltr" }} />
                  {v.err ? (
                    <span role="alert" style={{ fontSize: "14px", color: "#FFC2C2", textAlign: "center" }}>{v.errMsg}</span>
                  ) : null}
                  <button type="button" className="btn" onClick={v.verify} disabled={v.busy} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", fontWeight: "500", fontSize: "17px", cursor: "pointer" }}>تأكيد</button>
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#9FB4C2" }}>
                    <button type="button" onClick={v.back} style={{ border: "0", background: "transparent", color: "#86DCEA", cursor: "pointer", fontSize: "14px" }}>غيّر الإيميل</button>
                    <button type="button" onClick={v.resend} disabled={v.noResend} style={{ border: "0", background: "transparent", color: "#9FB4C2", fontSize: "14px", cursor: "pointer", padding: "0" }}>{v.resendTx}</button>
                  </span>
                </div>
            ) : null}
            {v.isNewPw ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "up .5s ease-out both" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "right" }}>
                    <b style={{ fontFamily: "TD, serif", fontSize: "32px", fontWeight: "700" }}>كلمة مرور جديدة</b>
                    <span style={{ fontSize: "16px", lineHeight: "1.7", color: "#DCE4E8" }}>اختر كلمة مرور تتذكرها وما تستخدمها في مكان ثاني</span>
                  </span>
                  {v.showPw2 ? (
                    <span style={{ position: "relative", display: "block" }}>
                        <input className="f" type={v.pwType} autoComplete="new-password" onKeyDown={v.formKey} value={v.pw ?? ''} onChange={v.onPw} placeholder={v.pwPh} aria-label="كلمة المرور" style={{ width: "100%", boxSizing: "border-box", paddingLeft: "64px" }} />
                        <button type="button" onClick={v.togglePw} aria-label="إظهار كلمة المرور" style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", height: "40px", padding: "0 14px", border: "0", borderRadius: "999px", background: "rgba(255,255,255,.1)", color: "#DCE4E8", fontSize: "13px", cursor: "pointer" }}>{v.pwEye}</button>
                      </span>
                  ) : null}
                  {v.showMeter2 ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ flex: "1", height: "6px", borderRadius: "999px", background: "rgba(255,255,255,.12)", overflow: "hidden" }}><span style={S(`${txt(v.meterSt)}`)} /></span>
                        <span style={{ fontSize: "13px", color: "#9FB4C2", whiteSpace: "nowrap" }}>{v.meterTx}</span>
                      </span>
                  ) : null}
                  {v.err ? (
                    <span style={{ fontSize: "14px", color: "#FFC2C2", textAlign: "right" }}>{v.errMsg}</span>
                  ) : null}
                  <button type="button" className="btn" onClick={v.savePw} style={{ height: "58px", border: "0", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", fontWeight: "500", fontSize: "17px", cursor: "pointer" }}>احفظ وادخل</button>
                </div>
            ) : null}
            {v.isDone ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", textAlign: "center", padding: "10px 0" }}>
                  <span style={{ position: "relative", width: "110px", height: "110px" }}>
                    <span aria-hidden="true" style={{ position: "absolute", inset: "10%", borderRadius: "50%", border: "2px solid #86DCEA", animation: "ink 1.1s ease-out .6s both" }} />
                    <svg width="110" height="110" viewBox="0 0 100 100" aria-hidden="true" style={{ position: "relative", overflow: "visible", animation: "drop .9s cubic-bezier(.3,.7,.2,1) both" }}>
                      <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                      <path d={v.wax} fill="url(#sgT)" />
                      <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity="0.45" strokeWidth="2.5" />
                      <circle cx="50" cy="50.8" r="31" fill="none" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.2" />
                      <ellipse cx="36" cy="28" rx="15" ry="7" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity="0.3" />
                      <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                      <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
                    </svg>
                  </span>
                  <b style={{ fontFamily: "TD, serif", fontSize: "34px", fontWeight: "700", animation: "up .6s ease-out .8s both" }}>{v.doneTitle}</b>
                  <span style={{ fontSize: "17px", lineHeight: "1.8", color: "#DCE4E8", animation: "up .6s ease-out 1s both" }}>{v.doneSub}</span>
                  <A href={v.doneHref} className="btn" style={{ height: "58px", padding: "0 36px", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", textDecoration: "none", fontWeight: "500", fontSize: "17px", display: "inline-flex", alignItems: "center", animation: "up .6s ease-out 1.2s both" }}>{v.doneCta}</A>
                </div>
            ) : null}
          </div>
          <span className="in" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#9FB4C2", animationDelay: "1s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
            بياناتك محفوظة بخصوصية
          </span>
        </div>
        <FAQ open="لا" />
      </div>
    </>
  );
}
