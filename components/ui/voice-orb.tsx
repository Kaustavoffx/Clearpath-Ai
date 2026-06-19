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
  
  let stateClass = "border-primary/20 shadow-[0_0_40px_rgba(149,127,239,0.15)]"
  let icon = <Mic className="w-8 h-8 text-primary" />
  
  if (isListening) {
    stateClass = "border-primary/40 shadow-[0_0_60px_rgba(149,127,239,0.3)]"
    icon = <Mic className="w-8 h-8 text-white" />
  } else if (isProcessing) {
    stateClass = "border-wisteria/30 shadow-[0_0_50px_rgba(183,156,237,0.25)]"
    icon = <Loader2 className="w-8 h-8 text-wisteria animate-spin" style={{ animationDuration: '2s' }} />
  } else if (isSpeaking) {
    stateClass = "border-mauve/30 shadow-[0_0_60px_rgba(222,192,241,0.3)] scale-[1.03]"
    icon = (
      <div className="flex items-end justify-center gap-[3px] h-8">
        <div className="w-[3px] bg-mauve rounded-full h-4 animate-[wave_1.2s_ease-in-out_infinite_0ms]" />
        <div className="w-[3px] bg-mauve rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite_150ms]" />
        <div className="w-[3px] bg-white rounded-full h-8 animate-[wave_1.2s_ease-in-out_infinite_300ms]" />
        <div className="w-[3px] bg-mauve rounded-full h-6 animate-[wave_1.2s_ease-in-out_infinite_450ms]" />
        <div className="w-[3px] bg-mauve rounded-full h-4 animate-[wave_1.2s_ease-in-out_infinite_600ms]" />
      </div>
    )
  }

  return (
    <div className="relative group cursor-pointer gpu-accelerate" onClick={onToggleListen}>
      {/* Outer ambient glow */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-700 ease-in-out opacity-40 gpu-accelerate",
        isListening ? "bg-primary/20 scale-[1.6]" : 
        isProcessing ? "bg-wisteria/15 scale-110" : 
        isSpeaking ? "bg-mauve/20 scale-[1.5]" : 
        "bg-primary/10 scale-100 group-hover:scale-110"
      )} style={{ filter: 'blur(30px)' }} />
      
      {/* Core Orb */}
      <div className={cn(
        "relative flex items-center justify-center w-36 h-36 rounded-full transition-all duration-500 ease-out border-2 overflow-hidden gpu-accelerate",
        "bg-gradient-to-br from-glass-surface to-glass-layer",
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
