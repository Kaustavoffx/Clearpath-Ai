import { RegisterForm } from '@/components/auth/register-form'
import { Sparkles, CheckCircle2, Shield } from 'lucide-react'

export default async function RegisterPage({
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
            Join the top 1% of prepared students.
          </h1>
          <p className="text-section text-muted-foreground max-w-lg mb-12">
            Sign up to decode complex educational documents into clear, step-by-step action plans.
          </p>

          <div className="grid gap-6 max-w-md">
            <div className="glass-thin p-6 rounded-apple-lg flex items-start gap-4 hover:glass-regular transition-all spring-transition group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 spring-transition">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Guaranteed Readiness</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Know exactly what documents you need before starting any application.</p>
              </div>
            </div>

            <div className="glass-thin p-6 rounded-apple-lg flex items-start gap-4 hover:glass-regular transition-all spring-transition group">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 spring-transition">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Zero Hallucinations</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Our AI strictly grounds itself in the source document. No invented deadlines.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm font-medium text-muted-foreground">
            Loved by ambitious students.
          </p>
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <RegisterForm error={error} />
      </div>
    </div>
  )
}
