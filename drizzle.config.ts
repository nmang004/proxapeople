import { defineConfig } from "drizzle-kit";

// Check for Supabase database URL (prioritize over legacy DATABASE_URL)
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL must be set. Please configure your Supabase database connection.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  // Enable migrations for Supabase
  verbose: true,
  strict: true,
});
