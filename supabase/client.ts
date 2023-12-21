import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export * from './database.types'
