import type { Metadata } from 'next';
import { Show } from '@/screens';
import { id, workspace } from '@/server/page';
import { journeyScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'رحلة المدعو' };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const key = id((await params).id);
  const p = await workspace(`/app/invitations/${key}/journey`, (me) => journeyScreen(me, key));
  return <Show name="GuestJourney" {...p} />;
}
