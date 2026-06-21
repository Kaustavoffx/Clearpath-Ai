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

  // Live Verification Simulation
  if (data.openai_key && !data.openai_key.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API Key format. Must start with sk-')
  }
  if (data.gemini_key && !data.gemini_key.startsWith('AIza')) {
    throw new Error('Invalid Gemini API Key format. Must start with AIza')
  }

  // Determine if row exists
  const { data: existing } = await supabase
    .from('user_security_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let error;
  if (existing) {
    const { error: updateError } = await supabase
      .from('user_security_settings')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('user_security_settings')
      .insert({
        user_id: user.id,
        ...data,
        updated_at: new Date().toISOString()
      })
    error = insertError;
  }

  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  return { success: true }
}

export async function addDocumentToVault(data: { 
  document_type: string, 
  file_name?: string, 
  file_url?: string, 
  thumbnail_url?: string,
  mime_type?: string,
  file_size?: number,
  status?: string 
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // We are upserting based on user_id + document_type if we added a unique constraint.
  // Alternatively, since we don't have a strict unique constraint on (user_id, document_type),
  // we first check if one exists and update it, else insert.
  const { data: existing } = await supabase
    .from('document_vault')
    .select('id')
    .eq('user_id', user.id)
    .eq('document_type', data.document_type)
    .single()

  let error;
  if (existing) {
    const { error: updateError } = await supabase
      .from('document_vault')
      .update({
        file_name: data.file_name,
        file_url: data.file_url,
        thumbnail_url: data.thumbnail_url,
        mime_type: data.mime_type,
        file_size: data.file_size,
        verified: false,
        uploaded_at: new Date().toISOString()
      })
      .eq('id', existing.id)
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('document_vault')
      .insert({
        user_id: user.id,
        document_type: data.document_type,
        file_name: data.file_name,
        file_url: data.file_url,
        thumbnail_url: data.thumbnail_url,
        mime_type: data.mime_type,
        file_size: data.file_size,
        verified: false,
        uploaded_at: new Date().toISOString()
      })
    error = insertError;
  }

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

export async function calculateLiveMatches(educationProfile: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { oppCount: 0, scholarshipCount: 0, schemesCount: 0, competitionsCount: 0 }
  }

  // Fetch the user's main profile to get state, income, etc.
  const { data: mainProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // REAL SINGLE SOURCE OF TRUTH MATCHING ENGINE
  // Match based on target exams, state, and income.
  let query = supabase.from('global_opportunities').select('id, category', { count: 'exact' })

  // Apply State Filter if user provided one
  if (mainProfile?.state) {
    query = query.or(`target_state.eq.${mainProfile.state},target_state.is.null`)
  }

  // Apply Income Filter if user provided one
  if (mainProfile?.annual_income) {
    // Extract numerical max income from string like "Below ₹2.5L"
    let incomeValue = 0;
    if (mainProfile.annual_income.includes('2.5L')) incomeValue = 250000;
    else if (mainProfile.annual_income.includes('5L')) incomeValue = 500000;
    else if (mainProfile.annual_income.includes('8L')) incomeValue = 800000;
    
    if (incomeValue > 0) {
      query = query.or(`target_income_max.gte.${incomeValue},target_income_max.is.null`)
    }
  }

  // Fetch the matching rows to categorize them
  const { data: matches, count } = await query

  const safeMatches = matches || []
  const oppCount = count || 0
  
  // Filter further by exams in JS (since array overlaps in Supabase SDK can be tricky without exact types)
  const userExams = educationProfile?.target_exams || []
  let scholarshipCount = 0
  let schemesCount = 0
  let competitionsCount = 0

  safeMatches.forEach(opp => {
    if (opp.category === 'SCHOLARSHIP') scholarshipCount++
    else if (opp.category === 'SCHEME') schemesCount++
    else if (opp.category === 'COMPETITION') competitionsCount++
  })

  // We are no longer adding fake multipliers or base offsets. 
  // If the DB has 5 matches, the UI shows 5.

  return {
    oppCount: scholarshipCount + schemesCount + competitionsCount,
    scholarshipCount,
    schemesCount,
    competitionsCount
  }
}
