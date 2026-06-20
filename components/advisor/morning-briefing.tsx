'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, ArrowRight, Sparkles, User, FileText, CheckCircle, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardStats } from '@/lib/dashboard-engine'

interface MorningBriefingProps {
  userId: string;
  opportunities?: any[];
  stats?: DashboardStats;
  documents?: any[];
  tasks?: any[];
}

export function MorningBriefing({ userId, opportunities = [], stats, documents = [], tasks = [] }: MorningBriefingProps) {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  
  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', userId).single().then(({ data }) => {
      if (data) setProfile(data)
    })
  }, [userId])

  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';
  const firstName = profile?.first_name || 'there'

  if (opportunities.length === 0) {
    return (
      <div className="w-full liquid-glass-card overflow-hidden bg-[#071225]/40 border-l-2 border-[#858AE3]">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-semibold tracking-tight text-foreground flex items-center gap-3">
               <CheckCircle className="w-5 h-5 text-[#858AE3]" />
               Good {timeOfDay}, {firstName}. ClearPath OS is active.
            </h2>
            <p className="text-muted-foreground text-[14px]">
              Upload your first document below to generate a personalized action plan instantly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Ensure sorting matches V3: deadline + value + readiness gap + eligibility
  // For V3, priority_score is pre-calculated and stored in DB, or we can use it directly
  const topOpp = [...opportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))[0]

  // Find next action for topOpp
  let nextAction = "Review Application Details"
  const oppTasks = tasks.filter(t => t.opportunity_id === topOpp.id && t.status !== 'COMPLETED' && t.completion_percent !== 100)
  const reqDocs = topOpp.required_documents || []
  const oppDocs = documents.filter(d => d.opportunity_id === topOpp.id)
  
  const requiredNames = Array.isArray(reqDocs) ? reqDocs.map((d: any) => d.value || String(d)) : []
  const missing = requiredNames.filter(name => !oppDocs.find(d => d.name === name))

  if (missing.length > 0) {
    nextAction = `Upload: ${missing[0]}`
  } else if (oppTasks.length > 0) {
    const sortedTasks = [...oppTasks].sort((a, b) => (b.priority === 'Critical' ? 3 : b.priority === 'High' ? 2 : 1) - (a.priority === 'Critical' ? 3 : a.priority === 'High' ? 2 : 1))
    nextAction = `Execute: ${sortedTasks[0].title}`
  } else if (topOpp.readinessScore && topOpp.readinessScore >= 90) {
    nextAction = "Submit Final Application"
  }

  // Deadline formatting
  let deadlineText = "No deadline"
  if (topOpp.deadline) {
     const daysLeft = Math.ceil((new Date(topOpp.deadline).getTime() - Date.now()) / (1000 * 3600 * 24))
     if (daysLeft < 0) deadlineText = "Deadline Passed"
     else if (daysLeft === 0) deadlineText = "Due Today"
     else deadlineText = `Due in ${daysLeft} days`
  }

  return (
    <div className="w-full liquid-glass-card overflow-hidden border border-glass-border rounded-[32px]">
      <div className="p-8 border-b border-glass-border flex justify-between items-start bg-glass-surface/30">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            Good {timeOfDay}, {firstName}
          </h2>
          <p className="text-muted-foreground text-lg mt-2 leading-relaxed max-w-2xl">
            You have <span className="text-foreground font-semibold">{stats?.activeCount || 0}</span> active opportunities, <span className="text-danger font-semibold">{stats?.urgentDeadlinesCount || 0}</span> approaching deadlines, and <span className="text-warning font-semibold">{stats?.missingDocsCount || 0}</span> missing documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-glass-border">
        
        {/* Highest Priority */}
        <div className="p-8 flex flex-col md:col-span-2">
          <div className="text-[12px] uppercase tracking-widest font-semibold text-primary mb-3">
            Today's Top Priority
          </div>
          <div className="text-2xl font-semibold text-foreground leading-tight mb-4 truncate" title={topOpp.title}>
            {topOpp.title}
          </div>
          <div className="flex items-center gap-3 text-sm font-medium">
             <span className="text-danger bg-danger/10 px-3 py-1.5 rounded-full border border-danger/20">{deadlineText}</span>
             <span className="text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20">Readiness: {topOpp.readinessScore || 0}%</span>
          </div>
        </div>

        {/* Missing Documents & Value */}
        <div className="p-8 flex flex-col justify-center border-glass-border">
           <div className="flex flex-col gap-6">
             <div>
               <div className="text-[11px] uppercase tracking-widest font-semibold text-warning mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Missing Documents</div>
               <div className="text-base font-semibold text-foreground truncate">{missing.length > 0 ? `${missing.length} Items Pending` : 'All Documents Ready'}</div>
             </div>
             
             <div>
               <div className="text-[11px] uppercase tracking-widest font-semibold text-success mb-1">Funding Value</div>
               <div className="text-base font-semibold text-foreground truncate">{topOpp.opportunity_value || "Varies"}</div>
             </div>
           </div>
        </div>

        {/* Recommended Action */}
        <div className="p-8 bg-primary/5 flex flex-col justify-center relative overflow-hidden group hover:bg-primary/10 transition-colors cursor-pointer border-glass-border" onClick={() => router.push(`/opportunities/${topOpp.id}`)}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 blur-3xl" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-semibold text-primary mb-2 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Next Action Engine</div>
              <div className="text-lg font-semibold text-foreground leading-tight mb-3 line-clamp-2">{nextAction}</div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4">
               <span className="text-sm font-medium text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                 Continue Execution <ArrowRight className="w-4 h-4" />
               </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
