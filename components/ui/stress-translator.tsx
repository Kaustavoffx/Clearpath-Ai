'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Brain, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

interface StressTranslatorProps {
  originalText?: string
  simplifiedText: string
  isProcessing?: boolean
  className?: string
}

const processingSteps = [
  { text: "Reading Document", delay: 0 },
  { text: "Finding Deadlines", delay: 1500 },
  { text: "Checking Eligibility", delay: 3000 },
  { text: "Detecting Missing Documents", delay: 4500 },
  { text: "Building Action Plan", delay: 6000 },
  { text: "Verifying Evidence", delay: 7500 }
]

export function StressTranslator({ originalText, simplifiedText, isProcessing = false, className }: StressTranslatorProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (isProcessing) {
      const timeouts = processingSteps.map((step, index) => 
        setTimeout(() => {
          setActiveStep(index)
        }, step.delay)
      )
      return () => timeouts.forEach(clearTimeout)
    }
  }, [isProcessing])

  if (isProcessing) {
    return (
      <div className={cn("liquid-glass-card p-8 bg-glass-surface/50 border border-glass-border overflow-hidden", className)}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          <div className="w-16 h-16 rounded-[20px] bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-elevation-1">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="w-full">
            <h3 className="font-semibold text-[20px] tracking-[-0.015em] text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Cinematic AI Reasoning
            </h3>
            <div className="space-y-4">
              {processingSteps.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;
                const isPending = idx > activeStep;

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: isPending ? 0.3 : 1, 
                      x: 0,
                      scale: isActive ? 1.02 : 1
                    }}
                    className={cn(
                      "flex items-center gap-3 transition-spring",
                      isActive && "text-primary font-medium"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-glass-border" />
                    )}
                    <span className="text-[15px]">{step.text}</span>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="space-y-3 mt-8">
              <Skeleton className="h-4 w-[90%] bg-glass-layer/40" />
              <Skeleton className="h-4 w-[75%] bg-glass-layer/40" />
              <Skeleton className="h-4 w-[85%] bg-glass-layer/40" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {originalText && (
        <div className="liquid-glass-card p-6 bg-muted/20 border-glass-border">
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            Bureaucratic Text
          </div>
          <p className="text-[14px] font-mono leading-relaxed line-clamp-4 text-foreground/80">
            &quot;{originalText}&quot;
          </p>
        </div>
      )}
      
      {originalText && (
        <div className="flex justify-center -my-8 relative z-10">
          <div className="w-10 h-10 rounded-full bg-background border border-glass-border flex items-center justify-center shadow-glass-card text-foreground">
            <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
          </div>
        </div>
      )}
      
      <div className="liquid-glass-card p-8 border-t-2 border-t-primary shadow-glass-card relative">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="text-[12px] font-semibold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Plain English
          </div>
          <p className="text-[20px] md:text-[24px] font-medium leading-[1.4] tracking-tight text-balance text-foreground">
            {simplifiedText}
          </p>
        </div>
      </div>
    </div>
  )
}
