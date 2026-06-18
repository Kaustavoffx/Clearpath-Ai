import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button-variants"
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
    <div className="container-wide py-12 flex flex-col gap-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-8">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.025em] mb-2">Active Action Plans</h1>
          <p className="text-[16px] text-muted-foreground max-w-[600px]">
            Monitor and execute your guaranteed action plans based on uploaded documents.
          </p>
        </div>
        <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 rounded-[999px] shadow-glass-card transition-spring")}>
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
                  <p className="text-[16px] text-foreground mb-6 line-clamp-2">
                    {opp.simplified_summary || opp.raw_text_snippet?.substring(0, 150) + "..." || "Processing details..."}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-[14px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 
                      <span className="font-medium text-foreground">Deadline:</span> {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'None detected'}
                    </div>
                    {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-success" /> 
                        <span className="font-medium text-success">Value: {opp.opportunity_value}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-center items-center md:items-end gap-4 md:border-l md:border-glass-border md:pl-8">
                  <div className="text-center md:text-right">
                    <div className="text-[48px] font-semibold text-success tracking-[-0.02em] leading-none">{opp.readiness_score || 0}%</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-2">Readiness</div>
                  </div>
                  <Link href={`/opportunities/${opp.id}`} className={cn(buttonVariants(), "w-full md:w-auto h-10 px-6 rounded-[999px] shadow-glass-card group transition-spring")}>
                    View Plan <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-spring" />
                  </Link>
                </div>
              </div>
            </DecisionCard>
          ))
        ) : (
          <div className="liquid-glass-card border-dashed p-[64px] flex flex-col items-center justify-center text-center">
            <div className="w-[80px] h-[80px] rounded-[24px] bg-glass-surface border border-glass-border shadow-glass-card flex items-center justify-center text-muted-foreground mb-8">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-[24px] font-semibold text-foreground tracking-[-0.015em] mb-3">No documents analyzed yet</h3>
            <p className="text-[16px] text-muted-foreground max-w-[400px] mb-8 leading-[24px]">
              Upload your first circular, scholarship, or scheme document to generate a personalized action plan instantly.
            </p>
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 rounded-[999px] shadow-glass-card transition-spring")}>
              Upload Document
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
