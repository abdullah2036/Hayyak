'use client';
/**
 * A small preview of an invitation. Pages show many of them, and a phone that builds many live invitations at once
 * runs out of memory and closes the page (iPhones, and Chrome on iPhone even sooner). So on phones and touch screens
 * a preview is a still poster in the invitation's own colours, unless it is marked `live`: the one being chosen, or
 * the only preview on a page. Elsewhere it is the live invitation, drawn again only when what it shows changes.
 */
import { memo, useEffect, useState } from 'react';
import Invite from '@/screens/Invite';

/** True on phones and touch screens. It starts true, so a phone never builds the live previews even for a moment. */
function useLite() {
  const [lite, setLite] = useState(true);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 900px), (hover: none)');
    const f = () => setLite(m.matches);
    f();
    m.addEventListener?.('change', f);
    return () => m.removeEventListener?.('change', f);
  }, []);
  return lite;
}

const STARS = 'radial-gradient(1.6px 1.6px at 12% 18%, #fff 50%, transparent), radial-gradient(1.2px 1.2px at 78% 12%, #fff 50%, transparent), radial-gradient(1.8px 1.8px at 64% 34%, #fff 50%, transparent), radial-gradient(1.2px 1.2px at 28% 42%, #fff 50%, transparent), radial-gradient(1.4px 1.4px at 88% 48%, #fff 50%, transparent), radial-gradient(1px 1px at 40% 8%, #fff 50%, transparent), radial-gradient(1.4px 1.4px at 8% 60%, #fff 50%, transparent)';

/** The invitation's colours, title and seal, laid out like its top half: a few boxes instead of a whole live page. */
function Poster(props) {
  let look;
  try {
    const inv = new Invite({ ...props, thumb: 'نعم' });
    const P = inv.px();
    const pal = inv.pal();
    look = { bg: pal.bg, tx: pal.tx, dark: pal.dark, c1: pal.c1, title: (P.title || '').trim(), seal: P.seal, latin: P.latin };
  } catch {
    look = { bg: 'radial-gradient(120% 80% at 70% 0%, #123E5C, #0A2A43 50%, #04121F)', tx: '#FFFFFF', dark: true, c1: '#86DCEA', title: '', seal: 'VIP', latin: '' };
  }
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, width: 390, height: 844, background: look.bg, overflow: 'hidden', fontFamily: "TS, 'IBM Plex Sans Arabic', sans-serif" }}>
      {look.dark ? <span style={{ position: 'absolute', inset: 0, backgroundImage: STARS, opacity: 0.85 }} /> : null}
      <span style={{ position: 'absolute', left: 24, right: 24, top: 236, textAlign: 'center', fontFamily: 'TD, TDx, serif', fontWeight: 700, fontSize: 52, lineHeight: 1.25, color: look.tx }}>{look.title || 'دعوة'}</span>
      {look.latin ? <span style={{ position: 'absolute', left: 0, right: 0, top: 316, textAlign: 'center', fontSize: 15, letterSpacing: 7, color: look.tx, opacity: 0.8, direction: 'ltr' }}>{look.latin}</span> : null}
      <span style={{ position: 'absolute', left: 20, right: 20, top: 400, bottom: 30, borderRadius: 28, background: 'rgba(250,251,252,.96)' }}>
        <span style={{ position: 'absolute', right: 22, top: 30, width: 150, height: 14, borderRadius: 7, background: '#DCE4E8' }} />
        <span style={{ position: 'absolute', right: 22, top: 58, width: 210, height: 26, borderRadius: 9, background: '#0A2A43', opacity: 0.85 }} />
        <span style={{ position: 'absolute', left: 22, right: 22, top: 120, height: 1, background: '#DCE4E8' }} />
        <span style={{ position: 'absolute', right: 22, top: 150, width: 120, height: 12, borderRadius: 6, background: '#DCE4E8' }} />
        <span style={{ position: 'absolute', left: 22, top: 150, width: 90, height: 12, borderRadius: 6, background: '#DCE4E8' }} />
      </span>
      <span style={{ position: 'absolute', left: 16, top: 356, width: 104, height: 104, borderRadius: '50%', background: `radial-gradient(circle at 34% 28%, #ffffffaa, ${look.c1} 45%, #05505E)`, boxShadow: '0 10px 20px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontFamily: 'TD, TDx, serif', fontWeight: 700, fontSize: 26 }}>{look.seal}</span>
    </span>
  );
}

function Thumb({ live, ...props }) {
  const lite = useLite();
  if (lite && !live) return <Poster {...props} />;
  return <Invite {...props} thumb="نعم" />;
}

const same = (a, b) => {
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  return ka.every((k) => (k === 'look' ? a.look === b.look || JSON.stringify(a.look) === JSON.stringify(b.look) : a[k] === b[k]));
};

export default memo(Thumb, same);
