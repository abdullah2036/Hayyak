import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { accountScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'حسابي' };
export default async function Page() {
  const p = await workspace('/app/account', accountScreen);
  return <Show name="Account" {...p} />;
}
