import { Pool } from "pg";

import { env } from "./env";

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function verifyDatabaseConnection(): Promise<void> {
  await pool.query("SELECT 1");
}

export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
}
