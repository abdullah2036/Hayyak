/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  // Some hosts (Netlify) do not give runtime variables to the request filter in src/proxy.ts, so the addresses are
  // also kept from the build. Server files only: nothing in the browser reads them.
  env: { BUILD_APP_URL: process.env.APP_URL || '', BUILD_STUDIO_URL: process.env.STUDIO_URL || '', BUILD_APP_ENV: process.env.APP_ENV || '' },
  reactStrictMode: false,
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
  serverExternalPackages: ['@electric-sql/pglite', 'sharp', 'postgres', 'nodemailer'],
  // Headers that do not depend on the request. The nonce-based CSP is set in src/proxy.ts
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
      {
        // Personal links carry a token in the address: never leak it through the Referer header and keep it out of search engines.
        source: '/(i|a|c|r)/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      { source: '/(app|studio)/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default config;
