'use client'

import { useState, useRef } from 'react'
import { FileText, Upload, RefreshCw, Trash2, ShieldCheck, AlertCircle, Clock, Eye, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateDocumentStatus, addDocumentToVault, deleteDocumentFromVault } from '@/app/actions/settings-actions'
import { cn } from "@/lib/utils"
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const REQUIRED_DOCUMENTS = [
  'Aadhaar Card',
  'PAN Card',
  'Income Certificate',
  'Domicile Certificate',
  'Caste Certificate',
  'Latest Marksheet',
  'Bank Passbook',
  'Passport Size Photo',
  'Scanned Signature'
]

export function DocumentVault({ initialDocuments }: { initialDocuments: any[] }) {
  const [documents, setDocuments] = useState<any[]>(initialDocuments || [])
  const [loading, setLoading] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeDocType, setActiveDocType] = useState<string | null>(null)
  const supabase = createClient()

  // Map existing documents into the required list structure
  const vaultMap = REQUIRED_DOCUMENTS.map(docType => {
    const existing = documents.find(d => d.document_type === docType)
    // Interpret verification or existence
    let derivedStatus = existing ? (existing.verified ? 'Verified' : 'Uploaded') : 'Missing'
    
    return {
      type: docType,
      status: derivedStatus,
      id: existing?.id || null,
      file_url: existing?.file_url || null,
      file_size: existing?.file_size || 0,
      mime_type: existing?.mime_type || '',
      updated_at: existing?.uploaded_at || existing?.updated_at || null
    }
  })

  const triggerUpload = (docType: string) => {
    setActiveDocType(docType)
    fileInputRef.current?.click()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeDocType) return

    setLoading(activeDocType)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${activeDocType.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('document-vault')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('document-vault')
        .getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl

      await addDocumentToVault({
        document_type: activeDocType,
        file_name: file.name,
        file_url: fileUrl,
        mime_type: file.type,
        file_size: file.size,
      })

      // Optimistic Update
      setDocuments(prev => {
        const existing = prev.find(d => d.document_type === activeDocType)
        const newDoc = {
          id: existing?.id || Math.random().toString(),
          document_type: activeDocType,
          file_name: file.name,
          file_url: fileUrl,
          mime_type: file.type,
          file_size: file.size,
          verified: false,
          uploaded_at: new Date().toISOString()
        }
        if (existing) {
          return prev.map(d => d.document_type === activeDocType ? newDoc : d)
        }
        return [...prev, newDoc]
      })
      
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setLoading(null)
      setActiveDocType(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (docId: string, docType: string) => {
    try {
      await deleteDocumentFromVault(docId)
      setDocuments(prev => prev.filter(d => d.id !== docId))
    } catch (e) {
      console.error("Delete failed", e)
    }
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Verified': return { color: 'text-success bg-success/10 border-success/20', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
      case 'Uploaded': return { color: 'text-primary bg-primary/10 border-primary/20', icon: <Clock className="w-3.5 h-3.5" /> }
      case 'Expired': return { color: 'text-warning bg-warning/10 border-warning/20', icon: <AlertCircle className="w-3.5 h-3.5" /> }
      default: return { color: 'text-danger bg-danger/10 border-danger/20', icon: <AlertCircle className="w-3.5 h-3.5" /> }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.webp" />
      
      <div className="bg-glass-surface p-6 rounded-[24px] border border-glass-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success" /> Permanent Document Vault
          </h2>
          <p className="text-[14px] text-muted-foreground mt-1 max-w-[600px]">
            Store your core identity documents securely. Once verified, the ClearPath Execution Layer can automatically attach these to scholarship applications.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[20px] font-bold text-foreground leading-none">{vaultMap.filter(v => v.status === 'Verified' || v.status === 'Uploaded').length} / {vaultMap.length}</div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Stored securely</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3 overflow-visible">
        {vaultMap.map(doc => {
          const config = getStatusConfig(doc.status)
          const isLoading = loading === doc.type
          const isImage = doc.mime_type?.startsWith('image/')

          return (
            <div key={doc.type} className="card-wrapper group/card-wrapper h-full">
              <div className="card-glow rounded-[20px]" />
              <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col h-full relative overflow-hidden">
                
                {/* Image Background Preview */}
                {doc.status !== 'Missing' && isImage && doc.file_url && (
                  <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
                    <img src={doc.file_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#071225] flex items-center justify-center border border-glass-border shadow-inner overflow-hidden">
                    {doc.status !== 'Missing' && isImage && doc.file_url ? (
                      <img src={doc.file_url} alt="Icon Preview" className="w-full h-full object-cover" />
                    ) : (
                      doc.status !== 'Missing' ? <FileText className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 backdrop-blur-md", config.color)}>
                    {config.icon} {doc.status}
                  </div>
                </div>

                <div className="flex-1 relative z-10">
                  <h3 className="text-[15px] font-semibold text-foreground">{doc.type}</h3>
                  <div className="text-[12px] text-muted-foreground mt-1">
                    {doc.updated_at ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground/80">Uploaded: {new Date(doc.updated_at).toLocaleDateString()}</span>
                        {doc.file_size > 0 && <span>Size: {formatBytes(doc.file_size)}</span>}
                      </div>
                    ) : 'No file uploaded yet'}
                  </div>
                </div>

                {/* Animated Hover Toolbar */}
                <div className="mt-6 flex items-center gap-2 relative z-10">
                  {doc.status === 'Missing' ? (
                    <Button 
                      onClick={() => triggerUpload(doc.type)} 
                      disabled={isLoading}
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-[10px] h-9 text-[12px] font-semibold"
                    >
                      {isLoading ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Uploading...</> : <><Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Securely</>}
                    </Button>
                  ) : (
                    <div className="flex-1 grid grid-cols-3 gap-2 opacity-100 sm:opacity-50 sm:group-hover/card-wrapper:opacity-100 transition-opacity">
                      <Button onClick={() => window.open(doc.file_url || '', '_blank')} variant="ghost" className="bg-glass-layer hover:bg-primary/20 border border-glass-border hover:border-primary/50 rounded-[10px] h-9 text-[12px] font-medium text-foreground hover:text-primary transition-all">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => triggerUpload(doc.type)} 
                        disabled={isLoading}
                        variant="ghost" 
                        className="bg-glass-layer hover:bg-glass-layer/80 border border-glass-border rounded-[10px] h-9 text-muted-foreground"
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      </Button>
                      <Button onClick={() => doc.id && handleDelete(doc.id, doc.type)} variant="ghost" className="bg-danger/5 hover:bg-danger/10 border border-danger/10 rounded-[10px] h-9 text-danger">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

