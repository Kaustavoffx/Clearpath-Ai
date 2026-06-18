"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group relative inline-flex shrink-0 items-center justify-center rounded-[999px] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-400 ease-out outline-none select-none overflow-hidden focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground shadow-glass-card border-glass-highlight/20 bg-gradient-to-r from-primary/90 to-primary/70 hover:from-primary hover:to-primary/50",
        outline:
          "border border-glass-border bg-glass-surface text-foreground shadow-sm hover:bg-glass-layer",
        secondary:
          "bg-glass-surface text-foreground border border-glass-border shadow-sm hover:bg-glass-layer",
        ghost:
          "hover:bg-glass-surface hover:text-foreground hover:shadow-glass-card",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-5 py-2",
        xs: "h-7 gap-1 px-3 text-xs",
        sm: "h-8 gap-1.5 px-4 text-xs",
        lg: "h-12 gap-2 px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// We need motion.create for Base UI Primitive if we use Framer Motion v11+, but motion(Component) usually works.
// Ignore complex generic typing collisions between base-ui and framer-motion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion(ButtonPrimitive as any) as any

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <MotionButton
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      <span className="absolute inset-0 rounded-[999px] pointer-events-none border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 mix-blend-overlay"></span>
      <span className="relative z-10 flex items-center gap-1.5">
        {children}
      </span>
    </MotionButton>
  )
}

export { Button, buttonVariants }
