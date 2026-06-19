import { Sparkles, ArrowRight, ShieldCheck, FileSearch, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClearPathAmbientBackground } from "@/components/layout/clearpath-ambient-background"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans selection:bg-primary/30">
      
      <Suspense fallback={null}>
        <ClearPathAmbientBackground variant="landing" />
      </Suspense>

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 w-full z-50 border-b border-glass-border bg-glass-surface/30" style={{ backdropFilter: 'blur(24px)' }}>
        <div className="container-wide h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[12px] bg-primary/20 flex items-center justify-center transition-spring group-hover:scale-105 border border-primary/30 shadow-[0_0_20px_rgba(149,127,239,0.2)]">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-[18px] tracking-[-0.01em] text-foreground">ClearPath OS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[15px] font-medium text-muted-foreground hover:text-foreground transition-crisp">Sign In</Link>
            <Link href="/register">
              <button className="btn-twilight h-10 px-6 rounded-full text-[14px] font-medium">Try Live Demo</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO: INTELLIGENCE COMMAND CENTER ─── */}
      <main className="flex-1 pt-[160px] pb-[100px] relative z-10 flex flex-col gap-[140px]">
        
        <section className="container-wide text-center">
          <div className="flex flex-col items-center animate-fadeInUp">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-10 text-[13px] font-medium tracking-[0.02em] text-primary shadow-twilight-glow">
              <Sparkles className="w-4 h-4" /> Dreamy Twilight Intelligence
            </div>
            
            {/* Headline */}
            <h1 className="text-display text-foreground mb-6 max-w-[900px] leading-[1.05]">
              You were never bad at applications.
              <br />
              <span className="text-muted-foreground">The system was.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-[18px] md:text-[20px] text-muted-foreground text-balance max-w-[700px] mb-12 leading-[1.7] font-normal">
              ClearPath OS converts bureaucratic complexity into executable action. 
              40-page PDFs become 60-second timelines.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="btn-twilight w-full text-[16px] h-14 px-10 rounded-[20px] flex items-center justify-center gap-2 font-medium">
                  Launch Live Demo <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="#architecture" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-[16px] h-14 px-10 rounded-[20px] border-glass-border bg-glass-surface hover:bg-glass-layer font-medium">
                  View Architecture
                </Button>
              </a>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center gap-10 text-[14px] text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                <span>60s Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span>Evidence-Backed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Human-Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PROBLEM → SOLUTION → IMPACT ─── */}
        <section className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Problem */}
            <div className="liquid-glass-card p-8 flex flex-col gap-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-[16px] bg-danger/10 border border-danger/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,138,0.2)]">
                <FileSearch className="w-6 h-6 text-danger" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-3">The Problem</h3>
                <p className="text-body-text">
                  Students face cognitive overload reading dense PDFs filled with legal jargon. 
                  They abandon life-changing opportunities out of confusion.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="liquid-glass-card p-8 flex flex-col gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-[16px] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-twilight-glow">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-3">The Solution</h3>
                <p className="text-body-text">
                  Our deterministic Readiness Engine extracts requirements, builds checklists, and maps timelines — all cited from the source.
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="liquid-glass-card p-8 flex flex-col gap-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-[16px] bg-success/10 border border-success/20 flex items-center justify-center shadow-[0_0_15px_rgba(114,241,184,0.2)]">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-3">The Impact</h3>
                <p className="text-body-text">
                  45 minutes of stressful reading becomes 60 seconds of actionable execution. We eliminate friction and prevent opportunity loss.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RESPONSIBLE AI ─── */}
        <section id="architecture" className="container-standard">
          <div className="liquid-glass-card p-12 md:p-20 flex flex-col items-center text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <ShieldCheck className="w-16 h-16 text-primary mb-8 drop-shadow-[0_0_15px_rgba(149,127,239,0.5)]" />
            <h2 className="text-section-title text-foreground mb-5">Built on Responsible AI</h2>
            <p className="text-body-text text-center max-w-[650px] mb-12">
              AI hallucinations in bureaucratic applications are dangerous. ClearPath OS enforces a rigid Evidence Layer and mandates Human-in-the-Loop review.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
              <div className="p-6 rounded-[20px] bg-glass-surface border border-glass-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-medium text-[16px] text-foreground">Strict JSON Extraction</h4>
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed">No open-ended chat. Gemini outputs deterministic structured data only.</p>
              </div>
              <div className="p-6 rounded-[20px] bg-glass-surface border border-glass-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-medium text-[16px] text-foreground">Quote-Backed Claims</h4>
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed">Every AI claim includes an exact verbatim quote from the original document.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="container-wide text-center pb-10">
          <h2 className="text-hero-title text-foreground mb-6">Experience True Clarity.</h2>
          <p className="text-body-text text-center mx-auto mb-10">
            Confusion → Clarity → Action. In under 60 seconds.
          </p>
          <Link href="/register">
            <button className="btn-twilight h-16 px-14 rounded-[24px] text-[18px] font-medium shadow-twilight-glow">
              Launch Live Demo
            </button>
          </Link>
        </section>

      </main>
    </div>
  )
}
