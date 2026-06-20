'use client'

import React from 'react'
import { Activity, Upload, CheckCircle2, FileText, Bot } from 'lucide-react'

export function ActivityFeed({ activities }: { activities?: any[] }) {
  // If no DB activities passed yet, show mock data to represent Phase 2 progress
  const feed = activities && activities.length > 0 ? activities : [
    {
      id: 1,
      action_type: 'UPLOAD',
      description: 'Document analyzed and initialized by ClearPath OS.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 2,
      action_type: 'SYSTEM',
      description: 'Action plan generated containing 5 mandatory tasks.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.9).toISOString(),
    },
    {
      id: 3,
      action_type: 'VERIFY',
      description: 'Readiness Engine calculated initial score of 45%.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'UPLOAD': return <Upload className="w-4 h-4 text-primary" />;
      case 'VERIFY': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-warning" />;
      case 'SYSTEM': return <Bot className="w-4 h-4 text-muted-foreground" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      <div className="absolute top-0 bottom-0 left-6 w-px bg-glass-border/50 -z-10" />

      {feed.map((activity, index) => (
        <div key={activity.id} className="flex gap-6 items-start relative z-10 group">
          <div className="w-12 h-12 rounded-full bg-glass-surface border border-glass-border shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {getIcon(activity.action_type)}
          </div>
          
          <div className="flex-1 bg-glass-surface/30 p-5 rounded-[20px] border border-glass-border hover:bg-glass-surface transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-foreground">
                {activity.description}
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                {new Date(activity.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-6 items-center">
        <div className="w-12 h-12 rounded-full bg-glass-surface/50 border border-glass-border border-dashed flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-pulse" />
        </div>
        <span className="text-sm font-medium text-muted-foreground italic">Waiting for next action...</span>
      </div>
    </div>
  )
}
