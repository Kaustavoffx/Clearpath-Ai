import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle2, Clock, FileText, AlertCircle, TrendingDown, Target, File } from "lucide-react"

import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: opp } = await supabase.from('opportunities').select('title, simplified_summary').eq('id', params.id).single()
  
  if (!opp) return { title: 'Opportunity Not Found' }
  
  return {
    title: opp.title,
    description: opp.simplified_summary || "View the full action plan and eligibility details for this opportunity.",
    openGraph: {
      title: opp.title,
      description: opp.simplified_summary || "View the full action plan.",
    }
  }
}

export default async function OpportunityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('*, action_steps(*)')
    .eq('id', id)
    .single()

  if (error || !opportunity) {
    notFound()
  }

  // Get signed URL for the document to show in Evidence View
  const { data } = await supabase.storage
    .from('opportunities')
    .createSignedUrl(opportunity.storage_path, 3600) // 1 hour
  const signedUrl = data?.signedUrl

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary uppercase">
              {opportunity.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> 
              {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'No Deadline'}
            </span>
          </div>
          <h1 className="text-3xl font-bold">{opportunity.title}</h1>
          {opportunity.opportunity_value && opportunity.opportunity_value !== 'Not Found In Document' && (
            <div className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mt-2">
              Value: {opportunity.opportunity_value}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 items-end">
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground mb-1">Readiness Score</span>
            <div className={`text-4xl font-bold ${getReadinessColor(opportunity.readiness_score || 0)}`}>
              {opportunity.readiness_score || 0}%
            </div>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground text-right">
            <div>
              Risk: <strong className="text-foreground">{opportunity.risk_score || 0}/100</strong>
            </div>
            <div>
              AI Confidence: <strong className="text-foreground">{opportunity.confidence_score || 0}%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Plain Language Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                {opportunity.simplified_summary}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="action-plan" className="w-full">
            <TabsList className="w-full justify-start h-auto p-1 glass-regular rounded-apple-lg border border-apple-glass-border mb-4 shadow-apple-sm inline-flex flex-wrap gap-1">
              <TabsTrigger value="action-plan" className="rounded-apple-md data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground py-2 px-4 transition-all spring-transition data-[state=active]:shadow-sm">Action Plan</TabsTrigger>
              <TabsTrigger value="eligibility" className="rounded-apple-md data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground py-2 px-4 transition-all spring-transition data-[state=active]:shadow-sm">Eligibility & Risks</TabsTrigger>
              <TabsTrigger value="evidence" className="rounded-apple-md data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground py-2 px-4 transition-all spring-transition data-[state=active]:shadow-sm">Source Evidence</TabsTrigger>
              <TabsTrigger value="document" className="rounded-apple-md data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground py-2 px-4 transition-all spring-transition data-[state=active]:shadow-sm">Original File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="action-plan" className="pt-2">
              <div className="space-y-4">
                {opportunity.action_steps && opportunity.action_steps.length > 0 ? opportunity.action_steps.sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number).map((step: { id: string, step_number: number, title: string, description: string }) => (
                  <Card key={step.id}>
                    <CardHeader className="flex flex-row items-center gap-4 py-4">
                      <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {step.step_number}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm">{step.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                )) : (
                   <div className="p-8 text-center text-muted-foreground border border-dashed rounded-apple-lg">No action steps generated.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="eligibility" className="pt-2">
              <div className="grid gap-6">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
                  <CardHeader className="py-4">
                    <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2 text-base">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-red-900/80 dark:text-red-200/80">
                      {opportunity.risk_analysis?.risks?.map((risk: string, i: number) => (
                        <li key={i}>{risk}</li>
                      )) || <li>No specific risks detected.</li>}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="w-5 h-5" />
                      Eligibility Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {opportunity.eligibility_analysis?.requirements?.map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      )) || <li>Not specified.</li>}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="evidence" className="pt-2">
              <div className="space-y-4">
                {opportunity.evidence_references && opportunity.evidence_references.length > 0 ? (
                  opportunity.evidence_references.map((ref: { claim: string, quote_from_document: string }, i: number) => (
                    <Card key={i} className="glass-thick border-l-4 border-l-primary">
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div className="font-semibold text-sm">{ref.claim}</div>
                        <div className="bg-muted p-3 rounded-apple-md text-xs font-mono text-muted-foreground italic">
                          &quot;{ref.quote_from_document}&quot;
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground border border-dashed rounded-apple-lg">No evidence references provided.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="document" className="pt-2 h-[600px]">
              <Card className="h-full overflow-hidden border">
                {signedUrl ? (
                  <iframe 
                    src={signedUrl} 
                    className="w-full h-full border-0" 
                    title="Document Evidence"
                  />
                ) : opportunity.storage_path.startsWith('http') ? (
                  <iframe 
                    src={opportunity.storage_path} 
                    className="w-full h-full border-0" 
                    title="URL Evidence"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Document not available
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/50">
            <CardHeader className="py-4">
              <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2 text-base">
                <TrendingDown className="w-5 h-5" />
                Opportunity Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-900/80 dark:text-orange-200/80 font-medium">
                {opportunity.opportunity_loss_prediction || "You may miss out on valuable benefits if you ignore this."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <File className="w-5 h-5" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {opportunity.required_documents?.map((doc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                )) || <p className="text-sm text-muted-foreground">None specified.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
