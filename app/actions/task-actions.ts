'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const supabase = await createClient()

  const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
  const newPercent = currentStatus === 'COMPLETED' ? 0 : 100

  await supabase
    .from('action_steps')
    .update({ 
      status: newStatus,
      completion_percent: newPercent
    })
    .eq('id', taskId)

  revalidatePath('/dashboard')
  revalidatePath('/opportunities/[id]', 'page')
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()

  await supabase
    .from('action_steps')
    .delete()
    .eq('id', taskId)

  revalidatePath('/opportunities/[id]', 'page')
}
