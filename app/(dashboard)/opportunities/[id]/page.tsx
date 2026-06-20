import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ShieldAlert, Activity, LayoutDashboard, FileText, CheckSquare, Calendar, Bot, Settings } from "lucide-react"
import { LiveCountdown } from "@/components/opportunities/live-countdown"
import { ReadinessEngine } from "@/lib/readiness-engine"
import { ReadinessRing } from "@/components/ui/readiness-ring"
import { Metadata } from "next"
import { DocumentChecklist } from "@/components/opportunities/document-checklist"
import { ProcessingOrchestrator } from "@/components/opportunities/processing-orchestrator"
import { TaskEngine } from "@/components/opportunities/task-engine"
import { ActivityFeed } from "@/components/opportunities/activity-feed"
import { AiAdvisor } from "@/components/opportunities/ai-advisor"
import { ExportCenter } from "@/components/opportunities/export-center"
import { cn } from "@/lib/utils"

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

export default async function OpportunityCommandCenter({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Core Opportunity + Tasks
  const { data: oppRecord, error: oppError } = await supabase
    .from('opportunities')
    .select('*, action_steps(*)')
    .eq('id', id)
    .single()

  if (oppError || !oppRecord) {
    const { data: jobRecord } = await supabase.from('processing_jobs').select('*').eq('id', id).single()
    if (!jobRecord) notFound()
    return <ProcessingOrchestrator jobId={id} />
  }

  if (oppRecord.status === 'PENDING') {
    return <ProcessingOrchestrator jobId={id} />
  }

  // 2. Fetch V2 Tables Safely (In case migration 00012 isn't applied yet)
  let opportunityDocuments: any[] = [];
  try {
    const { data: docs } = await supabase.from('opportunity_documents').select('*').eq('opportunity_id', id);
    if (docs) opportunityDocuments = docs;
  } catch (e) {
    // Migration not applied, fallback to empty
  }

  // 3. Readiness Engine V2
  const metrics = ReadinessEngine.calculate(
    oppRecord, 
    opportunityDocuments, 
    oppRecord.action_steps || [], 
    {} // mock profile for now
  );

  return (
    <div className="container-wide py-8 flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* COMMAND CENTER HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-glass-surface/30 p-8 rounded-[32px] border border-glass-border shadow-glass-card relative overflow-hidden">
        {/* Soft backdrop glow behind readiness engine */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="flex flex-col gap-4 relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary uppercase tracking-widest border-primary/20 shadow-sm px-4 py-1.5 text-[12px] font-semibold">
              {oppRecord.category || 'Document'}
            </Badge>
            <Badge variant="outline" className={cn(
              "uppercase tracking-widest border-glass-border shadow-sm px-4 py-1.5 text-[12px] font-semibold",
              metrics.deadlineRisk === 'Critical' ? 'bg-danger/10 text-danger border-danger/20' :
              metrics.deadlineRisk === 'High' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-glass-surface text-muted-foreground'
            )}>
              Risk: {metrics.deadlineRisk}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-foreground mt-2">
            {oppRecord.title}
          </h1>
          <p className="text-lg text-muted-foreground line-clamp-2 max-w-2xl mt-2">
            {oppRecord.simplified_summary}
          </p>
        </div>

        <div className="bg-glass-surface p-6 rounded-[24px] border border-glass-border shadow-sm relative z-10 shrink-0 min-w-[300px]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[12px] uppercase font-semibold text-muted-foreground tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Live Countdown
            </span>
          </div>
          <LiveCountdown deadlineString={oppRecord.deadline} />
        </div>
      </div>

      {/* V2 COMMAND TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-glass-border rounded-none bg-transparent h-auto p-0 gap-8 hide-scrollbar">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><LayoutDashboard className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><FileText className="w-4 h-4" /> Documents</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><CheckSquare className="w-4 h-4" /> Tasks</TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><Calendar className="w-4 h-4" /> Timeline</TabsTrigger>
          <TabsTrigger value="evidence" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><ShieldAlert className="w-4 h-4" /> Evidence</TabsTrigger>
          <TabsTrigger value="advisor" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2 ml-auto"><Bot className="w-4 h-4" /> AI Advisor</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-2 font-semibold transition-all data-[state=active]:shadow-none text-[14px] uppercase tracking-wider text-muted-foreground data-[state=active]:text-foreground flex gap-2"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="pt-8 outline-none animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Readiness Engine Widget */}
            <div className="lg:col-span-1 liquid-glass-card p-8 border border-glass-border rounded-[32px] flex flex-col items-center shadow-glass-card relative">
              <div className="w-full flex justify-between items-center mb-8">
                <h3 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Application Readiness
                </h3>
              </div>
              
              <ReadinessRing score={metrics.applicationReadiness} size={220} strokeWidth={16} />
              
              <div className="w-full grid grid-cols-2 gap-4 mt-12">
                <div className="bg-glass-surface/50 p-4 rounded-[16px] border border-glass-border">
                  <div className="text-[20px] font-semibold text-foreground mb-1">{metrics.documentsReady} / {metrics.documentsTotal}</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Docs Ready</div>
                </div>
                <div className="bg-glass-surface/50 p-4 rounded-[16px] border border-glass-border">
                  <div className="text-[20px] font-semibold text-foreground mb-1">{metrics.requirementsReady} / {metrics.requirementsTotal}</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Reqs Met</div>
                </div>
                <div className="bg-glass-surface/50 p-4 rounded-[16px] border border-glass-border">
                  <div className="text-[20px] font-semibold text-success mb-1">{metrics.executionConfidence}%</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">AI Confidence</div>
                </div>
                <div className="bg-glass-surface/50 p-4 rounded-[16px] border border-glass-border">
                  <div className="text-[20px] font-semibold text-foreground mb-1">{metrics.estimatedCompletionTimeMinutes}m</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Est. Time</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-glass-surface p-8 border border-glass-border rounded-[32px]">
                 <h2 className="text-xl font-semibold mb-6">Execution Pipeline</h2>
                 <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-glass-border/50 -translate-y-1/2 z-0" />
                    
                    {['Discovered', 'Analyzed', 'Prepared', 'Submitted', 'Verified'].map((step, idx) => {
                      const isActive = idx === 1; // "Analyzed"
                      const isPast = idx < 1;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all",
                            isActive ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] scale-125" :
                            isPast ? "bg-primary/20 text-primary border-primary" : "bg-glass-surface text-muted-foreground border-glass-border"
                          )}>
                            {idx + 1}
                          </div>
                          <span className={cn(
                            "text-[12px] font-semibold uppercase tracking-wider",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}>{step}</span>
                        </div>
                      )
                    })}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                 <div className="bg-glass-surface p-8 border border-glass-border rounded-[32px]">
                   <h2 className="text-lg font-semibold mb-4">Required Documents</h2>
                   <div className="space-y-3">
                     {metrics.documentsTotal === 0 ? (
                       <p className="text-muted-foreground text-sm">No documents required.</p>
                     ) : (
                       oppRecord.required_documents?.slice(0, 5).map((doc: any, i: number) => (
                         <div key={i} className="flex items-center gap-3 text-[14px]">
                           <div className="w-5 h-5 rounded border border-glass-border flex items-center justify-center text-glass-border"></div>
                           <span>{doc.value || String(doc)}</span>
                         </div>
                       ))
                     )}
                   </div>
                 </div>
                 
                 <div className="bg-glass-surface p-8 border border-glass-border rounded-[32px]">
                   <h2 className="text-lg font-semibold mb-4">Eligibility Match</h2>
                   <div className="space-y-3">
                     {oppRecord.eligibility_analysis?.requirements?.slice(0, 5).map((req: any, i: number) => {
                       const val = req.value || String(req);
                       const isMatch = val.includes('[MATCHED]');
                       return (
                         <div key={i} className="flex items-start gap-3 text-[14px]">
                           {isMatch ? <span className="text-success">✓</span> : <span className="text-danger">✗</span>}
                           <span className="line-clamp-2">{val.replace(/\[(MATCHED|MISMATCH)\]\s*/, '')}</span>
                         </div>
                       )
                     })}
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </TabsContent>

        <TabsContent value="documents" className="pt-8 outline-none animate-in fade-in duration-500">
           <DocumentChecklist 
             requiredDocuments={oppRecord.required_documents?.map((d: any) => d.value || String(d)) || []} 
             existingDocuments={opportunityDocuments}
             opportunityId={id}
           />
        </TabsContent>

        <TabsContent value="tasks" className="pt-8 outline-none animate-in fade-in duration-500">
           <TaskEngine initialTasks={oppRecord.action_steps || []} />
        </TabsContent>

        <TabsContent value="timeline" className="pt-8 outline-none animate-in fade-in duration-500">
           <ActivityFeed />
        </TabsContent>

        <TabsContent value="evidence" className="pt-8 outline-none animate-in fade-in duration-500">
           <div className="p-20 text-center border-2 border-dashed border-glass-border rounded-[32px] text-muted-foreground">
             <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <h2 className="text-xl font-semibold mb-2">Evidence Matrix V2</h2>
             <p>Porting evidence systems to the new architecture.</p>
           </div>
        </TabsContent>

        <TabsContent value="advisor" className="pt-8 outline-none animate-in fade-in duration-500">
           <AiAdvisor opportunityData={oppRecord} />
        </TabsContent>

        <TabsContent value="settings" className="pt-8 outline-none animate-in fade-in duration-500">
           <ExportCenter opportunityData={oppRecord} />
        </TabsContent>

      </Tabs>

    </div>
  )
}
