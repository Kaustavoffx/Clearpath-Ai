import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadWidget } from "@/components/opportunities/upload-widget"
import { ShieldCheck, FolderArchive, Target, Clock, AlertTriangle, IndianRupee } from "lucide-react"
import { DecisionCard } from "@/components/ui/decision-card"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container-standard min-h-[calc(100vh-5rem)] flex flex-col py-12 mt-8">
      
      <div className="mb-8 border-b border-border pb-8">
        <h1 className="text-step-4 flex items-center gap-3">
          <Target className="w-8 h-8 text-foreground" /> Your Mission Control
        </h1>
        <p className="text-muted-foreground mt-2 text-step-2">
          Ingest documents, generate action plans, and track your active opportunities.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="decision-surface p-6 border-l-2 border-l-warning">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Critical</span>
          </div>
          <div className="text-step-4 font-bold text-foreground">2</div>
          <div className="text-step-0 text-muted-foreground mt-1">Opportunities</div>
        </div>

        <div className="decision-surface p-6 border-l-2 border-l-danger">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Clock className="w-4 h-4 text-danger" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Urgent</span>
          </div>
          <div className="text-step-4 font-bold text-foreground">1</div>
          <div className="text-step-0 text-muted-foreground mt-1">Deadline This Week</div>
        </div>

        <div className="decision-surface p-6 border-l-2 border-l-primary">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <FolderArchive className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Action</span>
          </div>
          <div className="text-step-4 font-bold text-foreground">8</div>
          <div className="text-step-0 text-muted-foreground mt-1">Missing Documents</div>
        </div>

        <div className="decision-surface p-6 border-l-2 border-l-success">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <IndianRupee className="w-4 h-4 text-success" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Value</span>
          </div>
          <div className="text-step-4 font-bold text-success">₹50k</div>
          <div className="text-step-0 text-muted-foreground mt-1">Potential Funding</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload & Processing Engine */}
        <div className="lg:col-span-2 space-y-8">
          <DecisionCard 
            title="Decision Engine" 
            label="Ready"
            className="border-primary/20 bg-background shadow-elevation-2"
          >
            <div className="py-4">
              <UploadWidget />
            </div>
          </DecisionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DecisionCard 
              title="Evidence-Based"
              icon={<ShieldCheck className="w-4 h-4 text-success" />}
            >
              <p className="text-step-0 text-muted-foreground">Every deadline and requirement extracted is strictly cited back to the original source text.</p>
            </DecisionCard>
            
            <DecisionCard 
              title="Auto-Archival"
              icon={<FolderArchive className="w-4 h-4 text-info" />}
            >
              <p className="text-step-0 text-muted-foreground">Passed deadlines are automatically archived to keep your command center clutter-free.</p>
            </DecisionCard>
          </div>
        </div>

        {/* Right Column: Status & Intelligence */}
        <div className="space-y-6">
          <DecisionCard title="System Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-step-0 font-medium text-foreground">Intelligence Core</span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-step-0 font-medium text-foreground">Document Vault</span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> Secure
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-step-0 font-medium text-foreground">Action Pipelines</span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> Ready
                </span>
              </div>
            </div>
          </DecisionCard>
          
          <div className="bg-muted/50 rounded-2xl p-6 border border-border">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Pro Tip</div>
            <p className="text-step-0 text-muted-foreground leading-relaxed">
              If a document mentions an obscure dependency (like Annexure C), the AI will automatically cross-reference whether you have it ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
