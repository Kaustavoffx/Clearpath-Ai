'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getStudentProfile, saveStudentProfile, StudentProfile } from "@/lib/profile-store"
import { CheckCircle2, UserCircle, Sparkles } from "lucide-react"

export function ProfileForm() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(getStudentProfile())
  }, [])

  if (!profile) return null

  const handleSave = () => {
    saveStudentProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="liquid-glass-card overflow-hidden">
      <div className="p-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-glass-border pb-6 mb-6">
          <div className="h-16 w-16 shrink-0 rounded-full bg-[#071225] border border-glass-border flex items-center justify-center relative">
            <UserCircle className="h-9 w-9 text-muted-foreground" />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#858AE3] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-[#030712]" />
            </div>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold tracking-[-0.01em]">AI Evaluation Profile</h3>
            <p className="text-muted-foreground text-[13px] mt-0.5 max-w-md leading-relaxed">
              Local data used to match your context against eligibility criteria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <div className="grid gap-2">
            <Label className="text-[13px] font-medium text-foreground">Legal Name</Label>
            <Input 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label className="text-[13px] font-medium text-foreground">Academic Status</Label>
            <Input 
              value={profile.gradeLevel} 
              onChange={e => setProfile({...profile, gradeLevel: e.target.value})}
              placeholder="e.g. Class 12, Undergraduate" 
              className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[13px] font-medium text-foreground">State / Region</Label>
            <Input 
              value={profile.state} 
              onChange={e => setProfile({...profile, state: e.target.value})}
              placeholder="e.g. West Bengal" 
              className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[13px] font-medium text-foreground">Family Income Range</Label>
            <Input 
              value={profile.incomeRange} 
              onChange={e => setProfile({...profile, incomeRange: e.target.value})}
              placeholder="e.g. Below ₹2.5L" 
              className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[13px] font-medium text-foreground">Social Category</Label>
            <Input 
              value={profile.category} 
              onChange={e => setProfile({...profile, category: e.target.value})}
              placeholder="e.g. General, OBC, SC/ST" 
              className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[13px] font-medium text-foreground">Career Interest</Label>
            <Input 
              value={profile.careerInterest} 
              onChange={e => setProfile({...profile, careerInterest: e.target.value})}
              placeholder="e.g. Engineering, Arts" 
              className="h-11 bg-[#071225]/40 border-glass-border focus-visible:ring-[#858AE3] rounded-xl px-4 text-[14px]"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-glass-border px-7 py-5 flex justify-end items-center gap-4 bg-[#071225]/30">
        {saved && <span className="text-[#93CAF6] text-[13px] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Profile Updated</span>}
        <Button onClick={handleSave} className="h-10 px-6 rounded-xl font-medium text-[14px]">
          Save AI Context
        </Button>
      </div>
    </div>
  )
}
