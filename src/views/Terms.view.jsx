import { S, txt, A } from '@/ui/dc';

const CSS = `body{margin:0;background:#EDF1F3}
a{color:inherit}
@keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,-40px) scale(1.12)}}
.sec{opacity:0;animation:up .8s cubic-bezier(.2,.7,.2,1) both}
.glass2{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.9);box-shadow:0 24px 60px rgba(10,42,67,.08),inset 0 1px 0 #fff}
.tab{transition:transform .3s ease}.tab:hover{transform:translateY(-2px)}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (max-width: 1180px){.g3{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.g3 .wd2,.g3 > article:nth-child(3),.g3 > article:nth-child(7){grid-column:1 / -1}}
@media (max-width: 980px){.grid:not(.g3){grid-template-columns:minmax(0,1fr) !important}.pr{grid-template-columns:minmax(0,1fr) !important}}
@media (max-width: 640px){.hd{padding:26px 16px 120px !important}.h1{font-size:48px !important}.body{padding:0 16px 60px !important}.tl{grid-template-columns:minmax(0,1fr) !important}.g3{grid-template-columns:minmax(0,1fr) !important}.word{font-size:30px !important}article{padding:24px 20px !important}}`;

export default function TermsView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" style={{ fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", color: "#0A2A43", background: "#EDF1F3", minHeight: "100vh" }}>
        {" "}
        <header className="hd" style={{ position: "relative", overflow: "hidden", padding: "34px 48px 150px", background: "radial-gradient(60% 60% at 18% 10%, rgba(14,151,174,.42), rgba(14,151,174,0) 70%), radial-gradient(50% 60% at 85% 90%, rgba(134,220,234,.2), rgba(134,220,234,0) 70%), linear-gradient(180deg, #0B3550, #072538)", color: "#FAFBFC", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
          <span aria-hidden="true" style={{ position: "absolute", left: "-8%", top: "-30%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(14,151,174,.35), rgba(14,151,174,0))", animation: "orb 18s ease-in-out infinite" }} />
          <nav style={{ position: "relative", width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <A href="LuxC.dc.html" className="word" style={{ fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "34px", textDecoration: "none", color: "#FAFBFC" }}>حيّــاك</A>
            <A href="LuxC.dc.html" className="tab" style={{ height: "44px", padding: "0 22px", borderRadius: "999px", border: "1px solid rgba(220,228,232,.45)", textDecoration: "none", display: "inline-flex", alignItems: "center", fontSize: "15px" }}>الرئيسية</A>
          </nav>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center", animation: "up .9s ease-out .1s both" }}>
            <h1 className="h1" style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "76px", lineHeight: "1.2" }}>الشروط والأحكام</h1>
            <p style={{ margin: "0", maxWidth: "620px", fontSize: "20px", lineHeight: "1.8", color: "#DCE4E8" }}>اتفاق واضح وبسيط بينك وبين حيّــاك</p>
            <span style={{ display: "flex", gap: "8px", padding: "6px", borderRadius: "999px", background: "rgba(0,0,0,.2)", marginTop: "6px" }}>
              <span style={{ height: "44px", padding: "0 24px", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", display: "inline-flex", alignItems: "center", fontWeight: "500" }}>الشروط</span>
              <A href="Privacy.dc.html" className="tab" style={{ height: "44px", padding: "0 24px", borderRadius: "999px", color: "#DCE4E8", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>الخصوصية</A>
            </span>
          </div>
        </header>
        {" "}
        <div className="body" style={{ position: "relative", marginTop: "-90px", padding: "0 48px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          <div className="pr" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "16px", width: "100%", maxWidth: "1100px" }}>
            <div className="glass2" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", animation: "up .8s ease-out 0.30s both" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "18px" }}>واضحة</b>
                <span style={{ fontSize: "14px", color: "#4A5B68" }}>بدون بنود مخفية</span>
              </span>
            </div>
            <div className="glass2" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", animation: "up .8s ease-out 0.42s both" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "18px" }}>بدون اشتراك</b>
                <span style={{ fontSize: "14px", color: "#4A5B68" }}>تدفع على اللي تحتاجه بس</span>
              </span>
            </div>
            <div className="glass2" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", animation: "up .8s ease-out 0.54s both" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 7a4 4 0 1 1-3.5 6L5 19.5V22H2v-3l6.5-6.5A4 4 0 0 1 15 7zM16 8h.01" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "18px" }}>محتواك لك</b>
                <span style={{ fontSize: "14px", color: "#4A5B68" }}>شعارك وصورك ملكك</span>
              </span>
            </div>
          </div>
          <div className="grid g3" style={{ width: "100%", maxWidth: "1100px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "20px" }}>
            <article className="sec glass2" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.2s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>حسابك</h2>
              </span>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.85", color: "#2C4A5C", textAlign: "right" }}>أنت مسؤول عن صحة بياناتك وسرية كلمة المرور، وبلّغنا لو لاحظت دخول غريب</p>
            </article>
            <article className="sec glass2" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.25s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l2 2.2 3-.4.6 3 2.6 1.6-1.2 2.8 1.2 2.8-2.6 1.6-.6 3-3-.4L12 21l-2-2.2-3 .4-.6-3L3.8 14.6 5 11.8 3.8 9l2.6-1.6.6-3 3 .4z" />
                  </svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>علامة حيّــاك</h2>
              </span>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.85", color: "#2C4A5C", textAlign: "right" }}>تظهر علامة حيّــاك في كل الدعوات مهما كان رصيدك</p>
            </article>
            <article className="sec glass2" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.3s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 7a4 4 0 1 1-3.5 6L5 19.5V22H2v-3l6.5-6.5A4 4 0 0 1 15 7zM16 8h.01" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>الملكية</h2>
              </span>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.85", color: "#2C4A5C", textAlign: "right" }}>شعاراتك وصورك ونصوصك لك، والقوالب والأختام والحركات لحيّــاك</p>
            </article>
            <article className="sec glass2 wd2" style={{ gridColumn: "1 / -1", borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.35s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18M7 15h4" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>الرصيد والأسعار</h2>
              </span>
              <div className="tl" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "14px" }}>
                <div style={{ borderRadius: "26px", padding: "22px", background: "#FFFFFF", color: "#0A2A43", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 12px 30px rgba(10,42,67,.08)" }}>
                  <b style={{ fontSize: "20px" }}>المجاني</b>
                  <span style={{ fontSize: "15px", lineHeight: "1.7", opacity: ".85" }}>{v.freeTx}</span>
                </div>
                <div style={{ borderRadius: "26px", padding: "22px", background: "linear-gradient(155deg,#123E5C,#0A2A43)", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 12px 30px rgba(10,42,67,.08)" }}>
                  <b style={{ fontSize: "20px" }}>الرصيد</b>
                  <span style={{ fontSize: "15px", lineHeight: "1.7", opacity: ".85" }}>تشتريه مرة وحدة بدون اشتراك، وصالح 30 يوم من يوم الشراء</span>
                </div>
                <div style={{ borderRadius: "26px", padding: "22px", background: "rgba(14,151,174,.12)", color: "#0A2A43", display: "flex", flexDirection: "column", gap: "6px", boxShadow: "0 12px 30px rgba(10,42,67,.08)" }}>
                  <b style={{ fontSize: "20px" }}>التخصيص</b>
                  <span style={{ fontSize: "15px", lineHeight: "1.7", opacity: ".85" }}>سعره منفصل وتدفعه مرة وحدة، ويبقى في حسابك تستخدمه ما دام عندك رصيد مدفوع</span>
                </div>
              </div>
            </article>
            <article className="sec glass2" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.4s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>متى تتحسب الدعوة</h2>
              </span>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.85", color: "#2C4A5C", textAlign: "right" }}>تتحسب الدعوة من رصيدك أول ما ترسلها أو يجهز رابطها لمدعو</p>
            </article>
            <article className="sec glass2" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.45s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>حيّــاك ترسلها عنك</h2>
              </span>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.85", color: "#2C4A5C", textAlign: "right" }}>تأكّد الطلب وترفع الأسماء قبل المناسبة بـ 48 ساعة على الأقل، ونرسلها من حسابات حيّــاك باسمك</p>
            </article>
            <article className="sec glass2" style={{ borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.5s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>التذكير</h2>
              </span>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.85", color: "#2C4A5C", textAlign: "right" }}>تختار قبل الإرسال مين يذكّر المدعوين: حيّــاك أو أنت. ويحتاج ترسل الدعوة قبل المناسبة بيومين على الأقل</p>
            </article>
            <article className="sec glass2 wd2" style={{ gridColumn: "1 / -1", borderRadius: "30px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", animationDelay: "0.55s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "27px", lineHeight: "1.3" }}>الاستخدام</h2>
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  ترسل لأشخاص لك حق التواصل معهم
                </span>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  بدون رسائل مزعجة
                </span>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  بدون محتوى مخالف
                </span>
              </div>
            </article>
          </div>
          <div className="sec glass2" style={{ width: "100%", maxWidth: "1100px", boxSizing: "border-box", borderRadius: "32px", padding: "26px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", animationDelay: ".9s" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 6 9-6" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "20px" }}>عندك سؤال؟</b>
                <span style={{ fontSize: "15px", color: "#4A5B68" }}>نرد عليك خلال 5 أيام عمل</span>
              </span>
            </span>
            <A href="mailto:hayyakinfo@gmail.com" style={{ height: "54px", padding: "0 28px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "16px", display: "inline-flex", alignItems: "center", direction: "ltr" }}>hayyakinfo@gmail.com</A>
          </div>
          <span style={{ fontSize: "14px", color: "#4A5B68", textAlign: "center" }}>تخضع هذه الشروط لأنظمة المملكة العربية السعودية · آخر تحديث 28 أكتوبر 2026</span>
        </div>
        {" "}
        <footer style={{ padding: "0 24px 40px", display: "flex", justifyContent: "center", gap: "22px", flexWrap: "wrap", fontSize: "14px", color: "#4A5B68" }}>
          <span>© 2026 حيّــاك</span>
          <A href="Privacy.dc.html" style={{ textDecoration: "none" }}>الخصوصية</A>
          <A href="Terms.dc.html" style={{ textDecoration: "none" }}>الشروط</A>
          <A href="Signup.dc.html" style={{ textDecoration: "none" }}>أنشئ حسابك</A>
        </footer>
      </div>
    </>
  );
}
