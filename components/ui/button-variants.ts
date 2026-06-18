import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "group relative inline-flex shrink-0 items-center justify-center rounded-[999px] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-400 ease-out outline-none select-none overflow-hidden focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(232,235,104,0.1)] hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(232,235,104,0.25)]",
        outline:
          "border border-glass-border bg-glass-surface text-foreground shadow-sm hover:bg-glass-layer hover:border-glass-highlight hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
        secondary:
          "bg-glass-surface text-foreground border border-glass-border shadow-sm hover:bg-glass-layer hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
        ghost:
          "hover:bg-glass-surface hover:text-foreground hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border hover:border-glass-border",
        destructive:
          "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 hover:shadow-[0_0_20px_rgba(213,138,58,0.2)]",
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
