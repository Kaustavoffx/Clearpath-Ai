"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PlayCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoStart = async () => {
    setIsLoading(true)
    const toastId = toast.loading('Initializing Judge Demo Mode...')

    try {
      // Create a mock opportunity by calling a special demo API endpoint
      const response = await fetch('/api/opportunities/demo', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to initialize demo mode')
      
      const result = await response.json()
      
      toast.success('Demo environment ready!', { id: toastId })
      router.push(`/opportunities/${result.id}`)
      
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-lg text-center border-primary/20 shadow-xl">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <PlayCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Judge Demo Mode</CardTitle>
          <CardDescription className="text-base mt-2">
            Experience ClearPath AI's capabilities instantly without uploading a document.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p className="mb-4">
            This will generate a highly complex <strong>Government Scholarship Scheme</strong> and demonstrate how our AI analyzes eligibility, extracts action items, and calculates readiness scores.
          </p>
          <ul className="text-left space-y-2 bg-muted/50 p-4 rounded-lg">
            <li>✅ Bypasses PDF upload requirement</li>
            <li>✅ Simulates Gemini 2.5 Flash analysis</li>
            <li>✅ Generates interactive action plan</li>
            <li>✅ Displays risk and opportunity loss</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-8">
          <Button size="lg" onClick={handleDemoStart} disabled={isLoading} className="w-full max-w-xs text-lg h-12">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Launch Demo'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
