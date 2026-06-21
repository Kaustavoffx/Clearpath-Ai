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
import Image from 'next/image'
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

      let documentHash = '';
      let payload: Record<string, unknown> = {};

      if (mode === 'file' && file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Generate Hash for duplicate prevention
        try {
          const buffer = await file.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          documentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch(e) {
          console.error("Failed to hash file", e);
        }

        const { error: uploadError } = await supabase.storage
          .from('opportunities')
          .upload(filePath, file)

        if (uploadError) throw uploadError
        payload = { filePath, documentHash }
      } else {
        // Simple hash of URL for duplicate prevention
        try {
          const msgUint8 = new TextEncoder().encode(url);
          const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          documentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch(e) {}
        payload = { url, documentHash }
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
      <div className="w-full flex flex-col items-center gap-6 py-10">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
          <div className="relative w-full h-full rounded-[16px] bg-black/20 border border-primary/30 flex items-center justify-center overflow-hidden p-3 shadow-twilight-glow backdrop-blur-xl">
             <Image src="/icon-192x192.png" alt="ClearPath OS Loading" width={64} height={64} className="animate-breathe object-contain drop-shadow-[0_0_15px_rgba(113,97,239,0.8)]" priority />
          </div>
        </div>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-foreground mb-1">Authenticating & Uploading</p>
          <p className="text-[13px] text-muted-foreground animate-pulse">Building your personalized action plan...</p>
        </div>
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

      <div className="mb-8 bg-glass-layer/30 p-5 rounded-[16px] border border-glass-border shadow-sm">
        <h3 className="text-[14px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Supported Inputs
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 p-3 rounded-[12px] bg-black/20 border border-glass-border">
            <span className="text-[12px] uppercase text-muted-foreground tracking-wider font-semibold">Formats</span>
            <span className="text-[13px] text-foreground font-medium">PDF, PNG, JPG</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-[12px] bg-black/20 border border-glass-border">
            <span className="text-[12px] uppercase text-muted-foreground tracking-wider font-semibold">Max Size</span>
            <span className="text-[13px] text-foreground font-medium">10 MB per file</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-[12px] bg-black/20 border border-glass-border">
            <span className="text-[12px] uppercase text-muted-foreground tracking-wider font-semibold">Web Links</span>
            <span className="text-[13px] text-foreground font-medium">Public URLs, Govt portals</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-[12px] bg-danger/10 border border-danger/20">
            <span className="text-[12px] uppercase text-danger/80 tracking-wider font-semibold">Unsupported</span>
            <span className="text-[13px] text-danger font-medium">Logins, Passwords, Paywalls</span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
          {mode === 'file' ? (
            !file ? (
              <div {...getRootProps()} className="focus:outline-none w-full">
                <input {...getInputProps()} />
                <div
                  className={cn(
                    "animate-in fade-in zoom-in-95 duration-300 border-2 border-dashed rounded-[24px] p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-spring w-full relative overflow-hidden",
                    isDragActive ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]" : "border-glass-border bg-glass-surface/30 hover:bg-glass-surface/50 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
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
                </div>
              </div>
            ) : (
              <div 
                className="liquid-glass-card p-6 flex items-center justify-between animate-in fade-in zoom-in-95 duration-300"
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
              </div>
            )
          ) : (
            <div 
              className="flex flex-col gap-2 animate-fadeInUp duration-300"
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
              <p className="text-[13px] text-muted-foreground px-2 flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-info shrink-0" />
                Ensure the URL is publicly accessible. Pages behind logins cannot be analyzed.
              </p>
            </div>
          )}

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
