import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadWidget } from "@/components/opportunities/upload-widget"
import { Target, FileSearch, ArrowRight, Zap } from "lucide-react"
import Link from 'next/link'

export default async function AnalyzePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch opportunities (Queue & Recent Results)
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', user.id)
    .neq('status', 'TRASHED')
    .order('created_at', { ascending: false })
    .limit(10)

  const opps = opportunities || [];
  
  // Split into "Processing/Queued" vs "Recent Results"
  // For demo, we'll just split them. Usually you'd check status='processing'
  const processing = opps.filter(o => o.status === 'processing');
  const recent = opps.filter(o => o.status !== 'processing').slice(0, 5);

  return (
    <div className="container-wide min-h-[calc(100vh-5rem)] flex flex-col pt-6 pb-12 gap-6 animate-fadeInUp max-w-[1440px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <FileSearch className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-foreground leading-tight">Analyze Documents</h1>
          <p className="text-[14px] text-muted-foreground">Upload notices to instantly generate executable action plans.</p>
        </div>
      </div>

      {/* DENSE SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Upload Zone (Col Span 5) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="liquid-glass-card border border-glass-border rounded-[24px] p-6 shadow-sm flex-1 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-6 flex items-center gap-2 text-foreground">
               <Target className="w-4 h-4 text-primary" /> Initialize New Plan
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              <UploadWidget />
            </div>
          </div>
        </div>

        {/* Center: Analysis Queue (Col Span 3) */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="liquid-glass-card rounded-[24px] p-5 flex-1 flex flex-col">
            <h2 className="text-[14px] font-semibold mb-4 text-foreground flex items-center gap-2">
               <Zap className="w-4 h-4 text-warning" /> Processing Queue
            </h2>
            <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-3">
              {processing.length > 0 ? processing.map(opp => (
                <div key={opp.id} className="p-3 rounded-[12px] bg-black/20 border border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-warning font-bold animate-pulse">Extracting...</span>
                  </div>
                  <span className="text-[13px] font-medium text-foreground line-clamp-2">{opp.title || 'Processing Document...'}</span>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-glass-border rounded-[16px]">
                  <span className="text-[13px] text-muted-foreground">Queue is empty. Waiting for uploads.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Recent Results (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="liquid-glass-card rounded-[24px] p-5 flex-1 flex flex-col">
            <h2 className="text-[14px] font-semibold mb-4 text-foreground">Recent Intelligence</h2>
            <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-2">
              {recent.length > 0 ? recent.map((opp) => (
                <Link key={opp.id} href={`/opportunities/${opp.id}`} className="flex items-start gap-3 p-3 rounded-[12px] bg-black/20 hover:bg-glass-layer transition-colors border border-glass-border group">
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-medium text-foreground truncate block">{opp.title || 'Untitled Document'}</span>
                    <span className="text-[12px] text-muted-foreground mt-1 block">Value: {opp.opportunity_value || 'Unknown'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </Link>
              )) : (
                <div className="text-muted-foreground text-[13px] italic flex-1 flex items-center justify-center">No recent results found.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
