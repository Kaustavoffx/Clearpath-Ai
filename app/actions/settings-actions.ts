'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateIdentityProfile(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      phone: data.phone,
      current_class: data.current_class,
      board: data.board,
      institution: data.institution,
      graduation_year: data.graduation_year,
      state: data.state,
      social_category: data.social_category,
      annual_income: data.annual_income,
      gender: data.gender,
      disability_status: data.disability_status,
      minority_status: data.minority_status,
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function updateEducationProfile(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('education_profiles')
    .upsert({
      user_id: user.id,
      stream: data.stream,
      percentage: data.percentage,
      cgpa: data.cgpa,
      target_exams: data.target_exams,
      interests: data.interests,
      updated_at: new Date().toISOString()
    })

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function updatePreferences(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...data,
      updated_at: new Date().toISOString()
    })

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function updateSecuritySettings(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('user_security_settings')
    .upsert({
      user_id: user.id,
      ...data,
      updated_at: new Date().toISOString()
    })

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function addDocumentToVault(data: { document_type: string, file_url?: string, status: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('document_vault')
    .insert({
      user_id: user.id,
      ...data
    })

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function updateDocumentStatus(docId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('document_vault')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', docId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function deleteDocumentFromVault(docId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('document_vault')
    .delete()
    .eq('id', docId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}
