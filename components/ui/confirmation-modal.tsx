'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export interface ConfirmationModalProps {
  isOpen: boolean
  title?: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  isOpen,
  title = "Confirm Deletion",
  description = "This action cannot be undone. Are you sure you want to proceed?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDeleting = false,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const { resolvedTheme } = useTheme()
  const modalRef = useRef<HTMLDivElement>(null)

  // Trap focus and handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter' && !isDeleting) onConfirm()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel, onConfirm, isDeleting])

  const isDark = resolvedTheme === 'dark'
  const isLight = resolvedTheme === 'light'
  
  // Theme aware overlay
  const overlayClass = isDark 
    ? 'bg-black/55 backdrop-blur-[16px]' 
    : isLight 
      ? 'bg-white/55 backdrop-blur-[18px]' 
      : 'bg-slate-900/40 backdrop-blur-sm'

  // Theme aware modal card
  const modalClass = isDark
    ? 'bg-[#0a0a14]/80 backdrop-blur-[28px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45),0_0_40px_rgba(113,97,239,0.18)]'
    : isLight
      ? 'bg-white/90 backdrop-blur-[30px] border border-[#7161ef]/10 shadow-[0_25px_80px_rgba(20,20,40,0.08)]'
      : 'bg-white backdrop-blur-md border border-slate-200 shadow-xl'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn("absolute inset-0", overlayClass)}
            onClick={() => !isDeleting && onCancel()}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 5 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative w-full max-w-md rounded-[28px] p-8 flex flex-col items-center text-center overflow-hidden",
              modalClass
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Top Icon */}
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-6",
              isDark ? "bg-danger/10 text-danger" : "bg-red-50 text-red-500"
            )}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trash2 className="w-8 h-8" />
              </motion.div>
            </div>

            {/* Content */}
            <h2 id="modal-title" className="text-2xl font-semibold text-foreground tracking-tight mb-3">
              {title}
            </h2>
            <div className="text-[15px] leading-relaxed text-muted-foreground mb-8">
              {description}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 btn-ghost h-12 rounded-xl font-medium disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 btn-danger h-12 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>

            {/* Close Cross */}
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  )
}
