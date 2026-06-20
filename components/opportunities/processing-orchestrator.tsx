'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIProcessingConstellation } from '@/components/opportunities/ai-processing-constellation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getStudentProfile } from '@/lib/profile-store'

interface ProcessingOrchestratorProps {
  jobId: string;
}

export function ProcessingOrchestrator({ jobId }: ProcessingOrchestratorProps) {
  const router = useRouter()
  const [currentMessage, setCurrentMessage] = useState("Initializing...")
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let isMounted = true
    let pollInterval: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/opportunities/${jobId}/status`)
        const data = await res.json()
        if (isMounted && data.stage) {
          setCurrentMessage(data.stage)
          if (typeof data.progress === 'number') {
            setProgress(data.progress)
          }
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
          body: JSON.stringify({ jobId, profile })
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
  }, [jobId, router])

  const steps = [
    { id: 1, label: "Reading Document", threshold: 0 },
    { id: 2, label: "Extracting Information", threshold: 15 },
    { id: 3, label: "Finding Eligibility", threshold: 40 },
    { id: 4, label: "Building Action Plan", threshold: 85 },
    { id: 5, label: "Verifying Evidence", threshold: 90 },
    { id: 6, label: "Finalizing Opportunity", threshold: 95 }
  ];

  const currentStepId = isDone ? 6 : steps.slice().reverse().find(s => progress >= s.threshold)?.id || 1;

  return (
    <div className="container-wide py-16 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700">
      <AIProcessingConstellation />
      
      <div className="mt-16 w-full max-w-2xl bg-glass-surface/50 border border-glass-border p-8 rounded-3xl shadow-glass-card relative overflow-hidden backdrop-blur-xl">
         
         <div className="absolute top-0 left-0 w-full h-1 bg-glass-border/30">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
         </div>

         <div className="flex flex-col mb-8 text-center">
           <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Analyzing Document</h2>
           <p className="text-muted-foreground text-sm">{currentMessage}</p>
         </div>

         <div className="space-y-4 relative">
           {steps.map((step) => {
             const isActive = step.id === currentStepId && !isDone;
             const isCompleted = step.id < currentStepId || isDone;
             const isPending = step.id > currentStepId && !isDone;

             return (
               <div key={step.id} className="flex items-center gap-4 relative z-10 group">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500
                   ${isCompleted ? 'bg-success/20 border-success text-success shadow-success/20 shadow-lg' : ''}
                   ${isActive ? 'bg-primary/20 border-primary text-primary shadow-primary/30 shadow-lg animate-pulse' : ''}
                   ${isPending ? 'bg-transparent border-glass-border text-muted-foreground/50' : ''}
                 `}>
                   {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-xs font-semibold">{step.id}</span>)}
                 </div>
                 
                 <div className={`flex flex-col transition-all duration-500 ${isCompleted ? 'text-foreground' : (isActive ? 'text-foreground font-medium' : 'text-muted-foreground/50')}`}>
                   <span className="text-[15px]">{step.label}</span>
                 </div>
               </div>
             );
           })}
           
           {/* Connecting Line */}
           <div className="absolute left-4 top-4 bottom-4 w-px bg-glass-border/30 -z-0" />
         </div>

         {!isDone && (
           <p className="text-xs text-muted-foreground/70 animate-pulse text-center mt-10">
             Building production-grade intelligence. Large files may take up to 90 seconds.
           </p>
         )}
      </div>
    </div>
  )
}
