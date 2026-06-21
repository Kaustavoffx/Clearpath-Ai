'use client'

import { useState } from 'react'
import { FileText, Upload, RefreshCw, Trash2, ShieldCheck, AlertCircle, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateDocumentStatus, addDocumentToVault } from '@/app/actions/settings-actions'
import { cn } from "@/lib/utils"

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

  // Map existing documents into the required list structure
  const vaultMap = REQUIRED_DOCUMENTS.map(docType => {
    const existing = documents.find(d => d.document_type === docType)
    return {
      type: docType,
      status: existing?.status || 'Missing',
      id: existing?.id || null,
      file_url: existing?.file_url || null,
      updated_at: existing?.updated_at || null
    }
  })

  const simulateUpload = async (docType: string) => {
    setLoading(docType)
    try {
      // Simulate network upload
      await new Promise(r => setTimeout(r, 1500))
      
      const existing = documents.find(d => d.document_type === docType)
      if (existing) {
        await updateDocumentStatus(existing.id, 'Uploaded')
        setDocuments(prev => prev.map(d => d.id === existing.id ? { ...d, status: 'Uploaded', updated_at: new Date().toISOString() } : d))
      } else {
        // Since we are mocking upload, we just add it to the state directly if backend insert succeeds
        await addDocumentToVault({ document_type: docType, status: 'Uploaded', file_url: '/mock-file.pdf' })
        // In a real app we'd fetch the new record, but we'll mock it
        setDocuments(prev => [...prev, { id: Math.random().toString(), document_type: docType, status: 'Uploaded', updated_at: new Date().toISOString() }])
      }
    } catch (e) {
      console.error("Failed to upload", e)
    } finally {
      setLoading(null)
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

          return (
            <div key={doc.type} className="card-wrapper group/card-wrapper h-full">
              <div className="card-glow rounded-[20px]" />
              <div className="liquid-glass-card p-5 border border-glass-border rounded-[20px] flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#071225] flex items-center justify-center border border-glass-border shadow-inner">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5", config.color)}>
                  {config.icon} {doc.status}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-foreground">{doc.type}</h3>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {doc.updated_at ? `Last updated: ${new Date(doc.updated_at).toLocaleDateString()}` : 'No file uploaded yet'}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {doc.status === 'Missing' ? (
                  <Button 
                    onClick={() => simulateUpload(doc.type)} 
                    disabled={isLoading}
                    className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-[10px] h-9 text-[12px] font-semibold"
                  >
                    {isLoading ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Uploading...</> : <><Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Securely</>}
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="flex-1 bg-glass-layer hover:bg-glass-layer/80 border border-glass-border rounded-[10px] h-9 text-[12px] font-medium text-foreground">
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </Button>
                    <Button 
                      onClick={() => simulateUpload(doc.type)} 
                      disabled={isLoading}
                      variant="ghost" 
                      className="w-9 h-9 p-0 bg-glass-layer hover:bg-glass-layer/80 border border-glass-border rounded-[10px] text-muted-foreground"
                    >
                      {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" className="w-9 h-9 p-0 bg-danger/5 hover:bg-danger/10 border border-danger/10 rounded-[10px] text-danger">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
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
