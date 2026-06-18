import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadWidget } from "@/components/opportunities/upload-widget"
import { ShieldCheck, FileText, Zap } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 lg:p-12">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-thin mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">System Online & Ready</span>
        </div>
        
        <h1 className="text-hero mb-6 text-balance">
          Understand Any Scholarship, Notice, Internship or Scheme in <span className="text-primary">Seconds</span>
        </h1>
        
        <p className="text-section text-muted-foreground text-balance mx-auto max-w-2xl">
          Upload a PDF, image, screenshot or website. We tell you exactly what to do next.
        </p>
      </div>

      {/* Upload Widget Area */}
      <div className="w-full max-w-2xl relative z-20 mb-16">
        <UploadWidget />
      </div>

      {/* Trust & Examples Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full relative z-10">
        <div className="glass-thin p-6 rounded-apple-lg flex flex-col items-center text-center group hover:glass-regular transition-all spring-transition">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 spring-transition">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2 text-card-title">Supported Formats</h3>
          <p className="text-metadata text-balance">
            PDF circulars, PNG/JPG screenshots, or paste any website URL.
          </p>
        </div>

        <div className="glass-thin p-6 rounded-apple-lg flex flex-col items-center text-center group hover:glass-regular transition-all spring-transition">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 spring-transition">
            <Zap className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="font-semibold mb-2 text-card-title">Instant Analysis</h3>
          <p className="text-metadata text-balance">
            Powered by Gemini 2.5 Flash for lightning-fast, highly accurate extraction.
          </p>
        </div>

        <div className="glass-thin p-6 rounded-apple-lg flex flex-col items-center text-center group hover:glass-regular transition-all spring-transition">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 spring-transition">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold mb-2 text-card-title">Zero Hallucinations</h3>
          <p className="text-metadata text-balance">
            Strictly grounded in your document. We never invent deadlines.
          </p>
        </div>
      </div>

    </div>
  )
}
