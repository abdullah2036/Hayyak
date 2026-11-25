/**
 * Adds the first Studio founder:  npm run seed:admin -- you@example.com "Your name"
 * Sign in at /studio/login with a code sent to that address. Works once; add more people from the Studio.
 */
import { config } from 'dotenv';
import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { staff } from '../src/server/db/schema';

config({ path: ['.env.local', '.env'], quiet: true });
const [email, name] = process.argv.slice(2);
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) {
  console.error('Usage: npm run seed:admin -- you@example.com "Your name"');
  process.exit(1);
}
async function open() {
  if (process.env.DATABASE_URL) {
    const { default: postgres } = await import('postgres');
    const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ...(process.env.DB_SSL === '1' ? { ssl: 'require' as const } : {}) });
    return { db: pgDrizzle(client), close: () => client.end() };
  }
  const { mkdirSync } = await import('node:fs');
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const dir = process.env.PGLITE_DIR || '.data/pg';
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: './drizzle' });
  return { db: db as unknown as ReturnType<typeof pgDrizzle>, close: () => client.close() };
}
const { db, close } = await open();
const founders = await db.select().from(staff).where(eq(staff.role, 'founder'));
if (founders.length && !process.argv.includes('--force')) {
  console.error('A founder already exists. Add people from the Studio, or pass --force.');
  await close();
  process.exit(1);
}
await db.insert(staff).values({ email: email.toLowerCase(), name, role: 'founder', status: 'pending' }).onConflictDoUpdate({ target: staff.email, set: { role: 'founder', name, status: 'pending' } });
await close();
console.log(`Done. ${email} can now sign in at /studio/login`);
