'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AIProcessingConstellation } from '@/components/opportunities/ai-processing-constellation'
import { CheckCircle2, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { getStudentProfile } from '@/lib/profile-store'

interface ProcessingOrchestratorProps {
  jobId: string;
}

export function ProcessingOrchestrator({ jobId }: ProcessingOrchestratorProps) {
  const router = useRouter()
  const [currentMessage, setCurrentMessage] = useState("Initializing...")
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'PROCESSING' | 'COMPLETED' | 'FAILED'>('PROCESSING')
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const triggerOrchestrator = useCallback(async () => {
    setStatus('PROCESSING')
    setProgress(0)
    setErrorDetails(null)
    
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/opportunities/${jobId}/status`)
        const data = await res.json()
        if (data.stage) setCurrentMessage(data.stage)
        if (typeof data.progress === 'number') setProgress(data.progress)
      } catch (err) {}
    }, 2000)

    try {
      const profile = getStudentProfile()
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, profile })
      })

      const data = await res.json().catch(() => ({}))
      clearInterval(pollInterval)

      if (data.error || !res.ok) {
         setStatus('FAILED')
         setErrorDetails(data.error || "Quality Gate rejected output or an unexpected AI failure occurred.")
      } else {
         setStatus('COMPLETED')
         setProgress(100)
         setCurrentMessage("Analysis Complete")
      }
    } catch (err) {
      clearInterval(pollInterval)
      setStatus('FAILED')
      setErrorDetails("Network Error or Timeout occurred while connecting to AI.")
    }
  }, [jobId])

  useEffect(() => {
    triggerOrchestrator()
  }, [triggerOrchestrator])

  const steps = [
    { id: 1, label: "Reading Document", threshold: 0 },
    { id: 2, label: "Extracting Intelligence", threshold: 15 },
    { id: 3, label: "Generating Action Plan", threshold: 40 },
    { id: 4, label: "Creating Workspace", threshold: 85 },
    { id: 5, label: "Complete", threshold: 95 }
  ];

  const currentStepId = status === 'COMPLETED' ? 5 : steps.slice().reverse().find(s => progress >= s.threshold)?.id || 1;

  if (status === 'FAILED') {
    return (
      <div className="container-wide py-16 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700">
        <div className="w-full max-w-lg bg-danger/5 border border-danger/20 p-8 rounded-[24px] shadow-glass-card backdrop-blur-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6 border border-danger/20">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Failed</h2>
          <p className="text-muted-foreground text-sm mb-6">{errorDetails}</p>
          
          <div className="bg-background rounded-[12px] p-4 text-left w-full mb-8 border border-glass-border">
            <h4 className="text-[13px] font-semibold text-foreground mb-2">Possible Causes:</h4>
            <ul className="text-[13px] text-muted-foreground list-disc list-inside space-y-1">
              <li>Document is password protected or encrypted.</li>
              <li>Scanned image quality is too low for OCR.</li>
              <li>The URL requires a login (paywall/dashboard).</li>
              <li>Content is a general notice, not an opportunity.</li>
            </ul>
          </div>

          <div className="flex gap-4 w-full">
            <button 
              onClick={triggerOrchestrator}
              className="flex-1 px-4 py-3 rounded-[12px] bg-background border border-glass-border text-foreground text-[14px] font-medium hover:bg-glass-layer transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => router.push('/analyze')}
              className="flex-1 px-4 py-3 rounded-[12px] bg-danger text-white text-[14px] font-medium hover:bg-danger/90 transition-colors shadow-[0_0_15px_rgba(var(--danger-rgb),0.3)]"
            >
              Upload New
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'COMPLETED') {
    return (
      <div className="container-wide py-16 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-md bg-success/5 border border-success/20 p-10 rounded-[32px] shadow-[0_0_50px_rgba(var(--success-rgb),0.1)] backdrop-blur-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-success/20 text-success flex items-center justify-center mb-6 border-2 border-success shadow-[0_0_20px_rgba(var(--success-rgb),0.4)] animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Intelligence Ready</h2>
          <p className="text-muted-foreground text-sm mb-8">Workspace and Action Plan have been generated.</p>
          
          <button 
            onClick={() => router.refresh()}
            className="w-full h-12 rounded-[16px] bg-primary text-primary-foreground text-[15px] font-medium hover:bg-primary/90 transition-spring shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
          >
            View Opportunity
          </button>
        </div>
      </div>
    );
  }

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
             const isActive = step.id === currentStepId;
             const isCompleted = step.id < currentStepId;
             const isPending = step.id > currentStepId;

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

         <p className="text-xs text-muted-foreground/70 animate-pulse text-center mt-10">
           Building production-grade intelligence. Large files may take up to 90 seconds.
         </p>
      </div>
    </div>
  )
}
