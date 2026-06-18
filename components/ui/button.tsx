"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./button-variants"

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
