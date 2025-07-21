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
      const { data, error } = await supabase.from('users').select(`
        id,
        email,
        password,
        first_name,
        last_name,
        role,
        job_title,
        department,
        manager_id,
        profile_image,
        hire_date,
        created_at,
        updated_at
      `)
      if (error) throw error
      
      // Transform database column names to application format
      return (data || []).map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        jobTitle: user.job_title,
        department: user.department,
        managerId: user.manager_id,
        profileImage: user.profile_image,
        hireDate: user.hire_date,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))
    },
    async findFirst(where: any) {
      let query = supabase.from('users').select(`
        id,
        email,
        password,
        first_name,
        last_name,
        role,
        job_title,
        department,
        manager_id,
        profile_image,
        hire_date,
        created_at,
        updated_at
      `)
      if (where?.email) {
        query = query.eq('email', where.email)
      }
      if (where?.id) {
        query = query.eq('id', where.id)
      }
      const { data, error } = await query.single()
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
      
      // Transform database column names to application format
      if (data) {
        return {
          id: data.id,
          email: data.email,
          password: data.password,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role,
          jobTitle: data.job_title,
          department: data.department,
          managerId: data.manager_id,
          profileImage: data.profile_image,
          hireDate: data.hire_date,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      }
      return data
    },
    async create(data: any) {
      // Transform application format to database column names
      const dbData = {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        job_title: data.jobTitle,
        department: data.department,
        manager_id: data.managerId,
        profile_image: data.profileImage,
        hire_date: data.hireDate
      }
      
      const { data: result, error } = await supabase.from('users').insert(dbData).select(`
        id,
        email,
        password,
        first_name,
        last_name,
        role,
        job_title,
        department,
        manager_id,
        profile_image,
        hire_date,
        created_at,
        updated_at
      `).single()
      
      if (error) throw error
      
      // Transform back to application format
      if (result) {
        return {
          id: result.id,
          email: result.email,
          password: result.password,
          firstName: result.first_name,
          lastName: result.last_name,
          role: result.role,
          jobTitle: result.job_title,
          department: result.department,
          managerId: result.manager_id,
          profileImage: result.profile_image,
          hireDate: result.hire_date,
          createdAt: result.created_at,
          updatedAt: result.updated_at
        }
      }
      return result
    },
    async update(where: any, data: any) {
      // Transform application format to database column names
      const dbData: any = {}
      if (data.email) dbData.email = data.email
      if (data.password) dbData.password = data.password
      if (data.firstName) dbData.first_name = data.firstName
      if (data.lastName) dbData.last_name = data.lastName
      if (data.role) dbData.role = data.role
      if (data.jobTitle) dbData.job_title = data.jobTitle
      if (data.department) dbData.department = data.department
      if (data.managerId !== undefined) dbData.manager_id = data.managerId
      if (data.profileImage !== undefined) dbData.profile_image = data.profileImage
      if (data.hireDate) dbData.hire_date = data.hireDate
      
      let query = supabase.from('users').update(dbData)
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