"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, CheckSquare, Settings, PlayCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { GlassPanel } from "@/components/ui/glass/glass-panel"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    icon: FileText,
  },
  {
    title: "Action Plans",
    href: "/action-plans",
    icon: CheckSquare,
  },
  {
    title: "Judge Demo Mode",
    href: "/demo",
    icon: PlayCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <GlassPanel variant="thin" className="absolute left-6 top-6 bottom-6 w-56 flex flex-col z-20">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl tracking-tight">ClearPath AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-3 text-sm font-medium gap-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-apple-md px-3 py-2.5 transition-all spring-transition",
                  isActive 
                    ? "bg-foreground/10 text-foreground font-semibold shadow-apple-sm" 
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <item.icon className="h-[1.15rem] w-[1.15rem]" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </GlassPanel>
  )
}
