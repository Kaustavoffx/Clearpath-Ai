'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, FileSearch, Target, User, Bug, Menu, X, Cpu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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
  collapsed, 
  onClick 
}: { 
  item: any, 
  isActive: boolean, 
  collapsed: boolean,
  onClick?: () => void
}) => {
  return (
    <Link 
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-[12px] transition-colors duration-300 group/item relative overflow-hidden",
        collapsed ? "px-0 justify-center w-12 h-12 mx-auto" : "px-4 py-3",
        isActive ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)] text-primary" : "text-muted-foreground hover:bg-glass-layer hover:text-foreground border border-transparent"
      )}
      title={collapsed ? item.name : undefined}
    >
      <item.icon className={cn("w-5 h-5 shrink-0 relative z-10 transition-transform duration-300 group-hover/item:scale-110", isActive && "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
      
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className={cn("whitespace-nowrap relative z-10 text-[15px]", isActive ? "font-semibold" : "font-medium")}
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
})
NavItem.displayName = 'NavItem'

export function AppNavigation({ profile }: AppNavigationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isJudgeMode = searchParams.get('judge') === 'true'
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Derive Profile Info
  const firstName = profile?.first_name || 'Profile'
  const lastName = profile?.last_name || 'Incomplete'
  const fullName = profile?.first_name ? `${profile.first_name} ${profile.last_name}`.trim() : 'Profile Incomplete'
  const plan = profile?.plan || 'Free Plan'
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase().substring(0, 2)

  // Memoized Items
  const navItems = useMemo(() => [
    { name: 'Mission Control', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze', href: '/dashboard', icon: FileSearch },
    { name: 'Opportunities', href: '/opportunities', icon: Target },
    { name: 'AI Engines', href: '/ai-providers', icon: Cpu },
    { name: 'Profile', href: '/settings', icon: User },
    { name: 'Judge Mode', href: '?judge=true', icon: Bug, isActiveOverride: isJudgeMode },
  ], [isJudgeMode])

  // Handle Mobile interactions
  const handleCloseMobile = useCallback(() => setIsMobileMenuOpen(false), [])

  useEffect(() => {
    handleCloseMobile()
  }, [pathname, searchParams, handleCloseMobile])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  return (
    <>
      {/* DESKTOP FULL-HEIGHT SIDEBAR */}
      <motion.aside 
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: 'width', backdropFilter: 'blur(12px)' }}
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 bg-[#071225]/90 border-r border-glass-border z-50 overflow-hidden"
      >
        <div className="flex flex-col gap-8 p-6 flex-1">
          {/* Logo / Brand - Click to toggle collapse */}
          <div 
            className="flex items-center gap-4 whitespace-nowrap overflow-hidden pt-2 cursor-pointer select-none"
            onClick={() => setCollapsed(!collapsed)}
          >
            <div className="h-10 w-10 shrink-0 rounded-[12px] bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-transform">
              <span className="text-primary font-semibold text-lg">C</span>
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.18 } }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  className="font-bold tracking-tight text-xl text-foreground"
                >
                  ClearPath OS
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-2 relative">
            {navItems.map((item, index) => {
              const isActive = item.isActiveOverride !== undefined ? item.isActiveOverride : pathname === item.href
              return (
                <NavItem 
                  key={index} 
                  item={item} 
                  isActive={isActive} 
                  collapsed={collapsed} 
                />
              )
            })}
          </div>
        </div>

        {/* Bottom Profile / Settings */}
        <div className={cn("mt-auto p-6 flex flex-col gap-4 border-t border-glass-border bg-glass-surface/30", collapsed ? "items-center" : "")}>
          <div className={cn("flex items-center w-full", collapsed ? "justify-center" : "justify-between")}>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.18 } }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  className="text-card-label text-muted-foreground whitespace-nowrap"
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
            <ThemeToggle />
          </div>
          
          <Link href="/settings" className={cn("flex items-center gap-4 rounded-[12px] hover:bg-glass-layer transition-colors border border-transparent hover:border-glass-border overflow-hidden", collapsed ? "p-1 justify-center w-12 h-12 mx-auto" : "px-3 py-3")}>
             <motion.div layoutId="avatar" className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.2)]">
               <span className="text-primary font-semibold text-sm">{initials}</span>
             </motion.div>
             
             <AnimatePresence mode="wait">
               {!collapsed && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.18 } }}
                   exit={{ opacity: 0, transition: { duration: 0.18 } }}
                   className="flex flex-col whitespace-nowrap"
                 >
                   <span className="font-medium text-sm leading-tight text-foreground">{fullName}</span>
                   <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{plan}</span>
                 </motion.div>
               )}
             </AnimatePresence>
          </Link>
        </div>
      </motion.aside>

      {/* MOBILE EDGE-TO-EDGE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-glass-border bg-glass-surface backdrop-blur-xl supports-[backdrop-filter]:bg-glass-surface/80">
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

      {/* MOBILE FULL SCREEN DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMobile}
              className="md:hidden fixed inset-0 z-[100] bg-black/60"
              style={{ backdropFilter: 'blur(16px)' }}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-y-0 left-0 w-[80%] max-w-sm z-[101] bg-[#071225] border-r border-glass-border/50 flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-glass-border/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-[8px] bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">C</span>
                  </div>
                  <span className="font-bold tracking-tight text-lg text-foreground">ClearPath OS</span>
                </div>
                <button onClick={handleCloseMobile} className="p-2 rounded-full bg-glass-layer text-foreground active:scale-95 transition-transform border border-glass-border">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2 px-4 py-6 flex-1 overflow-y-auto">
                 {navItems.map((item, index) => (
                    <NavItem 
                      key={index} 
                      item={item} 
                      isActive={item.isActiveOverride !== undefined ? item.isActiveOverride : pathname === item.href} 
                      collapsed={false}
                      onClick={handleCloseMobile}
                    />
                 ))}
              </div>
              
              <div className="p-6 mt-auto border-t border-glass-border/30 bg-glass-surface/30">
                 <div className="flex items-center justify-between mb-6">
                   <span className="text-card-label text-muted-foreground">Theme</span>
                   <ThemeToggle />
                 </div>
                 <Link href="/settings" onClick={handleCloseMobile} className="flex items-center gap-4 p-3 rounded-[12px] bg-glass-layer hover:bg-white/5 border border-glass-border transition-colors">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                     <span className="text-primary font-semibold text-sm">{initials}</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="font-medium text-[15px] leading-tight text-foreground">{fullName}</span>
                     <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{plan}</span>
                   </div>
                 </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
