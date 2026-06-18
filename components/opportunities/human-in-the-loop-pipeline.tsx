'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldAlert, FileText, UserCheck, ArrowRight, Activity, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ApplicationAssistant } from './application-assistant'

export function HumanInTheLoopPipeline({ checklist, missingDocs = [] }: { checklist: { title: string, description: string }[], missingDocs?: string[] }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [hasAcknowledgedEvidence, setHasAcknowledgedEvidence] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Visual Pipeline Tracker */}
      <div className="w-full lg:w-1/3 space-y-4">
        <h3 className="text-step-2 font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-warning" /> Decision Pipeline</h3>
        
        <div className={cn("p-4 border-l-4 rounded-r-lg transition-crisp", currentStep >= 1 ? "border-l-primary bg-primary/5" : "border-l-muted bg-muted/20 opacity-50")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", currentStep >= 1 ? "bg-primary text-background" : "bg-muted text-muted-foreground")}>1</div>
            <div>
              <div className="font-bold text-step-0">AI Recommendation</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">Automated Extraction</div>
            </div>
          </div>
        </div>

        <div className={cn("p-4 border-l-4 rounded-r-lg transition-crisp", currentStep >= 2 ? "border-l-warning bg-warning/5" : "border-l-muted bg-muted/20 opacity-50")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", currentStep >= 2 ? "bg-warning text-background" : "bg-muted text-muted-foreground")}>2</div>
            <div>
              <div className="font-bold text-step-0">Evidence Review</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">Human Verification</div>
            </div>
          </div>
        </div>

        <div className={cn("p-4 border-l-4 rounded-r-lg transition-crisp", currentStep >= 3 ? "border-l-danger bg-danger/5" : "border-l-muted bg-muted/20 opacity-50")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", currentStep >= 3 ? "bg-danger text-background" : "bg-muted text-muted-foreground")}>3</div>
            <div>
              <div className="font-bold text-step-0">Student Confirmation</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">Accountability Checkpoint</div>
            </div>
          </div>
        </div>

        <div className={cn("p-4 border-l-4 rounded-r-lg transition-crisp", currentStep >= 4 ? "border-l-success bg-success/5" : "border-l-muted bg-muted/20 opacity-50")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", currentStep >= 4 ? "bg-success text-background" : "bg-muted text-muted-foreground")}>4</div>
            <div>
              <div className="font-bold text-step-0">Final Action</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">Execution</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step Content */}
      <div className="w-full lg:w-2/3 decision-surface p-8 shadow-elevation-2 relative overflow-hidden">
        
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-step-3 font-bold tracking-tight">Step 1: AI Recommendation</h2>
            </div>
            <p className="text-step-1 text-muted-foreground mb-8">The AI has analyzed the document and generated the following deterministic action plan. Review the steps below before proceeding to human verification.</p>
            
            <div className="space-y-4 mb-8">
              {checklist && checklist.length > 0 ? (
                checklist.map((item: { title: string, description: string }, i: number) => (
                  <div key={i} className="p-4 border border-border rounded-lg bg-background flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 mt-0.5">{i+1}</div>
                    <div>
                      <div className="font-bold text-step-0 mb-1">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">No checklist generated.</div>
              )}
            </div>

            <Button onClick={handleNextStep} className="w-full h-14 text-step-1 font-bold">
              Proceed to Evidence Review <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-warning" />
              <h2 className="text-step-3 font-bold tracking-tight">Step 2: Evidence Review</h2>
            </div>
            <p className="text-step-1 text-muted-foreground mb-8">You are required to verify the AI&apos;s claims. Please review the <strong>Responsible AI Panel</strong> (Evidence Matrix tab) to ensure all quotes match the source document.</p>
            
            <div className="p-6 bg-warning/10 border-l-4 border-l-warning rounded-r-lg mb-8">
              <h4 className="font-bold text-step-0 mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> Required Checkpoint</h4>
              <p className="text-sm text-muted-foreground mb-4">I have navigated to the Evidence Tab and manually cross-referenced the AI-extracted quotes with the source PDF.</p>
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  className="appearance-none w-5 h-5 border-2 border-warning/50 rounded bg-background checked:bg-warning checked:border-warning transition-crisp"
                  checked={hasAcknowledgedEvidence}
                  onChange={(e) => setHasAcknowledgedEvidence(e.target.checked)}
                />
                <span className="text-sm font-medium">Yes, I have reviewed the evidence.</span>
              </label>
            </div>

            <Button onClick={handleNextStep} disabled={!hasAcknowledgedEvidence} className="w-full h-14 text-step-1 font-bold">
              Proceed to Confirmation <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-3 mb-6">
              <UserCheck className="w-6 h-6 text-danger" />
              <h2 className="text-step-3 font-bold tracking-tight">Step 3: Student Confirmation</h2>
            </div>
            <p className="text-step-1 text-muted-foreground mb-8">The AI does not make final decisions. By confirming below, you are taking ownership of the decision to apply based on the verified evidence.</p>
            
            <div className="p-6 bg-danger/5 border border-danger/30 rounded-lg mb-8 text-center">
              <h4 className="font-bold text-step-2 mb-2 text-danger">Digital Signature</h4>
              <p className="text-sm text-muted-foreground mb-6 max-w-[400px] mx-auto text-balance">I acknowledge that the action plan is AI-generated and I accept the risk of potential hallucination.</p>
              
              <label className="flex flex-col items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="appearance-none w-8 h-8 border-2 border-danger/50 rounded-md bg-background checked:bg-danger checked:border-danger transition-crisp"
                  checked={hasConfirmed}
                  onChange={(e) => setHasConfirmed(e.target.checked)}
                />
                <span className="text-sm font-bold uppercase tracking-widest text-danger">I confirm and take control</span>
              </label>
            </div>

            <Button onClick={handleNextStep} disabled={!hasConfirmed} variant="destructive" className="w-full h-14 text-step-1 font-bold">
              Unlock Final Action <Unlock className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <ApplicationAssistant missingDocs={missingDocs} />
          </div>
        )}

      </div>
    </div>
  )
}
