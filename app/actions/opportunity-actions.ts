'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOpportunityPriorities(updates: { id: string, priority_score: number }[]) {
  const supabase = await createClient()

  for (const update of updates) {
    await supabase
      .from('opportunities')
      .update({ priority_score: update.priority_score })
      .eq('id', update.id)
  }

  revalidatePath('/dashboard')
  revalidatePath('/opportunities')
}

export async function deleteOpportunity(id: string) {
  const supabase = await createClient()

  await supabase
    .from('opportunities')
    .update({ status: 'TRASHED' })
    .eq('id', id)

  revalidatePath('/dashboard')
  revalidatePath('/opportunities')
}

export async function restoreOpportunity(id: string) {
  const supabase = await createClient()

  await supabase
    .from('opportunities')
    .update({ status: 'PROCESSED' })
    .eq('id', id)

  revalidatePath('/dashboard')
  revalidatePath('/opportunities')
}

export async function permanentDeleteOpportunity(id: string) {
  const supabase = await createClient()

  await supabase
    .from('opportunities')
    .delete()
    .eq('id', id)

  revalidatePath('/dashboard')
  revalidatePath('/opportunities')
}
