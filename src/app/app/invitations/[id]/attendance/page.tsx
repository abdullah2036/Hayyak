import type { Metadata } from 'next';
import { Show } from '@/screens';
import { id, workspace } from '@/server/page';
import { attendanceScreen } from '@/server/services/screens';

export const metadata: Metadata = { title: 'الحضور والشهادات' };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const key = id((await params).id);
  const p = await workspace(`/app/invitations/${key}/attendance`, (me) => attendanceScreen(me, key));
  return <Show name="Attendance" {...p} />;
}
