import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { guestsScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'المدعوين' };
export default async function Page() {
  const p = await workspace('/app/guests', guestsScreen);
  return <Show name="Guests" {...p} />;
}
