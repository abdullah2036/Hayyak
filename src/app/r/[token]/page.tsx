import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Show } from '@/screens';
import { plain } from '@/server/page';
import { sharedReport } from '@/server/services/screens';

export const metadata: Metadata = { title: 'تقرير الفصل', robots: { index: false } };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const r = await sharedReport((await params).token);
  if (!r) notFound();
  return <Show name="Report" data={plain(r)} shell={null} />;
}
