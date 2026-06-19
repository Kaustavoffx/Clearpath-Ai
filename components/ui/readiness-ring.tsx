'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ReadinessRingProps {
  score: number | 'Unknown'
  size?: number
  strokeWidth?: number
  className?: string
}

export function ReadinessRing({ 
  score, 
  size = 120, 
  strokeWidth = 8,
  className 
}: ReadinessRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  
  const isUnknown = score === 'Unknown'
  const numericScore = isUnknown ? 0 : (score as number)
  
  // Calculate offset for the SVG stroke dasharray
  const strokeDashoffset = circumference - (numericScore / 100) * circumference

  // Determine color based on score
  let colorClass = "text-muted-foreground"
  let glowColor = "rgba(142, 153, 184, 0.5)" // muted

  if (!isUnknown) {
    if (numericScore >= 80) {
      colorClass = "text-success"
      glowColor = "rgba(114, 241, 184, 0.6)"
    } else if (numericScore >= 50) {
      colorClass = "text-warning"
      glowColor = "rgba(255, 209, 102, 0.6)"
    } else {
      colorClass = "text-danger"
      glowColor = "rgba(255, 107, 138, 0.6)"
    }
  }

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
          className="transition-all duration-300"
        />
        
        {/* Progress Track */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          className={cn("transition-colors duration-300", colorClass)}
          style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isUnknown ? circumference : strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        {isUnknown ? (
          <span className="text-[20px] font-semibold tracking-tight text-muted-foreground">?</span>
        ) : (
          <span className={cn("text-[32px] font-semibold tracking-tight leading-none drop-shadow-md", colorClass)}>
            {numericScore}
            <span className="text-[18px]">%</span>
          </span>
        )}
      </div>
    </div>
  )
}
