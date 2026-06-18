import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

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

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
