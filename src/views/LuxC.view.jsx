import { S, txt, A } from '@/ui/dc';
import Mark from '@/ui/Mark';
import FAQ from '@/screens/FAQ';

const CSS = `body{margin:0;background:#072538}
a{color:inherit}
button{font-family:TS, 'IBM Plex Sans Arabic', sans-serif}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes cardIn{0%{opacity:0;transform:perspective(800px) rotateX(55deg) translateY(60px);filter:brightness(0)}100%{opacity:1;transform:none;filter:brightness(1)}}
@keyframes litSweep{0%{transform:translateX(160%) rotate(20deg);opacity:0}20%{opacity:1}100%{transform:translateX(-160%) rotate(20deg);opacity:0}}
@keyframes dropA{0%{opacity:0;transform:translateY(-140px) scale(1.9) rotate(-34deg)}60%{opacity:1;transform:translateY(0) scale(.88) rotate(-5deg)}78%{transform:scale(1.05) rotate(-11deg)}100%{opacity:1;transform:rotate(-9deg)}}
@keyframes dropB{0%{opacity:0;transform:translateY(-140px) scale(1.9) rotate(-34deg)}60%{opacity:1;transform:translateY(0) scale(.88) rotate(-5deg)}78%{transform:scale(1.05) rotate(-11deg)}100%{opacity:1;transform:rotate(-9deg)}}
@keyframes inkA{0%{transform:scale(.5);opacity:0}15%{opacity:.9}100%{transform:scale(3);opacity:0}}
@keyframes inkB{0%{transform:scale(.5);opacity:0}15%{opacity:.9}100%{transform:scale(3);opacity:0}}
@keyframes burstA{0%{transform:rotate(var(--a)) translateX(0);opacity:1}100%{transform:rotate(var(--a)) translateX(var(--d));opacity:0}}
@keyframes burstB{0%{transform:rotate(var(--a)) translateX(0);opacity:1}100%{transform:rotate(var(--a)) translateX(var(--d));opacity:0}}
@keyframes lblA{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes lblB{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes bloom{0%{opacity:0;transform:scale(.3)}30%{opacity:1}100%{opacity:.45;transform:scale(1)}}
@keyframes reveal{0%{clip-path:inset(-30% 0 -30% 100%)}100%{clip-path:inset(-30% 0 -30% 0)}}
@keyframes sweep{0%{right:-10%;opacity:0}10%{opacity:1}85%{opacity:1}100%{right:105%;opacity:0}}
@keyframes horizon{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}
@keyframes wordIn{from{opacity:0;filter:blur(8px);transform:translateY(10px)}to{opacity:1;filter:blur(0);transform:none}}
@keyframes dust{0%{transform:translateY(0);opacity:0}20%{opacity:.8}100%{transform:translateY(-160px);opacity:0}}
@keyframes ringSpin{to{transform:rotate(360deg)}}
@keyframes breathe{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
@keyframes scrollLine{0%{transform:scaleY(0);transform-origin:50% 0}50%{transform:scaleY(1);transform-origin:50% 0}51%{transform-origin:50% 100%}100%{transform:scaleY(0);transform-origin:50% 100%}}
@keyframes wordIn2{from{opacity:0;filter:blur(8px);transform:translateY(10px)}to{opacity:1;filter:blur(0);transform:none}}
@keyframes fillBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes fillBar2{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes stampIn{0%{opacity:0;transform:translateY(-50px) scale(1.7) rotate(-30deg)}60%{opacity:1;transform:scale(.9) rotate(-6deg)}100%{opacity:1;transform:rotate(-9deg)}}
@property --cn{syntax:'<integer>';inherits:false;initial-value:0}
@keyframes countUp{from{--cn:0}to{--cn:74}}
.cnt{counter-reset:cn var(--cn);animation:countUp 2.6s cubic-bezier(.2,.7,.2,1) both}.cnt::after{content:counter(cn)}
@keyframes dashFlow{to{stroke-dashoffset:-20}}
@keyframes pulseCard{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@keyframes fly{0%{offset-distance:0%;opacity:0}15%{opacity:1}85%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes typeIn{from{max-width:0}to{max-width:6em}}
@keyframes cardStack{from{opacity:0;transform:translateX(-80px) rotate(0deg)}to{opacity:1}}
@keyframes rowOut{0%{opacity:1}100%{opacity:.35}}
@keyframes toastIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}
@keyframes ring{0%,100%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}}
@keyframes glowW{0%,100%{text-shadow:0 0 40px rgba(134,220,234,.6),0 0 120px rgba(14,151,174,.55)}50%{text-shadow:0 0 60px rgba(134,220,234,.9),0 0 180px rgba(14,151,174,.75)}}
@keyframes floatY{0%,100%{translate:0 0}50%{translate:0 -8px}}
@keyframes nudgeX{0%,100%{transform:translateX(0)}50%{transform:translateX(-6px)}}
@keyframes popB{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:none}}
@keyframes breatheW{0%,100%{text-shadow:0 0 22px rgba(134,220,234,.35)}50%{text-shadow:0 0 34px rgba(134,220,234,.6),0 0 80px rgba(14,151,174,.35)}}
@keyframes wordFade{from{opacity:.25;filter:blur(8px)}to{opacity:1;filter:blur(0)}}
@keyframes growX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes bloomSoft{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
@keyframes markIn{0%{clip-path:inset(0 0 0 100%);transform:scale(.9)}100%{clip-path:inset(0 0 0 0);transform:none}}
@keyframes settleW{from{transform:scale(1.05)}to{transform:none}}
.rst .rv,.rst.rv{animation:none !important}
.rv{animation-play-state:paused !important}.seen .rv,.seen.rv{animation-play-state:running !important}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:none}}
@keyframes shimmer{0%{background-position:150% 0}100%{background-position:-50% 0}}
.shim span{background:linear-gradient(100deg,currentColor 40%,#FFFFFF 50%,currentColor 60%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimT 5s ease-in-out infinite}
@keyframes shimT{0%{background-position:120% 0}60%,100%{background-position:-20% 0}}
.glowbtn{animation:glowB 3.2s ease-in-out infinite}
@keyframes glowB{0%,100%{box-shadow:0 0 0 0 rgba(134,220,234,.45),0 20px 50px rgba(134,220,234,.25)}50%{box-shadow:0 0 0 12px rgba(134,220,234,0),0 20px 60px rgba(134,220,234,.45)}}
section > *:not(.drift){position:relative;z-index:1}
.drift{position:absolute;border-radius:50%;pointer-events:none;animation:driftO 20s ease-in-out infinite}
@keyframes driftO{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-50px) scale(1.12)}66%{transform:translate(-60px,40px) scale(.94)}}
.kick{font-size:20px;color:#86DCEA;font-weight:500}
html{scroll-behavior:smooth}
.btn{position:relative;overflow:hidden;transition:transform .3s ease,box-shadow .3s ease}.btn:hover{transform:translateY(-2px)}.btn::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.7) 50%,transparent 70%);transform:translateX(120%);transition:transform .8s ease}.btn:hover::after{transform:translateX(-120%)}
.vis{animation:bob 7s ease-in-out infinite}
@keyframes bob{0%,100%{translate:0 0}50%{translate:0 -8px}}
@keyframes growY{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.u{animation:up 1.2s cubic-bezier(.2,.7,.2,1) both}
.wd{display:inline-block;animation:wordIn .9s cubic-bezier(.2,.7,.2,1) both}
.seal-btn{transition:transform .25s ease}.seal-btn:hover{transform:scale(1.06)}
.pc{transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s ease,border-color .35s ease}.pc:hover{transform:translateY(-8px)}
.sl{transition:transform .3s ease}.sl:hover{transform:translateY(-6px) rotate(-6deg)}
.rB{}.rA{}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important}}
@media (max-width: 1000px){.fx{grid-template-columns:minmax(0,1fr) !important}.stage{grid-template-columns:minmax(0,1fr) !important}.g4{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.g3{grid-template-columns:minmax(0,1fr) !important}.pats{grid-template-columns:repeat(3,minmax(0,1fr)) !important}}
@media (max-width: 1000px){.frow{grid-template-columns:minmax(0,1fr) !important;gap:34px !important;direction:rtl !important}.tabs{grid-template-columns:repeat(3,minmax(0,1fr)) !important}}
@media (max-width: 1000px){.stps{grid-template-columns:minmax(0,1fr) !important;gap:18px !important}.stps .arr{transform:rotate(-90deg)}.one{white-space:normal !important}.s2{grid-template-columns:minmax(0,1fr) !important;gap:60px !important;text-align:center}.s2 p{margin:0 auto !important}}
@media (max-width: 760px){.v1g{grid-template-columns:minmax(0,1fr) !important}.v1g > svg{transform:rotate(-90deg);justify-self:center}.vpg{grid-template-columns:minmax(0,1fr) !important;justify-items:center}.frow h3{font-size:36px !important}.frow p{font-size:19px !important}.kick{font-size:16px !important}.stp b{font-size:28px !important}.frow{gap:26px !important}.lock{flex-direction:column !important;gap:18px !important}.hseal{width:130px !important}.mcta{display:flex !important}.topnav{padding:14px 18px !important}.topnav .navl{display:none !important}.word{font-size:84px !important}.lat{font-size:14px !important}.pad{padding-left:20px !important;padding-right:20px !important}.navl{display:none !important}.mark{transform:scale(.8);margin:-24px 0 -24px}.big{width:600px !important;height:600px !important;margin:-300px 0 0 -300px !important}.h2m{font-size:36px !important}.g4{grid-template-columns:minmax(0,1fr) !important}.pats{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.ph{transform:scale(.78) !important;margin:-90px auto !important}.seals{gap:10px !important}.tag{font-size:19px !important}.stg{min-height:470px !important}.stg > * > div{transform:scale(.82)}}
.w2{display:inline-block;animation:w2in 1s cubic-bezier(.2,.7,.2,1) both;transform-origin:50% 100%}
@keyframes w2in{0%{opacity:0;transform:translateY(40px) rotateX(70deg) scale(.9);filter:blur(10px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:none;filter:blur(0)}}
.hlw{display:inline-block;animation:hlg 4s ease-in-out 2s infinite}
.hlww{color:#FFFFFF;animation-name:hlgw}@keyframes hlgw{0%,100%{text-shadow:0 0 10px rgba(255,255,255,.5),0 0 24px rgba(134,220,234,.35),0 1px 2px rgba(10,42,67,.3)}50%{text-shadow:0 0 16px rgba(255,255,255,.75),0 0 34px rgba(134,220,234,.5),0 1px 2px rgba(10,42,67,.3)}}@keyframes hlg{0%,100%{text-shadow:0 0 0 rgba(134,220,234,0)}50%{text-shadow:0 0 28px rgba(134,220,234,.55)}}
.dustL{position:absolute;left:0;top:-200px;width:2px;height:2px;border-radius:50%;pointer-events:none;animation:dustUp 40s linear infinite;opacity:.7}
.dustL.d2{width:1.5px;height:1.5px;animation-duration:60s;opacity:.5}
@keyframes dustUp{from{transform:translateY(0)}to{transform:translateY(-600px)}}
.frow h3{font-size:min(52px,3.5vw) !important;white-space:nowrap}
@media (max-width: 1000px){.frow h3{font-size:min(52px,6.6vw) !important}}
@media (max-width: 760px){.h2m.fit{font-size:var(--fs) !important;white-space:nowrap !important}.frow h3{font-size:min(40px,7vw) !important}}
h1,h2,h3,p,li,label{text-wrap:balance}
span,b,a{text-wrap:pretty}

.scene{position:relative;width:100%;height:clamp(500px,44vw,620px);display:flex;align-items:flex-end;justify-content:center}
.envw{position:relative;width:clamp(270px,26vw,350px);aspect-ratio:1/1.32;margin-bottom:10px;perspective:1100px}
.eback,.efront,.eflap{position:absolute;left:0;right:0;bottom:0;height:62%;border-radius:22px}
.eback{background:linear-gradient(180deg,#C9D6DD,#AFC1CA);box-shadow:0 50px 90px rgba(0,0,0,.5);z-index:0}
.efront{z-index:3;background:linear-gradient(170deg,#FAFBFC,#E4EBEE);clip-path:polygon(0 0,50% 46%,100% 0,100% 100%,0 100%);border-radius:0 0 22px 22px}
.efront::after{content:"";position:absolute;inset:0;background:linear-gradient(to top right,rgba(10,42,67,.07) 49.6%,rgba(10,42,67,0) 50.4%),linear-gradient(to top left,rgba(10,42,67,.07) 49.6%,rgba(10,42,67,0) 50.4%)}
.eflap{bottom:auto;top:38%;height:34%;border-radius:0;background:linear-gradient(180deg,#EEF2F4,#D3DEE3);clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:50% 0;z-index:4}
.epaper{position:absolute;left:7%;right:7%;bottom:4%;height:74%;z-index:2;border-radius:18px;background:linear-gradient(165deg,#FFFFFF,#EEF3F5);box-shadow:0 18px 40px rgba(4,18,31,.25);display:flex;flex-direction:column;align-items:center;gap:9px;padding-top:9%;overflow:visible;transform-origin:50% 100%}
.epaper > .rv:first-of-type{}
.epaper .pk{font-family:TD, TDx, serif;font-size:clamp(13px,1.1vw,16px);color:#0E97AE}
.epaper .pt{font-family:TD, TDx, serif;font-size:clamp(34px,3.3vw,46px);line-height:1.1;color:#0A2A43}
.epaper .pn{font-size:clamp(13px,1.1vw,15px);color:#4A5B68;font-weight:700}
.ml{display:block;height:7px;border-radius:6px;background:#0A2A43;opacity:.12}
.epaper{overflow:hidden}
.eseal{position:absolute;left:50%;bottom:22%;width:34%;margin-left:-17%;overflow:visible;z-index:2}
.eink{position:absolute;left:50%;bottom:22%;width:34%;aspect-ratio:1;margin-left:-17%;border-radius:50%;border:2px solid #86DCEA}
.mini{position:absolute;width:clamp(120px,11vw,160px);aspect-ratio:3/4;rotate:var(--r)}
.mini .mp{position:absolute;inset:0;border-radius:18px;background:linear-gradient(165deg,rgba(255,255,255,.96),rgba(220,228,232,.92));box-shadow:0 30px 60px rgba(0,0,0,.42);display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:16%}
.mini .mp b{font-family:TD, TDx, serif;font-size:clamp(14px,1.25vw,18px);color:#0A2A43;margin:2px 0}
.mini .ms{position:absolute;left:50%;bottom:-12%;width:52%;translate:-50% 0;filter:drop-shadow(0 10px 14px rgba(0,0,0,.35))}
.cons{position:relative;display:flex;justify-content:center;gap:clamp(10px,2vw,30px);margin-bottom:26px;width:100%;max-width:980px}
.cs{display:block;width:clamp(46px,6vw,84px);translate:0 var(--y);filter:drop-shadow(0 14px 18px rgba(0,0,0,.4))}
@keyframes envIn{0%{opacity:0;transform:translateY(90px) scale(.92)}100%{opacity:1;transform:none}}
@keyframes flapO{0%{transform:rotateX(0);z-index:4}49%{z-index:4}50%{z-index:1}100%{transform:rotateX(180deg);z-index:1;filter:brightness(.82)}}
@keyframes paperO{0%{transform:translateY(0) scaleY(.94)}55%{transform:translateY(-44%) scaleY(1.02) rotate(-1.5deg)}75%{transform:translateY(-38%) scaleY(.99) rotate(.6deg)}100%{transform:translateY(-40%) scaleY(1) rotate(0)}}
@keyframes pressS{0%{opacity:0;transform:translateY(-120px) scale(1.9) rotate(-30deg)}62%{opacity:1;transform:translateY(0) scale(.86) rotate(-4deg)}78%{transform:scale(1.06) rotate(1deg)}100%{opacity:1;transform:none}}
@keyframes miniIn{0%{opacity:0;scale:.6;translate:0 60px}100%{opacity:1;scale:1;translate:0 0}}
@keyframes miniF{0%,100%{translate:0 0}50%{translate:0 -14px}}
@keyframes csIn{0%{opacity:0;scale:.4}100%{opacity:1;scale:1}}
.cs{animation-fill-mode:both}
@media (max-width: 1000px){.mB{display:none}.mini.mA{top:2% !important}}
@media (max-width: 760px){.scene{height:520px}.mini{width:104px}.mini.mA{top:0 !important}.mini[style*="left"]{left:-2% !important}.mini[style*="right"]{right:-2% !important}.envw{width:250px}.cons{gap:6px}.cons .cs:nth-child(1),.cons .cs:nth-child(8){display:none}.fblend{padding-top:330px !important;padding-bottom:310px !important}}

.sbox{position:relative;background:#FFFFFF;border-radius:32px;border:1px solid #E3EAEE;box-shadow:0 30px 70px rgba(10,42,67,.12);padding:26px;min-height:440px;box-sizing:border-box;overflow:hidden}
.sw{position:relative;display:grid;grid-template-columns:1fr 1fr;height:52px;border-radius:999px;background:#EDF1F3;padding:5px;box-sizing:border-box;font-size:16px;font-weight:700;text-align:center;align-items:center}
.sw > span{position:relative;z-index:1}
.swk{position:absolute !important;z-index:0 !important;top:5px;bottom:5px;right:5px;width:calc(50% - 5px);border-radius:999px;background:#0A2A43;box-shadow:0 6px 14px rgba(10,42,67,.25);animation:swK 12s cubic-bezier(.6,0,.2,1) infinite}
.swa{animation:swA 12s step-end infinite}.swb{animation:swB 12s step-end infinite}
@keyframes swK{0%,46%{transform:none}50%,96%{transform:translateX(-100%)}100%{transform:none}}
@keyframes swA{0%{color:#FFFFFF}48%{color:#4A5B68}98%{color:#FFFFFF}}
@keyframes swB{0%{color:#4A5B68}48%{color:#FFFFFF}98%{color:#4A5B68}}
.spane{position:absolute;left:26px;right:26px;top:100px;bottom:26px;display:flex;flex-direction:column;gap:14px}
.sA{animation:paneA 12s ease infinite}.sB{animation:paneB 12s ease infinite}
@keyframes paneA{0%,44%{opacity:1;transform:none;visibility:visible}48%,96%{opacity:0;transform:translateX(30px);visibility:hidden}100%{opacity:1;transform:none;visibility:visible}}
@keyframes paneB{0%,48%{opacity:0;transform:translateX(-30px);visibility:hidden}52%,94%{opacity:1;transform:none;visibility:visible}98%,100%{opacity:0;visibility:hidden}}
.slb{font-size:15px;font-weight:700;color:#0E97AE}
.smsg{position:relative;border-radius:22px;border:1.5px solid #CFE7EE;background:#F7FBFC;padding:16px 18px;display:flex;flex-direction:column;gap:4px;font-size:17px;line-height:1.75;color:#0A2A43}
.slink{align-self:flex-start;margin-top:6px;height:36px;padding:0 14px;border-radius:999px;background:#E6F6F9;color:#086577;font-size:15px;font-weight:700;direction:ltr;display:inline-flex;align-items:center}
.scaret{position:absolute;left:18px;bottom:22px;width:2px;height:22px;background:#0E97AE;animation:blink 1s step-end infinite}
@keyframes blink{50%{opacity:0}}
.scopy{position:relative;height:54px;border-radius:999px;background:#0A2A43;color:#FFFFFF;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:cpy 12s ease infinite}
.scopy > span{position:absolute;display:flex;align-items:center;gap:8px}
.sc1{animation:c1 12s ease infinite}.sc2{animation:c2 12s ease infinite}
@keyframes cpy{0%,14%{background:#0A2A43;transform:none}16%{transform:scale(.96)}18%,44%{background:#0E97AE;transform:none}100%{background:#0A2A43}}
@keyframes c1{0%,15%{opacity:1;transform:none}18%,100%{opacity:0;transform:translateY(-14px)}}
@keyframes c2{0%,15%{opacity:0;transform:translateY(14px)}18%,46%{opacity:1;transform:none}50%,100%{opacity:0}}
.sapps{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.sapp{width:46px;height:46px;border-radius:50%;background:#E6F6F9;display:flex;align-items:center;justify-content:center;animation:appP 12s ease infinite}
@keyframes appP{0%,20%{transform:none;box-shadow:none}24%{transform:translateY(-6px);box-shadow:0 10px 20px rgba(14,151,174,.25)}30%,100%{transform:none;box-shadow:none}}
.srows{display:flex;flex-direction:column;gap:10px}
.srow{display:flex;align-items:center;gap:10px;height:58px;padding:0 18px;border-radius:999px;background:#F4F7F8;font-size:16px;color:#4A5B68;animation:rowIn 12s ease infinite}
.srow b{color:#0A2A43;font-weight:700}.srow > span{margin-right:auto;font-size:14px}
@keyframes rowIn{0%,50%{opacity:0;transform:translateY(10px)}55%,100%{opacity:1;transform:none}}
.sprog{display:flex;flex-direction:column;gap:10px;margin-top:6px}
.sbar{height:12px;border-radius:999px;background:#EDF1F3;overflow:hidden;display:block}
.sbar i{display:block;height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#0E97AE,#86DCEA);animation:bar 12s ease infinite}
@keyframes bar{0%,60%{width:0}86%,100%{width:100%}}
.sdone{position:relative;height:26px;font-size:16px;font-weight:700}
.sdone > span{position:absolute;right:0}
.sd1{color:#4A5B68;animation:d1 12s ease infinite}.sd2{color:#0E97AE;animation:d2 12s ease infinite}
@keyframes d1{0%,84%{opacity:1}87%,100%{opacity:0}}
@keyframes d2{0%,85%{opacity:0;transform:translateY(8px)}88%,100%{opacity:1;transform:none}}
@media (max-width: 760px){.sbox{padding:18px;min-height:470px}.spane{left:18px;right:18px;top:86px}.sw{font-size:14px}.smsg{font-size:15px}}

.cue{display:inline-flex;flex-direction:column;align-items:center;gap:12px;border:0;background:transparent;color:#DCE4E8;font-family:inherit;font-size:15px;font-weight:500;cursor:pointer;padding:6px 14px;transition:color .4s ease}
.cue:hover{color:#FFFFFF}.cue:hover .cuem{border-color:#86DCEA}
.cuet{letter-spacing:normal}
.cuem{position:relative;width:26px;height:42px;border-radius:999px;border:1.5px solid rgba(220,228,232,.55);box-sizing:border-box;transition:border-color .4s ease}
.cuem i{position:absolute;left:50%;top:8px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#86DCEA;box-shadow:0 0 10px #86DCEA;animation:cueD 2.6s cubic-bezier(.45,0,.25,1) infinite}
@keyframes cueD{0%{transform:translateY(0);opacity:0}18%{opacity:1}70%{transform:translateY(16px);opacity:1}100%{transform:translateY(20px);opacity:0}}
.mqw{position:absolute;left:0;right:0;top:40px;display:flex;flex-direction:column;gap:16px;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.mqr{overflow:hidden;direction:ltr}
.mqt{display:flex;gap:14px;width:max-content;animation:mqL 46s linear infinite}
.m2 .mqt{animation-name:mqR;animation-duration:52s}
.mq{direction:rtl;display:inline-flex;align-items:center;gap:10px;height:54px;padding:0 24px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(134,220,234,.25);color:#DCE4E8;font-size:19px;font-weight:500;white-space:nowrap}
.m2 .mq{background:rgba(255,255,255,.12);color:#FAFBFC}
.mq i{width:9px;height:9px;border-radius:50%;background:#86DCEA;box-shadow:0 0 10px #86DCEA}
@keyframes mqL{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes mqR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@media (max-width: 760px){.mq{height:44px;font-size:16px;padding:0 18px}.mqw{top:30px;gap:10px}.cue{height:46px;font-size:15px}}

.rib{position:absolute;left:0;right:0;bottom:70px;overflow:hidden;direction:ltr;pointer-events:none;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.ribt{display:flex;gap:22px;width:max-content;padding:20px 0 30px;animation:mqR 60s linear infinite}
.rbc{direction:rtl;position:relative;width:132px;height:186px;flex:none;border-radius:22px;box-shadow:0 20px 40px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.14);display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:30px;box-sizing:border-box;animation:rbF 6s ease-in-out infinite}
.rbc:nth-child(2n){animation-delay:-3s;margin-top:18px}
.rbt{font-family:TD, TDx, serif;font-size:17px;font-weight:700}
.rbl{display:block;width:62%;height:5px;border-radius:4px;opacity:.35}
.rbs{position:absolute;bottom:-14px;left:50%;translate:-50% 0;height:30px;padding:0 12px;border-radius:999px;color:#FFFFFF;font-size:12px;font-weight:700;display:flex;align-items:center;box-shadow:0 8px 16px rgba(0,0,0,.3)}
@keyframes rbF{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (max-width: 760px){.rbc{width:104px;height:150px;padding-top:22px}.rbt{font-size:14px}.rib{bottom:40px}}
.tplb{align-self:flex-start;height:50px;padding:0 22px;border-radius:999px;border:1px solid rgba(10,42,67,.2);background:#FFFFFF;color:#0A2A43;font-family:inherit;font-size:16px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:10px;box-shadow:0 10px 24px rgba(10,42,67,.08);transition:transform .25s ease,box-shadow .25s ease}.tplb:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(10,42,67,.14)}

/* motion 6: hero pattern reveal */
.hpat{position:absolute;inset:0;pointer-events:none;opacity:.75;-webkit-mask-image:radial-gradient(250px circle at var(--px) var(--py),#000 10%,transparent 100%);mask-image:radial-gradient(250px circle at var(--px) var(--py),#000 10%,transparent 100%)}
.hpat rect{opacity:0;animation:hpx 18s linear infinite}
.hpat .hp2{animation-delay:6s}.hpat .hp3{animation-delay:12s}
@keyframes hpx{0%{opacity:0}5%,30%{opacity:1}36%,100%{opacity:0}}
/* motion 4: seats */
.seats{display:grid;grid-template-columns:repeat(20,minmax(0,1fr));gap:6px;direction:rtl}
.seats i{display:block;aspect-ratio:1;border-radius:50%;background:#EDF1F3}
.seats i.sc{animation:seatC .55s cubic-bezier(.3,1.6,.5,1) both}
.seats i.sd{animation:seatD .55s ease-out both}
.seats i.sn{animation:seatN .8s ease-out both}
@keyframes seatC{from{background:#EDF1F3;transform:scale(.4)}to{background:#0E97AE;transform:none}}
@keyframes seatD{from{background:#EDF1F3;transform:scale(.6)}to{background:#B8C4CC;transform:none}}
@keyframes seatN{from{background:#EDF1F3}to{background:#F3E4B5}}
/* motion 3: phone story in cert */
.cph{display:flex;justify-content:center;align-items:center;gap:100px;max-width:1180px;margin:0 auto;width:100%}
.cphone{box-sizing:border-box;position:relative;flex:none;width:300px;height:612px;border-radius:46px;padding:10px;background:#021019;box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(134,220,234,.18),0 0 80px rgba(14,151,174,.25)}
.cview{position:relative;width:100%;height:100%;border-radius:37px;overflow:hidden;background:radial-gradient(80% 50% at 50% 0%,#0F3F5E,#05202F)}
.cnotch{position:absolute;top:10px;left:50%;width:86px;height:24px;margin-left:-43px;border-radius:14px;background:#021019;z-index:3}
.cscr{position:absolute;inset:0}
@keyframes mscIn{0%{opacity:0;transform:translateY(14px) scale(.97)}4%,29%{opacity:1;transform:none}33%,100%{opacity:0;transform:translateY(-10px) scale(.98)}}
.msc.m2{animation-delay:-8s}.msc.m3{animation-delay:-4s}
.msc{box-sizing:border-box;position:absolute;inset:0;opacity:0;animation:mscIn 12s ease-in-out infinite;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:40px 22px 24px;text-align:center;color:#B9CCD6;font-size:15px}
.msc.m2{padding-left:12px;padding-right:12px}
.msc .ck{font-size:13px;color:#86DCEA}
.msc .ct{font-family:TD, TDx, serif;font-size:28px;color:#FAFBFC;line-height:1.3}
.ccode{display:flex;gap:8px;direction:ltr}
.ccode i{font-style:normal;width:42px;height:54px;border-radius:14px;background:rgba(134,220,234,.12);border:1px solid rgba(134,220,234,.25);display:grid;place-items:center;font-family:TS, 'IBM Plex Sans Arabic', sans-serif;font-weight:700;font-size:26px;color:#FAFBFC;animation:cdig 12s ease-out infinite both}
.ccode i:nth-child(2){animation-delay:.35s}.ccode i:nth-child(3){animation-delay:.7s}.ccode i:nth-child(4){animation-delay:1.05s}
@keyframes cdig{0%,3%{opacity:0;transform:translateY(8px)}6%,31%{opacity:1;transform:none}34%,100%{opacity:0}}
.cok{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 16px;border-radius:999px;background:#0E97AE;color:#fff;font-weight:700;font-size:14px;animation:cok 12s ease-out infinite both}
@keyframes cok{0%,13%{opacity:0;transform:scale(.8)}16%,31%{opacity:1;transform:none}34%,100%{opacity:0}}
.cpaper{position:relative;width:220px;height:156px;border-radius:10px;background:#F6F1E7;color:#0A2A43;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 18px 40px rgba(0,0,0,.4)}
.cpaper:before{content:"";position:absolute;inset:7px;border:1px solid rgba(184,137,42,.6);border-radius:5px}
.cpaper b{font-family:TD, TDx, serif;font-size:19px}.cpaper span{font-size:10px;color:#4A5B68}.cpaper em{font-style:normal;font-family:TD, TDx, serif;font-size:23px}
.cpaper svg{position:absolute;left:12px;bottom:10px;width:40px;height:40px}
.ccert{display:block;width:100%;height:auto;border-radius:6px;box-shadow:0 18px 40px rgba(0,0,0,.45),0 0 0 1px rgba(134,220,234,.2)}
.cdl{display:inline-flex;align-items:center;height:38px;padding:0 18px;border-radius:999px;background:#FAFBFC;color:#0A2A43;font-weight:700;font-size:14px}
.cpct{font-family:TD, TDx, serif;font-size:76px;line-height:1;color:#86DCEA;text-shadow:0 0 30px rgba(134,220,234,.4)}
.cbars{display:flex;align-items:flex-end;gap:10px;height:90px}
.cbars i{width:22px;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,#86DCEA,#0E97AE)}
.cpdf{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 16px;border-radius:999px;border:1px solid rgba(134,220,234,.4);color:#86DCEA;font-size:13px}
.csteps{display:flex;flex-direction:column;gap:20px;flex:0 1 560px;min-width:0}
.cst{box-sizing:border-box;position:relative;display:flex;gap:18px;align-items:flex-start;padding:22px 24px;border-radius:26px;border:1px solid rgba(134,220,234,.12);overflow:hidden;animation:cstOn 12s linear infinite}
.cst.c2{animation-delay:-8s}.cst.c3{animation-delay:-4s}
@keyframes cstOn{0%,30%{opacity:1;background:rgba(134,220,234,.09);border-color:rgba(134,220,234,.4)}34%,96%{opacity:.42;background:rgba(134,220,234,0);border-color:rgba(134,220,234,.12)}100%{opacity:1;background:rgba(134,220,234,.09);border-color:rgba(134,220,234,.4)}}
.cst .cn{font-family:TD, TDx, serif;font-size:26px;color:#86DCEA;flex:none;line-height:1.3}
.cst b{display:block;font-family:TD, TDx, serif;font-size:30px;line-height:1.3;color:#FAFBFC;margin-bottom:6px}
.cst span.cd{font-size:18px;line-height:1.8;color:#B9CCD6}
.cst .cbar{position:absolute;right:0;bottom:0;height:3px;width:100%;background:#86DCEA;transform-origin:100% 50%;animation:cbar 12s linear infinite}
.cst.c2 .cbar{animation-delay:-8s}.cst.c3 .cbar{animation-delay:-4s}
@keyframes cbar{0%{transform:scaleX(0);opacity:1}33%{transform:scaleX(1);opacity:1}34%,100%{transform:scaleX(0);opacity:0}}
@media (max-width: 1000px){.cph{flex-direction:column;gap:40px}.csteps{flex:none;width:100%;max-width:560px}}
@media (max-width: 760px){.cphone{width:236px;height:482px}.cst b{font-size:24px}.cst span.cd{font-size:16px}.cst{padding:18px}.seats{gap:4px}.hpat{-webkit-mask-image:radial-gradient(170px circle at var(--px) var(--py),#000 10%,transparent 100%);mask-image:radial-gradient(170px circle at var(--px) var(--py),#000 10%,transparent 100%)}}
@media (prefers-reduced-motion: reduce){.msc,.cst,.cst .cbar,.ccode i,.cok,.hpat rect{animation:none !important}.ccode i,.cok,.hpat .hp1,.msc.m1{opacity:1}}`;

