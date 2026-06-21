
import { ChevronRight, Cpu, ShieldAlert, Zap, Globe, FileText, LayoutDashboard, Target } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-24 flex flex-col gap-24">
        
        {/* Section 1: Why ClearPath OS */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-12 animate-fadeInUp">
          <div className="w-24 h-24 mb-8 rounded-full bg-primary/20 border border-primary/30 p-2 overflow-hidden shadow-twilight-glow flex items-center justify-center animate-breathe">
             <Image src="/icon-192x192.png" alt="ClearPath OS Logo" width={80} height={80} className="object-contain drop-shadow-[0_0_10px_rgba(113,97,239,0.8)]" priority />
          </div>
          <h1 className="text-display text-foreground font-semibold tracking-tight mb-6">
            Why ClearPath OS
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            ClearPath OS converts educational notices, scholarships, circulars, and government opportunities into personalized action plans in under 60 seconds.
          </p>
          <Link href="/dashboard" className="btn-twilight px-8 h-12 flex items-center justify-center rounded-full text-[15px] font-medium shadow-[0_0_20px_rgba(149,127,239,0.3)] gap-2">
            Open Workspace <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Section 2: How It Works */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The autonomous execution pipeline transforms raw data into executable tasks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cinematic-glass-card p-8 rounded-[24px]">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">1. Upload & Extract</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Simply upload any PDF circular, notice, or screenshot. The vision engine extracts critical context, deadlines, and eligibility criteria.</p>
            </div>
            <div className="cinematic-glass-card p-8 rounded-[24px]">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-6 border border-warning/20">
                <Cpu className="w-5 h-5 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">2. Analyze & Validate</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">The Knowledge Engine cross-references your profile to calculate an exact Readiness Score and validate evidence.</p>
            </div>
            <div className="cinematic-glass-card p-8 rounded-[24px]">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/20">
                <Target className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">3. Execute Plan</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">A step-by-step checklist is generated in your Execution Layer. Follow the tasks, attach documents, and submit on time.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Core Features */}
        <section className="flex flex-col gap-12">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight text-center">Core Subsystems</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Opportunity Intelligence', 'Readiness Scoring', 'Document Extraction', 'AI Advisor', 'Task Planning', 'Evidence Validation', 'Calendar Sync', 'Voice Assistant'].map((feature, i) => (
              <div key={i} className="bg-glass-surface border border-glass-border p-4 rounded-[16px] flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Privacy */}
        <section className="cinematic-glass-card p-12 rounded-[32px] flex flex-col md:flex-row items-center gap-12 border-primary/30 shadow-[0_0_40px_rgba(149,127,239,0.1)]">
          <div className="w-24 h-24 shrink-0 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
            <ShieldAlert className="w-10 h-10 text-primary" />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-foreground">Zero-Knowledge Security Enclave</h2>
            <p className="text-muted-foreground">
              Your data is yours. ClearPath OS enforces strict user-owned API key isolation. Keys are encrypted at rest using AES-256-GCM. We never train models on your documents, and we never sell your data.
            </p>
          </div>
        </section>

        {/* Section 5: FAQ */}
        <section className="flex flex-col gap-12">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">What documents are supported?</h3>
              <p className="text-[14px] text-muted-foreground">We support PDFs, JPEGs, PNGs, and direct text inputs for scholarships, grants, visas, and school notices.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">How does readiness work?</h3>
              <p className="text-[14px] text-muted-foreground">The Readiness Engine cross-references the extracted requirements with your uploaded documents to calculate a deterministic score.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">Can I use my own OpenAI key?</h3>
              <p className="text-[14px] text-muted-foreground">Yes. Connect your own API keys in the Intelligence Providers tab for unlimited, unthrottled access.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">Can I use Gemini?</h3>
              <p className="text-[14px] text-muted-foreground">Yes, Gemini 1.5 Pro is the default reasoning engine for high-context opportunity extraction.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">How many free analyses do I get?</h3>
              <p className="text-[14px] text-muted-foreground">Free tier users receive 3 full opportunity analyses to test the platform before connecting their own API keys.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">How are deadlines detected?</h3>
              <p className="text-[14px] text-muted-foreground">Our NLP pipeline scans for temporal markers, relative dates, and explicit deadlines, converting them to your local timezone automatically.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Contact */}
        <section className="flex flex-col items-center gap-6 border-t border-glass-border pt-16">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">System Contact</h2>
          <div className="flex items-center gap-6">
            <a href="mailto:support@clearpath.os" className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">Support</a>
            <a href="#" className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">Feedback</a>
            <a href="#" className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">Bug Reports</a>
          </div>
        </section>

      </main>
    </div>
  )
}
