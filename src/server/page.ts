import 'server-only';
import { redirect, notFound as next404 } from 'next/navigation';
import { AppError } from './lib/core';
import { getStaff, getUser, permsOf, type UserCtx } from './lib/session';
import { shell } from './services/screens';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Guards a workspace page: signed in, and only their own data. */
export async function workspace<T>(path: string, load: (me: UserCtx) => Promise<T>) {
  const me = await getUser();
  if (!me) redirect(`/signup?mode=old&next=${encodeURIComponent(path)}`);
  try {
    const [sh, data] = await Promise.all([shell(me), load(me)]);
    // Only plain data crosses to the browser.
    return JSON.parse(JSON.stringify({ shell: sh, data })) as { shell: typeof sh; data: T };
  } catch (e) {
    if (e instanceof AppError && e.status === 404) next404();
    throw e;
  }
}
export function id(v: string) {
  if (!UUID.test(v)) next404();
  return v;
}
export async function studioPage() {
  const me = await getStaff();
  if (!me) redirect('/studio/login');
  return { me, perms: permsOf(me.staff.role) };
}
export const plain = <T>(v: T): T => JSON.parse(JSON.stringify(v));
