'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, GraduationCap, Crosshair, Sparkles, Save, AlertCircle } from "lucide-react"
import { updateEducationProfile, calculateLiveMatches } from '@/app/actions/settings-actions'
import { cn } from "@/lib/utils"

const TARGET_EXAMS = ['JEE', 'NEET', 'WBJEE', 'CUET', 'GATE', 'CAT', 'UPSC']
const INTERESTS = ['Engineering', 'Medical', 'Law', 'Design', 'Research', 'Government', 'Study Abroad']

export function EducationDashboard({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState(initialProfile || { target_exams: [], interests: [] })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  
  const [matches, setMatches] = useState({
    oppCount: 0,
    scholarshipCount: 0,
    schemesCount: 0,
    competitionsCount: 0
  })

  // Fetch live matches whenever profile changes
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const result = await calculateLiveMatches(profile)
        setMatches(result)
      } catch (err) {
        console.error("Failed to fetch matches", err)
      }
    }
    
    // Debounce the fetch to avoid spamming the DB
    const timeoutId = setTimeout(() => {
      fetchMatches()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateEducationProfile({
        stream: profile.stream,
        percentage: profile.percentage,
        cgpa: profile.cgpa,
        target_exams: profile.target_exams || [],
        interests: profile.interests || []
      })
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

  const toggleArrayItem = (field: 'target_exams' | 'interests', item: string) => {
    setProfile((prev: any) => {
      const current = prev[field] || []
      const next = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item]
      return { ...prev, [field]: next }
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* LEFT COLUMN: FORMS */}
      <div className="flex-1 flex flex-col gap-8">
        
        {/* ACADEMIC PROFILE */}
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[20px]" />
          <div className="liquid-glass-card overflow-hidden rounded-[20px]">
          <div className="p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-[16px] font-semibold">Academic Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="text-[13px] font-medium text-foreground">Academic Stream</Label>
                <select 
                  value={profile.stream || ''} 
                  onChange={e => handleChange('stream', e.target.value)}
                  className="h-11 bg-glass-layer border border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px] outline-none text-foreground w-full"
                >
                  <option value="" className="bg-background">Select Stream</option>
                  <option value="Science (PCM)" className="bg-background">Science (PCM)</option>
                  <option value="Science (PCB)" className="bg-background">Science (PCB)</option>
                  <option value="Commerce" className="bg-background">Commerce</option>
                  <option value="Arts/Humanities" className="bg-background">Arts / Humanities</option>
                  <option value="Diploma" className="bg-background">Diploma / ITI</option>
                  <option value="Other" className="bg-background">Other</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label className="text-[13px] font-medium text-foreground">Percentage (Latest)</Label>
                <Input 
                  value={profile.percentage || ''} 
                  onChange={e => handleChange('percentage', e.target.value)}
                  placeholder="e.g. 85.5%"
                  className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-[13px] font-medium text-foreground">CGPA</Label>
                <Input 
                  value={profile.cgpa || ''} 
                  onChange={e => handleChange('cgpa', e.target.value)}
                  placeholder="e.g. 8.5"
                  className="h-11 bg-glass-layer border-glass-border focus-visible:ring-primary rounded-xl px-4 text-[14px]"
                />
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* TARGET EXAMS */}
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[20px]" />
          <div className="liquid-glass-card overflow-hidden rounded-[20px]">
          <div className="p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
                <Crosshair className="h-5 w-5 text-danger" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold">Target Exams</h3>
                <p className="text-[12px] text-muted-foreground mt-1">Select exams to find specific preparation scholarships.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {TARGET_EXAMS.map(exam => {
                const isSelected = (profile.target_exams || []).includes(exam)
                return (
                  <button
                    key={exam}
                    onClick={() => toggleArrayItem('target_exams', exam)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[13px] font-medium transition-all border",
                      isSelected 
                        ? "bg-danger text-white border-danger shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                        : "bg-glass-layer text-muted-foreground border-glass-border hover:border-danger/50"
                    )}
                  >
                    {exam}
                  </button>
                )
              })}
            </div>
          </div>
          </div>
        </div>

        {/* INTERESTS */}
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[20px]" />
          <div className="liquid-glass-card overflow-hidden rounded-[20px]">
          <div className="p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold">Career Interests</h3>
                <p className="text-[12px] text-muted-foreground mt-1">Select domains for targeted opportunity matching.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {INTERESTS.map(interest => {
                const isSelected = (profile.interests || []).includes(interest)
                return (
                  <button
                    key={interest}
                    onClick={() => toggleArrayItem('interests', interest)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[13px] font-medium transition-all border",
                      isSelected 
                        ? "bg-success text-[#003B26] border-success shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                        : "bg-glass-layer text-muted-foreground border-glass-border hover:border-success/50"
                    )}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="card-wrapper group/card-wrapper">
          <div className="card-glow rounded-[20px]" />
          <div className="liquid-glass-card px-7 py-5 flex justify-end items-center gap-4 rounded-[20px]">
          {error && <span className="text-danger text-[13px] font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</span>}
          {saved && <span className="text-success text-[13px] font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Updated</span>}
          <Button onClick={handleSave} disabled={saving} className="btn-twilight h-10 px-8 rounded-xl font-medium text-[14px] flex items-center gap-2">
            {saving ? 'Syncing...' : <><Save className="w-4 h-4" /> Save Education Profile</>}
          </Button>
        </div>
        </div>

      </div>

      {/* RIGHT COLUMN: AUTO MATCHING ENGINE PREVIEW */}
      <div className="w-full lg:w-[350px] shrink-0">
        <div className="card-wrapper group/card-wrapper sticky top-[120px]">
          <div className="card-glow rounded-[32px]" />
          <div className="cinematic-glass-card p-6 overflow-hidden rounded-[32px]">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <h3 className="text-[14px] font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Matching Engine
          </h3>

          <div className="flex flex-col items-center justify-center mb-8 pt-4">
            <span className="text-[54px] font-bold text-white leading-none tracking-tighter shadow-twilight-glow">{matches.oppCount}</span>
            <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-widest mt-2">Potential Matches</span>
          </div>

          <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-[16px] border border-glass-border flex justify-between items-center group hover:bg-primary/5 transition-colors">
              <span className="text-[13px] font-medium text-foreground">Scholarships</span>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[12px] font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{matches.scholarshipCount}</span>
            </div>
            <div className="bg-black/20 p-4 rounded-[16px] border border-glass-border flex justify-between items-center group hover:bg-warning/5 transition-colors">
              <span className="text-[13px] font-medium text-foreground">Gov Schemes</span>
              <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-[12px] font-bold group-hover:bg-warning group-hover:text-warning-foreground transition-colors">{matches.schemesCount}</span>
            </div>
            <div className="bg-black/20 p-4 rounded-[16px] border border-glass-border flex justify-between items-center group hover:bg-success/5 transition-colors">
              <span className="text-[13px] font-medium text-foreground">Competitions</span>
              <span className="bg-success/20 text-success px-3 py-1 rounded-full text-[12px] font-bold group-hover:bg-success group-hover:text-white transition-colors">{matches.competitionsCount}</span>
            </div>
          </div>
          
          <p className="text-[11px] text-muted-foreground text-center mt-6 uppercase tracking-wider">
            Engine synchronizes instantly with changes
          </p>
        </div>
        </div>
      </div>

    </div>
  )
}
