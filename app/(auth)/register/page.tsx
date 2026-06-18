import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { ClearPathAmbientBackground } from '@/components/layout/clearpath-ambient-background'
import { Suspense } from 'react'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error: errorParam } = await searchParams
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-sans">
      <Suspense fallback={null}>
        <ClearPathAmbientBackground variant="auth" />
      </Suspense>
      
      {/* Left Panel - Trust / Mission-first */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-glass-surface/10 border-r border-glass-border relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group mb-16">
            <div className="w-10 h-10 rounded-[12px] bg-foreground flex items-center justify-center transition-spring group-hover:bg-primary shadow-elevation-2">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold text-[18px] tracking-tight text-foreground">ClearPath OS</span>
          </Link>
          
          <h1 className="text-[48px] leading-[1.1] font-semibold tracking-[-0.03em] mb-6 text-foreground max-w-[15ch]">
            Initialize your Mission Profile.
          </h1>
          <p className="text-[18px] text-muted-foreground max-w-[400px] mb-12 leading-[28px]">
            Personalize your engine. ClearPath OS automatically filters out irrelevant noise to give you only actionable, high-probability opportunities.
          </p>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm liquid-glass-card p-6 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h4 className="font-semibold text-foreground text-[16px]">Absolute Privacy</h4>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Your educational and financial data is stored locally in your vault and never shared.
          </p>
        </div>
      </div>

      {/* Right Panel - Form (Onboarding) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px] liquid-glass-card p-8 border-glass-border my-8">
          
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-[18px] tracking-tight text-foreground">ClearPath OS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground mb-2">Create Profile</h2>
            <p className="text-[15px] text-muted-foreground">Setup your readiness parameters.</p>
          </div>

          <form action={signup} className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[14px] font-medium text-foreground">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[14px] font-medium text-foreground">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px]"
                />
              </div>
            </div>

            <div className="w-full h-px bg-glass-border my-2" />
            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Mission Parameters</p>

            <div className="grid gap-2">
              <Label htmlFor="grade" className="text-[14px] font-medium text-foreground">Current Grade / Education Level</Label>
              <Input
                id="grade"
                name="grade"
                placeholder="e.g. 12th Grade, Undergraduate"
                required
                className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state" className="text-[14px] font-medium text-foreground">State</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="e.g. California"
                  required
                  className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="income_range" className="text-[14px] font-medium text-foreground">Income Range</Label>
                <select 
                  id="income_range" 
                  name="income_range" 
                  className="h-11 px-3 bg-glass-surface/50 border border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px] text-[15px]"
                  required
                >
                  <option value="">Select Range</option>
                  <option value="Under $30k">Under $30k</option>
                  <option value="$30k - $60k">$30k - $60k</option>
                  <option value="$60k - $100k">$60k - $100k</option>
                  <option value="Over $100k">Over $100k</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-[14px] font-medium text-foreground">Category</Label>
                <select 
                  id="category" 
                  name="category" 
                  className="h-11 px-3 bg-glass-surface/50 border border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px] text-[15px]"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="Minority">Minority</option>
                  <option value="First-Generation">First-Generation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="career_interest" className="text-[14px] font-medium text-foreground">Career Interest</Label>
                <Input
                  id="career_interest"
                  name="career_interest"
                  placeholder="e.g. Engineering, Arts"
                  required
                  className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px]"
                />
              </div>
            </div>

            {error && (
              <div className="text-[13px] text-danger font-medium bg-danger/10 p-3 rounded-[8px] border border-danger/20">
                {error}
              </div>
            )}

            <Button type="submit" className="h-11 w-full rounded-[999px] text-[16px] font-medium mt-4 shadow-glass-card transition-spring">
              Initialize Profile
            </Button>
          </form>

          <div className="mt-8 text-[14px] text-muted-foreground text-center">
            Already have a profile?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline transition-crisp">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
