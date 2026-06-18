import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, ArrowRight, Target, CheckCircle2, TrendingDown, BookOpen, Bug, Sparkles, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReadinessRing } from "@/components/ui/readiness-ring"
import { StressTranslator } from "@/components/ui/stress-translator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 md:p-8 font-sans">
      
      {/* JUDGE MODE TOGGLE */}
      <div className="flex justify-end mb-[-1rem] z-10 relative">
        <Link 
          href={`?judge=${isJudgeMode ? 'false' : 'true'}`} 
          className={cn(
            "text-xs font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 border transition-all",
            isJudgeMode ? "bg-amber-500/20 text-amber-500 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
          )}
        >
          <Bug className="w-3 h-3" />
          {isJudgeMode ? "Judge Mode Active" : "Enable Judge Mode"}
        </Link>
      </div>

      {/* TOP SECTION: Hero & Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Title */}
        <div className="lg:col-span-2 glass-regular rounded-apple-xl p-8 flex flex-col justify-between border-t-4 border-t-primary relative overflow-hidden">
          {isJudgeMode && (
            <div className="absolute inset-0 bg-amber-500/[0.02] border-2 border-amber-500/20 rounded-apple-xl pointer-events-none z-50 flex items-end justify-end p-2">
               <span className="text-[10px] text-amber-500 font-mono">DB: opportunities table | ID: {opportunity.id.split('-')[0]}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="bg-background text-foreground uppercase tracking-widest border-apple-glass-border shadow-sm px-3 py-1 text-xs font-bold">
                {opportunity.category || 'Document'}
              </Badge>
              <span className="text-metadata flex items-center gap-1.5 font-medium bg-background/50 px-2 py-1 rounded-md border border-apple-glass-border">
                <Clock className="w-4 h-4" /> 
                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline Found'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 text-balance">
              {opportunity.title}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              {opportunity.simplified_summary}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-apple-glass-border flex items-center gap-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Value / Impact</div>
              <div className="text-xl font-bold text-foreground">
                {opportunity.opportunity_value !== 'Not Found In Document' ? opportunity.opportunity_value : 'Career Impact'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Application Readiness Engine */}
        <div className="glass-thick rounded-apple-xl p-8 border border-apple-glass-highlight shadow-apple-lg flex flex-col justify-between relative overflow-hidden">
          {isJudgeMode && (
             <div className="absolute inset-0 bg-amber-500/[0.02] border-2 border-amber-500/20 rounded-apple-xl pointer-events-none z-50 flex items-start justify-end p-2">
                <span className="text-[10px] text-amber-500 font-mono">Derived Metric</span>
             </div>
          )}
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="text-sm font-bold mb-6 opacity-80 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Readiness Engine
            </div>
            
            <div className="flex justify-center mb-8 relative z-10">
              <ReadinessRing score={readinessScore} size={160} strokeWidth={14} />
            </div>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div className="glass-thin rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Probability</span>
                <span className="text-sm font-bold text-primary">{completionProbability}%</span>
              </div>
              <div className="glass-thin rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Missing Docs</span>
                <span className={cn("text-sm font-bold", hasMissingDocs ? "text-amber-500" : "text-emerald-500")}>
                  {missingDocs.length} Detected
                </span>
              </div>
            </div>
          </div>
          
          <Button className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90 shadow-apple-md group spring-active relative z-10">
            Start Action Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* NEW TABS SYSTEM: Explain / Do / Miss */}
      <Tabs defaultValue="explain" className="w-full mt-4">
        <TabsList className="w-full md:w-auto flex flex-wrap md:inline-flex h-auto p-1.5 glass-regular rounded-apple-lg border border-apple-glass-border mb-8 shadow-apple-sm gap-1 relative z-10">
          <TabsTrigger value="explain" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-3 px-8 font-bold transition-all spring-transition data-[state=active]:shadow-sm text-sm uppercase tracking-wider">Explain</TabsTrigger>
          <TabsTrigger value="do" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-3 px-8 font-bold transition-all spring-transition data-[state=active]:shadow-sm text-sm uppercase tracking-wider">Do</TabsTrigger>
          <TabsTrigger value="miss" className="rounded-apple-md data-[state=active]:bg-rose-500 data-[state=active]:text-white py-3 px-8 font-bold transition-all spring-transition data-[state=active]:shadow-md text-sm uppercase tracking-wider">Miss</TabsTrigger>
          <TabsTrigger value="evidence" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-3 px-8 font-bold transition-all spring-transition data-[state=active]:shadow-sm text-sm uppercase tracking-wider ml-auto">Source</TabsTrigger>
        </TabsList>
        
        {/* EXPLAIN TAB */}
        <TabsContent value="explain" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8 relative">
              {isJudgeMode && (
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-500 rounded-full" />
              )}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">AI Stress Translator</h2>
                <p className="text-muted-foreground mb-6">We read the bureaucratic mess so you don&apos;t have to.</p>
                <StressTranslator 
                  originalText={opportunity.raw_text_snippet || "Excerpt from the source document..."}
                  simplifiedText={opportunity.simplified_summary} 
                />
              </div>

              {isJudgeMode && (
                <div className="glass-thin bg-amber-500/5 border border-amber-500/20 p-4 rounded-apple-md mt-4 font-mono text-xs text-amber-600/80">
                  <span className="font-bold block mb-1">PROMPT:</span>
                  You are a stress-translator for students. Take the following dense text and reduce it to its absolute core meaning. Do not hallucinate.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Personalized Eligibility Analysis</h2>
              <div className="glass-regular rounded-apple-xl p-8 border border-apple-glass-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Requirements Check</h3>
                </div>
                <ul className="space-y-4">
                  {opportunity.eligibility_analysis?.requirements?.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 glass-thin rounded-md">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground/90 leading-relaxed">{req}</span>
                    </li>
                  )) || <li className="text-muted-foreground">No explicit requirements detected.</li>}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* DO TAB */}
        <TabsContent value="do" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" /> Smart Action Timeline
              </h2>
              <p className="text-muted-foreground mb-8">Follow these steps sequentially to guarantee success.</p>
              
              <div className="relative border-l-2 border-primary/20 ml-6 space-y-10 pb-8">
                {opportunity.action_steps && opportunity.action_steps.length > 0 ? (
                  opportunity.action_steps.sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number).map((step: { id: string, step_number: number, title: string, description: string }) => (
                    <div key={step.id} className="relative pl-10 group">
                      <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-background border-[3px] border-primary flex items-center justify-center text-sm font-bold text-primary shadow-apple-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all spring-transition">
                        {step.step_number}
                      </div>
                      <div className="glass-thin rounded-apple-lg p-6 hover:glass-regular transition-all spring-transition border border-apple-glass-border">
                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed font-medium">{step.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground border border-dashed border-apple-glass-border rounded-apple-xl">
                    No action steps could be generated.
                  </div>
                )}
              </div>
            </div>

            {/* Missing Documents Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" /> Missing Documents
              </h2>
              <div className={cn("glass-thick rounded-apple-xl p-8 border", hasMissingDocs ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5")}>
                {hasMissingDocs ? (
                  <>
                    <p className="font-medium text-amber-700 dark:text-amber-300 mb-6 leading-relaxed">
                      You cannot complete this application until you acquire the following {missingDocs.length} documents:
                    </p>
                    <ul className="space-y-3">
                      {missingDocs.map((doc: string, i: number) => (
                        <li key={i} className="flex gap-3 bg-background/50 p-3 rounded-md border border-amber-500/10">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
                          <span className="font-medium text-sm pt-0.5">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">You have everything you need.</p>
                    <p className="text-sm mt-2 opacity-80">Proceed with the action timeline immediately.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* MISS TAB (Opportunity Loss Simulator) */}
        <TabsContent value="miss" className="pt-4 outline-none animate-in fade-in duration-500">
          <div className="max-w-3xl mx-auto">
            <div className="glass-thick rounded-apple-xl p-10 border-2 border-rose-500/30 bg-rose-500/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 mb-6 animate-pulse">
                  <TrendingDown className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-rose-600 dark:text-rose-400 mb-4">Opportunity Loss Simulator</h2>
                <p className="text-lg font-medium opacity-80">Here is exactly what happens if you ignore this document.</p>
              </div>

              <div className="bg-background/80 backdrop-blur-md rounded-apple-lg p-8 border border-rose-500/20 shadow-inner">
                <h3 className="text-2xl font-bold mb-4">The Impact:</h3>
                <p className="text-xl leading-relaxed font-medium mb-8">
                  {opportunity.opportunity_loss_prediction || "You may permanently lose out on the guaranteed funding, certification, or career advancement explicitly outlined in this notice."}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-thin p-4 rounded-md border-l-4 border-l-rose-500">
                    <div className="text-xs uppercase font-bold tracking-wider opacity-70 mb-1">Financial Loss</div>
                    <div className="font-bold text-lg">{opportunity.opportunity_value || "Unknown"}</div>
                  </div>
                  <div className="glass-thin p-4 rounded-md border-l-4 border-l-rose-500">
                    <div className="text-xs uppercase font-bold tracking-wider opacity-70 mb-1">Time Left</div>
                    <div className="font-bold text-lg text-rose-500">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
            <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
              <h2 className="text-2xl font-bold tracking-tight sticky top-0 bg-background/90 py-2 z-10">Evidence & Trust Layer</h2>
              <p className="text-sm text-muted-foreground mb-6">Every AI claim is strictly backed by the document.</p>
              
              {opportunity.evidence_references && opportunity.evidence_references.length > 0 ? (
                opportunity.evidence_references.map((ref: { claim: string, quote_from_document: string }, i: number) => (
                  <div key={i} className="glass-thin rounded-apple-lg p-5 relative group border border-apple-glass-border">
                    <div className="font-bold text-sm mb-2">{ref.claim}</div>
                    <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                      <p className="text-xs font-mono text-muted-foreground leading-relaxed italic">
                        &quot;{ref.quote_from_document}&quot;
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-apple-lg text-sm">
                  No specific quotes extracted.
                </div>
              )}
            </div>

            <div className="lg:col-span-2 glass-thick rounded-apple-xl h-full overflow-hidden border border-apple-glass-border shadow-apple-lg relative">
              {signedUrl ? (
                <iframe 
                  src={signedUrl} 
                  className="w-full h-full border-0 absolute inset-0 bg-white" 
                  title="Document Evidence"
                />
              ) : opportunity.storage_path?.startsWith('http') ? (
                <iframe 
                  src={opportunity.storage_path} 
                  className="w-full h-full border-0 absolute inset-0 bg-white" 
                  title="URL Evidence"
                />
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                  <BookOpen className="w-12 h-12 opacity-20" />
                  <p className="font-medium">Document viewer unavailable</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
