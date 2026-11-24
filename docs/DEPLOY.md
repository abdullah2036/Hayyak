# Deploying Hayyak

## Recommended: Railway, one app and one Postgres

Hayyak is a normal Node server that also does scheduled work: sending queued email, reminders, closing check-in, archiving. A host that keeps the process running suits it best.

**Backend:** the app itself is the backend. The same Next.js process serves the pages and the API, and PostgreSQL is the only other service. Nothing like Firebase or Supabase Auth is needed.

### 1. Create the services

1. On [railway.com](https://railway.com) make a new project, choose **Deploy from GitHub repo**, and pick this repository.
2. In the same project add **Database → PostgreSQL**.
3. Choose the region nearest your guests for **both** services. Railway's closest one to Saudi Arabia is usually EU West (Amsterdam).

### 2. Set the app's variables

Make the three secrets on your own computer, one command each, and paste them straight into Railway:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

| Variable | Value |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (a Railway reference, so nothing is copied) |
| `APP_URL` | `https://your-domain` with no trailing slash. Must match the address people use |
| `APP_SECRET` | first generated secret |
| `DATA_KEY` | second generated secret |
| `CRON_SECRET` | third generated secret |
| `RUN_SCHEDULER` | `1` |
| `TRUSTED_PROXIES` | `1` (`2` if you put Cloudflare's proxy in front) |
| `RESEND_API_KEY` | from Resend, see step 4 |
| `MAIL_FROM` | `Hayyak <no-reply@your-domain>` |

Keep a copy of `DATA_KEY` in a password manager. Without it, archived events cannot be read. Changing `APP_SECRET` signs everyone out.

### 3. Set the commands

In the service's settings:

- **Build command:** `npm run build`
- **Start command:** `npm run start:prod` (applies migrations, then starts)
- **Healthcheck path:** `/api/health`
- **Replicas:** 1. More than one works, but every replica would run the scheduler.

### 4. Email

Sign-up and sign-in send codes by email, so the site is not usable until this works.

1. Create an account at [resend.com](https://resend.com) and add your domain. It gives you DNS records (SPF and DKIM) to add.
2. Create an API key limited to sending, and put it in `RESEND_API_KEY`.

Railway only allows SMTP on its Pro plan, which is why the API is used here. On other hosts you can use any SMTP provider with `SMTP_URL` instead.

### 5. Domain

Add your domain in the service's **Networking** settings and create the DNS record it shows. HTTPS is automatic. Then make sure `APP_URL` is that address and redeploy.

### 6. Create the first Studio founder

With the [Railway CLI](https://docs.railway.com/guides/cli), inside the project:

```bash
railway ssh
npm run seed:admin -- you@example.com "Your name"
```

Sign in at `https://your-domain/studio/login` with the code that arrives by email. Everyone else is added from the Studio's team page.

### 7. Before announcing it

- [ ] Sign up with a new address; the code arrives and is not in spam.
- [ ] Send a test invitation, open it on a phone, confirm, and save the video.
- [ ] Open a check-in session and check in with the code.
- [ ] Buy credit, then confirm the order from the Studio.
- [ ] Turn on Postgres backups in Railway and restore one once, to a throwaway database.
- [ ] Turn on two-step verification on GitHub, Railway, Resend and the domain registrar.
- [ ] Have someone qualified read `/privacy` and `/terms`, and check what the Saudi Personal Data Protection Law asks of you when guest data is hosted outside the Kingdom.

## Other hosts

**A VPS (Hetzner, DigitalOcean, a Saudi provider).** Choose this if the data must stay in a particular country. Install Node 22 and PostgreSQL, set the same variables, run `npm ci && npm run build && npm run start:prod` under systemd, and put Caddy or nginx in front for HTTPS. Use `TRUSTED_PROXIES=1` and make sure only the proxy can reach the app's port.

**Vercel with Neon or Supabase Postgres.** It works, with limits:

- Leave `RUN_SCHEDULER` empty and have something call `GET /api/cron/tick` every minute with the header `Authorization: Bearer <CRON_SECRET>`. Vercel's free plan only runs cron jobs once a day.
- Requests are limited to 4.5 MB by default, and photo uploads here may be up to 10 MB.
- Use the pooled connection string and `DB_POOL=2`. Run `npm run db:migrate` from your computer before each deploy that has a new migration.

## Updating

Push to `main` and the host redeploys. Migrations run at start and are safe to run again.

When you change the schema: edit `src/server/db/schema.ts`, run `npm run db:generate`, read the generated SQL, and commit it with the change.

## If something is wrong

| You see | Check |
|---|---|
| Every form answers 403 | `APP_URL` is not exactly the address in the browser |
| 500 on everything, `/api/health` fails | `DATABASE_URL`, then the service log |
| "must be set to at least 32 characters" in the log | `APP_SECRET` or `DATA_KEY` is missing |
| No emails | the log, then the domain's status in Resend, then spam |
| Reminders never go out | `RUN_SCHEDULER=1` is missing, or the cron call is failing |
| People are rate limited together | `TRUSTED_PROXIES` is too low, so everyone looks like the proxy |