export default function LuxCView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dir="rtl" ref={v.setRoot} onPointerMove={v.onMove} style={{ position: "relative", overflow: "hidden", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "300", color: "#DCE4E8", background: "#072538", "--mx": "0", "--my": "0", "--px": "50%", "--py": "40%" }}>
        {" "}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="lcW" cx="34%" cy="28%" r="80%">
              <stop offset="0%" stopColor={v.seal?.light} />
              <stop offset="45%" stopColor={v.seal?.hex} />
              <stop offset="100%" stopColor={v.seal?.deep} />
            </radialGradient>
            <radialGradient id="lcT" cx="34%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#6FD6E6" />
              <stop offset="45%" stopColor="#0E97AE" />
              <stop offset="100%" stopColor="#05505E" />
            </radialGradient>
            <filter id="lcSh" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000000" floodOpacity="0.6" /></filter>
            <pattern id="lcPat" width="150" height="150" patternUnits="userSpaceOnUse">
              <g transform="translate(18 18) scale(.42)">
                <path d={v.wax} fill="none" stroke="#86DCEA" strokeWidth="2.2" />
                <text x="50" y="62" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="40" fill="#86DCEA">{"ح"}</text>
              </g>
              <g transform="translate(98 92) scale(.3) rotate(-14 50 50)"><path d={v.wax} fill="none" stroke="#86DCEA" strokeWidth="2.6" /></g>
            </pattern>
            <pattern id="hpS" width="48" height="48" patternUnits="userSpaceOnUse">
              <rect width="48" height="48" fill="#0A2A43" />
              <path d="M0 20 L12 5 L24 20 L36 5 L48 20 Z" fill="#0E97AE" />
              <path d="M0 38 L12 25 L24 38 L36 25 L48 38 Z" fill="#86DCEA" fillOpacity=".55" />
              <rect y="42" width="48" height="3" fill="#05202F" />
              <circle cx="12" cy="15" r="2" fill="#DCF4F8" />
              <circle cx="36" cy="15" r="2" fill="#DCF4F8" />
            </pattern>
            <pattern id="hpN" width="110" height="110" patternUnits="userSpaceOnUse">
              <rect width="110" height="110" fill="#06233A" />
              <circle cx="14" cy="20" r="1.6" fill="#FFFFFF" />
              <circle cx="70" cy="10" r="1.1" fill="#86DCEA" />
              <circle cx="48" cy="58" r="2.3" fill="#DCF4F8" />
              <circle cx="96" cy="76" r="1.3" fill="#FFFFFF" />
              <circle cx="24" cy="92" r="1" fill="#86DCEA" />
              <circle cx="88" cy="40" r=".9" fill="#FFFFFF" />
              <path d="M78 92 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#86DCEA" />
              <path d="M30 38 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4z" fill="#FFFFFF" />
            </pattern>
            <linearGradient id="hpMg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#86DCEA" stopOpacity="0" /><stop offset="1" stopColor="#DCF4F8" /></linearGradient>
            <pattern id="hpJ" width="140" height="140" patternUnits="userSpaceOnUse">
              <rect width="140" height="140" fill="#072538" />
              <path d="M10 6 L58 54" stroke="url(#hpMg)" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="58" cy="54" r="2.6" fill="#FFFFFF" />
              <path d="M80 60 L112 92" stroke="url(#hpMg)" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="112" cy="92" r="2" fill="#DCF4F8" />
              <path d="M20 96 L40 116" stroke="url(#hpMg)" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="40" cy="116" r="1.6" fill="#86DCEA" />
              <circle cx="120" cy="20" r="1.2" fill="#86DCEA" />
              <circle cx="70" cy="128" r="1" fill="#FFFFFF" />
            </pattern>
          </defs>
        </svg>
        {" "}
        <nav className="pad topnav" style={{ position: "sticky", top: "0", zIndex: "30", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 64px", fontSize: "16px", background: "linear-gradient(180deg, rgba(7,37,56,.85), rgba(7,37,56,0))", WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)", animation: "up 1s ease-out 3.6s both" }}>
          <A href="LuxC.dc.html" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Mark size={34} />
            <span style={{ fontFamily: "TD, TDx, serif", fontSize: "20px", color: "#FAFBFC" }}>حيّــاك</span>
          </A>
          <span className="navl" style={{ display: "flex", gap: "38px", color: "#DCE4E8", fontSize: "17px" }}>
            <A href="#features" style={{ textDecoration: "none" }}>المميزات</A>
            <A href="#how" style={{ textDecoration: "none" }}>كيف تشتغل</A>
            <A href="Signup.dc.html" style={{ textDecoration: "none" }}>الأسعار</A>
          </span>
          <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <A href="Signup.dc.html" className="btn" style={{ height: "42px", padding: "0 22px", borderRadius: "999px", border: "1px solid rgba(220,228,232,.5)", color: "#FAFBFC", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>دخول</A>
            <A href="Signup.dc.html" className="btn glowbtn" style={{ height: "42px", padding: "0 20px", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", textDecoration: "none", fontWeight: "500", display: "inline-flex", alignItems: "center" }}>أنشئ حسابك</A>
          </span>
        </nav>
        {" "}
        <section style={{ position: "relative", height: "100vh", minHeight: "720px", maxHeight: "1240px", marginTop: "-86px", overflow: "hidden", background: "radial-gradient(60% 50% at 18% 12%, rgba(14,151,174,.42), rgba(14,151,174,0) 70%), radial-gradient(55% 45% at 85% 70%, rgba(134,220,234,.2), rgba(134,220,234,0) 70%), radial-gradient(60% 50% at 50% 50%, rgba(18,74,104,.9), rgba(7,37,56,0) 100%), linear-gradient(180deg, #0B3550, #072538)" }}>
          <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "280px", background: "linear-gradient(0deg, #072538, rgba(7,37,56,0))", pointerEvents: "none" }} />
          {" "}
          <svg className="hpat" aria-hidden="true" width="100%" height="100%">
            <rect className="hp1" width="100%" height="100%" fill="url(#hpS)" />
            <rect className="hp2" width="100%" height="100%" fill="url(#hpN)" />
            <rect className="hp3" width="100%" height="100%" fill="url(#hpJ)" />
          </svg>
          {" "}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", transform: "translate(calc(var(--mx) * -18px), calc(var(--my) * -14px))", transition: "transform .4s ease-out" }}>
            {" "}
            <svg className="big" width="1300" height="1300" viewBox="0 0 100 100" style={{ position: "absolute", left: "50%", top: "50%", margin: "-650px 0 0 -650px", animation: "ringSpin 160s linear infinite" }}>
              <path d={v.wax} fill="none" stroke="rgba(134,220,234,.1)" strokeWidth=".16" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(134,220,234,.07)" strokeWidth=".14" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(134,220,234,.05)" strokeWidth=".14" />
            </svg>
            {" "}
            {(v.dust || []).map((d, $i0) => (
              <span key={d?.key ?? $i0} style={S(`${txt(d?.st)}`)} />
            ))}
            {" "}
          </div>
          {" "}
          <canvas ref={v.setHC} aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "3", pointerEvents: "none" }} />
          {" "}
          <div className="pad" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 40px 60px" }}>
            <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "stretch", transform: "translate(calc(var(--mx) * 14px), calc(var(--my) * 8px))", transition: "transform .4s ease-out" }}>
              <span aria-hidden="true" style={{ position: "absolute", left: "-25%", right: "-25%", top: "-20%", bottom: "-10%", background: "radial-gradient(ellipse 50% 42% at 50% 50%, rgba(14,151,174,.42), rgba(14,151,174,0) 72%)", animation: "bloomSoft 3s ease-out 1.2s both", pointerEvents: "none" }} />
              <h1 className="word" style={{ position: "relative", margin: "0", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "clamp(110px, min(31vw, 40vh), 540px)", lineHeight: "1.12", color: "#FAFBFC", textShadow: "0 0 22px rgba(134,220,234,.35)", animation: "wordFade 1.8s ease-out .1s both, breatheW 6s ease-in-out 3s infinite", cursor: "default" }}>حيّــاك</h1>
              <span aria-hidden="true" style={{ position: "absolute", top: "0", bottom: "30%", width: "140px", background: "linear-gradient(90deg, rgba(134,220,234,0), rgba(255,255,255,.8), rgba(134,220,234,0))", filter: "blur(18px)", mixBlendMode: "screen", animation: "sweep 1.8s cubic-bezier(.5,0,.2,1) 2.6s both" }} />
              <span className="lat" style={{ position: "relative", display: "flex", justifyContent: "space-between", marginTop: "clamp(12px, 2.4vh, 40px)", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "clamp(26px, min(5vw, 6.4vh), 78px)", letterSpacing: "0", direction: "ltr", color: "#86DCEA" }}>
                {(v.lat || []).map((l, $i1) => (
                  <span key={l?.key ?? $i1} style={S(`${txt(l?.st)}`)}>{l?.c}</span>
                ))}
              </span>
            </div>
            <p className="tag2" style={{ margin: "clamp(26px, 4.4vh, 80px) 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: ".32em", flexWrap: "wrap", fontFamily: "TD, TDx, serif", fontWeight: "700", fontSize: "clamp(36px, 4.4vw, 68px)", lineHeight: "1.3", color: "#FAFBFC" }}>
              <span className="wd" style={{ animationDelay: "2.85s" }}>كل حضور</span>
              <span className="wd" style={{ animationDelay: "3.1s" }}>يبدأ</span>
              <span className="wd" style={{ position: "relative", display: "inline-block", color: "#86DCEA", textShadow: "0 0 28px rgba(134,220,234,.6)", animationDelay: "3.4s" }}>بدعوة</span>
            </p>
            <div className="u" style={{ marginTop: "clamp(18px, 3vh, 34px)", display: "flex", justifyContent: "center", animationDelay: "4.2s" }}>
              <button type="button" className="cue" onClick={v.goDown} aria-label="انزل واكتشف حيّــاك"><span className="cuet">اكتشف حيّــاك</span><span className="cuem"><i /></span></button>
            </div>
          </div>
          {" "}
        </section>
        {" "}
        <section data-rv="1" data-next="1" className="pad" style={{ position: "relative", padding: "150px 64px 40px", background: "radial-gradient(45% 45% at 25% 55%, rgba(14,151,174,.32), rgba(14,151,174,0) 70%), linear-gradient(180deg, #072538, #0B3550)", overflow: "hidden" }}>
          <span aria-hidden="true" className="dustL" style={{ boxShadow: "483px 621px rgba(134,220,234,.7),211px 811px rgba(134,220,234,.7),980px 317px rgba(134,220,234,.7),184px 136px rgba(134,220,234,.7),40px 822px rgba(134,220,234,.7),1125px 592px rgba(134,220,234,.7),1567px 120px rgba(134,220,234,.7),454px 1065px rgba(134,220,234,.7),1099px 737px rgba(134,220,234,.7),566px 353px rgba(134,220,234,.7),217px 536px rgba(134,220,234,.7),439px 52px rgba(134,220,234,.7),1312px 533px rgba(134,220,234,.7),556px 396px rgba(134,220,234,.7),337px 634px rgba(134,220,234,.7),593px 1284px rgba(134,220,234,.7),1498px 762px rgba(134,220,234,.7),177px 1240px rgba(134,220,234,.7),691px 1375px rgba(134,220,234,.7),794px 1036px rgba(134,220,234,.7),509px 364px rgba(134,220,234,.7),506px 969px rgba(134,220,234,.7),573px 182px rgba(134,220,234,.7),1121px 614px rgba(134,220,234,.7),14px 597px rgba(134,220,234,.7),1172px 638px rgba(134,220,234,.7),1567px 1041px rgba(134,220,234,.7),399px 847px rgba(134,220,234,.7),867px 1226px rgba(134,220,234,.7),590px 882px rgba(134,220,234,.7),924px 330px rgba(134,220,234,.7),477px 624px rgba(134,220,234,.7),531px 88px rgba(134,220,234,.7),166px 94px rgba(134,220,234,.7),947px 1282px rgba(134,220,234,.7),574px 1062px rgba(134,220,234,.7),1094px 1327px rgba(134,220,234,.7),965px 702px rgba(134,220,234,.7),297px 1379px rgba(134,220,234,.7),400px 136px rgba(134,220,234,.7),845px 415px rgba(134,220,234,.7),1300px 1295px rgba(134,220,234,.7),903px 565px rgba(134,220,234,.7),376px 728px rgba(134,220,234,.7),892px 1205px rgba(134,220,234,.7),656px 1299px rgba(134,220,234,.7),1143px 406px rgba(134,220,234,.7),662px 206px rgba(134,220,234,.7),126px 468px rgba(134,220,234,.7),568px 1192px rgba(134,220,234,.7),1260px 486px rgba(134,220,234,.7),250px 678px rgba(134,220,234,.7),363px 595px rgba(134,220,234,.7),940px 52px rgba(134,220,234,.7),87px 731px rgba(134,220,234,.7),1428px 169px rgba(134,220,234,.7),585px 1382px rgba(134,220,234,.7),669px 37px rgba(134,220,234,.7),661px 591px rgba(134,220,234,.7),658px 313px rgba(134,220,234,.7),1587px 1335px rgba(134,220,234,.7),840px 1270px rgba(134,220,234,.7),1392px 159px rgba(134,220,234,.7),600px 1265px rgba(134,220,234,.7),392px 909px rgba(134,220,234,.7),598px 279px rgba(134,220,234,.7),512px 781px rgba(134,220,234,.7),1226px 325px rgba(134,220,234,.7),678px 1173px rgba(134,220,234,.7),19px 744px rgba(134,220,234,.7),91px 931px rgba(134,220,234,.7),347px 747px rgba(134,220,234,.7),742px 594px rgba(134,220,234,.7),1170px 198px rgba(134,220,234,.7),899px 424px rgba(134,220,234,.7),868px 425px rgba(134,220,234,.7),232px 121px rgba(134,220,234,.7),127px 113px rgba(134,220,234,.7),1509px 345px rgba(134,220,234,.7),1219px 1386px rgba(134,220,234,.7),306px 1242px rgba(134,220,234,.7),83px 1118px rgba(134,220,234,.7),1004px 1193px rgba(134,220,234,.7),510px 658px rgba(134,220,234,.7),72px 250px rgba(134,220,234,.7),1083px 599px rgba(134,220,234,.7),1584px 838px rgba(134,220,234,.7),1334px 410px rgba(134,220,234,.7),978px 413px rgba(134,220,234,.7),495px 898px rgba(134,220,234,.7)" }} />
          <span aria-hidden="true" className="dustL d2" style={{ boxShadow: "840px 1007px rgba(255,255,255,.8),75px 448px rgba(255,255,255,.8),862px 908px rgba(255,255,255,.8),509px 1325px rgba(255,255,255,.8),876px 441px rgba(255,255,255,.8),1021px 384px rgba(255,255,255,.8),64px 75px rgba(255,255,255,.8),520px 518px rgba(255,255,255,.8),496px 1076px rgba(255,255,255,.8),426px 474px rgba(255,255,255,.8),854px 535px rgba(255,255,255,.8),290px 665px rgba(255,255,255,.8),105px 644px rgba(255,255,255,.8),1157px 239px rgba(255,255,255,.8),1166px 825px rgba(255,255,255,.8),1337px 1339px rgba(255,255,255,.8),1469px 82px rgba(255,255,255,.8),1012px 793px rgba(255,255,255,.8),190px 880px rgba(255,255,255,.8),431px 1172px rgba(255,255,255,.8),338px 689px rgba(255,255,255,.8),606px 1345px rgba(255,255,255,.8),965px 1315px rgba(255,255,255,.8),645px 860px rgba(255,255,255,.8),1081px 440px rgba(255,255,255,.8),1340px 549px rgba(255,255,255,.8),693px 803px rgba(255,255,255,.8),1016px 152px rgba(255,255,255,.8),573px 1285px rgba(255,255,255,.8),1368px 391px rgba(255,255,255,.8),91px 808px rgba(255,255,255,.8),1268px 261px rgba(255,255,255,.8),1570px 551px rgba(255,255,255,.8),1366px 123px rgba(255,255,255,.8),342px 1300px rgba(255,255,255,.8),951px 1165px rgba(255,255,255,.8),967px 826px rgba(255,255,255,.8),799px 447px rgba(255,255,255,.8),6px 432px rgba(255,255,255,.8),321px 26px rgba(255,255,255,.8),1249px 527px rgba(255,255,255,.8),237px 810px rgba(255,255,255,.8),1576px 780px rgba(255,255,255,.8),455px 1127px rgba(255,255,255,.8),109px 413px rgba(255,255,255,.8),331px 1375px rgba(255,255,255,.8),1245px 677px rgba(255,255,255,.8),1151px 965px rgba(255,255,255,.8),1078px 900px rgba(255,255,255,.8),54px 161px rgba(255,255,255,.8),70px 1217px rgba(255,255,255,.8),231px 1001px rgba(255,255,255,.8),1148px 526px rgba(255,255,255,.8),1245px 284px rgba(255,255,255,.8),84px 742px rgba(255,255,255,.8),163px 1071px rgba(255,255,255,.8),21px 608px rgba(255,255,255,.8),710px 153px rgba(255,255,255,.8),174px 1112px rgba(255,255,255,.8),929px 780px rgba(255,255,255,.8)" }} />
          <span aria-hidden="true" className="drift" style={{ left: "-8%", top: "10%", width: "620px", height: "620px", background: "radial-gradient(closest-side, rgba(14,151,174,.35), rgba(14,151,174,0))" }} />
          <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "380px", background: "linear-gradient(0deg, #0B3550 15%, rgba(11,53,80,0))", pointerEvents: "none", zIndex: "0" }} />
          {" "}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "36px" }}>
            <span className="rv kick" style={{ animation: "up .9s ease-out .2s both" }}>الدعوة</span>
            <h2 className="h2m fit" style={{ margin: "0", fontFamily: "TD, TDx, serif", "--fs": "min(92px, 7.6vw)", fontSize: "var(--fs)", whiteSpace: "nowrap", lineHeight: "1.3", color: "#FAFBFC" }}>
              <span className="rv w2" style={{ animationDelay: "0.35s" }}>لكل</span>
              {" "}
              <span className="rv w2" style={{ animationDelay: "0.47s" }}>مناسبة</span>
              {" "}
              <span className="hlw" style={{ color: "#86DCEA" }}>
                <span className="rv w2" style={{ animationDelay: "0.59s" }}>دعوة</span>
                {" "}
                <span className="rv w2" style={{ animationDelay: "0.71s" }}>تليق</span>
                {" "}
                <span className="rv w2" style={{ animationDelay: "0.83s" }}>بها</span>
              </span>
            </h2>
          </div>
          {" "}
          <div className="s2n" style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
            <p className="rv" style={{ margin: "0", textAlign: "center", fontSize: "clamp(21px, 2vw, 29px)", lineHeight: "1.85", color: "#DCE4E8", maxWidth: "720px", animation: "up 1s ease-out .5s both" }}>حفلة تخرّج أو ملتقى أو أمسية… اختر التصميم اللي يشبه مناسبتك، وكل ضيف توصله دعوته باسمه ويأكّد حضوره بلمسة</p>
            <div className="scene">
              <div className="mini rv mA" style={{ left: "2%", top: "4%", "--r": "-11deg", animation: "miniIn 1.3s cubic-bezier(.2,.8,.2,1) 1.7s both, miniF 7s ease-in-out 3.0s infinite" }}>
                <span className="mp">
                  <span className="ml" style={{ width: "46%" }} />
                  <b>حفل التكريم</b>
                  <span className="ml" style={{ width: "70%" }} />
                  <span className="ml" style={{ width: "54%" }} />
                </span>
                <span className="ms">
                  <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                    <defs>
                      <radialGradient id="mg1" cx="34%" cy="26%" r="85%">
                        <stop offset="0%" stopColor="#E7C873" />
                        <stop offset="55%" stopColor="#B8892A" />
                        <stop offset="100%" stopColor="#7E5B14" />
                      </radialGradient>
                    </defs>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#mg1)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#7E5B14" strokeOpacity=".5" strokeWidth="2.5" />
                    <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                    <text x="50" y="59.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="26" fill="#FFFFFF">VIP</text>
                  </svg>
                </span>
              </div>
              <div className="mini rv mB" style={{ left: "15%", top: "50%", "--r": "7deg", animation: "miniIn 1.3s cubic-bezier(.2,.8,.2,1) 2.0s both, miniF 7s ease-in-out 3.3s infinite" }}>
                <span className="mp">
                  <span className="ml" style={{ width: "46%" }} />
                  <b>ملتقى الريادة</b>
                  <span className="ml" style={{ width: "70%" }} />
                  <span className="ml" style={{ width: "54%" }} />
                </span>
                <span className="ms">
                  <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                    <defs>
                      <radialGradient id="mg2" cx="34%" cy="26%" r="85%">
                        <stop offset="0%" stopColor="#3E6688" />
                        <stop offset="55%" stopColor="#0A2A43" />
                        <stop offset="100%" stopColor="#04121F" />
                      </radialGradient>
                    </defs>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#mg2)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#04121F" strokeOpacity=".5" strokeWidth="2.5" />
                    <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                    <text x="50" y="57.6" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="21" fill="#FFFFFF">متحدث</text>
                  </svg>
                </span>
              </div>
              <div className="mini rv mA" style={{ right: "2%", top: "6%", "--r": "10deg", animation: "miniIn 1.3s cubic-bezier(.2,.8,.2,1) 1.85s both, miniF 7s ease-in-out 3.2s infinite" }}>
                <span className="mp">
                  <span className="ml" style={{ width: "46%" }} />
                  <b>أمسية شعرية</b>
                  <span className="ml" style={{ width: "70%" }} />
                  <span className="ml" style={{ width: "54%" }} />
                </span>
                <span className="ms">
                  <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                    <defs>
                      <radialGradient id="mg3" cx="34%" cy="26%" r="85%">
                        <stop offset="0%" stopColor="#6E95C4" />
                        <stop offset="55%" stopColor="#2D5A8C" />
                        <stop offset="100%" stopColor="#1A3A60" />
                      </radialGradient>
                    </defs>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#mg3)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#1A3A60" strokeOpacity=".5" strokeWidth="2.5" />
                    <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                    <text x="50" y="59.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="26" fill="#FFFFFF">ضيف</text>
                  </svg>
                </span>
              </div>
              <div className="mini rv mB" style={{ right: "15%", top: "52%", "--r": "-6deg", animation: "miniIn 1.3s cubic-bezier(.2,.8,.2,1) 2.15s both, miniF 7s ease-in-out 3.5s infinite" }}>
                <span className="mp">
                  <span className="ml" style={{ width: "46%" }} />
                  <b>يوم المهنة</b>
                  <span className="ml" style={{ width: "70%" }} />
                  <span className="ml" style={{ width: "54%" }} />
                </span>
                <span className="ms">
                  <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                    <defs>
                      <radialGradient id="mg4" cx="34%" cy="26%" r="85%">
                        <stop offset="0%" stopColor="#B07592" />
                        <stop offset="55%" stopColor="#7A3E5B" />
                        <stop offset="100%" stopColor="#52253C" />
                      </radialGradient>
                    </defs>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#mg4)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#52253C" strokeOpacity=".5" strokeWidth="2.5" />
                    <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                    <text x="50" y="58.6" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="24" fill="#FFFFFF">راعي</text>
                  </svg>
                </span>
              </div>
              {" "}
              <div className="envw rv" style={{ animation: "envIn 1s cubic-bezier(.2,.8,.2,1) .2s both, bob 6s ease-in-out 4.2s infinite" }}>
                {" "}
                <span aria-hidden="true" className="rv" style={{ position: "absolute", left: "50%", top: "55%", width: "260%", aspectRatio: "1", margin: "-130% 0 0 -130%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.32), rgba(134,220,234,0))", animation: "bloom 2.6s ease-out .6s both", pointerEvents: "none" }} />
                {" "}
                <span className="eback" />
                {" "}
                <span className="eflap rv" style={{ animation: "flapO 1s cubic-bezier(.5,0,.3,1) 1s both" }} />
                {" "}
                <div className="epaper rv" style={{ animation: "paperO 1.5s cubic-bezier(.2,.8,.2,1) 1.6s both" }}>
                  {" "}
                  <span className="pk">حيّــاك</span>
                  <b className="pt">دعوة</b>
                  <span className="pn">ضيفنا العزيز</span>
                  <span className="ml" style={{ width: "62%", margin: "0 auto" }} />
                  <span className="ml" style={{ width: "44%", margin: "0 auto" }} />
                  {" "}
                  <span aria-hidden="true" className="rv" style={{ position: "absolute", top: "-30%", left: "30%", width: "26%", height: "160%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.95), rgba(255,255,255,0))", animation: "litSweep 1.6s ease-in-out 3.6s both" }} />
                  {" "}
                  <span aria-hidden="true" className="rv eink" style={{ animation: "inkB 1.2s ease-out 3.15s both" }} />
                  {" "}
                  <svg className="rv eseal" viewBox="0 0 100 100" aria-hidden="true" style={{ animation: "pressS 1.1s cubic-bezier(.3,.7,.2,1) 2.6s both" }}>
                    <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                    <path d={v.wax} fill="url(#lcT)" filter="url(#lcSh)" />
                    <circle cx="50" cy="50" r="31" fill="none" stroke="#05505E" strokeOpacity="0.45" strokeWidth="2.5" />
                    <circle cx="50" cy="50.8" r="31" fill="none" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.2" />
                    <ellipse cx="36" cy="28" rx="15" ry="7" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity="0.3" />
                    <text x="50" y="59.2" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="40" fill="#05505E" fillOpacity="0.7">{"ح"}</text>
                    <text x="50" y="58" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="40" fill="#FFFFFF">{"ح"}</text>
                  </svg>
                  {" "}
                </div>
                {" "}
                <span className="efront" />
                {" "}
              </div>
              {" "}
            </div>
          </div>
          {" "}
        </section>
        {" "}
        <section id="features" className="pad fblend" style={{ position: "relative", overflow: "hidden", padding: "440px 64px 360px", background: "radial-gradient(40% 900px at 85% 1000px, rgba(134,220,234,.4), rgba(134,220,234,0) 70%), radial-gradient(40% 25% at 5% 55%, rgba(14,151,174,.16), rgba(14,151,174,0) 70%), linear-gradient(180deg, #0B3550 0px, #0B3550 110px, #103B57 160px, #1E4A65 215px, #366178 280px, #557D91 360px, #7C9EAE 480px, #A5BFCA 570px, #CBDAE1 630px, #E4ECF0 680px, #F3F6F8 730px, #FAFBFC 40%, #F3F6F8 calc(100% - 526px), #E2EAEE calc(100% - 482px), #C6D6DD calc(100% - 431px), #9DB8C4 calc(100% - 375px), #7395A6 calc(100% - 319px), #4D7488 calc(100% - 263px), #2F5A71 calc(100% - 207px), #1A4862 calc(100% - 146px), #0F3F5B calc(100% - 78px), #0A3A55 100%)", color: "#0A2A43", display: "flex", flexDirection: "column", gap: "130px" }}>
          <div className="mqw" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "40px", width: "100%" }}>
            <div className="mqr m1">
              <div className="mqt">
                <span className="mq"><i />حفلة تخرّج</span>
                <span className="mq"><i />ملتقى</span>
                <span className="mq"><i />أمسية شعرية</span>
                <span className="mq"><i />مؤتمر</span>
                <span className="mq"><i />حفل تكريم</span>
                <span className="mq"><i />يوم المهنة</span>
                <span className="mq"><i />ورشة عمل</span>
                <span className="mq"><i />افتتاح</span>
                <span className="mq"><i />حفلة تخرّج</span>
                <span className="mq"><i />ملتقى</span>
                <span className="mq"><i />أمسية شعرية</span>
                <span className="mq"><i />مؤتمر</span>
                <span className="mq"><i />حفل تكريم</span>
                <span className="mq"><i />يوم المهنة</span>
                <span className="mq"><i />ورشة عمل</span>
                <span className="mq"><i />افتتاح</span>
              </div>
            </div>
            <div className="mqr m2">
              <div className="mqt">
                <span className="mq"><i />لقاء الشركاء</span>
                <span className="mq"><i />معرض</span>
                <span className="mq"><i />حفل ختامي</span>
                <span className="mq"><i />ندوة</span>
                <span className="mq"><i />هاكاثون</span>
                <span className="mq"><i />حفل استقبال</span>
                <span className="mq"><i />مسابقة</span>
                <span className="mq"><i />يوم مفتوح</span>
                <span className="mq"><i />لقاء الشركاء</span>
                <span className="mq"><i />معرض</span>
                <span className="mq"><i />حفل ختامي</span>
                <span className="mq"><i />ندوة</span>
                <span className="mq"><i />هاكاثون</span>
                <span className="mq"><i />حفل استقبال</span>
                <span className="mq"><i />مسابقة</span>
                <span className="mq"><i />يوم مفتوح</span>
              </div>
            </div>
          </div>
          <span aria-hidden="true" className="drift" style={{ left: "-8%", top: "20%", width: "700px", height: "700px", background: "radial-gradient(closest-side, rgba(134,220,234,.4), rgba(134,220,234,0))" }} />
          <span aria-hidden="true" className="drift" style={{ right: "-10%", top: "55%", width: "760px", height: "760px", background: "radial-gradient(closest-side, rgba(14,151,174,.16), rgba(14,151,174,0))", animationDuration: "28s", animationDirection: "reverse" }} />
          <div data-rv="1" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", textAlign: "center" }}>
            <h2 className="h2m fit" style={{ margin: "0", fontFamily: "TD, TDx, serif", "--fs": "min(76px, 6.1vw)", fontSize: "var(--fs)", whiteSpace: "nowrap", lineHeight: "1.3", color: "#0A2A43" }}>
              <span className="rv w2" style={{ animationDelay: "0.30s" }}>كل</span>
              {" "}
              <span className="rv w2" style={{ animationDelay: "0.42s" }}>اللي</span>
              {" "}
              <span className="rv w2" style={{ animationDelay: "0.54s" }}>تحتاجه</span>
              {" "}
              <span className="rv w2" style={{ animationDelay: "0.66s" }}>دعوتك</span>
              {" "}
              <span className="hlw hlww">
                <span className="rv w2" style={{ animationDelay: "0.78s" }}>في</span>
                {" "}
                <span className="rv w2" style={{ animationDelay: "0.90s" }}>مكان</span>
                {" "}
                <span className="rv w2" style={{ animationDelay: "1.02s" }}>واحد</span>
              </span>
            </h2>
          </div>
          <div data-rv="1" className="frow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: "70px", alignItems: "center" }}>
            <div className="rv" style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: "18px", animation: "up .9s cubic-bezier(.2,.7,.2,1) .1s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "20px" }}>{"1"}</span>
              </span>
              <h3 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "56px", fontWeight: "700", lineHeight: "1.25", color: "#0A2A43" }}>من ملف واحد دعوة لكل ضيف</h3>
              <p style={{ margin: "0", fontSize: "23px", lineHeight: "1.85", color: "#3A4B58", maxWidth: "520px" }}>ارفع قائمة ضيوفك مرة وحدة، ونجهّز لكل واحد دعوته باسمه وبالختم اللي يناسبه</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />Excel أو CSV</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />اسم كل ضيف</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />ختم لكل فئة</span>
              </div>
              <button type="button" onClick={v.dlTpl} className="tplb">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D6F42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                حمّل قالب الأسماء وجهّزه من الحين
              </button>
            </div>
            <div className="rv" style={{ direction: "rtl", position: "relative", animation: "up 1s cubic-bezier(.2,.7,.2,1) .3s both" }}>
              <div className="vis">
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", inset: "8% 6%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.55), rgba(134,220,234,0))", filter: "blur(10px)" }} />
                {" "}
                <div className="v1g" style={{ position: "relative", background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 30px 70px rgba(10,42,67,.12), 0 2px 6px rgba(10,42,67,.05)", border: "1px solid #E3EAEE", padding: "24px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 40px minmax(0,.9fr)", gap: "12px", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "500", color: "#0A2A43", paddingBottom: "6px" }}>
                      <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#1D6F42", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>{"X"}</span>
                      المدعوين.xlsx
                    </span>
                    <span style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr .7fr", gap: "6px", fontSize: "13px", color: "#4A5B68", padding: "0 8px" }}><span>الاسم</span><span>الجوال</span><span>الختم</span></span>
                    {(v.xr || []).map((r, $i2) => (
                      <span key={r?.key ?? $i2} style={S(`${txt(r?.st)}`)}>
                          <span>{r?.n}</span>
                          <span style={{ direction: "ltr", textAlign: "right", color: "#4A5B68" }}>{r?.p}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={S(`width: 8px; height: 8px; border-radius: 50%; background: ${txt(r?.c)};`)} />{r?.s}</span>
                        </span>
                    ))}
                  </div>
                  <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
                    <path d="M38 12 H6 M14 4 L4 12 L14 20" fill="none" stroke="#0E97AE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ position: "relative", height: "250px" }}>
                    {(v.xc || []).map((c, $i3) => (
                      <div key={c?.key ?? $i3} style={S(`${txt(c?.st)}`)}>
                          <span style={{ fontSize: "9px", color: "#4A5B68" }}>نتشرّف بدعوة</span>
                          <b style={{ fontFamily: "TD, TDx, serif", fontSize: "18px", fontWeight: "700", color: "#0A2A43" }}>{c?.n}</b>
                          <span style={{ height: "4px", width: "60%", borderRadius: "3px", background: "#DCE4E8" }} />
                          <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true" style={{ position: "absolute", left: "-12px", bottom: "-12px" }}>
                            <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                            <path d={v.wax} fill={c?.c} />
                            <text x="50" y="59" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize={c?.fs} fill="#FFFFFF">{c?.s}</text>
                          </svg>
                        </div>
                    ))}
                  </div>
                </div>
                {" "}
              </div>
            </div>
          </div>
          <div data-rv="1" className="frow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: "70px", alignItems: "center", direction: "ltr" }}>
            <div className="rv" style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: "18px", animation: "up .9s cubic-bezier(.2,.7,.2,1) .1s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "20px" }}>{"2"}</span>
              </span>
              <h3 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "56px", fontWeight: "700", lineHeight: "1.25", color: "#0A2A43" }}>ترسلها بالطريقة اللي تناسبك</h3>
              <p style={{ margin: "0", fontSize: "23px", lineHeight: "1.85", color: "#3A4B58", maxWidth: "520px" }}>رابط خاص لكل ضيف ترسله من أي تطبيق تبيه، أو خلّ حيّــاك ترسلها عنك بالواتساب أو الإيميل</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />رابط لكل ضيف</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />من أي تطبيق</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />أو حيّــاك ترسلها</span>
              </div>
            </div>
            <div className="rv" style={{ direction: "rtl", position: "relative", animation: "up 1s cubic-bezier(.2,.7,.2,1) .3s both" }}>
              <div className="vis">
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", inset: "8% 6%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.55), rgba(134,220,234,0))", filter: "blur(10px)" }} />
                {" "}
                <div className="sbox">
                  {" "}
                  <div className="sw">
                    <span className="swk" />
                    <span className="swa">أرسلها بنفسك</span>
                    <span className="swb">حيّــاك ترسلها عنك</span>
                  </div>
                  {" "}
                  <div className="spane sA">
                    {" "}
                    <span className="slb">رسالتك جاهزة، وتقدر تعدّلها</span>
                    {" "}
                    <div className="smsg">
                      <span>حيّاك يا سارة 🌿</span>
                      <span>يسعدنا حضورك «الحفل الختامي»، وهذي دعوتك باسمك:</span>
                      <span className="slink">hayyak.sa/i/kx72</span>
                      <span className="scaret" />
                    </div>
                    {" "}
                    <span className="scopy">
                      <span className="sc1">انسخ الرسالة مع الرابط</span>
                      <span className="sc2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        {" تم النسخ"}
                      </span>
                    </span>
                    {" "}
                    <span className="sapps">
                      <span style={{ fontSize: "15px", color: "#4A5B68" }}>والصقها في أي تطبيق تبيه</span>
                      <span style={{ display: "flex", gap: "10px" }}>
                        <span className="sapp" style={{ animationDelay: "2.20s" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
                        </span>
                        <span className="sapp" style={{ animationDelay: "2.38s" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l9 6 9-6" /></svg>
                        </span>
                        <span className="sapp" style={{ animationDelay: "2.56s" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 8a3 3 0 1 0-3-3M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                          </svg>
                        </span>
                        <span className="sapp" style={{ animationDelay: "2.74s" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2" /></svg>
                        </span>
                      </span>
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div className="spane sB">
                    {" "}
                    <span className="slb">طلب إرسال · الحفل الختامي</span>
                    {" "}
                    <div className="srows">
                      {" "}
                      <span className="srow" style={{ animationDelay: ".2s" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        <b>120 مدعو</b>
                        <span>الأسماء مرفوعة</span>
                      </span>
                      {" "}
                      <span className="srow" style={{ animationDelay: ".45s" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        <b>واتساب وإيميل</b>
                        <span>باسمك</span>
                      </span>
                      {" "}
                      <span className="srow" style={{ animationDelay: ".7s" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E97AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        <b>قبل المناسبة بـ 48 ساعة</b>
                        <span>الطلب مأكّد</span>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <div className="sprog">
                      <span className="sbar"><i /></span>
                      <span className="sdone"><span className="sd1">جاري الإرسال…</span><span className="sd2">أُرسلت لكل الضيوف ✓</span></span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
            </div>
          </div>
          <div data-rv="1" className="frow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: "70px", alignItems: "center" }}>
            <div className="rv" style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: "18px", animation: "up .9s cubic-bezier(.2,.7,.2,1) .1s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "20px" }}>{"3"}</span>
              </span>
              <h3 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "56px", fontWeight: "700", lineHeight: "1.25", color: "#0A2A43" }}>ردّه يوصلك في لحظته</h3>
              <p style={{ margin: "0", fontSize: "23px", lineHeight: "1.85", color: "#3A4B58", maxWidth: "520px" }}>ضيفك يأكّد بلمسة، وأنت تشوف أول بأول مين أكّد ومين اعتذر ومين باقي</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />تحديث مباشر</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />حمّل قائمة الحضور</span>
              </div>
            </div>
            <div className="rv" style={{ direction: "rtl", position: "relative", animation: "up 1s cubic-bezier(.2,.7,.2,1) .3s both" }}>
              <div className="vis">
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", inset: "8% 6%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.55), rgba(134,220,234,0))", filter: "blur(10px)" }} />
                {" "}
                <div style={{ position: "relative", background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 30px 70px rgba(10,42,67,.12), 0 2px 6px rgba(10,42,67,.05)", border: "1px solid #E3EAEE", padding: "26px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "16px", color: "#4A5B68" }}>الحفل الختامي · الردود</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#086577" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0E97AE", animation: "breathe 1.6s ease-in-out infinite" }} />
                      مباشر
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <b className="cnt" style={{ fontFamily: "TD, TDx, serif", fontSize: "72px", lineHeight: "1", color: "#0E97AE" }} />
                    <span style={{ fontSize: "18px", color: "#0A2A43" }}>أكّدوا حضورهم</span>
                    <span style={{ fontSize: "16px", color: "#4A5B68", marginRight: "auto" }}>من 120</span>
                  </span>
                  <span className="seats" aria-label="74 أكّدوا، 15 اعتذروا، 31 ما ردّوا من 120">
                    <i className="rv sc" style={{ animationDelay: "0.54s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.61s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.19s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.41s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.80s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.68s" }} />
                    <i className="rv sn" style={{ animationDelay: "3.00s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.80s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.94s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.84s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.39s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.88s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.73s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.46s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.86s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.77s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.80s" }} />
                    <i className="rv sd" style={{ animationDelay: "0.87s" }} />
                    <i className="rv sd" style={{ animationDelay: "2.14s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.97s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.13s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.62s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.00s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.47s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.40s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.84s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.25s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.94s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.76s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.12s" }} />
                    <i className="rv sn" style={{ animationDelay: "3.00s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.62s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.52s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.77s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.38s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.20s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.69s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.92s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.53s" }} />
                    <i className="rv sd" style={{ animationDelay: "2.51s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.75s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.80s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.02s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.87s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.88s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.37s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.72s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.41s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.09s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.11s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.70s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.51s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.40s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.84s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.76s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.76s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.71s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.62s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.63s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.33s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.07s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.49s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.85s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.30s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.92s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.48s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.51s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.30s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.84s" }} />
                    <i className="rv sd" style={{ animationDelay: "2.44s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.85s" }} />
                    <i className="rv sd" style={{ animationDelay: "2.31s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.82s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.66s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.99s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.60s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.90s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.86s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.56s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.90s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.93s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.07s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.45s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.88s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.60s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.37s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.95s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.70s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.39s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.26s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.73s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.15s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.94s" }} />
                    <i className="rv sd" style={{ animationDelay: "2.43s" }} />
                    <i className="rv sd" style={{ animationDelay: "2.01s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.00s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.89s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.20s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.07s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.97s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.19s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.26s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.27s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.75s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.92s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.80s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.94s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.85s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.94s" }} />
                    <i className="rv sn" style={{ animationDelay: "2.88s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.16s" }} />
                    <i className="rv sc" style={{ animationDelay: "2.38s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.37s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.52s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.36s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.38s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.80s" }} />
                    <i className="rv sd" style={{ animationDelay: "1.12s" }} />
                    <i className="rv sc" style={{ animationDelay: "1.95s" }} />
                    <i className="rv sc" style={{ animationDelay: "0.56s" }} />
                  </span>
                  <span style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#4A5B68" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#0E97AE" }} />أكّد · 74</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#B8C4CC" }} />اعتذر · 15</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E7C873" }} />ما ردّ · 31</span>
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(v.rep || []).map((t, $i4) => (
                      <div key={t?.key ?? $i4} style={S(`${txt(t?.st)}`)}>
                          <span style={S(`width: 34px; height: 34px; border-radius: 50%; background: ${txt(t?.c)}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: TD, TDx, serif; font-size: 16px; flex-shrink: 0;`)}>{t?.i}</span>
                          <b style={{ flex: "1", fontSize: "16px", fontWeight: "500", color: "#0A2A43" }}>{t?.n}</b>
                          <span style={S(`${txt(t?.bs)}`)}>{t?.m}</span>
                          <span style={{ fontSize: "13px", color: "#8FA0AC", width: "54px", textAlign: "left" }}>{t?.w}</span>
                        </div>
                    ))}
                  </div>
                </div>
                {" "}
              </div>
            </div>
          </div>
          <div data-rv="1" className="frow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: "70px", alignItems: "center", direction: "ltr" }}>
            <div className="rv" style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: "18px", animation: "up .9s cubic-bezier(.2,.7,.2,1) .1s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "20px" }}>{"4"}</span>
              </span>
              <h3 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "56px", fontWeight: "700", lineHeight: "1.25", color: "#0A2A43" }}>تذكير في وقته</h3>
              <p style={{ margin: "0", fontSize: "23px", lineHeight: "1.85", color: "#3A4B58", maxWidth: "520px" }}>قبل ما ترسل تختار: حيّــاك تذكّر ضيوفك، أو ننبّهك وقت التذكير وترسله أنت برسالة جاهزة</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />قبل بيوم</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />قبل 3 ساعات</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />
                  أنت تختار مين يذكّر
                </span>
              </div>
            </div>
            <div className="rv" style={{ direction: "rtl", position: "relative", animation: "up 1s cubic-bezier(.2,.7,.2,1) .3s both" }}>
              <div className="vis">
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", inset: "8% 6%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.55), rgba(134,220,234,0))", filter: "blur(10px)" }} />
                {" "}
                <div style={{ position: "relative", background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 30px 70px rgba(10,42,67,.12), 0 2px 6px rgba(10,42,67,.05)", border: "1px solid #E3EAEE", padding: "28px 30px", display: "flex", flexDirection: "column", gap: "0" }}>
                  <span style={{ fontSize: "16px", color: "#4A5B68", paddingBottom: "14px" }}>التذكير · حيّــاك تذكّرهم</span>
                  {(v.tl || []).map((t, $i5) => (
                    <div key={t?.key ?? $i5} style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>
                        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "40px" }}>
                          <span style={S(`${txt(t?.dot)}`)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t?.ic2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={t?.ic} /></svg>
                          </span>
                          <span style={S(`${txt(t?.line)}`)} />
                        </span>
                        <span style={{ flex: "1", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", padding: "8px 0 22px" }}>
                          <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <b style={{ fontSize: "18px", color: "#0A2A43" }}>{t?.t}</b>
                            <span style={{ fontSize: "15px", color: "#4A5B68" }}>{t?.d}</span>
                          </span>
                          <span style={S(`${txt(t?.bs)}`)}>{t?.b}</span>
                        </span>
                      </div>
                  ))}
                </div>
                {" "}
              </div>
            </div>
          </div>
          <div data-rv="1" className="frow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: "70px", alignItems: "center" }}>
            <div className="rv" style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: "18px", animation: "up .9s cubic-bezier(.2,.7,.2,1) .1s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "20px" }}>{"5"}</span>
              </span>
              <h3 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "56px", fontWeight: "700", lineHeight: "1.25", color: "#0A2A43" }}>عدّل متى ما احتجت</h3>
              <p style={{ margin: "0", fontSize: "23px", lineHeight: "1.85", color: "#3A4B58", maxWidth: "520px" }}>لو تغيّر الموعد أو المكان عدّله مرة وحدة، ويوصل التحديث لكل ضيوفك على نفس الرابط</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />بدون إعادة إرسال</span>
              </div>
            </div>
            <div className="rv" style={{ direction: "rtl", position: "relative", animation: "up 1s cubic-bezier(.2,.7,.2,1) .3s both" }}>
              <div className="vis">
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", inset: "8% 6%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.55), rgba(134,220,234,0))", filter: "blur(10px)" }} />
                {" "}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "18px", alignItems: "center" }}>
                  <div style={{ width: "100%", maxWidth: "440px", background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 30px 70px rgba(10,42,67,.12), 0 2px 6px rgba(10,42,67,.05)", border: "1px solid #E3EAEE", padding: "26px 28px", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box" }}>
                    <span style={{ fontSize: "15px", color: "#4A5B68" }}>تعديل الدعوة · الحفل الختامي</span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "14px", color: "#4A5B68" }}>التاريخ</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", height: "52px", padding: "0 16px", borderRadius: "14px", border: "2px solid #0E97AE", fontSize: "18px", color: "#0A2A43" }}>
                        <span style={{ position: "relative", color: "#8FA0AC" }}>
                          الأربعاء 21
                          <span className="rv" style={{ position: "absolute", left: "-2px", right: "-2px", top: "52%", height: "2px", background: "#C9733A", transformOrigin: "100% 50%", animation: "fillBar .5s ease-out .8s both" }} />
                        </span>
                        <b className="rv" style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", color: "#0A2A43", animation: "typeIn .9s steps(9) 1.4s both" }}>الخميس 22</b>
                      </span>
                    </span>
                    <span style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ height: "40px", padding: "0 18px", borderRadius: "999px", background: "#0A2A43", color: "#FFFFFF", fontSize: "15px", fontWeight: "500", display: "inline-flex", alignItems: "center" }}>حفظ التعديل</span>
                    </span>
                  </div>
                  <span className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 22px", borderRadius: "999px", background: "#0E97AE", color: "#FFFFFF", fontSize: "18px", fontWeight: "500", boxShadow: "0 20px 40px rgba(14,151,174,.35)", animation: "up .7s cubic-bezier(.2,.7,.2,1) 2.4s both" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    تحدّث عند 120 ضيف على نفس الرابط
                  </span>
                </div>
                {" "}
              </div>
            </div>
          </div>
          <div data-rv="1" className="frow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: "70px", alignItems: "center", direction: "ltr" }}>
            <div className="rv" style={{ direction: "rtl", display: "flex", flexDirection: "column", gap: "18px", animation: "up .9s cubic-bezier(.2,.7,.2,1) .1s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A2A43", color: "#86DCEA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TD, TDx, serif", fontSize: "20px" }}>{"6"}</span>
              </span>
              <h3 style={{ margin: "0", fontFamily: "TD, TDx, serif", fontSize: "56px", fontWeight: "700", lineHeight: "1.25", color: "#0A2A43" }}>تبقى معه بعد ما يفتحها</h3>
              <p style={{ margin: "0", fontSize: "23px", lineHeight: "1.85", color: "#3A4B58", maxWidth: "520px" }}>يضيف الموعد لتقويمه، ويوصل للمكان بلمسة، ويحفظها بحركتها يرجع لها وقت ما يبي</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />تقويم</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />خريطة</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "42px", padding: "0 18px", borderRadius: "999px", background: "#E6F6F9", color: "#086577", fontSize: "18px", fontWeight: "500" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0E97AE" }} />حفظ بحركتها</span>
              </div>
            </div>
            <div className="rv" style={{ direction: "rtl", position: "relative", animation: "up 1s cubic-bezier(.2,.7,.2,1) .3s both" }}>
              <div className="vis">
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", inset: "8% 6%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(134,220,234,.55), rgba(134,220,234,0))", filter: "blur(10px)" }} />
                {" "}
                <div className="vpg" style={{ position: "relative", display: "grid", gridTemplateColumns: "220px minmax(0,1fr)", gap: "22px", alignItems: "center" }}>
                  <div style={{ position: "relative", width: "220px", height: "476px", borderRadius: "40px", background: "radial-gradient(120% 70% at 70% 0%, #123E5C, #0A2A43 55%, #04121F)", boxShadow: "0 0 0 8px #0A2A43, 0 40px 80px rgba(10,42,67,.25)", overflow: "hidden" }}>
                    {" "}
                    <span style={{ position: "absolute", left: "50%", top: "12px", width: "80px", height: "22px", marginLeft: "-40px", borderRadius: "14px", background: "#020609" }} />
                    {" "}
                    <div className="rv" style={{ position: "absolute", left: "0", right: "0", bottom: "0", borderRadius: "24px 24px 0 0", background: "#FAFBFC", padding: "18px 14px 20px", display: "flex", flexDirection: "column", gap: "10px", animation: "sheetUp .6s cubic-bezier(.2,.8,.2,1) .4s both" }}>
                      <b style={{ fontSize: "16px", color: "#0A2A43" }}>خلّ الدعوة معك</b>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "14px", border: "2px solid #0E97AE", background: "#E6F6F9" }}>
                        <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#0E97AE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                        </span>
                        <b style={{ fontSize: "14px", color: "#0A2A43" }}>أضف لتقويمك</b>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "14px", border: "1px solid #DCE4E8" }}>
                        <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A2A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                        </span>
                        <b style={{ fontSize: "14px", color: "#0A2A43" }}>افتح الموقع</b>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "14px", border: "1px solid #DCE4E8" }}>
                        <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#EDF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#0A2A43" /></svg>
                        </span>
                        <b style={{ fontSize: "14px", color: "#0A2A43" }}>احفظها بحركتها</b>
                      </span>
                    </div>
                    {" "}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="rv" style={{ background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 30px 70px rgba(10,42,67,.12), 0 2px 6px rgba(10,42,67,.05)", border: "1px solid #E3EAEE", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", animation: "toastIn .6s ease-out 1.2s both" }}>
                      <span style={{ width: "50px", height: "54px", borderRadius: "12px", background: "#FAFBFC", border: "1px solid #DCE4E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: "1.15" }}>
                        <span style={{ fontSize: "12px", color: "#C9733A" }}>أكتوبر</span>
                        <b style={{ fontSize: "20px", color: "#0A2A43" }}>29</b>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <b style={{ fontSize: "17px", color: "#0A2A43" }}>أُضيفت لتقويمه</b>
                        <span style={{ fontSize: "14px", color: "#4A5B68" }}>مع تذكير قبل بيوم</span>
                      </span>
                    </div>
                    <div className="rv" style={{ background: "#FFFFFF", borderRadius: "28px", boxShadow: "0 30px 70px rgba(10,42,67,.12), 0 2px 6px rgba(10,42,67,.05)", border: "1px solid #E3EAEE", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", animation: "toastIn .6s ease-out 1.8s both" }}>
                      <span style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#E6F6F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#086577" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <b style={{ fontSize: "17px", color: "#0A2A43" }}>الموقع بضغطة</b>
                        <span style={{ fontSize: "14px", color: "#4A5B68" }}>يفتح الخريطة على مكان الفعالية</span>
                      </span>
                    </div>
                  </div>
                </div>
                {" "}
              </div>
            </div>
          </div>
          <div className="rib" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "40px" }}>
            <div className="ribt">
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #123E5C, #04121F)", color: "#86DCEA" }}>
                <span className="rbt">لمّة نجوم</span>
                <span className="rbl" style={{ background: "#86DCEA" }} />
                <span className="rbl" style={{ width: "40%", background: "#86DCEA" }} />
                <span className="rbs" style={{ background: "#0E97AE" }}>مدعو</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #FFFFFF, #CFE7EE)", color: "#0A2A43" }}>
                <span className="rbt">لمعة لؤلؤ</span>
                <span className="rbl" style={{ background: "#0A2A43" }} />
                <span className="rbl" style={{ width: "40%", background: "#0A2A43" }} />
                <span className="rbs" style={{ background: "#B8892A" }}>VIP</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #1B2A55, #060A1C)", color: "#9FB8FF" }}>
                <span className="rbt">من القلب</span>
                <span className="rbl" style={{ background: "#9FB8FF" }} />
                <span className="rbl" style={{ width: "40%", background: "#9FB8FF" }} />
                <span className="rbs" style={{ background: "#0A2A43" }}>متحدث</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #12A3BA, #071D30)", color: "#FFD166" }}>
                <span className="rbt">ألعاب نارية</span>
                <span className="rbl" style={{ background: "#FFD166" }} />
                <span className="rbl" style={{ width: "40%", background: "#FFD166" }} />
                <span className="rbs" style={{ background: "#2D5A8C" }}>ضيف</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #FFF4F0, #F1D9CF)", color: "#7A3E5B" }}>
                <span className="rbt">رشّة فرح</span>
                <span className="rbl" style={{ background: "#7A3E5B" }} />
                <span className="rbl" style={{ width: "40%", background: "#7A3E5B" }} />
                <span className="rbs" style={{ background: "#7A3E5B" }}>راعي</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #5C1A22, #1E070D)", color: "#E7C873" }}>
                <span className="rbt">انفتح الستار</span>
                <span className="rbl" style={{ background: "#E7C873" }} />
                <span className="rbl" style={{ width: "40%", background: "#E7C873" }} />
                <span className="rbs" style={{ background: "#B8892A" }}>VIP</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #26262C, #000000)", color: "#FFFFFF" }}>
                <span className="rbt">مرّ شهاب</span>
                <span className="rbl" style={{ background: "#FFFFFF" }} />
                <span className="rbl" style={{ width: "40%", background: "#FFFFFF" }} />
                <span className="rbs" style={{ background: "#3F7F6A" }}>عضو</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #5A3A8A, #1E0F33)", color: "#E0C8FF" }}>
                <span className="rbt">ضوء يلحقك</span>
                <span className="rbl" style={{ background: "#E0C8FF" }} />
                <span className="rbl" style={{ width: "40%", background: "#E0C8FF" }} />
                <span className="rbs" style={{ background: "#4A4682" }}>شريك</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #4A2418, #120806)", color: "#E7C873" }}>
                <span className="rbt">سدو ينتسج</span>
                <span className="rbl" style={{ background: "#E7C873" }} />
                <span className="rbl" style={{ width: "40%", background: "#E7C873" }} />
                <span className="rbs" style={{ background: "#8C2F39" }}>تحكيم</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #123E5C, #04121F)", color: "#86DCEA" }}>
                <span className="rbt">لمّة نجوم</span>
                <span className="rbl" style={{ background: "#86DCEA" }} />
                <span className="rbl" style={{ width: "40%", background: "#86DCEA" }} />
                <span className="rbs" style={{ background: "#0E97AE" }}>مدعو</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #FFFFFF, #CFE7EE)", color: "#0A2A43" }}>
                <span className="rbt">لمعة لؤلؤ</span>
                <span className="rbl" style={{ background: "#0A2A43" }} />
                <span className="rbl" style={{ width: "40%", background: "#0A2A43" }} />
                <span className="rbs" style={{ background: "#B8892A" }}>VIP</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #1B2A55, #060A1C)", color: "#9FB8FF" }}>
                <span className="rbt">من القلب</span>
                <span className="rbl" style={{ background: "#9FB8FF" }} />
                <span className="rbl" style={{ width: "40%", background: "#9FB8FF" }} />
                <span className="rbs" style={{ background: "#0A2A43" }}>متحدث</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #12A3BA, #071D30)", color: "#FFD166" }}>
                <span className="rbt">ألعاب نارية</span>
                <span className="rbl" style={{ background: "#FFD166" }} />
                <span className="rbl" style={{ width: "40%", background: "#FFD166" }} />
                <span className="rbs" style={{ background: "#2D5A8C" }}>ضيف</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #FFF4F0, #F1D9CF)", color: "#7A3E5B" }}>
                <span className="rbt">رشّة فرح</span>
                <span className="rbl" style={{ background: "#7A3E5B" }} />
                <span className="rbl" style={{ width: "40%", background: "#7A3E5B" }} />
                <span className="rbs" style={{ background: "#7A3E5B" }}>راعي</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #5C1A22, #1E070D)", color: "#E7C873" }}>
                <span className="rbt">انفتح الستار</span>
                <span className="rbl" style={{ background: "#E7C873" }} />
                <span className="rbl" style={{ width: "40%", background: "#E7C873" }} />
                <span className="rbs" style={{ background: "#B8892A" }}>VIP</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #26262C, #000000)", color: "#FFFFFF" }}>
                <span className="rbt">مرّ شهاب</span>
                <span className="rbl" style={{ background: "#FFFFFF" }} />
                <span className="rbl" style={{ width: "40%", background: "#FFFFFF" }} />
                <span className="rbs" style={{ background: "#3F7F6A" }}>عضو</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #5A3A8A, #1E0F33)", color: "#E0C8FF" }}>
                <span className="rbt">ضوء يلحقك</span>
                <span className="rbl" style={{ background: "#E0C8FF" }} />
                <span className="rbl" style={{ width: "40%", background: "#E0C8FF" }} />
                <span className="rbs" style={{ background: "#4A4682" }}>شريك</span>
              </span>
              <span className="rbc" style={{ background: "radial-gradient(120% 80% at 70% 0%, #4A2418, #120806)", color: "#E7C873" }}>
                <span className="rbt">سدو ينتسج</span>
                <span className="rbl" style={{ background: "#E7C873" }} />
                <span className="rbl" style={{ width: "40%", background: "#E7C873" }} />
                <span className="rbs" style={{ background: "#8C2F39" }}>تحكيم</span>
              </span>
            </div>
          </div>
        </section>
        {" "}
        <section id="how" data-rv="1" className="pad" style={{ position: "relative", padding: "70px 64px 130px", background: "radial-gradient(45% 28% at 80% 36%, rgba(134,220,234,.16), rgba(134,220,234,0) 70%), radial-gradient(45% 26% at 15% 60%, rgba(14,151,174,.24), rgba(14,151,174,0) 70%), linear-gradient(180deg, #0A3A55, #082C44 45%, #082C44)", display: "flex", flexDirection: "column", gap: "64px", overflow: "hidden" }}>
          <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "300px", background: "linear-gradient(180deg, #0A3A55, rgba(10,58,85,0))", pointerEvents: "none" }} />
          <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "280px", background: "linear-gradient(0deg, #082C44, rgba(7,37,56,0))", pointerEvents: "none" }} />
          <span aria-hidden="true" className="drift" style={{ left: "-6%", top: "18%", width: "540px", height: "540px", background: "radial-gradient(closest-side, rgba(14,151,174,.35), rgba(14,151,174,0))" }} />
          <span aria-hidden="true" className="drift" style={{ right: "-6%", top: "22%", width: "560px", height: "560px", background: "radial-gradient(closest-side, rgba(134,220,234,.2), rgba(134,220,234,0))", animationDuration: "26s", animationDirection: "reverse" }} />
          <div className="rv" style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", textAlign: "center", animation: "up .9s ease-out .1s both" }}>
            <span className="kick">كيف تشتغل</span>
            <h2 className="h2m fit" style={{ margin: "0", fontFamily: "TD, TDx, serif", "--fs": "min(76px, 7.4vw)", fontSize: "var(--fs)", whiteSpace: "nowrap", color: "#FAFBFC" }}>
              <span className="rv w2" style={{ animationDelay: "0.30s" }}>ثلاث</span>
              {" "}
              <span className="rv w2" style={{ animationDelay: "0.42s" }}>خطوات</span>
              {" "}
              <span className="hlw" style={{ color: "#86DCEA" }}>
                <span className="rv w2" style={{ animationDelay: "0.54s" }}>وتجهز</span>
                {" "}
                <span className="rv w2" style={{ animationDelay: "0.66s" }}>دعوتك</span>
              </span>
            </h2>
          </div>
          <div className="stps" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 50px minmax(0,1fr) 50px minmax(0,1fr)", gap: "10px", alignItems: "center", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
            <div className="rv stp" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", padding: "30px 30px 34px", borderRadius: "34px", background: "linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.025))", boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), 0 40px 80px rgba(0,0,0,.3)", animation: "up 1s cubic-bezier(.2,.7,.2,1) 0.30s both" }}>
              <span style={{ position: "absolute", top: "22px", left: "26px", fontFamily: "TD, TDx, serif", fontSize: "64px", lineHeight: "1", color: "rgba(134,220,234,.28)" }}>01</span>
              <div style={{ position: "relative", height: "170px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ position: "absolute", width: "82px", height: "120px", borderRadius: "16px", background: "radial-gradient(120% 80% at 70% 0%,#123E5C,#04121F)", boxShadow: "0 16px 30px rgba(0,0,0,.35)", transform: "translateX(70px) rotate(10deg)", animation: "floatY 5s ease-in-out infinite" }} />
                <span style={{ position: "absolute", width: "82px", height: "120px", borderRadius: "16px", background: "radial-gradient(120% 80% at 70% 0%,#3A0F18,#0A0205)", boxShadow: "0 16px 30px rgba(0,0,0,.35)", transform: "translateX(-70px) rotate(-10deg)", animation: "floatY 5s ease-in-out .8s infinite" }} />
                <span style={{ position: "relative", width: "92px", height: "134px", borderRadius: "18px", background: "radial-gradient(120% 80% at 70% 0%,#FFFFFF,#EDF1F3 50%,#CFE7EE)", boxShadow: "0 20px 40px rgba(0,0,0,.4)", animation: "floatY 5s ease-in-out .4s infinite" }} />
                <svg width="54" height="54" viewBox="0 0 100 100" aria-hidden="true" style={{ position: "absolute", left: "calc(50% - 60px)", bottom: "10px", animation: "stampIn .9s cubic-bezier(.3,.7,.2,1) 1s both" }}>
                  <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                  <path d={v.wax} fill="#B8892A" />
                  <text x="50" y="60" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="26" fill="#FFFFFF">VIP</text>
                </svg>
              </div>
              <b style={{ fontFamily: "TD, TDx, serif", fontSize: "34px", fontWeight: "700", color: "#FAFBFC" }}>اختر التصميم</b>
              <span style={{ fontSize: "19px", lineHeight: "1.85", color: "#DCE4E8" }}>نمط من أنماطنا أو تصميمكم، وفعّل الحضور والشهادة إذا تبيها</span>
            </div>
            <span className="rv arr" aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", animation: "up .8s ease-out 0.55s both" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px rgba(134,220,234,.8))", animation: "nudgeX 1.6s ease-in-out infinite" }}><path d="M15 5l-7 7 7 7" /></svg>
            </span>
            <div className="rv stp" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", padding: "30px 30px 34px", borderRadius: "34px", background: "linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.025))", boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), 0 40px 80px rgba(0,0,0,.3)", animation: "up 1s cubic-bezier(.2,.7,.2,1) 0.55s both" }}>
              <span style={{ position: "absolute", top: "22px", left: "26px", fontFamily: "TD, TDx, serif", fontSize: "64px", lineHeight: "1", color: "rgba(134,220,234,.28)" }}>02</span>
              <div style={{ position: "relative", height: "170px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "210px", borderRadius: "16px", background: "#FAFBFC", padding: "10px", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 20px 40px rgba(0,0,0,.35)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#0A2A43", paddingBottom: "4px" }}>
                    <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#1D6F42", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>{"X"}</span>
                    المدعوين.xlsx
                  </span>
                  {(v.srows || []).map((r, $i6) => (
                    <span key={r?.key ?? $i6} style={S(`${txt(r?.st)}`)}>{r?.n}<span style={S(`width: 8px; height: 8px; border-radius: 50%; background: ${txt(r?.c)};`)} /></span>
                  ))}
                </div>
              </div>
              <b style={{ fontFamily: "TD, TDx, serif", fontSize: "34px", fontWeight: "700", color: "#FAFBFC" }}>أضف ضيوفك</b>
              <span style={{ fontSize: "19px", lineHeight: "1.85", color: "#DCE4E8" }}>ارفع ملف Excel واحد، وكل ضيف تطلع له دعوته باسمه</span>
            </div>
            <span className="rv arr" aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", animation: "up .8s ease-out 0.80s both" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px rgba(134,220,234,.8))", animation: "nudgeX 1.6s ease-in-out infinite" }}><path d="M15 5l-7 7 7 7" /></svg>
            </span>
            <div className="rv stp" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", padding: "30px 30px 34px", borderRadius: "34px", background: "linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.025))", boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), 0 40px 80px rgba(0,0,0,.3)", animation: "up 1s cubic-bezier(.2,.7,.2,1) 0.80s both" }}>
              <span style={{ position: "absolute", top: "22px", left: "26px", fontFamily: "TD, TDx, serif", fontSize: "64px", lineHeight: "1", color: "rgba(134,220,234,.28)" }}>03</span>
              <div style={{ position: "relative", height: "170px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "86px", height: "172px", borderRadius: "20px", background: "radial-gradient(120% 70% at 70% 0%,#123E5C,#0A2A43 55%,#04121F)", boxShadow: "0 0 0 4px #031420, 0 0 0 5px rgba(134,220,234,.3), 0 20px 40px rgba(0,0,0,.4)", overflow: "hidden" }}>
                  <span style={{ position: "absolute", left: "50%", top: "7px", width: "26px", height: "7px", marginLeft: "-13px", borderRadius: "999px", background: "#020609" }} />
                  <span style={{ position: "absolute", left: "9px", right: "9px", top: "26px", height: "78px", borderRadius: "12px", background: "#FAFBFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "999px", background: "#0E97AE", color: "#fff", fontFamily: "TD, TDx, serif", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>{"ح"}</span>
                    <span style={{ width: "44px", height: "5px", borderRadius: "999px", background: "#0A2A43" }} />
                    <span style={{ width: "30px", height: "4px", borderRadius: "999px", background: "#B8C6CE" }} />
                  </span>
                  <span style={{ position: "absolute", left: "9px", right: "9px", bottom: "14px", height: "28px", borderRadius: "999px", background: "#86DCEA", color: "#0A2A43", fontSize: "10.5px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", animation: "popB .6s cubic-bezier(.3,.7,.2,1) 1.4s both" }}>تم التأكيد ✓</span>
                </div>
                <span style={{ position: "absolute", left: "calc(50% + 40px)", top: "20px", padding: "8px 12px", borderRadius: "14px", background: "#FAFBFC", color: "#0A2A43", fontSize: "12px", fontWeight: "500", boxShadow: "0 10px 24px rgba(0,0,0,.3)", whiteSpace: "nowrap", animation: "up .6s ease-out 1.9s both" }}>74 أكّدوا</span>
              </div>
              <b style={{ fontFamily: "TD, TDx, serif", fontSize: "34px", fontWeight: "700", color: "#FAFBFC" }}>أرسل وتابع</b>
              <span style={{ fontSize: "19px", lineHeight: "1.85", color: "#DCE4E8" }}>أرسلها بالطريقة اللي تحبها، وتابع الردود والحضور أول بأول</span>
            </div>
          </div>
        </section>
        {" "}
        <section id="cert" data-rv="1" className="pad" style={{ position: "relative", padding: "90px 64px 60px", background: "radial-gradient(45% 28% at 20% 40%, rgba(134,220,234,.16), rgba(134,220,234,0) 70%), radial-gradient(45% 26% at 85% 62%, rgba(14,151,174,.26), rgba(14,151,174,0) 70%), linear-gradient(180deg, #082C44, #082C44)", display: "flex", flexDirection: "column", gap: "56px", overflow: "hidden" }}>
          <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "320px", background: "linear-gradient(180deg, #082C44, rgba(8,44,68,0))", pointerEvents: "none" }} />
          <div className="rv" style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", textAlign: "center", animation: "up .9s ease-out .1s both" }}>
            <span className="kick">بعد الدعوة</span>
            <h2 className="h2m fit" style={{ margin: "0", fontFamily: "TD, TDx, serif", "--fs": "min(72px, 7vw)", fontSize: "var(--fs)", whiteSpace: "nowrap", color: "#FAFBFC" }}>
              <span className="rv w2" style={{ animationDelay: "0.30s" }}>من</span>
              {" "}
              <span className="rv w2" style={{ animationDelay: "0.42s" }}>الحضور</span>
              {" "}
              <span className="hlw" style={{ color: "#86DCEA" }}><span className="rv w2" style={{ animationDelay: "0.54s" }}>للشهادة</span></span>
            </h2>
            <span style={{ fontSize: "min(22px, 4.4vw)", lineHeight: "1.8", color: "#DCE4E8", maxWidth: "760px" }}>بدون كشوف ورق ولا أحد عند الباب. الحضور يتسجّل بكود، والشهادات والتقارير تطلع لحالها</span>
          </div>
          <div className="cph rv" style={{ animation: "up 1s cubic-bezier(.2,.7,.2,1) .2s both" }}>
            {" "}
            <div className="cphone" aria-hidden="true">
              <div className="cview">
                <span className="cnotch" />
                <div className="cscr">
                  {" "}
                  <div className="msc m1">
                    <span className="ck">الملتقى العلمي</span>
                    <span className="ct">سجّل حضورك</span>
                    <span className="ccode"><i>{"4"}</i><i>{"8"}</i><i>{"2"}</i><i>{"7"}</i></span>
                    <span className="cok">✓ تم تسجيل حضورك</span>
                  </div>
                  {" "}
                  <div className="msc m2">
                    <span className="ck">شهادتك جاهزة</span>
                    <img className="ccert" alt="" src="/img/luxc-0.jpg" />
                    <span className="cdl">حمّل شهادتك</span>
                  </div>
                  {" "}
                  <div className="msc m3">
                    <span className="ck">تقرير الفصل</span>
                    <span className="cpct">87%</span>
                    <span>نسبة الحضور</span>
                    <span className="cbars">
                      <i style={{ height: "55%" }} />
                      <i style={{ height: "80%" }} />
                      <i style={{ height: "64%" }} />
                      <i style={{ height: "92%" }} />
                      <i style={{ height: "87%" }} />
                    </span>
                    <span className="cpdf">↓ تقرير الفصل · PDF</span>
                  </div>
                  {" "}
                </div>
              </div>
            </div>
            {" "}
            <div className="csteps">
              {" "}
              <div className="cst c1">
                <span className="cn">01</span>
                <div>
                  <b>سجّل حضورهم بكود</b>
                  <span className="cd">في آخر الفعالية تعرض الكود أو تلصقه في الشات، وكل واحد يسجّل من رابط دعوته</span>
                </div>
                <span className="cbar" />
              </div>
              {" "}
              <div className="cst c2">
                <span className="cn">02</span>
                <div>
                  <b>الشهادة تطلع لحالها</b>
                  <span className="cd">بشكل حيّــاك وبشعار جهتك، عربي أو بلغتين، وتوصلهم في نفس الرابط</span>
                </div>
                <span className="cbar" />
              </div>
              {" "}
              <div className="cst c3">
                <span className="cn">03</span>
                <div>
                  <b>أرقامك وتقريرك</b>
                  <span className="cd">مين حضر ومين ما حضر، ونسبة الحضور، وتقرير جاهز ترفعه للعمادة أو الإدارة</span>
                </div>
                <span className="cbar" />
              </div>
              {" "}
            </div>
            {" "}
          </div>
        </section>
        {" "}
        <section data-rv="1" className="pad" style={{ position: "relative", overflow: "hidden", padding: "50px 64px 70px", background: "radial-gradient(60% 60% at 50% 100%, rgba(14,151,174,.5), rgba(14,151,174,0) 70%), linear-gradient(180deg, #082C44, #0B3550)", display: "flex", flexDirection: "column", alignItems: "center", gap: "22px", textAlign: "center" }}>
          <span aria-hidden="true" className="dustL" style={{ boxShadow: "483px 621px rgba(134,220,234,.7),211px 811px rgba(134,220,234,.7),980px 317px rgba(134,220,234,.7),184px 136px rgba(134,220,234,.7),40px 822px rgba(134,220,234,.7),1125px 592px rgba(134,220,234,.7),1567px 120px rgba(134,220,234,.7),454px 1065px rgba(134,220,234,.7),1099px 737px rgba(134,220,234,.7),566px 353px rgba(134,220,234,.7),217px 536px rgba(134,220,234,.7),439px 52px rgba(134,220,234,.7),1312px 533px rgba(134,220,234,.7),556px 396px rgba(134,220,234,.7),337px 634px rgba(134,220,234,.7),593px 1284px rgba(134,220,234,.7),1498px 762px rgba(134,220,234,.7),177px 1240px rgba(134,220,234,.7),691px 1375px rgba(134,220,234,.7),794px 1036px rgba(134,220,234,.7),509px 364px rgba(134,220,234,.7),506px 969px rgba(134,220,234,.7),573px 182px rgba(134,220,234,.7),1121px 614px rgba(134,220,234,.7),14px 597px rgba(134,220,234,.7),1172px 638px rgba(134,220,234,.7),1567px 1041px rgba(134,220,234,.7),399px 847px rgba(134,220,234,.7),867px 1226px rgba(134,220,234,.7),590px 882px rgba(134,220,234,.7),924px 330px rgba(134,220,234,.7),477px 624px rgba(134,220,234,.7),531px 88px rgba(134,220,234,.7),166px 94px rgba(134,220,234,.7),947px 1282px rgba(134,220,234,.7),574px 1062px rgba(134,220,234,.7),1094px 1327px rgba(134,220,234,.7),965px 702px rgba(134,220,234,.7),297px 1379px rgba(134,220,234,.7),400px 136px rgba(134,220,234,.7),845px 415px rgba(134,220,234,.7),1300px 1295px rgba(134,220,234,.7),903px 565px rgba(134,220,234,.7),376px 728px rgba(134,220,234,.7),892px 1205px rgba(134,220,234,.7),656px 1299px rgba(134,220,234,.7),1143px 406px rgba(134,220,234,.7),662px 206px rgba(134,220,234,.7),126px 468px rgba(134,220,234,.7),568px 1192px rgba(134,220,234,.7),1260px 486px rgba(134,220,234,.7),250px 678px rgba(134,220,234,.7),363px 595px rgba(134,220,234,.7),940px 52px rgba(134,220,234,.7),87px 731px rgba(134,220,234,.7),1428px 169px rgba(134,220,234,.7),585px 1382px rgba(134,220,234,.7),669px 37px rgba(134,220,234,.7),661px 591px rgba(134,220,234,.7),658px 313px rgba(134,220,234,.7),1587px 1335px rgba(134,220,234,.7),840px 1270px rgba(134,220,234,.7),1392px 159px rgba(134,220,234,.7),600px 1265px rgba(134,220,234,.7),392px 909px rgba(134,220,234,.7),598px 279px rgba(134,220,234,.7),512px 781px rgba(134,220,234,.7),1226px 325px rgba(134,220,234,.7),678px 1173px rgba(134,220,234,.7),19px 744px rgba(134,220,234,.7),91px 931px rgba(134,220,234,.7),347px 747px rgba(134,220,234,.7),742px 594px rgba(134,220,234,.7),1170px 198px rgba(134,220,234,.7),899px 424px rgba(134,220,234,.7),868px 425px rgba(134,220,234,.7),232px 121px rgba(134,220,234,.7),127px 113px rgba(134,220,234,.7),1509px 345px rgba(134,220,234,.7),1219px 1386px rgba(134,220,234,.7),306px 1242px rgba(134,220,234,.7),83px 1118px rgba(134,220,234,.7),1004px 1193px rgba(134,220,234,.7),510px 658px rgba(134,220,234,.7),72px 250px rgba(134,220,234,.7),1083px 599px rgba(134,220,234,.7),1584px 838px rgba(134,220,234,.7),1334px 410px rgba(134,220,234,.7),978px 413px rgba(134,220,234,.7),495px 898px rgba(134,220,234,.7)" }} />
          <span aria-hidden="true" className="dustL d2" style={{ boxShadow: "840px 1007px rgba(255,255,255,.8),75px 448px rgba(255,255,255,.8),862px 908px rgba(255,255,255,.8),509px 1325px rgba(255,255,255,.8),876px 441px rgba(255,255,255,.8),1021px 384px rgba(255,255,255,.8),64px 75px rgba(255,255,255,.8),520px 518px rgba(255,255,255,.8),496px 1076px rgba(255,255,255,.8),426px 474px rgba(255,255,255,.8),854px 535px rgba(255,255,255,.8),290px 665px rgba(255,255,255,.8),105px 644px rgba(255,255,255,.8),1157px 239px rgba(255,255,255,.8),1166px 825px rgba(255,255,255,.8),1337px 1339px rgba(255,255,255,.8),1469px 82px rgba(255,255,255,.8),1012px 793px rgba(255,255,255,.8),190px 880px rgba(255,255,255,.8),431px 1172px rgba(255,255,255,.8),338px 689px rgba(255,255,255,.8),606px 1345px rgba(255,255,255,.8),965px 1315px rgba(255,255,255,.8),645px 860px rgba(255,255,255,.8),1081px 440px rgba(255,255,255,.8),1340px 549px rgba(255,255,255,.8),693px 803px rgba(255,255,255,.8),1016px 152px rgba(255,255,255,.8),573px 1285px rgba(255,255,255,.8),1368px 391px rgba(255,255,255,.8),91px 808px rgba(255,255,255,.8),1268px 261px rgba(255,255,255,.8),1570px 551px rgba(255,255,255,.8),1366px 123px rgba(255,255,255,.8),342px 1300px rgba(255,255,255,.8),951px 1165px rgba(255,255,255,.8),967px 826px rgba(255,255,255,.8),799px 447px rgba(255,255,255,.8),6px 432px rgba(255,255,255,.8),321px 26px rgba(255,255,255,.8),1249px 527px rgba(255,255,255,.8),237px 810px rgba(255,255,255,.8),1576px 780px rgba(255,255,255,.8),455px 1127px rgba(255,255,255,.8),109px 413px rgba(255,255,255,.8),331px 1375px rgba(255,255,255,.8),1245px 677px rgba(255,255,255,.8),1151px 965px rgba(255,255,255,.8),1078px 900px rgba(255,255,255,.8),54px 161px rgba(255,255,255,.8),70px 1217px rgba(255,255,255,.8),231px 1001px rgba(255,255,255,.8),1148px 526px rgba(255,255,255,.8),1245px 284px rgba(255,255,255,.8),84px 742px rgba(255,255,255,.8),163px 1071px rgba(255,255,255,.8),21px 608px rgba(255,255,255,.8),710px 153px rgba(255,255,255,.8),174px 1112px rgba(255,255,255,.8),929px 780px rgba(255,255,255,.8)" }} />
          <span aria-hidden="true" className="drift" style={{ left: "-6%", top: "24%", width: "540px", height: "540px", background: "radial-gradient(closest-side, rgba(14,151,174,.35), rgba(14,151,174,0))" }} />
          <span aria-hidden="true" className="drift" style={{ right: "-10%", bottom: "-10%", width: "680px", height: "680px", background: "radial-gradient(closest-side, rgba(134,220,234,.2), rgba(134,220,234,0))", animationDuration: "26s", animationDirection: "reverse" }} />
          <div className="cons" aria-hidden="true">
            <span className="cs rv" style={{ "--y": "34px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.10s both, miniF 6s ease-in-out 1.2s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg0" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#4CC7DA" />
                    <stop offset="55%" stopColor="#0E97AE" />
                    <stop offset="100%" stopColor="#086577" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg0)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#086577" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="58.6" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="24" fill="#FFFFFF">مدعو</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "10px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.19s both, miniF 7s ease-in-out 1.4s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg1" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#6E95C4" />
                    <stop offset="55%" stopColor="#2D5A8C" />
                    <stop offset="100%" stopColor="#1A3A60" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg1)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#1A3A60" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="59.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="26" fill="#FFFFFF">ضيف</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "0px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.28s both, miniF 8s ease-in-out 1.6s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg2" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#77B59F" />
                    <stop offset="55%" stopColor="#3F7F6A" />
                    <stop offset="100%" stopColor="#285445" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg2)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#285445" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="59.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="26" fill="#FFFFFF">عضو</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "-6px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.37s both, miniF 6s ease-in-out 1.8s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg3" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#3E6688" />
                    <stop offset="55%" stopColor="#0A2A43" />
                    <stop offset="100%" stopColor="#04121F" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg3)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#04121F" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="57.6" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="21" fill="#FFFFFF">متحدث</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "-6px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.46s both, miniF 7s ease-in-out 2.0s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg4" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#E7C873" />
                    <stop offset="55%" stopColor="#B8892A" />
                    <stop offset="100%" stopColor="#7E5B14" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg4)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#7E5B14" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="59.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="26" fill="#FFFFFF">VIP</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "0px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.55s both, miniF 8s ease-in-out 2.2s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg5" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#B07592" />
                    <stop offset="55%" stopColor="#7A3E5B" />
                    <stop offset="100%" stopColor="#52253C" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg5)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#52253C" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="58.6" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="24" fill="#FFFFFF">راعي</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "10px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.64s both, miniF 6s ease-in-out 2.4s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg6" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#7E7AB8" />
                    <stop offset="55%" stopColor="#4A4682" />
                    <stop offset="100%" stopColor="#2E2B5A" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg6)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#2E2B5A" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="58.6" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="24" fill="#FFFFFF">شريك</text>
              </svg>
            </span>
            <span className="cs rv" style={{ "--y": "34px", animation: "csIn 1s cubic-bezier(.2,.8,.2,1) 0.73s both, miniF 7s ease-in-out 2.6s infinite" }}>
              <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "100%", overflow: "visible", display: "block" }}>
                <defs>
                  <radialGradient id="cg7" cx="34%" cy="26%" r="85%">
                    <stop offset="0%" stopColor="#C66972" />
                    <stop offset="55%" stopColor="#8C2F39" />
                    <stop offset="100%" stopColor="#5C1A22" />
                  </radialGradient>
                </defs>
                <path d={v.wax} fill="rgba(2,24,32,.5)" transform="translate(0 2.6)" />
                <path d={v.wax} fill="url(#cg7)" />
                <circle cx="50" cy="50" r="31" fill="none" stroke="#5C1A22" strokeOpacity=".5" strokeWidth="2.5" />
                <ellipse cx="36" cy="28" rx="14" ry="6" transform="rotate(-28 36 28)" fill="#FFFFFF" fillOpacity=".3" />
                <text x="50" y="57.9" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="22" fill="#FFFFFF">تحكيم</text>
              </svg>
            </span>
          </div>
          <h2 className="h2m fit" style={{ margin: "0", fontFamily: "TD, TDx, serif", "--fs": "min(80px, 6.4vw)", fontSize: "var(--fs)", whiteSpace: "nowrap", lineHeight: "1.3", color: "#FAFBFC", textShadow: "0 0 40px rgba(134,220,234,.35)" }}>
            <span className="rv w2" style={{ animationDelay: "0.20s" }}>مناسبتك</span>
            {" "}
            <span className="rv w2" style={{ animationDelay: "0.32s" }}>الجاية</span>
            {" "}
            <span className="rv w2" style={{ animationDelay: "0.44s" }}>بدعوة</span>
            {" "}
            <span className="rv w2" style={{ animationDelay: "0.56s" }}>من</span>
            {" "}
            <span className="hlw" style={{ color: "#86DCEA" }}><span className="rv w2" style={{ animationDelay: "0.68s" }}>حيّــاك</span></span>
          </h2>
          <span className="rv" style={{ fontSize: "min(24px, 4.6vw)", color: "#DCE4E8", maxWidth: "92vw", animation: "up .9s ease-out .9s both" }}>أنشئ حسابك في أقل من دقيقة، وخلّ أول دعوة علينا</span>
          <A href="Signup.dc.html" className="btn rv" style={{ height: "58px", padding: "0 38px", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", textDecoration: "none", fontWeight: "500", fontSize: "17px", display: "inline-flex", alignItems: "center", boxShadow: "0 0 0 8px rgba(250,251,252,.08), 0 20px 50px rgba(134,220,234,.3)", animation: "up .9s ease-out .9s both" }}>أنشئ حسابك مجانًا</A>
          <span className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#DCE4E8", animation: "up .9s ease-out 1.1s both" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86DCEA" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" /></svg>
            الدفع آمن، وبياناتك محفوظة بخصوصية
          </span>
          <div className="rv" style={{ marginTop: "70px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "15px", color: "#9FB4C2", paddingTop: "24px", animation: "up .9s ease-out 1.3s both" }}>
            <span style={{ display: "flex", gap: "22px" }}>
              <span>© 2026 حيّــاك</span>
              <A href="Privacy.dc.html" style={{ textDecoration: "none" }}>الخصوصية</A>
              <A href="Terms.dc.html" style={{ textDecoration: "none" }}>الشروط</A>
            </span>
            <span style={{ display: "flex", gap: "18px" }}>
              <A href="https://x.com/its_hayyak" target="_blank" rel="noopener" style={{ textDecoration: "none" }}>{"X"}</A>
              <A href="https://www.instagram.com/its_hayyak" target="_blank" rel="noopener" style={{ textDecoration: "none" }}>إنستقرام</A>
              <A href="https://www.tiktok.com/@its_hayyak" target="_blank" rel="noopener" style={{ textDecoration: "none" }}>تيك توك</A>
              <A href="mailto:hayyakinfo@gmail.com" style={{ textDecoration: "none" }}>الإيميل</A>
            </span>
            <Mark size={30} />
          </div>
        </section>
        <FAQ open="لا" />
      </div>
      <A href="Signup.dc.html" className="btn mcta" style={{ display: "none", position: "fixed", left: "14px", right: "14px", bottom: "14px", zIndex: "40", height: "54px", borderRadius: "999px", background: "#FAFBFC", color: "#0A2A43", textDecoration: "none", fontWeight: "500", fontSize: "15px", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(0,0,0,.45)" }}>أنشئ حسابك</A>
    </>
  );
}
