# Deploy today: Vercel + Supabase

About 30 minutes. Both are free with no end date, never sleep, and upgrade in place.

**Read first.** Vercel's free plan is [for personal or non-commercial use](https://vercel.com/legal/terms). A free beta that sells nothing is the safest reading of that; a price list or taking orders is not. Move the project to Vercel Pro ($20 a month, one click, same site) before you sell.

## 1. Supabase (database)

1. New project, region **Central EU (Frankfurt)**, long generated password.
2. **Integrations → Data API → turn it off.** The migrations lock the tables too; this is the second lock.
3. **Connect → Transaction pooler** (port 6543). Copy it, put the password in, add `?sslmode=require` at the end. This is `DATABASE_URL`.

## 2. Email

- With a domain: Resend → add the domain → API key that can only send → `RESEND_API_KEY`.
- Without one: Brevo → verify your own address as a sender → API key → `BREVO_API_KEY`. Some mail lands in spam.

## 3. Vercel

1. **Add New → Project**, pick the repository. Leave the build settings as they are.
2. **Environment Variables**, all for **Production only**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | from step 1 |
| `APP_URL` | your site's address, for example `https://your-domain` |
| `STUDIO_URL` | a second address nobody would guess, for example `https://kv7-desk.your-domain` |
| `APP_SECRET`, `DATA_KEY`, `CRON_SECRET` | three different random values. Keep a copy of `DATA_KEY` |
| `RESEND_API_KEY` or `BREVO_API_KEY` | from step 2 |
| `MAIL_FROM` | `Hayyak <the sender address>` |
| `DB_POOL` | `3` |

   One random value: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

3. **Deploy.** The tables are created during the production build.
4. **Settings → Domains**: add both addresses. No domain yet? Use two free `.vercel.app` names for now and change `APP_URL` and `STUDIO_URL` later (then redeploy).

## 4. Timer (reminders, queued email)

Supabase → **SQL Editor**, with your own values in the two marked places:

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

It also keeps Supabase awake, which otherwise pauses free projects after a week without use.

## 5. First founder

On your computer, in the project folder: make `.env.local` with one line, `DATABASE_URL=` and the address from step 1. Run `npm install`, then `npm run seed:admin -- you@example.com "Your name"`. **Delete that line again**, or `npm run dev` will use the real database.

Open `STUDIO_URL`, sign in, save the recovery codes. The sign-in email shows the address the server saw; it should be yours.

## Check

- [ ] `https://your-domain/studio` says not found, `STUDIO_URL` shows the sign-in.
- [ ] Sign up with a new address; the code arrives.
- [ ] Make a 100% code in **الأسعار والعروض** and use it on the buy page.
- [ ] Send yourself an invitation and open it on a phone.

## Limits of the free plans

Supabase: 500 MB, no downloadable backups (take a `pg_dump` before an event), two projects, so one can be a test copy. Vercel: 100 GB of traffic and 4 hours of processor time a month; past that the site pauses until the month turns or you upgrade.
