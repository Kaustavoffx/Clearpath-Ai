import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, ArrowRight, Clock, Target, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground text-section">
            Monitor and execute your guaranteed action plans.
          </p>
        </div>
        <Link href="/dashboard" className={cn(buttonVariants(), "h-12 px-6 rounded-apple-md font-medium text-base shadow-apple-sm spring-active")}>
          Analyze New Document
        </Link>
      </div>

      <div className="grid gap-6">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <div key={opp.id} className="glass-thin hover:glass-regular transition-all duration-500 group rounded-apple-xl shadow-apple-sm hover:shadow-apple-md relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
              
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pl-10">
                <div className="flex items-start gap-6 flex-1">
                  <div className="h-14 w-14 shrink-0 rounded-apple-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 spring-transition">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-xl line-clamp-1 tracking-tight">{opp.title}</h3>
                      <Badge variant="secondary" className="text-xs uppercase tracking-wider glass-thick bg-transparent border-apple-glass-border shadow-sm">{opp.category}</Badge>
                    </div>
                    <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl">
                      {opp.simplified_summary}
                    </p>
                    
                    <div className="flex items-center gap-6 mt-3 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Added {new Date(opp.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {opp.deadline && opp.deadline !== 'Not Found In Document' && (
                        <span className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          <Target className="h-3.5 w-3.5" />
                          Due {new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 pl-4 md:border-l border-apple-glass-border">
                  <div className="text-center hidden lg:block px-4">
                    <div className="text-3xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">{opp.readiness_score || 0}%</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Readiness</div>
                  </div>
                  <Link href={`/opportunities/${opp.id}`} className={cn(buttonVariants(), "h-12 px-6 rounded-apple-md font-medium bg-foreground text-background hover:bg-foreground/90 shadow-apple-sm group/btn spring-active w-full md:w-auto")}>
                    View Plan <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-thick rounded-apple-xl p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-apple-glass-highlight">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight mb-2">Zero Active Plans</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Upload your first circular, scholarship, or scheme document to generate a personalized action plan instantly.
            </p>
            <Link href="/dashboard" className={cn(buttonVariants(), "h-12 px-8 rounded-apple-md font-medium text-base shadow-apple-sm spring-active")}>
              Upload Document
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
