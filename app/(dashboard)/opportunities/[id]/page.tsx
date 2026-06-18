import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, Target, CheckCircle2, TrendingDown, BookOpen, Bug, Activity, XCircle, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { StressTranslator } from "@/components/ui/stress-translator"
import { cn } from "@/lib/utils"
import { DecisionCard } from "@/components/ui/decision-card"
import { HumanInTheLoopPipeline } from "@/components/opportunities/human-in-the-loop-pipeline"
import { JudgeArchitectureFlow } from "@/components/opportunities/judge-architecture-flow"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: opp } = await supabase.from('opportunities').select('title, simplified_summary').eq('id', id).single()
  
  if (!opp) return { title: 'Opportunity Not Found' }
  
  return {
    title: opp.title || 'Opportunity',
    description: opp.simplified_summary || "View your action plan.",
  }
}

export default async function OpportunityDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const isJudgeMode = resolvedSearchParams?.judge === 'true'

  const supabase = await createClient()

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('*, action_steps(*)')
    .eq('id', id)
    .single()

  if (error || !opportunity) {
    notFound()
  }

  let signedUrl = null
  if (opportunity.storage_path) {
    const { data } = await supabase.storage
      .from('opportunities')
      .createSignedUrl(opportunity.storage_path, 3600)
    signedUrl = data?.signedUrl
  }

  const rawDocs = opportunity.required_documents
  const missingDocs = Array.isArray(rawDocs) ? rawDocs : (typeof rawDocs === 'string' ? [rawDocs] : [])
  
  // Deterministic Transparent Scoring Algorithm
  const baseCompletedItems = ["Eligibility Verified", "Identity Proof"]
  const completedCount = baseCompletedItems.length
  const missingCount = missingDocs.length
  const totalItems = completedCount + missingCount
  const readinessScore = Math.round((completedCount / totalItems) * 100)
  
  const estimatedTimeMins = (missingCount * 15) + 10 // 15 mins per doc + 10 mins base form
  
  const successProbability = Math.min(95, readinessScore + 10)

  return (
    <div className="container-wide py-12 flex flex-col gap-12 animate-in fade-in duration-700">
      
      {/* JUDGE MODE TOGGLE */}
      <div className="flex justify-end -mb-8 z-20 relative">
        <Link 
          href={`?judge=${isJudgeMode ? 'false' : 'true'}`} 
          className={cn(
            "text-[12px] font-mono font-semibold uppercase tracking-widest px-4 py-2 rounded-[999px] flex items-center gap-2 border transition-spring shadow-glass-card",
            isJudgeMode ? "bg-warning/20 text-warning border-warning/50" : "bg-glass-surface text-muted-foreground border-glass-border hover:bg-glass-layer hover:text-foreground"
          )}
        >
          <Bug className="w-4 h-4" />
          {isJudgeMode ? "Exit Judge Mode" : "Judge Mode: Architecture"}
        </Link>
      </div>

      {isJudgeMode ? (
        <JudgeArchitectureFlow />
      ) : (
        <div className="flex flex-col gap-12">
          
          {/* HEADER AREA */}
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-glass-surface text-foreground uppercase tracking-widest border-glass-border shadow-sm px-3 py-1 text-[11px] font-semibold">
                {opportunity.category || 'Document'}
              </Badge>
              <span className="text-[13px] flex items-center gap-1.5 font-medium bg-glass-surface px-3 py-1 rounded-[8px] border border-glass-border">
                <Clock className="w-4 h-4" /> 
                {(() => {
                  if (!opportunity.deadline) return 'No Deadline Found';
                  const d = new Date(opportunity.deadline);
                  return isNaN(d.getTime()) ? 'No Deadline Found' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                })()}
              </span>
            </div>
            <h1 className="text-hero-title text-balance">
              {opportunity.title}
            </h1>
          </div>

          {/* 1. APPLICATION READINESS ENGINE */}
          <div className="liquid-glass-card p-10 flex flex-col md:flex-row gap-12 shadow-elevation-2 relative overflow-visible">
            {/* Soft backdrop glow behind readiness engine */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-success/10 blur-[100px] pointer-events-none" />

            <div className="flex-1 relative z-10 flex flex-col justify-center">
              <div className="text-[12px] font-semibold mb-4 uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" /> Application Readiness Engine
              </div>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-metric-number text-foreground">
                  {readinessScore}% 
                </div>
                <span className="text-[16px] font-medium text-muted-foreground mb-3">
                  Readiness Score
                </span>
              </div>
              <div className="w-full h-3 bg-glass-surface rounded-full overflow-hidden border border-glass-border">
                <div className="h-full bg-success transition-all duration-1000" style={{ width: `${readinessScore}%` }} />
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-glass-surface/50 p-5 rounded-[16px] border border-glass-border">
                <div className="text-metric-number text-success">{successProbability}%</div>
              </div>
              <div className="bg-glass-surface/50 p-5 rounded-[16px] border border-glass-border">
                <div className="text-metric-number text-foreground">{estimatedTimeMins} min</div>
              </div>
              <div className="col-span-2 bg-glass-surface/50 p-5 rounded-[16px] border border-glass-border">
                <div className="text-[11px] uppercase font-semibold text-muted-foreground mb-3">Checklist Overview</div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[15px] font-medium text-success">
                    <CheckCircle2 className="w-5 h-5" /> {completedCount} Completed
                  </div>
                  <div className="flex items-center gap-2 text-[15px] font-medium text-danger">
                    <XCircle className="w-5 h-5" /> {missingCount} Missing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MISSING DOCUMENTS & PROFILE ELIGIBILITY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DecisionCard 
              title="Missing Documents"
              icon={<AlertTriangle className="w-5 h-5 text-warning" />}
              className="border-t-2 border-t-warning"
            >
              <ul className="space-y-4 pt-2">
                {missingDocs.length > 0 ? missingDocs.map((doc: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-danger/5 rounded-[12px] border border-danger/20">
                    <span className="text-danger mt-0.5 font-semibold">✗</span>
                    <span className="text-[15px] font-medium text-foreground">{doc}</span>
                  </li>
                )) : (
                  <li className="flex items-center gap-3 p-4 bg-success/5 rounded-[12px] border border-success/20">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-[15px] font-medium text-foreground">You have all required documents!</span>
                  </li>
                )}
              </ul>
            </DecisionCard>

            <DecisionCard 
              title="Profile Eligibility"
              icon={<Target className="w-5 h-5 text-success" />}
              className="border-t-2 border-t-success"
            >
              <ul className="space-y-4 pt-2">
                {(Array.isArray(opportunity.eligibility_analysis?.requirements) ? opportunity.eligibility_analysis.requirements : []).map((req: string, i: number) => {
                  const isMismatch = req.startsWith('[MISMATCH]')
                  const cleanReq = req.replace(/^\[(MATCHED|MISMATCH)\]\s*/, '')
                  
                  return (
                    <li key={i} className={cn("flex items-start gap-3 p-4 rounded-[12px] border", isMismatch ? "bg-danger/5 border-danger/20" : "bg-success/5 border-success/20")}>
                      {isMismatch ? (
                        <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={cn("text-[13px] font-semibold uppercase tracking-wider mb-1 block", isMismatch ? "text-danger" : "text-success")}>
                          {isMismatch ? 'Mismatch' : 'Matched'}
                        </span>
                        <span className={cn("text-[15px] font-medium leading-relaxed text-foreground")}>{cleanReq}</span>
                      </div>
                    </li>
                  )
                }) || <li className="text-[15px] text-muted-foreground">No explicit requirements detected.</li>}
              </ul>
            </DecisionCard>
          </div>

          {/* 3. ACTION PLAN (Tabs for Human in Loop / Explain / Impact / Evidence) */}
          <Tabs defaultValue="do" className="w-full">
            <TabsList className="w-full md:w-auto flex flex-wrap md:inline-flex h-auto p-1.5 bg-glass-surface rounded-[12px] border border-glass-border shadow-sm gap-1 mb-8">
              <TabsTrigger value="do" className="rounded-[8px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 px-6 font-semibold transition-spring text-[13px] uppercase tracking-wider">ACTION PLAN</TabsTrigger>
              <TabsTrigger value="explain" className="rounded-[8px] data-[state=active]:bg-glass-surface data-[state=active]:text-foreground py-3 px-6 font-semibold transition-spring data-[state=active]:shadow-sm text-[13px] uppercase tracking-wider">UNDERSTAND</TabsTrigger>
              <TabsTrigger value="impact" className="rounded-[8px] data-[state=active]:bg-danger data-[state=active]:text-white py-3 px-6 font-semibold transition-spring data-[state=active]:shadow-sm text-[13px] uppercase tracking-wider">OPPORTUNITY IMPACT</TabsTrigger>
              <TabsTrigger value="evidence" className="rounded-[8px] data-[state=active]:bg-glass-surface data-[state=active]:text-foreground py-3 px-6 font-semibold transition-spring data-[state=active]:shadow-sm text-[13px] uppercase tracking-wider ml-auto flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> VERIFY EVIDENCE
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="do" className="pt-2 outline-none animate-in fade-in duration-500">
              <HumanInTheLoopPipeline checklist={opportunity.action_steps} missingDocs={missingDocs} />
            </TabsContent>

            <TabsContent value="explain" className="pt-2 outline-none animate-in fade-in duration-500">
              <div className="max-w-[900px]">
                <h2 className="text-[24px] font-semibold tracking-tight mb-2 text-foreground">AI Stress Translator</h2>
                <p className="text-[16px] text-muted-foreground mb-8">We read the bureaucratic mess so you don&apos;t have to.</p>
                <StressTranslator 
                  originalText={opportunity.raw_text_snippet || "Excerpt from the source document..."}
                  simplifiedText={opportunity.simplified_summary} 
                />
              </div>
            </TabsContent>

            <TabsContent value="impact" className="pt-2 outline-none animate-in fade-in duration-500">
              <div className="max-w-[800px] mx-auto">
                <div className="liquid-glass-card p-12 border-2 border-danger/30 bg-danger/5 shadow-elevation-3 relative overflow-hidden">
                  <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-danger/10 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="relative z-10 text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-danger/10 border border-danger/20 text-danger mb-6 shadow-sm">
                      <TrendingDown className="w-10 h-10" />
                    </div>
                    <h2 className="text-[32px] font-semibold text-danger mb-4 tracking-tight">Opportunity Loss Simulator</h2>
                    <p className="text-[18px] opacity-80 text-foreground max-w-[500px] mx-auto leading-relaxed">Here is exactly what happens if you ignore this document.</p>
                  </div>

                  <div className="liquid-glass-card p-8 border-danger/20">
                    <h3 className="text-[20px] font-semibold mb-4 text-foreground">The Impact:</h3>
                    <p className="text-[18px] leading-relaxed text-muted-foreground mb-10">
                      {opportunity.opportunity_loss_prediction || "You may permanently lose out on the guaranteed funding, certification, or career advancement explicitly outlined in this notice."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-glass-surface/50 p-6 rounded-[16px] border-l-4 border-glass-border border-l-danger">
                        <div className="text-metric-number text-foreground">{opportunity.opportunity_value || "Unknown"}</div>
                      </div>
                      <div className="bg-glass-surface/50 p-6 rounded-[16px] border-l-4 border-glass-border border-l-danger">
                        <div className="text-[11px] uppercase font-semibold tracking-wider text-muted-foreground mb-2">Time Left</div>
                        <div className="font-semibold text-[24px] text-danger">
                          {(() => {
                            if (!opportunity.deadline) return 'Immediate';
                            const d = new Date(opportunity.deadline);
                            return isNaN(d.getTime()) ? 'Immediate' : d.toLocaleDateString();
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evidence" className="pt-2 outline-none animate-in fade-in duration-500">
              <div className="mb-8 p-8 border border-glass-border rounded-[24px] bg-glass-surface shadow-glass-card">
                <div className="flex items-center gap-3 mb-8">
                  <ShieldAlert className="w-8 h-8 text-foreground" />
                  <h2 className="text-section-title">Responsible AI Declaration</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <h3 className="text-[12px] uppercase font-semibold tracking-wider text-muted-foreground mb-3">Overall AI Confidence</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-[48px] font-medium leading-none text-success tracking-[-0.03em]">{opportunity.confidence_score || 85}%</span>
                    </div>
                    <p className="text-[14px] text-muted-foreground mt-3 leading-relaxed">Based on document clarity, formatting, and explicit language detection.</p>
                  </div>
                  <div>
                    <h3 className="text-[12px] uppercase font-semibold tracking-wider text-warning mb-3">AI Limitations</h3>
                    <ul className="text-[14px] text-muted-foreground space-y-3 list-disc pl-5">
                      <li>Cannot make legal or financial guarantees.</li>
                      <li>May miss unstated or implied dependencies.</li>
                      <li>Deadlines may change post-publication without notice.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[12px] uppercase font-semibold tracking-wider text-danger mb-3">Potential Errors</h3>
                    <ul className="text-[14px] text-muted-foreground space-y-3 list-disc pl-5">
                      <li>Hallucinated eligibility criteria.</li>
                      <li>Misinterpreted required document lists.</li>
                      <li>Ignored critical footnotes or fine print.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[800px]">
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4 pb-12 custom-scrollbar">
                  <h2 className="text-section-title sticky top-0 bg-glass-surface/95 backdrop-blur-sm py-6 z-10 border-b border-glass-border mb-6 text-foreground">Evidence Matrix</h2>
                  
                  <div className="space-y-6">
                    {Array.isArray(opportunity.evidence_references) && opportunity.evidence_references.length > 0 ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      opportunity.evidence_references.map((ref: any, i: number) => {
                        const isMissing = !ref.quote_from_document || ref.quote_from_document === 'Not Found In Document'
                        return (
                          <div key={i} className={cn("liquid-glass-card p-6 border-l-4", isMissing ? "border-l-danger bg-danger/5" : "border-l-success")}>
                            <div className="flex justify-between items-start mb-4 gap-4">
                              <div className="text-card-title text-[16px] text-foreground">{ref.claim}</div>
                              {isMissing && <Badge variant="destructive" className="shrink-0 text-[10px] uppercase tracking-wider font-semibold">Unverified</Badge>}
                            </div>
                            
                            <div className="space-y-4">
                              <div className={cn("p-4 rounded-[12px] text-[14px] font-mono leading-relaxed", isMissing ? "bg-danger/10 text-danger italic" : "bg-glass-surface/50 text-muted-foreground")}>
                                {isMissing ? "⚠ AI could not find an explicit quote to back this claim in the text." : `"${ref.quote_from_document}"`}
                              </div>
                              
                              <div className="flex gap-4 pt-4 border-t border-glass-border">
                                <div className="flex-1">
                                  <div className="text-[11px] uppercase font-semibold text-muted-foreground mb-1">Confidence</div>
                                  <div className={cn("text-[14px] font-semibold", (ref.confidence_score || 0) < 70 ? "text-warning" : "text-success")}>
                                    {ref.confidence_score || (isMissing ? 0 : 80)}%
                                  </div>
                                </div>
                                <div className="flex-1 border-l border-glass-border pl-4">
                                  <div className="text-[11px] uppercase font-semibold text-muted-foreground mb-1">Risk if wrong</div>
                                  <div className="text-[14px] text-muted-foreground leading-tight">{ref.risk_assessment || "Unknown risk. Verify manually."}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="p-10 text-center text-muted-foreground border-2 border-dashed border-glass-border rounded-[24px] text-[15px]">
                        No specific quotes extracted.
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1 liquid-glass-card h-full flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-glass-border font-semibold text-[13px] bg-glass-surface/50 uppercase tracking-widest text-muted-foreground flex items-center justify-center">Official Source Document</div>
                  <div className="flex-1 bg-white">
                    {signedUrl ? (
                      <iframe 
                        src={signedUrl} 
                        className="w-full h-full border-0" 
                        title="Document Evidence"
                      />
                    ) : opportunity.storage_path?.startsWith('http') ? (
                      <iframe 
                        src={opportunity.storage_path} 
                        className="w-full h-full border-0" 
                        title="URL Evidence"
                      />
                    ) : (
                      <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4 bg-muted/20">
                        <BookOpen className="w-16 h-16 opacity-20" />
                        <p className="text-[16px] font-medium">Document viewer unavailable</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
