'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ClearPathAmbientBackgroundProps {
  variant?: 'landing' | 'auth' | 'dashboard' | 'judge'
  className?: string
}

export function ClearPathAmbientBackground({ variant = 'dashboard', className }: ClearPathAmbientBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const isJudgeMode = searchParams?.get('judge') === 'true'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="fixed inset-0 z-[-50] bg-[#07111D]" />

  const activeVariant = isJudgeMode && variant === 'dashboard' ? 'judge' : variant
  const isAnimated = activeVariant === 'landing' || activeVariant === 'auth'

  return (
    <div className={cn("fixed inset-0 z-[-50] pointer-events-none overflow-hidden bg-[#07111D]", className)}>
      
      {/* 
        Base Gradient Mesh
        Dashboard and Judge use a static, heavily blurred mesh.
      */}
      <div 
        className={cn(
          "absolute inset-[-50%] w-[200%] h-[200%] opacity-40 mix-blend-screen",
          activeVariant === 'dashboard' || activeVariant === 'judge' ? "blur-[140px]" : "blur-[80px]"
        )}
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(133,138,227,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(151,223,252,0.1) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(61,14,97,0.2) 0%, transparent 50%)'
        }}
      />

      {/* 
        Animated Paths System (Landing)
      */}
      {activeVariant === 'landing' && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M-100,500 C200,300 400,800 800,400 C1200,0 1600,600 2000,300"
            fill="none"
            stroke="#97DFFC"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, x: [-50, 0, -50] }}
            transition={{ 
              pathLength: { duration: 4, ease: "easeInOut" },
              opacity: { duration: 2 },
              x: { duration: 35, repeat: Infinity, ease: "linear" }
            }}
          />
          <motion.path
            d="M-100,200 C300,500 500,100 900,600 C1300,1100 1700,200 2000,500"
            fill="none"
            stroke="#858AE3"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6, x: [50, 0, 50] }}
            transition={{ 
              pathLength: { duration: 5, ease: "easeInOut", delay: 1 },
              opacity: { duration: 2, delay: 1 },
              x: { duration: 40, repeat: Infinity, ease: "linear" }
            }}
          />
          <motion.path
            d="M-100,800 C400,600 600,900 1000,400 C1400,-100 1800,800 2000,200"
            fill="none"
            stroke="#613DC1"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4, y: [-30, 30, -30] }}
            transition={{ 
              pathLength: { duration: 6, ease: "easeInOut", delay: 2 },
              opacity: { duration: 2, delay: 2 },
              y: { duration: 30, repeat: Infinity, ease: "linear" }
            }}
          />
        </svg>
      )}

      {/* 
        Auth Variant: Simpler Paths + Floating Glow
      */}
      {activeVariant === 'auth' && (
        <>
          <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#858AE3]/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#4E148C]/15 blur-[150px] mix-blend-screen" />
          
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M-100,500 C300,400 600,600 1000,300 C1400,0 1800,500 2000,400"
              fill="none"
              stroke="#8EB5F0"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 3 }}
            />
          </svg>
        </>
      )}

      {/* 
        Judge Variant: Architecture Nodes Glow
      */}
      {activeVariant === 'judge' && (
        <div className="absolute inset-0">
           <div className="absolute top-[15%] left-[25%] w-32 h-32 bg-[#97DFFC]/5 rounded-full blur-[40px] mix-blend-screen" />
           <div className="absolute top-[45%] right-[25%] w-48 h-48 bg-[#858AE3]/10 rounded-full blur-[50px] mix-blend-screen" />
           <div className="absolute bottom-[20%] left-[40%] w-40 h-40 bg-[#4E148C]/15 rounded-full blur-[60px] mix-blend-screen" />
           
           {/* Static faint connection lines */}
           <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
             <path d="M 35vw 20vh L 75vw 50vh L 45vw 80vh" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
           </svg>
        </div>
      )}

      {/* Static overlay to ensure content legibility on all backgrounds */}
      <div className="absolute inset-0 bg-[#0B1E2E]/30 backdrop-blur-[1px]" />
    </div>
  )
}
