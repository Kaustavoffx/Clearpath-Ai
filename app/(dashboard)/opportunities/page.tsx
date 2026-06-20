import { createClient } from "@/lib/supabase/server"
import { ListOrdered } from "lucide-react"
import Link from "next/link"
import { OpportunitiesTable } from "@/components/opportunities/opportunities-table"

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
    <div className="container-wide py-6 flex flex-col gap-6 animate-fadeInUp max-w-[1440px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-6">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight mb-2 text-foreground flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-primary" /> Workspace Directory
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-[600px]">
            Your central hub for executing opportunities. Ordered automatically by deadline, funding value, and readiness score.
          </p>
        </div>
        <Link href="/analyze" className="btn-twilight h-10 px-6 flex items-center justify-center rounded-[10px] shadow-[0_0_15px_rgba(149,127,239,0.3)] font-medium shrink-0 text-[13px]">
          Analyze New Document
        </Link>
      </div>

      <OpportunitiesTable initialOpportunities={processedOpps} />
    </div>
  )
}
