import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TrustBadge } from "@/components/ui/trust-badge"

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
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-24 relative z-10">
        
        {/* Hero Section */}
        <div className="container-reading text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border mb-8 text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
            ClearPath OS 2.0 Early Access
          </div>
          <h1 className="text-step-5 mb-6 text-balance text-foreground">
            You were never bad at applications.<br />
            <span className="text-muted-foreground">The documents were impossible to understand.</span>
          </h1>
          <p className="text-step-2 text-muted-foreground text-balance mx-auto mb-10 leading-relaxed">
            Upload any scholarship notice, circular, or government document.<br />
            ClearPath converts confusion into an action plan in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-step-1 rounded-md w-full sm:w-auto shadow-elevation-1 hover:shadow-elevation-2 transition-crisp")}>
              Start for free <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Trust Section */}
        <div className="container-standard mb-32 border-y border-border py-12 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrustBadge 
              variant="privacy" 
              title="AES-256 Encryption" 
              description="Your documents are encrypted at rest and in transit."
            />
            <TrustBadge 
              variant="guarantee" 
              title="100% Deterministic Extraction" 
              description="No hallucinations. Every claim is cited directly."
            />
            <TrustBadge 
              variant="security" 
              title="Zero-Retention Policy" 
              description="We delete your source documents immediately after processing."
            />
          </div>
        </div>

        {/* Feature Narrative */}
        <div className="container-standard">
          <div className="mb-16">
            <h2 className="text-step-4 mb-4">From confusion to clarity.</h2>
            <p className="text-step-1 text-muted-foreground max-w-[60ch]">
              We studied how students miss deadlines. The problem isn&apos;t a lack of opportunities, it&apos;s the cognitive overload of bureaucratic language.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="decision-surface p-8 border-t-2 border-t-foreground">
              <div className="text-step-0 font-mono text-muted-foreground mb-4">THE OLD WAY</div>
              <h3 className="text-step-3 mb-4">Cognitive Overload</h3>
              <ul className="space-y-3 text-step-1 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-danger mt-1">×</span> Reading 40 pages of legal jargon</li>
                <li className="flex items-start gap-2"><span className="text-danger mt-1">×</span> Missing hidden document requirements</li>
                <li className="flex items-start gap-2"><span className="text-danger mt-1">×</span> Discovering deadlines a day too late</li>
              </ul>
            </div>

            <div className="decision-surface p-8 border-t-2 border-t-success bg-success/5">
              <div className="text-step-0 font-mono text-success mb-4">CLEARPATH OS</div>
              <h3 className="text-step-3 mb-4 text-foreground">Structured Intelligence</h3>
              <ul className="space-y-3 text-step-1 text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-1 shrink-0" /> AI Stress Translator decodes jargon instantly</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-1 shrink-0" /> Missing Document Detection warns you upfront</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-1 shrink-0" /> Smart Action Timeline guarantees completion</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
