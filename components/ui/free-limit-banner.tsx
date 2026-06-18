'use client'

import React from 'react'
import { Sparkles, ArrowRight, FileText, MessageSquare, Mic } from 'lucide-react'
import Link from 'next/link'

interface FreeLimitBannerProps {
  documentCount?: number;
  advisorCount?: number;
  voiceCount?: number;
}

export function FreeLimitBanner({ 
  documentCount = 3, 
  advisorCount = 3, 
  voiceCount = 3 
}: FreeLimitBannerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-[24px] overflow-hidden liquid-glass-card border border-white/10 relative mt-8">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-primary/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] bg-[#97DFFC]/10 pointer-events-none" />

      <div className="p-8 relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-[16px] bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(133,138,227,0.15)]">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-[24px] font-semibold tracking-tight text-white mb-3">Free Access Complete</h2>
        
        <p className="text-[15px] text-muted-foreground max-w-md mb-8">
          You have experienced ClearPath OS. To continue using personalized educational intelligence, connect your own AI providers.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-black/20 rounded-[16px] p-4 border border-white/5 flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#858AE3] mb-2" />
            <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Document Analysis</div>
            <div className="text-[16px] font-bold text-white">{documentCount} / 3 Used</div>
          </div>
          <div className="bg-black/20 rounded-[16px] p-4 border border-white/5 flex flex-col items-center">
            <MessageSquare className="w-5 h-5 text-[#93CAF6] mb-2" />
            <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Advisor Sessions</div>
            <div className="text-[16px] font-bold text-white">{advisorCount} / 3 Used</div>
          </div>
          <div className="bg-black/20 rounded-[16px] p-4 border border-white/5 flex flex-col items-center">
            <Mic className="w-5 h-5 text-[#97DFFC] mb-2" />
            <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Voice Sessions</div>
            <div className="text-[16px] font-bold text-white">{voiceCount} / 3 Used</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href="/ai-providers" className="w-full">
            <button className="w-full py-3.5 rounded-[12px] bg-primary text-[#030712] font-semibold text-[14px] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(133,138,227,0.2)]">
              Connect AI Providers <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
