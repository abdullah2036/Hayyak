import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShowGuest } from '@/screens';
import { plain } from '@/server/page';
import { byToken, guestView } from '@/server/services/guest';
import { weekdayDate } from '@/lib/dates';

type P = { params: Promise<{ slug: string; token: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await params;
  const r = await byToken(p.slug, p.token);
  if (!r) return { title: 'دعوة', robots: { index: false } };
  const t = `${r.g.name.split(' ')[0]}، عندك دعوة`;
  return { title: t, description: `${r.inv.title} · ${weekdayDate(r.inv.startsAt)}`, robots: { index: false }, openGraph: { title: t, description: `${r.inv.title} · ${weekdayDate(r.inv.startsAt)}` } };
}
export default async function Page({ params }: P) {
  const p = await params;
  const r = await byToken(p.slug, p.token);
  if (!r) notFound();
  return <ShowGuest name="GuestPage" view={plain(await guestView(r.inv, r.g))} />;
}
