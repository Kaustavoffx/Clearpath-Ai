import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { TrustBadge } from '@/components/ui/trust-badge'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error: errorParam } = await searchParams
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background font-sans">
      
      {/* Left Panel - Trust / Stripe-style minimalism */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-muted/30 border-r border-border">
        <div>
          <Link href="/" className="flex items-center gap-2 group mb-16">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center transition-crisp">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-step-1 tracking-tight text-foreground">ClearPath OS</span>
          </Link>
          
          <h1 className="text-step-4 mb-6 text-foreground max-w-[15ch]">
            Welcome back to your command center.
          </h1>
          <p className="text-step-1 text-muted-foreground max-w-md mb-12">
            Securely access your parsed documents, action timelines, and active opportunity dashboards.
          </p>
        </div>

        <div className="space-y-6 max-w-sm">
          <TrustBadge 
            variant="security" 
            title="Secure Access" 
            description="Your active sessions are securely managed and monitored."
          />
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px]">
          
          <div className="flex lg:hidden items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-step-1 tracking-tight text-foreground">ClearPath OS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-step-3 text-foreground mb-2">Sign in</h2>
            <p className="text-step-0 text-muted-foreground">Continue to ClearPath OS</p>
          </div>

          <form action={login} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-step-0 font-medium text-foreground">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground rounded-md shadow-sm transition-crisp text-step-1"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-step-0 font-medium text-foreground">Password</Label>
                <Link href="#" className="text-step-0 text-muted-foreground hover:text-foreground transition-crisp">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="h-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground rounded-md shadow-sm transition-crisp text-step-1"
              />
            </div>

            {error && (
              <div className="text-step-0 text-danger font-medium bg-danger/10 p-3 rounded-md border border-danger/20">
                {error}
              </div>
            )}

            <Button type="submit" className="h-10 w-full rounded-md text-step-1 font-medium mt-2 shadow-elevation-1 transition-crisp">
              Sign in
            </Button>
          </form>

          <div className="mt-8 text-step-0 text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-foreground hover:underline transition-crisp">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
