'use client'

import React, { useState, useRef } from 'react'
import { FileText, ArrowRight, Clock, Target, Activity, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { deleteOpportunity } from '@/app/actions/opportunity-actions'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { useVirtualizer } from '@tanstack/react-virtual'

export function OpportunitiesTable({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(() => {
    return [...initialOpportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  });

  const [oppToDelete, setOppToDelete] = useState<string | null>(null);
  const [oppToDeleteTitle, setOppToDeleteTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: opportunities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 72,
    overscan: 5,
  })

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
    <>
      <div className="liquid-glass-card rounded-[24px] overflow-hidden border border-glass-border">
        <div className="overflow-x-auto scrollbar-none" ref={parentRef} style={{ height: '500px', overflowY: 'auto' }}>
          <table className="w-full text-left border-collapse block md:table">
            <thead className="sticky top-0 z-10 hidden md:table-header-group">
              <tr className="border-b border-glass-border bg-black/40 backdrop-blur-md">
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Opportunity</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Priority</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Deadline</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Value</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">Readiness</th>
                <th className="py-3 px-5 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const idx = virtualRow.index
                const opp = opportunities[idx];
                const pScore = opp.priority_score || 0;
                let pColor = "text-muted-foreground border-glass-border";
                if (pScore >= 80) pColor = "text-danger border-danger/20 bg-danger/10";
                else if (pScore >= 50) pColor = "text-warning border-warning/20 bg-warning/10";
                else if (pScore > 0) pColor = "text-success border-success/20 bg-success/10";

                return (
                  <tr 
                    key={opp.id} 
                    className="border-b border-glass-border/50 hover:bg-glass-layer/50 transition-colors group absolute top-0 left-0 w-full flex flex-col md:flex-row md:items-center p-4 md:p-0 gap-2 md:gap-0"
                    style={{ 
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <td className="md:py-3 md:px-5 w-full md:w-[35%] md:min-w-[250px] flex items-center justify-between md:block">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-foreground line-clamp-1 break-safe">{opp.title || "Untitled Document"}</span>
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{opp.category || "Document"}</span>
                      </div>
                      <div className="md:hidden flex items-center gap-2">
                        <div className={cn("inline-flex items-center justify-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold border", pColor)}>
                          {pScore > 100 ? (100 - idx) : pScore}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-3 px-5 w-[15%]">
                      <div className={cn("inline-flex items-center justify-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold border", pColor)}>
                        {pScore > 100 ? (100 - idx) : pScore}
                      </div>
                    </td>
                    <td className="md:py-3 md:px-5 w-full md:w-[15%] flex items-center justify-between md:block text-[13px]">
                      <span className="md:hidden text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">Deadline</span>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 shrink-0 hidden md:block" />
                        <span className="truncate">{opp.deadline ? new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}</span>
                      </div>
                    </td>
                    <td className="md:py-3 md:px-5 w-full md:w-[15%] flex items-center justify-between md:block">
                      <span className="md:hidden text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">Value</span>
                      <div className="text-[13px] font-medium text-foreground truncate">
                        {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' ? opp.opportunity_value : '-'}
                      </div>
                    </td>
                    <td className="md:py-3 md:px-5 w-full md:w-[10%] flex items-center justify-between md:block">
                      <span className="md:hidden text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">Readiness</span>
                      <div className="flex items-center gap-2 text-[13px]">
                        <Activity className={cn("w-3.5 h-3.5", opp.readinessScore >= 80 ? 'text-success' : 'text-warning')} />
                        <span className="font-medium text-foreground">{opp.readinessScore || 0}%</span>
                      </div>
                    </td>
                    <td className="md:py-3 md:px-5 w-full md:w-[10%] text-right mt-2 md:mt-0 pt-2 border-t md:border-0 border-glass-border/50">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                          className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors border border-primary/20 flex items-center gap-2"
                        >
                          <span className="md:hidden text-[12px] font-semibold pl-1">View</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
    </>
  )
}
