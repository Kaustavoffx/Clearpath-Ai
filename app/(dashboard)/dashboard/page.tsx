import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadWidget } from "@/components/opportunities/upload-widget"
import { ShieldCheck, FolderArchive, Target } from "lucide-react"
import { DecisionCard } from "@/components/ui/decision-card"
import { MorningBriefing } from "@/components/advisor/morning-briefing"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col py-10 mt-6 animate-fadeInUp">
      
      <div className="mb-6 border-b border-glass-border pb-6">
        <h1 className="text-hero-title flex items-center gap-3">
          <Target className="w-7 h-7 text-[#858AE3]" /> Mission Control
        </h1>
        <p className="text-body-text mt-1.5 text-[14px]">
          Ingest documents, generate action plans, and track active opportunities.
        </p>
      </div>

      <div className="mb-10">
        <MorningBriefing userId={user.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upload Engine */}
        <div className="lg:col-span-2 space-y-6">
          <DecisionCard 
            title="Decision Engine" 
            label="Ready"
            className="liquid-glass-card border-[#858AE3]/10"
          >
            <div className="py-3">
              <UploadWidget />
            </div>
          </DecisionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DecisionCard 
              title="Evidence-Based"
              icon={<ShieldCheck className="w-4 h-4 text-[#93CAF6]" />}
              className="liquid-glass-card"
            >
              <p className="text-body-text text-[13px]">Every deadline and requirement extracted is strictly cited back to the original source text.</p>
            </DecisionCard>
            
            <DecisionCard 
              title="Auto-Archival"
              icon={<FolderArchive className="w-4 h-4 text-[#8EB5F0]" />}
              className="liquid-glass-card"
            >
              <p className="text-body-text text-[13px]">Passed deadlines are automatically archived to keep your command center focused.</p>
            </DecisionCard>
          </div>
        </div>

        {/* Right Column: Status */}
        <div className="space-y-5">
          <DecisionCard title="System Status" className="liquid-glass-card">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-foreground">Intelligence Core</span>
                <span className="text-status-badge text-[#93CAF6] bg-[#93CAF6]/8 border border-[#93CAF6]/15 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93CAF6] animate-breathe" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-foreground">Document Vault</span>
                <span className="text-status-badge text-[#93CAF6] bg-[#93CAF6]/8 border border-[#93CAF6]/15 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93CAF6]" /> Secure
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-foreground">Action Pipelines</span>
                <span className="text-status-badge text-[#93CAF6] bg-[#93CAF6]/8 border border-[#93CAF6]/15 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93CAF6]" /> Ready
                </span>
              </div>
            </div>
          </DecisionCard>
          
          <div className="liquid-glass-card p-5">
            <div className="text-card-label mb-2">Intelligence</div>
            <p className="text-body-text text-[13px]">
              If a document mentions an obscure dependency, the AI will automatically cross-reference whether you have it ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
