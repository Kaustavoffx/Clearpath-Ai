'use client'

import React, { useState, useEffect } from 'react'

export function LiveCountdown({ deadlineString }: { deadlineString: string | null }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null)
  
  useEffect(() => {
    if (!deadlineString) return;
    
    const target = new Date(deadlineString).getTime()
    if (isNaN(target)) return;

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = target - now
      
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
        clearInterval(interval)
        return
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [deadlineString])

  if (!deadlineString || isNaN(new Date(deadlineString).getTime())) {
    return <span className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">No Deadline Found</span>
  }

  if (!timeLeft) {
    return <span className="text-muted-foreground text-sm font-semibold uppercase tracking-widest animate-pulse">Calculating...</span>
  }

  if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
    return <span className="text-danger font-bold text-xl uppercase tracking-widest">Expired</span>
  }

  return (
    <div className="flex items-center gap-4 text-center">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground tabular-nums tracking-tighter">{timeLeft.d}</span>
        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Days</span>
      </div>
      <div className="text-2xl font-light text-muted-foreground/30 -mt-4">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground tabular-nums tracking-tighter">{String(timeLeft.h).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Hours</span>
      </div>
      <div className="text-2xl font-light text-muted-foreground/30 -mt-4">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground tabular-nums tracking-tighter">{String(timeLeft.m).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Mins</span>
      </div>
      <div className="text-2xl font-light text-muted-foreground/30 -mt-4">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold text-primary tabular-nums tracking-tighter animate-pulse">{String(timeLeft.s).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase font-semibold text-primary tracking-widest">Secs</span>
      </div>
    </div>
  )
}
