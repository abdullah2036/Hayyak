import type { Metadata } from 'next';
import { ShowGuest } from '@/screens';
import { id, workspace } from '@/server/page';
import { viewOf } from '@/server/services/guest';
import { own } from '@/server/services/invitations';

export const metadata: Metadata = { title: 'معاينة الدعوة' };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const key = id((await params).id);
  const p = await workspace(`/app/invitations/${key}/preview`, async (me) => viewOf(await own(me.org.id, key)));
  return <ShowGuest name="InvitePreview" inv={p.data} />;
}
