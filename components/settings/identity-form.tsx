'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, UserCircle, Sparkles, Building, Landmark, Save, AlertCircle } from "lucide-react"
import { updateIdentityProfile } from '@/app/actions/settings-actions'

export function IdentityForm({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState(initialProfile || {})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateIdentityProfile(profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-8">
      {/* PERSONAL PROFILE */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[20px]" />
        <div className="liquid-glass-card overflow-hidden rounded-[20px]">
          <div className="p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-glass-border pb-6 mb-6">
            <div className="h-16 w-16 shrink-0 rounded-full bg-[#071225] border border-glass-border flex items-center justify-center relative overflow-hidden group">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="h-9 w-9 text-muted-foreground" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] uppercase font-bold text-white">Edit</span>
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-[#030712]" />
              </div>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Personal Profile</h3>
              <p className="text-muted-foreground text-[13px] mt-0.5 max-w-md leading-relaxed">
                Your core identity used across the ClearPath ecosystem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">First Name</Label>
              <Input 
                value={profile.first_name || ''} 
                onChange={e => handleChange('first_name', e.target.value)}
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Last Name</Label>
              <Input 
                value={profile.last_name || ''} 
                onChange={e => handleChange('last_name', e.target.value)}
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Display Name</Label>
              <Input 
                value={profile.display_name || ''} 
                onChange={e => handleChange('display_name', e.target.value)}
                placeholder="How you appear in the OS"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Phone Number</Label>
              <Input 
                value={profile.phone || ''} 
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+91"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* STUDENT PROFILE */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[20px]" />
        <div className="liquid-glass-card overflow-hidden rounded-[20px]">
          <div className="p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-glass-border pb-6 mb-6">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Student Profile</h3>
              <p className="text-muted-foreground text-[13px] mt-0.5 max-w-md leading-relaxed">
                Institutional details used for basic eligibility matching.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Current Class / Year</Label>
              <Input 
                value={profile.current_class || ''} 
                onChange={e => handleChange('current_class', e.target.value)}
                placeholder="e.g. 12th, 2nd Year UG"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Education Board</Label>
              <Input 
                value={profile.board || ''} 
                onChange={e => handleChange('board', e.target.value)}
                placeholder="e.g. CBSE, ICSE, State Board"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-[13px] font-medium text-foreground">Institution Name</Label>
              <Input 
                value={profile.institution || ''} 
                onChange={e => handleChange('institution', e.target.value)}
                placeholder="e.g. Delhi Public School"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Graduation Year</Label>
              <Input 
                value={profile.graduation_year || ''} 
                onChange={e => handleChange('graduation_year', e.target.value)}
                placeholder="e.g. 2025"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* OPPORTUNITY CONTEXT */}
      <div className="card-wrapper group/card-wrapper">
        <div className="card-glow rounded-[20px]" />
        <div className="liquid-glass-card overflow-hidden rounded-[20px]">
          <div className="p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-glass-border pb-6 mb-6">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
              <Landmark className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Opportunity Context</h3>
              <p className="text-muted-foreground text-[13px] mt-0.5 max-w-md leading-relaxed">
                Vital for uncovering state-sponsored schemes and reserved quotas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">State of Domicile</Label>
              <Input 
                value={profile.state || ''} 
                onChange={e => handleChange('state', e.target.value)}
                placeholder="e.g. West Bengal"
                className="h-11 bg-glass-layer border-glass-border focus-visible:ring-warning rounded-xl px-4 text-[14px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Social Category</Label>
              <select 
                value={profile.social_category || ''} 
                onChange={e => handleChange('social_category', e.target.value)}
                className="h-11 bg-glass-layer border border-glass-border focus-visible:ring-warning rounded-xl px-4 text-[14px] outline-none text-foreground w-full"
              >
                <option value="" className="bg-background">Select Category</option>
                <option value="General" className="bg-background">General</option>
                <option value="OBC" className="bg-background">OBC</option>
                <option value="SC" className="bg-background">SC</option>
                <option value="ST" className="bg-background">ST</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Annual Family Income</Label>
              <select 
                value={profile.annual_income || ''} 
                onChange={e => handleChange('annual_income', e.target.value)}
                className="h-11 bg-glass-layer border border-glass-border focus-visible:ring-warning rounded-xl px-4 text-[14px] outline-none text-foreground w-full"
              >
                <option value="" className="bg-background">Select Range</option>
                <option value="<2.5L" className="bg-background">Less than ₹2.5 Lakhs</option>
                <option value="2.5L-5L" className="bg-background">₹2.5 Lakhs - ₹5 Lakhs</option>
                <option value="5L-8L" className="bg-background">₹5 Lakhs - ₹8 Lakhs</option>
                <option value=">8L" className="bg-background">Above ₹8 Lakhs</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Gender (Optional)</Label>
              <select 
                value={profile.gender || ''} 
                onChange={e => handleChange('gender', e.target.value)}
                className="h-11 bg-glass-layer border border-glass-border focus-visible:ring-warning rounded-xl px-4 text-[14px] outline-none text-foreground w-full"
              >
                <option value="" className="bg-background">Select Gender</option>
                <option value="Male" className="bg-background">Male</option>
                <option value="Female" className="bg-background">Female</option>
                <option value="Other" className="bg-background">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Disability Status</Label>
              <select 
                value={profile.disability_status || ''} 
                onChange={e => handleChange('disability_status', e.target.value)}
                className="h-11 bg-glass-layer border border-glass-border focus-visible:ring-warning rounded-xl px-4 text-[14px] outline-none text-foreground w-full"
              >
                <option value="" className="bg-background">Not Applicable</option>
                <option value="PwD" className="bg-background">Person with Disability (PwD)</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label className="text-[13px] font-medium text-foreground">Minority Status</Label>
              <select 
                value={profile.minority_status || ''} 
                onChange={e => handleChange('minority_status', e.target.value)}
                className="h-11 bg-glass-layer border border-glass-border focus-visible:ring-warning rounded-xl px-4 text-[14px] outline-none text-foreground w-full"
              >
                <option value="" className="bg-background">Not Applicable</option>
                <option value="Minority" className="bg-background">Recognized Minority</option>
              </select>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="sticky bottom-6 z-20">
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[20px]" />
          <div className="liquid-glass-card px-7 py-5 flex justify-end items-center gap-4 border border-glass-border shadow-twilight-glow rounded-[20px]">
        {error && <span className="text-danger text-[13px] font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</span>}
        {saved && <span className="text-success text-[13px] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Changes Applied</span>}
        <Button onClick={handleSave} disabled={saving} className="btn-twilight h-10 px-8 rounded-xl font-medium text-[14px] flex items-center gap-2">
          {saving ? 'Synchronizing...' : <><Save className="w-4 h-4" /> Save Identity State</>}
        </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
