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
  
  let stateClass = "border-[#858AE3]/15 shadow-[0_0_40px_rgba(133,138,227,0.12)]"
  let icon = <Mic className="w-8 h-8 text-[#858AE3]/80" />
  
  if (isListening) {
    stateClass = "border-[#97DFFC]/40 shadow-[0_0_60px_rgba(151,223,252,0.3)]"
    icon = <Mic className="w-8 h-8 text-[#97DFFC]" />
  } else if (isProcessing) {
    stateClass = "border-[#613DC1]/30 shadow-[0_0_50px_rgba(97,61,193,0.25)]"
    icon = <Loader2 className="w-8 h-8 text-[#858AE3] animate-spin" style={{ animationDuration: '2s' }} />
  } else if (isSpeaking) {
    stateClass = "border-[#858AE3]/30 shadow-[0_0_60px_rgba(133,138,227,0.3)] scale-[1.03]"
    icon = (
      <div className="flex items-end justify-center gap-[3px] h-8">
        <div className="w-[3px] bg-[#858AE3] rounded-full h-4 animate-[wave_1.2s_ease-in-out_infinite_0ms]" />
        <div className="w-[3px] bg-[#858AE3] rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite_150ms]" />
        <div className="w-[3px] bg-[#97DFFC] rounded-full h-8 animate-[wave_1.2s_ease-in-out_infinite_300ms]" />
        <div className="w-[3px] bg-[#858AE3] rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite_450ms]" />
        <div className="w-[3px] bg-[#858AE3] rounded-full h-4 animate-[wave_1.2s_ease-in-out_infinite_600ms]" />
      </div>
    )
  }

  return (
    <div className="relative group cursor-pointer gpu-accelerate" onClick={onToggleListen}>
      {/* Outer ambient glow */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-700 ease-in-out opacity-40 gpu-accelerate",
        isListening ? "bg-[#97DFFC]/20 scale-[1.6]" : 
        isProcessing ? "bg-[#613DC1]/15 scale-110" : 
        isSpeaking ? "bg-[#858AE3]/20 scale-[1.5]" : 
        "bg-[#858AE3]/10 scale-100 group-hover:scale-110"
      )} style={{ filter: 'blur(30px)' }} />
      
      {/* Core Orb */}
      <div className={cn(
        "relative flex items-center justify-center w-36 h-36 rounded-full transition-all duration-500 ease-out border-2 overflow-hidden gpu-accelerate",
        "bg-gradient-to-br from-[#071225] via-[#0B1020] to-[#071225]",
        !isListening && !isProcessing && !isSpeaking && "animate-breathe",
        stateClass
      )}>
        {/* Inner reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
        
        {/* Icon */}
        <div className="relative z-10">
          {icon}
        </div>
      </div>
    </div>
  )
}
