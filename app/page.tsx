import { Sparkles, ArrowRight, ShieldCheck, FileSearch, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClearPathAmbientBackground } from "@/components/layout/clearpath-ambient-background"
import { Suspense } from "react"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans selection:bg-primary/30">
      
      <Suspense fallback={null}>
        <ClearPathAmbientBackground variant="landing" />
      </Suspense>

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-[#030712]/60" style={{ backdropFilter: 'blur(12px)' }}>
        <div className="container-wide h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-[10px] bg-[#858AE3] flex items-center justify-center transition-spring group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-[#030712]" />
            </div>
            <span className="font-semibold text-[16px] tracking-[-0.01em] text-foreground">ClearPath OS</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-crisp">Sign In</Link>
            <Link href="/register">
              <Button size="sm" className="h-9 px-5 text-[13px]">Try Live Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <main className="flex-1 pt-[140px] pb-[80px] relative z-10 flex flex-col gap-[120px]">
        
        <section className="container-wide text-center">
          <div className="flex flex-col items-center animate-fadeInUp">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#858AE3]/8 border border-[#858AE3]/15 mb-8 text-[12px] font-medium tracking-[0.02em] text-[#97DFFC]">
              <Sparkles className="w-3.5 h-3.5" /> USAII Global AI Hackathon 2026
            </div>
            
            {/* Headline */}
            <h1 className="text-display text-foreground mb-5 max-w-[800px]">
              You were never bad at applications.
              <br />
              <span className="text-muted-foreground">The system was.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-[17px] md:text-[19px] text-muted-foreground text-balance max-w-[640px] mb-10 leading-[1.7] font-normal">
              ClearPath OS converts bureaucratic complexity into executable action. 
              40-page PDFs become 60-second timelines.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-14">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-[15px] h-12 px-8">
                  Launch Live Demo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="#architecture" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full text-[15px] h-12 px-8">
                  View Architecture
                </Button>
              </a>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-[13px] text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#97DFFC]" />
                <span>60s Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#93CAF6]" />
                <span>Evidence-Backed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#8EB5F0]" />
                <span>Human-Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PROBLEM → SOLUTION → IMPACT ─── */}
        <section className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Problem */}
            <div className="liquid-glass-card p-7 flex flex-col gap-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-10 h-10 rounded-[12px] bg-[#7364D2]/10 border border-[#7364D2]/15 flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-[#7364D2]" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-2">The Problem</h3>
                <p className="text-body-text text-[14px]">
                  Students face cognitive overload reading dense PDFs filled with legal jargon. 
                  They abandon life-changing opportunities out of confusion.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="liquid-glass-card p-7 flex flex-col gap-5 border-[#858AE3]/20 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-10 h-10 rounded-[12px] bg-[#858AE3]/10 border border-[#858AE3]/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#858AE3]" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-2">The Solution</h3>
                <p className="text-body-text text-[14px]">
                  Our deterministic Readiness Engine extracts requirements, builds missing-document checklists, and maps timelines — all cited from the source.
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="liquid-glass-card p-7 flex flex-col gap-5 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="w-10 h-10 rounded-[12px] bg-[#97DFFC]/10 border border-[#97DFFC]/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#97DFFC]" />
              </div>
              <div>
                <h3 className="text-card-title text-foreground mb-2">The Impact</h3>
                <p className="text-body-text text-[14px]">
                  45 minutes of stressful reading becomes 60 seconds of actionable execution. We eliminate friction and prevent opportunity loss.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RESPONSIBLE AI ─── */}
        <section id="architecture" className="container-standard">
          <div className="decision-surface p-12 md:p-16 flex flex-col items-center text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <ShieldCheck className="w-12 h-12 text-[#858AE3] mb-6" />
            <h2 className="text-section-title text-foreground mb-4">Built on Responsible AI</h2>
            <p className="text-body-text text-center max-w-[600px] mb-10">
              AI hallucinations in bureaucratic applications are dangerous. ClearPath OS enforces a rigid Evidence Layer and mandates Human-in-the-Loop review.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full text-left">
              <div className="p-5 rounded-2xl border border-glass-border bg-[#071225]/60">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#93CAF6]" />
                  <h4 className="font-medium text-[15px] text-foreground">Strict JSON Extraction</h4>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">No open-ended chat. Gemini outputs deterministic structured data only.</p>
              </div>
              <div className="p-5 rounded-2xl border border-glass-border bg-[#071225]/60">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#93CAF6]" />
                  <h4 className="font-medium text-[15px] text-foreground">Quote-Backed Claims</h4>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">Every AI claim includes an exact verbatim quote from the original document.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="container-wide text-center">
          <h2 className="text-hero-title text-foreground mb-6">Experience True Clarity.</h2>
          <p className="text-body-text text-center mx-auto mb-8">
            Confusion → Clarity → Action. In under 60 seconds.
          </p>
          <Link href="/register">
            <Button size="lg" className="h-14 px-12 text-[16px]">
              Launch Live Demo
            </Button>
          </Link>
        </section>

      </main>
    </div>
  )
}
