import type postgres from 'postgres';

/**
 * Some hosts (Supabase) publish the "public" schema through a web API whose key is meant to be public. The app
 * does not use it, so every table is closed to it: row level security with no rules, and no rights for the API's
 * roles, now or for tables made later. The app connects as the owner of the tables and is not affected.
 * Harmless on any other Postgres.
 */
export async function lockdown(sql: postgres.Sql) {
  await sql.unsafe(`
    do $$
    declare t record; r text;
    begin
      for t in select tablename from pg_tables where schemaname = 'public' and tableowner = current_user loop
        execute format('alter table public.%I enable row level security', t.tablename);
      end loop;
      foreach r in array array['anon', 'authenticated', 'service_role'] loop
        if exists (select 1 from pg_roles where rolname = r) then
          for t in select tablename from pg_tables where schemaname = 'public' and tableowner = current_user loop
            execute format('revoke all on table public.%I from %I', t.tablename, r);
          end loop;
          execute format('alter default privileges in schema public revoke all on tables from %I', r);
        end if;
      end loop;
    end $$;
  `);
}
