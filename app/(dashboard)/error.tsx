'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error Boundary caught:', error)
  }, [error])

  return (
    <div className="container-standard py-24 flex flex-col items-center justify-center text-center">
      <div className="decision-surface p-12 max-w-lg w-full shadow-elevation-2">
        <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-step-3 font-semibold mb-4">Application Error</h2>
        <p className="text-step-1 text-muted-foreground mb-8 text-balance">
          We encountered an issue loading this section of your Mission Control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="h-12 px-6">
            Go to Dashboard
          </Button>
          <Button onClick={() => reset()} className="h-12 px-8">
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
