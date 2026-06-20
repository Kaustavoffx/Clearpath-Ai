'use client'

import { useEffect, useState } from 'react'

export function ResponsiveQA() {
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const checkLayout = () => {
      const newErrors: string[] = []
      
      // 1. Horizontal Scroll Check
      if (document.documentElement.scrollWidth > window.innerWidth) {
        newErrors.push(`Horizontal scroll detected: scrollWidth (${document.documentElement.scrollWidth}px) > innerWidth (${window.innerWidth}px)`)
      }

      // 2. Fixed Width Check
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        const style = window.getComputedStyle(el)
        if (style.width.endsWith('px') && parseInt(style.width) > window.innerWidth) {
            newErrors.push(`Fixed width element detected: ${(el as HTMLElement).className || el.tagName} is ${style.width}`)
        }
      })

      // 3. Text Overflow Check (simple heuristic)
      const textElements = document.querySelectorAll('h1, h2, h3, p, button, .badge')
      textElements.forEach(el => {
        if (el.scrollWidth > el.clientWidth && el.clientWidth > 0) {
          newErrors.push(`Text overflow detected in: ${(el as HTMLElement).innerText?.substring(0, 20)}...`)
        }
      })

      // 4. Overlap Check (basic heuristic for fixed elements)
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const pos = window.getComputedStyle(el).position
        return pos === 'fixed' || pos === 'sticky'
      })
      
      // We don't have a perfect overlap algorithm in JS without expensive bounding rect checks,
      // but the main issue is text overflowing horizontally and scroll width.

      setErrors(newErrors)
    }

    // Run after a short delay to let layout settle
    const timeout = setTimeout(checkLayout, 2000)
    window.addEventListener('resize', checkLayout)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', checkLayout)
    }
  }, [])

  if (errors.length === 0 || process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed top-4 left-4 z-[9999] bg-danger/90 text-white p-4 rounded-lg shadow-lg max-w-sm text-xs max-h-60 overflow-auto backdrop-blur-md border border-danger">
      <h3 className="font-bold mb-2 flex items-center gap-2">⚠️ QA Layout Failures</h3>
      <ul className="list-disc pl-4 space-y-1">
        {errors.slice(0, 5).map((err, i) => (
          <li key={i} className="opacity-90">{err}</li>
        ))}
        {errors.length > 5 && <li className="italic opacity-70">...and {errors.length - 5} more</li>}
      </ul>
    </div>
  )
}
