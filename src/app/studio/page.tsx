import type { Metadata } from 'next';
import { Show } from '@/screens';
import { plain, studioPage } from '@/server/page';
import { studioData } from '@/server/services/studio';

export const metadata: Metadata = { title: 'الاستوديو', robots: { index: false } };
export default async function Page() {
  const { me, perms } = await studioPage();
  return <Show name="Admin" data={plain(await studioData(me))} perms={perms} />;
}
