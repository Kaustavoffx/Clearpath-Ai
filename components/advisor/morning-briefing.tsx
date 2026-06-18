import React from 'react'
import { AlertTriangle, FileWarning, ArrowRight, Sparkles } from 'lucide-react'

export function MorningBriefing() {
  // In a real implementation, this would fetch from the Advisor Context API or Supabase
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';
  
  return (
    <div className="w-full bg-[#0B1E2E]/60 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden shadow-glass-card">
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#07111D] to-transparent flex justify-between items-center">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-foreground flex items-center gap-3">
            Good {timeOfDay}, Kaustav
          </h2>
          <p className="text-muted-foreground text-[14px] mt-1">Here is your intelligence briefing for today.</p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-full bg-primary/20 items-center justify-center border border-primary/40 shadow-[0_0_20px_rgba(232,235,104,0.2)]">
           <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        
        {/* Status Blocks */}
        <div className="p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 rounded-full bg-warning/10"><AlertTriangle className="w-5 h-5 text-warning" /></div>
             <div className="text-[14px] font-medium text-foreground">1 Urgent Opportunity</div>
           </div>
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-full bg-danger/10"><FileWarning className="w-5 h-5 text-danger" /></div>
             <div className="text-[14px] font-medium text-foreground">2 Missing Documents</div>
           </div>
        </div>

        {/* Priority Focus */}
        <div className="p-6 flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Highest Priority</div>
          <div className="text-[20px] font-semibold text-foreground leading-tight mb-2">SVMCM Scholarship</div>
          <div className="inline-flex items-center gap-2 text-[12px] font-medium text-warning bg-warning/10 px-3 py-1 rounded-[999px] self-start border border-warning/20">
            Action Required
          </div>
        </div>

        {/* Action Recommendation */}
        <div className="p-6 bg-primary/5 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          <div className="relative z-10">
            <div className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-2">Recommended Action</div>
            <div className="text-[18px] font-semibold text-foreground leading-tight mb-3">Upload Income Certificate</div>
            <div className="flex items-center justify-between">
               <div className="text-[13px] font-medium text-success flex items-center gap-1">
                 Expected Impact: +15 readiness
               </div>
               <button className="w-8 h-8 rounded-full bg-primary text-[#07111D] flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(232,235,104,0.4)]">
                 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
