/** Applies database migrations. Runs before the app starts in production. */
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { ensureDefaults } from '../src/server/db/defaults';

config({ path: ['.env.local', '.env'], quiet: true });
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}
const client = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
const db = drizzle(client);
await migrate(db, { migrationsFolder: './drizzle' });
await ensureDefaults(db);
await client.end();
console.log('Database is up to date');
