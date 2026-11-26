import { NextResponse, type NextRequest } from 'next/server';
import { appOrigin, areaOf, HOST_HEADER, hostOf, staging, studioOrigin } from '@/lib/hosts';

/** Keeps the Studio on its own address, and gives every page a content security policy with a fresh nonce. */
export function proxy(req: NextRequest) {
  // Reused when this runs a second time for the same request, so the header and the page always agree.
  const given = req.headers.get('x-nonce') || '';
  const nonce = /^[A-Za-z0-9+/]{48}$/.test(given) ? given : btoa(crypto.randomUUID());
  const host = hostOf(req.headers);
  const dev = process.env.NODE_ENV !== 'production';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    // The design animates through inline styles. Styles cannot run code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "font-src 'self' data:",
    `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    ...(appOrigin().startsWith('https://') ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
  const headers = new Headers(req.headers);
  headers.set('x-nonce', nonce);
  headers.set(HOST_HEADER, host);
  headers.set('Content-Security-Policy', csp);
  const area = areaOf(host);
  const path = req.nextUrl.pathname;
  const studio = path === '/studio' || path.startsWith('/studio/');
  if (area === 'studio' && path === '/') return NextResponse.redirect(new URL('/studio', studioOrigin()));
  const closed = area === 'app' ? studio : area === 'studio' && !studio;
  // A closed page gets the ordinary "not found" page, so it looks like any address that does not exist.
  const res = closed ? NextResponse.rewrite(new URL('/closed-page', req.url), { request: { headers } }) : NextResponse.next({ request: { headers } });
  res.headers.set('Content-Security-Policy', csp);
  if (staging()) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: [{ source: '/((?!api/|_next/static|_next/image|favicon.ico|icon.svg|img/|tpl/|robots.txt).*)' }],
};
