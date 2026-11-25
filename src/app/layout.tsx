import type { Metadata, Viewport } from 'next';
import { staging } from '@/lib/hosts';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
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
