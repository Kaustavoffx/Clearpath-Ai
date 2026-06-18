import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface DecisionCardProps {
  title: string
  label?: string
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  isActive?: boolean
  className?: string
}

export function DecisionCard({ title, label, icon, children, footer, isActive, className }: DecisionCardProps) {
  return (
    <div className={cn(
      "decision-surface flex flex-col transition-crisp",
      isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-foreground/20",
      className
    )}>
      <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <h3 className="text-step-1 font-semibold text-foreground">{title}</h3>
        </div>
        {label && <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-sm border border-border">{label}</span>}
      </div>
      <div className="p-6 flex-1 text-step-1 text-muted-foreground">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-muted/10 text-step-0">
          {footer}
        </div>
      )}
    </div>
  )
}
