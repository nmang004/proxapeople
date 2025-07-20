import dotenv from 'dotenv';
// COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION - Original Neon Database Connection
// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import ws from "ws";
import * as schema from "@shared/schema";

// Load environment variables first
dotenv.config();

/* ORIGINAL NEON DATABASE CONNECTION - COMMENTED OUT FOR SUPABASE MIGRATION
neonConfig.webSocketConstructor = ws;

// Lazy database connection for faster startup
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  return process.env.DATABASE_URL;
};

function initializeDb() {
  if (!_pool || !_db) {
    _pool = new Pool({ connectionString: getDatabaseUrl() });
    _db = drizzle(_pool, { schema });
  }
  return { pool: _pool, db: _db };
}

export const getDb = () => {
  const { db } = initializeDb();
  return db;
};

export const getPool = () => {
  const { pool } = initializeDb();
  return pool;
};

// For backward compatibility
export const pool = new Proxy({} as Pool, {
  get(_, prop) {
    return getPool()[prop as keyof Pool];
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});
*/

// TODO: Replace with Supabase connection when ready
// Temporary placeholder to prevent compilation errors
export const db = {} as any;
export const pool = {} as any;
export const getDb = () => db;
export const getPool = () => pool;
