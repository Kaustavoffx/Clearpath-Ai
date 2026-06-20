'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface VoiceOrbProps {
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  onToggleListen: () => void
}

export function VoiceOrb({ isListening, isProcessing, isSpeaking, onToggleListen }: VoiceOrbProps) {
  
  // State specific sizing and physics
  const orbScale = isListening ? "scale-110" : isSpeaking ? "scale-[1.05]" : "scale-100"
  const haloScale = isListening ? "scale-[1.5] opacity-80" : isProcessing ? "scale-110 opacity-60" : isSpeaking ? "scale-[1.4] opacity-70" : "scale-100 opacity-40"
  const isActive = isListening || isProcessing || isSpeaking

  
  return (
    <div className="relative group cursor-pointer gpu-accelerate flex items-center justify-center w-[300px] h-[300px]" onClick={onToggleListen}>
      
      {/* Layer 1: Massive Energy Halo (animated colors) */}
      <div className={cn(
        "absolute inset-[-100%] rounded-full transition-all duration-[2000ms] ease-in-out mix-blend-screen pointer-events-none",
        haloScale,
        !isListening && !isProcessing && !isSpeaking && "animate-breathe-slow"
      )} style={{ 
        boxShadow: isActive 
          ? '0 0 80px rgba(183,156,237,0.4), inset 0 0 40px rgba(183,156,237,0.4)'
          : '0 0 40px rgba(113,97,239,0.2), inset 0 0 20px rgba(113,97,239,0.2)'
      }} />

      {/* Layer 5 (Behind): Voice Wave Energy Ring (Orbiting ring) */}
      <div className={cn(
        "absolute inset-0 m-auto w-[220px] h-[220px] rounded-full border border-primary/20 transition-all duration-700",
        (isListening || isSpeaking) ? "animate-ping opacity-60" : "opacity-0 scale-90",
      )} style={{ animationDuration: '3s' }} />
      <div className={cn(
        "absolute inset-0 m-auto w-[240px] h-[240px] rounded-full border border-wisteria/20 transition-all duration-700",
        isSpeaking ? "animate-ping opacity-40" : "opacity-0 scale-90",
      )} style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

      {/* Layer 2: Liquid Glass Sphere */}
      <div className={cn(
        "relative flex items-center justify-center w-48 h-48 rounded-full transition-all duration-[800ms] cubic-bezier(0.22, 1, 0.36, 1) overflow-hidden shadow-[0_0_60px_rgba(113,97,239,0.3)]",
        "bg-glass-surface border border-glass-border backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]",
        orbScale,
        !isListening && !isProcessing && !isSpeaking && "animate-breathe-slow"
      )}
      style={{
        boxShadow: `inset 0 0 40px rgba(149,127,239,0.4), 0 0 60px rgba(113,97,239,0.5)`
      }}>
        
        {/* Layer 3: Reactive Glass Surface (Refraction & Highlights) */}
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.1) 100%)`,
          mixBlendMode: 'overlay'
        }} />
        <div className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.15] pointer-events-none transition-transform duration-1000",
          isProcessing && "animate-spin"
        )} />
        {isProcessing && (
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white/40 animate-spin" style={{ animationDuration: '3s' }} />
        )}

        {/* Layer 4: Premium Metallic Microphone & States */}
        <div className="relative z-10 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {isSpeaking ? (
            <div className="flex items-end justify-center gap-[4px] h-12">
              <div className="w-[4px] bg-gradient-to-t from-mauve to-white rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite_0ms]" />
              <div className="w-[4px] bg-gradient-to-t from-wisteria to-white rounded-full h-10 animate-[wave_1.2s_ease-in-out_infinite_150ms]" />
              <div className="w-[4px] bg-gradient-to-t from-primary to-white rounded-full h-12 animate-[wave_1.2s_ease-in-out_infinite_300ms]" />
              <div className="w-[4px] bg-gradient-to-t from-wisteria to-white rounded-full h-10 animate-[wave_1.2s_ease-in-out_infinite_450ms]" />
              <div className="w-[4px] bg-gradient-to-t from-mauve to-white rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite_600ms]" />
            </div>
          ) : isProcessing ? (
            <div className="w-10 h-10 border-4 border-wisteria/30 border-t-wisteria rounded-full animate-spin" />
          ) : (
            <svg 
              className={cn("w-12 h-12 transition-colors duration-500", isListening ? "text-white" : "text-primary/90")}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
