'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Mic, Loader2 } from 'lucide-react'

interface VoiceOrbProps {
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  onToggleListen: () => void
}

export function VoiceOrb({ isListening, isProcessing, isSpeaking, onToggleListen }: VoiceOrbProps) {
  // We use CSS variables to drive the glow based on state
  
  let stateClass = "border-[#858AE3]/20 shadow-[0_0_40px_rgba(133,138,227,0.2)]"
  let icon = <Mic className="w-8 h-8 text-[#858AE3]" />
  
  if (isListening) {
    stateClass = "border-[#97DFFC]/50 shadow-[0_0_80px_rgba(151,223,252,0.5)]"
    icon = <Mic className="w-8 h-8 text-[#97DFFC] animate-pulse" />
  } else if (isProcessing) {
    stateClass = "border-[#613DC1]/50 shadow-[0_0_60px_rgba(97,61,193,0.4)]"
    icon = <Loader2 className="w-8 h-8 text-[#613DC1] animate-spin" />
  } else if (isSpeaking) {
    stateClass = "border-[#858AE3]/50 shadow-[0_0_80px_rgba(133,138,227,0.5)] scale-105"
    // We could put a waveform here, but an icon is simpler for now
    icon = (
      <div className="flex items-end justify-center gap-1 h-8">
        <div className="w-1.5 bg-[#858AE3] rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
        <div className="w-1.5 bg-[#858AE3] rounded-full animate-[bounce_1s_infinite_300ms] h-4/5" />
        <div className="w-1.5 bg-[#858AE3] rounded-full animate-[bounce_1s_infinite_200ms] h-full" />
        <div className="w-1.5 bg-[#858AE3] rounded-full animate-[bounce_1s_infinite_400ms] h-3/5" />
      </div>
    )
  }

  return (
    <div className="relative group cursor-pointer" onClick={onToggleListen}>
      {/* Outer Glow / Ripple Effect */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-700 ease-in-out opacity-50 blur-xl",
        isListening ? "bg-[#97DFFC]/30 scale-150" : 
        isProcessing ? "bg-[#613DC1]/30 scale-110" : 
        isSpeaking ? "bg-[#858AE3]/40 scale-150" : 
        "bg-[#858AE3]/20 scale-100 group-hover:scale-110"
      )} />
      
      {/* Core Orb */}
      <div className={cn(
        "relative flex items-center justify-center w-32 h-32 rounded-full glass-thick backdrop-blur-2xl transition-all duration-500 ease-in-out border-2 overflow-hidden",
        stateClass
      )}>
        {/* Subtle inner reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/40 opacity-50 pointer-events-none" />
        
        {/* Icon */}
        <div className="relative z-10 transition-transform duration-300">
          {icon}
        </div>
      </div>
    </div>
  )
}
