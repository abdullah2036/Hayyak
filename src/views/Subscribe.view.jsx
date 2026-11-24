import { S, txt, A } from '@/ui/dc';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:#086577}
input,button{font-family:'IBM Plex Sans Arabic',sans-serif}
.glass{background:rgba(255,255,255,.65);-webkit-backdrop-filter:blur(26px) saturate(1.4);backdrop-filter:blur(26px) saturate(1.4);border:1px solid rgba(255,255,255,.85);box-shadow:0 24px 60px rgba(10,42,67,.08),inset 0 1px 0 rgba(255,255,255,.9)}
.fld{height:48px;border-radius:14px;border:1px solid #CFD9DF;background:#FFFFFF;color:#0A2A43;padding:0 14px;font-size:15px;box-sizing:border-box;width:100%}
.fld:focus{outline:none;border-color:#0E97AE;box-shadow:0 0 0 4px rgba(14,151,174,.14)}
.in{animation:rise .4s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (max-width: 1180px){.plans{grid-template-columns:repeat(2,minmax(0,1fr)) !important}}
@media (max-width: 700px){.mth{grid-template-columns:minmax(0,1fr) !important}}
@media (max-width: 900px){.body{grid-template-columns:minmax(0,1fr) !important}.sum{position:static !important}.pg{padding:16px 14px 40px !important}.h1m{font-size:32px !important}.f2,.cg{grid-template-columns:minmax(0,1fr) !important}.card{padding:16px !important;border-radius:24px !important}}
@media (max-width: 560px){.plans{grid-template-columns:minmax(0,1fr) !important}}
h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}
h2,h3{font-family:TS,'IBM Plex Sans Arabic',sans-serif;font-weight:700}`;

export default function SubscribeView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ minHeight: "100vh", fontFamily: "'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43", background: "radial-gradient(55% 35% at 88% 0%, #CBEFF5 0%, rgba(203,239,245,0) 70%), #EDF1F3" }}>
        {" "}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="sWax" cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#4CC7DA" />
              <stop offset="55%" stopColor="#0E97AE" />
              <stop offset="100%" stopColor="#086577" />
            </radialGradient>
          </defs>
        </svg>
        {" "}
        <div className="pg" style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 32px 60px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "22px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#sWax)" />
                <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
              </svg>
              <span style={{ fontFamily: "TD, serif", fontSize: "24px" }}>حيّــاك</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4A5B68" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
              طلب آمن
            </span>
            <A href={v.backHref} style={{ color: "#086577", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>{v.backL}</A>
          </header>
          {v.isPick ? (
            <><div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, sans-serif", fontWeight: "700", fontSize: "42px", lineHeight: "1.25" }}>اشترِ رصيد دعوات</h1>
                <span style={{ fontSize: "15px", color: "#3A4B58" }}>تدفع مرة وحدة بدون اشتراك، والرصيد صالح 30 يوم من يوم التفعيل</span>
              </div>
            <div className="body" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: "22px", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: "0" }}>
                  <section className="glass card" style={{ borderRadius: "28px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h2 style={{ margin: "0", fontSize: "18px" }}>مين يرسل الدعوات؟</h2>
                      <span style={{ fontSize: "13px", color: "#4A5B68" }}>السعر يتغير حسب طريقة الإرسال</span>
                    </span>
                    <div className="mth" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
                      {(v.sendWays || []).map((w, $i0) => (
                        <button key={w?.key ?? $i0} type="button" onClick={w?.pick} style={S(`${txt(w?.st)}`)}>
                            <b style={{ fontSize: "15px" }}>{w?.n}</b>
                            <span style={{ fontSize: "12px", opacity: ".8", lineHeight: "1.6" }}>{w?.d}</span>
                          </button>
                      ))}
                    </div>
                  </section>
                  <div className="plans" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
                    {(v.plans || []).map((p, $i1) => (
                      <button key={p?.key ?? $i1} type="button" onClick={p?.pick} aria-pressed={p?.on} style={S(`${txt(p?.st)}`)}>
                          {" "}
                          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <b style={{ fontSize: "18px" }}>{p?.n}</b>
                            <span style={S(`${txt(p?.radio)}`)}><span style={S(`${txt(p?.dot)}`)} /></span>
                          </span>
                          {" "}
                          <span style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <b style={{ fontSize: "32px", lineHeight: "1.1" }}>{p?.price}</b>
                            <span style={{ fontSize: "12px", opacity: ".75" }}>{p?.per}</span>
                          </span>
                          {" "}
                          <span style={{ fontSize: "12px", opacity: ".8", lineHeight: "1.6" }}>{p?.d}</span>
                          {" "}
                        </button>
                    ))}
                    <A href="mailto:hayyakinfo@gmail.com" style={{ gridColumn: "1 / -1", textDecoration: "none", textAlign: "right", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", columnGap: "16px", rowGap: "4px", padding: "16px 20px", borderRadius: "24px", border: "2px dashed rgba(14,151,174,.35)", background: "rgba(230,246,249,.5)", color: "#0A2A43" }}>
                      <b style={{ fontSize: "18px" }}>أكثر من 300؟</b>
                      <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6" }}>نحدد السعر معك حسب حجم مناسبتك</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#086577" }}>تواصل معنا ←</span>
                    </A>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px 18px", borderRadius: "24px", background: "linear-gradient(150deg, rgba(14,151,174,.16), rgba(255,255,255,.65))", border: "1px solid rgba(14,151,174,.25)" }}>
                    <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0E97AE", flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <b style={{ fontSize: "15px" }}>رصيدك صالح 30 يوم من يوم الشراء</b>
                      <span style={{ fontSize: "13px", color: "#3A4B58", lineHeight: "1.7" }}>
                        كل دعوة ترسلها أو رابط يجهز لمدعو ينحسب من رصيدك، واللي ما تستخدمه ينتهي بعد 30 يوم. فاشترِ الرصيد لما تكون جاهز ترسل
                      </span>
                    </span>
                  </div>
                  <section className="glass card" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button type="button" onClick={v.togCu} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", border: "0", background: "transparent", padding: "0", cursor: "pointer", fontFamily: "inherit", color: "#0A2A43", textAlign: "right" }}>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <h2 style={{ margin: "0", fontSize: "18px" }}>{"أضف تخصيص "}<span style={{ fontSize: "13px", color: "#4A5B68", fontWeight: "400" }}>اختياري</span></h2>
                        <span style={{ fontSize: "13px", color: "#4A5B68" }}>{v.custNote}</span>
                      </span>
                      <span style={{ width: "40px", height: "40px", flex: "none", borderRadius: "50%", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{v.cuIc}</span>
                    </button>
                    {v.showCu ? (
                      <><div className="cg" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
                          {(v.custom || []).map((c, $i2) => (
                            <button key={c?.key ?? $i2} type="button" onClick={c?.tog} style={S(`${txt(c?.st)}`)}>
                                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", width: "100%" }}>
                                  <b style={{ fontSize: "14px" }}>{c?.n}</b>
                                  <span style={S(`${txt(c?.box)}`)}>
                                    {c?.on ? (
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                    ) : null}
                                  </span>
                                </span>
                                <span style={{ fontSize: "12px", color: "#4A5B68", lineHeight: "1.6", textAlign: "right" }}>{c?.d}</span>
                                <b style={{ fontSize: "13px", color: "#086577" }}>{c?.p}</b>
                              </button>
                          ))}
                        </div>
                      <span style={{ fontSize: "13px", color: "#4A5B68" }}>عندك فكرة ثانية مثل هوية كاملة أو حركة جديدة؟ تطلبها بعد الشراء من صفحة طلبات التخصيص</span></>
                    ) : null}
                  </section>
                  <section className="glass card" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h2 style={{ margin: "0", fontSize: "18px" }}>بيانات الحساب</h2>
                    <div className="f2" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                        الاسم اللي يظهر في دعواتك
                        <input className="fld" value={v.cName ?? ''} onChange={v.onName} placeholder="اسمك أو اسم مناسبتك" />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                        الإيميل
                        <input className="fld" type="email" value={v.cMail ?? ''} onChange={v.onMail} placeholder="name@example.com" style={{ direction: "ltr", textAlign: "right" }} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
                        الجوال للتواصل
                        <input className="fld" type="tel" value={v.cPhone ?? ''} onChange={v.onPhone} placeholder="05X XXX XXXX" style={{ direction: "ltr", textAlign: "right" }} />
                      </label>
                    </div>
                  </section>
                  {v.hasPending ? (
                    <section className="glass card" style={{ borderRadius: "30px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <h2 style={{ margin: "0", fontSize: "18px" }}>طلبات تنتظر تأكيد الدفع</h2>
                        {(v.pending || []).map((o, $i3) => (
                          <span key={o?.key ?? $i3} style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", padding: "12px 16px", borderRadius: "18px", background: "rgba(231,200,115,.2)", fontSize: "14px" }}><b>{o?.t}</b><span>{o?.d}</span></span>
                        ))}
                      </section>
                  ) : null}
                  {v.hasPast ? (
                    <section className="glass card" style={{ borderRadius: "30px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <h2 style={{ margin: "0", fontSize: "18px" }}>طلباتك السابقة</h2>
                        {(v.past || []).map((o, $i4) => (
                          <span key={o?.key ?? $i4} style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", padding: "12px 16px", borderRadius: "18px", background: "#FFFFFF", fontSize: "14px" }}><b>{o?.t}</b><span style={{ color: "#4A5B68" }}>{o?.d}</span></span>
                        ))}
                      </section>
                  ) : null}
                </div>
                <aside className="sum" style={{ position: "sticky", top: "20px", borderRadius: "28px", padding: "22px", background: "#0A2A43", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 30px 60px rgba(10,42,67,.25)" }}>
                  <h2 style={{ margin: "0", fontSize: "18px" }}>الملخص</h2>
                  {(v.lines || []).map((l, $i5) => (
                    <span key={l?.key ?? $i5} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "14px", paddingBottom: "8px", borderBottom: "1px solid rgba(255,255,255,.12)" }}><span style={{ color: "#CFE7EE" }}>{l?.k}</span><b>{l?.v}</b></span>
                  ))}
                  <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "14px", color: "#CFE7EE" }}>الإجمالي</span>
                    <b style={{ fontFamily: "TD, serif", fontSize: "34px" }}>{v.total}</b>
                  </span>
                  {v.hasReq ? (
                    <span style={{ fontSize: "12px", color: "#B8D4DE", lineHeight: "1.7", padding: "10px 12px", borderRadius: "14px", background: "rgba(255,255,255,.08)" }}>الطلبات اللي «حسب الطلب» ما تنحسب الحين. بنتواصل معك ونتفق على السعر قبل ما نبدأ</span>
                  ) : null}
                  {v.err ? (
                    <span role="alert" style={{ fontSize: "13px", fontWeight: "700", color: "#FFC2C2" }}>{v.err}</span>
                  ) : null}
                  <button type="button" onClick={v.go} style={{ height: "54px", border: "0", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontWeight: "700", fontSize: "16px", cursor: "pointer" }}>{v.cta}</button>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#B8D4DE" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    يوصلنا طلبك ونتواصل معك لتأكيد الدفع، وبعدها ينزل رصيدك
                  </span>
                </aside>
              </div></>
          ) : null}
          {v.isDone ? (
            <div className="in glass card" style={{ maxWidth: "640px", width: "100%", margin: "20px auto 0", boxSizing: "border-box", borderRadius: "32px", padding: "34px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
                <span style={{ width: "68px", height: "68px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
                <h1 className="h1m" style={{ margin: "0", fontFamily: "TS, sans-serif", fontWeight: "700", fontSize: "36px" }}>حيّــاكم معنا</h1>
                <span style={{ fontSize: "15px", color: "#3A4B58", lineHeight: "1.8" }}>{v.doneMsg}</span>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", padding: "14px 16px", borderRadius: "20px", background: "rgba(255,255,255,.75)", textAlign: "right", boxSizing: "border-box" }}>
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span style={{ color: "#4A5B68" }}>رقم الطلب</span><b style={{ direction: "ltr" }}>{v.orderNo}</b></span>
                  {(v.lines || []).map((l, $i6) => (
                    <span key={l?.key ?? $i6} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span style={{ color: "#4A5B68" }}>{l?.k}</span><b>{l?.v}</b></span>
                  ))}
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingTop: "8px", borderTop: "1px solid #DCE4E8" }}><span style={{ color: "#4A5B68" }}>{v.paidL}</span><b>{v.total}</b></span>
                </div>
                {v.hasReq ? (
                  <span style={{ fontSize: "13px", color: "#086577", fontWeight: "700" }}>طلب التخصيص وصلنا، وبنكلّمك خلال يومين عمل</span>
                ) : null}
                <A href="Dashboard.dc.html" style={{ height: "50px", padding: "0 26px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>ادخل لوحتك</A>
                <span style={{ fontSize: "13px", color: "#4A5B68", marginTop: "6px" }}>تابعنا وتواصل معنا</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {(v.socials || []).map((o, $i7) => (
                    <A key={o?.key ?? $i7} href={o?.u} target="_blank" rel="noopener" style={{ height: "40px", padding: "0 16px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #DCE4E8", color: "#0A2A43", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>{o?.n}<span style={{ fontWeight: "400", color: "#4A5B68", direction: "ltr" }}>{o?.h}</span></A>
                  ))}
                </div>
              </div>
          ) : null}
        </div>
        <FAQ open="لا" />
      </div>
    </>
  );
}
