import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { FileText, ArrowRight, Clock, Target, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { DemoShowcase } from "@/components/opportunities/demo-showcase"

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container-wide py-12 flex flex-col gap-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-8">
        <div>
          <h1 className="text-section-title mb-3 text-foreground">Active Action Plans</h1>
          <p className="text-body-text max-w-[600px]">
            Monitor and execute your guaranteed action plans based on uploaded documents.
          </p>
        </div>
        <Link href="/dashboard" className="btn-twilight h-12 px-8 flex items-center justify-center rounded-[999px] shadow-twilight-glow font-medium">
          Analyze New Document
        </Link>
      </div>

      <DemoShowcase />

      <div className="grid gap-6">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => {
            // Calculate deterministic readiness score
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
            let readinessScore: string | number = 'Unknown'
            
            if (totalItems > 0) {
              readinessScore = Math.round((completedCount / totalItems) * 100)
            }

            return (
              <div key={opp.id} className="liquid-glass-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center group">
                
                {/* Left: Category & Impact */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <div className="text-card-label text-primary">{opp.category || "Document"}</div>
                  
                  <h3 className="text-card-title text-foreground">
                    {opp.title || "Untitled Document"}
                  </h3>
                  
                  <p className="text-[15px] text-muted-foreground line-clamp-2 max-w-[800px] leading-relaxed">
                    {opp.simplified_summary || opp.raw_text_snippet?.substring(0, 150) + "..." || "Processing details..."}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 mt-2 pt-4 border-t border-glass-border/50">
                    <div className="flex items-center gap-2 text-[14px]">
                      <Clock className="w-4 h-4 text-warning" /> 
                      <span className="text-foreground">Deadline:</span> 
                      <span className="text-muted-foreground">{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'None detected'}</span>
                    </div>
                    
                    {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' && (
                      <div className="flex items-center gap-2 text-[14px]">
                        <Target className="w-4 h-4 text-success" /> 
                        <span className="text-foreground">Value:</span> 
                        <span className="text-muted-foreground">{opp.opportunity_value}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-[14px]">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      <span className="text-foreground">Missing Docs:</span>
                      <span className="text-muted-foreground">{missingCount} Items</span>
                    </div>
                  </div>
                </div>

                {/* Right: Readiness & Action */}
                <div className="w-full md:w-64 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 md:border-l md:border-glass-border md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-glass-border">
                  <div className="text-left md:text-right">
                    <div className={cn("text-[36px] font-semibold tracking-tight leading-none", readinessScore === 'Unknown' ? "text-muted-foreground text-[24px]" : "text-success")}>
                      {readinessScore}{readinessScore !== 'Unknown' ? '%' : ''}
                    </div>
                    <div className="text-card-label mt-2">Readiness</div>
                  </div>
                  
                  <Link href={`/opportunities/${opp.id}`} className="btn-twilight h-10 px-6 rounded-full text-[14px] font-medium flex items-center gap-2 whitespace-nowrap">
                    View Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            )
          })
        ) : (
          <div className="liquid-glass-card border-dashed border-glass-border p-[80px] flex flex-col items-center justify-center text-center">
            <div className="w-[80px] h-[80px] rounded-[24px] bg-primary/10 border border-primary/20 shadow-twilight-glow flex items-center justify-center mb-8">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-card-title text-foreground mb-3">No documents analyzed yet</h3>
            <p className="text-body-text mb-8 max-w-[500px]">
              Upload your first circular, scholarship, or scheme document to generate a personalized action plan instantly.
            </p>
            <Link href="/dashboard" className="btn-twilight h-12 px-8 flex items-center justify-center rounded-[999px] shadow-twilight-glow font-medium">
              Upload Document
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
