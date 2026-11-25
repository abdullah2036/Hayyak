# Deploy: Netlify + Supabase

Both are free with no end date, do not sleep, allow commercial projects, and upgrade in place.

## The fast way

1. Supabase: new project in **East US (Ohio)**. **Connect → Transaction pooler**: copy the address. **Integrations → Data API: turn it off.**
2. Email, with no domain: a Gmail account. Turn on **2-Step Verification**, then make an app password at myaccount.google.com/apppasswords. About 500 messages a day.
3. On your computer: `git clone https://github.com/abdullah2036/Hayyak.git`, `cd Hayyak`, `npm install`, `npm run setup`. It asks a few questions, gives you one command to run in Supabase's SQL Editor (the app's own database user, so the main password is never used), creates and locks the tables, adds you as the first founder, sends a test email, and writes `.env.netlify`.
4. Netlify: **Add new project → Import from GitHub → Hayyak**, branch `main`. Give it the site name you typed. Add the environment variables with **Import from a .env file** and paste all of `.env.netlify`. Deploy.
5. The same again for the Studio, with the second name. Then, in that project, **Build & deploy → Continuous deployment → Build status: Stopped builds**, so it does not use credits on every push. Start a build by hand when you want it updated.
6. Save `DATA_KEY` in a password manager, then delete `.env.netlify`.

The rest of this page explains the parts, and the domain for later.

## 1. Supabase (database)

1. New project, region **East US (Ohio)**: Netlify's free functions run there, and the two must be close.
2. **Integrations → Data API → turn it off.** The migrations lock the tables too; this is the second lock.
3. **Connect → Transaction pooler** (port 6543). Copy it, put the password in, add `?sslmode=require` at the end. This is `DATABASE_URL`.

## 2. Email

- With a domain: [Resend](https://resend.com) → add the domain → API key that can only send → `RESEND_API_KEY`.
- Without one yet: Gmail with an app password, as `SMTP_URL` = `smtps://you%40gmail.com:<app-password>@smtp.gmail.com:465` (`npm run setup` writes it for you), and `MAIL_FROM` the same address. About 500 messages a day. Brevo also works (`BREVO_API_KEY`).

## 3. Netlify

1. **Add new project → Import from GitHub**, pick the repository and branch `main`. Leave the build settings as found. Change the project's name to something short.
2. **Project configuration → Environment variables:**

| Variable | Value |
|---|---|
| `DATABASE_URL` | from step 1 |
| `APP_URL` | the site's address, no slash at the end |
| `STUDIO_URL` | the Studio's address, see step 4 |
| `APP_SECRET`, `DATA_KEY`, `CRON_SECRET` | three different random values. Keep a copy of `DATA_KEY` |
| `SMTP_URL`, `RESEND_API_KEY` or `BREVO_API_KEY` | from step 2 |
| `MAIL_FROM` | `Hayyak <the sender address>` |
| `CLIENT_IP_HEADER` | `x-nf-client-connection-ip` |
| `DB_POOL` | `3` |
| `PASSWORD_SLOTS` | `1` |

   One random value: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

   Mark the secrets as **secret values**. Do not change the branch deploys setting to use these: they are for the live site.
3. Deploy. The tables are created during the build. Reminders and queued email run by themselves every half hour.

## 4. The domain

### Free, with the GitHub Student pack

1. Apply at [education.github.com/pack](https://education.github.com/pack) with your university email and a dated student ID. Approval can take a while, so do it first.
2. In the pack, open **Namecheap**, sign in with GitHub, and claim one `.me` name for a year. If it offers to set up GitHub Pages, skip that. (Name.com and `.tech` are the other free choices in the pack.)
3. Netlify → **Domain management → Add a domain**, enter it, choose **Netlify DNS**. It shows four nameservers.
4. Namecheap → **Domain List → Manage → Nameservers → Custom DNS**, paste the four, save. It can take some hours. Netlify makes the HTTPS certificate by itself.
5. Netlify → **Add a domain alias**: a name nobody would guess, for example `kv7-desk.your-domain`. This is the Studio.
6. Set `APP_URL` and `STUDIO_URL` to the two names and deploy again. Add Resend's records in Netlify DNS.

Put the renewal date in your calendar: the second year is yours to pay.

### Launching before the domain arrives

Use the `.netlify.app` name as `APP_URL`, and make a second Netlify project from the same repository, with a random name and the same variables, as `STUDIO_URL`. When the domain is ready, do steps 3 to 6 and delete the second project. Netlify sends visitors of the old name to the new one, so invitations already sent keep working.

## 5. First founder

On your computer, in the project folder: make `.env.local` with one line, `DATABASE_URL=` and the address from step 1. Run `npm install`, then `npm run seed:admin -- you@example.com "Your name"`. **Delete that line again**, or `npm run dev` will use the real database.

Open `STUDIO_URL`, sign in, save the recovery codes. The sign-in email shows the address the server saw; it should be yours.

## Check

- [ ] `APP_URL/studio` says not found, and `STUDIO_URL` shows the sign-in.
- [ ] Sign up with a new address; the code arrives.
- [ ] Make a 100% code in **الأسعار والعروض** and use it on the buy page.
- [ ] Send yourself an invitation, open it on a phone, save the video.

## Free limits, and growing

- **Netlify:** 300 credits a month. Each deploy of `main` costs 15, so push to `main` when it matters, not for every change. About 1,000 visitors should use well under 100. If the credits run out the site is **paused until the month turns**, so look at the usage page weekly. Paid plans add credits to the same project.
- **Supabase:** 500 MB and no downloadable backups (take a `pg_dump` before an event). Pro adds both to the same project. Free projects pause after a week without use; the timer prevents that.
- **Resend:** 100 emails a day.
