'use client'

import React, { useState } from 'react'
import { FileText, ArrowRight, Clock, Target, Activity, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { updateOpportunityPriorities, deleteOpportunity } from '@/app/actions/opportunity-actions'
import { toast } from 'sonner'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function OpportunitiesTable({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(() => {
    return [...initialOpportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
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
        <h3 className="text-[20px] font-semibold text-foreground mb-2">Your Opportunity Workspace Is Empty</h3>
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
    <LazyMotion features={domAnimation}>
      <div className="liquid-glass-card rounded-[24px] overflow-hidden border border-glass-border">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-black/20">
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Opportunity</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Priority</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Deadline</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Value</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Readiness</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {opportunities.map((opp, idx) => {
                  const pScore = opp.priority_score || 0;
                  let pColor = "text-muted-foreground border-glass-border";
                  if (pScore >= 80) pColor = "text-danger border-danger/20 bg-danger/10";
                  else if (pScore >= 50) pColor = "text-warning border-warning/20 bg-warning/10";
                  else if (pScore > 0) pColor = "text-success border-success/20 bg-success/10";

                  return (
                    <m.tr 
                      key={opp.id} 
                      layout
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
                      transition={{ duration: 0.25 }}
                      className="border-b border-glass-border/50 hover:bg-glass-layer/50 transition-colors group"
                    >
                      <td className="py-3 px-5 min-w-[250px]">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-foreground line-clamp-1">{opp.title || "Untitled Document"}</span>
                          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{opp.category || "Document"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className={cn("inline-flex items-center justify-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold border", pColor)}>
                          {pScore > 100 ? (100 - idx) : pScore}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {opp.deadline ? new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="text-[13px] font-medium text-foreground">
                          {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' ? opp.opportunity_value : '-'}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2 text-[13px]">
                          <Activity className={cn("w-3.5 h-3.5", opp.readinessScore >= 80 ? 'text-success' : 'text-warning')} />
                          <span className="font-medium text-foreground">{opp.readinessScore || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(opp.id, opp.title || 'Untitled');
                            }}
                            className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                            title="Move to Trash"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link 
                            href={`/opportunities/${opp.id}`}
                            className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors border border-primary/20"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </m.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
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
    </LazyMotion>
  )
}
