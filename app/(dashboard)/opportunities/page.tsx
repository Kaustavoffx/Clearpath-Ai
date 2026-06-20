import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { ListOrdered } from "lucide-react"
import Link from "next/link"
import { OpportunityQueue } from "@/components/opportunities/opportunity-queue"

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .order('priority_score', { ascending: false })

  const processedOpps = (opportunities || []).map(opp => {
    // Deterministic readiness score calculation for the overview
    const rawDocs = opp.required_documents || []
    const requiredDocsInsights = Array.isArray(rawDocs) ? rawDocs : []
    const missingCount = requiredDocsInsights.length
    
    const eligibilityReqs = opp.eligibility_analysis?.requirements || []
    let completedCount = 0
    let totalEligibilityReqs = eligibilityReqs.length
    
    eligibilityReqs.forEach((req: any) => {
      if (req.value && req.value.includes('[MATCHED]')) {
        completedCount++
      }
    })
  
    const totalItems = totalEligibilityReqs + missingCount
    let readinessScore = 0
    
    if (totalItems > 0) {
      readinessScore = Math.round((completedCount / totalItems) * 100)
    }

    return { ...opp, readinessScore }
  })

  return (
    <div className="container-wide py-12 flex flex-col gap-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-8">
        <div>
          <h1 className="text-section-title mb-3 text-foreground flex items-center gap-3">
            <ListOrdered className="w-8 h-8 text-primary" /> Priority Queue
          </h1>
          <p className="text-body-text max-w-[600px]">
            Your central hub for executing opportunities. Ordered automatically by deadline, funding value, and readiness score.
          </p>
        </div>
        <Link href="/dashboard" className="btn-twilight h-12 px-8 flex items-center justify-center rounded-[999px] shadow-twilight-glow font-medium shrink-0">
          Analyze New Document
        </Link>
      </div>


      <OpportunityQueue initialOpportunities={processedOpps} />
    </div>
  )
}
