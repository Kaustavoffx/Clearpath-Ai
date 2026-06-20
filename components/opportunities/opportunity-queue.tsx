'use client'

import React, { useState, useRef } from 'react'
import { FileText, ArrowRight, Clock, Target, GripVertical, Activity, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { updateOpportunityPriorities, deleteOpportunity } from '@/app/actions/opportunity-actions'
import { toast } from 'sonner'

export function OpportunityQueue({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(() => {
    return [...initialOpportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  });
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
    setDraggedIndex(position);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newOpps = [...opportunities];
      const draggedItemContent = newOpps.splice(dragItem.current, 1)[0];
      newOpps.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Calculate new priorities (simple integer assignment for order)
      const updates = newOpps.map((opp, index) => {
        const newScore = 1000 - index * 10; // Simple sequence: 1000, 990, 980...
        return {
          ...opp,
          priority_score: newScore
        };
      });

      setOpportunities(updates);
      
      // Persist to DB
      toast.promise(
        updateOpportunityPriorities(updates.map(u => ({ id: u.id, priority_score: u.priority_score }))),
        {
          loading: 'Saving new queue order...',
          success: 'Queue order saved to database',
          error: 'Failed to save queue order'
        }
      );
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Move "${title}" to Trash?`)) {
      setOpportunities(prev => prev.filter(o => o.id !== id));
      toast.promise(
        deleteOpportunity(id),
        {
          loading: 'Moving to trash...',
          success: 'Opportunity moved to trash (available for 30 days)',
          error: 'Failed to delete opportunity'
        }
      );
    }
  };

  return (
    <div className="grid gap-4">
      {opportunities.length > 0 ? (
        opportunities.map((opp, index) => {
          const pScore = opp.priority_score || 0;
          let pColor = "text-muted-foreground";
          let pBadge = "bg-glass-surface border-glass-border";
          if (pScore >= 80) { pColor = "text-danger"; pBadge = "bg-danger/10 border-danger/20"; }
          else if (pScore >= 50) { pColor = "text-warning"; pBadge = "bg-warning/10 border-warning/20"; }
          else if (pScore > 0) { pColor = "text-success"; pBadge = "bg-success/10 border-success/20"; }

          const isDragging = draggedIndex === index;

          return (
            <div 
              key={opp.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "liquid-glass-card p-6 flex flex-col md:flex-row gap-6 items-center group relative overflow-hidden transition-all duration-300",
                isDragging ? "opacity-50 scale-95 shadow-none" : "hover:scale-[1.01]"
              )}
            >
              <div className="flex flex-col items-center justify-center shrink-0 w-16 h-full border-r border-glass-border pr-6 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-muted-foreground/30 mb-2 group-hover:text-foreground transition-colors" />
                <div className="text-3xl font-black text-glass-border group-hover:text-primary transition-colors">#{index + 1}</div>
              </div>

              <div className="flex-1 flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-[12px] uppercase tracking-widest font-semibold text-primary">{opp.category || "Document"}</div>
                  <div className="flex items-center gap-3">
                    <div className={cn("px-3 py-1 rounded-full text-[12px] font-bold border", pColor, pBadge)}>
                      Priority {pScore > 100 ? (100 - index) : pScore}
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(opp.id, opp.title || 'Untitled')}
                      className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                      title="Move to Trash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold tracking-tight text-foreground line-clamp-1">
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
                  
                  <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                    <FileText className="w-4 h-4 text-warning" />
                    Missing Docs: {opp.missingDocsCount || 0}
                  </div>
                </div>
              </div>

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
          <h3 className="text-card-title text-foreground mb-3">Your Opportunity Workspace Is Empty</h3>
          <p className="text-body-text mb-8 max-w-[500px]">
            Upload a document to generate your first action plan.
          </p>
        </div>
      )}
    </div>
  )
}
