import { createClient } from "@/lib/supabase/server"
import { ListOrdered } from "lucide-react"
import Link from "next/link"
import { OpportunitiesTable } from "@/components/opportunities/opportunities-table"

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch Opportunities
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', user.id)

  // Fetch Vault
  const { data: vaultDocs } = await supabase
    .from('document_vault')
    .select('document_type, file_name')
    .eq('user_id', user.id)
    .eq('verified', true)

  const userDocTypes = (vaultDocs || []).map(d => d.document_type?.toLowerCase() || d.file_name?.toLowerCase() || '')

  const processedOpps = (opportunities || []).map(opp => {
    // 1. Readiness Engine
    const rawDocs = opp.required_documents || []
    const requiredDocsInsights = Array.isArray(rawDocs) ? rawDocs : []
    
    let uploadedDocsCount = 0
    let missingDocsCount = 0

    const missingDocsList: string[] = []

    requiredDocsInsights.forEach(req => {
      const requiredName = (req.value || '').toLowerCase()
      // Fuzzy match document type
      const hasDoc = userDocTypes.some(vaultType => 
        vaultType.includes(requiredName) || requiredName.includes(vaultType)
      )

      if (hasDoc) {
        uploadedDocsCount++
      } else {
        missingDocsCount++
        missingDocsList.push(req.value)
      }
    })

    const totalRequiredDocs = requiredDocsInsights.length
    let readinessScore = 0

    if (totalRequiredDocs > 0) {
      readinessScore = Math.round((uploadedDocsCount / totalRequiredDocs) * 100)
    } else {
      // If no docs required, determine readiness based on eligibility
      const eligibilityReqs = opp.eligibility_analysis?.requirements || []
      let completedCount = 0
      eligibilityReqs.forEach((req: any) => {
        if (req.value && req.value.includes('[MATCHED]')) completedCount++
      })
      if (eligibilityReqs.length > 0) {
        readinessScore = Math.round((completedCount / eligibilityReqs.length) * 100)
      }
    }

    // 2. Priority Engine
    let priorityScore = opp.priority_score || 0
    
    if (priorityScore === 0 && opp.status !== 'PENDING') {
      let dWeight = 0
      if (opp.deadline) {
        const days = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (days < 0) dWeight = 0
        else if (days <= 7) dWeight = 40
        else if (days <= 14) dWeight = 30
        else if (days <= 30) dWeight = 20
        else dWeight = 10
      }

      let fWeight = 0
      if (opp.opportunity_value) {
        const match = opp.opportunity_value.match(/\d+(?:,\d+)*(?:\.\d+)?/)
        if (match) {
          const val = parseFloat(match[0].replace(/,/g, ''))
          if (val > 50000) fWeight = 30
          else if (val > 10000) fWeight = 20
          else if (val > 0) fWeight = 10
        } else if (opp.opportunity_value.toLowerCase().includes('waiver') || opp.opportunity_value.toLowerCase().includes('fully funded')) {
          fWeight = 30
        }
      }

      let rWeight = readinessScore * 0.3 // max 30 points

      priorityScore = Math.min(100, Math.round(dWeight + fWeight + rWeight))
    }

    return { 
      ...opp, 
      readinessScore, 
      missingDocsCount,
      missingDocsList,
      priorityScore
    }
  })

  // Sort by dynamically computed priority
  processedOpps.sort((a, b) => b.priorityScore - a.priorityScore)

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
