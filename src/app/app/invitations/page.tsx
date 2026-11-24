import type { Metadata } from 'next';
import { Show } from '@/screens';
import { workspace } from '@/server/page';
import { invitationsScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'الدعوات' };
export default async function Page() {
  const p = await workspace('/app/invitations', invitationsScreen);
  return <Show name="Invitations" {...p} />;
}
