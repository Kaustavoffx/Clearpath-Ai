import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'thin' | 'regular' | 'thick'
  asChild?: boolean
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = 'regular', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-apple-xl transition-all duration-300",
          {
            "glass-thin": variant === 'thin',
            "glass-regular": variant === 'regular',
            "glass-thick": variant === 'thick',
          },
          className
        )}
        {...props}
      />
    )
  }
)
GlassPanel.displayName = "GlassPanel"
