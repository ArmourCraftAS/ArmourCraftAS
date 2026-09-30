import { createClient } from '@supabase/supabase-js'

// Retrieve Supabase environment variables across different frameworks (Next.js, Vite, Node)
const supabaseUrl =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://wypzebtlwjvqdyahkdac.supabase.co'

const supabaseAnonKey =
  (typeof process !== 'undefined' &&
    (process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env?.SUPABASE_ANON_KEY ||
      process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env?.SUPABASE_PUBLISHABLE_KEY)) ||
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cHplYnRsd2p2cWR5YWhrZGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjI1MjAsImV4cCI6MjEwNjMzODUyMH0.O_P67kV0JZCT8pKO8Me0JwnAyp7-kf4dDIbbDuIkAuc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_ / VITE_ variants) are set in .env.local.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase
