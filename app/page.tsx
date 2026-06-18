"use client"

import { Sparkles, ArrowRight, ShieldAlert, FileText, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ClearPathAmbientBackground } from "@/components/layout/clearpath-ambient-background"
import { Suspense } from "react"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans selection:bg-primary/30">
      
      {/* Background Ambience */}
      <Suspense fallback={null}>
        <ClearPathAmbientBackground variant="landing" />
      </Suspense>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-glass-surface backdrop-blur-3xl border-b border-glass-border transition-all duration-400">
        <div className="container-wide h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[12px] bg-foreground flex items-center justify-center transition-all duration-400 group-hover:bg-primary shadow-elevation-2">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold text-[18px] tracking-[-0.02em]">ClearPath OS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[15px] font-medium text-muted-foreground hover:text-foreground transition-all duration-150">Sign In</Link>
            <Link href="/register">
              <Button size="sm">Try Live Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-[160px] pb-[96px] relative z-10 flex flex-col gap-[160px]">
        
        {/* 1. HERO SECTION */}
        <section className="container-wide text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[999px] bg-primary/10 border border-primary/20 mb-8 text-[13px] font-medium tracking-[0.01em] text-primary backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> USAII Global AI Hackathon Submission
            </div>
            <h1 className="text-hero text-balance text-foreground mb-6">
              You were never bad at applications.<br />
              <span className="text-muted-foreground">The system was designed to be impossible.</span>
            </h1>
            <p className="text-step-2 text-muted-foreground text-balance max-w-[800px] mb-12">
              ClearPath OS translates bureaucratic jargon into a personalized action plan. 
              We turn 40-page PDFs into a 60-second execution timeline.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-[16px]">
                  Launch Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#rubric" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full text-[16px]">
                  Read Judge Rubric
                </Button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* 2. STORYTELLING FLOW: PROBLEM -> SOLUTION -> IMPACT */}
        <section className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Problem */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="liquid-glass-card p-8 flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-[16px] bg-danger/10 border border-danger/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-danger" />
              </div>
              <div>
                <h3 className="text-step-3 mb-2">The Problem</h3>
                <p className="text-step-1 text-muted-foreground">
                  Students face immense cognitive overload reading 40-page PDFs filled with dense legal jargon. 
                  They abandon life-changing opportunities out of fear of making a mistake.
                </p>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="liquid-glass-card p-8 flex flex-col gap-6 md:scale-105 z-10 shadow-elevation-3 border-primary/30"
            >
              <div className="w-12 h-12 rounded-[16px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-step-3 mb-2">The Solution</h3>
                <p className="text-step-1 text-muted-foreground">
                  Our determinisic Readiness Engine instantly extracts requirements, builds a missing documents checklist, and maps out a timeline—all backed by exact quotes from the source document.
                </p>
              </div>
            </motion.div>

            {/* Impact */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="liquid-glass-card p-8 flex flex-col gap-6"
            >
              <div className="w-12 h-12 rounded-[16px] bg-success/10 border border-success/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-step-3 mb-2">The Impact</h3>
                <p className="text-step-1 text-muted-foreground">
                  What used to take 45 minutes of stressful reading now takes 60 seconds of actionable execution. We drastically reduce friction and prevent opportunity loss.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 3. RESPONSIBLE AI */}
        <section id="rubric" className="container-standard">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="decision-surface p-[64px] flex flex-col items-center text-center"
          >
            <ShieldAlert className="w-16 h-16 text-primary mb-8" />
            <h2 className="text-step-4 mb-6">Built on Responsible AI</h2>
            <p className="text-step-2 text-muted-foreground max-w-[700px] mb-12">
              AI hallucinations in bureaucratic applications are dangerous. ClearPath OS enforces a rigid <strong>Evidence Layer</strong> and mandates a <strong>Human-in-the-Loop</strong> review before any application is finalized.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
              <div className="p-6 bg-background/50 rounded-[16px] border border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-semibold text-[16px]">Strict JSON Extraction</h4>
                </div>
                <p className="text-[14px] text-muted-foreground">No open-ended chat. We force Gemini to output deterministic structured data.</p>
              </div>
              <div className="p-6 bg-background/50 rounded-[16px] border border-glass-border">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-semibold text-[16px]">Quote-Backed Claims</h4>
                </div>
                <p className="text-[14px] text-muted-foreground">Every AI claim includes an exact verbatim quote from the original PDF.</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. CTA */}
        <section className="container-wide text-center">
          <h2 className="text-step-5 mb-8">Experience True Clarity.</h2>
          <Link href="/register">
            <Button size="lg" className="h-[64px] px-[48px] text-[18px]">
              Launch Live Demo
            </Button>
          </Link>
        </section>

      </main>
    </div>
  )
}
