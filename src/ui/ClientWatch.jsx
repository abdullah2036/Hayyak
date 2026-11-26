'use client';
/**
 * Tells the Studio when a page fails on someone's phone. A browser that runs out of memory closes the page without
 * any error to catch, so each page marks itself as open while it is on screen; if the next page load finds that mark
 * still there, the previous page was closed by the browser. Nothing personal is sent: the address, the error, and the
 * kind of device.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const KEY = 'hyLive';

export function report(kind, path, message) {
  try {
    const body = JSON.stringify({
      kind,
      path: String(path || location.pathname).slice(0, 200),
      message: String(message || '').slice(0, 500),
      screen: `${innerWidth}x${innerHeight}@${Math.round((devicePixelRatio || 1) * 10) / 10}`,
    });
    fetch('/api/report', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    /* reporting must never cause a problem of its own */
  }
}

const mark = (path) => {
  try {
    if (document.visibilityState === 'visible') sessionStorage.setItem(KEY, JSON.stringify({ path: path || location.pathname, t: Date.now() }));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* private mode */
  }
};

export default function ClientWatch() {
  const path = usePathname();
  useEffect(() => {
    try {
      const prev = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (prev && Date.now() - prev.t < 5 * 60e3) report('crash', prev.path, '');
    } catch {
      /* private mode */
    }
    mark();
    let n = 0;
    const err = (e) => {
      if (n++ >= 3) return;
      const r = e.reason;
      const where = e.filename ? ` @${e.filename.split('/').pop()}:${e.lineno}` : '';
      report('error', location.pathname, `${e.message || r?.message || String(r || '')}${where}`);
    };
    const bye = () => { try { sessionStorage.removeItem(KEY); } catch { /* private mode */ } };
    const vis = () => mark();
    const beat = setInterval(() => mark(), 60e3);
    addEventListener('visibilitychange', vis);
    addEventListener('pageshow', vis);
    addEventListener('pagehide', bye);
    addEventListener('error', err);
    addEventListener('unhandledrejection', err);
    return () => {
      clearInterval(beat);
      removeEventListener('visibilitychange', vis);
      removeEventListener('pageshow', vis);
      removeEventListener('pagehide', bye);
      removeEventListener('error', err);
      removeEventListener('unhandledrejection', err);
    };
  }, []);
  useEffect(() => mark(path), [path]);
  return null;
}
