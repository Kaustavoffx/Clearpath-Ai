'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldAlert } from 'lucide-react'

export function HumanReviewAction() {
  const [isVerified, setIsVerified] = useState(false)

  return (
    <div className="flex flex-col gap-4 min-w-[280px]">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input 
            type="checkbox" 
            className="peer appearance-none w-5 h-5 border-2 border-warning/50 rounded bg-background checked:bg-warning checked:border-warning transition-crisp"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
          />
          <svg className="absolute w-3 h-3 text-background opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-crisp leading-tight text-balance">
          I have manually verified the required documents against the source text.
        </span>
      </label>
      <Button 
        className="w-full h-14 px-8 text-step-1 font-semibold shadow-elevation-2 transition-crisp disabled:opacity-50"
        disabled={!isVerified}
        onClick={() => alert("Redirecting to application portal...")}
      >
        <ShieldAlert className="w-5 h-5 mr-2 opacity-50" />
        Apply Now <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  )
}
