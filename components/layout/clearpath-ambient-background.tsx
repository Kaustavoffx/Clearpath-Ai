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

  if (!mounted) return null

  const activeVariant = isJudgeMode && variant === 'dashboard' ? 'judge' : variant

  return (
    <div className={cn("fixed inset-0 z-[-50] pointer-events-none overflow-hidden", className)}>
      
      {/* Base Twilight Atmospheric Gradient */}
      <div 
        className="absolute inset-0 w-full h-full gpu-accelerate"
        style={{
          background: `
            radial-gradient(circle at top, rgba(149,127,239,0.20), transparent 40%),
            radial-gradient(circle at bottom right, rgba(183,156,237,0.12), transparent 50%),
            linear-gradient(180deg, #090D1A, #0D1326, #111B34)
          `
        }}
      />

      {/* Landing: CSS-animated flowing twilight paths */}
      {activeVariant === 'landing' && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M-100,500 C200,300 400,800 800,400 C1200,0 1600,600 2000,300"
            fill="none"
            stroke="var(--soft-periwinkle)"
            strokeWidth="2"
            strokeDasharray="2000"
            style={{
              animation: 'flowPath 8s ease-in-out forwards, driftX 35s linear infinite'
            }}
          />
          <path
            d="M-100,200 C300,500 500,100 900,600 C1300,1100 1700,200 2000,500"
            fill="none"
            stroke="var(--wisteria)"
            strokeWidth="1.5"
            strokeDasharray="2200"
            className="opacity-70"
            style={{
              animation: 'flowPath 10s ease-in-out 1s forwards, driftX 40s linear 1s infinite',
              animationDirection: 'normal, reverse'
            }}
          />
          <path
            d="M-100,800 C400,600 600,900 1000,400 C1400,-100 1800,800 2000,200"
            fill="none"
            stroke="var(--mauve)"
            strokeWidth="2.5"
            strokeDasharray="2400"
            className="opacity-50"
            style={{
              animation: 'flowPath 12s ease-in-out 2s forwards, driftY 30s linear 2s infinite'
            }}
          />
        </svg>
      )}

      {/* Auth: Gentle pulsing glows */}
      {activeVariant === 'auth' && (
        <>
          <div 
            className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full animate-ambientPulse gpu-accelerate"
            style={{ background: 'rgba(149,127,239,0.15)', filter: 'blur(100px)' }}
          />
          <div 
            className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full gpu-accelerate"
            style={{ background: 'rgba(183,156,237,0.15)', filter: 'blur(120px)' }}
          />
        </>
      )}

      {/* Judge: Architecture node glows */}
      {activeVariant === 'judge' && (
        <>
          <div className="absolute top-[15%] left-[25%] w-32 h-32 rounded-full gpu-accelerate" style={{ background: 'rgba(149,127,239,0.1)', filter: 'blur(40px)' }} />
          <div className="absolute top-[45%] right-[25%] w-48 h-48 rounded-full gpu-accelerate" style={{ background: 'rgba(183,156,237,0.1)', filter: 'blur(50px)' }} />
          <div className="absolute bottom-[20%] left-[40%] w-40 h-40 rounded-full gpu-accelerate" style={{ background: 'rgba(113,97,239,0.1)', filter: 'blur(60px)' }} />
        </>
      )}
    </div>
  )
}
