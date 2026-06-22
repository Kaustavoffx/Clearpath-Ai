'use client'

import { useState } from 'react'
import { ShieldAlert, Key, Laptop, Smartphone, AlertCircle, Save, CheckCircle2, Monitor, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSecuritySettings } from '@/app/actions/settings-actions'
import { createClient } from '@/lib/supabase/client'

export function SecurityCenter({ initialSecurity, initialSessions }: { initialSecurity: any, initialSessions: any[] }) {
  const [security, setSecurity] = useState(initialSecurity || {
    openai_key: '',
    gemini_key: '',
    deepgram_key: '',
  })
  
  const [sessions, setSessions] = useState<any[]>(initialSessions || [])
  const supabase = createClient()

  const [keys, setKeys] = useState({
    openai_key: initialSecurity?.openai_key ? '********' : '',
    gemini_key: initialSecurity?.gemini_key ? '********' : '',
    deepgram_key: initialSecurity?.deepgram_key ? '********' : '',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [advancedMode, setAdvancedMode] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload: any = {}
      if (keys.openai_key !== '********' && keys.openai_key !== '') payload.openai_key = keys.openai_key
      if (keys.gemini_key !== '********' && keys.gemini_key !== '') payload.gemini_key = keys.gemini_key
      if (keys.deepgram_key !== '********' && keys.deepgram_key !== '') payload.deepgram_key = keys.deepgram_key

      if (keys.openai_key === '') payload.openai_key = null
      if (keys.gemini_key === '') payload.gemini_key = null
      if (keys.deepgram_key === '') payload.deepgram_key = null

      await updateSecuritySettings(payload)
      setSaved(true)
      
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

  const handleLogoutOtherDevices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      // Delete all sessions except the most recent one (mock logic for current session)
      if (sessions.length > 0) {
        const currentSessionId = sessions[0].id
        await supabase.from('user_sessions').delete().eq('user_id', user.id).neq('id', currentSessionId)
        setSessions(prev => prev.filter(s => s.id === currentSessionId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* ACCOUNT SECURITY */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[24px]" />
        <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border">
          <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-warning" /> Account Security
          </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-glass-layer border border-glass-border rounded-[16px]">
            <div>
              <div className="text-[13px] font-medium text-foreground">Password Authentication</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">Last changed 118 days ago</div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-3 overflow-visible">
        
        {/* API SECURITY */}
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[24px]" />
          <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border flex flex-col h-full">
            <h3 className="text-[16px] font-semibold text-foreground flex items-center justify-between gap-2 mb-6 shrink-0">
              <span className="flex items-center gap-2">
                <Key className="w-5 h-5 text-success" /> API Settings
              </span>
              <Button
                variant="ghost"
                onClick={() => setAdvancedMode(!advancedMode)}
                className="h-8 text-[12px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Advanced Configuration
              </Button>
            </h3>

          {!advancedMode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-glass-layer border border-glass-border rounded-[16px]">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <h4 className="text-[14px] font-medium text-foreground mb-2">Platform APIs Active</h4>
              <p className="text-[12px] text-muted-foreground">
                ClearPath Advisor is fully powered by our secure server-side infrastructure. No configuration is required.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-muted-foreground mb-6">
                Developer Options: Provide your own API keys to bypass the Free Plan limits. Keys are encrypted at rest and never exposed.
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
            </>
          )}
          </div>
          </div>

        {/* ACTIVE SESSIONS */}
        <div className="card-wrapper group/card-wrapper h-full">
          <div className="card-glow rounded-[24px]" />
          <div className="liquid-glass-card p-7 rounded-[24px] border border-glass-border h-full">
            <h3 className="text-[16px] font-semibold text-foreground flex items-center gap-2 mb-6">
              <Laptop className="w-5 h-5 text-primary" /> Active Sessions
            </h3>
          
          <div className="space-y-4">
            {sessions.length > 0 ? sessions.map((session, index) => {
              const isCurrent = index === 0; // Assuming newest is current
              const Icon = session.device_name?.toLowerCase().includes('mobile') || session.os?.toLowerCase().includes('android') || session.os?.toLowerCase().includes('ios') ? Smartphone : Monitor;
              return (
                <div key={session.id} className={`flex items-start gap-4 p-4 ${isCurrent ? 'bg-primary/5 border-primary/20' : 'bg-glass-layer border-glass-border'} border rounded-[16px]`}>
                  <Icon className={`w-6 h-6 ${isCurrent ? 'text-primary' : 'text-muted-foreground'} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-foreground flex justify-between">
                      <span>{session.browser || 'Browser'} Desktop</span>
                      {isCurrent && <span className="text-[10px] uppercase tracking-widest font-bold text-success bg-success/20 px-2 py-0.5 rounded">Current</span>}
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-1">
                      {session.os || 'OS'} • {isCurrent ? 'Active now' : `Last active ${getTimeAgo(session.last_active)}`}
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center p-4 text-muted-foreground text-[13px]">No active sessions found.</div>
            )}
            
            {sessions.length > 1 && (
              <div className="pt-4">
                <Button onClick={handleLogoutOtherDevices} variant="ghost" className="w-full text-danger hover:text-danger hover:bg-danger/10 border border-danger/20 text-[13px] font-semibold h-10 rounded-[12px]">
                  Log Out All Other Devices
                </Button>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

    </div>
  )
}
