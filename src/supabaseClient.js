import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.error("🚨 Supabase Configuration Error: URL or Key is missing. " +
    "Check your Vercel Environment Variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).")
}

export const supabase = createClient(
  supabaseUrl || 'https://MISSING-CONFIG.supabase.co', 
  supabaseAnonKey || 'MISSING-KEY'
)
