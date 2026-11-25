import 'server-only';
import { and, asc, eq, lt, lte, sql } from 'drizzle-orm';
import { db, outbox, guests } from '../db';

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
/** Header values must never contain line breaks, otherwise extra headers could be injected. */
const BREAKS = new RegExp('[\r\n\u2028\u2029]+', 'g');
const oneLine = (s: string) => s.replace(BREAKS, ' ').trim().slice(0, 180);

export type Mail = {
  to: string;
  subject: string;
  title: string;
  lines: string[];
  code?: string;
  button?: { label: string; url: string };
  fromName?: string;
  note?: string;
  guestId?: string;
  /** Codes are sent immediately; everything else goes through the queue. */
  now?: boolean;
};

function layout(m: Mail) {
  const p = m.lines.map((l) => `<p style="margin:0 0 12px;font-size:16px;line-height:1.9;color:#2C4A5C;white-space:pre-line">${escapeHtml(l)}</p>`).join('');
  const code = m.code ? `<div dir="ltr" style="margin:18px 0;font-size:34px;font-weight:700;letter-spacing:10px;text-align:center;color:#0A2A43;background:#E6F6F9;border-radius:18px;padding:16px">${escapeHtml(m.code)}</div>` : '';
  const btn = m.button ? `<p style="margin:20px 0"><a href="${escapeHtml(m.button.url)}" style="display:inline-block;background:#0A2A43;color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 30px;border-radius:999px">${escapeHtml(m.button.label)}</a></p>` : '';
  return `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#EDF1F3;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif"><div style="max-width:560px;margin:0 auto;padding:28px 16px"><div style="background:#fff;border-radius:28px;padding:30px"><div style="font-size:26px;font-weight:700;color:#0E97AE;margin-bottom:14px">حيّــاك</div><h1 style="font-size:22px;margin:0 0 14px;color:#0A2A43">${escapeHtml(m.title)}</h1>${p}${code}${btn}${m.note ? `<p style="margin:18px 0 0;font-size:13px;color:#4A5B68">${escapeHtml(m.note)}</p>` : ''}</div></div></body></html>`;
}

type Letter = { to: string; fromName: string; subject: string; text: string; html: string };
type Transport = { sendMail: (o: Record<string, unknown>) => Promise<unknown> };
const g = globalThis as unknown as { __hayyakMail?: Transport };

async function transport(): Promise<Transport | null> {
  if (!process.env.SMTP_URL) return null;
  if (!g.__hayyakMail) {
    const nm = await import('nodemailer');
    g.__hayyakMail = nm.createTransport(process.env.SMTP_URL) as unknown as Transport;
  }
  return g.__hayyakMail;
}

function fromHeader(name: string) {
  const raw = process.env.MAIL_FROM || 'Hayyak <no-reply@localhost>';
  const addr = raw.match(/<([^>]+)>/)?.[1] || raw;
  return { name: oneLine(name), address: addr };
}

/** Resend's HTTPS API. Some hosts (Railway below the Pro plan) block SMTP. */
async function viaResend(key: string, m: Letter) {
  const from = fromHeader(m.fromName);
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15_000),
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: `"${from.name.replace(/["\\<>]/g, '')}" <${from.address}>`, to: [m.to], subject: m.subject, text: m.text, html: m.html }),
  });
  // The reason stays in our own log; it is never shown to a visitor.
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

/** Brevo's HTTPS API. It can send from a verified address without a domain of your own (it then rewrites the sender). */
async function viaBrevo(key: string, m: Letter) {
  const from = fromHeader(m.fromName);
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15_000),
    headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name: from.name, email: from.address }, to: [{ email: m.to }], subject: m.subject, textContent: m.text, htmlContent: m.html }),
  });
  if (!r.ok) throw new Error(`Brevo ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

/** On a staging copy, only the listed addresses (or @domains) ever receive email. */
function blocked(to: string) {
  if (process.env.APP_ENV !== 'staging') return false;
  const allow = (process.env.MAIL_ALLOW || '').toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
  const t = to.toLowerCase();
  return !allow.some((a) => (a.startsWith('@') ? t.endsWith(a) : t === a));
}

async function deliver(m: Letter) {
  if (blocked(m.to)) {
    console.log('[mail] staging: not sent, the address is not in MAIL_ALLOW');
    return;
  }
  if (process.env.RESEND_API_KEY) return viaResend(process.env.RESEND_API_KEY, m);
  if (process.env.BREVO_API_KEY) return viaBrevo(process.env.BREVO_API_KEY, m);
  const t = await transport();
  if (!t) {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_SECRETS !== '1') throw new Error('Set RESEND_API_KEY, BREVO_API_KEY or SMTP_URL');
    // Development: print the message (or write it to MAIL_FILE for tests), so sign-up works without an email account.
    const line = { to: m.to, subject: m.subject, text: m.text };
    if (process.env.MAIL_FILE) (await import('node:fs')).appendFileSync(process.env.MAIL_FILE, `${JSON.stringify(line)}\n`);
    if (process.env.MAIL_SILENT !== '1') console.log(`\n[mail] to ${m.to}\n[mail] ${m.subject}\n${m.text}\n`);
    return;
  }
  await t.sendMail({ to: m.to, from: fromHeader(m.fromName), subject: m.subject, text: m.text, html: m.html });
}

export async function send(m: Mail) {
  const row = {
    toEmail: m.to,
    fromName: oneLine(m.fromName || 'حيّــاك'),
    subject: oneLine(m.subject),
    text: [m.title, ...m.lines, m.code || '', m.button ? `${m.button.label}: ${m.button.url}` : '', m.note || ''].filter(Boolean).join('\n'),
    html: layout(m),
  };
  if (m.now) return deliver({ to: row.toEmail, fromName: row.fromName, subject: row.subject, text: row.text, html: row.html });
  const d = await db();
  await d.insert(outbox).values({ ...row, guestId: m.guestId || null });
}

/** Sends queued email. Rows are claimed with SKIP LOCKED so two workers never send the same message. */
export async function flushOutbox(max = 60) {
  const d = await db();
  let sent = 0;
  for (let i = 0; i < max; i++) {
    const done = await d.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(outbox)
        .where(and(eq(outbox.status, 'queued'), lte(outbox.notBefore, new Date()), lt(outbox.attempts, 5)))
        .orderBy(asc(outbox.createdAt))
        .limit(1)
        .for('update', { skipLocked: true });
      if (!row) return true;
      try {
        await deliver({ to: row.toEmail, fromName: row.fromName, subject: row.subject, text: row.text, html: row.html });
        // The body holds personal data and links, so it is dropped once delivered.
        await tx.update(outbox).set({ status: 'sent', sentAt: new Date(), text: '', html: '' }).where(eq(outbox.id, row.id));
        if (row.guestId) await tx.update(guests).set({ sentAt: sql`coalesce(${guests.sentAt}, now())` }).where(eq(guests.id, row.guestId));
        sent++;
      } catch (e) {
        const n = row.attempts + 1;
        console.error(`[mail] try ${n} failed:`, (e as Error).message);
        await tx
          .update(outbox)
          .set({ attempts: n, error: String((e as Error).message).slice(0, 300), status: n >= 5 ? 'failed' : 'queued', notBefore: new Date(Date.now() + 60_000 * 2 ** n) })
          .where(eq(outbox.id, row.id));
      }
      return false;
    });
    if (done) break;
  }
  return sent;
}
