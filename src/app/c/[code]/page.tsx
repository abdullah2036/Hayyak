import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShowGuest } from '@/screens';
import { plain } from '@/server/page';
import { certByCode } from '@/server/services/guest';

export const metadata: Metadata = { title: 'شهادة', robots: { index: false } };
export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const c = await certByCode((await params).code);
  if (!c) notFound();
  return <ShowGuest name="CertPage" cert={plain(c)} />;
}
