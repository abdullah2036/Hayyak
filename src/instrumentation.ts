/** On a long running server the scheduler lives inside the app. On serverless hosting use /api/cron/tick instead. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.RUN_SCHEDULER !== '1') return;
  const { tick } = await import('./server/services/scheduler');
  const run = () => tick().catch((e) => console.error('[scheduler]', e));
  setTimeout(run, 15_000);
  setInterval(run, 60_000).unref();
}
