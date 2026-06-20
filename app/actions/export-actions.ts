'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function generateShareToken(opportunityId: string) {
  const supabase = await createClient()

  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

  await supabase
    .from('share_tokens')
    .insert({
      opportunity_id: opportunityId,
      token: token,
      expires_at: expiresAt.toISOString()
    })

  // Log activity
  const { data: opp } = await supabase.from('opportunities').select('user_id').eq('id', opportunityId).single()
  if (opp) {
    await supabase.from('activity_feed').insert({
      opportunity_id: opportunityId,
      user_id: opp.user_id,
      activity_type: 'EXPORT_GENERATED',
      description: 'Generated a secure share link.',
    })
  }

  return token
}

export async function logExportActivity(opportunityId: string, format: string) {
  const supabase = await createClient()

  const { data: opp } = await supabase.from('opportunities').select('user_id').eq('id', opportunityId).single()
  if (opp) {
    await supabase.from('activity_feed').insert({
      opportunity_id: opportunityId,
      user_id: opp.user_id,
      activity_type: 'EXPORT_GENERATED',
      description: `Exported opportunity data to ${format}.`,
    })
  }
}
