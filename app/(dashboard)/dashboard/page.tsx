import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IntelligenceBriefing } from "@/components/advisor/intelligence-briefing"
import { DashboardEngine } from "@/lib/dashboard-engine"
import { Activity, Clock, FileText, Target, CheckCircle2, Zap, ArrowRight } from "lucide-react"
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Fetch opportunities
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', user.id)
    .neq('status', 'TRASHED')
    .order('priority_score', { ascending: false })

  const opps = opportunities || [];

  // Fetch docs from REAL single source of truth vault
  let documentVault: any[] = [];
  try {
    const { data: docs } = await supabase.from('document_vault').select('*').eq('user_id', user.id);
    if (docs) documentVault = docs;
  } catch(e) {}

  // Fetch tasks
  let opportunityTasks: any[] = [];
  try {
    const { data: tasks } = await supabase.from('action_steps').select('*, opportunities!inner(*)').eq('opportunities.user_id', user.id);
    if (tasks) opportunityTasks = tasks;
  } catch(e) {}

  // Fetch activities
  let globalActivities: any[] = [];
  try {
    const { data: acts } = await supabase.from('activity_feed').select('*, opportunities!inner(*)').eq('opportunities.user_id', user.id).order('created_at', { ascending: false }).limit(6);
    if (acts) globalActivities = acts;
  } catch(e) {}

  const stats = DashboardEngine.calculateStats(opps, documentVault, opportunityTasks);

  // Decorate top 3 for preview
  const topOpps = opps.slice(0, 3).map(opp => {
    const oppTasks = opportunityTasks.filter(t => t.opportunity_id === opp.id);
    const metrics = DashboardEngine.calculateStats([opp], documentVault, oppTasks);
    return { ...opp, readinessScore: metrics.averageReadiness };
  });

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col pt-6 pb-12 gap-6 animate-fadeInUp max-w-[1440px]">
      
      {/* V4 COMMAND CENTER BRIEFING */}
      <IntelligenceBriefing 
        opportunities={opps} 
        stats={stats}
        tasks={opportunityTasks}
        profile={profile}
      />

      {/* V4 DENSE DYNAMIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-3 overflow-visible">
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[16px]" />
          <div className="liquid-glass-card p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] flex flex-col gap-1 h-full">
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mb-1" />
          <div className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-none">{stats.activeCount}</div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5 sm:mt-1">Active Plans</div>
          </div>
        </div>
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[16px]" />
          <div className="liquid-glass-card p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] flex flex-col gap-1 h-full">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-danger mb-1" />
          <div className="text-xl sm:text-2xl font-semibold text-danger tracking-tight leading-none">{stats.urgentDeadlinesCount}</div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5 sm:mt-1">Urgent Deadlines</div>
          </div>
        </div>
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[16px]" />
          <div className="liquid-glass-card p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] flex flex-col gap-1 h-full">
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning mb-1" />
          <div className="text-xl sm:text-2xl font-semibold text-warning tracking-tight leading-none">{stats.missingDocsCount}</div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5 sm:mt-1">Missing Docs</div>
          </div>
        </div>
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[16px]" />
          <div className="liquid-glass-card p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] flex flex-col gap-1 h-full">
          <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success mb-1" />
          <div className="text-xl sm:text-2xl font-semibold text-success tracking-tight leading-none">₹{stats.potentialFundingTotal.toLocaleString()}</div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5 sm:mt-1">Funding Value</div>
          </div>
        </div>
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[16px]" />
          <div className="liquid-glass-card p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] flex flex-col gap-1 h-full">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground mb-1" />
          <div className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-none">{stats.completedCount}</div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5 sm:mt-1">Completed</div>
          </div>
        </div>
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[16px]" />
          <div className="liquid-glass-card p-3 sm:p-4 rounded-[12px] sm:rounded-[16px] flex flex-col gap-1 bg-success/5 border-success/20 h-full">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success mb-1" />
          <div className="text-xl sm:text-2xl font-semibold text-success tracking-tight leading-none">{stats.readyToSubmitCount}</div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-success/80 tracking-widest mt-0.5 sm:mt-1">Ready to Submit</div>
          </div>
        </div>
      </div>

      {/* DENSE 3-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Priority Preview */}
        <div className="lg:col-span-2 card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[24px]" />
          <div className="liquid-glass-card rounded-[24px] p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-[16px] font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Priority Workspace
            </h2>
            <Link href="/opportunities" className="text-[12px] font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-2">
            {topOpps.length > 0 ? topOpps.map((opp, idx) => (
              <Link key={opp.id} href={`/opportunities/${opp.id}`} className="flex items-center justify-between p-3 rounded-[12px] bg-black/20 hover:bg-glass-layer transition-colors border border-glass-border group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-bold text-muted-foreground group-hover:text-primary transition-colors">#{idx + 1}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-medium text-foreground truncate">{opp.title || 'Untitled Document'}</span>
                    <span className="text-[12px] text-muted-foreground flex items-center gap-2">
                      <span className={opp.priority_score >= 80 ? "text-danger" : "text-primary"}>Priority {opp.priority_score}</span>
                      <span>•</span>
                      <span>Readiness: {opp.readinessScore}%</span>
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-4">
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )) : (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                No active opportunities.
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Right Column: Activity Feed & System */}
        <div className="flex flex-col gap-6 min-h-0">
          <div className="card-wrapper group/card-wrapper shrink-0">
            <div className="card-glow rounded-[24px]" />
            <div className="liquid-glass-card rounded-[24px] p-5">
            <h2 className="text-[14px] font-semibold mb-3 text-foreground">System Status</h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Opportunity Database</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-success bg-success/10 px-2 py-0.5 rounded flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Knowledge Engine</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Execution Layer</span>
                <span className="text-[13px] font-semibold text-foreground">{opportunityTasks.length} Active</span>
              </div>
            </div>
          </div>
          </div>
          
          <div className="card-wrapper group/card-wrapper flex-1 flex flex-col min-h-0">
            <div className="card-glow rounded-[24px]" />
            <div className="liquid-glass-card rounded-[24px] p-5 flex-1 flex flex-col min-h-0">
            <h2 className="text-[14px] font-semibold mb-3 text-foreground shrink-0">Recent Activity</h2>
            <div className="flex-1 overflow-y-auto scrollbar-none pr-2 space-y-3 border-l border-glass-border pl-3">
              {globalActivities.length > 0 ? globalActivities.map((act) => (
                <div key={act.id} className="flex flex-col gap-0.5 relative">
                  <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-primary/40 border border-primary/60" />
                  <span className="text-[13px] text-foreground font-medium leading-tight">{act.description}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )) : (
                <div className="text-muted-foreground text-[12px] italic">No recent activity.</div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
