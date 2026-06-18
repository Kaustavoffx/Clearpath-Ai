import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (process.env.NODE_ENV === 'development') {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Supabase environment variables missing in development:')
      if (!supabaseUrl) console.warn('  - NEXT_PUBLIC_SUPABASE_URL is missing')
      if (!supabaseAnonKey) console.warn('  - NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    } else {
      console.log('✅ Supabase environment variables found.')
    }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Your project's URL and API key are required to create a Supabase client")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
