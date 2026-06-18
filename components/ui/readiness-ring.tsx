'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ReadinessRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ReadinessRing({ score, size = 120, strokeWidth = 12, className }: ReadinessRingProps) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => setProgress(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  let colorClass = "text-success"
  if (score < 50) colorClass = "text-danger"
  else if (score < 80) colorClass = "text-warning"

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress ring */}
        <circle
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold tracking-tighter">{progress}%</span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-0.5">Ready</span>
      </div>
    </div>
  )
}
