import { Fragment } from 'react';
import Mark from '@/ui/Mark';
import { S, txt, A } from '@/ui/dc';

const CSS = ``;

export default function CertSheetView({ v }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
      <div style={{ containerType: "inline-size", width: "100%" }}>
        {" "}
        <div style={{ position: "relative", width: "100%", aspectRatio: "1123/794", borderRadius: "1cqw", overflow: "hidden", boxShadow: "0 20px 50px rgba(10,42,67,.16)", fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", direction: "rtl" }}>
          {" "}
          {v.notCustom ? (
            <div style={S(`${txt(v.pBg)}`)}>
                {" "}
                {v.isDark ? (
                  <svg viewBox="0 0 1123 794" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }}>
                      {(v.stars || []).map((x, $i0) => (
                        <circle key={x?.key ?? $i0} cx={x?.x} cy={x?.y} r={x?.r} fill="#FFFFFF" opacity={x?.o} />
                      ))}
                    </svg>
                ) : null}
                {" "}
                <svg viewBox="0 0 100 100" aria-hidden="true" style={S(`position: absolute; left: -13.4cqw; bottom: -16cqw; width: 51.6cqw; height: 51.6cqw; opacity: ${txt(v.wmOp)};`)}>
                  <path d={v.wax} fill={v.acc} />
                  <circle cx="50" cy="50" r="31.5" fill="none" stroke={v.paperC} strokeWidth="2.6" />
                  <text x="50" y="60" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="42" fill={v.paperC}>{"ح"}</text>
                </svg>
                {" "}
                <svg viewBox="0 0 1123 794" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }}>
                  <rect x="44" y="44" width="1035" height="706" fill="none" stroke={v.acc} strokeWidth=".7" opacity=".5" />
                  {(v.corners || []).map((c, $i1) => (
                    <Fragment key={c?.key ?? $i1}><path d={c?.d} fill="none" stroke={v.acc} strokeWidth="3" strokeLinecap="round" /><path d={v.wax} transform={c?.t} fill={v.gold} /></Fragment>
                  ))}
                </svg>
                {" "}
                <div style={{ position: "absolute", inset: "6.4cqw 8.5cqw 5.8cqw", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "1cqw" }}>
                      <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: "5.5cqw", height: "5.5cqw", overflow: "visible", transform: "rotate(-9deg)" }}>
                        <path d={v.wax} fill="#033A44" transform="translate(0 2.4)" />
                        <path d={v.wax} fill="url(#dWax)" />
                        <circle cx="50" cy="50" r="31.5" fill="none" stroke="#05505E" strokeOpacity=".55" strokeWidth="2.6" />
                        <ellipse cx="34" cy="24" rx="16" ry="6" transform="rotate(-30 34 24)" fill="#FFFFFF" fillOpacity=".35" />
                        <text x="50" y="59" textAnchor="middle" fontFamily="TD, TDx, serif" fontSize="42" fill="#FFFFFF">{"ح"}</text>
                      </svg>
                      <span style={{ display: "flex", flexDirection: "column" }}>
                        <span style={S(`font-size: 1.34cqw; color: ${txt(v.mut)};`)}>بواسطة</span>
                        <span style={{ fontFamily: "TD, TDx, serif", fontSize: "2.85cqw", lineHeight: "1.1" }}>حيّــاك</span>
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "1cqw", flexDirection: "row-reverse" }}>
                      <span style={S(`width: 5.5cqw; height: 5.5cqw; border-radius: 50%; border: .14cqw solid ${txt(v.acc)}; display: flex; align-items: center; justify-content: center; overflow: hidden; background: ${txt(v.logoBg)};`)}>
                        {v.hasLogo ? (
                          <img src={v.logo} alt="" style={{ width: "78%", height: "78%", objectFit: "contain" }} />
                        ) : null}
                        {v.noLogo ? (
                          <span style={S(`font-family: TD, TDx, serif; font-size: 2.5cqw; color: ${txt(v.acc)};`)}>{v.orgInit}</span>
                        ) : null}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                        <span style={{ fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif", fontWeight: "700", fontSize: "1.96cqw" }}>{v.org}</span>
                        <span style={S(`font-size: 1.34cqw; color: ${txt(v.mut)};`)}>{v.orgSub}</span>
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "-.6cqw" }}>
                    <span style={S(`font-family: TD, TDx, serif; font-size: 6.2cqw; line-height: 1.15; color: ${txt(v.acc)};`)}>{v.title}</span>
                    <span style={S(`font-family: TD, TDx, serif; font-size: 1.96cqw; color: ${txt(v.mut)};`)}>{v.titleEn}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "1cqw", marginTop: "1.4cqw" }}>
                      <span style={S(`width: 9.8cqw; height: .1cqw; background: ${txt(v.gold)};`)} />
                      <span style={S(`width: .7cqw; height: .7cqw; transform: rotate(45deg); background: ${txt(v.gold)};`)} />
                      <span style={S(`width: 9.8cqw; height: .1cqw; background: ${txt(v.gold)};`)} />
                    </span>
                    {v.isAr ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "5cqw" }}>
                          <span style={S(`font-size: 1.96cqw; color: ${txt(v.mut)};`)}>{v.certLine}</span>
                          <span style={S(`font-family: TD, TDx, serif; font-size: 7.3cqw; line-height: 1.35; ${txt(v.glow)}`)}>{v.nameAr}</span>
                          <span style={S(`width: 57cqw; font-size: 1.87cqw; line-height: 1.95; color: ${txt(v.body)}; text-align: justify; text-align-last: center;`)}>{v.para}</span>
                          {v.extraShow ? (
                            <span style={S(`font-size: 1.5cqw; color: ${txt(v.mut)}; margin-top: .4cqw;`)}>{v.extraLine}</span>
                          ) : null}
                        </div>
                    ) : null}
                    {v.isBi ? (
                      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) .1cqw minmax(0,1fr)", gap: "3.6cqw", width: "80cqw", marginTop: "6.2cqw", alignItems: "start" }}>
                          <div style={{ direction: "rtl", textAlign: "right", display: "flex", flexDirection: "column", gap: ".3cqw" }}>
                            <span style={S(`font-size: 1.6cqw; color: ${txt(v.mut)};`)}>{v.certLine}</span>
                            <span style={S(`font-family: TD, TDx, serif; font-size: 4.2cqw; line-height: 1.5; white-space: nowrap; ${txt(v.glow)}`)}>{v.nameAr}</span>
                            <span style={S(`font-size: 1.6cqw; line-height: 1.9; color: ${txt(v.body)};`)}>{v.para}</span>
                            {v.extraShow ? (
                              <span style={S(`font-size: 1.4cqw; color: ${txt(v.mut)};`)}>{v.extraLine}</span>
                            ) : null}
                          </div>
                          <span style={S(`width: .1cqw; height: 100%; background: ${txt(v.fg)}; opacity: .15;`)} />
                          <div style={{ direction: "ltr", textAlign: "left", display: "flex", flexDirection: "column", gap: ".3cqw" }}>
                            <span style={S(`font-size: 1.6cqw; color: ${txt(v.mut)};`)}>{v.enLine}</span>
                            <span style={S(`font-family: TS, 'IBM Plex Sans Arabic', sans-serif; font-weight: 700; font-size: 3.4cqw; line-height: 1.85; white-space: nowrap; ${txt(v.glow)}`)}>{v.nameEn}</span>
                            <span style={S(`font-size: 1.6cqw; line-height: 1.9; color: ${txt(v.body)};`)}>{v.enPara}</span>
                          </div>
                        </div>
                    ) : null}
                  </div>
                  <div style={{ marginTop: "auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".36cqw", width: "25cqw" }}>
                      <span style={S(`font-size: 1.34cqw; color: ${txt(v.mut)};`)}>{v.role}</span>
                      <span style={{ fontFamily: "TD, TDx, serif", fontSize: "2.3cqw", lineHeight: "1.3" }}>{v.signer}</span>
                      <span style={{ height: "3cqw", marginBottom: "-1.1cqw", display: "flex", alignItems: "flex-end" }}>
                        {v.hasSig ? (
                          <img src={v.sigImg} alt="" style={{ height: "3.4cqw", maxWidth: "14cqw", objectFit: "contain" }} />
                        ) : null}
                        {v.noSig ? (
                          <svg viewBox="0 0 190 56" fill="none" stroke={v.fg} strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ width: "10.7cqw", height: "3cqw" }}>
                              <path d="M10 38c14-22 26-28 30-18s-12 22-4 22 18-26 26-22-4 20 6 18 14-16 22-14 2 14 12 12 22-12 34-10 18 4 24 2" />
                            </svg>
                        ) : null}
                      </span>
                      <span style={S(`width: 25cqw; height: .1cqw; background: ${txt(v.fg)}; opacity: .35;`)} />
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".36cqw", width: "25cqw" }}>
                      <span style={S(`font-size: 1.34cqw; color: ${txt(v.mut)};`)}>تاريخ الإصدار</span>
                      <span style={{ fontFamily: "TD, TDx, serif", fontSize: "2.3cqw", lineHeight: "1.3" }}>{v.issueDate}</span>
                      <span style={{ height: "3cqw", marginBottom: "-1.1cqw" }} />
                      <span style={S(`width: 25cqw; height: .1cqw; background: ${txt(v.fg)}; opacity: .35;`)} />
                    </span>
                  </div>
                </div>
                {" "}
              </div>
          ) : null}
          {" "}
          {v.isCustom ? (
            <div style={{ position: "absolute", inset: "0", background: "#E9EEF1" }}>
                {" "}
                {v.hasBg ? (
                  <img src={v.bg} alt="تصميم الشهادة" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} />
                ) : null}
                {" "}
                {v.noBg ? (
                  <div style={{ position: "absolute", inset: "2.4cqw", border: ".25cqw dashed #B8C4CC", borderRadius: "1cqw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "5cqw", gap: ".8cqw", color: "#4A5B68", textAlign: "center" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#86A0AE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: "5cqw", height: "5cqw" }}><path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01" /></svg>
                      <span style={{ fontSize: "1.9cqw", fontWeight: "700" }}>هنا يطلع تصميمكم</span>
                      <span style={{ fontSize: "1.4cqw" }}>ارفعوه من «تصميمكم» · بدون الاسم</span>
                    </div>
                ) : null}
                {" "}
                <div style={S(`${txt(v.ovSt)}`)}>
                  {" "}
                  <span style={S(`font-family: TD, TDx, serif; font-size: ${txt(v.ovName)}; line-height: 1.3;`)}>{v.nameAr}</span>
                  {" "}
                  {(v.ovLines || []).map((l, $i2) => (
                    <span key={l?.key ?? $i2} style={S(`font-size: ${txt(v.ovInfo)}; line-height: 1.8; opacity: .85;`)}>{l}</span>
                  ))}
                  {" "}
                </div>
                {" "}
                <span style={{ position: "absolute", left: "2cqw", bottom: "1.6cqw", display: "inline-flex", alignItems: "center", gap: ".5cqw", padding: ".4cqw .9cqw", borderRadius: "99px", background: "rgba(255,255,255,.75)", fontSize: "1cqw", color: "#4A5B68" }}>
                  <Mark size={0} style={{width: "1.6cqw", height: "1.6cqw"}} />
                  بواسطة حيّــاك
                </span>
                {" "}
              </div>
          ) : null}
          {" "}
        </div>
        {" "}
      </div>
    </>
  );
}
