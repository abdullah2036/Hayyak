import { S, txt, A } from '@/ui/dc';

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
h2,h3{font-family:TS, 'IBM Plex Sans Arabic', sans-serif;font-weight:700}
@media (max-width: 1240px){.gj{width:auto !important}.gjr{padding:32px 24px !important;gap:28px !important}}
@media (max-width: 900px){.gjr{flex-direction:column;align-items:center;padding:16px 14px 40px !important}.gjr > *{width:100%;flex:none !important}.gjr > .gjp{width:min(408px,100%) !important}.gj h1{font-size:30px !important}}`;

export default function GuestJourneyView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" className="gj" style={{ width: "1200px", minHeight: "100vh", margin: "0 auto", position: "relative", overflow: "hidden", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43", background: "radial-gradient(55% 50% at 88% 4%, #CBEFF5 0%, rgba(203,239,245,0) 70%), radial-gradient(45% 40% at 6% 96%, #DCE4E8 0%, rgba(220,228,232,0) 70%), #EDF1F3" }}>
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
        <div className="gjr" style={{ position: "relative", display: "flex", gap: "48px", padding: "44px 56px", boxSizing: "border-box" }}>
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "22px" }}>
            <div data-t="1" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <A href={v.back} style={{ fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>→ الحضور والشهادات</A>
                <button type="button" className="tourb" onClick={v.startTour}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.6M12 17h.01" /></svg>
                  دلّني
                </button>
              </span>
              <h1 style={{ margin: "0", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.2" }}>رحلة المدعو</h1>
              <span className="sub" style={{ fontSize: "15px" }}>كل شي يصير في نفس رابط الدعوة: يأكّد، يسجّل حضوره، وتوصله شهادته. جرّب الجوال بنفسك</span>
            </div>
            <div data-t="4" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "700" }}>نوع الفعالية</span>
              {(v.modes || []).map((m, $i0) => (
                <button key={m?.key ?? $i0} type="button" className="chip" onClick={m?.on} aria-pressed={m?.pr} style={S(`${txt(m?.st)}`)}>{m?.l}</button>
              ))}
            </div>
            <ol data-t="2" style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {(v.stages || []).map((g, $i1) => (
                <li key={g?.key ?? $i1}>
                    <button type="button" onClick={g?.go} aria-pressed={g?.pr} style={S(`${txt(g?.st)}`)}>
                      <span style={S(`${txt(g?.num)}`)}>{g?.i}</span>
                      <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right" }}>
                        <b style={{ fontSize: "16px" }}>{g?.t}</b>
                        <span style={{ fontSize: "13px", lineHeight: "1.7", color: "#3A4B58" }}>{g?.d}</span>
                      </span>
                    </button>
                  </li>
              ))}
            </ol>
            <span style={{ marginTop: "auto", display: "flex", gap: "10px", alignItems: "center", padding: "14px 18px", borderRadius: "20px", background: "rgba(231,200,115,.25)", color: "#5B4A12", fontSize: "14px", lineHeight: "1.7" }}>
              <b style={{ fontFamily: "TD, TDx, serif", fontSize: "22px", direction: "ltr" }}>4827</b>
              كود الحضور في المعاينة. جرّب تكتب رقم غلط بعد وشوف وش يصير
            </span>
          </div>
          <div data-t="3" className="gjp" style={{ flex: "none", width: "390px", height: "812px", borderRadius: "52px", background: "#04121F", boxShadow: "0 0 0 8px #0b2233, 0 40px 80px rgba(4,18,31,.35)", padding: "10px", boxSizing: "border-box" }}>
            {" "}
            <div style={{ width: "100%", height: "100%", borderRadius: "44px", overflow: "hidden", background: "#F4F7F8", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", flex: "none", height: "230px", background: "radial-gradient(120% 90% at 80% 0%,#123E5C,#0A2A43 50%,#04121F)", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: "6px", padding: "0 20px 22px", boxSizing: "border-box", textAlign: "center" }}>
                {(v.stars || []).map((x, $i2) => (
                  <span key={x?.key ?? $i2} style={S(`${txt(x?.st)}`)} />
                ))}
                <svg width="62" height="62" viewBox="0 0 100 100" aria-hidden="true" style={{ position: "relative", transform: "rotate(-10deg)" }}>
                  <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                  <path d={v.wax} fill="url(#dWax)" />
                  <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity=".45" strokeWidth="2.5" />
                  <text x="50" y="57" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="22" fill="#FFFFFF">مدعو</text>
                </svg>
                <b style={{ position: "relative", fontFamily: "TD, TDx, serif", fontSize: "32px", lineHeight: "1.2" }}>{v.evTitle}</b>
                <span style={{ position: "relative", fontSize: "13px", color: "#CFE7EE" }}>{v.evLine}</span>
              </div>
              <div style={{ flex: "1", minHeight: "0", overflow: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {v.s0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "rise .35s ease-out both" }}>
                      <div style={{ padding: "18px", borderRadius: "26px", background: "#FFFFFF", boxShadow: "0 8px 24px rgba(10,42,67,.06)", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <b style={{ fontSize: "18px" }}>هلا سارة، تحضر؟</b>
                        {v.noRsvp ? (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                              <button type="button" className="btnp" onClick={v.yes} style={{ height: "50px" }}>أكيد بحضر</button>
                              <button type="button" className="btn" onClick={v.no} style={{ height: "50px" }}>أعتذر</button>
                            </div>
                        ) : null}
                        {v.rsvpYes ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                              <span style={{ fontSize: "14px", color: "#086577", fontWeight: "700" }}>يسعدنا حضورك ✓</span>
                              <label className="lbl">
                                اسمك مثل ما بيطلع في الشهادة
                                <input className="fld" value={v.name ?? ''} onChange={v.onName} style={{ height: "48px" }} />
                              </label>
                              <span style={{ fontSize: "12px", color: "#4A5B68" }}>تقدر تعدّله لين تطلع الشهادة</span>
                              <label className="lbl">
                                اسمك بالإنجليزي (إذا الشهادة بلغتين)
                                <input className="fld" dir="ltr" defaultValue="Sara Ahmed Alghamdi" readOnly style={{ height: "48px", textAlign: "left", color: "#4A5B68" }} />
                              </label>
                              <label className="lbl">
                                الرقم الجامعي (إذا طلبته الجهة)
                                <input className="fld" defaultValue="443•••112" readOnly style={{ height: "48px", color: "#4A5B68" }} />
                              </label>
                            </div>
                        ) : null}
                        {v.rsvpNo ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <span style={{ fontSize: "14px", color: "#3A4B58" }}>وصل اعتذارك، نشوفك المرة الجاية</span>
                              <button type="button" className="btn" onClick={v.undo} style={{ alignSelf: "flex-start", height: "42px" }}>غيّرت رأيي</button>
                            </div>
                        ) : null}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <span className="btn" style={{ height: "46px", fontSize: "13px" }}>أضفها للتقويم</span>
                        <span className="btn" style={{ height: "46px", fontSize: "13px" }}>افتح الموقع</span>
                      </div>
                      {v.rsvpYes ? (
                        <button type="button" className="btn" onClick={v.toDuring} style={{ width: "100%" }}>يوم الفعالية ←</button>
                      ) : null}
                    </div>
                ) : null}
                {v.s1 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "rise .35s ease-out both" }}>
                      <span style={{ alignSelf: "center", display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(14,151,174,.14)", color: "#086577", fontSize: "13px", fontWeight: "700" }}>
                        <span className="pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0E97AE" }} />
                        {v.livePill}
                      </span>
                      <div style={{ padding: "20px 18px", borderRadius: "26px", background: "#FFFFFF", boxShadow: "0 8px 24px rgba(10,42,67,.06)", display: "flex", flexDirection: "column", gap: "12px", textAlign: "center" }}>
                        <b style={{ fontFamily: "TD, TDx, serif", fontSize: "28px" }}>سجّل حضورك</b>
                        <span style={{ fontSize: "14px", color: "#3A4B58" }}>{v.codeHint}</span>
                        <input value={v.code ?? ''} onChange={v.onCode} onKeyDown={v.codeKey} inputMode="numeric" maxLength="4" aria-label="كود الحضور" placeholder="• • • •" style={S(`${txt(v.codeSt)}`)} />
                        {v.err ? (
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#8A2D3B" }}>الكود غلط، تأكد منه وجرّب مرة ثانية</span>
                        ) : null}
                        <button type="button" className="btnp" onClick={v.submit} style={{ height: "52px" }}>سجّل حضوري</button>
                        {v.inPerson ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#4A5B68" }}>
                                <span style={{ flex: "1", height: "1px", background: "#DCE4E8" }} />
                                أو
                                <span style={{ flex: "1", height: "1px", background: "#DCE4E8" }} />
                              </span>
                              <button type="button" className="btn" onClick={v.scan} style={{ height: "50px" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                  <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" />
                                </svg>
                                امسح الباركود
                              </button>
                            </div>
                        ) : null}
                      </div>
                      <span style={{ textAlign: "center", fontSize: "12px", color: "#4A5B68" }}>التسجيل مفتوح لين 7:58 م</span>
                    </div>
                ) : null}
                {v.s2 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", textAlign: "center", paddingTop: "10px" }}>
                      <span style={{ width: "92px", height: "92px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(14,151,174,.35)", animation: "pop .55s cubic-bezier(.2,.8,.2,1) both" }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
                      </span>
                      <b style={{ fontFamily: "TD, TDx, serif", fontSize: "30px", lineHeight: "1.3" }}>{"حيّاك يا "}{v.first}</b>
                      <span style={{ fontSize: "14px", color: "#3A4B58" }}>انسجل حضورك الساعة 7:43 م</span>
                      <div style={{ width: "100%", boxSizing: "border-box", padding: "16px", borderRadius: "24px", background: "#FFFFFF", boxShadow: "0 8px 24px rgba(10,42,67,.06)", display: "flex", gap: "12px", alignItems: "center", textAlign: "right" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(231,200,115,.35)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8A5A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H4zM8 20l4-3 4 3M8 9h8M8 12h5" /></svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>شهادتك جاية</b>
                          <span style={{ fontSize: "13px", color: "#4A5B68", lineHeight: "1.6" }}>تطلع لك هنا في نفس الرابط أول ما يتسكّر التسجيل</span>
                        </span>
                      </div>
                      <button type="button" className="btn" onClick={v.toAfter} style={{ width: "100%" }}>شوف الرابط بعد الفعالية ←</button>
                    </div>
                ) : null}
                {v.s3 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "rise .35s ease-out both" }}>
                      <b style={{ fontFamily: "TD, TDx, serif", fontSize: "28px", textAlign: "center" }}>شهادتك جاهزة</b>
                      <div style={{ position: "relative", aspectRatio: "1.41", borderRadius: "12px", background: "radial-gradient(80% 90% at 50% 0%, #FFFFFF, #F8FAFB 60%, #F0F4F5)", boxShadow: "0 12px 30px rgba(10,42,67,.14)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "12px 18px", boxSizing: "border-box" }}>
                        <svg viewBox="0 0 1123 794" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }}>
                          <path d="M34 154 V34 H154 M1089 154 V34 H969 M34 640 V760 H154 M1089 640 V760 H969" fill="none" stroke="#0E97AE" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="0 0 100 100" aria-hidden="true" style={{ position: "absolute", left: "-40px", bottom: "-50px", width: "150px", height: "150px", opacity: ".07" }}><path d={v.wax} fill="#0E97AE" /></svg>
                        <b style={{ fontFamily: "TD, TDx, serif", fontSize: "22px", color: "#0E97AE", lineHeight: "1.2" }}>شهادة حضور</b>
                        <span style={{ fontSize: "8px", color: "#4A5B68" }}>{v.certLine}</span>
                        <b style={{ fontFamily: "TD, TDx, serif", fontSize: "19px", lineHeight: "1.5" }}>{v.name}</b>
                        <span style={{ fontSize: "7px", color: "#1E3A4E" }}>{v.certPara}</span>
                        <span style={{ position: "absolute", top: "9px", right: "12px", display: "inline-flex", alignItems: "center", gap: "3px", fontFamily: "TD, TDx, serif", fontSize: "9px" }}>
                          <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "14px", height: "14px" }}><path d={v.wax} fill="url(#dWax)" /></svg>
                          حيّــاك
                        </span>
                      </div>
                      <button type="button" className="btnp" onClick={v.dl} style={{ height: "52px" }}>{v.dlL}</button>
                      <button type="button" className="btn" style={{ height: "48px" }}>صورة للستوري</button>
                      <div style={{ padding: "16px", borderRadius: "22px", background: "#FFFFFF", boxShadow: "0 8px 24px rgba(10,42,67,.06)", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0E97AE" }}>{"رسالة من "}{v.org}</span>
                        <span style={{ fontSize: "14px", lineHeight: "1.8" }}>{"شكرًا لحضوركم «"}{v.evTitle}{"»، وجودكم فرق معنا. شهادتكم موجودة في نفس رابط الدعوة"}</span>
                      </div>
                    </div>
                ) : null}
              </div>
            </div>
            {" "}
          </div>
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
      </div>
    </>
  );
}
