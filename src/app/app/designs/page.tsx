import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { designsScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'التصاميم' };
export default async function Page() {
  const p = await workspace('/app/designs', designsScreen);
  return <Show name="Designs" {...p} />;
}
