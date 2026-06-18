'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home } from 'lucide-react'
import Link from 'next/link'

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-danger/10 blur-[80px] pointer-events-none" />
          
          <div className="liquid-glass-card p-12 max-w-md w-full text-center relative z-10 border-danger/20 shadow-elevation-2">
            <div className="w-20 h-20 bg-danger/10 text-danger rounded-[24px] border border-danger/20 flex items-center justify-center mx-auto mb-8 shadow-glass-card">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-[28px] font-bold mb-4 tracking-tight text-foreground">Mission Aborted</h2>
            <p className="text-[16px] text-muted-foreground mb-10 leading-relaxed">
              A critical failure occurred in the processing node. Your document vault and data remain perfectly secure.
            </p>
            <div className="flex flex-col gap-4">
              <Button onClick={() => reset()} className="w-full h-14 rounded-[999px] text-[16px] font-semibold transition-spring shadow-glass-card">
                Restart Process
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full h-14 rounded-[999px] text-[16px] font-semibold transition-spring border-glass-border bg-glass-surface/50 hover:bg-glass-layer">
                  <Home className="w-5 h-5 mr-2" /> Return to Base
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
