'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getStudentProfile } from '@/lib/profile-store'
import { Loader2, Zap, GraduationCap, Landmark, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function DemoShowcase() {
  const [loadingType, setLoadingType] = useState<string | null>(null)
  const router = useRouter()

  const handleDemo = async (type: string) => {
    setLoadingType(type)
    try {
      const profile = getStudentProfile()
      const response = await fetch('/api/opportunities/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, profile })
      })

      if (!response.ok) {
        throw new Error('Failed to generate demo')
      }

      const { id } = await response.json()
      router.push(`/opportunities/${id}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate demo. Please try again.')
    } finally {
      setLoadingType(null)
    }
  }

  return (
    <div className="mb-12 decision-surface p-8 border-2 border-primary/20 bg-primary/5 rounded-apple-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-step-2 font-bold tracking-tight text-foreground">Live Demo Showcase</h2>
          <p className="text-sm text-muted-foreground">Test the AI with pre-configured diverse documents to see instant personalized extraction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-start px-6 gap-4 bg-background hover:border-primary/50 transition-all"
          onClick={() => handleDemo('scholarship')}
          disabled={loadingType !== null}
        >
          {loadingType === 'scholarship' ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <GraduationCap className="w-6 h-6 text-primary" />}
          <div className="text-left">
            <div className="font-bold">Try Scholarship</div>
            <div className="text-xs text-muted-foreground font-normal">Complex Merit & Financial</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-start px-6 gap-4 bg-background hover:border-primary/50 transition-all"
          onClick={() => handleDemo('scheme')}
          disabled={loadingType !== null}
        >
          {loadingType === 'scheme' ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Landmark className="w-6 h-6 text-primary" />}
          <div className="text-left">
            <div className="font-bold">Try Government Scheme</div>
            <div className="text-xs text-muted-foreground font-normal">State Subsidy & Income Limits</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-start px-6 gap-4 bg-background hover:border-primary/50 transition-all"
          onClick={() => handleDemo('circular')}
          disabled={loadingType !== null}
        >
          {loadingType === 'circular' ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <FileText className="w-6 h-6 text-primary" />}
          <div className="text-left">
            <div className="font-bold">Try School Circular</div>
            <div className="text-xs text-muted-foreground font-normal">Urgent Exam Notice</div>
          </div>
        </Button>
      </div>
    </div>
  )
}
