'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Link as LinkIcon, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface UploadWidgetProps {
  onUploadComplete?: (id: string) => void
}

const PROCESSING_STEPS = [
  "Reading Document...",
  "Finding Deadlines...",
  "Checking Eligibility...",
  "Finding Missing Documents...",
  "Building Action Plan..."
]

export function UploadWidget({ onUploadComplete }: UploadWidgetProps = {}) {
  const [mode, setMode] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const router = useRouter()

  const supabase = createClient()

  // Simulate progress steps if actual API takes time
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setProcessingStep(prev => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev))
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isUploading])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (mode === 'file' && !file) return
    if (mode === 'url' && !url) return

    setIsUploading(true)
    setProcessingStep(0)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let payload: Record<string, unknown> = {}

      if (mode === 'file' && file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('opportunities')
          .upload(filePath, file)

        if (uploadError) throw uploadError
        payload = { filePath }
      } else {
        payload = { url }
      }

      const response = await fetch('/api/opportunities/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to process document')
      }

      const result = await response.json()

      // Force to last step for visual completion before redirect
      setProcessingStep(PROCESSING_STEPS.length - 1)
      
      // Artificial delay to let user see "Action Plan Built"
      await new Promise(r => setTimeout(r, 800))

      if (onUploadComplete) {
        onUploadComplete(result.id)
      } else {
        router.push(`/opportunities/${result.id}`)
      }
      
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message || 'Something went wrong')
      setIsUploading(false)
    }
  }

  if (isUploading) {
    return (
      <div className="glass-thick rounded-apple-xl p-12 w-full flex flex-col items-center justify-center min-h-[300px] shadow-apple-lg border border-apple-glass-highlight relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5 animate-pulse" />
        
        <div className="relative z-10 w-full max-w-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xl font-medium tracking-tight">Processing</div>
            <div className="text-primary font-mono text-sm">{Math.round(((processingStep + 1) / PROCESSING_STEPS.length) * 100)}%</div>
          </div>
          
          <div className="relative h-2 w-full bg-secondary/50 rounded-full overflow-hidden mb-8">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-in-out rounded-full"
              style={{ width: `${((processingStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-4">
            {PROCESSING_STEPS.map((step, index) => {
              const isPast = index < processingStep
              const isCurrent = index === processingStep
              
              return (
                <div key={step} className={`flex items-center gap-3 transition-all duration-500 ${isPast ? 'opacity-50' : isCurrent ? 'opacity-100 translate-x-2' : 'opacity-20'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPast ? 'bg-emerald-500/20 text-emerald-500' : isCurrent ? 'bg-primary/20 text-primary animate-pulse' : 'bg-muted'}`}>
                    {isPast ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                  <span className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-thick rounded-apple-xl p-2 w-full shadow-apple-lg relative overflow-hidden border border-apple-glass-highlight transition-all duration-500 hover:shadow-apple-xl">
      <div className="flex bg-muted/30 p-1.5 rounded-apple-lg border border-apple-glass-border mb-2 mx-2 mt-2 max-w-fit">
        <button
          onClick={() => setMode('file')}
          className={`px-6 py-2 text-sm font-medium rounded-apple-md transition-all spring-transition ${mode === 'file' ? 'bg-background shadow-apple-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Document
        </button>
        <button
          onClick={() => setMode('url')}
          className={`px-6 py-2 text-sm font-medium rounded-apple-md transition-all spring-transition ${mode === 'url' ? 'bg-background shadow-apple-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Website URL
        </button>
      </div>

      <div className="p-4 pt-2">
        {mode === 'file' ? (
          !file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-apple-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all spring-transition ${
                isDragActive ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-apple-glass-border bg-background/20 hover:bg-background/40 hover:border-primary/30'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium mb-2 text-foreground tracking-tight">
                {isDragActive ? 'Drop to analyze' : 'Drag & drop a document'}
              </p>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Supports PDF, PNG, JPG up to 10MB
              </p>
            </div>
          ) : (
            <div className="bg-background/40 rounded-apple-lg p-6 flex items-center justify-between border border-apple-glass-border">
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="w-12 h-12 rounded-apple-md bg-primary/10 flex items-center justify-center shrink-0">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <div className="truncate">
                  <p className="font-medium truncate text-base">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-4 rounded-full w-8 h-8"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2 p-2">
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://example.com/scholarship-details"
                className="pl-12 h-16 text-base bg-background/40 border-apple-glass-border rounded-apple-lg shadow-inner focus-visible:ring-primary/50"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={(mode === 'file' && !file) || (mode === 'url' && !url)}
            className="w-full sm:w-auto h-12 px-8 rounded-apple-md font-medium text-base shadow-apple-sm group spring-active transition-all"
          >
            Generate Action Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
