# Hayyak — حيّــاك

Animated invitations with RSVP, attendance by code or QR, and certificates. Arabic, right to left.

- **Workspace** (`/app`): invitations, guest lists, sending, reminders, attendance, certificates, reports, credit, team.
- **Studio** (its own address, `STUDIO_URL`): the Hayyak team's admin: analytics, prices, beta and discounts, orders, credit, designs, requests, team, audit log.
- **Guest pages** (`/i/…`, `/a/…`, `/c/…`): the animated invitation, registration, check-in and certificate.

There is no payment gateway in this version. An order that a discount code makes free is credited at once; any other waits until the Studio confirms the money arrived.

## Run it on your computer

You need Node 22 or newer. No database to install: development uses an embedded Postgres in `.data/`.

```bash
npm install
cp .env.example .env.local
npm run seed:demo      # optional: a sample workspace, prints its password
npm run seed:admin -- you@example.com "Your name"
npm run dev            # http://localhost:3000 and http://localhost:3000/studio
```

Emails, including sign-in codes, are printed in the terminal. Stop the dev server before running a seed command, because the embedded database has one user at a time.

## Put it online

[docs/DEPLOY-NETLIFY.md](docs/DEPLOY-NETLIFY.md) for the beta (Netlify and Supabase), [docs/DEPLOY-FREE.md](docs/DEPLOY-FREE.md) for other free hosts (Heroku with student credit, or Render and Supabase), [docs/DEPLOY.md](docs/DEPLOY.md) for the paid setup (Railway).

## How it is built

| Part | What it uses |
|---|---|
| Web and API | Next.js (App Router), one Node process |
| Database | PostgreSQL through Drizzle; migrations in `drizzle/` |
| Email | Resend's or Brevo's API, or any SMTP server, through a queue with retries |
| Files | Images are re-encoded and kept in Postgres |
| Scheduled work | Inside the app (`RUN_SCHEDULER=1`) or `/api/cron/tick` |

```
src/app/          routes (thin: they load data and pick a screen)
src/screens/      one file per screen: state and behaviour
src/views/        markup of each screen, converted from the design
src/ui/           shared browser code: links, API client, capture, pattern engine
src/server/api/   router and the full list of API routes (routes.ts)
src/server/services/  business rules: invitations, credit, attendance, studio…
src/server/lib/   sessions, crypto, email, validation, rate limits
src/server/db/    schema
scripts/          migrate, first admin, demo data
tests/e2e.mjs     plays the product through the API, then attacks it
```

## Accounts and levels

| Where | Level | Can do |
|---|---|---|
| Workspace | owner | everything, including credit, team and settings |
| Workspace | manager | create and send invitations, guests, attendance, certificates |
| Workspace | viewer | look only |
| Studio | founder | everything, including prices, discounts, trial workspaces and the team |
| Studio | support | analytics, orders, requests, sends and customers |
| Studio | design | customisation requests, designs and patterns |

The exact permissions are in `src/server/lib/session.ts`.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run start:prod` | apply migrations, then start |
| `npm run typecheck` | TypeScript |
| `npm run test:e2e` | 340 product and security checks (run `build` first) |
| `npm run check:secrets` | looks for secrets in what git would publish; also runs on every commit |
| `npm run studio:reset -- email` | clears a lost Studio authenticator |
| `npm run db:generate` | new migration after changing the schema |
| `npm run seed:admin -- email "Name"` | first Studio founder |

## Security

See [docs/SECURITY.md](docs/SECURITY.md). Never commit `.env` files: they are ignored, and the repository is public.

## Fonts

The design's Thmanyah typeface is not included. See [docs/FONTS.md](docs/FONTS.md).
