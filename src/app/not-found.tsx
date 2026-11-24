import Link from 'next/link';

export default function NotFound() {
  return (
    <main dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 24, color: '#FFFFFF', background: 'radial-gradient(120% 90% at 70% 0%,#123E5C,#0A2A43 50%,#04121F)' }}>
      <span style={{ fontFamily: 'TD, serif', fontSize: 64, lineHeight: 1.1 }}>حيّــاك</span>
      <b style={{ fontSize: 22 }}>ما لقينا هذي الصفحة</b>
      <span style={{ fontSize: 15, color: '#CFE7EE' }}>ممكن الرابط ناقص أو انتهى</span>
      <Link href="/" style={{ height: 52, padding: '0 28px', borderRadius: 999, background: '#FAFBFC', color: '#0A2A43', fontWeight: 700, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>الرئيسية</Link>
    </main>
  );
}
