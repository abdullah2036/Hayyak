# Deploying Hayyak on Railway

No budget yet? [DEPLOY-FREE.md](DEPLOY-FREE.md) runs the beta for $0.

The app is its own backend: one Node process serves the pages and the API, and PostgreSQL is the only other service. It also does scheduled work (queued email, reminders, closing check-in, archiving), so it needs a host that keeps the process running.

You will end up with two separate copies:

| | Production | Staging |
|---|---|---|
| For | real beta users | your own testing, anything goes |
| Database | its own | its own |
| Address | your domain | a free Railway address |
| Email | everyone | only the addresses you list |

## Accounts you need

| Service | Why | Key you get |
|---|---|---|
| [Railway](https://railway.com) | hosting and database | none to copy |
| [Resend](https://resend.com) | all email, including sign-in codes | one API key |
| A domain registrar | your address, and sending email from it | none |

No other API keys are used. There is no payment, SMS, WhatsApp, maps or AI key in this version.

## 1. Production

1. **New project → Deploy from GitHub repo** and pick this repository. It will fail the first time because nothing is set yet.
2. In the same project: **+ New → Database → PostgreSQL**.
3. In both services' settings choose the same region. EU West (Amsterdam) is the closest to Saudi Arabia.
4. In the app service's **Settings**:
   - Build command: `npm run build`
   - Pre-deploy command: `npm run db:migrate`
   - Start command: `npm run start`
   - Healthcheck path: `/api/health`
   - Replicas: 1
5. In **Variables**, add the list below, then deploy.

### Variables

Make each secret on your own computer and paste it straight into Railway. Run this once per secret, so the three are different:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

| Variable | Value | Secret |
|---|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (typed exactly like this) | |
| `APP_URL` | `https://your-domain`, no slash at the end | |
| `STUDIO_URL` | `https://the-studio-address`, see step 3 | |
| `APP_SECRET` | generated | yes |
| `DATA_KEY` | generated | yes |
| `CRON_SECRET` | generated | yes |
| `RUN_SCHEDULER` | `1` | |
| `TRUSTED_PROXIES` | `1` (`2` if Cloudflare's proxy is in front) | |
| `RESEND_API_KEY` | from Resend | yes |
| `MAIL_FROM` | `Hayyak <no-reply@your-domain>` | |

For the four secrets, open the three-dot menu next to the variable and choose **Seal**, so nobody can read them in Railway afterwards. Keep a copy of `DATA_KEY` in a password manager first: without it, archived events and Studio authenticators cannot be read.

## 2. Domain and email

1. App service → **Settings → Networking → Custom Domain**: add your domain. Railway shows a CNAME and a TXT record. Add both where you bought the domain.
2. Resend → **Domains**: add the domain and its DNS records, then create an API key that can only send.
3. `APP_URL` must be exactly the address in the browser. Redeploy after changing it.

## 3. The Studio's own address

The admin panel does not exist on the public address: `/studio` there answers "not found", like any address that does not exist. It is served only on `STUDIO_URL`, and without that variable it is closed.

Pick one:

- **With your own domain:** add a second custom domain to the same service, with a name nobody would guess (not `admin.` or `studio.`), for example `https://kv7-desk.your-domain`. Set `STUDIO_URL` to it.
- **Without a domain, or fully separate:** add a second service from the same repository, generate a Railway domain for it, and give it the same variables except `RUN_SCHEDULER`, which stays empty. Set `STUDIO_URL` on both services to the second one's address.

Create the first founder. With the [Railway CLI](https://docs.railway.com/guides/cli): `railway login`, `railway link`, then:

```bash
railway ssh
npm run seed:admin -- you@example.com "Your name"
```

Open `STUDIO_URL`. You enter your email, then the code sent to it, then scan a QR code with an authenticator app. Save the eight recovery codes. Everyone else is added from the Studio's team page.

For one more lock, put the Studio address behind [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) or a VPN.

If somebody loses their phone and their recovery codes, another founder resets them from the team page. If it is the only founder: `railway ssh`, then `npm run studio:reset -- person@example.com`.

## 4. Staging

1. Environment menu at the top of the project → **+ New Environment → Duplicate Environment**, name it `staging`. This makes separate copies of the app and the database.
2. Review the staged changes. Before deploying, change these in the staging app service:

   | Variable | Staging value |
   |---|---|
   | `APP_URL` | a Railway address generated for staging |
   | `STUDIO_URL` | the same address as `APP_URL` is fine here |
   | `APP_SECRET`, `DATA_KEY`, `CRON_SECRET` | new ones (sealed variables are not copied) |
   | `RESEND_API_KEY` | a second key |
   | `APP_ENV` | `staging` |
   | `MAIL_ALLOW` | who may receive email there, for example `you@gmail.com,@your-domain` |

3. Check that staging's `DATABASE_URL` points at staging's own Postgres.
4. Set the branch staging deploys from, for example `staging`, and leave production on `main`.

With `APP_ENV=staging` the site shows a "نسخة اختبار" mark, search engines are told to stay away, and email to anyone outside `MAIL_ALLOW` is dropped.

## 5. Testing without touching real data

- **Everything, as often as you like:** staging, or your own computer (`npm run dev`).
- **A final check on the live site:** sign up normally, then in the Studio open **المستخدمين** and press **حساب تجربة** on that account. It leaves every number and report, and **امسح بياناته** empties it. Both actions stay in the audit log, as they should.

Checklist for a full run: sign up, take free credit, create a private invitation with an Excel list, send, open a personal link on a phone, confirm, save the video, create a public invitation and register on it, ask for a custom seal and deliver it from the Studio, open check-in, check in by code and by QR, download the certificate, read the report.

## 6. Beta testers, then launch

Anyone can sign up and gets the one-time trial (10 invitations). More than that costs money, unless you give it.

To give it free to your testers, open the Studio → **الأسعار والعروض** → **+ كود جديد**:

- 100%, with how many times it may be used, how many per account, and an end date
- for anyone who has the code, or for one account only

The tester types it on the buy page and the credit arrives at once. Other ways, in **المستخدمين**: **+ رصيد** adds credit directly, and **سعر خاص** gives one account a standing discount, where 100 means always free.

The same screen changes every pack price, the trial size, and has a switch that opens free credit to everyone. That switch is off; leave it off unless you want it. Changes apply at once, with no deploy.

## Before inviting people

- [ ] Sign-up code arrives and is not in spam.
- [ ] `https://your-domain/studio` shows "not found".
- [ ] Railway → Postgres → **Backups**: daily backups on, and one restored in staging to see that it works.
- [ ] Two-step verification on GitHub, Railway, Resend and the registrar.
- [ ] GitHub → Settings → Code security: secret scanning, push protection and Dependabot alerts on.
- [ ] Someone qualified has read `/privacy` and `/terms`, and checked what the Saudi Personal Data Protection Law asks when guest data is hosted outside the Kingdom.

## Other hosts

**A VPS** (choose this if the data must stay in a particular country): Node 22, PostgreSQL, the same variables, `npm ci && npm run build && npm run start:prod` under systemd, with Caddy or nginx in front passing the original `Host`. Only the proxy may reach the app's port.

**Vercel** works with limits: it allows 4.5 MB per request by default while photos here may be 10 MB, so large uploads fail; `RUN_SCHEDULER` stays empty and something must call `GET /api/cron/tick` every minute with `Authorization: Bearer <CRON_SECRET>`; use a pooled database address and `DB_POOL=2`.

## Updating

Work on a branch, open a pull request, and wait for the **check** action. Merging to `main` deploys production. Migrations run before the new version starts and are safe to run again.

When you change the schema: edit `src/server/db/schema.ts`, run `npm run db:generate`, read the SQL, and commit it with the change.

## If something is wrong

| You see | Check |
|---|---|
| Every form answers 403 | `APP_URL` (or `STUDIO_URL` in the Studio) is not exactly the address in the browser |
| The Studio address says "not found" | `STUDIO_URL` is missing or different from that address |
| 500 on everything, `/api/health` fails | `DATABASE_URL`, then the service log |
| "must be set to at least 32 characters" in the log | `APP_SECRET` or `DATA_KEY` is missing |
| No emails | lines starting with `[mail]` in the log, then the domain's status in Resend |
| Reminders never go out | `RUN_SCHEDULER=1` is missing |
| People are rate limited together | `TRUSTED_PROXIES` is too low, so everyone looks like the proxy |
