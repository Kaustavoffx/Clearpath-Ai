'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, ArrowRight, Play, CheckCircle2, FileText, Zap, ShieldCheck, UserCheck, Activity } from 'lucide-react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Hero() {
  const { scrollY } = useScroll()
  
  // Parallax and scroll scale effects
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4])
  const panelY = useTransform(scrollY, [0, 500], [0, -40])
  const panelScale = useTransform(scrollY, [0, 500], [1, 1.05])

  const [pipelineState, setPipelineState] = useState(0)

  useEffect(() => {
    // Animate the pipeline checks sequentially
    const interval = setInterval(() => {
      setPipelineState(prev => (prev < 6 ? prev + 1 : prev))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const pipelineSteps = [
    "Reading Document",
    "Checking Eligibility",
    "Finding Deadline",
    "Detecting Missing Documents",
    "Building Action Plan",
    "Evidence Verification"
  ]

  return (
    <motion.section 
      style={{ scale: heroScale, opacity: heroOpacity }}
      className="relative min-h-[100vh] w-full flex items-center pt-[100px] overflow-hidden origin-top"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-[#7161EF] rounded-full blur-[120px] opacity-[0.05] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-[10%] w-[600px] h-[600px] bg-[#B79CED] rounded-full blur-[150px] opacity-[0.04] animate-breathe" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#957FEF] rounded-full blur-[200px] opacity-[0.03]" />
      </div>

      <div className="container-wide relative z-10 w-full h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* LEFT 55% */}
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
          
          {/* Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 text-[13px] font-semibold tracking-widest uppercase text-primary relative group cursor-default"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="w-4 h-4 animate-pulse" /> 
            <span className="relative z-10">Educational Intelligence Platform</span>
          </motion.div>

          {/* Primary Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[64px] sm:text-[72px] lg:text-[86px] leading-[1.05] font-bold tracking-[-0.04em] mb-8 group"
          >
            <span className="block text-foreground transition-all duration-700 group-hover:text-foreground/90">Every Opportunity</span>
            <span className="block text-foreground/80 transition-all duration-700 group-hover:text-foreground/70">Already Has</span>
            <span 
              className="block bg-clip-text text-transparent bg-gradient-to-r from-[#EFD9CE] via-[#DEC0F1] to-[#B79CED] transition-all duration-700 group-hover:brightness-110 group-hover:drop-shadow-[0_0_20px_rgba(222,192,241,0.3)]"
            >
              An Action Plan.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18px] lg:text-[20px] text-muted-foreground leading-[1.7] max-w-[600px] mb-10"
          >
            Most students lose opportunities because documents are confusing. <br className="hidden sm:block"/>
            <span className="text-foreground font-medium">ClearPath OS</span> transforms scholarships, government schemes, and school notices into personalized execution plans in under 60 seconds.
          </motion.p>

          {/* Trust Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center gap-5 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase mb-12"
          >
            <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4 text-warning" /> 60s Analysis</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success" /> Evidence-Backed</span>
            <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-primary" /> Human Verified</span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-danger" /> No Hallucinations</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#DEC0F1]" /> Profile Aware</span>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/register" className="w-full sm:w-auto group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#EFD9CE] via-[#DEC0F1] to-[#B79CED] rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500 group-hover:duration-200" />
              <button className="relative w-full sm:w-auto h-14 px-10 bg-primary text-primary-foreground text-[16px] font-semibold rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                Open Workspace <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            
            <a href="#architecture" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 bg-glass-surface border border-glass-border hover:bg-glass-layer text-foreground text-[16px] font-semibold rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-all group">
                <Play className="w-4 h-4 text-primary group-hover:text-[#DEC0F1] transition-colors" /> Explore Intelligence Layer
              </button>
            </a>
          </motion.div>
        </div>

        {/* RIGHT 45% - LIVE COMMAND CENTER PREVIEW */}
        <motion.div 
          style={{ y: panelY, scale: panelScale }}
          className="w-full lg:w-[45%] h-full flex items-center justify-center perspective-[2000px] pl-0 lg:pl-10"
        >
          <motion.div 
            initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: -5, rotateX: 5, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[500px] rounded-[32px] border border-glass-border/50 bg-[#071225]/60 backdrop-blur-3xl shadow-[0_20px_80px_rgba(113,97,239,0.15)] overflow-hidden flex flex-col group hover:border-[#957FEF]/50 transition-colors duration-500"
          >
            {/* Top Bar */}
            <div className="h-10 sm:h-12 border-b border-glass-border/50 flex items-center px-4 sm:px-6 gap-2 bg-black/20">
              <div className="w-3 h-3 rounded-full bg-danger/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
              <div className="ml-auto text-[11px] font-semibold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live Preview
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col gap-6 sm:gap-8">
              {/* Document Header */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-success mb-2">Document Detected</div>
                <div className="text-xl font-semibold text-foreground flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" /> State Merit Scholarship 2026
                </div>
              </div>

              {/* AI Pipeline */}
              <div className="space-y-4">
                {pipelineSteps.map((step, i) => {
                  const isActive = i === pipelineState
                  const isDone = i < pipelineState
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 shrink-0",
                        isDone ? "bg-success/20 text-success" : isActive ? "bg-primary/20 text-primary animate-pulse" : "bg-glass-surface border border-glass-border text-muted-foreground"
                      )}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                      <span className={cn(
                        "text-[14px] font-medium transition-colors duration-500",
                        isDone ? "text-foreground" : isActive ? "text-primary" : "text-muted-foreground"
                      )}>
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Data Panels */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: pipelineState >= 6 ? 1 : 0, y: pipelineState >= 6 ? 0 : 10 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                {/* Readiness Panel */}
                <div className="bg-glass-surface/50 border border-glass-border/50 rounded-[20px] p-5 flex flex-col group-hover:bg-glass-surface transition-colors">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Application Readiness</div>
                  <div className="text-3xl font-bold text-foreground mb-4">82%</div>
                  <div className="flex flex-col gap-1 text-[12px] font-medium text-muted-foreground">
                    <span className="flex justify-between">Completed: <span className="text-foreground">7</span></span>
                    <span className="flex justify-between">Missing: <span className="text-warning">2</span></span>
                    <span className="flex justify-between mt-2 pt-2 border-t border-glass-border/50">Est. Time: <span className="text-foreground">12 min</span></span>
                  </div>
                </div>

                {/* Next Action Panel */}
                <div className="bg-primary/5 border border-primary/20 rounded-[20px] p-5 flex flex-col justify-between group-hover:bg-primary/10 transition-colors">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Next Action Panel</div>
                    <div className="text-[15px] font-semibold text-foreground leading-tight">Upload Income Certificate</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[12px] font-medium">
                    <span className="text-muted-foreground">Expected Impact</span>
                    <span className="text-success bg-success/10 px-2 py-1 rounded-md">+18%</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
