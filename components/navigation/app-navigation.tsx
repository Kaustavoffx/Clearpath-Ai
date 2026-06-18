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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Items
  const navItems = [
    { name: 'Mission Control', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze', href: '/dashboard', icon: FileSearch },
    { name: 'Opportunities', href: '/opportunities', icon: Target },
    { name: 'Profile', href: '/settings', icon: User },
    { name: 'Judge Mode', href: '?judge=true', icon: Bug, isActiveOverride: isJudgeMode },
  ]

  return (
    <>
      {/* DESKTOP FULL-HEIGHT SIDEBAR */}
      <nav 
        className="hidden md:flex flex-col h-screen w-[260px] fixed left-0 top-0 border-r border-glass-border bg-glass-surface backdrop-blur-xl z-50 transition-all duration-500"
      >
        <div className="flex flex-col gap-8 p-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4 whitespace-nowrap overflow-hidden pt-2">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              <span className="text-primary font-bold text-lg">C</span>
            </div>
            <span className="font-bold tracking-tight text-xl text-foreground">
              ClearPath OS
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-2 flex-1 relative">
            {navItems.map((item, index) => {
              const isActive = item.isActiveOverride !== undefined ? item.isActiveOverride : pathname === item.href
              return (
                <Link 
                  key={index} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-[12px] transition-all duration-300 group/item relative overflow-hidden",
                    isActive ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)] text-primary" : "text-muted-foreground hover:bg-glass-layer hover:text-foreground border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0 relative z-10 transition-transform duration-300 group-hover/item:scale-110", isActive && "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
                  
                  <span className="font-semibold whitespace-nowrap relative z-10 text-[15px]">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Profile / Settings */}
        <div className="mt-auto p-6 flex flex-col gap-4 border-t border-glass-border bg-glass-surface/30">
          <div className="flex items-center justify-between w-full">
            <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
          <Link href="/settings" className="flex items-center gap-4 px-3 py-3 rounded-[12px] hover:bg-glass-layer transition-colors border border-transparent hover:border-glass-border">
             <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.2)]">
               <span className="text-primary font-bold text-sm">JS</span>
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-sm leading-tight text-foreground">John Student</span>
               <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">Free Plan</span>
             </div>
          </Link>
        </div>
      </nav>

      {/* MOBILE EDGE-TO-EDGE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-glass-border bg-glass-surface backdrop-blur-xl supports-[backdrop-filter]:bg-glass-surface/80">
        <div className="flex items-center justify-between px-6 py-3 pb-safe">
          {navItems.slice(0, 4).map((item, index) => {
            const isActive = item.isActiveOverride !== undefined ? item.isActiveOverride : pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "relative p-2 rounded-[12px] flex flex-col items-center justify-center transition-all duration-300",
                  isActive ? "text-primary bg-primary/10 border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.1)]" : "text-muted-foreground hover:text-foreground active:scale-95 border border-transparent"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
              </Link>
            )
          })}
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="relative p-2 rounded-[12px] flex flex-col items-center justify-center text-muted-foreground transition-all duration-300 active:scale-95 hover:bg-glass-layer border border-transparent"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* MOBILE FULL SCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-glass-surface/95 backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col">
          <div className="p-6 flex justify-end border-b border-glass-border/50">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-full bg-glass-layer text-foreground active:scale-95 transition-transform border border-glass-border">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 py-6 flex-1 overflow-y-auto">
             <div className="flex items-center gap-4 mb-8 pb-8 border-b border-glass-border">
               <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                 <span className="text-primary font-bold text-xl">C</span>
               </div>
               <span className="font-bold tracking-tight text-2xl text-foreground">ClearPath OS</span>
             </div>
             
             {navItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-[16px] text-[18px] font-bold text-muted-foreground hover:text-foreground hover:bg-glass-layer border border-transparent hover:border-glass-border transition-all"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-6 h-6" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-50" />
                </Link>
             ))}
          </div>
          
          <div className="p-6 mt-auto border-t border-glass-border bg-glass-surface/50">
             <div className="flex items-center justify-between mb-6">
               <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Theme</span>
               <ThemeToggle />
             </div>
             <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-[16px] bg-glass-layer border border-glass-border transition-colors">
               <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                 <span className="text-primary font-bold">JS</span>
               </div>
               <div className="flex flex-col">
                 <span className="font-bold text-[16px] leading-tight text-foreground">John Student</span>
                 <span className="text-[12px] uppercase tracking-wider text-muted-foreground mt-1">Free Plan</span>
               </div>
             </Link>
          </div>
        </div>
      )}
    </>
  )
}
