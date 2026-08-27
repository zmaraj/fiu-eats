import { Pool } from "pg";

// Next.js reloads this module on every file change in dev, which would
// normally spin up a brand new connection pool each time and eventually
// exhaust Postgres's connection limit. Stashing the pool on `global`
// survives those reloads so we only ever create one.
declare global {
  var pgPool: Pool | undefined;
}

export const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}