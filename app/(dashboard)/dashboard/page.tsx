import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadWidget } from "@/components/opportunities/upload-widget"
import { MorningBriefing } from "@/components/advisor/morning-briefing"
import { OpportunityQueue } from "@/components/opportunities/opportunity-queue"
import { DashboardEngine } from "@/lib/dashboard-engine"
import { Activity, Clock, FileText, Target, CheckCircle2, Zap } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all user opportunities
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', user.id)
    .neq('status', 'TRASHED')
    .order('priority_score', { ascending: false })

  const opps = opportunities || [];

  // Fetch documents to accurately compute missing docs
  let opportunityDocuments: any[] = [];
  try {
    const { data: docs } = await supabase.from('opportunity_documents').select('*, opportunities!inner(*)').eq('opportunities.user_id', user.id);
    if (docs) opportunityDocuments = docs;
  } catch(e) {}

  // Fetch tasks to compute readiness
  let opportunityTasks: any[] = [];
  try {
    const { data: tasks } = await supabase.from('action_steps').select('*, opportunities!inner(*)').eq('opportunities.user_id', user.id);
    if (tasks) opportunityTasks = tasks;
  } catch(e) {}

  // Fetch recent activity
  let globalActivities: any[] = [];
  try {
    const { data: acts } = await supabase.from('activity_feed').select('*, opportunities!inner(*)').eq('opportunities.user_id', user.id).order('created_at', { ascending: false }).limit(5);
    if (acts) globalActivities = acts;
  } catch(e) {}

  const stats = DashboardEngine.calculateStats(opps, opportunityDocuments, opportunityTasks);

  // Decorate opportunities with computed readiness and missing docs for the queue
  const processedOpps = opps.map(opp => {
    const oppTasks = opportunityTasks.filter(t => t.opportunity_id === opp.id);
    const oppDocs = opportunityDocuments.filter(d => d.opportunity_id === opp.id);
    const metrics = DashboardEngine.calculateStats([opp], oppDocs, oppTasks);
    
    // Calculate missing docs for this specific opp
    const reqDocs = opp.required_documents || [];
    const requiredNames = Array.isArray(reqDocs) ? reqDocs.map((d: any) => d.value || String(d)) : [];
    const missing = requiredNames.filter(name => !oppDocs.find(d => d.name === name));

    return { ...opp, readinessScore: metrics.averageReadiness, missingDocsCount: missing.length };
  });

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col py-10 mt-6 animate-fadeInUp">
      
      {/* V3 HERO: Dynamic Briefing */}
      <div className="mb-10">
        <MorningBriefing 
          userId={user.id} 
          opportunities={opps} 
          stats={stats}
          documents={opportunityDocuments}
          tasks={opportunityTasks}
        />
      </div>

      {/* V3 DYNAMIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <div className="text-3xl font-semibold text-foreground tracking-tight">{stats.activeCount}</div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Active Plans</div>
        </div>
        <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col gap-2">
          <Clock className="w-5 h-5 text-danger" />
          <div className="text-3xl font-semibold text-danger tracking-tight">{stats.urgentDeadlinesCount}</div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Urgent Deadlines</div>
        </div>
        <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col gap-2">
          <FileText className="w-5 h-5 text-warning" />
          <div className="text-3xl font-semibold text-warning tracking-tight">{stats.missingDocsCount}</div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Missing Docs</div>
        </div>
        <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col gap-2">
          <Target className="w-5 h-5 text-success" />
          <div className="text-3xl font-semibold text-success tracking-tight">₹{stats.potentialFundingTotal.toLocaleString()}</div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Funding Value</div>
        </div>
        <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col gap-2">
          <CheckCircle2 className="w-5 h-5 text-foreground" />
          <div className="text-3xl font-semibold text-foreground tracking-tight">{stats.completedCount}</div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-widest">Completed</div>
        </div>
        <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl" />
          <Zap className="w-5 h-5 text-success relative z-10" />
          <div className="text-3xl font-semibold text-success tracking-tight relative z-10">{stats.readyToSubmitCount}</div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-widest relative z-10">Ready to Submit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload & Queue */}
        <div className="lg:col-span-2 space-y-8">
          <div className="liquid-glass-card border border-glass-border rounded-[32px] p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
               <Target className="w-5 h-5 text-primary" /> Initialize New Plan
            </h2>
            <UploadWidget />
          </div>

          <div className="space-y-4">
             <h2 className="text-xl font-semibold text-foreground">Priority Queue</h2>
             <OpportunityQueue initialOpportunities={processedOpps} />
          </div>
        </div>

        {/* Right Column: Status & Activity Feed */}
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 border border-glass-border rounded-[32px]">
            <h2 className="text-lg font-semibold mb-4 text-foreground">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">Opportunity Database</span>
                <span className="text-[12px] uppercase font-bold tracking-widest text-success bg-success/10 px-2 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">Knowledge Engine</span>
                <span className="text-[12px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-glass-border">
                <span className="text-[14px] text-muted-foreground">Opportunities Indexed</span>
                <span className="text-[14px] font-semibold text-foreground">{opps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">Execution Layer</span>
                <span className="text-[14px] font-semibold text-foreground">{opportunityTasks.length} Active</span>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Mini-Feed */}
          <div className="liquid-glass-card p-6 border border-glass-border rounded-[32px]">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
            <div className="space-y-4 border-l-2 border-glass-border pl-4 py-2">
              {globalActivities.length > 0 ? globalActivities.map((act) => (
                <div key={act.id} className="flex flex-col gap-1">
                  <span className="text-[14px] text-foreground font-medium">{act.description}</span>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{new Date(act.created_at).toLocaleString()}</span>
                </div>
              )) : (
                <div className="text-muted-foreground text-sm italic">No recent activity found.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
