'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteOpportunity } from '@/app/actions/opportunity-actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function DeleteOpportunityButton({ opportunityId, title }: { opportunityId: string, title: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteOpportunity(opportunityId)
      toast.success('Opportunity moved to trash (available for 30 days)')
      router.push('/opportunities')
    } catch (error) {
      toast.error('Failed to delete opportunity')
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all text-sm font-semibold"
      >
        <Trash2 className="w-4 h-4" /> Move to Trash
      </button>

      <ConfirmationModal
        isOpen={isOpen}
        title="Move to Trash?"
        description={
          <>
            This action will move: <br />
            <span className="font-semibold text-foreground mt-2 block">"{title}"</span><br />
            to the trash. It will be available for 30 days before permanent deletion.
          </>
        }
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  )
}
