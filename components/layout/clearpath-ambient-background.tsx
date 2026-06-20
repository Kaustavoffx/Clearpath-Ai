'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface ClearPathAmbientBackgroundProps {
  className?: string
}

export function ClearPathAmbientBackground({ className }: ClearPathAmbientBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { resolvedTheme } = useTheme()
  const isJudgeMode = searchParams?.get('judge') === 'true'

  let variant = 'dashboard'
  if (pathname === '/') variant = 'landing'
  else if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) variant = 'auth'
  else if (pathname?.startsWith('/advisor')) variant = 'advisor'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const activeVariant = isJudgeMode && variant === 'dashboard' ? 'judge' : variant

  // Light Mode: Frosted Intelligence
  if (resolvedTheme === 'light') {
    return (
      <div className={cn("fixed inset-0 z-[-50] pointer-events-none overflow-hidden", className)}>
        {/* Layer 2: Frosted gradients and clouds */}
        <div 
          className="absolute inset-0 w-full h-full gpu-accelerate opacity-60"
          style={{
            background: `
              radial-gradient(ellipse at 10% -10%, rgba(149,127,239,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 90% 110%, rgba(113,97,239,0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(239,217,206,0.2) 0%, transparent 70%)
            `
          }}
        />
        <div className="absolute inset-0 w-full h-full gpu-accelerate opacity-40">
           <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full animate-breathe-slow gpu-accelerate" style={{ background: 'radial-gradient(circle, rgba(183,156,237,0.1) 0%, transparent 70%)' }} />
           <div className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] rounded-full animate-ambientPulse gpu-accelerate" style={{ background: 'radial-gradient(circle, rgba(239,217,206,0.15) 0%, transparent 70%)' }} />
        </div>
      </div>
    )
  }

  // Neutral Mode: Professional Workspace
  if (resolvedTheme === 'neutral') {
    return (
      <div className={cn("fixed inset-0 z-[-50] pointer-events-none overflow-hidden", className)}>
        <div 
          className="absolute inset-0 w-full h-full gpu-accelerate opacity-[0.03]"
          style={{
            background: `
              linear-gradient(135deg, rgba(113,97,239,0.5) 0%, transparent 100%)
            `
          }}
        />
      </div>
    )
  }

  // Dark Mode: Dreamy Twilight OS
  return (
    <div className={cn("fixed inset-0 z-[-50] pointer-events-none overflow-hidden", className)}>
      
      {/* Layer 1 is handled globally by body background-color: var(--background) */}

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
          animation: (activeVariant === 'landing' || activeVariant === 'advisor') ? 'driftY 120s linear infinite' : 'none'
        }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
          backgroundSize: '150px 150px',
          backgroundPosition: '50px 50px',
          animation: (activeVariant === 'landing' || activeVariant === 'advisor') ? 'driftX 150s linear infinite reverse' : 'none'
        }} />

        {/* Middle & Near Layers: Render only on Landing / Advisor to save FPS */}
        {(activeVariant === 'landing' || activeVariant === 'advisor') && (
          <>
            {/* Middle Layer: Blurred energy particles, 8% opacity, Organic drift */}
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(183,156,237,0.8) 2px, transparent 2px)',
              backgroundSize: '200px 200px',
              animation: 'driftX 60s ease-in-out infinite alternate'
            }} />
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(149,127,239,0.8) 2px, transparent 2px)',
              backgroundSize: '250px 250px',
              backgroundPosition: '100px 100px',
              animation: 'driftY 80s ease-in-out infinite alternate'
            }} />

            {/* Near Layer: Occasional intelligence pulses, 15% opacity, Rare movement */}
            <div className="absolute inset-0 opacity-[0.15]" style={{
              backgroundImage: 'radial-gradient(circle at center, var(--soft-periwinkle) 3px, transparent 3px)',
              backgroundSize: '400px 400px',
              animation: 'ambientPulse 15s ease-in-out infinite'
            }} />
          </>
        )}
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
            style={{ background: 'radial-gradient(circle, rgba(149,127,239,0.15) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full gpu-accelerate"
            style={{ background: 'radial-gradient(circle, rgba(183,156,237,0.15) 0%, transparent 70%)' }}
          />
        </>
      )}

      {/* Judge: Architecture node glows */}
      {activeVariant === 'judge' && (
        <>
          <div className="absolute top-[15%] left-[25%] w-32 h-32 rounded-full gpu-accelerate" style={{ background: 'radial-gradient(circle, rgba(149,127,239,0.1) 0%, transparent 70%)' }} />
          <div className="absolute top-[45%] right-[25%] w-48 h-48 rounded-full gpu-accelerate" style={{ background: 'radial-gradient(circle, rgba(183,156,237,0.1) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[20%] left-[40%] w-40 h-40 rounded-full gpu-accelerate" style={{ background: 'radial-gradient(circle, rgba(113,97,239,0.1) 0%, transparent 70%)' }} />
        </>
      )}
    </div>
  )
}
