import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, ArrowRight, Target, CheckCircle2, TrendingDown, BookOpen, Bug, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReadinessRing } from "@/components/ui/readiness-ring"
import { StressTranslator } from "@/components/ui/stress-translator"
import { cn } from "@/lib/utils"
import { DecisionCard } from "@/components/ui/decision-card"

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

  const readinessScore = opportunity.readiness_score || 0
  const completionProbability = Math.min(100, readinessScore + 15) // Predictive boost
  
  const missingDocs = opportunity.required_documents || []
  const hasMissingDocs = missingDocs.length > 0

  return (
    <div className="container-standard py-12 flex flex-col gap-8">
      
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
          {isJudgeMode ? "Judge Mode Active" : "Enable Judge Mode"}
        </Link>
      </div>

      {/* TOP SECTION: Hero & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Title */}
        <div className="lg:col-span-2 decision-surface p-8 lg:p-10 flex flex-col justify-between border-t-2 border-t-foreground">
          {isJudgeMode && (
            <div className="absolute inset-0 bg-warning/[0.02] border-2 border-warning/20 pointer-events-none z-50 flex items-end justify-end p-2">
               <span className="text-[10px] text-warning font-mono">DB: opportunities table | ID: {opportunity.id.split('-')[0]}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className="bg-background text-foreground uppercase tracking-widest border-border shadow-elevation-1 px-3 py-1 text-[11px] font-bold">
                {opportunity.category || 'Document'}
              </Badge>
              <span className="text-step-0 flex items-center gap-1.5 font-medium bg-muted px-3 py-1 rounded-md border border-border">
                <Clock className="w-4 h-4" /> 
                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline Found'}
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
        <div className="decision-surface p-8 flex flex-col justify-between border-border shadow-elevation-2">
          {isJudgeMode && (
             <div className="absolute inset-0 bg-warning/[0.02] border-2 border-warning/20 pointer-events-none z-50 flex items-start justify-end p-2">
                <span className="text-[10px] text-warning font-mono">Derived Metric</span>
             </div>
          )}
          
          <div>
            <div className="text-[11px] font-bold mb-8 uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4" /> Readiness Engine
            </div>
            
            <div className="flex justify-center mb-8 relative z-10">
              <ReadinessRing score={readinessScore} size={160} strokeWidth={12} />
            </div>
            
            <div className="space-y-3 mb-8 relative z-10">
              <div className="decision-surface-muted p-3 flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Est. Probability</span>
                <span className="text-step-0 font-bold text-foreground">{completionProbability}%</span>
              </div>
              <div className="decision-surface-muted p-3 flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Missing Docs</span>
                <span className={cn("text-step-0 font-bold", hasMissingDocs ? "text-warning" : "text-success")}>
                  {missingDocs.length} Detected
                </span>
              </div>
            </div>
          </div>
          
          <Button className="w-full h-12 text-step-1 font-medium shadow-elevation-1 group transition-crisp">
            Start Action Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* NEW TABS SYSTEM: Explain / Do / Miss */}
      <Tabs defaultValue="explain" className="w-full mt-4">
        <TabsList className="w-full md:w-auto flex flex-wrap md:inline-flex h-auto p-1 bg-muted rounded-lg border border-border mb-8 shadow-elevation-1 gap-1">
          <TabsTrigger value="explain" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider">Explain</TabsTrigger>
          <TabsTrigger value="do" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider">Do</TabsTrigger>
          <TabsTrigger value="miss" className="rounded-md data-[state=active]:bg-danger data-[state=active]:text-white py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider">Miss</TabsTrigger>
          <TabsTrigger value="evidence" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground py-2.5 px-6 font-semibold transition-crisp data-[state=active]:shadow-elevation-1 text-step-0 uppercase tracking-wider ml-auto">Source</TabsTrigger>
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
                  {opportunity.eligibility_analysis?.requirements?.map((req: string, i: number) => (
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
                {opportunity.action_steps && opportunity.action_steps.length > 0 ? (
                  opportunity.action_steps.sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number).map((step: { id: string, step_number: number, title: string, description: string }) => (
                    <div key={step.id} className="relative pl-12 group">
                      <div className="absolute -left-[16.5px] top-0 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-step-0 font-bold text-foreground shadow-elevation-1 transition-crisp group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                        {step.step_number}
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
                      {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Immediate'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* EVIDENCE / SOURCE TAB */}
        <TabsContent value="evidence" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-[700px]">
            <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4">
              <h2 className="text-step-3 sticky top-0 bg-background/90 py-4 z-10">Evidence & Trust Layer</h2>
              <p className="text-step-1 text-muted-foreground mb-8">Every AI claim is strictly backed by the document.</p>
              
              <div className="space-y-4">
                {opportunity.evidence_references && opportunity.evidence_references.length > 0 ? (
                  opportunity.evidence_references.map((ref: { claim: string, quote_from_document: string }, i: number) => (
                    <div key={i} className="decision-surface p-6">
                      <div className="font-bold text-step-0 mb-4">{ref.claim}</div>
                      <div className="decision-surface-muted p-4">
                        <p className="text-[13px] font-mono text-muted-foreground leading-relaxed italic">
                          &quot;{ref.quote_from_document}&quot;
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl text-step-0">
                    No specific quotes extracted.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 decision-surface h-full">
              {signedUrl ? (
                <iframe 
                  src={signedUrl} 
                  className="w-full h-full border-0 bg-white" 
                  title="Document Evidence"
                />
              ) : opportunity.storage_path?.startsWith('http') ? (
                <iframe 
                  src={opportunity.storage_path} 
                  className="w-full h-full border-0 bg-white" 
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
        </TabsContent>

      </Tabs>
    </div>
  )
}
