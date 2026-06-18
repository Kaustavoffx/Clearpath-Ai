import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadWidget } from "@/components/opportunities/upload-widget"
import { ShieldCheck, Command, FolderArchive } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col p-6 lg:p-12 max-w-7xl mx-auto mt-16">
      
      <div className="mb-12 border-b border-apple-glass-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Command className="w-8 h-8 text-primary" /> Command Center
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ingest documents, generate action plans, and track your active opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Upload & Processing Engine */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-thick rounded-apple-xl p-8 border border-apple-glass-highlight shadow-apple-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h2 className="text-xl font-semibold mb-6">Decision Engine</h2>
            <UploadWidget />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-thin rounded-apple-lg p-6 border-l-4 border-l-emerald-500 hover:glass-regular transition-all spring-transition group">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Evidence-Based Analysis
              </h3>
              <p className="text-sm text-muted-foreground">Every deadline and requirement extracted is strictly cited back to the original source text.</p>
            </div>
            <div className="glass-thin rounded-apple-lg p-6 border-l-4 border-l-amber-500 hover:glass-regular transition-all spring-transition group">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-amber-500" /> Auto-Archival
              </h3>
              <p className="text-sm text-muted-foreground">Passed deadlines are automatically archived to keep your command center clutter-free.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Intelligence */}
        <div className="space-y-6">
          <div className="glass-regular rounded-apple-lg p-6 border border-apple-glass-border">
            <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">System Status</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gemini Intelligence</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Document Vault</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secure
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Action Pipelines</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-thin rounded-apple-lg p-6 border border-apple-glass-border opacity-80 hover:opacity-100 transition-opacity">
            <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Pro Tip</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If a document mentions an obscure dependency (like Annexure C), the AI will automatically cross-reference whether you have it ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
