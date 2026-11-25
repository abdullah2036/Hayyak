# Security

What protects the platform, where it lives in the code, and what is left to you.

## What is in place

| Risk | Protection | Where |
|---|---|---|
| SQL injection | Every query goes through Drizzle with bound parameters | `src/server/services` |
| Cross-site scripting | React escaping, no user HTML, link allow-list, a content security policy with a fresh nonce per page | `src/proxy.ts`, `src/ui/dc.jsx` |
| Cross-site requests | Every change checks `Origin` and `Sec-Fetch-Site`; JSON only; `SameSite` cookies | `src/server/api/router.ts` |
| Reading other people's data | Every query is scoped to the caller's workspace; a foreign id answers 404; membership is read on every request | `services/*`, `lib/session.ts` |
| Wrong level | Roles are declared next to each route and checked before it runs | `src/server/api/routes.ts` |
| Stolen database | Session tokens and codes are stored as HMACs, passwords as scrypt (N=2^17) | `lib/crypto.ts`, `lib/session.ts` |
| Password guessing | Limits per account and per address, kept in the database; a code by email on a new device | `services/auth.ts` |
| Code guessing | Five tries per code under a row lock, short expiry, single use | `services/auth.ts` |
| Finding out who has an account | Sign-up, reset and Studio sign-in answer the same way, with the same work | `services/auth.ts` |
| Session theft | `HttpOnly`, `Secure`, `__Host-` cookies; idle expiry; device list with sign-out; a password change ends other sessions | `lib/session.ts` |
| Uploads | Type read from the bytes, SVG filtered, everything re-encoded, quotas, random ids | `services/assets.ts` |
| Faked prices | The browser sends a size and a channel; the server works out the price | `services`, `lib/constants.ts` |
| Spending credit twice | Balance changes run in a transaction with row locks, and a ledger records each one | `services/credit.ts` |
| Guessable links | Personal links use random tokens, sent with `no-referrer` and `noindex` | `next.config.mjs` |
| Email header injection | Line breaks are removed from every header value | `lib/mail.ts` |
| Faked client address | Only the entries added by trusted proxies are believed | `lib/core.ts` |
| Clickjacking, sniffing, downgrade | `frame-ancestors 'none'`, `nosniff`, HSTS | `src/proxy.ts`, `next.config.mjs` |
| Finding the admin panel | It exists only on `STUDIO_URL`; elsewhere its pages and API answer like an address that does not exist, and no public page, file or sitemap names it | `src/lib/hosts.ts`, `src/proxy.ts`, `server/api/router.ts`, `server/page.ts` |
| Getting into the admin panel | Two steps for everyone: a code by email, then an authenticator app; codes cannot be replayed, five wrong tries lock it, each sign-in is emailed to its owner, sessions end after 30 idle minutes, strict cookies | `services/auth.ts`, `lib/totp.ts` |
| Wrong or abused prices | Nobody gets free credit beyond the sign-up trial without a code a founder made; only founders change prices; every change is logged with the old and new value; a pack priced at zero by mistake waits for approval; quotas and code limits hold under simultaneous orders | `services/pricing.ts` |
| Path traversal and leaked files | No route reads a file by name: images are looked up by id in the database. 58 raw paths are tried in the tests | `tests/e2e.mjs` |
| Secrets in the repository or the browser | A check on every commit and in CI, `.env` files ignored, server code marked `server-only`, no source maps published | `scripts/check-secrets.mjs`, `.github/workflows/check.yml` |
| A host's public database API (Supabase) | Every migration closes all tables to it: row level security with no rules, and no rights for its roles, now or for tables made later | `scripts/lockdown.ts` |
| Test data reaching real people | Staging only emails listed addresses; trial workspaces are left out of every number | `lib/mail.ts`, `services/studio.ts` |
| Insider access | Guest lists open in the Studio only to carry out a send the customer confirmed; each look is logged and the customer sees the log | `services/studio.ts` |
| Keeping data too long | Guest data is encrypted 90 days after the event and deleted 90 days after that | `services/scheduler.ts` |
| Leaked errors | The browser gets a general message; the details stay in the log | `src/server/api/router.ts` |

The app refuses to run in production without `DATABASE_URL`, `APP_SECRET` and `DATA_KEY`.

## Proof

`npm run test:e2e` runs 340 checks against a real production build. More than half of them are attacks: other people's ids, path traversal, the hidden admin panel, cross-site posts, injection strings, hostile uploads, guessing, racing, forged prices, replayed codes and stale sessions. To run it on a real server instead of the embedded one, set `TEST_DATABASE_URL` to an empty throwaway database.

Run it before each release, together with `npm audit --omit=dev`.

## Left to you

- **Accounts.** Two-step verification on GitHub, the host, the email provider and the domain.
- **Secrets.** Only in the host's settings. If one is ever committed, replace it; deleting the commit is not enough.
- **Backups.** Turn them on and test a restore.
- **Updates.** Turn on Dependabot alerts in the GitHub repository settings.
- **Flood protection.** The app limits each address, but a large attack needs something in front of it, such as Cloudflare.
- **Law.** The privacy policy and terms come from the design and need a legal review.

## Known limits

- The content security policy allows inline styles, because the design animates through them. Styles cannot run code.
- A personal invitation link works for whoever holds it. That is how guests use it without an account, so it only shows that guest's own invitation.
- Workspace accounts have a code on new devices but no authenticator app yet. Studio accounts always need one.
- A separate address hides the Studio; it does not protect it. The two sign-in steps do. Put Cloudflare Access or a VPN in front for a third.
- This has not been tested by an independent penetration tester. Do that before real payments are added.

## Reporting a problem

Email the address on the site's privacy page. Please do not open a public issue.
