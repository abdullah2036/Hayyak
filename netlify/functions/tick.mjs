/**
 * Netlify runs this every half hour: reminders, scheduled invitations, queued email, archiving.
 * A scheduled function has no public address. Other hosts ignore this file.
 */
export default async () => {
  const r = await fetch(`${process.env.APP_URL}/api/cron/tick`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` }, signal: AbortSignal.timeout(25_000) });
  if (!r.ok) console.error('[tick]', r.status);
};
export const config = { schedule: '*/30 * * * *' };
