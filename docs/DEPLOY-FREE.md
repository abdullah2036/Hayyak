# Running the beta for free

Two routes. Both keep the app and the database on services you can upgrade in place later, by changing a plan, without moving anything.

| | A. Heroku | B. Render + Supabase |
|---|---|---|
| Platforms | one | two |
| Cost now | $0 for 24 months with the student credit | $0, no end date |
| Needs a card | yes | not stated as required |
| Always on | yes | yes, with the timer below |
| Server | 512 MB, shared CPU | 512 MB, 0.1 CPU: signing in takes some seconds |
| Database | 1 GB class | 500 MB |
| Upgrade later | bigger dyno and Postgres plan | Render paid instance, Supabase Pro ($25) |

Choose A if one of you is a student with a card. Choose B otherwise. Email needs one more service on either route, because neither sends email for you.

Measured on a laptop: opening an invitation costs about 10 ms of processor time with its files, and memory peaked at 334 MB in the test suite. From that, B should carry a few openings per second and A many more. A beta of 400 to 1,000 visitors fits both.

## First: domain and email

1. Apply for the [GitHub Student Developer Pack](https://education.github.com/pack). It includes a year of a `.me` domain from Namecheap, a choice of endings from Name.com, and a `.tech` domain. Set the renewal price in your calendar; the second year is yours to pay.
2. [Resend](https://resend.com): add the domain and its DNS records, then make an API key that can only send. Free: 100 a day, 3,000 a month.

No domain yet? Use Brevo: verify your own address under **Senders**, make an API key, and set `BREVO_API_KEY` instead of `RESEND_API_KEY`. Brevo replaces the sender's ending with `@brevosend.com` and some mail lands in spam.

You will use two names on the domain: one for the site (`your-domain`) and one for the Studio that nobody would guess (`kv7-desk.your-domain`).

## Variables, both routes

| Variable | Value |
|---|---|
| `APP_URL` | `https://your-domain` |
| `STUDIO_URL` | `https://kv7-desk.your-domain` (your own choice) |
| `APP_SECRET`, `DATA_KEY`, `CRON_SECRET` | three different random values |
| `RESEND_API_KEY` | from Resend |
| `MAIL_FROM` | `Hayyak <no-reply@your-domain>` |
| `PASSWORD_SLOTS` | `1` |

Make each random value on your own computer and paste it in. Keep a copy of `DATA_KEY` in a password manager: without it, archived events and Studio authenticators cannot be read.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Route A: Heroku

1. Redeem the [Heroku student offer](https://www.heroku.com/github-students/): $13 a month for 24 months. Anything above $13 is charged to the card, and what you need costs $12, so add nothing else.
2. New app, region **Europe**. Under **Resources**: dyno type **Basic** ($7), and the **Heroku Postgres Essential-0** add-on ($5). It sets `DATABASE_URL` by itself.
3. **Settings → Config Vars**: the variables above, plus `DB_SSL` = `1`, `RUN_SCHEDULER` = `1`, `TRUSTED_PROXIES` = `1`.
4. **Deploy**: connect the GitHub repository, choose `main`, tick **Wait for CI**, and turn on automatic deploys. The `Procfile` applies migrations before each release.
5. **Settings → Domains**: add both names and create the DNS records shown.
6. **More → Run console**: `npm run seed:admin -- you@example.com "Your name"`
7. Backups, with the Heroku CLI: `heroku pg:backups:schedule DATABASE_URL --at "03:00 Asia/Riyadh" -a your-app`

Since February 2026 Heroku [only maintains its platform](https://www.heroku.com/blog/an-update-on-heroku/) and is not adding features. That is fine for this app, and it can move: it is a standard Node app with a standard Postgres.

## Route B: Render + Supabase

**Supabase**

1. New project, region Frankfurt, with a long generated password.
2. **Connect → Session pooler** (port 5432): copy the address, put the password in, and add `?sslmode=require` at the end. This is `DATABASE_URL`.
3. **Integrations → Data API: turn it off.** Supabase publishes tables through a public web API, and this app does not use it. The migrations also close every table to it, so this is the second lock.

**Render**

1. New web service from the repository, branch `main`, region Frankfurt, instance **Free**.
2. Build: `npm ci --include=dev && npm run build`. Start: `npm run start:prod`. Health check path: `/api/health`.
3. Environment: the variables above, plus `DATABASE_URL`, `DB_POOL` = `5`, `CLIENT_IP_HEADER` = `cf-connecting-ip`. Leave out `RUN_SCHEDULER`.
4. **Custom domains**: add both names.

**Timer, in Supabase → SQL Editor.** Free Render sleeps after 15 idle minutes. This wakes it and does the scheduled work. Put your own values in the two marked places:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;
select vault.create_secret('PASTE CRON_SECRET HERE', 'hayyak_cron');
select cron.schedule('hayyak', '*/10 * * * *', $$
  select net.http_get(
    url := 'https://YOUR-DOMAIN/api/cron/tick',
    headers := jsonb_build_object('Authorization', 'Bearer ' ||
      (select decrypted_secret from vault.decrypted_secrets where name = 'hayyak_cron'))
  )
$$);
```

**First founder**, from your computer in the project folder: make a file `.env.local` with the one line `DATABASE_URL=` and the address, run `npm run seed:admin -- you@example.com "Your name"`, then **delete that line**. While it is there, `npm run dev` uses the real database.

Keep in mind: Render says not to use free servers for production and may restart them; Supabase's free plan has no downloadable backups, so take one with `pg_dump` before each event; two free Supabase projects are allowed, so one can be your test copy.

## After either route

Open the Studio address, sign in, and save the recovery codes. The sign-in email shows the address the server saw: check that it is your own, because the limits on password guessing depend on it. If it is not, on Render remove `CLIENT_IP_HEADER` and set `TRUSTED_PROXIES` to `2`, then `3` if needed.

Then follow **Before inviting people** in [DEPLOY.md](DEPLOY.md).

## Why not Vercel's free plan

The app would run there, but the free plan is [for personal or non-commercial use only](https://vercel.com/legal/terms), and Vercel's [fair use rules](https://vercel.com/docs/limits/fair-use-guidelines) count asking visitors for payment, or advertising something for sale, as commercial. A price list and orders are both, even without a payment gateway. On Vercel Pro it is allowed: use Supabase's **transaction** pooler (port 6543), `DB_POOL=2`, region Frankfurt, a second `.vercel.app` name as `STUDIO_URL`, the timer above, and run `npm run db:migrate` from your computer before each deploy that has a new migration.
