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
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-apple-sm",
      secondary: "glass-thick text-foreground hover:bg-apple-glass-regular",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-apple-sm",
      ghost: "hover:bg-muted text-foreground",
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
