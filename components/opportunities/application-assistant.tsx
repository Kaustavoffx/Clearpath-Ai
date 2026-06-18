'use client'

import { FileDown, Mail, ExternalLink, FileWarning } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ApplicationAssistantProps {
  missingDocs: string[]
}

export function ApplicationAssistant({ missingDocs }: ApplicationAssistantProps) {
  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF. For demo, we just alert or print.
    window.print()
  }

  const handleDraftEmail = () => {
    const subject = encodeURIComponent("Clarification Request: Application Documents")
    const body = encodeURIComponent(`Hello,\n\nI am preparing my application and noticed I am missing the following documents:\n${missingDocs.map(d => `- ${d}`).join('\n')}\n\nCould you please advise if there are alternative documents accepted?\n\nThank you,`)
    window.location.href = `mailto:authority@example.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-step-2 font-bold text-foreground">Application Assistant</h3>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Guidance Mode</span>
      </div>
      
      <p className="text-step-1 text-muted-foreground leading-relaxed">
        We have verified the evidence. Here are the tools you need to complete your application. We do not apply on your behalf to maintain your privacy and security.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="p-5 border border-border rounded-lg bg-background shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
            <FileWarning className="w-5 h-5 text-danger" />
          </div>
          <div>
            <div className="font-bold text-step-0 mb-1">Missing Documents</div>
            <div className="text-xs text-muted-foreground mb-3">You need {missingDocs.length} more documents.</div>
            {missingDocs.length > 0 && (
              <ul className="text-xs space-y-1 mb-4 text-foreground/80">
                {missingDocs.slice(0, 2).map((doc, i) => (
                  <li key={i} className="truncate">- {doc}</li>
                ))}
                {missingDocs.length > 2 && <li>+ {missingDocs.length - 2} more</li>}
              </ul>
            )}
            <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={handleDownloadPDF}>
              <FileDown className="w-3 h-3 mr-2" /> Download Checklist PDF
            </Button>
          </div>
        </div>

        <div className="p-5 border border-border rounded-lg bg-background shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div className="w-full">
            <div className="font-bold text-step-0 mb-1">Contact Authority</div>
            <div className="text-xs text-muted-foreground mb-4">Need an extension or clarification?</div>
            <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={handleDraftEmail}>
              <Mail className="w-3 h-3 mr-2" /> Draft Inquiry Email
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-muted/30 border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-step-1">Ready to submit?</div>
          <div className="text-sm text-muted-foreground">Proceed to the official government/scholarship portal.</div>
        </div>
        <Button className="shrink-0 group shadow-elevation-1">
          Open Official Portal <ExternalLink className="w-4 h-4 ml-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
