'use client';
/** How a certificate's saved settings turn into what is drawn. Shared by the editor and the guest's page. */
export const COLORS = [['تركوازي', '#0E97AE', '#4FC9DC'], ['كحلي', '#0A2A43', '#CFE7EE'], ['ذهبي', '#B8892A', '#E7C873'], ['عنابي', '#8A2D3B', '#E39AA6']];
export const TITLES = ['شهادة حضور', 'شهادة شكر', 'شهادة مشاركة'];
export const TCOLS = [['كحلي', '#0A2A43'], ['أبيض', '#FFFFFF'], ['ذهبي', '#B8892A'], ['تركوازي', '#0E97AE']];
export const ALIGNS = [['يمين', 'right', 'flex-end'], ['وسط', 'center', 'center'], ['يسار', 'left', 'flex-start']];
export const SIZES = [['صغير', 4, 1.4], ['وسط', 5.6, 1.65], ['كبير', 7.2, 1.9]];

const rnd = (i) => { const x = Math.sin(i * 12.9898 + 3.1) * 43758.5453; return x - Math.floor(x); };
const stars = Array.from({ length: 120 }, (_, j) => ({ key: j, x: (rnd(j) * 1123).toFixed(0), y: (rnd(j + 300) * 794).toFixed(0), r: (rnd(j + 600) * 1.4 + 0.3).toFixed(2), o: (0.2 + rnd(j + 900) * 0.7).toFixed(2) }));
const waves = Array.from({ length: 46 }, (_, i) => `M0 ${i * 18} Q 280 ${i * 18 - 30} 561 ${i * 18} T 1123 ${i * 18}`);
const ros = [[90, 90], [1033, 90], [90, 704], [1033, 704]].flatMap((c) => Array.from({ length: 18 }, (_, k) => ({ key: `${c}${k}`, cx: c[0], cy: c[1], tr: `rotate(${k * 20} ${c[0]} ${c[1]})` })));

export function certVals(c, d) {
  const dark = c.tpl === 1;
  const accent = COLORS[c.color][1];
  const accentD = c.color === 1 ? COLORS[2][2] : COLORS[c.color][2];
  const ovLines = [];
  if (c.fields.ev) ovLines.push(`«${d.event.title}»`);
  if (c.fields.dt || c.fields.du) ovLines.push([c.fields.dt ? d.event.date : '', c.fields.du ? d.event.dur : ''].filter(Boolean).join(' · '));
  if (c.extra && d.extraValue) ovLines.push(`${c.extraL}: ${d.extraValue}`);
  return {
    accent, accentD, isDark: dark, isLight: c.tpl === 0, title: TITLES[c.title], titleEn: ['Certificate of Attendance', 'Certificate of Appreciation', 'Certificate of Participation'][c.title], waves, ros, stars, orgInit: (c.org || 'ح').replace(/^(نادي|جمعية|مبادرة|فريق)\s+/, '').charAt(0),
    nameAr: d.nameAr, nameEn: d.nameEn || d.nameAr, extraLine: c.extra && d.extraValue ? `${c.extraL}: ${d.extraValue}` : '', extraShow: Boolean(c.extra && d.extraValue),
    ovSt: `position:absolute;left:${100 - c.px}%;top:${c.py}%;transform:translate(-50%,-50%);width:70%;display:flex;flex-direction:column;align-items:${ALIGNS[c.al][2]};text-align:${ALIGNS[c.al][1]};color:${TCOLS[c.tc][1]};${c.tc === 1 ? 'text-shadow:0 1px 8px rgba(0,0,0,.35)' : ''}`, ovName: SIZES[c.sz][1] + 'cqw', ovInfo: SIZES[c.sz][2] + 'cqw', ovLines,
    pBg: `position:absolute;inset:0;color:${dark ? '#FFFFFF' : '#0A2A43'};background:${dark ? 'radial-gradient(70% 80% at 50% 0%, #123E5C, #0A2A43 55%, #061C2D)' : 'radial-gradient(80% 90% at 50% 0%, #FFFFFF, #F8FAFB 60%, #F0F4F5)'}`,
    acc: dark ? accentD : accent, gold: dark ? '#E7C873' : '#B8892A', fg: dark ? '#FFFFFF' : '#0A2A43', mut: dark ? '#B8D4DE' : '#4A5B68', body: dark ? '#DDEFF3' : '#1E3A4E', paperC: dark ? '#0A2A43' : '#F8FAFB', wmOp: dark ? '.08' : '.07', logoBg: dark ? 'rgba(255,255,255,.04)' : '#FFFFFF', glow: dark ? 'text-shadow: 0 0 2.6cqw rgba(134,220,234,.35);' : '',
    corners: [[34, 34, 1, 1], [1089, 34, -1, 1], [34, 760, 1, -1], [1089, 760, -1, -1]].map((k, i) => ({ key: i, d: `M${k[0]} ${k[1] + k[3] * 120} V${k[1]} H${k[0] + k[2] * 120}`, t: `translate(${k[0] + k[2] * 16 - 11} ${k[1] + k[3] * 16 - 11}) scale(.22)` })),
  };
}
