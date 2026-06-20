'use client'

import React, { useState } from 'react'
import { CheckCircle2, Upload, FileText, XCircle, RefreshCw, Eye, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DocumentItem {
  id?: string;
  name: string;
  status: 'missing' | 'uploaded' | 'verified';
}

interface DocumentChecklistProps {
  requiredDocuments: string[];
  existingDocuments: DocumentItem[];
  opportunityId: string;
}

export function DocumentChecklist({ requiredDocuments, existingDocuments, opportunityId }: DocumentChecklistProps) {
  // Merge required documents from the AI analysis with the ones saved in the DB
  const [docs, setDocs] = useState<DocumentItem[]>(() => {
    const map = new Map<string, DocumentItem>();
    
    requiredDocuments.forEach(docName => {
      map.set(docName, { name: docName, status: 'missing' });
    });

    existingDocuments.forEach(doc => {
      if (doc.name) {
        map.set(doc.name, doc);
      }
    });

    return Array.from(map.values());
  });

  const handleStatusToggle = (index: number) => {
    const newDocs = [...docs];
    const current = newDocs[index].status;
    if (current === 'missing') newDocs[index].status = 'uploaded';
    else if (current === 'uploaded') newDocs[index].status = 'verified';
    else newDocs[index].status = 'missing';
    setDocs(newDocs);
    // In a real implementation, this would trigger an API call to save to `opportunity_documents`
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Required Documents
        </h3>
        
        <div className="space-y-3">
          {docs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed border-glass-border rounded-2xl">
              No specific documents found.
            </div>
          ) : docs.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-glass-surface/50 border border-glass-border rounded-[16px] group transition-all hover:bg-glass-surface">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleStatusToggle(i)}
                  className="shrink-0 transition-transform hover:scale-110"
                >
                  {doc.status === 'verified' ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : doc.status === 'uploaded' ? (
                    <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-glass-border"></div>
                  )}
                </button>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[15px] font-medium transition-colors",
                    doc.status === 'missing' ? "text-foreground" : "text-foreground/80"
                  )}>{doc.name}</span>
                  <span className={cn(
                    "text-[11px] uppercase tracking-wider font-semibold",
                    doc.status === 'verified' ? "text-success" : 
                    doc.status === 'uploaded' ? "text-primary" : "text-danger"
                  )}>{doc.status}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {doc.status === 'missing' ? (
                  <button className="p-2 bg-glass-surface rounded-full border border-glass-border hover:bg-glass-layer hover:text-primary transition-colors">
                    <Upload className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button className="p-2 bg-glass-surface rounded-full border border-glass-border hover:bg-glass-layer hover:text-foreground transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-glass-surface rounded-full border border-glass-border hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" /> Document Vault
        </h3>
        <div className="liquid-glass-card p-6 border border-glass-border rounded-[24px] flex flex-col h-[300px]">
          <p className="text-[13px] text-muted-foreground mb-4">
            Upload reusable documents here to instantly fulfill requirements across multiple opportunities.
          </p>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-glass-border rounded-[16px] text-muted-foreground hover:bg-glass-surface/50 hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 opacity-50 group-hover:text-primary group-hover:opacity-100 transition-colors" />
                <span className="text-[14px] font-semibold">Upload New Document</span>
              </div>
            </div>
            
            {/* Example mock vault documents for UI demonstration */}
            <div className="flex items-center justify-between p-3 bg-glass-surface border border-glass-border rounded-[12px]">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-medium text-foreground">Income Certificate_2026.pdf</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] uppercase">Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-glass-surface border border-glass-border rounded-[12px]">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-medium text-foreground">Aadhaar_Card_Front.jpg</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] uppercase">Verified</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
