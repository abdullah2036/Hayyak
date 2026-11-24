import type { Metadata } from 'next';
import { Show } from '@/screens';
import { id, workspace } from '@/server/page';
import { detail } from '@/server/services/screens';

export const metadata: Metadata = { title: 'تفاصيل الدعوة' };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const key = id((await params).id);
  const p = await workspace(`/app/invitations/${key}/`, (me) => detail(me, key));
  return <Show name="InviteDetail" {...p} />;
}
