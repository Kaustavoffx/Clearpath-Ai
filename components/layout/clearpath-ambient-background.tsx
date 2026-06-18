'use client'

import React, { useEffect, useState } from 'react'
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

  if (!mounted) return <div className="fixed inset-0 z-[-50] bg-[#030712]" />

  const activeVariant = isJudgeMode && variant === 'dashboard' ? 'judge' : variant

  return (
    <div className={cn("fixed inset-0 z-[-50] pointer-events-none overflow-hidden bg-[#030712]", className)}>
      
      {/* Base gradient mesh — static, GPU-composited */}
      <div 
        className="absolute inset-[-20%] w-[140%] h-[140%] gpu-accelerate"
        style={{
          background: 'radial-gradient(ellipse at 25% 30%, rgba(133,138,227,0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 65%, rgba(151,223,252,0.05) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(61,14,97,0.12) 0%, transparent 60%)',
          filter: activeVariant === 'dashboard' || activeVariant === 'judge' ? 'blur(100px)' : 'blur(60px)'
        }}
      />

      {/* Landing: CSS-animated flowing paths */}
      {activeVariant === 'landing' && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.10]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M-100,500 C200,300 400,800 800,400 C1200,0 1600,600 2000,300"
            fill="none"
            stroke="#97DFFC"
            strokeWidth="1.5"
            strokeDasharray="2000"
            style={{
              animation: 'flowPath 4s ease-in-out forwards, driftX 35s linear infinite'
            }}
          />
          <path
            d="M-100,200 C300,500 500,100 900,600 C1300,1100 1700,200 2000,500"
            fill="none"
            stroke="#858AE3"
            strokeWidth="1"
            strokeDasharray="2200"
            className="opacity-60"
            style={{
              animation: 'flowPath 5s ease-in-out 1s forwards, driftX 40s linear 1s infinite',
              animationDirection: 'normal, reverse'
            }}
          />
          <path
            d="M-100,800 C400,600 600,900 1000,400 C1400,-100 1800,800 2000,200"
            fill="none"
            stroke="#613DC1"
            strokeWidth="2"
            strokeDasharray="2400"
            className="opacity-40"
            style={{
              animation: 'flowPath 6s ease-in-out 2s forwards, driftY 30s linear 2s infinite'
            }}
          />
        </svg>
      )}

      {/* Auth: Gentle pulsing glows */}
      {activeVariant === 'auth' && (
        <>
          <div 
            className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#858AE3]/8 animate-ambientPulse gpu-accelerate"
            style={{ filter: 'blur(100px)' }}
          />
          <div 
            className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#4E148C]/10 gpu-accelerate"
            style={{ filter: 'blur(120px)' }}
          />
        </>
      )}

      {/* Judge: Architecture node glows */}
      {activeVariant === 'judge' && (
        <>
          <div className="absolute top-[15%] left-[25%] w-32 h-32 rounded-full bg-[#97DFFC]/4 gpu-accelerate" style={{ filter: 'blur(40px)' }} />
          <div className="absolute top-[45%] right-[25%] w-48 h-48 rounded-full bg-[#858AE3]/6 gpu-accelerate" style={{ filter: 'blur(50px)' }} />
          <div className="absolute bottom-[20%] left-[40%] w-40 h-40 rounded-full bg-[#4E148C]/8 gpu-accelerate" style={{ filter: 'blur(60px)' }} />
        </>
      )}

      {/* Overlay for content legibility — no backdrop-blur for performance */}
      <div className="absolute inset-0 bg-[#030712]/20" />
    </div>
  )
}
