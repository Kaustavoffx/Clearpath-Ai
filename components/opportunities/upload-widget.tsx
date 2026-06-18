'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Link as LinkIcon, FileText, Banknote, School, GraduationCap } from 'lucide-react'
import { getStudentProfile } from '@/lib/profile-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { StressTranslator } from '@/components/ui/stress-translator'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
    <div className="w-full relative overflow-hidden transition-spring">
      <div className="flex bg-glass-surface/50 p-1 rounded-[12px] border border-glass-border mb-8 w-fit backdrop-blur-md">
        <button
          onClick={() => setMode('file')}
          className={cn(
            "px-6 py-2.5 text-[14px] font-medium rounded-[8px] transition-spring",
            mode === 'file' ? "bg-background shadow-glass-card text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Document
        </button>
        <button
          onClick={() => setMode('url')}
          className={cn(
            "px-6 py-2.5 text-[14px] font-medium rounded-[8px] transition-spring",
            mode === 'url' ? "bg-background shadow-glass-card text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Website URL
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-[14px] font-medium uppercase tracking-wider text-muted-foreground mb-4">Supported Documents</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-2 p-3 rounded-[12px] bg-primary/5 border border-primary/10 text-center">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="text-[12px] font-medium text-foreground">Scholarship Notice</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-[12px] bg-success/5 border border-success/10 text-center">
            <Banknote className="w-6 h-6 text-success" />
            <span className="text-[12px] font-medium text-foreground">Govt Scheme</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-[12px] bg-warning/5 border border-warning/10 text-center">
            <School className="w-6 h-6 text-warning" />
            <span className="text-[12px] font-medium text-foreground">School Circular</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-[12px] bg-info/5 border border-info/10 text-center">
            <FileText className="w-6 h-6 text-info" />
            <span className="text-[12px] font-medium text-foreground">Support Program</span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'file' ? (
            !file ? (
              <div {...getRootProps()} className="focus:outline-none w-full">
                <input {...getInputProps()} />
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "border-2 border-dashed rounded-[24px] p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-spring w-full",
                    isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-glass-border bg-glass-surface/30 hover:bg-glass-surface/50 hover:border-foreground/30"
                  )}
                >
                  <div className="w-20 h-20 rounded-[20px] bg-background border border-glass-border shadow-glass-card flex items-center justify-center mb-6 text-primary">
                    <UploadCloud className="h-10 w-10" />
                  </div>
                  <p className="text-[20px] font-semibold mb-2 text-foreground tracking-tight">
                    {isDragActive ? 'Drop to start AI Processing' : 'Drag & drop a document here'}
                  </p>
                  <p className="text-[14px] text-muted-foreground max-w-[300px]">
                    Supports PDF, PNG, JPG up to 10MB. It&apos;s secure and fully encrypted.
                  </p>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                key="file-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="liquid-glass-card p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-5 overflow-hidden">
                  <div className="w-14 h-14 rounded-[14px] bg-background border border-glass-border shadow-elevation-1 flex items-center justify-center shrink-0">
                    <File className="h-7 w-7 text-primary" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-[16px] text-foreground truncate">{file.name}</p>
                    <p className="text-[13px] font-medium text-muted-foreground mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Engine
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-danger hover:bg-danger/10 flex-shrink-0 ml-4 rounded-full w-10 h-10 transition-spring"
                  onClick={() => setFile(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            )
          ) : (
            <motion.div 
              key="url-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-2"
            >
              <div className="relative">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/scholarship-details"
                  className="pl-14 h-16 text-[16px] bg-background border-glass-border rounded-[16px] focus-visible:ring-2 focus-visible:ring-primary transition-spring shadow-sm"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-end">
          <Button 
            size="lg"
            onClick={handleUpload} 
            disabled={(mode === 'file' && !file) || (mode === 'url' && !url)}
            className="w-full sm:w-auto h-[56px] px-8 rounded-[999px] text-[16px]"
          >
            Generate Action Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
