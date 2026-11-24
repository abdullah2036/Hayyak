import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Signup from '@/screens/Signup';
import { getUser } from '@/server/lib/session';

export const metadata: Metadata = { title: 'أنشئ حسابك' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (await getUser()) redirect('/app');
  const q = await searchParams;
  return <Signup mode={q.mode} next={q.next} />;
}
