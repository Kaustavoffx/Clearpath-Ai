import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type TrustBadgeVariant = "security" | "guarantee" | "privacy"

interface TrustBadgeProps {
  variant: TrustBadgeVariant
  title: string
  description: string
  className?: string
}

export function TrustBadge({ variant, title, description, className }: TrustBadgeProps) {
  const icons = {
    security: <Lock className="w-4 h-4 text-success" />,
    guarantee: <CheckCircle2 className="w-4 h-4 text-primary" />,
    privacy: <ShieldCheck className="w-4 h-4 text-primary" />
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
        {icons[variant]}
      </div>
      <div>
        <h4 className="text-step-0 font-semibold text-foreground">{title}</h4>
        <p className="text-step-0 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
