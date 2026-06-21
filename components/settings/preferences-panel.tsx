'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Monitor, Moon, Sun, Bell, Zap, Sliders, CheckCircle2, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updatePreferences } from '@/app/actions/settings-actions'
import { cn } from "@/lib/utils"

export function PreferencesPanel({ initialPreferences }: { initialPreferences: any }) {
  const [prefs, setPrefs] = useState(initialPreferences || {
    appearance: 'Auto',
    default_ai_provider: 'Auto',
    notification_deadline: true,
    notification_document: true,
    notification_weekly: true,
    notification_suggestions: true,
    workspace_mode: 'Detailed Mode',
    reduce_motion: false
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updatePreferences(prefs)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleBoolean = (field: string) => {
    setPrefs((prev: any) => ({ ...prev, [field]: !prev[field] }))
  }

  const setChoice = (field: string, value: string) => {
    setPrefs((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      
      {/* APPEARANCE */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[24px]" />
        <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
        <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
          <Monitor className="w-5 h-5 text-primary" /> System Appearance
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { id: 'Light', icon: <Sun className="w-5 h-5" /> },
            { id: 'Dark', icon: <Moon className="w-5 h-5" /> },
            { id: 'Neutral', icon: <Sliders className="w-5 h-5" /> },
            { id: 'Auto', icon: <Monitor className="w-5 h-5" /> }
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => setChoice('appearance', theme.id)}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-[16px] border transition-all gap-3",
                prefs.appearance === theme.id 
                  ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(113,97,239,0.15)] text-primary" 
                  : "bg-glass-layer border-glass-border text-muted-foreground hover:bg-glass-surface"
              )}
            >
              {theme.icon}
              <span className="text-[13px] font-medium">{theme.id}</span>
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-3 overflow-visible">
        
        {/* NOTIFICATION CENTER */}
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[24px]" />
          <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border h-full">
          <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-warning" /> Notification Center
          </h3>
          
          <div className="space-y-6">
            {[
              { id: 'notification_deadline', label: 'Deadline Alerts', desc: 'Get notified 7 days before an opportunity deadline closes.' },
              { id: 'notification_document', label: 'Document Reminders', desc: 'Alerts for expired or missing critical documents.' },
              { id: 'notification_weekly', label: 'Weekly Reports', desc: 'Summary of new scholarships added to your dashboard.' },
              { id: 'notification_suggestions', label: 'Opportunity Suggestions', desc: 'Push notifications when a perfect AI match is found.' }
            ].map(notif => (
              <div key={notif.id} className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-medium text-foreground">{notif.label}</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{notif.desc}</p>
                </div>
                <button
                  onClick={() => toggleBoolean(notif.id)}
                  className={cn(
                    "w-11 h-6 rounded-full relative transition-colors shrink-0",
                    prefs[notif.id] ? "bg-primary" : "bg-glass-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                    prefs[notif.id] ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* AI SETTINGS */}
          <div className="card-wrapper group/card-wrapper">
            <div className="card-glow rounded-[24px]" />
            <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
            <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-success" /> AI Engine Routing
            </h3>
            
            <div className="space-y-3">
              {[
                { id: 'Auto', label: 'Auto-Routing (Recommended)', desc: 'OS routes to the best model automatically.' },
                { id: 'OpenAI', label: 'Force OpenAI GPT-4o', desc: 'Highest reasoning capability.' },
                { id: 'Gemini', label: 'Force Gemini 1.5 Pro', desc: 'Best for massive document contexts.' }
              ].map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setChoice('default_ai_provider', provider.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-[12px] border transition-all text-left",
                    prefs.default_ai_provider === provider.id
                      ? "bg-success/5 border-success/30"
                      : "bg-glass-layer border-glass-border hover:bg-glass-surface"
                  )}
                >
                  <div>
                    <div className={cn("text-[13px] font-medium", prefs.default_ai_provider === provider.id ? "text-success" : "text-foreground")}>{provider.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{provider.desc}</div>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    prefs.default_ai_provider === provider.id ? "border-success" : "border-glass-border"
                  )}>
                    {prefs.default_ai_provider === provider.id && <div className="w-2 h-2 rounded-full bg-success" />}
                  </div>
                </button>
              ))}
            </div>
            </div>
          </div>

          {/* WORKSPACE & ACCESSIBILITY */}
          <div className="card-wrapper group/card-wrapper">
            <div className="card-glow rounded-[24px]" />
            <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
            <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
              <SettingsIcon className="w-5 h-5 text-primary" /> Workspace Accessibility
            </h3>
            
            <div className="space-y-6">
              <div className="grid gap-2">
                <div className="text-[13px] font-medium text-foreground">Dashboard Density</div>
                <div className="flex bg-glass-layer border border-glass-border rounded-xl p-1">
                  <button onClick={() => setChoice('workspace_mode', 'Compact Mode')} className={cn("flex-1 text-[12px] font-medium py-2 rounded-lg transition-colors", prefs.workspace_mode === 'Compact Mode' ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>Compact</button>
                  <button onClick={() => setChoice('workspace_mode', 'Detailed Mode')} className={cn("flex-1 text-[12px] font-medium py-2 rounded-lg transition-colors", prefs.workspace_mode === 'Detailed Mode' ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>Detailed</button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[13px] font-medium text-foreground">Reduce Motion</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Disable cinematic glass blurs and animations for low-end devices.</p>
                </div>
                <button
                  onClick={() => toggleBoolean('reduce_motion')}
                  className={cn(
                    "w-11 h-6 rounded-full relative transition-colors shrink-0",
                    prefs.reduce_motion ? "bg-primary" : "bg-glass-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                    prefs.reduce_motion ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

      </div>

      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[20px]" />
        <div className="liquid-glass-card px-7 py-5 flex justify-end items-center gap-4 rounded-[20px]">
        {error && <span className="text-danger text-[13px] font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</span>}
        {saved && <span className="text-success text-[13px] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Preferences Updated</span>}
        <Button onClick={handleSave} disabled={saving} className="btn-twilight h-10 px-8 rounded-xl font-medium text-[14px] flex items-center gap-2">
          {saving ? 'Syncing...' : <><Save className="w-4 h-4" /> Save Preferences</>}
        </Button>
      </div>
      </div>

    </div>
  )
}
