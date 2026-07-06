import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// For serverless environments, we reuse a single connection client
let client: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  client = postgres(connectionString, { prepare: false });
} else {
  // Prevent hot-reloading from creating multiple connection pools
  if (!(global as any).postgresClient) {
    (global as any).postgresClient = postgres(connectionString, { prepare: false });
  }
  client = (global as any).postgresClient;
}

export const db = drizzle(client, { schema });
export * as schema from '../db/schema';
