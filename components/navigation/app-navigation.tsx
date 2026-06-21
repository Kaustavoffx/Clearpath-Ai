'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, FileSearch, Target, User, Settings, Menu, X, Cpu, Database, Activity, HardDrive } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'

interface Profile {
  first_name: string;
  last_name: string;
  plan: string;
}

interface AppNavigationProps {
  profile?: Profile;
}

// Memoized NavItem to prevent unnecessary rerenders
const NavItem = React.memo(({ 
  item, 
  isActive, 
  forceExpanded, 
  onClick 
}: { 
  item: any, 
  isActive: boolean, 
  forceExpanded?: boolean,
  onClick?: () => void
}) => {
  return (
    <Link 
      href={item.href}
      prefetch={true}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-[12px] transition-colors duration-200 group/item relative h-11 w-full",
        isActive ? "bg-glass-layer" : "hover:bg-glass-layer/50 text-muted-foreground hover:text-foreground"
      )}
      title={!forceExpanded ? item.name : undefined}
    >
      {/* Active Line Indicator - Thin edge bar */}
      <AnimatePresence>
        {isActive && (
          <m.div
            layoutId="active-nav-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(149,127,239,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="w-[72px] shrink-0 flex items-center justify-center">
        <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "text-primary" : "")} />
      </div>
      
      <div className={cn(
        "whitespace-nowrap transition-all duration-200 overflow-hidden",
        forceExpanded 
          ? "opacity-100 flex-1 pr-4" 
          : "opacity-0 w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:flex-1 group-hover/sidebar:pr-4"
      )}>
        <span className={cn("text-[14px] leading-none", isActive ? "font-semibold text-foreground" : "font-medium")}>
          {item.name}
        </span>
      </div>
    </Link>
  )
})
NavItem.displayName = 'NavItem'

