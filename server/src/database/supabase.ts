import { createClient } from '@supabase/supabase-js'
import * as schema from '@shared/schema'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database operations using Supabase client directly
export const db = {
  // User operations
  users: {
    async findMany() {
      const { data, error } = await supabase.from('users').select('*')
      if (error) throw error
      return data || []
    },
    async findFirst(where: any) {
      let query = supabase.from('users').select('*')
      if (where?.email) {
        query = query.eq('email', where.email)
      }
      if (where?.id) {
        query = query.eq('id', where.id)
      }
      const { data, error } = await query.single()
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
      return data
    },
    async create(data: any) {
      const { data: result, error } = await supabase.from('users').insert(data).select().single()
      if (error) throw error
      return result
    },
    async update(where: any, data: any) {
      let query = supabase.from('users').update(data)
      if (where?.id) {
        query = query.eq('id', where.id)
      }
      const { error } = await query
      if (error) throw error
    }
  },
  
  // Generic query methods for other tables
  async select() {
    return {
      from: (tableName: string) => ({
        where: (condition: any) => ({
          async execute() {
            const { data, error } = await supabase.from(tableName).select('*')
            if (error) throw error
            return data || []
          }
        }),
        async execute() {
          const { data, error } = await supabase.from(tableName).select('*')
          if (error) throw error
          return data || []
        }
      })
    }
  },
  
  async insert(tableName: string) {
    return {
      values: (values: any) => ({
        async execute() {
          const { data, error } = await supabase.from(tableName).insert(values).select().single()
          if (error) throw error
          return data
        }
      })
    }
  }
}

// Get database instance (for compatibility)
export const getDb = () => {
  return db
}

// For compatibility with existing code
export const getPool = () => {
  console.warn('getPool() is deprecated with Supabase. Use db directly.')
  return null
}

export const pool = new Proxy({} as any, {
  get(_, prop) {
    console.warn('pool is deprecated with Supabase. Use db directly.')
    return null
  }
})