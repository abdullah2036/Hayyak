import { S, txt, A } from '@/ui/dc';

const CSS = `body{margin:0}
@keyframes fqUp{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
@keyframes fqMsg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fqPulse{0%{box-shadow:0 0 0 0 rgba(14,151,174,.5)}100%{box-shadow:0 0 0 18px rgba(14,151,174,0)}}
.fqd1{animation:fqDot 1.4s infinite}.fqd2{animation:fqDot 1.4s .2s infinite}.fqd3{animation:fqDot 1.4s .4s infinite}
@keyframes fqDot{0%,80%,100%{opacity:.25}40%{opacity:1}}
.fqc{transition:background .2s ease,transform .2s ease}.fqc:hover{background:#E6F6F9 !important;transform:translateY(-1px)}
@media (max-width: 760px){.fqw{left:12px !important;right:12px !important;bottom:90px !important}.fqp{width:auto !important;max-height:74vh !important}.fqbw{bottom:86px !important}.fqb{padding:0 7px !important}.fqbt{display:none !important}.fqg{max-width:220px !important}}.fqcats::-webkit-scrollbar{display:none}`;

export default function FAQView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43" }}>
        {" "}
        {v.isOpen ? (
          <div className="fqw" style={S(`${txt(v.liftW)}`)}>
              <div className="fqp" style={{ width: "380px", maxHeight: "600px", display: "flex", flexDirection: "column", borderRadius: "30px", overflow: "hidden", background: "#FAFBFC", boxShadow: "0 40px 90px rgba(4,18,31,.35), 0 0 0 1px rgba(10,42,67,.06)", animation: "fqUp .35s cubic-bezier(.2,.8,.2,1) both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 18px", color: "#FFFFFF", background: "radial-gradient(80% 140% at 20% 0%, rgba(14,151,174,.6), rgba(14,151,174,0) 70%), linear-gradient(180deg, #0B3550, #072538)" }}>
                  <svg width="42" height="42" viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: "visible", flex: "none" }}>
                    <defs>
                      <radialGradient id="fq42" cx="34%" cy="26%" r="85%">
                        <stop offset="0%" stopColor="#A6EEF7" />
                        <stop offset="30%" stopColor="#4FC9DC" />
                        <stop offset="65%" stopColor="#0E97AE" />
                        <stop offset="100%" stopColor="#05505E" />
                      </radialGradient>
                    </defs>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#fq42)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity=".45" strokeWidth="2.5" />
                    <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                    <text x="50" y="58.8" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="42" fill="#FFFFFF">{"ح"}</text>
                  </svg>
                  <span style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                    <b style={{ fontSize: "16px" }}>مساعد حيّــاك</b>
                    <span style={{ fontSize: "12px", color: "#B8D4DE", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#86DCEA" }} />يرد عليك على طول</span>
                  </span>
                  <button type="button" onClick={v.toggle} aria-label="إغلاق" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "0", background: "rgba(255,255,255,.14)", color: "#FFFFFF", fontSize: "18px", cursor: "pointer" }}>{"×"}</button>
                </div>
                <div className="fqm" style={{ flex: "1", minHeight: "0", overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", scrollBehavior: "smooth" }}>
                  {(v.msgs || []).map((m, $i0) => (
                    <div key={m?.key ?? $i0} style={S(`${txt(m?.wrap)}`)}>
                        <span style={S(`${txt(m?.st)}`)}>{m?.t}</span>
                        {m?.hasL ? (
                          <A href={m?.lh} className="fqc" style={{ height: "34px", padding: "0 14px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>{m?.lt}{" ←"}</A>
                        ) : null}
                      </div>
                  ))}
                  {v.typing ? (
                    <div style={{ display: "flex" }}>
                        <span style={{ padding: "12px 16px", borderRadius: "20px 20px 20px 6px", background: "#FFFFFF", boxShadow: "0 4px 12px rgba(10,42,67,.06)", display: "flex", gap: "5px" }}>
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#0E97AE", animation: "fqDot 1s infinite" }} />
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#0E97AE", animation: "fqDot 1s .15s infinite" }} />
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#0E97AE", animation: "fqDot 1s .3s infinite" }} />
                        </span>
                      </div>
                  ) : null}
                  <span style={{ fontSize: "12px", color: "#6B7C88", fontWeight: "700", marginTop: "6px" }}>{v.chipsHead}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {(v.chips || []).map((c, $i1) => (
                      <button key={c?.key ?? $i1} type="button" className="fqc" onClick={c?.ask} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "1px solid #CFE7EE", background: "#FFFFFF", color: "#086577", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>{c?.q}</button>
                    ))}
                  </div>
                </div>
                <div className="fqcats" style={{ flex: "none", display: "flex", gap: "6px", padding: "10px 12px 0", overflowX: "auto", background: "#FFFFFF", borderTop: "1px solid #E3EAEE", scrollbarWidth: "none" }}>
                  {(v.cats || []).map((k, $i2) => (
                    <button key={k?.key ?? $i2} type="button" onClick={k?.pick} style={S(`${txt(k?.st)}`)}>{k?.c}</button>
                  ))}
                </div>
                <div style={{ flex: "none", display: "flex", gap: "8px", padding: "10px 12px 12px", background: "#FFFFFF" }}>
                  <input value={v.draft ?? ''} onChange={v.onDraft} onKeyDown={v.onKey} placeholder="اكتب سؤالك" aria-label="اكتب سؤالك" style={{ flex: "1", height: "46px", borderRadius: "999px", border: "1px solid #DCE4E8", padding: "0 18px", fontSize: "15px", fontFamily: "inherit", color: "#0A2A43", outline: "none" }} />
                  <button type="button" onClick={v.send} aria-label="إرسال" style={{ width: "46px", height: "46px", borderRadius: "50%", border: "0", background: "#0E97AE", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "scaleX(-1)" }}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
                  </button>
                </div>
              </div>
            </div>
        ) : null}
        {" "}
        {v.isClosed ? (
          <div className="fqbw" style={S(`${txt(v.liftB)} display: flex; flex-direction: column; align-items: flex-end; gap: 10px;`)}>
              {v.greet ? (
                <div className="fqg" style={{ position: "relative", maxWidth: "250px", padding: "14px 40px 14px 16px", borderRadius: "22px 22px 22px 6px", background: "#FFFFFF", color: "#0A2A43", boxShadow: "0 18px 40px rgba(4,18,31,.22)", fontSize: "14px", lineHeight: "1.7", animation: "fqUp .45s cubic-bezier(.2,.8,.2,1) both", cursor: "pointer" }} onClick={v.toggle}>
                    <b style={{ display: "block", fontSize: "15px" }}>هلا 👋 أنا مساعد حيّــاك</b>
                    عندك سؤال عن الأسعار أو الدعوات أو الشهادات؟ اسألني
                    <button type="button" onClick={v.noGreet} aria-label="إخفاء" style={{ position: "absolute", right: "10px", top: "10px", width: "24px", height: "24px", borderRadius: "50%", border: "0", background: "#EDF1F3", color: "#4A5B68", fontSize: "13px", cursor: "pointer", lineHeight: "1" }}>{"×"}</button>
                  </div>
              ) : null}
              <button type="button" className="fqb" onClick={v.toggle} aria-label="افتح مساعد حيّــاك للأسئلة" style={{ height: "60px", padding: "0 8px 0 20px", borderRadius: "999px", border: "0", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", background: "linear-gradient(180deg, #123E5C, #0A2A43)", color: "#FFFFFF", fontFamily: "inherit", boxShadow: "0 16px 34px rgba(4,18,31,.35)", animation: "fqPulse 2.4s ease-out 3s 3" }}>
                <span style={{ position: "relative", width: "46px", height: "46px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3.5c4.97 0 9 3.36 9 7.5s-4.03 7.5-9 7.5c-1.1 0-2.15-.16-3.12-.46L4 19.5l1.4-3.6C3.9 14.6 3 12.9 3 11c0-4.14 4.03-7.5 9-7.5z" fill="#FFFFFF" />
                    <circle className="fqd1" cx="8.2" cy="11" r="1.35" fill="#0E97AE" />
                    <circle className="fqd2" cx="12" cy="11" r="1.35" fill="#0E97AE" />
                    <circle className="fqd3" cx="15.8" cy="11" r="1.35" fill="#0E97AE" />
                  </svg>
                  <span style={{ position: "absolute", right: "1px", top: "1px", width: "11px", height: "11px", borderRadius: "50%", background: "#5BE08A", border: "2px solid #0A2A43" }} />
                </span>
                <span className="fqbt" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.3" }}>
                  <b style={{ fontSize: "15px" }}>اسأل المساعد</b>
                  <span style={{ fontSize: "12px", color: "#B8D4DE" }}>يرد عليك على طول</span>
                </span>
              </button>
            </div>
        ) : null}
      </div>
    </>
  );
}
