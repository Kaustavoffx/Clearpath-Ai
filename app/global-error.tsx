'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="decision-surface p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-step-3 font-bold mb-4">Something went wrong!</h2>
            <p className="text-step-1 text-muted-foreground mb-8">
              A critical error occurred. Don&apos;t worry, your data is safe.
            </p>
            <Button onClick={() => reset()} className="w-full h-12">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
