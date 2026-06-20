'use client'

import { useState } from 'react'
import { ShieldAlert, Key, Laptop, Smartphone, AlertCircle, Save, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSecuritySettings } from '@/app/actions/settings-actions'

export function SecurityCenter({ initialSecurity }: { initialSecurity: any }) {
  const [security, setSecurity] = useState(initialSecurity || {
    openai_key: '',
    gemini_key: '',
    deepgram_key: '',
  })
  
  // Masked state: If the DB returned a key, we display '********' so we don't expose it.
  const [keys, setKeys] = useState({
    openai_key: initialSecurity?.openai_key ? '********' : '',
    gemini_key: initialSecurity?.gemini_key ? '********' : '',
    deepgram_key: initialSecurity?.deepgram_key ? '********' : '',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      // We only want to send the key if it was modified (i.e. not '********')
      const payload: any = {}
      if (keys.openai_key !== '********' && keys.openai_key !== '') payload.openai_key = keys.openai_key
      if (keys.gemini_key !== '********' && keys.gemini_key !== '') payload.gemini_key = keys.gemini_key
      if (keys.deepgram_key !== '********' && keys.deepgram_key !== '') payload.deepgram_key = keys.deepgram_key

      // If they blanked it out, we might want to delete it, but let's assume blank means no change for now unless explicitly needed.
      // If we actually want to clear it, we could check for an empty string if they edited it. Let's send empty strings if they cleared the field.
      if (keys.openai_key === '') payload.openai_key = null
      if (keys.gemini_key === '') payload.gemini_key = null
      if (keys.deepgram_key === '') payload.deepgram_key = null

      await updateSecuritySettings(payload)
      setSaved(true)
      
      // Update local masked state after saving new keys
      setKeys(prev => ({
        openai_key: prev.openai_key && prev.openai_key !== '' ? '********' : '',
        gemini_key: prev.gemini_key && prev.gemini_key !== '' ? '********' : '',
        deepgram_key: prev.deepgram_key && prev.deepgram_key !== '' ? '********' : '',
      }))

      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* ACCOUNT SECURITY */}
      <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
        <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
          <ShieldAlert className="w-5 h-5 text-warning" /> Account Security
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-glass-layer border border-glass-border rounded-[16px]">
            <div>
              <div className="text-[13px] font-medium text-foreground">Password Authentication</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">Last changed 4 months ago</div>
            </div>
            <Button variant="outline" className="h-8 text-[12px] font-semibold border-glass-border">Change Password</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-glass-layer border border-glass-border rounded-[16px]">
            <div>
              <div className="text-[13px] font-medium text-foreground">Two-Factor Authentication (2FA)</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">Protect your account with an extra security layer</div>
            </div>
            <Button variant="outline" className="h-8 text-[12px] font-semibold border-glass-border">Enable 2FA</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* API SECURITY */}
        <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border flex flex-col h-full">
          <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6 shrink-0">
            <Key className="w-5 h-5 text-success" /> API Key Management
          </h3>
          <p className="text-[12px] text-muted-foreground mb-6">
            Provide your own API keys to bypass the Free Plan limits. Keys are encrypted at rest and never exposed.
          </p>
          
          <div className="space-y-4 flex-1">
            <div className="grid gap-2">
              <Label className="text-[12px] font-medium text-foreground">OpenAI API Key</Label>
              <Input 
                type="password"
                value={keys.openai_key}
                onChange={e => setKeys(prev => ({ ...prev, openai_key: e.target.value }))}
                placeholder="sk-..."
                className="h-10 bg-black/20 border-glass-border focus-visible:ring-success rounded-xl px-4 text-[13px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[12px] font-medium text-foreground">Gemini API Key</Label>
              <Input 
                type="password"
                value={keys.gemini_key}
                onChange={e => setKeys(prev => ({ ...prev, gemini_key: e.target.value }))}
                placeholder="AIzaSy..."
                className="h-10 bg-black/20 border-glass-border focus-visible:ring-success rounded-xl px-4 text-[13px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[12px] font-medium text-foreground">Deepgram API Key</Label>
              <Input 
                type="password"
                value={keys.deepgram_key}
                onChange={e => setKeys(prev => ({ ...prev, deepgram_key: e.target.value }))}
                placeholder="dg..."
                className="h-10 bg-black/20 border-glass-border focus-visible:ring-success rounded-xl px-4 text-[13px]"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="h-9 px-6 bg-success hover:bg-success/90 text-white rounded-[10px] text-[12px] font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {saving ? 'Encrypting...' : 'Save Keys securely'}
            </Button>
          </div>
        </div>

        {/* ACTIVE SESSIONS */}
        <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border h-full">
          <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
            <Laptop className="w-5 h-5 text-primary" /> Active Sessions
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/20 rounded-[16px]">
              <Laptop className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] font-medium text-foreground flex justify-between">
                  <span>Chrome Desktop</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-success bg-success/20 px-2 py-0.5 rounded">Current</span>
                </div>
                <div className="text-[12px] text-muted-foreground mt-1">Windows • Kolkata, India</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-glass-layer border border-glass-border rounded-[16px]">
              <Smartphone className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] font-medium text-foreground">Android Phone</div>
                <div className="text-[12px] text-muted-foreground mt-1">Android 14 • Last active 2h ago</div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="ghost" className="w-full text-danger hover:text-danger hover:bg-danger/10 border border-danger/20 text-[13px] font-semibold h-10 rounded-[12px]">
                Log Out All Other Devices
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
