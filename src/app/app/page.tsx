import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { dashboard } from '@/server/services/screens';

export const metadata: Metadata = { title: 'لوحتك' };
export default async function Page() {
  const p = await workspace('/app/', dashboard);
  return <Show name="Dashboard" {...p} />;
}
