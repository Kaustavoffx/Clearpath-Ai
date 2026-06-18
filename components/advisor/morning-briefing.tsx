import React from 'react'
import { AlertTriangle, FileWarning, ArrowRight, Sparkles } from 'lucide-react'

interface MorningBriefingProps {
  userName?: string
}

export function MorningBriefing({ userName = 'there' }: MorningBriefingProps) {
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';
  
  return (
    <div className="w-full liquid-glass-card overflow-hidden">
      <div className="p-6 border-b border-glass-border flex justify-between items-center bg-[#071225]/40">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground flex items-center gap-3">
            Good {timeOfDay}, {userName}
          </h2>
          <p className="text-muted-foreground text-[13px] mt-1 font-normal">Here is your intelligence briefing for today.</p>
        </div>
        <div className="hidden sm:flex w-10 h-10 rounded-full bg-[#858AE3]/10 items-center justify-center border border-[#858AE3]/20">
           <Sparkles className="w-5 h-5 text-[#858AE3] animate-breathe" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-glass-border">
        
        {/* Status */}
        <div className="p-6 flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-full bg-[#858AE3]/8"><AlertTriangle className="w-4 h-4 text-[#858AE3]" /></div>
             <div className="text-[13px] font-medium text-foreground">1 Urgent Opportunity</div>
           </div>
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-full bg-[#7364D2]/8"><FileWarning className="w-4 h-4 text-[#7364D2]" /></div>
             <div className="text-[13px] font-medium text-foreground">2 Missing Documents</div>
           </div>
        </div>

        {/* Priority */}
        <div className="p-6 flex flex-col justify-center">
          <div className="text-card-label mb-2">Highest Priority</div>
          <div className="text-[18px] font-semibold text-foreground leading-tight mb-2">SVMCM Scholarship</div>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium text-[#858AE3] bg-[#858AE3]/8 px-3 py-1 rounded-full self-start border border-[#858AE3]/15">
            Action Required
          </div>
        </div>

        {/* Action */}
        <div className="p-6 bg-[#858AE3]/[0.03] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#858AE3]/5 rounded-full -mr-10 -mt-10 transition-spring group-hover:scale-150" style={{ filter: 'blur(40px)' }} />
          <div className="relative z-10">
            <div className="text-card-label text-[#858AE3] mb-2">Recommended Action</div>
            <div className="text-[16px] font-semibold text-foreground leading-tight mb-3">Upload Income Certificate</div>
            <div className="flex items-center justify-between">
               <div className="text-[12px] font-medium text-[#93CAF6] flex items-center gap-1">
                 Expected: +15 readiness
               </div>
               <button className="w-8 h-8 rounded-full bg-[#858AE3] text-[#030712] flex items-center justify-center hover:scale-110 transition-spring">
                 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
