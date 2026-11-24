import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { reportScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'تقرير الفصل' };
export default async function Page() {
  const p = await workspace('/app/report', reportScreen);
  return <Show name="Report" {...p} />;
}
