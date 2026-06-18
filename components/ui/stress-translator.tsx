'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Brain, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      <div className={cn("glass-thick rounded-apple-xl p-8 relative overflow-hidden animate-pulse", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-spin">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">AI Stress Translator Active</h3>
            <p className="text-muted-foreground">{processingSteps[stepIndex]}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {originalText && (
        <div className="glass-thin rounded-apple-lg p-6 opacity-60">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
            Bureaucratic Text
          </div>
          <p className="text-sm font-mono leading-relaxed line-clamp-3">
            &quot;{originalText}&quot;
          </p>
        </div>
      )}
      
      {originalText && (
        <div className="flex justify-center -my-6 relative z-10">
          <div className="w-8 h-8 rounded-full bg-background border border-apple-glass-border flex items-center justify-center shadow-sm text-primary">
            <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
          </div>
        </div>
      )}
      
      <div className="glass-regular rounded-apple-xl p-8 border-t-4 border-primary shadow-apple-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Plain English
          </div>
          <p className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-balance">
            {simplifiedText}
          </p>
        </div>
      </div>
    </div>
  )
}
