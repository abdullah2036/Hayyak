import type { Metadata, Viewport } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
