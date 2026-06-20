'use client'

import React from 'react'
import { Trash2 } from 'lucide-react'
import { deleteOpportunity } from '@/app/actions/opportunity-actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DeleteOpportunityButton({ opportunityId, title }: { opportunityId: string, title: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm(`Move "${title}" to Trash?`)) {
      toast.promise(
        deleteOpportunity(opportunityId).then(() => {
          router.push('/dashboard')
        }),
        {
          loading: 'Moving to trash...',
          success: 'Opportunity moved to trash (available for 30 days)',
          error: 'Failed to delete opportunity'
        }
      )
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all text-sm font-semibold"
    >
      <Trash2 className="w-4 h-4" /> Move to Trash
    </button>
  )
}
