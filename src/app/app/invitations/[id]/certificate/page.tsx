import type { Metadata } from 'next';
import { Show } from '@/screens';
import { id, workspace } from '@/server/page';
import { certificateScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'إعداد الشهادة' };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const key = id((await params).id);
  const p = await workspace(`/app/invitations/${key}/certificate`, (me) => certificateScreen(me, key));
  return <Show name="Certificate" {...p} />;
}
