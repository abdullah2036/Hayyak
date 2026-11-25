/**
 * Looks for secrets in the files git would publish:  npm run check:secrets
 * Runs on every commit (see .githooks) and in CI. Prints the place, never the value.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const RULES = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['Resend key', /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}/],
  ['AWS key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(ghp|gho|ghs|github_pat)_[A-Za-z0-9_]{30,}/],
  ['Google key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['payment key', /\b(sk|rk)_live_[A-Za-z0-9]{16,}/],
  ['database address with a password', /\bpostgres(ql)?:\/\/[^\s:@/]+:(?!\$|\{|<|password\b|local-)[^\s@]{6,}@(?!localhost|127\.)/],
  ['SMTP address with a password', /\bsmtps?:\/\/[^\s:@/]+:(?!\$|\{|<|password\b)[^\s@]{6,}@/],
  ['filled-in secret', /^\s*(APP_SECRET|DATA_KEY|CRON_SECRET|RESEND_API_KEY)\s*=\s*['"]?[A-Za-z0-9+/=_-]{16,}/m],
];
const FORBIDDEN = /(^|\/)(\.env(\.(?!example$)[^/]*)?|id_rsa|id_ed25519|.*\.(pem|p12|pfx|key|keystore|sql\.gz|dump))$/;

function listed() {
  try {
    return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean);
  } catch {
    // Not a git checkout: look at everything except installed and generated files.
    const out = [];
    const walk = (d) => { for (const f of readdirSync(d)) { if (['node_modules', '.next', '.data', '.git'].includes(f) || /^\.env(?!\.example$)/.test(f)) continue; const p = path.posix.join(d, f); if (statSync(p).isDirectory()) walk(p); else out.push(p); } };
    walk('.');
    return out;
  }
}
const found = [];
for (const f of listed()) {
  if (FORBIDDEN.test(f)) found.push(`${f}: this file must never be committed`);
  if (!existsSync(f) || statSync(f).size > 2_000_000 || /\.(jpg|png|webp|woff2?|ico)$/.test(f) || f.endsWith('check-secrets.mjs')) continue;
  const text = readFileSync(f, 'utf8');
  for (const [name, re] of RULES) {
    const m = text.match(re);
    if (m) found.push(`${f}:${text.slice(0, m.index).split('\n').length}: ${name}`);
  }
}
if (found.length) {
  console.error('Possible secrets:\n' + found.map((x) => '  ' + x).join('\n'));
  process.exit(1);
}
console.log('clean');
