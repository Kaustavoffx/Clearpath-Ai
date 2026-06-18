import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, ArrowRight, Clock, Target } from "lucide-react"
import Link from "next/link"
import { DecisionCard } from "@/components/ui/decision-card"
import { DemoShowcase } from "@/components/opportunities/demo-showcase"

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container-standard py-12 flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-step-4 mb-2">Active Action Plans</h1>
          <p className="text-step-1 text-muted-foreground max-w-2xl">
            Monitor and execute your guaranteed action plans.
          </p>
        </div>
        <Link href="/dashboard" className={cn(buttonVariants(), "h-10 px-6 rounded-md shadow-elevation-1 transition-crisp")}>
          Analyze New Document
        </Link>
      </div>

      <DemoShowcase />

      <div className="grid gap-6">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <DecisionCard key={opp.id} title={opp.title || "Untitled Document"} label={opp.category || "Document"}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <p className="text-step-1 text-foreground mb-6 line-clamp-2">
                    {opp.simplified_summary || opp.raw_text_snippet?.substring(0, 150) + "..." || "Processing details..."}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-step-0 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 
                      <span className="font-medium text-foreground">Deadline:</span> {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'None detected'}
                    </div>
                    {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" /> 
                        <span className="font-medium text-foreground">Value:</span> {opp.opportunity_value}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-center items-center md:items-end gap-4 md:border-l md:border-border md:pl-8">
                  <div className="text-center md:text-right">
                    <div className="text-step-3 font-bold text-success">{opp.readiness_score || 0}%</div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Readiness</div>
                  </div>
                  <Link href={`/opportunities/${opp.id}`} className={cn(buttonVariants(), "h-10 px-6 rounded-md shadow-elevation-1 group transition-crisp w-full md:w-auto")}>
                    View Plan <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </DecisionCard>
          ))
        ) : (
          <div className="decision-surface-muted border-dashed p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-elevation-1 flex items-center justify-center text-muted-foreground mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-step-2 font-semibold text-foreground mb-2">No documents analyzed yet</h3>
            <p className="text-step-1 text-muted-foreground max-w-[40ch] mb-8 leading-relaxed">
              Upload your first circular, scholarship, or scheme document to generate a personalized action plan instantly.
            </p>
            <Link href="/dashboard" className={cn(buttonVariants(), "h-10 px-8 rounded-md shadow-elevation-1 transition-crisp")}>
              Upload Document
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
