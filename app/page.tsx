import { Sparkles, Brain, Target, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ReadinessRing } from "@/components/ui/readiness-ring"
import { StressTranslator } from "@/components/ui/stress-translator"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      
      {/* Background ambient meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-thin z-50 px-6 py-4 flex items-center justify-between border-b border-apple-glass-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-apple-sm bg-primary flex items-center justify-center shadow-apple-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">ClearPath OS</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          <Link href="/register" className={cn(buttonVariants(), "rounded-apple-md font-medium shadow-apple-sm")}>
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative z-10">
        
        {/* Hero */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-thin mb-8 text-sm font-medium uppercase tracking-wider text-primary border border-primary/20">
            <Zap className="w-4 h-4" /> The AI Decision Engine for Students
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8 text-balance leading-[1.1]">
            Stop reading circulars. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              Start winning opportunities.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mx-auto max-w-2xl mb-10 leading-relaxed">
            Upload any complex bureaucratic PDF, scholarship notice, or internship scheme. ClearPath OS acts as a psychological translator, turning confusion into guaranteed action plans.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg rounded-apple-lg shadow-apple-md spring-active w-full sm:w-auto")}>
              Try ClearPath OS <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Strictly grounded in your documents.
            </div>
          </div>
        </div>

        {/* Pipeline Section (Confusion -> Action) */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Operating System for Decisions</h2>
            <p className="text-muted-foreground">How we systematically eliminate bureaucratic friction.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-thick rounded-apple-xl p-8 border-t-4 border-rose-500 opacity-80">
              <div className="text-rose-500 mb-4 font-mono text-sm tracking-widest uppercase">01. Confusion</div>
              <h3 className="text-xl font-semibold mb-2">The 40-Page PDF</h3>
              <p className="text-sm text-muted-foreground">You receive a dense government circular full of legal jargon and hidden deadlines.</p>
            </div>
            
            <div className="glass-regular rounded-apple-xl p-8 border-t-4 border-amber-500 relative transform md:translate-y-4 shadow-apple-md">
              <div className="text-amber-500 mb-4 font-mono text-sm tracking-widest uppercase">02. Understanding</div>
              <h3 className="text-xl font-semibold mb-2">AI Stress Translator</h3>
              <p className="text-sm text-muted-foreground">We decode the jargon into plain English. You immediately know if it matters to you.</p>
            </div>
            
            <div className="glass-thin rounded-apple-xl p-8 border-t-4 border-blue-500 relative transform md:translate-y-8 shadow-apple-lg">
              <div className="text-blue-500 mb-4 font-mono text-sm tracking-widest uppercase">03. Readiness</div>
              <h3 className="text-xl font-semibold mb-2">Missing Docs Detection</h3>
              <p className="text-sm text-muted-foreground">We analyze your eligibility and cross-reference what documents you actually need.</p>
            </div>
            
            <div className="glass-thick bg-background/90 rounded-apple-xl p-8 border-t-4 border-emerald-500 relative transform md:translate-y-12 shadow-apple-xl">
              <div className="text-emerald-500 mb-4 font-mono text-sm tracking-widest uppercase">04. Action</div>
              <h3 className="text-xl font-semibold mb-2">Smart Timeline</h3>
              <p className="text-sm text-muted-foreground">A step-by-step Notion-like to-do list guarantees you never miss a submission window.</p>
            </div>
          </div>
        </div>

        {/* Interactive Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 mt-48">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
              Application Readiness Engine
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Know exactly where you stand. instantly.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Don&apos;t wait until the final submission page to realize you need a digitized income certificate from 2024. Our readiness engine calculates your probability of completion on day one.
            </p>
            <ul className="space-y-4">
              {["Personalized Eligibility Analysis", "Missing Documents Detection", "Opportunity Loss Simulator"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-thick rounded-apple-xl p-12 flex items-center justify-center shadow-apple-xl border border-apple-glass-highlight relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none rounded-xl" />
             <div className="flex flex-col items-center gap-6 relative z-10">
               <ReadinessRing score={75} size={200} strokeWidth={16} />
               <div className="glass-thin px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2">
                 <Target className="w-4 h-4 text-amber-500" /> 1 Missing Document Detected
               </div>
             </div>
          </div>
        </div>
        
        {/* Stress Translator Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 flex-col-reverse lg:flex-row-reverse">
          <div className="space-y-8 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              AI Stress Translator
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Bureaucracy decoded into peace of mind.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We process convoluted 40-page notices and extract the exact 3 sentences that matter to you. Designed specifically to reduce student anxiety.
            </p>
          </div>
          <div className="lg:order-1 relative">
            <StressTranslator 
              originalText="Applicants must furnish an Annexure-IV validated counter-signed affidavit alongside the sub-divisional magistrate's attestation strictly prior to the tertiary deadline window."
              simplifiedText="You need to get a specific form (Annexure-IV) signed by a local magistrate before the final deadline."
            />
          </div>
        </div>

      </main>
    </div>
  )
}
