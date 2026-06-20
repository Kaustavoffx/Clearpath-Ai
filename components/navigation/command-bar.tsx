'use client'

import React, { useState, useEffect } from 'react'
import { Search, FileText, Target, CheckSquare, X } from 'lucide-react'
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Dummy search results for OS feel
  const results = [
    { icon: Target, label: 'Search Workspace Opportunities...', type: 'Action' },
    { icon: FileText, label: 'Search Documents...', type: 'Action' },
    { icon: CheckSquare, label: 'Search Tasks...', type: 'Action' },
  ]

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
              <m.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-surface-1 border border-glass-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
              >
                <div className="flex items-center px-4 py-3 border-b border-glass-border bg-black/20">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0 mr-3" />
                  <input
                    autoFocus
                    placeholder="Search Workspace, Tasks, or Docs... (CMD+K)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-[16px] placeholder:text-muted-foreground"
                  />
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-glass-surface px-2 py-1 rounded">ESC</div>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2">
                  {results.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center px-3 py-3 hover:bg-glass-surface rounded-xl transition-colors text-left group"
                    >
                      <result.icon className="w-4 h-4 text-muted-foreground mr-3 group-hover:text-primary transition-colors" />
                      <span className="text-[14px] font-medium text-foreground flex-1">{result.label}</span>
                      <span className="text-[11px] text-muted-foreground">{result.type}</span>
                    </button>
                  ))}
                  {query && (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                      No exact matches for "{query}"
                    </div>
                  )}
                </div>
              </m.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
