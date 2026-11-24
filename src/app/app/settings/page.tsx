import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { settingsScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'الإعدادات' };
export default async function Page() {
  const p = await workspace('/app/settings', settingsScreen);
  return <Show name="Settings" {...p} />;
}
