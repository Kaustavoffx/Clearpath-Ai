'use client'

import React from 'react'
import { Download, CalendarDays, Share2, Mail, Link as LinkIcon, FileText, CheckCircle2 } from 'lucide-react'

import { generateShareToken, logExportActivity } from '@/app/actions/export-actions'
import { toast } from 'sonner'

export function ExportCenter({ opportunityData }: { opportunityData: any }) {
  const handleExport = async (type: string) => {
    try {
      if (type === 'google-calendar') {
        const text = encodeURIComponent(`ClearPath OS: ${opportunityData.title}`);
        const details = encodeURIComponent(`Action plan for ${opportunityData.title}`);
        let dates = '';
        if (opportunityData.deadline) {
          const d = new Date(opportunityData.deadline).toISOString().replace(/-|:|\.\d\d\d/g, "");
          dates = `&dates=${d}/${d}`;
        }
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}${dates}`, '_blank');
        await logExportActivity(opportunityData.id, 'Google Calendar');
      } else if (type === 'ics') {
        const text = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:ClearPath OS: ${opportunityData.title}\nDTSTART:${opportunityData.deadline ? new Date(opportunityData.deadline).toISOString().replace(/-|:|\.\d\d\d/g, "") : ''}\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([text], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clearpath_${opportunityData.id}.ics`;
        a.click();
        await logExportActivity(opportunityData.id, 'ICS');
      } else if (type === 'pdf') {
        window.print();
        await logExportActivity(opportunityData.id, 'PDF');
      } else if (type === 'link') {
        toast.promise(
          generateShareToken(opportunityData.id),
          {
            loading: 'Generating secure link...',
            success: (token) => {
              const link = `${window.location.origin}/share/${token}`;
              navigator.clipboard.writeText(link);
              return 'Secure link copied to clipboard!';
            },
            error: 'Failed to generate link'
          }
        );
      }
    } catch (e) {
      toast.error('Export failed');
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Calendar Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <CalendarDays className="w-5 h-5 text-primary" /> Calendar & Sync
        </h3>
        <div className="liquid-glass-card p-6 rounded-[24px] border border-glass-border space-y-6">
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Never miss a deadline. Sync the critical dates and task milestones directly to your calendar.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleExport('google-calendar')}
              className="w-full flex items-center justify-between p-4 bg-glass-surface/50 border border-glass-border rounded-[16px] hover:bg-glass-layer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h5.5c-.32 1.64-1.6 2.88-3.3 3.14v2.53h5.08c2.97-2.73 3.23-7.23 1.89-8.4z"/><path fill="#34A853" d="M12.18 21.6c2.72 0 5.08-.88 6.84-2.4l-5.08-2.53c-1.12.78-2.5 1.1-3.77.92-2.8-.4-4.9-2.7-5.18-5.5H.17v2.66C2.26 18.8 6.83 21.6 12.18 21.6z"/><path fill="#FBBC05" d="M7.01 12.08c-.18-.74-.18-1.54 0-2.28V7.14H.17c-1.6 3.16-1.6 6.88 0 10.04l6.84-5.1z"/><path fill="#EA4335" d="M12.18 4.67c1.47-.04 2.88.5 3.96 1.5l2.94-2.94C17.06 1.25 14.7.2 12.18.2 6.83.2 2.26 3.02.17 7.14l6.84 5.1c.36-2.8 2.5-4.98 5.17-5.1z"/></svg>
                </div>
                <span className="text-[15px] font-medium text-foreground">Google Calendar</span>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            
            <button 
              onClick={() => handleExport('ics')}
              className="w-full flex items-center justify-between p-4 bg-glass-surface/50 border border-glass-border rounded-[16px] hover:bg-glass-layer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[15px] font-medium text-foreground">Download .ics file</span>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Share & Export */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <Share2 className="w-5 h-5 text-primary" /> Share & Export
        </h3>
        <div className="liquid-glass-card p-6 rounded-[24px] border border-glass-border space-y-6">
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Generate a secure link to share your action plan with an advisor, or download it as a formal PDF.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center justify-between p-4 bg-glass-surface/50 border border-glass-border rounded-[16px] hover:bg-glass-layer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-danger" />
                </div>
                <span className="text-[15px] font-medium text-foreground">Export PDF Report</span>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-danger transition-colors" />
            </button>
            
            <button 
              onClick={() => handleExport('link')}
              className="w-full flex items-center justify-between p-4 bg-glass-surface/50 border border-glass-border rounded-[16px] hover:bg-glass-layer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-[15px] font-medium text-foreground">Copy Secure Link</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-success opacity-0 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
