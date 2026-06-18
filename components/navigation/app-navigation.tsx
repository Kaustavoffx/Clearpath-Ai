'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, FileSearch, Target, User, Bug, Menu, X, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function AppNavigation() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isJudgeMode = searchParams.get('judge') === 'true'
  
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Items
  const navItems = [
    { name: 'Mission Control', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze', href: '/dashboard', icon: FileSearch },
    { name: 'Opportunities', href: '/opportunities', icon: Target },
    { name: 'Profile', href: '/settings', icon: User },
    { name: 'Judge Mode', href: '?judge=true', icon: Bug, isActiveOverride: isJudgeMode },
  ]

  // Liquid glass classes
  const glassClasses = "bg-background/60 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"

  return (
    <>
      {/* DESKTOP FLOATING RAIL */}
      <nav 
        className={cn(
          "hidden md:flex flex-col justify-between fixed top-6 bottom-6 left-6 z-50 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden group",
          glassClasses,
          isHovered ? "w-[260px]" : "w-[84px]"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col gap-8 p-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4 whitespace-nowrap overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.6)]">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className={cn(
              "font-bold tracking-tight text-xl transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              ClearPath OS
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-2 relative">
            {navItems.map((item, index) => {
              const isActive = item.isActiveOverride !== undefined ? item.isActiveOverride : pathname === item.href
              return (
                <Link 
                  key={index} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group/item relative overflow-hidden",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {/* Active Indicator Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                  )}
                  
                  <item.icon className={cn("w-6 h-6 shrink-0 relative z-10 transition-transform duration-300 group-hover/item:scale-110", isActive && "text-primary-foreground")} />
                  
                  <span className={cn(
                    "font-semibold whitespace-nowrap relative z-10 transition-all duration-300",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                    isActive && "text-primary-foreground"
                  )}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Profile / Settings */}
        <div className="p-6 flex flex-col gap-4 border-t border-white/10 dark:border-white/5">
          <div className="flex items-center justify-between w-full overflow-hidden whitespace-nowrap transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none' }}>
            <span className="text-sm font-semibold text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Link href="/settings" className="flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-muted/50 transition-colors whitespace-nowrap overflow-hidden">
             <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20">
               <span className="text-white font-bold text-sm">JS</span>
             </div>
             <div className={cn("flex flex-col transition-all duration-300", isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4")}>
               <span className="font-bold text-sm leading-tight text-foreground">John Student</span>
               <span className="text-xs text-muted-foreground">Free Plan</span>
             </div>
          </Link>
        </div>
      </nav>

      {/* MOBILE FLOATING DOCK */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className={cn(
          "flex items-center justify-around p-2 rounded-full",
          glassClasses
        )}>
          {navItems.slice(0, 4).map((item, index) => {
            const isActive = item.isActiveOverride !== undefined ? item.isActiveOverride : pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "relative p-3 rounded-full flex flex-col items-center justify-center transition-all duration-300",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground active:scale-95"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                )}
                <item.icon className="w-6 h-6 relative z-10" />
              </Link>
            )
          })}
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="relative p-3 rounded-full flex flex-col items-center justify-center text-muted-foreground transition-all duration-300 active:scale-95 hover:bg-muted/50"
          >
            <Menu className="w-6 h-6 relative z-10" />
          </button>
        </div>
      </nav>

      {/* MOBILE FULL SCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="p-6 flex justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-full bg-muted/50 text-foreground active:scale-95 transition-transform">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-8 py-4">
             <div className="flex justify-between items-center mb-8 border-b border-border pb-8">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.6)]">
                   <span className="text-primary-foreground font-bold text-xl">C</span>
                 </div>
                 <span className="font-bold tracking-tight text-2xl">ClearPath OS</span>
               </div>
             </div>
             
             {navItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-6 h-6" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-50" />
                </Link>
             ))}

             <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
               <span className="text-lg font-bold text-foreground">Theme</span>
               <ThemeToggle />
             </div>
          </div>
        </div>
      )}
    </>
  )
}
