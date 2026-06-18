"use client"

import { useEffect } from "react"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OpportunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Opportunity Details Error:", error)
  }, [error])

  return (
    <div className="container-standard py-20 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500 text-center">
      <div className="w-24 h-24 bg-danger/10 border border-danger/20 backdrop-blur-md rounded-[24px] flex items-center justify-center mb-8 shadow-glass-card relative">
        <div className="absolute inset-0 bg-danger/10 rounded-[24px] blur-xl" />
        <AlertTriangle className="w-10 h-10 text-danger relative z-10" />
      </div>
      
      <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight mb-4 text-foreground text-balance">
        Unable to load opportunity
      </h1>
      
      <p className="text-[16px] md:text-[18px] text-muted-foreground max-w-[500px] mb-10 leading-relaxed">
        We encountered a problem while trying to display this action plan. This could be due to missing data or a temporary server issue.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[400px]">
        <Button 
          onClick={reset} 
          variant="outline" 
          className="flex-1 bg-glass-surface hover:bg-glass-layer border-glass-border shadow-sm text-[14px] h-12 uppercase tracking-widest font-semibold"
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
        <Link 
          href="/opportunities"
          className="flex-1 text-[14px] h-12 uppercase tracking-widest font-semibold shadow-elevation-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" /> All Opportunities
        </Link>
      </div>
      
      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 w-full max-w-[600px] text-left">
          <div className="bg-danger/5 border border-danger/20 rounded-[12px] p-4 text-danger/80 font-mono text-[12px] overflow-x-auto">
            {error.message || "Unknown Error"}
          </div>
        </div>
      )}
    </div>
  )
}
