'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, Sparkles, User, FileText, CheckCircle, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

interface MorningBriefingProps {
  userId: string;
}

export function MorningBriefing({ userId }: MorningBriefingProps) {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      // Fetch Opportunities
      const { data: oppsData } = await supabase
        .from('opportunities')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'PROCESSED')
      
      if (profileData) setProfile(profileData)
      if (oppsData) setOpportunities(oppsData)
    } catch (error) {
      console.error('Error fetching intelligence data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // 5-second polling interval for live AI updates
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [userId])

  if (loading) {
    return (
      <div className="w-full liquid-glass-card p-6 h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Sparkles className="w-6 h-6 text-[#858AE3] animate-pulse" />
           <span className="text-muted-foreground text-sm font-medium">Loading Intelligence Brief...</span>
        </div>
      </div>
    )
  }

  // Derived UI States
  const isProfileComplete = profile && profile.grade_level !== null && profile.grade_level !== ''

  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';
  const firstName = profile?.first_name || 'there'

  // --- State 1: No Profile ---
  if (!isProfileComplete) {
    return (
      <div className="w-full liquid-glass-card overflow-hidden bg-[#071225]/40 border-l-2 border-[#F87171]">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-semibold tracking-tight text-foreground flex items-center gap-3">
               <User className="w-5 h-5 text-[#F87171]" />
               Profile Incomplete
            </h2>
            <p className="text-muted-foreground text-[14px]">
              Complete your profile to unlock personalized eligibility intelligence.
            </p>
          </div>
          <Link href="/settings" className="px-6 py-2.5 rounded-[12px] bg-[#F87171] text-[#030712] font-semibold hover:bg-[#F87171]/90 transition-colors flex items-center gap-2">
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // --- State 2: No Documents ---
  if (opportunities.length === 0) {
    return (
      <div className="w-full liquid-glass-card overflow-hidden bg-[#071225]/40 border-l-2 border-[#858AE3]">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-semibold tracking-tight text-foreground flex items-center gap-3">
               <CheckCircle className="w-5 h-5 text-[#858AE3]" />
               Welcome, {firstName} — ClearPath OS is ready.
            </h2>
            <p className="text-muted-foreground text-[14px]">
              Upload your first document (scholarship notice, government scheme, school circular) to generate a personalized action plan.
            </p>
            <div className="flex gap-4 mt-2 text-[12px] text-muted-foreground">
              <span>Profile Completion: 100%</span>
              <span>•</span>
              <span>Documents Processed: 0</span>
              <span>•</span>
              <span>Active Opportunities: 0</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- State 3: Live Intelligence Brief ---
  
  // Ranking Logic
  const rankedOpps = [...opportunities].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Deadline weight
    const daysA = a.deadline ? (new Date(a.deadline).getTime() - Date.now()) / (1000 * 3600 * 24) : 999
    if (daysA > 0 && daysA < 7) scoreA += 50
    else if (daysA > 0 && daysA < 30) scoreA += 20

    const daysB = b.deadline ? (new Date(b.deadline).getTime() - Date.now()) / (1000 * 3600 * 24) : 999
    if (daysB > 0 && daysB < 7) scoreB += 50
    else if (daysB > 0 && daysB < 30) scoreB += 20

    // Readiness Gap weight
    scoreA += (100 - (a.readiness_score || 0)) * 0.5
    scoreB += (100 - (b.readiness_score || 0)) * 0.5

    // Value weight
    const valA = parseInt((a.opportunity_value || '0').replace(/[^0-9]/g, ''))
    if (!isNaN(valA)) scoreA += (valA / 1000)

    const valB = parseInt((b.opportunity_value || '0').replace(/[^0-9]/g, ''))
    if (!isNaN(valB)) scoreB += (valB / 1000)

    // Match weight
    const matchA = a.eligibility_analysis?.is_eligible === true ? 20 : 0
    const matchB = b.eligibility_analysis?.is_eligible === true ? 20 : 0
    scoreA += matchA
    scoreB += matchB

    return scoreB - scoreA
  })

  const topOpp = rankedOpps[0]

  // Find top missing doc
  let topMissingDoc = "No immediate documents missing"
  if (topOpp.required_documents && Array.isArray(topOpp.required_documents) && topOpp.required_documents.length > 0) {
    // Just pick the first required document as the next action for now
    // In a full implementation we'd diff against uploaded docs
    topMissingDoc = topOpp.required_documents[0].name || topOpp.required_documents[0] || "Documentation Required"
  }

  // Calculate missing docs count across all
  let totalMissingDocs = 0
  rankedOpps.forEach(opp => {
    if (opp.required_documents && Array.isArray(opp.required_documents)) {
      totalMissingDocs += opp.required_documents.length
    }
  })

  // Format Deadline
  let deadlineText = "No deadline"
  if (topOpp.deadline) {
     const daysLeft = Math.ceil((new Date(topOpp.deadline).getTime() - Date.now()) / (1000 * 3600 * 24))
     if (daysLeft < 0) deadlineText = "Deadline Passed"
     else if (daysLeft === 0) deadlineText = "Due Today"
     else deadlineText = `Deadline in ${daysLeft} days`
  }

  return (
    <div className="w-full liquid-glass-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-glass-border flex justify-between items-center bg-[#071225]/40">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground flex items-center gap-3">
            Good {timeOfDay}, {firstName}
          </h2>
          <p className="text-muted-foreground text-[13px] mt-1 font-normal">Based on your profile and activity, here is today's intelligence briefing.</p>
        </div>
        <div className="hidden sm:flex w-10 h-10 rounded-full bg-[#858AE3]/10 items-center justify-center border border-[#858AE3]/20">
           <Sparkles className="w-5 h-5 text-[#858AE3] animate-breathe" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-glass-border">
        
        {/* Highest Priority */}
        <div className="p-6 flex flex-col md:col-span-2">
          <div className="text-card-label mb-2 flex items-center gap-2">
            Highest Priority
          </div>
          <div className="text-[20px] font-semibold text-foreground leading-tight mb-2 pr-4 truncate" title={topOpp.title}>
            {topOpp.title}
          </div>
          <div className="flex items-center gap-3 text-[13px] mt-2">
             <span className="text-[#F87171] font-medium bg-[#F87171]/10 px-2.5 py-1 rounded-full border border-[#F87171]/20">{deadlineText}</span>
             <span className="text-muted-foreground text-[12px]">{topOpp.readiness_score !== undefined ? `Readiness: ${topOpp.readiness_score}%` : 'Readiness: Pending'}</span>
          </div>
        </div>

        {/* Missing Documents & Value */}
        <div className="p-6 flex flex-col justify-center">
           <div className="flex flex-col gap-4">
             <div>
               <div className="text-card-label mb-1 text-[#F87171] flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Missing Documents</div>
               <div className="text-[14px] font-medium text-foreground truncate" title={topMissingDoc}>{topMissingDoc}</div>
             </div>
             
             <div>
               <div className="text-card-label mb-1 text-[#93CAF6]">Potential Value</div>
               <div className="text-[14px] font-medium text-foreground truncate">{topOpp.opportunity_value || "Varies"}</div>
             </div>
           </div>
        </div>

        {/* Recommended Action */}
        <div className="p-6 bg-[#858AE3]/[0.03] flex flex-col justify-center relative overflow-hidden group hover:bg-[#858AE3]/[0.05] transition-colors cursor-pointer" onClick={() => router.push(`/opportunities/${topOpp.id}`)}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#858AE3]/5 rounded-full -mr-10 -mt-10 transition-spring group-hover:scale-150" style={{ filter: 'blur(40px)' }} />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="text-card-label text-[#858AE3] mb-2 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Recommended Next Action</div>
              <div className="text-[16px] font-semibold text-foreground leading-tight mb-3">Upload {topMissingDoc}</div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-2">
               <div className="text-[12px] font-medium text-[#93CAF6]">
                 Expected Impact: +18%
               </div>
               <button className="w-8 h-8 rounded-full bg-[#858AE3] text-[#030712] flex items-center justify-center hover:scale-110 transition-spring shrink-0">
                 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
