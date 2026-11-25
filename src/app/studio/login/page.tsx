import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Show } from '@/screens';
import { getStaff } from '@/server/lib/session';
import { studioHere } from '@/server/page';

export const metadata: Metadata = { title: 'دخول الاستوديو', robots: { index: false } };
export default async function Page() {
  await studioHere();
  if (await getStaff()) redirect('/studio');
  return <Show name="AdminLogin" />;
}
