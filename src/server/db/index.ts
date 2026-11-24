import 'server-only';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { ensureDefaults } from './defaults';
import * as schema from './schema';

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;

const g = globalThis as unknown as { __hayyakDb?: Promise<DB> };

async function connect(): Promise<DB> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: postgres } = await import('postgres');
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const client = postgres(url, { max: Number(process.env.DB_POOL || 10), prepare: false, onnotice: () => {} });
    return drizzle(client, { schema }) as unknown as DB;
  }
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_EMBEDDED_DB !== '1') {
    throw new Error('DATABASE_URL is required in production');
  }
  // Development and tests: real Postgres compiled to WebAssembly, no installation needed.
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const dir = process.env.PGLITE_DIR || '.data/pg';
  if (!dir.startsWith('memory://')) {
    const { mkdirSync } = await import('node:fs');
    mkdirSync(dir, { recursive: true });
  }
  const client = new PGlite(dir);
  const d = drizzle(client, { schema });
  await migrate(d, { migrationsFolder: './drizzle' });
  await ensureDefaults(d);
  return d as unknown as DB;
}

export function db(): Promise<DB> {
  if (!g.__hayyakDb) {
    g.__hayyakDb = connect().catch((e) => {
      g.__hayyakDb = undefined;
      throw e;
    });
  }
  return g.__hayyakDb;
}

export * from './schema';
