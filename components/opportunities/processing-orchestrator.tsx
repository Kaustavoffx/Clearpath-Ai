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

const steps = [
  "Reading Document Context...",
  "Extracting Requirements...",
  "Checking Eligibility against Profile...",
  "Building Action Plan...",
  "Generating Evidence References..."
]

export function ProcessingOrchestrator({ opportunityId }: ProcessingOrchestratorProps) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Artificial progression of steps for UX
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1
        return prev
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let isMounted = true

    const triggerOrchestrator = async () => {
      try {
        const profile = getStudentProfile()
        const res = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId, profile })
        })

        // Even if it fails gracefully, it returns 200 with an error msg in JSON
        const data = await res.json().catch(() => ({}))

        if (isMounted) {
          setIsDone(true)
          if (data.error) {
             toast.error(data.error)
          } else {
             toast.success('Document Intelligence generated.')
          }
          // Refresh the page to load the Server Component with PROCESSED data
          router.refresh()
        }

      } catch (err) {
        if (isMounted) {
          setIsDone(true)
          toast.error("An unexpected error occurred. Fallback generated.")
          router.refresh()
        }
      }
    }

    triggerOrchestrator()

    return () => { isMounted = false }
  }, [opportunityId, router])

  return (
    <div className="container-wide py-20 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
      <AIProcessingConstellation />
      
      <div className="mt-12 max-w-md w-full space-y-4">
         {steps.map((step, index) => {
           const isActive = index === currentStepIndex && !isDone
           const isCompleted = index < currentStepIndex || isDone

           return (
             <div 
               key={index} 
               className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : isCompleted ? 'opacity-50' : 'opacity-20'}`}
             >
               {isCompleted ? (
                 <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
               ) : isActive ? (
                 <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
               ) : (
                 <div className="w-5 h-5 rounded-full border-2 border-muted-foreground shrink-0" />
               )}
               <span className={`text-[15px] font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                 {step}
               </span>
             </div>
           )
         })}
      </div>
    </div>
  )
}
