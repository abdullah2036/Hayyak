import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { buyScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'شراء الرصيد' };
export default async function Page() {
  const p = await workspace('/app/buy', buyScreen);
  return <Show name="Subscribe" {...p} />;
}
