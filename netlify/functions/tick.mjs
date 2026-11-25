/**
 * Netlify runs this every half hour: reminders, scheduled invitations, queued email, archiving.
 * A scheduled function has no public address. Other hosts ignore this file.
 */
export default async () => {
  // The Studio's project is built from the same files; only the site's own project does the work.
  if (process.env.URL && new URL(process.env.URL).host !== new URL(process.env.APP_URL).host) return;
  const r = await fetch(`${process.env.APP_URL}/api/cron/tick`, { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` }, signal: AbortSignal.timeout(25_000) });
  if (!r.ok) console.error('[tick]', r.status);
};
export const config = { schedule: '*/30 * * * *' };
