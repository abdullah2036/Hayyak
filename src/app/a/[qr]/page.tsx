import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShowGuest } from '@/screens';
import { sessionByQr } from '@/server/services/attendance';

export const metadata: Metadata = { title: 'تسجيل الحضور', robots: { index: false } };
export default async function Page({ params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params;
  const s = /^[a-z0-9]{10,30}$/.test(qr) ? await sessionByQr(qr) : null;
  if (!s) notFound();
  return <ShowGuest name="QrPage" qr={qr} title={s.i.title} />;
}
