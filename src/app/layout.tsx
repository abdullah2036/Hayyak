import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { staging } from '@/lib/hosts';
import { boot } from '@/lib/typepack';
import { typeUrl } from '@/server/services/type';
import './globals.css';

const url = process.env.APP_URL || 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: 'حيّــاك — كل حضور يبدأ بدعوة', template: '%s — حيّــاك' },
  description: 'صمّم دعوتك المتحركة، أرسلها لكل ضيف باسمه، وتابع الردود والحضور والشهادات من مكان واحد.',
  openGraph: { siteName: 'حيّــاك', locale: 'ar_SA', type: 'website' },
  icons: { icon: '/icon.svg' },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0A2A43' };
// Every page is rendered per request, so each one carries its own CSP nonce.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') || undefined;
  const type = await typeUrl();
  return (
    // The script below adds a class to this element before React takes over.
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        {/* Not in the head: Netlify writes a comment there, and React would no longer recognise the page as its own. */}
        {/* Written here, it is always there, even when the top of the page was sent before the address was known. */}
        {type ? <link rel="preload" href={type} as="fetch" crossOrigin="anonymous" /> : null}
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: boot(type) }} />
        {children}
        {staging() ? (
          <div className="noprint" style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 200, padding: '3px 14px', borderRadius: '0 0 12px 12px', background: '#E7C873', color: '#0A2A43', fontSize: 12, fontWeight: 700, pointerEvents: 'none' }}>
            نسخة اختبار
          </div>
        ) : null}
      </body>
    </html>
  );
}
