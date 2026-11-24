import type { Metadata } from 'next';
import { Show } from '@/screens';
import { id, workspace } from '@/server/page';
import { createScreen } from '@/server/services/screens';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'إنشاء دعوة' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const key = q.id ? id(q.id) : null;
  const p = await workspace('/app/create', (me) => createScreen(me, key));
  if (p.data.draft && p.data.draft.status !== 'draft') redirect(`/app/invitations/${p.data.draft.id}`);
  return <Show key={key || 'new'} name="Create" {...p} params={{ pattern: q.pattern, color: q.color }} />;
}
