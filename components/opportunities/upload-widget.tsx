import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Loader2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

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
    const toastId = toast.loading('Initializing analysis...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let payload: Record<string, unknown> = {}

      if (mode === 'file' && file) {
        toast.loading('Uploading document...', { id: toastId })
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

      toast.loading('Analyzing with Gemini 2.5 Flash...', { id: toastId })

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

      console.log('API response:', result)
      console.log('opportunityId:', result.id)

      toast.success('Analysis complete!', { id: toastId })
      if (onUploadComplete) {
        onUploadComplete(result.id)
      } else {
        console.log('Navigation event: Navigating to', `/opportunities/${result.id}`)
        router.push(`/opportunities/${result.id}`)
      }
      
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message || 'Something went wrong', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Analyze Document</CardTitle>
            <CardDescription>
              Upload a file or paste a URL to generate an action plan.
            </CardDescription>
          </div>
          <div className="flex bg-muted/50 p-1 rounded-apple-lg border border-apple-glass-border">
            <button
              onClick={() => setMode('file')}
              className={`px-4 py-1.5 text-sm font-medium rounded-apple-md transition-all spring-transition ${mode === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              File
            </button>
            <button
              onClick={() => setMode('url')}
              className={`px-4 py-1.5 text-sm font-medium rounded-apple-md transition-all spring-transition ${mode === 'url' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              URL
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mode === 'file' ? (
          !file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-apple-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all spring-transition ${
                isDragActive ? 'border-primary bg-primary/10 glass-thick scale-[0.98]' : 'border-apple-glass-border glass-thin hover:glass-regular'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-10 w-10 text-primary/70 mb-4" />
              <p className="text-sm font-medium mb-1 text-foreground">
                {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, PNG, JPG (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="glass-thick rounded-apple-lg p-4 flex items-center justify-between border border-apple-glass-border shadow-apple-sm">
              <div className="flex items-center space-x-3 overflow-hidden">
                <File className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://example.com/scholarship"
                className="pl-10 h-12 glass-thin border-apple-glass-border rounded-apple-md"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={(mode === 'file' && !file) || (mode === 'url' && !url) || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Processing...' : 'Run Analysis'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
