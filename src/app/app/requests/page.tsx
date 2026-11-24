import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { requestsScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'طلبات التخصيص' };
export default async function Page() {
  const p = await workspace('/app/requests', requestsScreen);
  return <Show name="Requests" {...p} />;
}
