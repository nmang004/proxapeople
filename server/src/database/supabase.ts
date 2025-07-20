import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@shared/schema'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client for authentication and real-time features
// Use dummy values if not configured to prevent crashes
export const supabase = supabaseUrl ? createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

// Database connection using Drizzle with Supabase PostgreSQL
let _db: ReturnType<typeof drizzle> | null = null

const getDatabaseUrl = () => {
  // Supabase database URL format: postgresql://postgres:[password]@[host]:5432/postgres
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL
  
  if (!databaseUrl) {
    console.warn('Database not configured: DATABASE_URL or SUPABASE_DATABASE_URL environment variable is not set')
    return null
  }
  
  return databaseUrl
}

function initializeDb() {
  if (!_db) {
    const connectionString = getDatabaseUrl()
    if (!connectionString) {
      console.warn('Database not available - using mock database')
      return null
    }
    
    // Create PostgreSQL connection for Drizzle
    const queryClient = postgres(connectionString)
    _db = drizzle(queryClient, { schema })
  }
  return _db
}

// Main database export
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const database = initializeDb()
    if (!database) {
      console.warn('Database operation attempted but database is not configured')
      return () => Promise.resolve([])
    }
    return database[prop as keyof ReturnType<typeof drizzle>]
  }
})

// Get database instance
export const getDb = () => {
  return initializeDb()
}

// For compatibility with existing code
export const getPool = () => {
  console.warn('getPool() is deprecated with Supabase. Use getDb() instead.')
  return null
}

export const pool = new Proxy({} as any, {
  get(_, prop) {
    console.warn('pool is deprecated with Supabase. Use db directly.')
    return null
  }
})