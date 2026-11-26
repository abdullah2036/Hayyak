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

export default function PrivacyView({ v }) {
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
            <h1 className="h1" style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "76px", lineHeight: "1.2" }}>سياسة الخصوصية</h1>
            <p style={{ margin: "0", maxWidth: "620px", fontSize: "20px", lineHeight: "1.8", color: "#DCE4E8" }}>بياناتك وبيانات مدعوينك بأمان، وهذا كل شي بوضوح</p>
            <span style={{ display: "flex", gap: "8px", padding: "6px", borderRadius: "999px", background: "rgba(0,0,0,.2)", marginTop: "6px" }}>
              <span style={{ height: "44px", padding: "0 24px", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", display: "inline-flex", alignItems: "center", fontWeight: "500" }}>الخصوصية</span>
              <A href="Terms.dc.html" className="tab" style={{ height: "44px", padding: "0 24px", borderRadius: "999px", color: "#DCE4E8", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>الشروط</A>
            </span>
          </div>
        </header>
        {" "}
        <div className="body" style={{ position: "relative", marginTop: "-90px", padding: "0 48px 90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          <div className="pr" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "16px", width: "100%", maxWidth: "1100px" }}>
            <div className="glass2" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", animation: "up .8s ease-out 0.30s both" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "18px" }}>ما نبيع بياناتك</b>
                <span style={{ fontSize: "14px", color: "#4A5B68" }}>ولا نشاركها مع جهات ثانية</span>
              </span>
            </div>
            <div className="glass2" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", animation: "up .8s ease-out 0.42s both" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "18px" }}>نحذفها تلقائيًا</b>
                <span style={{ fontSize: "14px", color: "#4A5B68" }}>بعد 180 يوم من المناسبة</span>
              </span>
            </div>
            <div className="glass2" style={{ borderRadius: "28px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", animation: "up .8s ease-out 0.54s both" }}>
              <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "18px" }}>أنت المتحكم</b>
                <span style={{ fontSize: "14px", color: "#4A5B68" }}>تطلب الحذف وقت ما تبي</span>
              </span>
            </div>
          </div>
          <div className="grid" style={{ width: "100%", maxWidth: "1100px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "20px" }}>
            <article className="sec glass2" style={{ borderRadius: "32px", padding: "30px", display: "flex", flexDirection: "column", gap: "18px", animationDelay: "0.2s" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
                  </svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "32px", lineHeight: "1.3" }}>وش نجمع</h2>
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  اسمك وبريدك
                </span>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  أسماء المدعوين ووسيلة تواصلهم
                </span>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  ردود الحضور
                </span>
              </div>
            </article>
            <article className="sec glass2" style={{ borderRadius: "32px", padding: "30px", display: "flex", flexDirection: "column", gap: "18px", animationDelay: "0.28s" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "32px", lineHeight: "1.3" }}>ليش نجمعها</h2>
              </span>
              <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.9", color: "#2C4A5C", textAlign: "right" }}>
                نستخدم بيانات حسابك لتشغيل الخدمة، ونرسل لك أحيانًا عروض حيّــاك الخاصة وتقدر توقفها متى ما تبي. أما بيانات المدعوين فما نستخدمها لأي تسويق أبدًا
              </p>
            </article>
            <article className="sec glass2" style={{ gridColumn: "1 / -1", borderRadius: "32px", padding: "30px", display: "flex", flexDirection: "column", gap: "18px", animationDelay: "0.36s" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "32px", lineHeight: "1.3" }}>مدة الحفظ</h2>
              </span>
              <div className="tl" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "16px" }}>
                <div style={{ borderRadius: "28px", padding: "24px", background: "#FFFFFF", color: "#0A2A43", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 12px 30px rgba(10,42,67,.08)" }}>
                  <span style={{ fontFamily: "TD, TDx, serif", fontSize: "44px", lineHeight: "1.1", color: "#0E97AE" }}>{"0"}</span>
                  <b style={{ fontSize: "19px" }}>يوم المناسبة</b>
                  <span style={{ fontSize: "15px", lineHeight: "1.7", opacity: ".8" }}>البيانات في حسابك وتقدر تصدّرها</span>
                </div>
                <div style={{ borderRadius: "28px", padding: "24px", background: "linear-gradient(155deg,#123E5C,#0A2A43)", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 12px 30px rgba(10,42,67,.08)" }}>
                  <span style={{ fontFamily: "TD, TDx, serif", fontSize: "44px", lineHeight: "1.1", color: "#86DCEA" }}>90 يوم</span>
                  <b style={{ fontSize: "19px" }}>أرشيف مشفّر</b>
                  <span style={{ fontSize: "15px", lineHeight: "1.7", opacity: ".8" }}>تنتقل البيانات لأرشيف ما يطّلع عليه أحد</span>
                </div>
                <div style={{ borderRadius: "28px", padding: "24px", background: "rgba(14,151,174,.1)", color: "#0A2A43", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 12px 30px rgba(10,42,67,.08)" }}>
                  <span style={{ fontFamily: "TD, TDx, serif", fontSize: "44px", lineHeight: "1.1", color: "#0E97AE" }}>180 يوم</span>
                  <b style={{ fontSize: "19px" }}>حذف نهائي</b>
                  <span style={{ fontSize: "15px", lineHeight: "1.7", opacity: ".8" }}>تنحذف بالكامل من أنظمتنا</span>
                </div>
              </div>
              <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.9", color: "#2C4A5C", textAlign: "right" }}>وتقدر تطلب الحذف قبل هذي المدة في أي وقت</p>
            </article>
            <article className="sec glass2" style={{ borderRadius: "32px", padding: "30px", display: "flex", flexDirection: "column", gap: "18px", animationDelay: "0.44s" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "32px", lineHeight: "1.3" }}>ما نبيع بياناتك</h2>
              </span>
              <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.9", color: "#2C4A5C", textAlign: "right" }}>نشاركها فقط مع مزودين يشغّلون الخدمة مثل بوابة الدفع، وما نحفظ بيانات بطاقتك عندنا</p>
            </article>
            <article className="sec glass2" style={{ borderRadius: "32px", padding: "30px", display: "flex", flexDirection: "column", gap: "18px", animationDelay: "0.52s" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <span style={{ width: "60px", height: "60px", flex: "none", borderRadius: "50%", background: "linear-gradient(155deg,#4FC9DC,#0E97AE 55%,#086577)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(14,151,174,.3)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></svg>
                </span>
                <h2 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "32px", lineHeight: "1.3" }}>الحماية</h2>
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  تشفير كامل
                </span>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  صلاحيات محدودة لفريقنا
                </span>
                <span style={{ minHeight: "50px", padding: "8px 20px", boxSizing: "border-box", borderRadius: "999px", background: "#FFFFFF", boxShadow: "0 6px 16px rgba(10,42,67,.06)", fontSize: "16px", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0E97AE", flex: "none" }} />
                  سجل يوضح مين اطّلع ومتى
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
          <span style={{ fontSize: "14px", color: "#4A5B68", textAlign: "center" }}>آخر تحديث 28 أكتوبر 2026</span>
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
