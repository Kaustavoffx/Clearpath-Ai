import { FileText, Cpu, Activity, AlertTriangle, ListChecks, Target, ArrowDown } from 'lucide-react'

export function JudgeArchitectureFlow() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700 relative pb-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-warning/10 border border-warning/30 text-warning text-xs font-mono font-bold uppercase tracking-widest mb-6">
          USAII Global AI Hackathon
        </div>
        <h1 className="text-step-5 font-bold tracking-tighter mb-4">ClearPath OS Architecture</h1>
        <p className="text-step-1 text-muted-foreground">A deterministic pipeline converting bureaucratic friction into student action.</p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[50%] top-[40px] bottom-[40px] w-1 bg-border -translate-x-[50%] hidden md:block" />

        <div className="space-y-12">
          
          {/* Step 1: Confusing PDF */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end text-right pr-12 hidden md:block">
              <h3 className="text-step-2 font-bold mb-2">1. The Cognitive Barrier</h3>
              <p className="text-sm text-muted-foreground">Students face 40+ page government circulars full of legal jargon and hidden deadlines.</p>
            </div>
            <div className="w-20 h-20 bg-background border-4 border-muted rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-1 group-hover:border-foreground transition-crisp">
              <FileText className="w-8 h-8 text-muted-foreground group-hover:text-foreground" />
            </div>
            <div className="md:w-1/2 md:pl-12 text-center md:text-left">
              <h3 className="text-step-2 font-bold mb-2 md:hidden">1. The Cognitive Barrier</h3>
              <div className="bg-muted/30 p-4 rounded-lg border border-border inline-block text-left w-full max-w-[300px]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Input</div>
                <div className="font-mono text-xs opacity-70 leading-relaxed">Raw Unstructured PDF</div>
              </div>
            </div>
            {/* Mobile Arrow */}
            <ArrowDown className="w-6 h-6 text-border md:hidden" />
          </div>

          {/* Step 2: Gemini Analysis */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end md:pr-12 text-center md:text-right order-3 md:order-1">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 inline-block text-left md:text-right w-full max-w-[300px]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Processing Node</div>
                <div className="font-mono text-xs text-primary/80 leading-relaxed">Gemini 2.5 Flash API<br/>+ Zod Strict Schema</div>
              </div>
            </div>
            <div className="w-20 h-20 bg-background border-4 border-primary/30 rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-1 group-hover:border-primary transition-crisp order-1 md:order-2">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
            <div className="md:w-1/2 md:pl-12 text-center md:text-left order-2 md:order-3">
              <h3 className="text-step-2 font-bold mb-2">2. Deterministic AI Extraction</h3>
              <p className="text-sm text-muted-foreground">The AI is forced to output a strict JSON array. It must provide exact verbatim quotes to prevent hallucinations.</p>
            </div>
            <ArrowDown className="w-6 h-6 text-border md:hidden order-4" />
          </div>

          {/* Step 3: Readiness Engine */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end text-right pr-12 hidden md:block">
              <h3 className="text-step-2 font-bold mb-2">3. Mathematical Readiness Engine</h3>
              <p className="text-sm text-muted-foreground">The frontend overrides the AI with a deterministic formula: (Completed / Total) = Score.</p>
            </div>
            <div className="w-20 h-20 bg-background border-4 border-success/30 rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-1 group-hover:border-success transition-crisp">
              <Activity className="w-8 h-8 text-success" />
            </div>
            <div className="md:w-1/2 md:pl-12 text-center md:text-left">
              <h3 className="text-step-2 font-bold mb-2 md:hidden">3. Mathematical Readiness Engine</h3>
              <div className="bg-success/5 p-4 rounded-lg border border-success/20 inline-block text-left w-full max-w-[300px]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-success mb-2">Frontend Logic</div>
                <div className="font-mono text-xs text-success/80 leading-relaxed">score = Math.round((2 / missing.length) * 100)</div>
              </div>
            </div>
            <ArrowDown className="w-6 h-6 text-border md:hidden" />
          </div>

          {/* Step 4: Missing Documents */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
             <div className="md:w-1/2 flex justify-end md:pr-12 text-center md:text-right order-3 md:order-1">
              <div className="bg-warning/5 p-4 rounded-lg border border-warning/20 inline-block text-left md:text-right w-full max-w-[300px]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-warning mb-2">Safety Checkpoint</div>
                <div className="font-mono text-xs text-warning/80 leading-relaxed">Human-in-the-Loop required to proceed</div>
              </div>
            </div>
            <div className="w-20 h-20 bg-background border-4 border-warning/30 rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-1 group-hover:border-warning transition-crisp order-1 md:order-2">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <div className="md:w-1/2 md:pl-12 text-center md:text-left order-2 md:order-3">
              <h3 className="text-step-2 font-bold mb-2">4. Missing Document Detection</h3>
              <p className="text-sm text-muted-foreground">Students are explicitly warned about what they lack before they start the process.</p>
            </div>
            <ArrowDown className="w-6 h-6 text-border md:hidden order-4" />
          </div>

          {/* Step 5: Action Plan */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
            <div className="md:w-1/2 flex justify-end text-right pr-12 hidden md:block">
              <h3 className="text-step-2 font-bold mb-2">5. Sequenced Action Plan</h3>
              <p className="text-sm text-muted-foreground">The system generates a chronological, step-by-step checklist to guarantee completion.</p>
            </div>
            <div className="w-20 h-20 bg-background border-4 border-foreground/30 rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-1 group-hover:border-foreground transition-crisp">
              <ListChecks className="w-8 h-8 text-foreground" />
            </div>
            <div className="md:w-1/2 md:pl-12 text-center md:text-left">
              <h3 className="text-step-2 font-bold mb-2 md:hidden">5. Sequenced Action Plan</h3>
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10 inline-block text-left w-full max-w-[300px]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-foreground mb-2">Output UI</div>
                <div className="font-mono text-xs text-foreground/80 leading-relaxed">Linear Decision Pipeline Component</div>
              </div>
            </div>
            <ArrowDown className="w-6 h-6 text-border md:hidden" />
          </div>

          {/* Step 6: Success */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 group">
             <div className="md:w-1/2 flex justify-end md:pr-12 text-center md:text-right order-3 md:order-1">
              <div className="bg-background p-4 rounded-lg border-2 border-success shadow-elevation-2 inline-block text-left md:text-right w-full max-w-[300px]">
                <div className="text-[10px] uppercase tracking-widest font-bold text-success mb-2">Impact Delivered</div>
                <div className="font-mono text-sm font-bold text-foreground leading-relaxed">Application Successfully Submitted</div>
              </div>
            </div>
            <div className="w-24 h-24 bg-success border-4 border-background rounded-full flex items-center justify-center shrink-0 z-10 shadow-elevation-2">
              <Target className="w-10 h-10 text-success-foreground" />
            </div>
            <div className="md:w-1/2 md:pl-12 text-center md:text-left order-2 md:order-3">
              <h3 className="text-step-3 font-bold mb-2 text-success">6. Final Student Success</h3>
              <p className="text-sm text-muted-foreground">The student claims their scholarship or support program, reducing systemic opportunity loss.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
