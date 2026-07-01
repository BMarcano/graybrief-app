import { createClient } from '@supabase/supabase-js'

// Reads from Vite env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
// Set these locally in a .env file and in Vercel as Environment Variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
