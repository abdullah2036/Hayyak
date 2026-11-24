import { S, txt, A, Still } from '@/ui/dc';

const CSS = `body{margin:0}
input,button{font-family:'IBM Plex Sans Arabic',TS,sans-serif}
.lat{font-family:TD,serif;font-weight:700;letter-spacing:4px;direction:ltr}
.field:focus{outline:none;border-color:var(--c1) !important;box-shadow:0 0 0 4px rgba(134,220,234,.18)}
.inA{animation:inA .6s cubic-bezier(.2,.8,.2,1) both}.inB{animation:inB .6s cubic-bezier(.2,.8,.2,1) both}
.nmA{animation:maskA .9s cubic-bezier(.4,0,.2,1) .9s both}.nmB{animation:maskB .9s cubic-bezier(.4,0,.2,1) .9s both}
.sgA{animation:dropA .85s cubic-bezier(.3,.7,.2,1) 1.4s both}.sgB{animation:dropB .85s cubic-bezier(.3,.7,.2,1) 1.4s both}
.irA{animation:inkA .9s ease-out 1.88s both}.irB{animation:inkB .9s ease-out 1.88s both}
.thA{animation:thudA .35s ease-out 1.86s both}.thB{animation:thudB .35s ease-out 1.86s both}
.lbA{animation:lblA .6s cubic-bezier(.3,.7,.2,1) 2.2s both}.lbB{animation:lblB .6s cubic-bezier(.3,.7,.2,1) 2.2s both}.shA{animation:shineA 1.3s ease-in-out 2.9s both}.shB{animation:shineB 1.3s ease-in-out 2.9s both}
@keyframes inA{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}@keyframes inB{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes maskA{from{clip-path:inset(-20% 0 -20% 100%)}to{clip-path:inset(-20% 0 -20% 0)}}@keyframes maskB{from{clip-path:inset(-20% 0 -20% 100%)}to{clip-path:inset(-20% 0 -20% 0)}}
@keyframes dropA{0%{opacity:0;transform:translateY(-130px) scale(1.7) rotate(-36deg)}55%{opacity:1;transform:translateY(0) scale(.86) rotate(-7deg)}72%{opacity:1;transform:scale(1.05) rotate(-12deg)}86%{opacity:1;transform:scale(.99) rotate(-10.5deg)}100%{opacity:1;transform:scale(1) rotate(-11deg)}}
@keyframes dropB{0%{opacity:0;transform:translateY(-130px) scale(1.7) rotate(-36deg)}55%{opacity:1;transform:translateY(0) scale(.86) rotate(-7deg)}72%{opacity:1;transform:scale(1.05) rotate(-12deg)}86%{opacity:1;transform:scale(.99) rotate(-10.5deg)}100%{opacity:1;transform:scale(1) rotate(-11deg)}}
@keyframes inkA{0%{transform:scale(.55);opacity:0}12%{opacity:.7}100%{transform:scale(1.9);opacity:0}}@keyframes inkB{0%{transform:scale(.55);opacity:0}12%{opacity:.7}100%{transform:scale(1.9);opacity:0}}
@keyframes thudA{0%,100%{transform:none}40%{transform:translateY(3px) scale(.994)}}@keyframes thudB{0%,100%{transform:none}40%{transform:translateY(3px) scale(.994)}}
@keyframes lblA{0%{opacity:0;transform:scale(1.35)}100%{opacity:1;transform:scale(1)}}@keyframes lblB{0%{opacity:0;transform:scale(1.35)}100%{opacity:1;transform:scale(1)}}
@keyframes shineA{0%{transform:translateX(130%) rotate(20deg);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(-130%) rotate(20deg);opacity:0}}@keyframes shineB{0%{transform:translateX(130%) rotate(20deg);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(-130%) rotate(20deg);opacity:0}}
@keyframes growX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes blink{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:none}}
@keyframes softIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}
@keyframes glowRing{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}50%{box-shadow:0 0 0 6px rgba(255,255,255,.28)}}
@keyframes lcard{from{opacity:0;transform:translateY(40px) rotate(4deg)}to{opacity:1;transform:rotate(-8deg)}}
@keyframes lseal{0%{opacity:0;transform:translateY(-70px) scale(1.8) rotate(-30deg)}60%{opacity:1;transform:scale(.88) rotate(-4deg)}100%{opacity:1;transform:none}}
@keyframes link{0%{transform:scale(.6);opacity:0}15%{opacity:.8}100%{transform:scale(2.2);opacity:0}}
@keyframes lname{from{clip-path:inset(-20% 0 -20% 100%);opacity:.2}to{clip-path:inset(-20% 0 -20% 0);opacity:1}}
@keyframes curOpenL{0%{clip-path:path('M0 0 L220 0 C220 140 220 260 220 330 C220 360 220 460 220 540 L0 540 Z')}100%{clip-path:path('M0 0 L130 0 C100 120 40 250 30 322 C24 360 46 460 74 540 L0 540 Z')}}
@keyframes curOpenR{0%{clip-path:path('M220 0 L0 0 C0 140 0 260 0 330 C0 360 0 460 0 540 L220 540 Z')}100%{clip-path:path('M220 0 L90 0 C120 120 180 250 190 322 C196 360 174 460 146 540 L220 540 Z')}}
@keyframes beamOn{from{opacity:0}}
@keyframes warpIn{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0)}}@keyframes loomR{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0)}}@keyframes loomL{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}@keyframes shR{0%{left:100%;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:-22px;opacity:0}}@keyframes shL{0%{left:-22px;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:100%;opacity:0}}@keyframes beatR{0%,85%{transform:translateY(2px)}100%{transform:none}}
@keyframes loomIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes shuttleRun{0%{right:0;opacity:1}90%{opacity:1}100%{right:100%;opacity:0}}
@keyframes photoIn{from{opacity:0;transform:scale(1.08)}to{opacity:1;transform:none}}
@keyframes raysOn{from{opacity:0;transform:scale(.3)}to{opacity:.9;transform:scale(1)}}
@keyframes raysSpin{to{rotate:360deg}}
@keyframes flashOn{0%{opacity:0;transform:scale(.3)}25%{opacity:.85}100%{opacity:.25;transform:scale(1.2)}}
@keyframes seamGlow{0%{opacity:0}35%{opacity:1}100%{opacity:0}}
@keyframes stageZoom{from{transform:scale(1.1)}to{transform:scale(1)}}
@keyframes goldFall{0%{transform:translateY(0) rotate(0deg);opacity:0}10%{opacity:1}100%{transform:translateY(460px) rotate(540deg);opacity:0}}
@keyframes stripOpen{0%{transform:translateX(0) scaleX(1) rotate(0deg)}55%{transform:translateX(calc(var(--dx) * .8)) scaleX(.82) rotate(var(--rt))}100%{transform:translateX(var(--dx)) scaleX(.7) rotate(0deg)}}
@keyframes swayS{0%,100%{transform:translateX(var(--dx)) scaleX(.7) rotate(0deg)}50%{transform:translateX(var(--dx)) scaleX(.7) rotate(var(--sw))}}
@keyframes moteF{0%,100%{transform:translate(0,0);opacity:.2}50%{transform:translate(6px,-18px);opacity:.9}}
@keyframes tieIn{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}
@keyframes curL{0%{transform:translateX(0) scaleX(1)}100%{transform:translateX(-82%) scaleX(.9)}}
@keyframes curR{0%{transform:translateX(0) scaleX(1)}100%{transform:translateX(82%) scaleX(.9)}}
@keyframes swayL{0%,100%{transform:translateX(-82%) scaleX(.9) skewX(0deg)}50%{transform:translateX(-80%) scaleX(.9) skewX(-1.5deg)}}
@keyframes swayR{0%,100%{transform:translateX(82%) scaleX(.9) skewX(0deg)}50%{transform:translateX(80%) scaleX(.9) skewX(1.5deg)}}
@keyframes stageOn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes flare{0%{opacity:0;transform:scale(.2) rotate(0)}6%{opacity:1;transform:scale(1) rotate(20deg)}16%{opacity:0;transform:scale(1.3) rotate(40deg)}100%{opacity:0}}
@keyframes lampOn{from{opacity:.12}to{opacity:1}}
@keyframes carpetIn{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes beam{0%{transform:rotate(-18deg)}100%{transform:rotate(18deg)}}
@keyframes hintOut{to{opacity:0;transform:translateY(-8px) scale(.96);visibility:hidden}}
@keyframes hintIn{0%{opacity:0;transform:translateY(-6px) scale(.96)}100%{opacity:1;transform:none}}
@keyframes fingerPath{0%{offset-distance:0%}100%{offset-distance:100%}}
@keyframes dashMove{to{stroke-dashoffset:-40}}
@keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-24px)}}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
h1,h2,h3,h4,p,li,label{text-wrap:balance}span,b,a,button{text-wrap:pretty}`;

export default function InviteView({ v }) {
  const Btn = v.thumb ? Still : 'button';
  const Lnk = v.thumb ? Still : A;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" ref={v.setRoot} onPointerMove={v.onMove} onPointerDown={v.onDown} style={S(`width: 390px; height: 844px; position: relative; overflow: hidden; touch-action: pan-y; font-family: 'IBM Plex Sans Arabic', TS, sans-serif; color: var(--tx); ${txt(v.vs)}`)}>
        {" "}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <filter id="ivSh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.6" floodColor="#000000" floodOpacity="0.22" /></filter>
            <radialGradient id={v.gid} cx="36%" cy="30%" r="80%">
              <stop offset="0%" stopColor={v.seal?.light} />
              <stop offset="55%" stopColor={v.seal?.hex} />
              <stop offset="100%" stopColor={v.seal?.deep} />
            </radialGradient>
            <radialGradient id="hyMk" cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#4CC7DA" />
              <stop offset="55%" stopColor="#0E97AE" />
              <stop offset="100%" stopColor="#086577" />
            </radialGradient>
          </defs>
        </svg>
        {" "}
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
          {" "}
          {v.showCurtain ? (
            <>{" "}
            <div style={{ position: "absolute", inset: "0", transformOrigin: "50% 30%", animation: "stageZoom 3.6s cubic-bezier(.3,0,.2,1) .3s both" }}>
                {" "}
                <span style={{ position: "absolute", left: "0", right: "0", top: "0", height: "560px", background: "repeating-linear-gradient(90deg, rgba(0,0,0,.22) 0 14px, rgba(255,255,255,.035) 14px 26px, rgba(0,0,0,.22) 26px 40px)", opacity: ".7" }} />
                {" "}
                <span style={{ position: "absolute", left: "0", right: "0", top: "60px", height: "520px", background: "linear-gradient(180deg, var(--c1), rgba(0,0,0,0) 90%)", clipPath: "polygon(43% 0, 57% 0, 92% 100%, 8% 100%)", opacity: ".28", filter: "blur(6px)", animation: "beamOn 2s ease-out 2.4s both" }} />
                {" "}
                <span style={{ position: "absolute", left: "50%", top: "455px", width: "360px", height: "90px", marginLeft: "-180px", borderRadius: "50%", background: "radial-gradient(closest-side, var(--c1), rgba(0,0,0,0))", opacity: ".35", animation: "beamOn 2s ease-out 2.8s both" }} />
                {" "}
                {(v.motes || []).map((m, $i0) => (
                  <span key={m?.key ?? $i0} style={S(`${txt(m?.st)}`)} />
                ))}
                {" "}
                <span style={{ position: "absolute", left: "50%", top: "40px", width: "640px", height: "640px", marginLeft: "-320px", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.16) 0deg 5deg, rgba(255,255,255,0) 5deg 15deg)", WebkitMaskImage: "radial-gradient(closest-side, #000 20%, transparent 100%)", maskImage: "radial-gradient(closest-side, #000 20%, transparent 100%)", animation: "raysOn 2.6s cubic-bezier(.2,.8,.2,1) .9s both, raysSpin 40s linear 3.5s infinite" }} />
                {" "}
                <span style={{ position: "absolute", left: "50%", top: "60px", width: "420px", height: "420px", marginLeft: "-210px", borderRadius: "50%", background: "radial-gradient(closest-side, var(--c1), rgba(0,0,0,0))", animation: "flashOn 1.6s ease-out .9s both" }} />
                {" "}
                <span style={{ position: "absolute", left: "50%", top: "150px", width: "340px", height: "200px", marginLeft: "-170px", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,255,.22), rgba(255,255,255,0))", animation: "beamOn 1.2s ease-out 3.2s both" }} />
                {" "}
                <span style={{ position: "absolute", left: "50%", top: "0", width: "8px", height: "520px", marginLeft: "-4px", background: "linear-gradient(180deg, #FFFFFF, var(--c1) 60%, rgba(0,0,0,0))", filter: "blur(3px)", animation: "seamGlow 1.5s ease-in-out both" }} />
                {" "}
                {(v.strips || []).map((c, $i1) => (
                  <span key={c?.key ?? $i1} style={S(`${txt(c?.st)}`)} />
                ))}
                {" "}
                {(v.gold || []).map((g, $i2) => (
                  <span key={g?.key ?? $i2} style={S(`${txt(g?.st)}`)} />
                ))}
                {" "}
                <svg width="390" height="96" viewBox="0 0 390 96" aria-hidden="true" style={{ position: "absolute", left: "0", top: "0" }}>
                  <defs>
                    <linearGradient id="valG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--cu)" /><stop offset="100%" stopColor="var(--cu)" /></linearGradient>
                  </defs>
                  <path d="M0 0 H390 V54 Q357.5 92 325 58 Q292.5 92 260 58 Q227.5 92 195 58 Q162.5 92 130 58 Q97.5 92 65 58 Q32.5 92 0 54 Z" fill="var(--cu)" />
                  <path d="M0 0 H390 V54 Q357.5 92 325 58 Q292.5 92 260 58 Q227.5 92 195 58 Q162.5 92 130 58 Q97.5 92 65 58 Q32.5 92 0 54 Z" fill="rgba(0,0,0,.25)" transform="translate(0 -6)" />
                  <path d="M0 54 Q32.5 92 65 58 Q97.5 92 130 58 Q162.5 92 195 58 Q227.5 92 260 58 Q292.5 92 325 58 Q357.5 92 390 54" fill="none" stroke="var(--c1)" strokeWidth="2.4" opacity=".85" />
                </svg>
                {" "}
              </div>
            {" "}</>
          ) : null}
          {" "}
          {v.showSadu ? (
            <>{" "}
            <div style={{ position: "absolute", inset: "0", opacity: ".7", WebkitMaskImage: "linear-gradient(180deg, #000 0, #000 150px, rgba(0,0,0,.35) 215px, transparent 330px)", maskImage: "linear-gradient(180deg, #000 0, #000 150px, rgba(0,0,0,.35) 215px, transparent 330px)" }}>
                <span aria-hidden="true" style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(90deg, rgba(255,255,255,.32) 0 1px, transparent 1px 7px)", animation: "warpIn .7s ease-out .05s both" }} />
                <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {(v.sadu || []).map((r, $i3) => (
                    <div key={r?.key ?? $i3} style={S(`${txt(r?.wrap)}`)}><span style={S(`${txt(r?.st)}`)} /><span style={S(`${txt(r?.sh)}`)} /></div>
                  ))}
                </div>
                <span aria-hidden="true" style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 1px, transparent 1px 7px)", pointerEvents: "none" }} />
              </div>
            {" "}</>
          ) : null}
          {" "}
          {v.showSadu ? (
            <span style={{ position: "absolute", left: "-20%", right: "-20%", top: "70px", height: "300px", borderRadius: "50%", background: "radial-gradient(closest-side, var(--scA), rgba(0,0,0,0))", animation: "beamOn 1.5s ease-out 2.6s both" }} />
          ) : null}
          {" "}
          {v.showPhoto ? (
            <>{" "}
            {v.photoUrl ? (
                <img src={v.photoUrl} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", animation: "photoIn 1.4s ease-out both" }} />
              ) : null}
            {" "}
            {v.photoDemo ? (
                <><span style={{ position: "absolute", inset: "0", background: "radial-gradient(60% 40% at 30% 20%, #4A6B82, rgba(0,0,0,0)), radial-gradient(50% 40% at 80% 40%, #6B4A62, rgba(0,0,0,0)), #141B22" }} />
                <span style={{ position: "absolute", left: "50%", top: "150px", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "18px 26px", borderRadius: "22px", border: "1.5px dashed rgba(255,255,255,.4)", color: "#FFFFFF", fontSize: "13px", fontWeight: "700" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="16" rx="3" />
                      <circle cx="9" cy="10" r="2" />
                      <path d="M3 17l5-5 4 4 3-3 6 6" />
                    </svg>
                    صورتكم هنا
                  </span></>
              ) : null}
            {" "}</>
          ) : null}
          {" "}
          {v.showBub ? (
            <>{" "}
            <span style={{ position: "absolute", left: "-60px", top: "60px", width: "320px", height: "320px", borderRadius: "50%", background: "var(--c1)", filter: "blur(80px)", opacity: ".35", animation: "orb 10s ease-in-out infinite" }} />
            {" "}
            <span style={{ position: "absolute", right: "-80px", top: "260px", width: "300px", height: "300px", borderRadius: "50%", background: "var(--c3)", filter: "blur(80px)", opacity: ".3", animation: "orb 12s ease-in-out infinite reverse" }} />
            {" "}</>
          ) : null}
          {" "}
          {v.is_holo ? (
            <>{" "}
            <span style={{ position: "absolute", left: "-40%", top: "-20%", width: "180%", height: "90%", background: "conic-gradient(from var(--ha, 0deg) at 50% 50%, var(--h1), var(--h2), var(--h3), var(--h4), var(--h1))", filter: "blur(40px)", opacity: ".75" }} />
            {" "}
            <span style={{ position: "absolute", inset: "0", background: "linear-gradient(115deg, rgba(255,255,255,0) 15%, rgba(255,255,255,.75) 32%, rgba(255,255,255,0) 48%)", backgroundSize: "260% 260%", backgroundPosition: "var(--hp, 50%) 50%", mixBlendMode: "soft-light" }} />
            {" "}
            <span style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(115deg, rgba(255,255,255,0) 0 18px, rgba(255,255,255,.22) 18px 19px), repeating-linear-gradient(25deg, rgba(255,255,255,0) 0 18px, rgba(255,255,255,.12) 18px 19px)", opacity: ".6" }} />
            {" "}
            <span style={{ position: "absolute", left: "40px", top: "110px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,0) 70%)", animation: "orb 7s ease-in-out infinite" }} />
            {" "}
            <span style={{ position: "absolute", right: "30px", top: "200px", width: "90px", height: "90px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.8), rgba(255,255,255,0) 70%)", animation: "orb 9s ease-in-out infinite reverse" }} />
            {" "}</>
          ) : null}
          {" "}
        </div>
        {" "}
        {v.ptLatin ? (
          <span className="lat" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "232px", textAlign: "center", fontSize: "15px", letterSpacing: "7px", color: "var(--tx)", textShadow: "0 0 14px var(--c1), 0 0 2px var(--c1)", pointerEvents: "none", animation: "hintIn 1s ease-out 2.4s both" }}>{v.latin}</span>
        ) : null}
        {" "}
        <canvas ref={v.setCanvas} aria-hidden="true" style={S(`position: absolute; inset: 0; width: 390px; height: 844px; pointer-events: none; opacity: ${txt(v.cvOp)}; transition: opacity 2.5s ease;`)} />
        {" "}
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--scB) 52%, var(--scA) 100%)" }} />
        {" "}
        <div data-front="1" style={{ position: "relative", height: "100%", boxSizing: "border-box", padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px 5px 6px", borderRadius: "999px", background: "var(--gl)", border: "1px solid var(--ln)", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}>
              <svg width="30" height="30" viewBox="0 0 100 100" aria-hidden="true">
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#hyMk)" />
                <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
              </svg>
              <span style={{ fontFamily: "TD, serif", fontSize: "16px" }}>حيّــاك</span>
            </span>
            <span style={{ display: "flex", gap: "8px" }}>
              <Btn type="button" data-nocap="1" onClick={v.openSave} aria-label="حفظ الدعوة" style={{ height: "42px", padding: "0 14px", borderRadius: "999px", border: "1px solid var(--ln)", background: "var(--gl)", color: "var(--tx)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                {v.saveLabel}
              </Btn>
              <Btn type="button" data-nocap="1" onClick={v.replayAll} aria-label="إعادة الدعوة والحركة" style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1px solid var(--ln)", background: "var(--gl)", color: "var(--tx)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
              </Btn>
            </span>
          </div>
          {v.showHint ? (
            <div data-nocap="1" style={{ position: "absolute", left: "50%", top: "104px", width: "270px", marginLeft: "-135px", zIndex: "2", padding: "14px 16px 12px", borderRadius: "24px", background: "var(--gl)", border: "1px solid var(--ln)", WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center", animation: "hintIn .5s ease-out 1.4s both, hintOut .7s ease-in 4.6s forwards", pointerEvents: "none" }}>
                <div style={{ position: "relative", width: "200px", height: "60px" }}>
                  {" "}
                  <svg width="200" height="60" viewBox="0 0 200 60" aria-hidden="true" style={{ position: "absolute", inset: "0" }}>
                    <path d="M10 40 C50 0 90 60 130 22 S180 30 190 18" fill="none" stroke="var(--tx)" strokeOpacity=".45" strokeWidth="2" strokeDasharray="4 6" style={{ animation: "dashMove 1.4s linear infinite" }} />
                  </svg>
                  {" "}
                  <span style={{ position: "absolute", left: "0", top: "0", width: "26px", height: "26px", offsetPath: "path('M10 40 C50 0 90 60 130 22 S180 30 190 18')", offsetRotate: "0deg", animation: "fingerPath 2.2s ease-in-out infinite alternate" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ margin: "-4px 0 0 -6px" }}>
                      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.5 15a1.5 1.5 0 0 1 2.3-1.9L9 15" />
                    </svg>
                  </span>
                  {" "}
                </div>
                <b style={{ fontSize: "15px" }}>{v.hintText}</b>
                <span style={{ fontSize: "12px", opacity: ".8" }}>{v.hintSub}</span>
              </div>
          ) : null}
          {v.isLoad ? (
            <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "22px", textAlign: "center" }}>
                <div style={S(`position: relative; width: 150px; height: 160px; display: ${txt(v.loadSealD)};`)}>
                  {" "}
                  <svg width="150" height="160" viewBox="0 0 100 108" aria-hidden="true" style={{ position: "absolute", inset: "0", overflow: "visible" }}>
                    <g style={{ transformOrigin: "50px 46px", animation: "lcard .7s cubic-bezier(.2,.8,.2,1) both" }}>
                      <rect x="16" y="4" width="68" height="84" rx="12" fill="var(--lc)" />
                      <rect x="28" y="20" width="44" height="5" rx="2.5" fill="var(--ring)" fillOpacity="0.35" />
                      <rect x="34" y="31" width="32" height="5" rx="2.5" fill="var(--ring)" fillOpacity="0.35" />
                    </g>
                    <g transform="translate(50 74)">
                      <g style={{ animation: "lseal .7s cubic-bezier(.3,.7,.2,1) .55s both" }}>
                        <g transform="scale(0.42) translate(-50 -50)">
                          <path d={v.wax} fill="url(#hyMk)" stroke="var(--ring)" strokeWidth="6" filter="url(#ivSh)" />
                          <ellipse cx="36" cy="28" rx="15" ry="7" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity="0.3" />
                          <text x="50" y="59.2" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                          <text x="50" y="58" textAnchor="middle" fontFamily="TD" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
                        </g>
                      </g>
                    </g>
                  </svg>
                  {" "}
                  <span style={{ position: "absolute", left: "50%", top: "68.5%", width: "44px", height: "44px", margin: "-22px 0 0 -22px", borderRadius: "50%", border: "2px solid #0E97AE", animation: "link .8s ease-out 1.05s both" }} />
                  {" "}
                </div>
                {v.loadLogo ? (
                  <img src={v.loadLogo} alt="" style={{ maxWidth: "190px", maxHeight: "120px", objectFit: "contain", animation: "lname .9s cubic-bezier(.4,0,.2,1) both" }} />
                ) : null}
                {v.loadNamed ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontFamily: "TD, serif", fontSize: "30px", lineHeight: "1.3", animation: "lname .9s cubic-bezier(.4,0,.2,1) 1.1s both" }}>{v.loadHello}</span>
                      <span style={{ fontSize: "14px", opacity: ".8", animation: "blink 2s ease-in-out infinite" }}>نجهّز دعوتك…</span>
                    </div>
                ) : null}
                {v.loadPlain ? (
                  <span style={{ fontSize: "15px", opacity: ".85", animation: "blink 2s ease-in-out infinite" }}>نجهّز دعوتك</span>
                ) : null}
                <span style={{ width: "150px", height: "2px", background: "var(--ln)", overflow: "hidden", display: "block" }}>
                  <span style={S(`display: block; width: 100%; height: 100%; background: var(--c2); transform-origin: 100% 50%; animation: growX ${txt(v.loadDur)} cubic-bezier(.2,.8,.2,1) both;`)} />
                </span>
              </div>
          ) : null}
          {v.notLoad ? (
            <div className={v.inK} style={S(`flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding: 18px 4px 6px; animation-delay: ${txt(v.heroDelay)};`)}>
                {v.hasLabel ? (
                  <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", fontSize: "14px", fontWeight: "500", background: "var(--gl)", border: "1px solid var(--ln)", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--c2)" }} />{v.eventLabel}</span>
                ) : null}
                {v.showTitle ? (
                  <><span style={{ fontFamily: "TD, serif", fontSize: "46px", lineHeight: "1.2", textShadow: "0 2px 22px var(--scA), 0 0 3px var(--scA)" }}>{v.title}</span>
                  {v.hasLatin ? (
                      <span className="lat" style={{ fontSize: "13px", opacity: ".75", textAlign: "right", textShadow: "0 1px 8px var(--scA)" }}>{v.latin}</span>
                    ) : null}</>
                ) : null}
              </div>
          ) : null}
          {v.isGate ? (
            <div className={v.inK} style={{ borderRadius: "28px", padding: "22px 20px", background: "var(--gl)", WebkitBackdropFilter: "blur(24px) saturate(1.3)", backdropFilter: "blur(24px) saturate(1.3)", border: "1px solid var(--ln)", display: "flex", flexDirection: "column", gap: "12px", animationDelay: ".25s" }}>
                <h1 style={{ margin: "0", fontFamily: "TD, serif", fontSize: "26px", lineHeight: "1.35" }}>{"عندك دعوة من "}{v.entity}</h1>
                <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.7", opacity: ".82" }}>سجّل اسمك وبريدك لتفتح الدعوة، وبيظهر اسمك داخلها</p>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", opacity: ".9" }}>
                  الاسم
                  <input className="field" value={v.gname ?? ''} onChange={v.onGname} placeholder="اسمك كما تحب يظهر" autoComplete="name" maxLength="80" style={{ height: "52px", borderRadius: "999px", border: "1px solid var(--ln)", background: "var(--gl)", color: "var(--tx)", padding: "0 20px", fontSize: "16px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", opacity: ".9" }}>
                  الإيميل
                  <input className="field" type="email" value={v.gmail ?? ''} onChange={v.onGmail} placeholder="name@example.com" style={{ height: "52px", borderRadius: "999px", border: "1px solid var(--ln)", background: "var(--gl)", color: "var(--tx)", padding: "0 20px", fontSize: "16px", direction: "ltr", textAlign: "right" }} />
                </label>
                {v.gateMsg ? (
                  <span role="alert" style={{ fontSize: "13px", lineHeight: "1.6", fontWeight: "700" }}>{v.gateMsg}</span>
                ) : null}
                <Btn type="button" onClick={v.openInv} disabled={v.gateBusy} style={{ height: "54px", border: "0", borderRadius: "999px", background: "var(--c2)", color: "var(--bt)", fontWeight: "700", fontSize: "16px", cursor: "pointer" }}>افتح الدعوة</Btn>
                <span style={{ fontSize: "11px", lineHeight: "1.6", opacity: ".72", textAlign: "center" }}>نستخدم اسمك وبريدك لهذه الدعوة وتأكيد الحضور فقط</span>
              </div>
          ) : null}
          {v.isOpen ? (
            <><div className={v.inK} style={{ position: "relative", marginTop: "26px", animationDelay: ".35s" }}>
                {" "}
                <div style={{ position: "relative", transform: "perspective(900px) rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))", transformStyle: "preserve-3d" }}>
                  {" "}
                  <div className={`th${txt(v.k)}`} style={{ position: "relative", overflow: "hidden", borderRadius: "26px", background: "rgba(250,251,252,.97)", color: "#0A2A43", padding: "22px 20px 12px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "11px", boxShadow: "0 30px 70px rgba(0,0,0,.3)" }}>
                    {v.is_holo ? (
                      <span aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "linear-gradient(115deg, rgba(255,255,255,0) 25%, rgba(134,220,234,.55) 38%, rgba(242,184,198,.45) 46%, rgba(220,228,232,.7) 52%, rgba(76,199,218,.5) 60%, rgba(255,255,255,0) 75%)", backgroundSize: "260% 260%", backgroundPosition: "var(--hp, 50%) 50%", mixBlendMode: "multiply", opacity: ".6" }} />
                    ) : null}
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "84px", minHeight: "64px" }}>
                      <span style={{ fontSize: "13px", lineHeight: "1.5", color: "#4A5B68" }}>نتشرّف بدعوة</span>
                      <span className={`nm${txt(v.k)}`} style={{ fontFamily: "TD, serif", fontSize: "28px", lineHeight: "1.3" }}>{v.shownName}</span>
                      <span className={`nm${txt(v.k)}`} style={{ fontSize: "13px", lineHeight: "1.5", color: "#3A4B58" }}>{v.shownOrg}</span>
                    </div>
                    <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", fontSize: "13px", lineHeight: "1.5", paddingTop: "11px", borderTop: "1px solid #DCE4E8" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}><span style={{ color: "#4A5B68" }}>التاريخ</span><b>{v.dateTx}</b></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}><span style={{ color: "#4A5B68" }}>الوقت</span><b>{v.timeTx}</b></div>
                    </div>
                    <div style={{ position: "relative", borderRadius: "18px", background: "#F4F7F8", border: "1px solid #DCE4E8", overflow: "hidden" }}>
                      {" "}
                      {v.inPerson ? (
                        <svg aria-hidden="true" width="100%" height="54" viewBox="0 0 320 62" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
                            <rect width="320" height="62" fill="#E8EEF1" />
                            <rect x="18" y="6" width="58" height="22" rx="3" fill="#DDE5E9" />
                            <rect x="92" y="34" width="70" height="24" rx="3" fill="#DDE5E9" />
                            <rect x="232" y="4" width="70" height="20" rx="3" fill="#DDE5E9" />
                            <path d="M196 30 C210 22 236 26 250 40 L262 62 L182 62 Z" fill="#CDE8D3" />
                            <path d="M-10 44 C60 30 120 50 170 34 S270 10 330 18" fill="none" stroke="#FFFFFF" strokeWidth="9" />
                            <path d="M-10 44 C60 30 120 50 170 34 S270 10 330 18" fill="none" stroke="#F3D58A" strokeWidth="3" />
                            <path d="M84 -4 L76 70 M214 -4 L224 70" stroke="#FFFFFF" strokeWidth="6" />
                            <path d="M0 18 L320 26" stroke="#FFFFFF" strokeWidth="4" />
                            <path d="M150 40 C143 30 140 26 140 21 A10 10 0 0 1 160 21 C160 26 157 30 150 40 Z" fill="#E5484D" />
                            <circle cx="150" cy="21" r="3.6" fill="#FFFFFF" />
                            <ellipse cx="150" cy="42" rx="6" ry="2" fill="rgba(0,0,0,.15)" />
                          </svg>
                      ) : null}
                      {" "}
                      {v.isOnline ? (
                        <svg aria-hidden="true" width="100%" height="54" viewBox="0 0 320 62" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
                            <rect width="320" height="62" fill="#0A2A43" />
                            <rect x="10" y="8" width="72" height="46" rx="6" fill="#123E5C" />
                            <rect x="88" y="8" width="72" height="46" rx="6" fill="#16496B" />
                            <rect x="166" y="8" width="72" height="46" rx="6" fill="#123E5C" />
                            <rect x="244" y="8" width="66" height="46" rx="6" fill="#16496B" />
                            <circle cx="46" cy="26" r="8" fill="#86DCEA" opacity=".7" />
                            <path d="M32 46 a14 10 0 0 1 28 0" fill="#86DCEA" opacity=".7" />
                            <circle cx="124" cy="26" r="8" fill="#DCE4E8" opacity=".7" />
                            <path d="M110 46 a14 10 0 0 1 28 0" fill="#DCE4E8" opacity=".7" />
                            <circle cx="202" cy="26" r="8" fill="#86DCEA" opacity=".7" />
                            <path d="M188 46 a14 10 0 0 1 28 0" fill="#86DCEA" opacity=".7" />
                            <circle cx="277" cy="26" r="8" fill="#DCE4E8" opacity=".7" />
                            <path d="M263 46 a14 10 0 0 1 28 0" fill="#DCE4E8" opacity=".7" />
                            <rect x="16" y="13" width="30" height="11" rx="5.5" fill="#E5484D" />
                            <circle cx="22" cy="18.5" r="2" fill="#FFFFFF" />
                            <text x="34" y="21.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFFFFF" fontFamily="sans-serif">LIVE</text>
                          </svg>
                      ) : null}
                      {" "}
                      <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px" }}>
                        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "5px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#4A5B68" }}>
                            {v.inPerson ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                            ) : null}
                            {v.isOnline ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="3" /><path d="M15 10l6-3v10l-6-3" /></svg>
                            ) : null}
                            {v.placeKicker}
                          </span>
                          <b style={{ fontSize: "15px", lineHeight: "1.35" }}>{v.placeName}</b>
                          {v.inPerson ? (
                            <span style={{ fontSize: "12px", color: "#4A5B68" }}>{v.placeArea}</span>
                          ) : null}
                          {v.placeHasLink ? (
                            <Lnk href={v.placeHref} target="_blank" style={{ alignSelf: "flex-start", marginTop: "3px", height: "32px", padding: "0 14px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontSize: "12px", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>{v.placeLink}</Lnk>
                          ) : null}
                          {v.linkLaterOn ? (
                            <span style={{ fontSize: "12px", lineHeight: "1.5", color: "#4A5B68" }}>{"بيوصلك الرابط من "}{v.entity}{" قبل الفعالية"}</span>
                          ) : null}
                        </div>
                        <div style={{ flexShrink: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "78px", height: "78px", borderRadius: "14px", background: "#FFFFFF", border: "1px solid #DCE4E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {v.qrOn ? (
                              <svg width="64" height="64" viewBox={v.qrBox} role="img" aria-label="باركود" shapeRendering="crispEdges">
                                  <rect width="25" height="25" fill="#FFFFFF" />
                                  {(v.qr || []).map((q, $i4) => (
                                    <rect key={q?.key ?? $i4} x={q?.x} y={q?.y} width="1" height="1" fill="#0A2A43" />
                                  ))}
                                </svg>
                            ) : null}
                            {v.qrOff ? (
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8FA0AC" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                            ) : null}
                          </span>
                          <span style={{ fontSize: "10px", color: "#4A5B68", textAlign: "center", lineHeight: "1.3" }}>{v.qrCap}</span>
                        </div>
                      </div>
                      {" "}
                    </div>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", paddingTop: "10px", borderTop: "1px solid #DCE4E8" }}>
                      <span style={{ fontSize: "11px", color: "#4A5B68" }}>بتنظيم</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <b style={{ fontSize: "13px" }}>{v.entity}</b>
                        <span style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#EDF1F3", border: "1px solid #DCE4E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: "700", color: "#4A5B68", overflow: "hidden" }}>
                          {v.orgLogo ? (
                            <img src={v.orgLogo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          ) : null}
                          {v.noOrgLogo ? (
                            <>{v.orgInit}</>
                          ) : null}
                        </span>
                      </span>
                    </div>
                  </div>
                  {" "}
                  <span className={`ir${txt(v.k)}`} style={S(`position: absolute; left: -2px; top: -44px; width: 112px; height: 112px; border-radius: 50%; border: 2px solid ${txt(v.seal?.hex)}; pointer-events: none;`)} />
                  {" "}
                  <div className={`sg${txt(v.k)}`} role="img" aria-label={`ختم ${txt(v.seal?.label)}`} style={{ position: "absolute", left: "-2px", top: "-44px", width: "112px", height: "112px" }}>
                    {" "}
                    <svg width="112" height="112" viewBox="0 0 100 100" aria-hidden="true" style={{ position: "absolute", inset: "0" }}>
                      <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                      <path d={v.wax} fill={v.sealFill} filter="url(#ivSh)" />
                      <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="2.4" />
                      <circle cx="50" cy="50.8" r="33" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.2" />
                      <ellipse cx="36" cy="27" rx="14" ry="6" transform="rotate(-28 36 27)" fill="#FFFFFF" fillOpacity="0.28" />
                    </svg>
                    {" "}
                    <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "4px" }}>
                      <span className={`lb${txt(v.k)}`} style={S(`display: inline-block; font-family: TD, serif; font-weight: 700; font-size: ${txt(v.seal?.fs)}; line-height: 1.6; padding: 0 2px; color: #FFFFFF; text-shadow: 0 1.5px 0 rgba(0,0,0,.3); will-change: transform, opacity;`)}>
                        {v.sealLogo ? (
                          <img src={v.sealLogo} alt="" style={{ width: "58px", height: "58px", objectFit: "contain" }} />
                        ) : null}
                        {v.sealText}
                      </span>
                    </span>
                    {" "}
                    <span aria-hidden="true" style={{ position: "absolute", left: "17px", top: "17px", width: "78px", height: "78px", borderRadius: "50%", overflow: "hidden", pointerEvents: "none" }}>
                      <span className={`sh${txt(v.k)}`} style={{ position: "absolute", top: "-20%", left: "30%", width: "26%", height: "140%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))", opacity: "0" }} />
                    </span>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
            <div data-nocap="1" className={v.inK} style={{ position: "relative", animationDelay: "2.3s" }}>
                {" "}
                {v.rsvpOpen ? (
                  <>{" "}
                  <div style={S(`height: 56px; border-radius: 999px; padding: 0 6px 0 8px; background: var(--gl); border: 1px solid var(--ln); -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); display: flex; align-items: center; gap: 8px; box-shadow: ${txt(v.rsvpShadow)}; transition: box-shadow .4s ease;`)}>
                      <span style={{ flex: "1", minWidth: "0", paddingRight: "10px", fontSize: "15px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.rsvpTitle}</span>
                      <Btn type="button" onClick={v.yes} style={S(`height: 44px; padding: 0 18px; border: 0; border-radius: 999px; background: var(--c2); color: var(--bt); font-weight: 700; font-size: 15px; cursor: pointer; animation: glowRing 2.6s ease-in-out ${txt(v.glowDelay)} infinite;`)}>بحضر</Btn>
                      <Btn type="button" onClick={v.no} style={{ height: "44px", padding: "0 14px", border: "0", borderRadius: "999px", background: "transparent", color: "var(--tx)", fontSize: "14px", opacity: ".8", cursor: "pointer" }}>أعتذر</Btn>
                    </div>
                  {" "}</>
                ) : null}
                {" "}
                {v.answered ? (
                  <div className="inA" style={{ height: "56px", borderRadius: "999px", padding: "0 6px 0 8px", border: "1px solid var(--ln)", background: "var(--gl)", WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ flex: "1", display: "flex", alignItems: "center", gap: "8px", paddingRight: "10px", fontSize: "15px", fontWeight: "500" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--c2)" }} />{v.answerTitle}</span>
                      <Btn type="button" onClick={v.undo} style={{ height: "44px", padding: "0 14px", border: "1px solid var(--ln)", borderRadius: "999px", background: "transparent", color: "var(--tx)", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>{v.undoTx}</Btn>
                      {v.going ? (
                        <Btn type="button" onClick={v.addCal} style={{ height: "44px", padding: "0 16px", border: "0", borderRadius: "999px", background: "var(--c2)", color: "var(--bt)", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>{v.calLabel}</Btn>
                      ) : null}
                    </div>
                ) : null}
                {" "}
                {v.branded ? (
                  <span style={{ display: "block", textAlign: "center", fontSize: "11px", opacity: ".6", marginTop: "8px" }}>بواسطة حيّــاك</span>
                ) : null}
                {" "}
              </div></>
          ) : null}
        </div>
        {" "}
        {v.wm ? (
          <>{" "}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", overflow: "hidden", pointerEvents: "none", zIndex: "6" }}>
              {" "}
              <div style={{ position: "absolute", left: "-160px", top: "-120px", width: "720px", display: "flex", flexDirection: "column", gap: "54px", transform: "rotate(-24deg)", mixBlendMode: "difference", opacity: ".32" }}>
                {(v.wmRows || []).map((w, $i5) => (
                  <span key={w?.key ?? $i5} style={S(`${txt(w?.st)}`)}>{w?.t}</span>
                ))}
              </div>
              {" "}
              <span style={{ position: "absolute", top: "74px", left: "50%", transform: "translateX(-50%)", padding: "5px 14px", borderRadius: "999px", background: "rgba(10,42,67,.85)", color: "#FFFFFF", fontSize: "11px", fontWeight: "700", letterSpacing: ".5px" }}>معاينة · غير صالحة للإرسال</span>
              {" "}
            </div>
          {" "}</>
        ) : null}
        {" "}
        {v.sheetOn ? (
          <>{" "}
          <div data-nocap="1" style={{ position: "absolute", inset: "0", zIndex: "5", background: "rgba(4,18,31,.55)", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", borderRadius: "28px 28px 0 0", background: "#FAFBFC", color: "#0A2A43", padding: "22px 20px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px", animation: "sheetUp .35s cubic-bezier(.2,.8,.2,1) both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontFamily: "TS, sans-serif", fontSize: "18px" }}>{v.sheetTitle}</b>
                  <Btn type="button" onClick={v.closeSave} aria-label="إغلاق" style={{ width: "36px", height: "36px", border: "0", borderRadius: "50%", background: "#EDF1F3", color: "#0A2A43", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="#0A2A43" strokeWidth="2" strokeLinecap="round" /></svg>
                  </Btn>
                </div>
                {v.sheetMenu ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Btn type="button" onClick={v.addCal} style={{ textAlign: "right", border: "2px solid #0E97AE", borderRadius: "20px", background: "#E6F6F9", color: "#0A2A43", padding: "14px 16px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>أضف الموعد لتقويمك</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68" }}>ويذكّرك قبل المناسبة بيوم</span>
                        </span>
                      </Btn>
                      <Lnk href={v.mapHref} target="_blank" rel="noopener" style={{ textDecoration: "none", textAlign: "right", border: "1px solid #DCE4E8", borderRadius: "20px", background: "#FFFFFF", color: "#0A2A43", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A2A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>افتح الموقع في الخرائط</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68" }}>ويوديك للمكان بلمسة</span>
                        </span>
                      </Lnk>
                      <Btn type="button" onClick={v.saveImage} style={{ textAlign: "right", border: "1px solid #DCE4E8", borderRadius: "20px", background: "#FFFFFF", color: "#0A2A43", padding: "14px 16px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A2A43" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 16l5-5 4 4 3-3 6 6" /></svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>احفظها صورة</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68" }}>لقطة واضحة للدعوة بعد ما يثبت الختم</span>
                        </span>
                      </Btn>
                      <Btn type="button" onClick={v.saveVideo} style={{ textAlign: "right", border: "1px solid #DCE4E8", borderRadius: "20px", background: "#FFFFFF", color: "#0A2A43", padding: "14px 16px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#0A2A43" /></svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>احفظها بحركتها</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68" }}>تنحفظ في الصور مع الحركة والختم، وتشاركها بالواتساب</span>
                        </span>
                      </Btn>
                    </div>
                ) : null}
                {v.sheetCal ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Lnk href={v.ics} download="hayyak-invite.ics" style={{ textDecoration: "none", border: "2px solid #0E97AE", borderRadius: "20px", background: "#E6F6F9", color: "#0A2A43", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>تقويم الجوال</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68" }}>آيفون وأندرويد وأوتلوك · مع تذكير قبل بيوم</span>
                        </span>
                      </Lnk>
                      <Lnk href={v.gcal} target="_blank" rel="noopener" style={{ textDecoration: "none", border: "1px solid #DCE4E8", borderRadius: "20px", background: "#FFFFFF", color: "#0A2A43", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0", fontWeight: "700", fontSize: "16px" }}>{"G"}</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "15px" }}>تقويم Google</b>
                          <span style={{ fontSize: "12px", color: "#4A5B68" }}>يفتح التقويم والموعد جاهز</span>
                        </span>
                      </Lnk>
                    </div>
                ) : null}
                {v.sheetMaking ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0" }}>
                      <span style={{ fontSize: "14px" }}>{v.makingTx}</span>
                      <span style={{ height: "6px", borderRadius: "3px", background: "#EDF1F3", overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", background: "#0E97AE", transformOrigin: "100% 50%", animation: "growX 2.4s ease-out both" }} />
                      </span>
                      <span style={{ fontSize: "12px", color: "#4A5B68" }}>بنفس الحركة اللي شفتها</span>
                    </div>
                ) : null}
                {v.sheetDone ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "8px 0", textAlign: "center" }}>
                      <span style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                      </span>
                      <b style={{ fontSize: "16px" }}>{v.doneTitle}</b>
                      <span style={{ fontSize: "13px", color: "#4A5B68" }}>{v.doneSub}</span>
                    </div>
                ) : null}
              </div>
            </div>
          {" "}</>
        ) : null}
      </div>
    </>
  );
}
