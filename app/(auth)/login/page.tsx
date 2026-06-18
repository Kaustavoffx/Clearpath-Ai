import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error: errorParam } = await searchParams
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-sans">
      
      {/* Left Panel - Trust / Mission-first */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-glass-surface/10 border-r border-glass-border relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group mb-16">
            <div className="w-10 h-10 rounded-[12px] bg-foreground flex items-center justify-center transition-spring group-hover:bg-primary shadow-elevation-2">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold text-[18px] tracking-tight text-foreground">ClearPath OS</span>
          </Link>
          
          <h1 className="text-[48px] leading-[1.1] font-semibold tracking-[-0.03em] mb-6 text-foreground max-w-[15ch]">
            Access Mission Control.
          </h1>
          <p className="text-[18px] text-muted-foreground max-w-[400px] mb-12 leading-[28px]">
            Your document vault, action timelines, and active opportunity dashboards are securely monitored and ready for execution.
          </p>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm liquid-glass-card p-6 border-success/30 bg-success/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            </div>
            <h4 className="font-semibold text-foreground text-[16px]">Secure Access</h4>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Active sessions are end-to-end encrypted and monitored by the Evidence Verification Layer.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px] liquid-glass-card p-8 border-glass-border">
          
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-step-1 tracking-tight text-foreground">ClearPath OS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground mb-2">Sign in</h2>
            <p className="text-[15px] text-muted-foreground">Continue to Mission Control</p>
          </div>

          <form action={login} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[14px] font-medium text-foreground">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px] shadow-sm transition-crisp text-[15px]"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[14px] font-medium text-foreground">Password</Label>
                <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-crisp">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="h-11 bg-glass-surface/50 border-glass-border focus-visible:ring-2 focus-visible:ring-primary rounded-[8px] shadow-sm transition-crisp text-[15px]"
              />
            </div>

            {error && (
              <div className="text-[13px] text-danger font-medium bg-danger/10 p-3 rounded-[8px] border border-danger/20">
                {error}
              </div>
            )}

            <Button type="submit" className="h-11 w-full rounded-[999px] text-[16px] font-medium mt-2 shadow-glass-card transition-spring">
              Sign in
            </Button>
          </form>

          <div className="mt-8 text-[14px] text-muted-foreground text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline transition-crisp">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
