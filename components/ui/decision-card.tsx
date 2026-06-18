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
      "liquid-glass-card flex flex-col transition-spring hover:-translate-y-1",
      isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-glass-highlight/30",
      className
    )}>
      <div className="px-6 py-5 border-b border-glass-border bg-glass-surface/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <h3 className="text-card-title text-foreground">{title}</h3>
        </div>
        {label && <span className="text-status-badge text-primary bg-primary/10 px-3 py-1 rounded-[999px] border border-primary/20">{label}</span>}
      </div>
      <div className="p-6 flex-1 text-body-text">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-glass-border bg-glass-surface/30 text-[14px]">
          {footer}
        </div>
      )}
    </div>
  )
}
