import React from 'react'
import { Target, Clock, Activity, CheckSquare, Zap, Trophy } from 'lucide-react'
import Link from 'next/link'

interface IntelligenceBriefingProps {
  opportunities: any[];
  stats: any;
  tasks: any[];
}

export function IntelligenceBriefing({ opportunities, stats, tasks }: IntelligenceBriefingProps) {
  // Find top priority opportunity
  const topPriority = opportunities.length > 0 
    ? [...opportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))[0] 
    : null;

  // Next deadline
  const withDeadlines = opportunities.filter(o => o.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  const nextDeadline = withDeadlines.length > 0 ? withDeadlines[0] : null;

  // Tasks remaining
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;

  // Estimated Completion (rough estimate based on tasks)
  const estimatedMins = pendingTasks * 15;
  const estimatedStr = estimatedMins > 60 
    ? `${Math.floor(estimatedMins / 60)}h ${estimatedMins % 60}m` 
    : `${estimatedMins}m`;

  if (!topPriority) {
    return (
      <div className="w-full h-[180px] decision-surface p-6 flex flex-col justify-center items-center text-center">
        <h3 className="text-[20px] font-medium text-foreground mb-2">Welcome to ClearPath OS</h3>
        <p className="text-[14px] text-muted-foreground">Upload a document to generate your first intelligence briefing.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[180px] decision-surface p-6 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative group">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Main Focus */}
      <div className="flex flex-col gap-3 flex-1 min-w-0 z-10">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-primary">
          <Zap className="w-3.5 h-3.5" /> Intelligence Briefing
        </div>
        <div className="flex items-end gap-4">
          <h2 className="text-[28px] font-semibold tracking-tight text-white leading-none truncate">
            {topPriority.title || "Top Priority Opportunity"}
          </h2>
          {topPriority.opportunity_value && topPriority.opportunity_value !== 'Not Found In Document' && (
            <span className="text-[18px] font-medium text-success whitespace-nowrap mb-0.5">
              {topPriority.opportunity_value}
            </span>
          )}
        </div>
        <p className="text-[14px] text-muted-foreground line-clamp-1 mt-1">
          Highest priority action required. {pendingTasks > 0 ? `${pendingTasks} tasks remaining in execution layer.` : 'Ready for submission.'}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 z-10 w-full md:w-auto">
        <div className="flex flex-col gap-1 p-3 bg-black/20 rounded-[12px] border border-glass-border">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-danger" /> Next Deadline
          </div>
          <span className="text-[16px] font-medium text-foreground whitespace-nowrap">
            {nextDeadline ? new Date(nextDeadline.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'None'}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-3 bg-black/20 rounded-[12px] border border-glass-border">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-primary" /> Readiness
          </div>
          <span className="text-[16px] font-medium text-foreground">
            {stats.averageReadiness}%
          </span>
        </div>

        <div className="flex flex-col gap-1 p-3 bg-black/20 rounded-[12px] border border-glass-border">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
            <CheckSquare className="w-3.5 h-3.5 text-warning" /> Tasks
          </div>
          <span className="text-[16px] font-medium text-foreground">
            {pendingTasks} Pending
          </span>
        </div>

        <div className="flex flex-col gap-1 p-3 bg-black/20 rounded-[12px] border border-glass-border">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
            <Trophy className="w-3.5 h-3.5 text-success" /> Est. Time
          </div>
          <span className="text-[16px] font-medium text-foreground">
            {estimatedStr}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 z-10 hidden md:block">
        <Link 
          href={`/opportunities/${topPriority.id}`}
          className="h-12 px-6 flex items-center justify-center rounded-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors shadow-[0_0_20px_rgba(149,127,239,0.3)]"
        >
          Execute
        </Link>
      </div>
    </div>
  )
}
