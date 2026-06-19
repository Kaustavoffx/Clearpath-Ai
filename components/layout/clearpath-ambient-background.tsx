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
      
      {/* Layer 1 is handled globally by body background-color: var(--dark-bg) (#050408) */}

      {/* Layer 2: Massive blurred radial gradients */}
      <div 
        className="absolute inset-0 w-full h-full gpu-accelerate opacity-80"
        style={{
          background: `
            radial-gradient(circle at 20% 0%, rgba(149,127,239,0.15), transparent 40%),
            radial-gradient(circle at 80% 100%, rgba(183,156,237,0.1), transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(113,97,239,0.05), transparent 60%)
          `
        }}
      />

      {/* Layer 3: Digital Stardust System */}
      <div className="absolute inset-0 w-full h-full gpu-accelerate">
        {/* Far Layer: Tiny stars, 5% opacity, Extremely slow */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          animation: 'driftY 120s linear infinite'
        }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
          backgroundSize: '150px 150px',
          backgroundPosition: '50px 50px',
          animation: 'driftX 150s linear infinite reverse'
        }} />

        {/* Middle Layer: Blurred energy particles, 8% opacity, Organic drift */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(183,156,237,0.8) 2px, transparent 2px)',
          backgroundSize: '200px 200px',
          filter: 'blur(1px)',
          animation: 'driftX 60s ease-in-out infinite alternate'
        }} />
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(149,127,239,0.8) 2px, transparent 2px)',
          backgroundSize: '250px 250px',
          backgroundPosition: '100px 100px',
          filter: 'blur(2px)',
          animation: 'driftY 80s ease-in-out infinite alternate'
        }} />

        {/* Near Layer: Occasional intelligence pulses, 15% opacity, Rare movement */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: 'radial-gradient(circle at center, var(--soft-periwinkle) 3px, transparent 3px)',
          backgroundSize: '400px 400px',
          filter: 'blur(3px)',
          animation: 'ambientPulse 15s ease-in-out infinite'
        }} />
      </div>

      {/* Layer 4: Animated energy waves (Landing paths) */}
      {activeVariant === 'landing' && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.25] gpu-accelerate" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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
