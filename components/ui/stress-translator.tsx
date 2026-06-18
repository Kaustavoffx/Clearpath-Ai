'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Brain, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface StressTranslatorProps {
  originalText?: string
  simplifiedText: string
  isProcessing?: boolean
  className?: string
}

const processingSteps = [
  "Scanning document structure...",
  "Identifying crucial deadlines...",
  "Extracting hidden requirements...",
  "Translating bureaucratic jargon..."
]

export function StressTranslator({ originalText, simplifiedText, isProcessing = false, className }: StressTranslatorProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setStepIndex(s => (s + 1) % processingSteps.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isProcessing])

  if (isProcessing) {
    return (
      <div className={cn("decision-surface p-8", className)}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-foreground animate-pulse" />
          </div>
          <div className="w-full space-y-4">
            <div>
              <h3 className="font-semibold text-step-2 text-foreground mb-1">AI Stress Translator Active</h3>
              <p className="text-step-0 text-muted-foreground">{processingSteps[stepIndex]}</p>
            </div>
            
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {originalText && (
        <div className="decision-surface-muted p-6 opacity-80">
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            Bureaucratic Text
          </div>
          <p className="text-step-0 font-mono leading-relaxed line-clamp-3">
            &quot;{originalText}&quot;
          </p>
        </div>
      )}
      
      {originalText && (
        <div className="flex justify-center -my-8 relative z-10">
          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-elevation-1 text-foreground">
            <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
          </div>
        </div>
      )}
      
      <div className="decision-surface p-8 border-t-2 border-t-foreground shadow-elevation-2 relative">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Sparkles className="w-24 h-24 text-foreground" />
        </div>
        <div className="relative z-10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Plain English
          </div>
          <p className="text-step-2 md:text-step-3 font-medium leading-relaxed tracking-tight text-balance text-foreground">
            {simplifiedText}
          </p>
        </div>
      </div>
    </div>
  )
}
