'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const origin = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${protocol}://${host}` : 'https://clearpath-ai-five.vercel.app')

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  if (authData.user && !authData.session) {
    redirect('/register?error=Please check your email to confirm your account')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
