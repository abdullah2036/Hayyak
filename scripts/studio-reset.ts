/**
 * A Studio member lost their phone and their recovery codes:  npm run studio:reset -- person@example.com
 * Their next sign-in sets up a new authenticator. Run it on the server.
 */
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { sessions, staff } from '../src/server/db/schema';

config({ path: ['.env.local', '.env'], quiet: true });
const email = (process.argv[2] || '').trim().toLowerCase();
if (!email || !process.env.DATABASE_URL) {
  console.error('Usage: DATABASE_URL=... npm run studio:reset -- person@example.com');
  process.exit(1);
}
const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ...(process.env.DB_SSL === '1' ? { ssl: 'require' as const } : {}) });
const db = drizzle(client);
const [m] = await db.update(staff).set({ totpSecret: '', totpAt: null, totpStep: 0, recovery: [] }).where(eq(staff.email, email)).returning();
if (m) await db.delete(sessions).where(eq(sessions.staffId, m.id));
await client.end();
console.log(m ? `Done. ${email} sets up a new authenticator at the next sign-in.` : 'No such Studio member.');
