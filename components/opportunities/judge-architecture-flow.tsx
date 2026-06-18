import { FileText, Cpu, Activity, AlertTriangle, ListChecks, Target, ArrowDown } from 'lucide-react'

export function JudgeArchitectureFlow() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700 relative pb-24">
      <div className="text-center mb-20">
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-[999px] bg-warning/10 border border-warning/30 text-warning text-[11px] font-mono font-bold uppercase tracking-widest mb-8 shadow-sm">
          USAII Global AI Hackathon
        </div>
        <h1 className="text-[56px] leading-[1.1] font-bold tracking-[-0.03em] mb-6 text-foreground">ClearPath OS Architecture</h1>
        <p className="text-[20px] text-muted-foreground leading-relaxed max-w-[600px] mx-auto">A deterministic pipeline converting bureaucratic friction into student action.</p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[50%] top-[60px] bottom-[60px] w-[2px] bg-glass-border -translate-x-[50%] hidden md:block" />

        <div className="space-y-16">
          
          {/* Step 1: Confusing PDF */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end text-right pr-14 hidden md:block">
              <h3 className="text-[20px] font-bold mb-3 text-foreground">1. The Cognitive Barrier</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">Students face 40+ page government circulars full of legal jargon and hidden deadlines.</p>
            </div>
            <div className="w-24 h-24 bg-glass-surface/50 border border-glass-border backdrop-blur-md rounded-[24px] flex items-center justify-center shrink-0 z-10 shadow-glass-card group-hover:border-foreground/30 group-hover:-translate-y-1 transition-spring">
              <FileText className="w-10 h-10 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="md:w-1/2 md:pl-14 text-center md:text-left">
              <h3 className="text-[20px] font-bold mb-3 md:hidden text-foreground">1. The Cognitive Barrier</h3>
              <div className="liquid-glass-card p-5 inline-block text-left w-full max-w-[320px]">
                <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Input</div>
                <div className="font-mono text-[13px] opacity-70 leading-relaxed text-foreground">Raw Unstructured PDF</div>
              </div>
            </div>
            {/* Mobile Arrow */}
            <ArrowDown className="w-6 h-6 text-glass-border md:hidden" />
          </div>

          {/* Step 2: Gemini Analysis */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end md:pr-14 text-center md:text-right order-3 md:order-1">
              <div className="liquid-glass-card p-5 border-primary/20 bg-primary/5 inline-block text-left md:text-right w-full max-w-[320px]">
                <div className="text-[11px] uppercase tracking-widest font-bold text-primary mb-3">Processing Node</div>
                <div className="font-mono text-[13px] text-primary/80 leading-relaxed">Gemini 2.5 Flash API<br/>+ Zod Strict Schema</div>
              </div>
            </div>
            <div className="w-24 h-24 bg-primary/10 border border-primary/20 backdrop-blur-md rounded-[24px] flex items-center justify-center shrink-0 z-10 shadow-glass-card group-hover:bg-primary/20 group-hover:-translate-y-1 transition-spring order-1 md:order-2">
              <Cpu className="w-10 h-10 text-primary" />
            </div>
            <div className="md:w-1/2 md:pl-14 text-center md:text-left order-2 md:order-3">
              <h3 className="text-[20px] font-bold mb-3 text-foreground">2. Deterministic AI Extraction</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">The AI is forced to output a strict JSON array. It must provide exact verbatim quotes to prevent hallucinations.</p>
            </div>
            <ArrowDown className="w-6 h-6 text-glass-border md:hidden order-4" />
          </div>

          {/* Step 3: Readiness Engine */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end text-right pr-14 hidden md:block">
              <h3 className="text-[20px] font-bold mb-3 text-foreground">3. Mathematical Readiness Engine</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">The frontend overrides the AI with a deterministic formula: (Completed / Total) = Score.</p>
            </div>
            <div className="w-24 h-24 bg-success/10 border border-success/20 backdrop-blur-md rounded-[24px] flex items-center justify-center shrink-0 z-10 shadow-glass-card group-hover:bg-success/20 group-hover:-translate-y-1 transition-spring">
              <Activity className="w-10 h-10 text-success" />
            </div>
            <div className="md:w-1/2 md:pl-14 text-center md:text-left">
              <h3 className="text-[20px] font-bold mb-3 md:hidden text-foreground">3. Mathematical Readiness Engine</h3>
              <div className="liquid-glass-card p-5 border-success/20 bg-success/5 inline-block text-left w-full max-w-[320px]">
                <div className="text-[11px] uppercase tracking-widest font-bold text-success mb-3">Frontend Logic</div>
                <div className="font-mono text-[13px] text-success/80 leading-relaxed">score = Math.round((2 / missing.length) * 100)</div>
              </div>
            </div>
            <ArrowDown className="w-6 h-6 text-glass-border md:hidden" />
          </div>

          {/* Step 4: Missing Documents */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
             <div className="md:w-1/2 flex justify-end md:pr-14 text-center md:text-right order-3 md:order-1">
              <div className="liquid-glass-card p-5 border-warning/20 bg-warning/5 inline-block text-left md:text-right w-full max-w-[320px]">
                <div className="text-[11px] uppercase tracking-widest font-bold text-warning mb-3">Safety Checkpoint</div>
                <div className="font-mono text-[13px] text-warning/80 leading-relaxed">Human-in-the-Loop required to proceed</div>
              </div>
            </div>
            <div className="w-24 h-24 bg-warning/10 border border-warning/20 backdrop-blur-md rounded-[24px] flex items-center justify-center shrink-0 z-10 shadow-glass-card group-hover:bg-warning/20 group-hover:-translate-y-1 transition-spring order-1 md:order-2">
              <AlertTriangle className="w-10 h-10 text-warning" />
            </div>
            <div className="md:w-1/2 md:pl-14 text-center md:text-left order-2 md:order-3">
              <h3 className="text-[20px] font-bold mb-3 text-foreground">4. Missing Document Detection</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">Students are explicitly warned about what they lack before they start the process.</p>
            </div>
            <ArrowDown className="w-6 h-6 text-glass-border md:hidden order-4" />
          </div>

          {/* Step 5: Action Plan */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end text-right pr-14 hidden md:block">
              <h3 className="text-[20px] font-bold mb-3 text-foreground">5. Sequenced Action Plan</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">The system generates a chronological, step-by-step checklist to guarantee completion.</p>
            </div>
            <div className="w-24 h-24 bg-glass-surface border border-glass-border backdrop-blur-md rounded-[24px] flex items-center justify-center shrink-0 z-10 shadow-glass-card group-hover:border-foreground/30 group-hover:-translate-y-1 transition-spring">
              <ListChecks className="w-10 h-10 text-foreground" />
            </div>
            <div className="md:w-1/2 md:pl-14 text-center md:text-left">
              <h3 className="text-[20px] font-bold mb-3 md:hidden text-foreground">5. Sequenced Action Plan</h3>
              <div className="liquid-glass-card p-5 inline-block text-left w-full max-w-[320px]">
                <div className="text-[11px] uppercase tracking-widest font-bold text-foreground mb-3">Output UI</div>
                <div className="font-mono text-[13px] text-foreground/80 leading-relaxed">Linear Decision Pipeline Component</div>
              </div>
            </div>
            <ArrowDown className="w-6 h-6 text-glass-border md:hidden" />
          </div>

          {/* Step 6: Success */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
             <div className="md:w-1/2 flex justify-end md:pr-14 text-center md:text-right order-3 md:order-1">
              <div className="liquid-glass-card p-6 border-2 border-success bg-success/10 shadow-glass-card inline-block text-left md:text-right w-full max-w-[320px]">
                <div className="text-[11px] uppercase tracking-widest font-bold text-success mb-3">Impact Delivered</div>
                <div className="font-mono text-[14px] font-bold text-foreground leading-relaxed">Application Successfully Submitted</div>
              </div>
            </div>
            <div className="w-28 h-28 bg-success border-4 border-background rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-2 relative">
              <div className="absolute inset-0 bg-success rounded-full blur-[20px] opacity-50" />
              <Target className="w-12 h-12 text-success-foreground relative z-10" />
            </div>
            <div className="md:w-1/2 md:pl-14 text-center md:text-left order-2 md:order-3">
              <h3 className="text-[24px] font-bold mb-3 text-success">6. Final Student Success</h3>
              <p className="text-[16px] leading-relaxed text-muted-foreground">The student claims their scholarship or support program, reducing systemic opportunity loss.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
