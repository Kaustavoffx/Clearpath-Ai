'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROCESSING_STEPS = [
  'Reading Document',
  'Finding Deadlines',
  'Checking Eligibility',
  'Detecting Missing Documents',
  'Building Action Plan',
  'Verifying Evidence'
]

export function AIProcessingConstellation() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const totalDuration = 35000 // 35 seconds (from the abort controller timeout)
    const stepDuration = totalDuration / PROCESSING_STEPS.length

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < PROCESSING_STEPS.length - 1) return prev + 1
        return prev
      })
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-glass-surface/30 rounded-[32px] border border-glass-border shadow-glass-card">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(133,138,227,0.1)_0%,transparent_70%)] blur-[40px] mix-blend-screen" />
      
      {/* Central Core */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
          boxShadow: [
            "0 0 40px rgba(133,138,227,0.2)",
            "0 0 80px rgba(151,223,252,0.4)",
            "0 0 40px rgba(133,138,227,0.2)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-24 h-24 rounded-full bg-[#3D0E61] border border-[#858AE3]/40 flex items-center justify-center z-20 backdrop-blur-md"
      >
        <Loader2 className="w-8 h-8 text-[#97DFFC] animate-spin" style={{ animationDuration: '3s' }} />
      </motion.div>

      {/* Nodes and Paths */}
      <div className="relative w-full h-full max-w-[600px] max-h-[400px]">
        {PROCESSING_STEPS.map((step, index) => {
          const angle = (index / PROCESSING_STEPS.length) * Math.PI * 2 - Math.PI / 2
          const radius = 180
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          const isCompleted = index < currentStep
          const isActive = index === currentStep

          return (
            <React.Fragment key={step}>
              {/* Connection Path to Center */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${x}px)`}
                  y2={`calc(50% + ${y}px)`}
                  stroke={isCompleted ? "#97DFFC" : isActive ? "#858AE3" : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isCompleted ? "0" : "4 4"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                  className={cn(isActive && "animate-pulse")}
                />
              </svg>

              {/* Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="absolute w-40 flex flex-col items-center justify-center gap-3 z-10"
                style={{
                  left: `calc(50% + ${x}px - 5rem)`,
                  top: `calc(50% + ${y}px - 1.5rem)`
                }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border bg-[#07111D] shadow-elevation-1 transition-all duration-500",
                  isCompleted ? "border-[#97DFFC] text-[#97DFFC] shadow-[0_0_15px_rgba(151,223,252,0.3)]" : 
                  isActive ? "border-[#858AE3] text-[#858AE3] shadow-[0_0_15px_rgba(133,138,227,0.4)] scale-110" : 
                  "border-glass-border text-muted-foreground"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3 fill-current opacity-50" />}
                </div>
                
                <div className={cn(
                  "text-[12px] font-medium text-center transition-colors duration-500",
                  isCompleted ? "text-[#97DFFC]" :
                  isActive ? "text-[#858AE3] text-[13px] drop-shadow-[0_0_8px_rgba(133,138,227,0.5)]" :
                  "text-muted-foreground"
                )}>
                  {step}
                </div>
              </motion.div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
