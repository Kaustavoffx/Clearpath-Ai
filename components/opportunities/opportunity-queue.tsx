'use client'

import React, { useState, useRef } from 'react'
import { FileText, ArrowRight, Clock, Target, GripVertical, Activity, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { updateOpportunityPriorities, deleteOpportunity } from '@/app/actions/opportunity-actions'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { useVirtualizer } from '@tanstack/react-virtual'

export function OpportunityQueue({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(() => {
    return [...initialOpportunities].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  });
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: opportunities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => typeof window !== 'undefined' && window.innerWidth < 768 ? 96 : 140, // Height of card plus gap
    overscan: 5,
  })

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

  return (
    <div className="grid gap-4 w-full">
      {opportunities.length > 0 ? (
        <div ref={parentRef} style={{ height: '600px', overflowY: 'auto' }} className="scrollbar-none w-full relative pr-2">
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const index = virtualRow.index
              const opp = opportunities[index]
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
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size - 16}px`, // leaves 16px for gap
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                  className={cn(
                    "card-wrapper group/card-wrapper p-0 transition-all duration-300",
                    isDragging ? "opacity-50 scale-95 shadow-none" : "hover:-translate-y-1"
                  )}
                >
                  <div className="card-glow rounded-[20px]" />
                  <div className="liquid-glass-card h-full p-3 md:p-6 flex flex-row gap-3 md:gap-6 items-center group overflow-hidden rounded-[20px]">
                  <div className="flex flex-col items-center justify-center shrink-0 w-10 md:w-16 h-full border-r border-glass-border pr-3 md:pr-6 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3 h-3 md:w-5 md:h-5 text-muted-foreground/30 mb-1 md:mb-2 group-hover:text-foreground transition-colors" />
                    <div className="text-sm md:text-3xl font-black text-glass-border group-hover:text-primary transition-colors">#{index + 1}</div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                    <div className="hidden md:flex justify-between items-start">
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
                    
                    <h3 className="text-[14px] md:text-xl font-semibold tracking-tight text-foreground line-clamp-1 break-safe">
                      {opp.title || "Untitled Document"}
                    </h3>

                    {/* Mobile Details Inline */}
                    <div className="flex md:hidden items-center gap-2 mt-1 text-[11px] text-muted-foreground overflow-x-auto scrollbar-none whitespace-nowrap">
                      <span className={cn("px-1.5 py-0.5 rounded-[4px] font-bold border shrink-0 text-[9px]", pColor, pBadge)}>
                        PRI {pScore > 100 ? (100 - index) : pScore}
                      </span>
                      <span className="text-success font-medium shrink-0">Readiness {opp.readinessScore || 0}%</span>
                      <span className="shrink-0">•</span>
                      <span className="shrink-0">{opp.deadline ? new Date(opp.deadline).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No Deadline'}</span>
                      {opp.opportunity_value && opp.opportunity_value !== 'Not Found In Document' && (
                        <>
                          <span className="shrink-0">•</span>
                          <span className="text-foreground shrink-0">{opp.opportunity_value}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Desktop Details */}
                    <div className="hidden md:flex flex-wrap items-center gap-6 mt-3">
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

                  <div className="shrink-0 flex items-center pl-2">
                    <Link href={`/opportunities/${opp.id}`} className="p-2 md:p-4 rounded-full bg-glass-surface border border-glass-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>
                  </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[24px]" />
          <div className="liquid-glass-card border-dashed border-glass-border p-[80px] flex flex-col items-center justify-center text-center rounded-[24px]">
          <div className="w-[80px] h-[80px] rounded-[24px] bg-primary/10 border border-primary/20 shadow-twilight-glow flex items-center justify-center mb-8">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-card-title text-foreground mb-3">Your Opportunity Workspace Is Empty</h3>
          <p className="text-body-text mb-8 max-w-[500px]">
            Upload a document to generate your first action plan.
          </p>
        </div>
        </div>
      )}

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
    </div>
  )
}
