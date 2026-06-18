import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error: errorParam } = await searchParams
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left Panel - Trust & Mission (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 xl:p-24 bg-apple-base relative overflow-hidden">
        {/* Abstract decorative blur */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-apple-sm bg-primary flex items-center justify-center shadow-apple-sm">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl tracking-tight">ClearPath OS</span>
          </div>

          <h1 className="text-hero mb-6 max-w-lg">
            Reclaim your time.<br />Secure your future.
          </h1>
          <p className="text-section text-muted-foreground max-w-lg mb-12">
            ClearPath turns confusing notices and hidden scholarships into a personalized, guaranteed action plan.
          </p>

          <div className="grid gap-6 max-w-md">
            <div className="glass-thin p-6 rounded-apple-lg flex items-start gap-4 hover:glass-regular transition-all spring-transition group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 spring-transition">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">₹50,000+ Recovered</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Average student discovers ₹50k in hidden scholarships they were eligible for.</p>
              </div>
            </div>

            <div className="glass-thin p-6 rounded-apple-lg flex items-start gap-4 hover:glass-regular transition-all spring-transition group">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 spring-transition">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">100% Deadlines Hit</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Never miss an application deadline again with intelligent parsing.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by top-tier students globally.
          </p>
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-[400px]">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-apple-sm bg-primary flex items-center justify-center shadow-apple-sm">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl tracking-tight">ClearPath OS</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
          </div>

          <div className="glass-regular p-8 sm:p-10 rounded-apple-xl">
            <form action={login} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-12 bg-background/50 border-apple-glass-border focus-visible:ring-primary rounded-apple-md px-4 shadow-inner"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</Label>
                  <Link href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
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
                Sign in
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
