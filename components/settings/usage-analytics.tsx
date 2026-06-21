'use client'

import { Activity, Target, HardDrive, Cpu, Zap, CreditCard, CheckCircle2 } from "lucide-react"

export function UsageAnalytics({ initialUsage }: { initialUsage: any }) {
  const usage = initialUsage || {
    documents_analyzed: 0,
    opportunities_generated: 0,
    storage_used_mb: 0,
    openai_calls: 0,
    gemini_calls: 0,
    deepgram_calls: 0,
    subscription_tier: 'Free',
    readiness_tasks_completed: 0,
    readiness_tasks_total: 0
  }

  // Free Tier Mock Limits
  const MAX_DOCUMENTS = 3
  const MAX_STORAGE = 50 // MB
  
  const docPercent = Math.min(100, (usage.documents_analyzed / MAX_DOCUMENTS) * 100)
  const storagePercent = Math.min(100, (usage.storage_used_mb / MAX_STORAGE) * 100)

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* PLAN HEADER */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[24px]" />
        <div className="cinematic-glass-card p-8 overflow-hidden relative rounded-[24px]">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] uppercase tracking-widest font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">Current Plan</span>
            </div>
            <h2 className="text-[32px] font-bold text-white tracking-tight">{usage.subscription_tier} Plan</h2>
            <p className="text-[14px] text-muted-foreground mt-1">You are currently using the community free tier.</p>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button className="h-10 px-6 rounded-xl bg-primary text-white text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(113,97,239,0.3)] hover:scale-105">
              Upgrade to Pro
            </button>
            <div className="text-[11px] text-muted-foreground text-center">Limits reset on July 1st</div>
          </div>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-3 overflow-visible">
        
        {/* USAGE LIMITS */}
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[24px]" />
          <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
            <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" /> Quotas & Limits
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] font-medium">
                <span className="text-foreground flex items-center gap-2"><Target className="w-4 h-4 text-muted-foreground" /> Documents Analyzed</span>
                <span className="text-muted-foreground">{usage.documents_analyzed} / {MAX_DOCUMENTS}</span>
              </div>
              <div className="h-2 w-full bg-glass-layer rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${docPercent}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[13px] font-medium">
                <span className="text-foreground flex items-center gap-2"><HardDrive className="w-4 h-4 text-muted-foreground" /> Storage Used</span>
                <span className="text-muted-foreground">{usage.storage_used_mb}MB / {MAX_STORAGE}MB</span>
              </div>
              <div className="h-2 w-full bg-glass-layer rounded-full overflow-hidden">
                <div className="h-full bg-success transition-all duration-1000" style={{ width: `${storagePercent}%` }} />
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-8 p-3 overflow-visible">
          <div className="card-wrapper group/card-wrapper">
            <div className="card-glow rounded-[20px]" />
            <div className="liquid-glass-card p-6 border border-glass-border rounded-[20px] flex flex-col justify-center h-full">
            <Zap className="w-6 h-6 text-warning mb-3" />
            <div className="text-[28px] font-bold text-foreground leading-none">{usage.opportunities_generated}</div>
            <div className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mt-2">Opportunities Generated</div>
            </div>
          </div>
          <div className="card-wrapper group/card-wrapper">
            <div className="card-glow rounded-[20px]" />
            <div className="liquid-glass-card p-6 border border-glass-border rounded-[20px] flex flex-col justify-center h-full">
            <CheckCircle2 className="w-6 h-6 text-success mb-3" />
            <div className="text-[28px] font-bold text-foreground leading-none">{usage.readiness_tasks_completed} / {usage.readiness_tasks_total}</div>
            <div className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mt-2">Tasks Completed</div>
            </div>
          </div>
        </div>

      </div>

      {/* AI COMPUTE BREAKDOWN */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[24px]" />
        <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
          <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-soft-periwinkle" /> Hardware & Compute Usage
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-black/20 rounded-[16px] border border-glass-border">
            <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-widest mb-1">OpenAI Operations</div>
            <div className="text-[24px] font-bold text-foreground">{usage.openai_calls}</div>
          </div>
          <div className="p-5 bg-black/20 rounded-[16px] border border-glass-border">
            <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Gemini Operations</div>
            <div className="text-[24px] font-bold text-foreground">{usage.gemini_calls}</div>
          </div>
          <div className="p-5 bg-black/20 rounded-[16px] border border-glass-border">
            <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Deepgram TTS</div>
            <div className="text-[24px] font-bold text-foreground">{usage.deepgram_calls}</div>
          </div>
        </div>
          </div>
        </div>

    </div>
  )
}
