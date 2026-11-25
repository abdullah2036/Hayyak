/** Turns on the commit hook in .githooks for this checkout. Does nothing where there is no git. */
import { execFileSync } from 'node:child_process';

try {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'ignore' });
} catch {
  /* not a git checkout */
}
