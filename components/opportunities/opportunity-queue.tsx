'use client'

import React, { useState } from 'react'
import { FileText, ArrowRight, Clock, Target, AlertTriangle, GripVertical, Activity } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function OpportunityQueue({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(() => {
    return [...initialOpportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  });

  return (
    <div className="grid gap-4">
      {opportunities.length > 0 ? (
        opportunities.map((opp, index) => {
          // Dynamic Priority Color
          const pScore = opp.priority_score || 0;
          let pColor = "text-muted-foreground";
          let pBadge = "bg-glass-surface border-glass-border";
          if (pScore >= 80) { pColor = "text-danger"; pBadge = "bg-danger/10 border-danger/20"; }
          else if (pScore >= 50) { pColor = "text-warning"; pBadge = "bg-warning/10 border-warning/20"; }
          else if (pScore > 0) { pColor = "text-success"; pBadge = "bg-success/10 border-success/20"; }

          return (
            <div key={opp.id} className="liquid-glass-card p-6 flex flex-col md:flex-row gap-6 items-center group relative overflow-hidden transition-all hover:scale-[1.01]">
              
              {/* Queue Position */}
              <div className="flex flex-col items-center justify-center shrink-0 w-16 h-full border-r border-glass-border pr-6 cursor-grab">
                <GripVertical className="w-5 h-5 text-muted-foreground/30 mb-2 group-hover:text-foreground transition-colors" />
                <div className="text-3xl font-black text-glass-border group-hover:text-primary transition-colors">#{index + 1}</div>
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-[12px] uppercase tracking-widest font-semibold text-primary">{opp.category || "Document"}</div>
                  <div className={cn("px-3 py-1 rounded-full text-[12px] font-bold border", pColor, pBadge)}>
                    Priority {pScore}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {opp.title || "Untitled Document"}
                </h3>
                
                <div className="flex flex-wrap items-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                    <Clock className="w-4 h-4" /> 
                    {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'No Deadline'}
                  </div>
                  
                  {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' && (
                    <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                      <Target className="w-4 h-4 text-success" /> 
                      {opp.opportunity_value}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                    <Activity className="w-4 h-4 text-primary" />
                    Readiness: {opp.readinessScore || 0}%
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 flex items-center">
                <Link href={`/opportunities/${opp.id}`} className="p-4 rounded-full bg-glass-surface border border-glass-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </div>
          )
        })
      ) : (
        <div className="liquid-glass-card border-dashed border-glass-border p-[80px] flex flex-col items-center justify-center text-center">
          <div className="w-[80px] h-[80px] rounded-[24px] bg-primary/10 border border-primary/20 shadow-twilight-glow flex items-center justify-center mb-8">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-card-title text-foreground mb-3">Priority Queue Empty</h3>
          <p className="text-body-text mb-8 max-w-[500px]">
            Upload documents to generate a personalized action queue instantly.
          </p>
          <Link href="/dashboard" className="btn-twilight h-12 px-8 flex items-center justify-center rounded-[999px] shadow-twilight-glow font-medium">
            Upload Document
          </Link>
        </div>
      )}
    </div>
  )
}
