import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, Clock } from "lucide-react"
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
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document History</h1>
          <p className="text-muted-foreground mt-2">
            View all your previously analyzed documents and opportunities.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Upload New</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <Card key={opp.id} className="hover:glass-thick transition-all spring-transition group/card shadow-apple-sm hover:shadow-apple-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-apple-md bg-primary/10 flex items-center justify-center border border-primary/20 shadow-apple-sm group-hover/card:scale-105 spring-transition">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{opp.title}</h3>
                        <Badge variant="secondary" className="text-xs glass-thick bg-transparent border-apple-glass-border">{opp.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {opp.simplified_summary}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Added {new Date(opp.created_at).toLocaleDateString()}
                        </span>
                        {opp.deadline && (
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <AlertCircle className="h-3 w-3" />
                            Due {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center hidden md:block px-4 border-l border-apple-glass-border">
                      <div className="text-2xl font-bold text-primary">{opp.readiness_score || 0}%</div>
                      <div className="text-xs text-muted-foreground">Readiness</div>
                    </div>
                    <Button variant="secondary" className="rounded-apple-md" asChild>
                      <Link href={`/opportunities/${opp.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold">No documents yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Upload your first circular, scholarship, or scheme document to generate an action plan.
            </p>
            <Button asChild>
              <Link href="/dashboard">Upload Document</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
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
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
