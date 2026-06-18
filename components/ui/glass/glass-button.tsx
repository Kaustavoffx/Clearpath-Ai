import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background spring-transition spring-active"
    
    const variants = {
      primary: "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(133,138,227,0.15)] hover:bg-[#97DFFC]/15 hover:text-[#97DFFC] hover:border-[#97DFFC]/30 hover:shadow-[0_0_25px_rgba(151,223,252,0.25)] active:bg-[#7364D2]/20 active:text-[#7364D2] active:border-[#7364D2]/40",
      secondary: "bg-glass-surface text-foreground border border-glass-border shadow-sm hover:bg-glass-layer hover:border-glass-highlight hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
      danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 hover:shadow-[0_0_20px_rgba(97,61,193,0.2)]",
      ghost: "hover:bg-glass-surface hover:text-foreground hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-transparent hover:border-glass-border",
    }
    
    const sizes = {
      sm: "h-8 px-3 text-xs rounded-apple-sm",
      md: "h-10 py-2 px-4 text-sm rounded-apple-md",
      lg: "h-12 px-8 text-base rounded-apple-lg",
      icon: "h-10 w-10 rounded-full",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"
