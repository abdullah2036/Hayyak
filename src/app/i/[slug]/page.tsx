import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShowGuest } from '@/screens';
import { plain } from '@/server/page';
import { bySlug, publicState, viewOf } from '@/server/services/guest';
import { weekdayDate } from '@/lib/dates';

type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const inv = await bySlug((await params).slug);
  // A private invitation shows nothing to someone who only has the short link.
  if (!inv || inv.audience !== 'public') return { title: 'دعوة', robots: { index: false } };
  const t = `دعوة: ${inv.title}`;
  return { title: t, description: weekdayDate(inv.startsAt), robots: { index: false }, openGraph: { title: t, description: weekdayDate(inv.startsAt) } };
}
export default async function Page({ params }: P) {
  const inv = await bySlug((await params).slug);
  if (!inv || inv.audience !== 'public') notFound();
  return <ShowGuest name="PublicInvite" inv={plain(await viewOf(inv))} state={await publicState(inv)} />;
}
