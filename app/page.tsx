import { Sparkles, ArrowRight, CheckCircle2, FileWarning, ShieldAlert, Cpu, Target, Award, Bug, X } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-crisp">
        <div className="container-standard h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center transition-crisp group-hover:bg-primary">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-step-1 tracking-tight">ClearPath OS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-step-0 font-medium hover:text-primary transition-crisp">Sign In</Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "rounded-md font-medium px-4")}>
              Try Live Demo
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-24 relative z-10">
        
        {/* 1. HERO SECTION */}
        <section className="container-reading text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 mb-8 text-[12px] font-mono uppercase tracking-widest text-warning font-bold shadow-elevation-1">
            USAII Global AI Hackathon Submission
          </div>
          <h1 className="text-[4rem] leading-[1.1] tracking-tighter mb-6 text-balance text-foreground font-bold">
            You were never bad at applications.<br />
            <span className="text-muted-foreground">The documents were impossible to understand.</span>
          </h1>
          <p className="text-step-2 text-muted-foreground text-balance mx-auto mb-10 leading-relaxed max-w-[800px]">
            ClearPath OS translates 40-page bureaucratic PDFs into a 60-second action plan, ensuring students never miss life-changing opportunities due to cognitive overload.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-step-1 font-bold rounded-md w-full sm:w-auto shadow-elevation-2 hover:shadow-elevation-3 transition-crisp")}>
              Launch Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#rubric" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-step-1 font-bold rounded-md w-full sm:w-auto")}>
              Read Judge Rubric
            </a>
          </div>
        </section>

        {/* 2. THE 15-SECOND PITCH (WHO, WHAT, WHY AI, IMPACT) */}
        <section className="container-standard mb-32 border-y border-border py-12 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6">
              <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> WHO</div>
              <h3 className="text-step-2 font-bold mb-2">High School Students</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Specifically targeting students facing dense scholarship or government circulars.</p>
            </div>
            <div className="p-6 border-l border-border/50">
              <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2"><FileWarning className="w-4 h-4" /> WHAT</div>
              <h3 className="text-step-2 font-bold mb-2">Crisis-to-Action</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Converts confusing jargon into a deterministic checklist and timeline.</p>
            </div>
            <div className="p-6 border-l border-border/50">
              <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2"><Cpu className="w-4 h-4" /> WHY AI</div>
              <h3 className="text-step-2 font-bold mb-2">Unstructured Parsing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Extracts dynamic schemas from PDFs that traditional regex cannot handle.</p>
            </div>
            <div className="p-6 border-l border-border/50">
              <div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2"><Award className="w-4 h-4" /> IMPACT</div>
              <h3 className="text-step-2 font-bold mb-2 text-success">45 mins → 60 secs</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Drastically reduces decision-time and prevents opportunity loss.</p>
            </div>
          </div>
        </section>

        {/* 3. THE PROBLEM & REAL EXAMPLE */}
        <section className="container-standard mb-32">
          <div className="mb-16 max-w-[800px]">
            <h2 className="text-step-4 mb-4 font-bold tracking-tight">The Problem: Cognitive Overload</h2>
            <p className="text-step-1 text-muted-foreground">
              We studied how students fail to access support systems. The problem isn&apos;t a lack of opportunities, it&apos;s the sheer friction of reading legal jargon under extreme stress.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="decision-surface p-8 border-t-2 border-t-danger bg-danger/5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-danger mb-4">The Real World (40-Page PDF)</div>
              <div className="font-mono text-[11px] text-muted-foreground opacity-70 p-4 bg-background rounded-md leading-relaxed">
                &quot;Pursuant to section 4(B) of the directive, applicants claiming eligibility under category 3 must furnish an attested copy of Annexure-II, executed no later than 15 days prior to the commencement of the quarter, failing which the scholarship tranche will be irrevocably forfeited.&quot;
              </div>
              <h3 className="text-step-2 mt-6 mb-2 font-bold">Result: Confusion & Paralysis</h3>
              <p className="text-step-0 text-muted-foreground">Students abandon the application out of fear of making a mistake.</p>
            </div>

            <div className="decision-surface p-8 border-t-2 border-t-success bg-success/5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-success mb-4">ClearPath OS Translation</div>
              <div className="p-4 bg-background rounded-md leading-relaxed border border-border shadow-elevation-1">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span className="text-step-0 font-medium">You need an Annexure-II document.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <span className="text-step-0 font-medium">It must be signed at least 15 days before the term starts.</span>
                </div>
              </div>
              <h3 className="text-step-2 mt-6 mb-2 font-bold">Result: Actionable Clarity</h3>
              <p className="text-step-0 text-muted-foreground">The student knows exactly what to do and when to do it.</p>
            </div>
          </div>
        </section>

        {/* 3.5 WHY NOT CHATGPT? */}
        <section className="container-standard mb-32">
          <div className="text-center mb-16">
            <h2 className="text-step-4 font-bold tracking-tight mb-4">&quot;Why not just use ChatGPT?&quot;</h2>
            <p className="text-step-1 text-muted-foreground max-w-[600px] mx-auto">
              Because generic chatbots don&apos;t solve bureaucratic friction. They just summarize text. We built a deterministic action pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {/* ChatGPT Column */}
            <div className="decision-surface p-8 border-t-2 border-t-muted bg-muted/10 opacity-70">
              <h3 className="text-step-2 font-bold mb-6 text-center text-muted-foreground">Standard Chatbots</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-step-0 text-muted-foreground">
                  <X className="w-5 h-5 shrink-0" /> Requires prompt engineering
                </li>
                <li className="flex items-center gap-3 text-step-0 text-muted-foreground">
                  <X className="w-5 h-5 shrink-0" /> Open-ended generic answers
                </li>
                <li className="flex items-center gap-3 text-step-0 text-muted-foreground">
                  <X className="w-5 h-5 shrink-0" /> No Readiness Score
                </li>
                <li className="flex items-center gap-3 text-step-0 text-muted-foreground">
                  <X className="w-5 h-5 shrink-0" /> No Evidence Matrix
                </li>
                <li className="flex items-center gap-3 text-step-0 text-muted-foreground">
                  <X className="w-5 h-5 shrink-0" /> No Action Execution Layer
                </li>
              </ul>
            </div>

            {/* ClearPath Column */}
            <div className="decision-surface p-8 border-t-2 border-t-primary shadow-elevation-2 relative">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-background text-[10px] font-bold uppercase tracking-widest rounded-full">
                Winner
              </div>
              <h3 className="text-step-2 font-bold mb-6 text-center text-primary">ClearPath OS</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-step-0 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Automatic deterministic extraction
                </li>
                <li className="flex items-center gap-3 text-step-0 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Mathematical Readiness Engine
                </li>
                <li className="flex items-center gap-3 text-step-0 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Missing Documents Detection
                </li>
                <li className="flex items-center gap-3 text-step-0 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Opportunity Loss Simulator
                </li>
                <li className="flex items-center gap-3 text-step-0 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Explicit Evidence Verification
                </li>
                <li className="flex items-center gap-3 text-step-0 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Student Action Timeline
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* 4. RESPONSIBLE AI (THE STAR FEATURE) */}
        <section className="container-standard mb-32">
          <div className="decision-surface p-12 border-2 border-foreground/10 bg-muted/20">
            <div className="flex items-center gap-4 mb-6">
              <ShieldAlert className="w-10 h-10 text-foreground" />
              <h2 className="text-step-4 font-bold tracking-tight">Built on Responsible AI</h2>
            </div>
            <p className="text-step-2 text-muted-foreground mb-12 max-w-[800px]">
              AI hallucinations in bureaucratic applications are dangerous. ClearPath OS implements a rigid <strong>Evidence Layer</strong> to guarantee trust.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-xl border border-border shadow-elevation-1">
                <h3 className="text-step-2 font-bold mb-3">Strict JSON Extraction</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We force Gemini 2.5 Flash to respond purely in a deterministic JSON schema. No open-ended chat, no conversational hallucinations.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border border-border shadow-elevation-1">
                <h3 className="text-step-2 font-bold mb-3">Quote-Backed Claims</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every claim the AI makes must include an exact verbatim quote from the source PDF. If it cannot find a quote, the UI visually flags it as &quot;Unverified.&quot;
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border border-border shadow-elevation-1">
                <h3 className="text-step-2 font-bold mb-3">Human-in-the-Loop</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Users cannot click &quot;Apply Now&quot; without explicitly checking a box confirming they have manually verified the AI&apos;s output against the original document.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. JUDGE RUBRIC COMPLIANCE */}
        <section id="rubric" className="container-standard mb-16">
          <div className="mb-12 border-b border-border pb-6 flex items-center gap-3">
            <Bug className="w-8 h-8 text-warning" />
            <h2 className="text-step-4 font-bold tracking-tight">Hackathon Rubric Mapping</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-warning mb-2">30% Weight</div>
              <h3 className="text-step-2 font-bold mb-3">Problem Understanding</h3>
              <p className="text-step-0 text-muted-foreground leading-relaxed">
                Directly targets the &quot;Help is Hard to Find&quot; crisis. It understands that friction is caused by cognitive overload and complex language, not lack of portals.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-warning mb-2">20% Weight</div>
              <h3 className="text-step-2 font-bold mb-3">AI Reasoning & Implementation</h3>
              <p className="text-step-0 text-muted-foreground leading-relaxed">
                Utilizes Gemini 2.5 Flash for advanced parsing. Features an autonomous intent orchestrator and zero-crash schema recovery architecture.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-warning mb-2">20% Weight</div>
              <h3 className="text-step-2 font-bold mb-3">Solution Design</h3>
              <p className="text-step-0 text-muted-foreground leading-relaxed">
                A massive UX overhaul turns a basic dashboard into a &quot;Student Decision OS&quot;, featuring deterministic Readiness Engines and Opportunity Loss Simulators.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-warning mb-2">10% Weight</div>
              <h3 className="text-step-2 font-bold mb-3">Trust & Responsible AI</h3>
              <p className="text-step-0 text-muted-foreground leading-relaxed">
                The strongest feature. Generates Risk Assessments and Confidence Scores for every claim, enforcing a strict Human-in-the-loop review step.
              </p>
            </div>
          </div>
        </section>

        <div className="container-standard text-center pt-24 border-t border-border">
          <h2 className="text-step-5 font-bold tracking-tighter mb-8">Ready to see it in action?</h2>
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-16 px-12 text-step-2 font-bold rounded-md shadow-elevation-2 hover:shadow-elevation-3 transition-crisp")}>
            Launch Live Demo
          </Link>
        </div>
      </main>
    </div>
  )
}
