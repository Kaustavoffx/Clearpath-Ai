'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldAlert, FileText, UserCheck, ArrowRight, Activity, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ApplicationAssistant } from './application-assistant'

import { ActionStep } from '@/lib/types'

export function HumanInTheLoopPipeline({ checklist, missingDocs = [] }: { checklist: ActionStep[], missingDocs?: string[] }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [hasAcknowledgedEvidence, setHasAcknowledgedEvidence] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4">
      {/* Visual Pipeline Tracker */}
      <div className="w-full lg:w-1/3 space-y-4">
        <h3 className="text-card-title mb-6 flex items-center gap-2 text-foreground"><Activity className="w-5 h-5 text-primary" /> Decision Pipeline</h3>
        
        <div className={cn("p-5 border-l-4 rounded-r-[16px] transition-spring", currentStep >= 1 ? "border-l-primary bg-primary/10 shadow-sm" : "border-l-glass-border bg-glass-surface/50 opacity-60")}>
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[15px] shadow-sm", currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-glass-layer text-muted-foreground")}>1</div>
            <div>
              <div className="font-medium text-[15px] text-foreground">AI Recommendation</div>
              <div className="text-card-label text-muted-foreground mt-1">Automated Extraction</div>
            </div>
          </div>
        </div>

        <div className={cn("p-5 border-l-4 rounded-r-[16px] transition-spring", currentStep >= 2 ? "border-l-warning bg-warning/10 shadow-sm" : "border-l-glass-border bg-glass-surface/50 opacity-60")}>
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[15px] shadow-sm", currentStep >= 2 ? "bg-warning text-warning-foreground" : "bg-glass-layer text-muted-foreground")}>2</div>
            <div>
              <div className="font-medium text-[15px] text-foreground">Evidence Review</div>
              <div className="text-card-label text-muted-foreground mt-1">Human Verification</div>
            </div>
          </div>
        </div>

        <div className={cn("p-5 border-l-4 rounded-r-[16px] transition-spring", currentStep >= 3 ? "border-l-danger bg-danger/10 shadow-sm" : "border-l-glass-border bg-glass-surface/50 opacity-60")}>
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[15px] shadow-sm", currentStep >= 3 ? "bg-danger text-white" : "bg-glass-layer text-muted-foreground")}>3</div>
            <div>
              <div className="font-medium text-[15px] text-foreground">Student Confirmation</div>
              <div className="text-card-label text-muted-foreground mt-1">Accountability Checkpoint</div>
            </div>
          </div>
        </div>

        <div className={cn("p-5 border-l-4 rounded-r-[16px] transition-spring", currentStep >= 4 ? "border-l-success bg-success/10 shadow-sm" : "border-l-glass-border bg-glass-surface/50 opacity-60")}>
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[15px] shadow-sm", currentStep >= 4 ? "bg-success text-white" : "bg-glass-layer text-muted-foreground")}>4</div>
            <div>
              <div className="font-medium text-[15px] text-foreground">Final Action</div>
              <div className="text-card-label text-muted-foreground mt-1">Execution</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step Content */}
      <div className="w-full lg:w-2/3 liquid-glass-card p-10 shadow-glass-card relative overflow-hidden">
          
          {currentStep === 1 && (
            <div className="animate-fadeInUp duration-500">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-7 h-7 text-primary" />
                <h2 className="text-section-title text-foreground">Step 1: AI Recommendation</h2>
              </div>
              <p className="text-body-text text-muted-foreground mb-8">The AI has analyzed the document and generated the following deterministic action plan. Review the steps below before proceeding to human verification.</p>
              
              <div className="space-y-4 mb-10">
                {checklist && checklist.length > 0 ? (
                  checklist.map((item: ActionStep, i: number) => (
                    <div key={i} className="p-5 border border-glass-border rounded-[16px] bg-glass-surface/50 flex flex-col gap-3 shadow-sm">
                      <div className="flex items-start gap-5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0 shadow-sm">{item.step_number || i+1}</div>
                        <div className="flex-1">
                          <div className="text-card-title text-[16px] mb-1.5 text-foreground">{item.title}</div>
                          <div className="text-body-text text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      
                      {item.source_quote && (
                        <div className="ml-13 mt-2 bg-background p-3 rounded-lg border border-glass-border shadow-sm">
                          <div className="text-[11px] uppercase font-semibold text-muted-foreground mb-1">Source Quote</div>
                          <div className="text-[13px] font-mono text-foreground mb-2 italic">&quot;{item.source_quote}&quot;</div>
                          <div className="flex gap-4">
                            <div>
                              <span className="text-[10px] uppercase text-muted-foreground mr-1">Page</span>
                              <span className="text-[12px] font-semibold">{item.page_number || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-muted-foreground mr-1">Confidence</span>
                              <span className={cn("text-[12px] font-semibold", (item.confidence_score || 0) < 70 ? "text-warning" : "text-success")}>{item.confidence_score || 0}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground border-2 border-dashed border-glass-border rounded-[20px] text-[15px]">No checklist generated.</div>
                )}
              </div>

              <Button onClick={handleNextStep} size="lg" className="w-full h-14 rounded-[999px] text-[16px] font-semibold transition-spring shadow-glass-card">
                Proceed to Evidence Review <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fadeInUp duration-500">
               <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-7 h-7 text-warning" />
                <h2 className="text-section-title text-foreground">Step 2: Evidence Review</h2>
              </div>
              <p className="text-body-text text-muted-foreground mb-8">You are required to verify the AI&apos;s claims. Please review the <strong>Responsible AI Panel</strong> (Verify Evidence tab) to ensure all quotes match the source document.</p>
              
              <div className="p-8 bg-warning/5 border-l-4 border-l-warning rounded-[16px] border border-glass-border mb-10 shadow-sm">
                <h4 className="text-card-title text-[16px] mb-3 flex items-center gap-2 text-foreground"><Lock className="w-5 h-5 text-warning" /> Required Checkpoint</h4>
                <p className="text-body-text text-muted-foreground mb-6 max-w-[500px]">I have navigated to the Evidence Tab and manually cross-referenced the AI-extracted quotes with the source PDF.</p>
                <label className="flex items-center gap-4 cursor-pointer group w-fit">
                  <input 
                    type="checkbox" 
                    className="appearance-none w-6 h-6 border-2 border-warning/50 rounded-md bg-background checked:bg-warning checked:border-warning transition-crisp shadow-sm"
                    checked={hasAcknowledgedEvidence}
                    onChange={(e) => setHasAcknowledgedEvidence(e.target.checked)}
                  />
                  <span className="text-[16px] font-medium text-foreground">Yes, I have reviewed the evidence.</span>
                </label>
              </div>

              <Button onClick={handleNextStep} disabled={!hasAcknowledgedEvidence} size="lg" className={cn("w-full h-14 rounded-[999px] text-[16px] font-semibold transition-spring", hasAcknowledgedEvidence ? "bg-warning hover:bg-warning/90 text-warning-foreground shadow-glass-card" : "")}>
                Proceed to Confirmation <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fadeInUp duration-500">
               <div className="flex items-center gap-3 mb-6">
                <UserCheck className="w-7 h-7 text-danger" />
                <h2 className="text-section-title text-foreground">Step 3: Student Confirmation</h2>
              </div>
              <p className="text-body-text text-muted-foreground mb-8">The AI does not make final decisions. By confirming below, you are taking ownership of the decision to apply based on the verified evidence.</p>
              
              <div className="p-10 bg-danger/5 border border-danger/20 rounded-[20px] mb-10 text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-danger/10 blur-[60px] pointer-events-none" />
                
                <h4 className="text-section-title text-[24px] mb-3 text-danger relative z-10">Digital Signature</h4>
                <p className="text-body-text text-foreground/80 mb-8 max-w-[400px] mx-auto text-balance relative z-10">I acknowledge that the action plan is AI-generated and I accept the risk of potential hallucination.</p>
                
                <label className="flex flex-col items-center gap-4 cursor-pointer group relative z-10">
                  <input 
                    type="checkbox" 
                    className="appearance-none w-10 h-10 border-2 border-danger/50 rounded-[10px] bg-background checked:bg-danger checked:border-danger transition-crisp shadow-sm"
                    checked={hasConfirmed}
                    onChange={(e) => setHasConfirmed(e.target.checked)}
                  />
                  <span className="text-status-badge text-[14px] text-danger">I confirm and take control</span>
                </label>
              </div>

              <Button onClick={handleNextStep} disabled={!hasConfirmed} variant="destructive" size="lg" className="w-full h-14 rounded-[999px] text-[16px] font-semibold transition-spring shadow-glass-card">
                Unlock Final Action <Unlock className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-fadeInUp duration-500">
              <ApplicationAssistant missingDocs={missingDocs} />
            </div>
          )}

      </div>
    </div>
  )
}
