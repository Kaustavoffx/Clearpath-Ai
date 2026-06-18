'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { signup } from '@/app/(auth)/actions'

export function RegisterForm({ error }: { error?: string }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    grade: '',
    studentType: '',
    goals: '',
    full_name: '',
    email: '',
    password: ''
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  return (
    <div className="w-full max-w-[400px]">
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center justify-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-apple-sm bg-primary flex items-center justify-center shadow-apple-sm">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-xl tracking-tight">ClearPath OS</span>
      </div>

      <div className="mb-8">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        )}
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-primary/20'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-primary/20'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-primary/20'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 4 ? 'bg-primary' : 'bg-primary/20'}`} />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight mb-2">
          {step === 1 && "What's your current grade?"}
          {step === 2 && "What type of student are you?"}
          {step === 3 && "What's your primary goal?"}
          {step === 4 && `Welcome, ${formData.full_name.split(' ')[0] || 'Student'}!`}
        </h2>
        <p className="text-muted-foreground">
          {step === 1 && "This helps us filter irrelevant opportunities."}
          {step === 2 && "Select the category that best describes you."}
          {step === 3 && "We'll prioritize opportunities that match."}
          {step === 4 && "Let's secure your account to get started."}
        </p>
      </div>

      <div className="glass-regular p-8 sm:p-10 rounded-apple-xl relative overflow-hidden">
        
        {step === 1 && (
          <div className="grid gap-4">
            {['10th Grade', '11th Grade', '12th Grade', 'Undergrad 1st Year', 'Undergrad 2nd+ Year'].map((g) => (
              <button
                key={g}
                onClick={() => { setFormData({ ...formData, grade: g }); nextStep() }}
                className={`p-4 rounded-apple-md border text-left font-medium transition-all spring-transition ${formData.grade === g ? 'border-primary bg-primary/10 text-primary' : 'border-apple-glass-border hover:border-primary/50'}`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
             {['Merit Student', 'Financial Aid Seeker', 'Sports/Extra-curricular', 'All-Rounder'].map((t) => (
              <button
                key={t}
                onClick={() => { setFormData({ ...formData, studentType: t }); nextStep() }}
                className={`p-4 rounded-apple-md border text-left font-medium transition-all spring-transition ${formData.studentType === t ? 'border-primary bg-primary/10 text-primary' : 'border-apple-glass-border hover:border-primary/50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4">
             {['Max Scholarships', 'Find Internships', 'Win Competitions', 'Never Miss Deadlines'].map((g) => (
              <button
                key={g}
                onClick={() => { setFormData({ ...formData, goals: g }); nextStep() }}
                className={`p-4 rounded-apple-md border text-left font-medium transition-all spring-transition ${formData.goals === g ? 'border-primary bg-primary/10 text-primary' : 'border-apple-glass-border hover:border-primary/50'}`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <form action={signup} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-muted-foreground ml-1">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="John Doe"
                required
                className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                required
                className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground ml-1">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-apple-md border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="h-12 w-full rounded-apple-md text-base font-medium mt-2 shadow-apple-sm group spring-active">
              Create Account
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        )}

        {step === 4 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
