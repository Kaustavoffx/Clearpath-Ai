'use client'

import React, { useState } from 'react'
import { FileText, ArrowRight, Clock, Target, Activity, Trash2, Calendar, FileQuestion, IndianRupee } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { deleteOpportunity } from '@/app/actions/opportunity-actions'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function OpportunitiesTable({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(() => {
    return [...initialOpportunities]
  });

  const [oppToDelete, setOppToDelete] = useState<string | null>(null);
  const [oppToDeleteTitle, setOppToDeleteTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!oppToDelete) return;
    setIsDeleting(true);
    
    try {
      await deleteOpportunity(oppToDelete);
      setOpportunities(prev => prev.filter(o => o.id !== oppToDelete));
      toast.success(`Opportunity moved to trash (available for 30 days)`);
    } catch (error) {
      toast.error('Failed to delete opportunity');
    } finally {
      setIsDeleting(false);
      setOppToDelete(null);
      setOppToDeleteTitle('');
    }
  };

  const handleDelete = (id: string, title: string) => {
    setOppToDelete(id);
    setOppToDeleteTitle(title);
  };

  if (opportunities.length === 0) {
    return (
      <div className="liquid-glass-card border-dashed border-glass-border p-[80px] flex flex-col items-center justify-center text-center rounded-[24px]">
        <div className="w-[60px] h-[60px] rounded-[16px] bg-primary/10 border border-primary/20 shadow-twilight-glow flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-[20px] font-semibold text-foreground mb-2">Your Workspace Directory is Empty</h3>
        <p className="text-[14px] text-muted-foreground mb-6 max-w-[400px]">
          Upload a document to generate your first action plan.
        </p>
        <Link href="/analyze" className="btn-twilight px-6 h-10 rounded-[10px] flex items-center justify-center text-[13px] font-medium shadow-[0_0_15px_rgba(149,127,239,0.3)]">
          Go to Analyze
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2 overflow-visible">
        {opportunities.map((opp) => {
          
          if (opp.status === 'PENDING') {
            return (
              <div key={opp.id} className="card-wrapper group/card-wrapper h-full">
                <div className="card-glow rounded-[24px]" />
                <div className="liquid-glass-card rounded-[24px] p-6 flex flex-col h-full border border-glass-border">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2 text-primary font-medium text-[13px] animate-pulse">
                        <Activity className="w-4 h-4" /> Processing Opportunity...
                     </div>
                     <button onClick={() => handleDelete(opp.id, opp.title)} className="text-muted-foreground hover:text-danger p-1">
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="flex-1 space-y-4">
                     <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                     <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                     <div className="space-y-2 mt-6">
                       <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
                       <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
                     </div>
                  </div>
                </div>
              </div>
            )
          }

          const pScore = opp.priorityScore || 0;
          let badgeColor = "text-muted-foreground border-glass-border bg-black/40";
          if (pScore >= 80) badgeColor = "text-danger border-danger/30 bg-danger/10";
          else if (pScore >= 50) badgeColor = "text-warning border-warning/30 bg-warning/10";
          else if (pScore > 0) badgeColor = "text-success border-success/30 bg-success/10";

          // Calculate Deadline string
          let deadlineStr = 'Unknown';
          if (opp.deadline) {
            const days = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (days < 0) deadlineStr = 'Expired';
            else if (days === 0) deadlineStr = 'Today';
            else if (days === 1) deadlineStr = 'Tomorrow';
            else deadlineStr = `${days} days left`;
          }

          const rScore = opp.readinessScore || 0;
          const missingCount = opp.missingDocsCount || 0;
          
          let actionLabel = "Generate Plan";
          if (rScore >= 90) actionLabel = "Ready To Apply";
          else if (opp.execution_stage !== 'Analyzed' && opp.execution_stage) actionLabel = "Continue Execution";

          return (
            <div key={opp.id} className="card-wrapper group/card-wrapper h-full">
              <div className="card-glow rounded-[24px]" />
              <div className="liquid-glass-card rounded-[24px] p-6 flex flex-col h-full border border-glass-border relative overflow-hidden transition-all duration-300">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">{opp.category || "Document"}</span>
                    <h3 
                      className="text-[16px] font-semibold text-foreground leading-tight" 
                      title={opp.title}
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {opp.title || "Untitled Opportunity"}
                    </h3>
                  </div>
                  <div className={cn("shrink-0 inline-flex items-center justify-center px-2 py-1 rounded-[8px] text-[12px] font-bold border", badgeColor)}>
                    Priority {pScore}
                  </div>
                </div>

                {/* Readiness Progress */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center text-[13px] font-medium">
                    <span className="text-foreground">Readiness</span>
                    <span className={rScore >= 90 ? 'text-success' : (rScore >= 50 ? 'text-warning' : 'text-danger')}>
                      {rScore}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-glass-layer rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", rScore >= 90 ? 'bg-success' : (rScore >= 50 ? 'bg-warning' : 'bg-danger'))} 
                      style={{ width: `${Math.max(2, rScore)}%` }} 
                    />
                  </div>
                  
                  {/* Missing Docs Snippet */}
                  {missingCount > 0 && (
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-warning flex items-center gap-1.5">
                        <FileQuestion className="w-3.5 h-3.5" /> Missing {missingCount} Docs
                      </div>
                      <ul className="text-[12px] text-muted-foreground pl-5 list-disc space-y-0.5">
                        {opp.missingDocsList?.slice(0, 2).map((doc: string, idx: number) => (
                          <li key={idx} className="truncate">{doc}</li>
                        ))}
                        {missingCount > 2 && <li>+ {missingCount - 2} more...</li>}
                      </ul>
                    </div>
                  )}
                  {missingCount === 0 && rScore > 0 && (
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-success flex items-center gap-1.5 mt-3">
                      <FileText className="w-3.5 h-3.5" /> All Docs Ready
                    </div>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                  <div className="flex flex-col p-3 bg-black/20 rounded-[12px] border border-glass-border">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <IndianRupee className="w-3 h-3" /> Funding
                    </div>
                    <div className="text-[14px] font-medium text-foreground truncate">
                       {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' ? opp.opportunity_value : 'Unknown'}
                    </div>
                  </div>
                  <div className="flex flex-col p-3 bg-black/20 rounded-[12px] border border-glass-border">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3 h-3" /> Deadline
                    </div>
                    <div className="text-[14px] font-medium text-foreground truncate">
                       {deadlineStr}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-glass-border/50">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleDelete(opp.id, opp.title || 'Untitled'); }}
                    className="p-2.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-[10px] transition-colors"
                    title="Move to Trash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link 
                    href={`/opportunities/${opp.id}`}
                    className="flex-1 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-[10px] transition-all flex items-center justify-center gap-2 font-medium text-[13px] border border-primary/20 shadow-[0_0_15px_rgba(113,97,239,0.1)] group"
                  >
                    {actionLabel} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      <ConfirmationModal
        isOpen={oppToDelete !== null}
        title="Move to Trash?"
        description={
          <>
            This action will move: <br />
            <span className="font-semibold text-foreground mt-2 block">"{oppToDeleteTitle}"</span><br />
            to the trash. It will be available for 30 days before permanent deletion.
          </>
        }
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOppToDelete(null)
          setOppToDeleteTitle('')
        }}
      />
    </>
  )
}
