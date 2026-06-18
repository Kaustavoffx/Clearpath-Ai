import { Sparkles, ShieldCheck, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* Background ambient meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-thin z-50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-apple-sm bg-primary flex items-center justify-center shadow-apple-sm">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">ClearPath OS</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          <Link href="/register" className={cn(buttonVariants(), "rounded-apple-md font-medium shadow-apple-sm")}>
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-thin mb-8 text-sm font-medium uppercase tracking-wider text-primary border border-primary/20">
            <Heart className="w-4 h-4" /> Our Mission
          </div>
          <h1 className="text-hero mb-8 text-balance">
            Decoding opportunity for every student.
          </h1>
          <p className="text-section text-muted-foreground text-balance mx-auto max-w-3xl">
            We built ClearPath OS because we believe a student&apos;s potential shouldn&apos;t be limited by their ability to decode bureaucratic PDFs.
          </p>
        </div>

        {/* Stories Section */}
        <div className="grid gap-16 md:gap-32 mb-32">
          
          {/* Story 1: The Problem (Student) */}
          <div className="flex flex-col md:flex-row items-center gap-12 group">
            <div className="w-full md:w-1/2">
              <div className="glass-thick rounded-apple-xl p-2 shadow-apple-lg border border-apple-glass-highlight rotate-[-2deg] group-hover:rotate-0 transition-all duration-700">
                <div className="bg-background/80 rounded-apple-lg p-8 h-full border border-apple-glass-border">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                    <span className="text-xl">📄</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">The Student&apos;s Dilemma</h3>
                  <p className="text-muted-foreground leading-relaxed italic mb-4">
                    &quot;I found a government scholarship that could pay for my entire first year. But the circular was 40 pages of legal jargon. I missed one unlisted addendum requirement regarding an income certificate format. My application was rejected.&quot;
                  </p>
                  <p className="font-medium text-sm text-rose-500">— Anjali M., 12th Grade</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">The invisible barrier.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Millions of dollars in scholarships and thousands of opportunities go unclaimed every year. Not for lack of ambition, but because the onboarding process—reading dense, complex circulars—is fundamentally broken for teenagers.
              </p>
            </div>
          </div>

          {/* Story 2: The Solution (Judge/System) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 group">
            <div className="w-full md:w-1/2">
              <div className="glass-thick rounded-apple-xl p-2 shadow-apple-lg border border-apple-glass-highlight rotate-[2deg] group-hover:rotate-0 transition-all duration-700">
                <div className="bg-background/80 rounded-apple-lg p-8 h-full border border-apple-glass-border">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">The Evaluator&apos;s Perspective</h3>
                  <p className="text-muted-foreground leading-relaxed italic mb-4">
                    &quot;We don&apos;t want to reject students. But when we review 10,000 applications, if a form is missing or a date is missed, the system auto-rejects. We need students to submit perfect applications.&quot;
                  </p>
                  <p className="font-medium text-sm text-emerald-500">— Scholarship Board Director</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Creating perfect alignment.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ClearPath OS acts as a translation layer. We take the unforgiving requirements of institutions and translate them into a personalized, impossible-to-fail action plan for the student.
              </p>
            </div>
          </div>

        </div>

        {/* Call to action */}
        <div className="glass-regular rounded-apple-xl p-12 text-center relative overflow-hidden border border-apple-glass-border shadow-apple-lg">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-blue-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Stop reading circulars.<br/>Start winning opportunities.</h2>
            <Link href="/register" className={cn(buttonVariants(), "h-14 px-8 text-lg rounded-apple-lg shadow-apple-md spring-active")}>
              Join ClearPath OS Today <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
