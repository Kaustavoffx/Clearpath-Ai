'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIProcessingConstellation } from '@/components/opportunities/ai-processing-constellation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getStudentProfile } from '@/lib/profile-store'

interface ProcessingOrchestratorProps {
  opportunityId: string;
}

export function ProcessingOrchestrator({ opportunityId }: ProcessingOrchestratorProps) {
  const router = useRouter()
  const [currentMessage, setCurrentMessage] = useState("Initializing...")
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let isMounted = true
    let pollInterval: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/opportunities/${opportunityId}/status`)
        const data = await res.json()
        if (isMounted && data.processing_message) {
          setCurrentMessage(data.processing_message)
        }
      } catch (err) {
        // Ignore poll errors
      }
    }

    const triggerOrchestrator = async () => {
      try {
        // Start polling immediately
        pollInterval = setInterval(pollStatus, 2000)

        const profile = getStudentProfile()
        const res = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId, profile })
        })

        const data = await res.json().catch(() => ({}))

        if (isMounted) {
          setIsDone(true)
          clearInterval(pollInterval)
          if (data.error) {
             toast.error(data.error)
          } else {
             toast.success('Document Intelligence generated.')
          }
          router.refresh()
        }

      } catch (err) {
        if (isMounted) {
          setIsDone(true)
          clearInterval(pollInterval)
          toast.error("An unexpected error occurred. Fallback generated.")
          router.refresh()
        }
      }
    }

    triggerOrchestrator()

    return () => { 
      isMounted = false
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [opportunityId, router])

  return (
    <div className="container-wide py-20 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      <AIProcessingConstellation />
      
      <div className="mt-12 max-w-md w-full flex flex-col items-center justify-center space-y-6">
         <div className="flex items-center gap-4 transition-all duration-500 scale-105">
           {isDone ? (
             <CheckCircle2 className="w-6 h-6 text-[#72F1B8] shrink-0" />
           ) : (
             <Loader2 className="w-6 h-6 text-[var(--soft-periwinkle)] animate-spin shrink-0" />
           )}
           <span className="text-lg font-medium text-[var(--text-primary)]">
             {currentMessage}
           </span>
         </div>
         {!isDone && (
           <p className="text-sm text-[var(--text-muted)] animate-pulse text-center">
             Please wait while ClearPath OS analyzes this document. Large files may take up to 90 seconds.
           </p>
         )}
      </div>
    </div>
  )
}