export function AppNavigation({ profile }: AppNavigationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isJudgeMode = searchParams?.get('judge') === 'true'
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Derive Profile Info
  const firstName = profile?.first_name || 'Student'
  const lastName = profile?.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const plan = profile?.plan || 'Free Plan'
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase().substring(0, 2)

  // Memoized Items
  const navItems = useMemo(() => [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze', href: '/analyze', icon: FileSearch },
    { name: 'Workspace', href: '/opportunities', icon: Target },
    { name: 'Intelligence', href: '/ai-providers', icon: Cpu },
  ], [])

  const bottomItems = useMemo(() => [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ], [])

  // Handle Mobile interactions
  const handleCloseMobile = useCallback(() => setIsMobileMenuOpen(false), [])

  useEffect(() => {
    handleCloseMobile()
  }, [pathname, searchParams, handleCloseMobile])

  return (
    <LazyMotion features={domAnimation}>
      {/* DESKTOP HOVER-EXPANDING INTELLIGENCE RAIL */}
      <aside 
        className="group/sidebar hidden md:flex flex-col fixed left-4 top-4 bottom-4 bg-[#090D1A]/90 border border-glass-border/40 rounded-[24px] z-[60] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md w-[72px] hover:w-[260px] transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ willChange: 'width' }}
      >
        <div className="flex flex-col flex-1 py-4">
          
          {/* Logo */}
          <div className="h-[60px] flex items-center mb-4">
            <div className="w-[72px] shrink-0 flex items-center justify-center">
              <div className="h-9 w-9 rounded-[10px] bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(149,127,239,0.3)] overflow-hidden p-[2px]">
                <Image src="/icon-192x192.png" alt="ClearPath OS Logo" width={32} height={32} className="object-contain drop-shadow-[0_0_8px_rgba(113,97,239,0.8)]" priority />
              </div>
            </div>
            <div className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-200",
              "opacity-0 w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:w-full group-hover/sidebar:pr-4"
            )}>
              <span className="font-bold tracking-tight text-[16px] text-foreground">ClearPath OS</span>
            </div>
          </div>

          {/* Top Nav Links */}
          <div className="flex flex-col px-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/')
              return (
                <NavItem 
                  key={index} 
                  item={item} 
                  isActive={isActive} 
                />
              )
            })}
          </div>

          <div className="flex-1" />

          {/* Expanded System Info */}
          <div className={cn(
            "px-6 mb-6 flex flex-col gap-3 transition-all duration-200 overflow-hidden whitespace-nowrap",
            "opacity-0 max-h-0 group-hover/sidebar:opacity-100 group-hover/sidebar:max-h-[200px]"
          )}>
             <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">System Health</div>
             <div className="flex items-center gap-3 text-[13px] text-foreground">
               <Database className="w-3.5 h-3.5 text-muted-foreground" />
               <div className="flex-1 bg-glass-surface h-1.5 rounded-full overflow-hidden">
                 <div className="bg-primary h-full w-[45%]" />
               </div>
               <span className="text-muted-foreground">45%</span>
             </div>
             <div className="flex items-center gap-3 text-[13px] text-foreground">
               <Activity className="w-3.5 h-3.5 text-muted-foreground" />
               <div className="flex-1 bg-glass-surface h-1.5 rounded-full overflow-hidden">
                 <div className="bg-success h-full w-[12%]" />
               </div>
               <span className="text-muted-foreground">12ms</span>
             </div>
             <div className="flex items-center gap-3 text-[13px] text-foreground">
               <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
               <div className="flex-1 bg-glass-surface h-1.5 rounded-full overflow-hidden">
                 <div className="bg-warning h-full w-[82%]" />
               </div>
               <span className="text-muted-foreground">82%</span>
             </div>
          </div>

          {/* Bottom Nav Links */}
          <div className="flex flex-col px-2 mb-4">
            {bottomItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <NavItem 
                  key={index} 
                  item={item} 
                  isActive={isActive} 
                />
              )
            })}
          </div>

          {/* Theme & Profile Bar */}
          <div className="border-t border-glass-border/40 mt-2 pt-2 px-2 flex flex-col">
            <div className={cn(
              "flex items-center transition-all duration-200 overflow-hidden whitespace-nowrap mb-2",
              "opacity-0 h-0 group-hover/sidebar:opacity-100 group-hover/sidebar:h-10 group-hover/sidebar:px-4 group-hover/sidebar:justify-between"
            )}>
              <span className="text-[12px] font-medium text-muted-foreground">Appearance</span>
              <ThemeToggle />
            </div>

            <div className={cn(
              "flex items-center rounded-[12px] transition-colors duration-200 h-12 w-full",
              "justify-center group-hover/sidebar:px-3 group-hover/sidebar:bg-glass-surface group-hover/sidebar:border group-hover/sidebar:border-glass-border/50 group-hover/sidebar:justify-start"
            )}>
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-primary font-semibold text-[11px]">{initials}</span>
              </div>
              
              <div className={cn(
                "flex flex-col whitespace-nowrap transition-all duration-200 overflow-hidden",
                "opacity-0 w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:w-full group-hover/sidebar:pl-3"
              )}>
                <span className="font-semibold text-[13px] leading-tight text-foreground">{fullName}</span>
                <span className="text-[11px] font-medium text-muted-foreground mt-0.5">{plan}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE EDGE-TO-EDGE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-glass-border bg-[#090D1A]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3 pb-safe">
          {[...navItems, bottomItems[0]].slice(0, 4).map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "relative p-2 rounded-[12px] flex flex-col items-center justify-center transition-all duration-200",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            )
          })}
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="relative p-2 rounded-[12px] flex flex-col items-center justify-center text-muted-foreground transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* MOBILE FULL SCREEN DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMobile}
              className="md:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            
            <m.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-y-0 left-0 w-[80%] max-w-sm z-[101] bg-[#090D1A] border-r border-glass-border flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-[8px] bg-primary/20 border border-primary/50 flex items-center justify-center overflow-hidden p-[2px]">
                    <Image src="/icon-192x192.png" alt="ClearPath OS Logo" width={28} height={28} className="object-contain drop-shadow-[0_0_5px_rgba(113,97,239,0.8)]" />
                  </div>
                  <span className="font-bold tracking-tight text-lg text-foreground">ClearPath OS</span>
                </div>
                <button onClick={handleCloseMobile} className="p-2 rounded-full bg-glass-surface text-foreground active:scale-95 transition-transform border border-glass-border">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2 px-4 py-6 flex-1 overflow-y-auto">
                 {navItems.map((item, index) => (
                    <NavItem 
                      key={index} 
                      item={item} 
                      isActive={pathname === item.href} 
                      forceExpanded={true}
                      onClick={handleCloseMobile}
                    />
                 ))}
                 {bottomItems.map((item, index) => (
                    <NavItem 
                      key={`bottom-${index}`} 
                      item={item} 
                      isActive={pathname === item.href} 
                      forceExpanded={true}
                      onClick={handleCloseMobile}
                    />
                 ))}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
