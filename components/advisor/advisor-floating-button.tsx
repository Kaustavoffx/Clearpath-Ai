'use client'

import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { AdvisorImmersionMode } from './advisor-immersion-mode'

export function AdvisorFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed right-6 z-40 bg-[#0B1E2E] border border-[#858AE3]/30 text-[#858AE3] p-4 rounded-full shadow-[0_0_20px_rgba(133,138,227,0.2)] hover:scale-110 hover:shadow-[0_0_30px_rgba(133,138,227,0.4)] transition-all duration-300 flex items-center justify-center group md:bottom-6 bottom-[calc(env(safe-area-inset-bottom)+90px)]"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      <AdvisorImmersionMode isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
