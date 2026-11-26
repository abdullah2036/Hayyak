'use client';
/** The last resort when even the page frame fails: never a blank screen, always a way back. Plain, so it cannot fail too. */
import { useEffect } from 'react';
import { report } from '@/ui/ClientWatch';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => report('error', '', `frame: ${error?.message || 'error'}${error?.digest ? ` #${error.digest}` : ''}`), [error]);
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A2A43', color: '#FFFFFF', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', maxWidth: 360 }}>
          <b style={{ fontSize: 22 }}>صار خلل في عرض الصفحة</b>
          <span style={{ fontSize: 15, color: '#CFE7EE', lineHeight: 1.7 }}>بياناتك محفوظة. جرّب مرة ثانية، ولو تكرر ارجع للرئيسية.</span>
          <span style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => reset()} style={{ height: 46, padding: '0 22px', borderRadius: 999, border: 0, background: '#86DCEA', color: '#04121F', fontWeight: 700, fontSize: 15 }}>جرّب مرة ثانية</button>
            <a href="/" style={{ height: 46, padding: '0 22px', borderRadius: 999, border: '1px solid rgba(255,255,255,.4)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontSize: 15 }}>الرئيسية</a>
          </span>
        </div>
      </body>
    </html>
  );
}
