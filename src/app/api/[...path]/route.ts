import { after, type NextRequest } from 'next/server';
import { handle } from '@/server/api/router';
import '@/server/api/routes';
import { flushOutbox } from '@/server/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function run(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const res = await handle(req, path);
  // Email that this request queued leaves after the answer is sent, so nobody waits for the mail server.
  if (req.method !== 'GET' && res.ok) after(() => flushOutbox(30).catch((e) => console.error('[mail]', e)));
  return res;
}
export { run as GET, run as POST, run as PATCH, run as DELETE };
