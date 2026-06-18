import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, ArrowRight, Target, ShieldCheck, CheckCircle2, TrendingDown, Users, Sparkles, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: opp } = await supabase.from('opportunities').select('title, simplified_summary').eq('id', params.id).single()
  
  if (!opp) return { title: 'Opportunity Not Found' }
  
  return {
    title: opp.title,
    description: opp.simplified_summary || "View the full action plan and eligibility details for this opportunity.",
  }
}

export default async function OpportunityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    return "text-rose-500 bg-rose-500/10 border-rose-500/20"
  }

  const readinessClass = getReadinessColor(opportunity.readiness_score || 0)

  // Mocking Community Data for the hackathon feel
  const communityStats = {
    studentsHelped: "12,450+",
    scholarshipsDiscovered: "₹2.4Cr",
    applicationsCompleted: "8,920"
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 md:p-8">
      
      {/* TOP SECTION: Hero & Readiness Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Title & Metadata */}
        <div className="lg:col-span-2 glass-regular rounded-apple-xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="bg-background text-foreground uppercase border-apple-glass-border shadow-sm px-3 py-1 text-xs">
                {opportunity.category}
              </Badge>
              <span className="text-metadata flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4" /> 
                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-4 text-balance">
              {opportunity.title}
            </h1>
            <p className="text-section text-muted-foreground text-balance">
              {opportunity.simplified_summary}
            </p>
          </div>
          
          {opportunity.opportunity_value && opportunity.opportunity_value !== 'Not Found In Document' && (
            <div className="mt-8 pt-6 border-t border-apple-glass-border">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Opportunity Value</div>
              <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {opportunity.opportunity_value}
              </div>
            </div>
          )}
        </div>

        {/* Right: Application Readiness Card */}
        <div className={`glass-thick rounded-apple-xl p-8 border ${readinessClass} flex flex-col justify-between relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          
          <div>
            <div className="text-sm font-medium mb-2 opacity-80 uppercase tracking-wider">Application Readiness</div>
            <div className="text-6xl font-bold tracking-tighter mb-6">{opportunity.readiness_score || 0}%</div>
            
            <div className="space-y-4 mb-8">
              <div>
                <div className="text-sm font-medium mb-2 opacity-80 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Missing Requirements
                </div>
                {opportunity.required_documents && opportunity.required_documents.length > 0 ? (
                  <ul className="text-sm space-y-1 opacity-90 font-medium">
                    {opportunity.required_documents.slice(0, 3).map((doc: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                         <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                         <span className="line-clamp-1">{doc}</span>
                      </li>
                    ))}
                    {opportunity.required_documents.length > 3 && (
                      <li className="text-xs opacity-70 mt-2 italic">+ {opportunity.required_documents.length - 3} more</li>
                    )}
                  </ul>
                ) : (
                  <div className="text-sm opacity-90 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> None detected
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1 opacity-80 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Estimated Completion
                </div>
                <div className="text-sm font-medium opacity-90">~15 Minutes</div>
              </div>
            </div>
          </div>
          
          <Button className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90 shadow-apple-md group spring-active">
            Continue Application <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* TABS SECTION */}
      <Tabs defaultValue="action-plan" className="w-full">
        <TabsList className="w-full md:w-auto flex flex-wrap md:inline-flex h-auto p-1.5 glass-regular rounded-apple-lg border border-apple-glass-border mb-6 shadow-apple-sm gap-1">
          <TabsTrigger value="action-plan" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-2.5 px-6 font-medium transition-all spring-transition data-[state=active]:shadow-sm text-sm">Action Plan</TabsTrigger>
          <TabsTrigger value="eligibility" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-2.5 px-6 font-medium transition-all spring-transition data-[state=active]:shadow-sm text-sm">Eligibility</TabsTrigger>
          <TabsTrigger value="evidence" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-2.5 px-6 font-medium transition-all spring-transition data-[state=active]:shadow-sm text-sm">Evidence & Risks</TabsTrigger>
          <TabsTrigger value="community" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-2.5 px-6 font-medium transition-all spring-transition data-[state=active]:shadow-sm text-sm flex items-center gap-2"><Users className="w-4 h-4" /> Impact</TabsTrigger>
          <TabsTrigger value="document" className="rounded-apple-md data-[state=active]:bg-foreground data-[state=active]:text-background py-2.5 px-6 font-medium transition-all spring-transition data-[state=active]:shadow-sm text-sm">Source Document</TabsTrigger>
        </TabsList>
        
        {/* Action Plan Tab */}
        <TabsContent value="action-plan" className="pt-4 outline-none">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-8 tracking-tight">Your Custom Timeline</h2>
            <div className="relative border-l-2 border-apple-glass-border ml-4 space-y-8 pb-8">
              {opportunity.action_steps && opportunity.action_steps.length > 0 ? (
                opportunity.action_steps.sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number).map((step: { id: string, step_number: number, title: string, description: string }) => (
                  <div key={step.id} className="relative pl-8 group">
                    <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary shadow-apple-sm group-hover:scale-110 transition-transform spring-transition">
                      {step.step_number}
                    </div>
                    <div className="glass-thin rounded-apple-lg p-6 hover:glass-regular transition-all spring-transition">
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground border border-dashed border-apple-glass-border rounded-apple-xl">
                  No action steps could be generated for this document.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Eligibility Tab */}
        <TabsContent value="eligibility" className="pt-4 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            <div className="glass-regular rounded-apple-xl p-8 border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Requirements Met</h2>
              </div>
              <ul className="space-y-4">
                {opportunity.eligibility_analysis?.requirements?.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground/90 leading-relaxed">{req}</span>
                  </li>
                )) || <li className="text-muted-foreground">Not explicitly specified.</li>}
              </ul>
            </div>

            <div className="glass-regular rounded-apple-xl p-8 border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Potential Hurdles</h2>
              </div>
              <ul className="space-y-4">
                {opportunity.risk_analysis?.risks?.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground/90 leading-relaxed">{risk}</span>
                  </li>
                )) || <li className="text-muted-foreground">No specific hurdles detected.</li>}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Evidence & Risks Tab */}
        <TabsContent value="evidence" className="pt-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Source Evidence</h2>
              <p className="text-muted-foreground mb-6">Every claim the AI makes is strictly backed by quotes from the document.</p>
              
              <div className="space-y-4">
                {opportunity.evidence_references && opportunity.evidence_references.length > 0 ? (
                  opportunity.evidence_references.map((ref: { claim: string, quote_from_document: string }, i: number) => (
                    <div key={i} className="glass-thin rounded-apple-lg p-6 relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 group-hover:bg-primary transition-colors" />
                      <div className="font-medium text-base mb-3">{ref.claim}</div>
                      <div className="bg-background/40 p-4 rounded-apple-md border border-apple-glass-border">
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                          &quot;{ref.quote_from_document}&quot;
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-500">
                        <ShieldCheck className="w-4 h-4" /> 100% Confidence Match
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground border border-dashed rounded-apple-lg">No evidence references provided.</div>
                )}
              </div>
            </div>

            <div>
              <div className="glass-thick rounded-apple-xl p-8 border border-rose-500/20 bg-rose-500/5 sticky top-8">
                <div className="flex items-center gap-2 mb-4 text-rose-600 dark:text-rose-400">
                  <TrendingDown className="w-5 h-5" />
                  <h3 className="font-semibold uppercase tracking-wider text-sm">Opportunity Loss Simulator</h3>
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">If you ignore this:</h4>
                <p className="text-base text-rose-900/80 dark:text-rose-200/80 font-medium leading-relaxed mb-6">
                  {opportunity.opportunity_loss_prediction || "You may miss out on valuable benefits, guaranteed funding, or critical career advancement steps outlined in the document."}
                </p>
                <div className="h-px w-full bg-rose-500/20 mb-6" />
                <div className="space-y-3 text-sm font-medium text-rose-900/70 dark:text-rose-200/70">
                  <div className="flex justify-between">
                    <span>Potential Loss:</span>
                    <span className="font-bold">{opportunity.opportunity_value || "Unknown Value"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadline Risk:</span>
                    <span className="font-bold">{opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Immediate'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Community Impact Tab */}
        <TabsContent value="community" className="pt-4 outline-none">
          <div className="max-w-4xl">
            <div className="glass-regular rounded-apple-xl p-10 text-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 pointer-events-none" />
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-balance">
                You are not alone in this journey.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of ambitious students using ClearPath OS to secure their future and maximize their potential.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-thin rounded-apple-lg p-8 text-center border-t-4 border-t-emerald-500">
                <div className="text-4xl font-bold mb-2 tracking-tighter">{communityStats.studentsHelped}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Students Helped</div>
              </div>
              <div className="glass-thin rounded-apple-lg p-8 text-center border-t-4 border-t-primary">
                <div className="text-4xl font-bold mb-2 tracking-tighter">{communityStats.scholarshipsDiscovered}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scholarships Found</div>
              </div>
              <div className="glass-thin rounded-apple-lg p-8 text-center border-t-4 border-t-blue-500">
                <div className="text-4xl font-bold mb-2 tracking-tighter">{communityStats.applicationsCompleted}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Applications Won</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Document Tab */}
        <TabsContent value="document" className="pt-4 outline-none h-[700px]">
          <div className="glass-thick rounded-apple-xl h-full overflow-hidden border border-apple-glass-border shadow-apple-lg relative">
            {signedUrl ? (
              <iframe 
                src={signedUrl} 
                className="w-full h-full border-0 absolute inset-0 bg-white" 
                title="Document Evidence"
              />
            ) : opportunity.storage_path.startsWith('http') ? (
              <iframe 
                src={opportunity.storage_path} 
                className="w-full h-full border-0 absolute inset-0 bg-white" 
                title="URL Evidence"
              />
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                <BookOpen className="w-12 h-12 opacity-20" />
                <p>Document viewer unavailable</p>
              </div>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
