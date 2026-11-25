# Running the beta for $0

Good for a small group of testers. Move to [a paid host](DEPLOY.md) before a real launch: Render itself says not to use its free servers for production.

| Part | Service | Free limit |
|---|---|---|
| App | [Render](https://render.com/docs/free) | 512 MB, 0.1 CPU, 750 hours a month, sleeps after 15 idle minutes |
| Database | [Neon](https://neon.com/pricing) | 1 GB, 100 compute hours a month, no end date, no card |
| Email | [Resend](https://resend.com/pricing) with a domain, or Brevo without one | Resend 100 a day; Brevo 300 a day |
| Timer | [cron-job.org](https://cron-job.org/en/) | free |

What to expect: signing in takes a few seconds, because checking a password is slow on purpose and the server is small. If the site slept, the first visitor waits about a minute. The app was measured at 334 MB at its busiest in the test suite.

## 1. Database: Neon

1. New project, region **Frankfurt** (aws-eu-central-1).
2. Copy the connection string with **connection pooling turned off**. It starts with `postgresql://` and ends with `sslmode=require`. Treat it like a password.

## 2. Email

Sign-up and Studio sign-in send codes by email, so do this first.

- **You have a domain:** Resend → add the domain and its DNS records → create an API key that can only send. Without a verified domain Resend only sends to your own address.
- **No domain:** Brevo → **Senders** → add and verify your own email address → **SMTP & API → API keys**. Because the address is not on a domain you own, Brevo replaces its ending with `@brevosend.com`, and some messages will land in spam. Tell your testers to look there.

## 3. App: Render

**New → Web Service**, choose the GitHub repository and branch `main`.

| Setting | Value |
|---|---|
| Region | Frankfurt, same as the database |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm run start:prod` |
| Instance type | Free |
| Health check path | `/robots.txt` |

Do not use `/api/health` here. Render calls it all day, which keeps the database awake and uses up Neon's free hours in about two weeks.

Environment variables (Render can **Generate** the three secrets):

| Variable | Value |
|---|---|
| `DATABASE_URL` | from Neon |
| `APP_URL` | this service's address, `https://….onrender.com` |
| `STUDIO_URL` | the Studio service's address, step 4 |
| `APP_SECRET`, `DATA_KEY`, `CRON_SECRET` | generated. Keep a copy of `DATA_KEY` |
| `RESEND_API_KEY` or `BREVO_API_KEY` | from step 2 |
| `MAIL_FROM` | `Hayyak <the verified address>` |
| `CLIENT_IP_HEADER` | `cf-connecting-ip` |
| `PASSWORD_SLOTS` | `1` |
| `DB_POOL` | `5` |
| `RUN_SCHEDULER` | leave it out: the timer in step 5 does this |

## 4. The Studio's own address

A second Render web service from the same repository, with a name nobody would guess. Same settings and the same variables, so the secrets must be identical. Put its address in `STUDIO_URL` on **both** services. It may sleep; it only uses hours while you work in it.

If you own a domain, skip the second service: add a second custom domain to the first one and use that as `STUDIO_URL`.

Create the first founder from your own computer, in the project folder, after the first deploy worked:

1. Make a file named `.env.local` with one line: `DATABASE_URL=` followed by the Neon address. Git ignores this file.
2. Run `npm run seed:admin -- you@example.com "Your name"`.
3. **Delete that line again.** While it is there, `npm run dev` on your computer uses the real database.

Open the Studio address and sign in. The sign-in email shows the address the server saw. Check that it is your own (search "what is my ip"), because the limits on password guessing depend on it. If it is not, remove `CLIENT_IP_HEADER`, set `TRUSTED_PROXIES` to `2` on both services, and try again with `3` if needed.

## 5. Timer: cron-job.org

Two jobs:

| Job | Address | When | Header |
|---|---|---|---|
| Work | `https://….onrender.com/api/cron/tick` | every 30 minutes, 7:00 to 1:00 | `Authorization: Bearer <CRON_SECRET>` |
| Stay awake | `https://….onrender.com/robots.txt` | every 10 minutes, 7:00 to 1:00 | none |

The work job sends reminders, scheduled invitations and queued email, so reminders can be up to half an hour late. Every 30 minutes is chosen to stay inside Neon's free hours. Both jobs stop at night so the two services together stay under Render's 750 hours; the first visitor at night waits for the site to wake.

## Keep in mind

- **Backups:** Neon's free plan keeps 6 hours of history and one manual snapshot. Make a snapshot before each event.
- **Tell testers it is a beta** and that their data may be lost.
- **Running out:** past Neon's compute hours the database pauses until the next month; past Render's hours the services stop until then. Nothing is deleted.
- **Testing your own changes:** use your computer (`npm run dev`), not a second free copy, so the hours last.

## Other free routes

- **Railway's trial:** $5 once, for 30 days, after which the [free plan](https://docs.railway.com/reference/pricing/free-trial) gives $1 a month. That covers roughly a week of this app running all day. Fine for a short test.
- **A student on the team:** the [GitHub Student Developer Pack](https://education.github.com/pack) includes a free domain for a year, and [Heroku credit](https://www.heroku.com/github-students/) of $13 a month for 24 months. A Basic dyno ($7) and the smallest Postgres ($5) are always on and cost $12. Heroku asks for a card.
- **Oracle Cloud:** its [always-free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) server (2 cores, 12 GB) exists in Riyadh and Jeddah, so the data stays in the Kingdom. You manage the server yourself, and idle ones can be reclaimed.
- **Not Vercel's free plan:** its [terms](https://vercel.com/legal/terms) allow only personal or non-commercial use.
