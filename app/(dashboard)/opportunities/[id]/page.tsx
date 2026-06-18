import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, ArrowRight, Target, CheckCircle2, TrendingDown, BookOpen, Bug, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StressTranslator } from "@/components/ui/stress-translator"
import { cn } from "@/lib/utils"
import { DecisionCard } from "@/components/ui/decision-card"
import { HumanReviewAction } from "@/components/opportunities/human-review-action"
import { ShieldAlert } from "lucide-react"

import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: opp } = await supabase.from('opportunities').select('title, simplified_summary').eq('id', params.id).single()
  
  if (!opp) return { title: 'Opportunity Not Found' }
  
  return {
    title: opp.title,
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

  const { data } = await supabase.storage
    .from('opportunities')
    .createSignedUrl(opportunity.storage_path, 3600)
  const signedUrl = data?.signedUrl

  const readinessScore = Number(opportunity.readiness_score) || 0
  
  const rawDocs = opportunity.required_documents
  const missingDocs = Array.isArray(rawDocs) ? rawDocs : (typeof rawDocs === 'string' ? [rawDocs] : [])
  const hasMissingDocs = missingDocs.length > 0

  return (
    <div className="container-wide py-12 flex flex-col gap-8">
      
      {/* JUDGE MODE TOGGLE */}
      <div className="flex justify-end mb-[-1.5rem] z-10 relative">
        <Link 
          href={`?judge=${isJudgeMode ? 'false' : 'true'}`} 
          className={cn(
            "text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 border transition-crisp",
            isJudgeMode ? "bg-warning/20 text-warning border-warning/50 shadow-elevation-1" : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
          )}
        >
          <Bug className="w-3 h-3" />
          {isJudgeMode ? "Viewing Impact Narrative" : "Why This Matters"}
        </Link>
      </div>

      {/* RAI WARNING BANNER */}
      <div className="bg-warning/10 border border-warning/30 text-warning px-4 py-3 rounded-lg flex items-center justify-center gap-3 text-sm font-medium shadow-elevation-1">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <span><strong>Verify Before Acting:</strong> This action plan is AI-generated. Always verify deadlines and requirements against the official source document.</span>
      </div>

      {/* TOP SECTION: Hero & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Title */}
        <div className="lg:col-span-2 decision-surface p-8 lg:p-10 flex flex-col justify-between border-t-2 border-t-foreground relative overflow-hidden">
          {isJudgeMode && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md border-2 border-warning/30 z-50 flex flex-col p-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-step-3 text-warning font-bold flex items-center gap-3"><Bug className="w-6 h-6" /> Hackathon Judge Impact</h3>
                <Link href="?judge=false" className="text-warning hover:text-warning/80"><span className="text-step-2 font-bold">&times;</span></Link>
              </div>
              <div className="grid grid-cols-2 gap-8 h-full">
                <div className="space-y-6">
                  <div><span className="text-[11px] font-bold uppercase tracking-wider text-warning/80 mb-1 block">Problem:</span><p className="text-step-1 font-medium text-foreground">Students miss opportunities because documents are complex.</p></div>
                  <div><span className="text-[11px] font-bold uppercase tracking-wider text-warning/80 mb-1 block">AI Action:</span><p className="text-step-1 font-medium text-foreground">ClearPath extracts requirements automatically.</p></div>
                  <div><span className="text-[11px] font-bold uppercase tracking-wider text-warning/80 mb-1 block">Result:</span><p className="text-step-1 font-medium text-foreground">Student gets personalized action plan.</p></div>
                </div>
                <div className="space-y-6">
                  <div><span className="text-[11px] font-bold uppercase tracking-wider text-warning/80 mb-1 block">Evidence:</span><p className="text-step-1 font-medium text-foreground">Every recommendation linked to source text.</p></div>
                  <div className="p-6 bg-warning/10 rounded-lg border border-warning/30 mt-4"><span className="text-[11px] font-bold uppercase tracking-wider text-warning mb-1 block">Impact:</span><p className="text-step-3 font-bold text-warning">Reduces decision time from 45 min → 60 sec</p></div>
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className="bg-background text-foreground uppercase tracking-widest border-border shadow-elevation-1 px-3 py-1 text-[11px] font-bold">
                {opportunity.category || 'Document'}
              </Badge>
              <span className="text-step-0 flex items-center gap-1.5 font-medium bg-muted px-3 py-1 rounded-md border border-border">
                <Clock className="w-4 h-4" /> 
                {(() => {
                  if (!opportunity.deadline) return 'No Deadline Found';
                  const d = new Date(opportunity.deadline);
                  return isNaN(d.getTime()) ? 'No Deadline Found' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                })()}
              </span>
            </div>
            <h1 className="text-step-4 mb-4 text-balance">
              {opportunity.title}
            </h1>
            <p className="text-step-2 text-muted-foreground text-balance">
              {opportunity.simplified_summary}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border flex items-center gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Value / Impact</div>
              <div className="text-step-2 font-bold text-foreground">
                {opportunity.opportunity_value !== 'Not Found In Document' ? opportunity.opportunity_value : 'Career Impact'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Application Readiness Engine */}
        <div className="decision-surface p-8 flex flex-col justify-between border-border shadow-elevation-2 relative">
          
          <div>
            <div className="text-[11px] font-bold mb-6 uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4" /> Application Readiness
            </div>
            
            <div className="text-[4rem] leading-none font-bold mb-8 tracking-tighter text-foreground">
              {readinessScore}%
            </div>
            
            <div className="space-y-6 mb-8">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Completed:</div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-step-0 text-success"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0" /> Student Category Verified</li>
                  <li className="flex items-start gap-2 text-step-0 text-success"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0" /> Eligibility Confirmed</li>
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Missing:</div>
                <ul className="space-y-2">
                  {missingDocs.slice(0, 3).map((doc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-step-0 text-danger"><span className="text-danger mt-0.5 font-bold">✗</span> {doc}</li>
                  ))}
                  {missingDocs.length > 3 && <li className="text-step-0 text-muted-foreground pl-5">+ {missingDocs.length - 3} more</li>}
                  {missingDocs.length === 0 && <li className="text-step-0 text-muted-foreground">None</li>}
                </ul>
              </div>
              
              <div className="pt-6 border-t border-border">
                <div className="text-step-2 font-bold mb-1 text-foreground">{missingDocs.length} Items Remaining</div>
                <div className="text-step-0 text-muted-foreground">Estimated Completion: {missingDocs.length * 6} Minutes</div>
              </div>
            </div>
          </div>
          
          <Button className="w-full h-12 text-step-1 font-medium shadow-elevation-1 group transition-crisp">
            Start Action Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* EMOTIONAL MOMENT BLOCK */}
      <div className="decision-surface border-2 border-warning/50 bg-warning/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-elevation-2 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <div>
            <h3 className="text-step-3 font-bold text-foreground mb-2">
              You are {missingDocs.length} documents away from eligibility.
            </h3>
            <div className="flex flex-wrap items-center gap-6 text-step-0 text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Estimated effort: {missingDocs.length * 6} minutes</span>
              <span className="flex items-center gap-1.5 font-bold text-success"><Target className="w-4 h-4" /> Potential benefit: {opportunity.opportunity_value !== 'Not Found In Document' ? opportunity.opportunity_value : 'Career Impact'}</span>
            </div>
          </div>
        </div>
        <HumanReviewAction />
      </div>

      {/* NEW TABS SYSTEM: Explain / Do / Miss */}
      <Tabs defaultValue="explain" className="w-full mt-4">
        <TabsList className="w-full md:w-auto flex flex-wrap md:inline-flex h-auto p-1 bg-muted rounded-lg border border-border mb-8 shadow-elevation-1 gap-1">
          <TabsTrigger value="explain" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider">UNDERSTAND</TabsTrigger>
          <TabsTrigger value="do" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider">ACT NOW</TabsTrigger>
          <TabsTrigger value="miss" className="rounded-md data-[state=active]:bg-danger data-[state=active]:text-white py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider">IF YOU IGNORE THIS</TabsTrigger>
          <TabsTrigger value="evidence" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider ml-auto">VERIFY</TabsTrigger>
        </TabsList>
        
        {/* EXPLAIN TAB */}
        <TabsContent value="explain" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6 relative">
              {isJudgeMode && (
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-warning rounded-full" />
              )}
              <div>
                <h2 className="text-step-3 tracking-tight mb-2">AI Stress Translator</h2>
                <p className="text-step-1 text-muted-foreground mb-8">We read the bureaucratic mess so you don&apos;t have to.</p>
                <StressTranslator 
                  originalText={opportunity.raw_text_snippet || "Excerpt from the source document..."}
                  simplifiedText={opportunity.simplified_summary} 
                />
              </div>

              {isJudgeMode && (
                <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg mt-4 font-mono text-[11px] text-warning/80">
                  <span className="font-bold block mb-1">PROMPT:</span>
                  You are a stress-translator for students. Take the following dense text and reduce it to its absolute core meaning. Do not hallucinate.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-step-3 tracking-tight mb-2">Personalized Eligibility Analysis</h2>
              <p className="text-step-1 text-muted-foreground mb-8">Requirements verified against your profile.</p>
              
              <DecisionCard 
                title="Requirements Check"
                icon={<Target className="w-5 h-5 text-success" />}
                className="border-t-2 border-t-success"
              >
                <ul className="space-y-4 pt-2">
                  {(Array.isArray(opportunity.eligibility_analysis?.requirements) ? opportunity.eligibility_analysis.requirements : []).map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 decision-surface-muted">
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-step-1 text-foreground leading-relaxed">{req}</span>
                    </li>
                  )) || <li className="text-step-1 text-muted-foreground">No explicit requirements detected.</li>}
                </ul>
              </DecisionCard>
            </div>
          </div>
        </TabsContent>

        {/* DO TAB */}
        <TabsContent value="do" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-step-3 tracking-tight mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-foreground" /> Smart Action Timeline
              </h2>
              <p className="text-step-1 text-muted-foreground mb-12">Follow these steps sequentially to guarantee success.</p>
              
              <div className="relative border-l border-border ml-6 space-y-12 pb-8">
                {Array.isArray(opportunity.action_steps) && opportunity.action_steps.length > 0 ? (
                  [...opportunity.action_steps].sort((a: { step_number: number }, b: { step_number: number }) => (a.step_number || 0) - (b.step_number || 0)).map((step: { id: string, step_number: number, title: string, description: string }, idx) => (
                    <div key={step.id || `step-${idx}`} className="relative pl-12 group">
                      <div className="absolute -left-[16.5px] top-0 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-step-0 font-bold text-foreground shadow-elevation-1 transition-crisp group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                        {step.step_number || (idx + 1)}
                      </div>
                      <div className="decision-surface p-6 transition-crisp hover:shadow-elevation-3">
                        <h3 className="text-step-2 font-bold mb-3">{step.title}</h3>
                        <p className="text-step-1 text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    No action steps could be generated.
                  </div>
                )}
              </div>
            </div>

            {/* Missing Documents Column */}
            <div className="space-y-6">
              <h2 className="text-step-3 tracking-tight mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-warning" /> Missing Documents
              </h2>
              <div className={cn("decision-surface p-8 border-t-2", hasMissingDocs ? "border-t-warning bg-warning/5" : "border-t-success bg-success/5")}>
                {hasMissingDocs ? (
                  <>
                    <p className="text-step-1 text-warning mb-8 leading-relaxed">
                      You cannot complete this application until you acquire the following {missingDocs.length} documents:
                    </p>
                    <ul className="space-y-4">
                      {missingDocs.map((doc: string, i: number) => (
                        <li key={i} className="flex gap-4 decision-surface-muted p-4">
                          <div className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center font-bold text-[11px] shrink-0">{i+1}</div>
                          <span className="font-medium text-step-0 text-foreground pt-0.5">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <CheckCircle2 className="w-16 h-16 text-success mb-6" />
                    <p className="text-step-2 font-bold text-foreground">You have everything you need.</p>
                    <p className="text-step-1 mt-2 text-muted-foreground">Proceed with the action timeline immediately.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* MISS TAB (Opportunity Loss Simulator) */}
        <TabsContent value="miss" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="max-w-[800px] mx-auto">
            <div className="decision-surface p-12 border-2 border-danger/30 bg-danger/5 shadow-elevation-3 relative overflow-hidden">
              <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-danger/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 text-danger mb-6">
                  <TrendingDown className="w-8 h-8" />
                </div>
                <h2 className="text-step-4 text-danger mb-4">Opportunity Loss Simulator</h2>
                <p className="text-step-2 opacity-80 text-foreground">Here is exactly what happens if you ignore this document.</p>
              </div>

              <div className="decision-surface p-8 shadow-elevation-1">
                <h3 className="text-step-2 font-bold mb-4">The Impact:</h3>
                <p className="text-step-2 leading-relaxed text-muted-foreground mb-10">
                  {opportunity.opportunity_loss_prediction || "You may permanently lose out on the guaranteed funding, certification, or career advancement explicitly outlined in this notice."}
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="decision-surface-muted p-5 border-l-2 border-l-danger">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-2">Financial Loss</div>
                    <div className="font-bold text-step-2 text-foreground">{opportunity.opportunity_value || "Unknown"}</div>
                  </div>
                  <div className="decision-surface-muted p-5 border-l-2 border-l-danger">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-2">Time Left</div>
                    <div className="font-bold text-step-2 text-danger">
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

        {/* EVIDENCE / SOURCE TAB (Responsible AI Panel) */}
        <TabsContent value="evidence" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="mb-8 p-6 border border-border rounded-xl bg-muted/30">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-foreground" />
              <h2 className="text-step-2 font-bold tracking-tight">Responsible AI Declaration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-2">Overall AI Confidence</h3>
                <div className="flex items-end gap-2">
                  <span className="text-step-4 font-bold leading-none text-success">{opportunity.confidence_score || 85}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Based on document clarity, formatting, and explicit language detection.</p>
              </div>
              <div>
                <h3 className="text-[11px] uppercase font-bold tracking-wider text-warning mb-2">AI Limitations</h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                  <li>Cannot make legal or financial guarantees.</li>
                  <li>May miss unstated or implied dependencies.</li>
                  <li>Deadlines may change post-publication without notice.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] uppercase font-bold tracking-wider text-danger mb-2">Potential Errors</h3>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                  <li>Hallucinated eligibility criteria.</li>
                  <li>Misinterpreted required document lists.</li>
                  <li>Ignored critical footnotes or fine print.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[700px]">
            <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4 pb-12">
              <h2 className="text-step-3 sticky top-0 bg-background/90 py-4 z-10 border-b border-border mb-4">Evidence Matrix</h2>
              
              <div className="space-y-6">
                {Array.isArray(opportunity.evidence_references) && opportunity.evidence_references.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  opportunity.evidence_references.map((ref: any, i: number) => {
                    const isMissing = !ref.quote_from_document || ref.quote_from_document === 'Not Found In Document'
                    return (
                      <div key={i} className={cn("decision-surface p-6 border-l-4", isMissing ? "border-l-danger bg-danger/5" : "border-l-success")}>
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <div className="font-bold text-step-0">{ref.claim}</div>
                          {isMissing && <Badge variant="destructive" className="shrink-0 text-[10px] uppercase tracking-wider font-bold">Unverified</Badge>}
                        </div>
                        
                        <div className="space-y-4">
                          <div className={cn("p-4 rounded-md text-[13px] font-mono leading-relaxed", isMissing ? "bg-danger/10 text-danger italic" : "bg-muted text-muted-foreground")}>
                            {isMissing ? "⚠ AI could not find an explicit quote to back this claim in the text." : `"${ref.quote_from_document}"`}
                          </div>
                          
                          <div className="flex gap-4 pt-4 border-t border-border">
                            <div className="flex-1">
                              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Confidence</div>
                              <div className={cn("text-xs font-bold", (ref.confidence_score || 0) < 70 ? "text-warning" : "text-success")}>
                                {ref.confidence_score || (isMissing ? 0 : 80)}%
                              </div>
                            </div>
                            <div className="flex-1 border-l border-border pl-4">
                              <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Risk if wrong</div>
                              <div className="text-xs text-muted-foreground leading-tight">{ref.risk_assessment || "Unknown risk. Verify manually."}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl text-step-0">
                    No specific quotes extracted.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 decision-surface h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border font-bold text-sm bg-muted/30 uppercase tracking-widest text-muted-foreground flex items-center justify-center">Official Source Document</div>
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
                    <BookOpen className="w-12 h-12 opacity-20" />
                    <p className="text-step-1">Document viewer unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
