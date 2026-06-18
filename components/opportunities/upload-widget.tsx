'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Link as LinkIcon } from 'lucide-react'
import { getStudentProfile } from '@/lib/profile-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { StressTranslator } from '@/components/ui/stress-translator'

interface UploadWidgetProps {
  onUploadComplete?: (id: string) => void
}

export function UploadWidget({ onUploadComplete }: UploadWidgetProps = {}) {
  const [mode, setMode] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const supabase = createClient()

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

      // Inject profile into payload
      const profile = getStudentProfile()
      payload.profile = profile

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 35000)

      const response = await fetch('/api/opportunities/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to process document')
      }

      const result = await response.json()

      // Artificial delay to let user see processing state
      await new Promise(r => setTimeout(r, 800))

      if (onUploadComplete) {
        onUploadComplete(result.id)
      } else {
        router.push(`/opportunities/${result.id}`)
      }
      
    } catch (error: unknown) {
      const err = error as Error
      if (err.name === 'AbortError') {
        toast.error('The request timed out. The document might be too large.')
      } else {
        toast.error(err.message || 'Something went wrong')
      }
    } finally {
      setIsUploading(false)
    }
  }

  if (isUploading) {
    return (
      <div className="w-full">
        <StressTranslator simplifiedText="Hang tight, we're building your personalized action plan..." isProcessing={true} />
      </div>
    )
  }

  return (
    <div className="w-full relative overflow-hidden transition-crisp">
      <div className="flex bg-muted p-1 rounded-lg border border-border mb-6 w-fit">
        <button
          onClick={() => setMode('file')}
          className={`px-6 py-2 text-step-0 font-medium rounded-md transition-crisp ${mode === 'file' ? 'bg-background shadow-elevation-1 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Document
        </button>
        <button
          onClick={() => setMode('url')}
          className={`px-6 py-2 text-step-0 font-medium rounded-md transition-crisp ${mode === 'url' ? 'bg-background shadow-elevation-1 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Website URL
        </button>
      </div>

      <div>
        {mode === 'file' ? (
          !file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-crisp ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-foreground/30'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-background border border-border shadow-elevation-1 flex items-center justify-center mb-6 text-foreground">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="text-step-2 font-medium mb-2 text-foreground tracking-tight">
                {isDragActive ? 'Drop to analyze' : 'Drag & drop a document'}
              </p>
              <p className="text-step-0 text-muted-foreground max-w-[30ch]">
                Supports PDF, PNG, JPG up to 10MB
              </p>
            </div>
          ) : (
            <div className="decision-surface-muted p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="w-12 h-12 rounded-lg bg-background border border-border shadow-elevation-1 flex items-center justify-center shrink-0">
                  <File className="h-6 w-6 text-foreground" />
                </div>
                <div className="truncate">
                  <p className="font-medium truncate text-step-1 text-foreground">{file.name}</p>
                  <p className="text-step-0 text-muted-foreground mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-danger flex-shrink-0 ml-4 rounded-full w-8 h-8 transition-crisp"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://example.com/scholarship-details"
                className="pl-12 h-16 text-step-1 bg-background border-border rounded-xl focus-visible:ring-1 focus-visible:ring-foreground transition-crisp"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={(mode === 'file' && !file) || (mode === 'url' && !url)}
            className="w-full sm:w-auto h-12 px-8 rounded-md font-medium text-step-1 shadow-elevation-1 transition-crisp"
          >
            Generate Action Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
