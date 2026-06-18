'use client'

import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { AdvisorPanel } from './advisor-panel'

export function AdvisorFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0B1E2E] border border-primary/30 text-primary p-4 rounded-full shadow-[0_0_20px_rgba(232,235,104,0.15)] hover:scale-110 hover:shadow-[0_0_30px_rgba(232,235,104,0.25)] transition-all duration-300 flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      <AdvisorPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
