import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-12 lg:p-24 border border-dashed border-border rounded-2xl bg-muted/30", className)}>
      <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-elevation-1 flex items-center justify-center text-muted-foreground mb-6">
        {icon}
      </div>
      <h3 className="text-step-2 font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-step-1 text-muted-foreground max-w-[40ch] mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}
