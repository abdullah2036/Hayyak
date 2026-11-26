'use client';
/** The Hayyak logo: the wax stamp with its ring and the letter ح. Every page draws it from here, so it is always the same. */
import { useId } from 'react';
import { waxPath } from './kit';

const WAX = waxPath(1.3);

export default function Mark({ size = 40, style }) {
  // Each drawing needs its own gradient name, and ids made by React contain characters SVG references do not like.
  const id = 'hm' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg width={size || undefined} height={size || undefined} viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: 'visible', flex: 'none', ...style }}>
      <defs>
        <radialGradient id={id} cx="34%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#A6EEF7" />
          <stop offset="25%" stopColor="#4FC9DC" />
          <stop offset="60%" stopColor="#0E97AE" />
          <stop offset="100%" stopColor="#05505E" />
        </radialGradient>
      </defs>
      <path d={WAX} fill="#033A44" transform="translate(0 2.4)" />
      <path d={WAX} fill={`url(#${id})`} />
      <circle cx="50" cy="50" r="31.5" fill="none" stroke="#05505E" strokeOpacity=".55" strokeWidth="2.6" />
      <circle cx="50" cy="50.9" r="31.5" fill="none" stroke="#C9F4FA" strokeOpacity=".55" strokeWidth="1.1" />
      <ellipse cx="34" cy="24" rx="16" ry="6" transform="rotate(-30 34 24)" fill="#FFFFFF" fillOpacity=".35" />
      <text x="50" y="60.4" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="42" fill="#033A44" fillOpacity=".7">ح</text>
      <text x="50" y="58.8" textAnchor="middle" fontFamily="TD, TDx, serif" fontWeight="700" fontSize="42" fill="#FFFFFF">ح</text>
    </svg>
  );
}
