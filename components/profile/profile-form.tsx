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
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setProfile(getStudentProfile())
  }, [])

  if (!profile) return null

  const handleSave = () => {
    saveStudentProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="glass-thick rounded-apple-xl border border-apple-glass-border shadow-apple-md relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-apple-glass-border pb-8 mb-8">
          <div className="h-20 w-20 shrink-0 rounded-full bg-background/50 border border-apple-glass-highlight flex items-center justify-center shadow-inner relative group cursor-pointer">
            <UserCircle className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">AI Evaluation Profile</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-md leading-relaxed">
              We use this local data to match your context against bureaucratic eligibility criteria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground ml-1">Legal Name</Label>
            <Input 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
            />
          </div>
          
          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground ml-1">Academic Status</Label>
            <Input 
              value={profile.gradeLevel} 
              onChange={e => setProfile({...profile, gradeLevel: e.target.value})}
              placeholder="e.g. Class 12, Undergraduate" 
              className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground ml-1">State / Region</Label>
            <Input 
              value={profile.state} 
              onChange={e => setProfile({...profile, state: e.target.value})}
              placeholder="e.g. West Bengal" 
              className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground ml-1">Family Income Range</Label>
            <Input 
              value={profile.incomeRange} 
              onChange={e => setProfile({...profile, incomeRange: e.target.value})}
              placeholder="e.g. Below ₹2.5L" 
              className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground ml-1">Social Category</Label>
            <Input 
              value={profile.category} 
              onChange={e => setProfile({...profile, category: e.target.value})}
              placeholder="e.g. General, OBC, SC/ST" 
              className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-foreground ml-1">Career Interest</Label>
            <Input 
              value={profile.careerInterest} 
              onChange={e => setProfile({...profile, careerInterest: e.target.value})}
              placeholder="e.g. Engineering, Arts" 
              className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-muted/10 border-t border-apple-glass-border px-8 sm:px-10 py-6 flex justify-end items-center gap-4">
        {saved && <span className="text-success text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Profile Updated</span>}
        <Button onClick={handleSave} className="h-12 px-8 rounded-apple-md font-medium text-base shadow-apple-sm spring-active">
          Save AI Context
        </Button>
      </div>
    </div>
  )
}
