'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { VoiceOrb } from '@/components/ui/voice-orb'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Brain, X, Mic, Shield } from 'lucide-react'

// Mock Data for Context Widgets
const MOCK_CONTEXT = {
  profile: { name: 'Kaustav', readiness: 72, goal: 'College Admissions' },
  activeOpportunity: { title: 'OASIS Scholarship', deadline: 'July 15, 2026' },
  missingDoc: 'Income Certificate'
}

export function VoiceInterface() {
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)

  // Escape key to close immersive mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        setIsActive(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  const fallbackTTS = useCallback((text: string) => {
    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [])

  const processTranscript = useCallback(async (finalText: string) => {
    setIsProcessing(true)
    setAiResponse("")
    
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: finalText }]
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to process intent')
      
      const responseText = data.message || "I've analyzed your request."
      setAiResponse(responseText)
      
      fallbackTTS(responseText)
      
    } catch (error: unknown) {
      const e = error as Error
      toast.error(e.message || 'Failed to process intent')
      setAiResponse("I encountered an error analyzing your request.")
      fallbackTTS("I encountered an error analyzing your request.")
    } finally {
      setIsProcessing(false)
    }
  }, [fallbackTTS])
  
  const startListening = useCallback(() => {
    setIsActive(true)

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
       toast.error("Speech recognition is not supported in this browser.")
       return
    }
    
    setIsListening(true)
    setTranscript("")
    setAiResponse("")
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as unknown as { SpeechRecognition: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)()
    recognition.continuous = false
    recognition.interimResults = true
    
    recognition.onresult = (event: unknown) => {
      const current = (event as { resultIndex: number }).resultIndex
      const result = (event as { results: { transcript: string }[][] }).results[current][0].transcript
      setTranscript(result)
    }
    
    recognition.onend = () => {
      setIsListening(false)
      if (transcript.trim().length > 0) {
        processTranscript(transcript)
      }
    }
    
    recognition.start()
  }, [transcript, processTranscript])

  const handleToggleListen = () => {
    if (!isActive) {
      setIsActive(true)
      return
    }

    if (isListening) {
      // Handled natively
    } else if (isSpeaking && sourceNodeRef.current) {
      sourceNodeRef.current.stop()
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      startListening()
    }
  }

  // Non-immersive preview (standard widget)
  if (!isActive) {
    return (
      <div 
        onClick={() => setIsActive(true)}
        className="group relative flex items-center gap-4 bg-glass-surface border border-glass-border p-4 rounded-[24px] cursor-pointer hover:bg-glass-layer hover:border-primary/50 transition-all overflow-hidden shadow-glass-card"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 shadow-twilight-glow">
          <Mic className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-foreground">ClearPath Intelligence</h4>
          <p className="text-[12px] text-muted-foreground">Tap to awaken</p>
        </div>
      </div>
    )
  }

  // CINEMATIC AI CONSCIOUSNESS INTERFACE
  return (
    <div className="fixed inset-0 z-[999] flex flex-col overflow-hidden page-transition-enter-active">
      
      {/* Heavy Blur Environment Background */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[24px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-8 relative z-50">
        <div className="flex items-center gap-3">
           <Brain className="w-6 h-6 text-primary" />
           <span className="text-[14px] font-bold tracking-wider uppercase text-primary/80">Intelligence Active</span>
        </div>
        <button 
          onClick={() => {
            setIsActive(false)
            if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
          }} 
          className="p-3 rounded-full hover:bg-white/10 transition-colors border border-glass-border bg-glass-surface shadow-sm"
        >
          <X className="w-5 h-5 text-muted-foreground hover:text-white" />
        </button>
      </div>

      {/* Cinematic Greeting (Only when idle) */}
      {!transcript && !aiResponse && !isListening && (
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center animate-fadeInUp pointer-events-none z-10 w-full">
          <h2 className="text-cinematic-greeting mb-4">Good Evening, {MOCK_CONTEXT.profile.name}.</h2>
          <p className="text-[18px] text-muted-foreground/80 font-medium tracking-wide">
             I am your ClearPath Intelligence. How can I assist you?
          </p>
        </div>
      )}

      {/* Floating HUD System (Asymmetrical, Organic Physics) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* Readiness Card */}
        <div className="absolute top-[25%] left-[8%] w-[280px] cinematic-glass-card p-8 rounded-[24px] pointer-events-auto" style={{ animation: 'cinematicFloat1 8s ease-in-out infinite' }}>
           <div className="text-[12px] uppercase tracking-widest text-primary mb-3 font-semibold">Readiness Score</div>
           <div className="text-[56px] font-bold leading-none tracking-tighter text-foreground">{MOCK_CONTEXT.profile.readiness}%</div>
        </div>

        {/* Missing Documents */}
        <div className="absolute bottom-[20%] left-[12%] w-[320px] cinematic-glass-card p-6 rounded-[24px] pointer-events-auto border-l-2 border-l-danger" style={{ animation: 'cinematicFloat2 10s ease-in-out infinite' }}>
           <div className="text-[12px] uppercase tracking-widest text-danger mb-2 font-semibold flex items-center gap-2"><Shield className="w-4 h-4"/> Critical Missing</div>
           <div className="text-[18px] font-medium text-foreground">{MOCK_CONTEXT.missingDoc}</div>
        </div>

        {/* Opportunity Radar */}
        <div className="absolute top-[30%] right-[10%] w-[280px] cinematic-glass-card p-6 rounded-[24px] pointer-events-auto" style={{ animation: 'cinematicFloat2 9s ease-in-out infinite' }}>
           <div className="text-[12px] uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Deadline Radar</div>
           <div className="text-[22px] font-medium text-foreground">{MOCK_CONTEXT.activeOpportunity.deadline}</div>
           <div className="text-[14px] text-warning mt-1">{MOCK_CONTEXT.activeOpportunity.title}</div>
        </div>

        {/* Engine Routing / Processing */}
        <div className="absolute bottom-[25%] right-[8%] w-[260px] cinematic-glass-card p-6 rounded-[24px] pointer-events-auto" style={{ animation: 'cinematicFloat1 11s ease-in-out infinite' }}>
           <div className="text-[12px] uppercase tracking-widest text-muted-foreground mb-4 font-semibold">Engine Status</div>
           <div className="space-y-3">
             <div className="flex justify-between items-center text-[13px]">
               <span className="text-muted-foreground">Voice Engine</span>
               <span className="text-primary font-medium">Deepgram</span>
             </div>
             <div className="flex justify-between items-center text-[13px]">
               <span className="text-muted-foreground">Reasoning Node</span>
               <span className="text-wisteria font-medium">OpenAI o1</span>
             </div>
           </div>
        </div>

      </div>

      {/* User Speech (Cinematic Dialogue Layout - Top Left/Center) */}
      {transcript && !aiResponse && (
         <div className="absolute top-[20%] left-1/2 -translate-x-1/2 md:left-[15%] md:translate-x-0 max-w-[600px] animate-fadeInUp z-30 pointer-events-none px-6">
            <div className="text-[12px] uppercase tracking-widest text-primary mb-3 font-semibold">User Input</div>
            <p className="text-[28px] md:text-[32px] text-foreground/90 font-medium leading-tight text-balance">
              &quot;{transcript}&quot;
            </p>
         </div>
      )}

      {/* Center: The AI Core Orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
        <div className="pointer-events-auto relative mt-12" onClick={handleToggleListen}>
          <VoiceOrb 
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            onToggleListen={handleToggleListen}
          />
        </div>
      </div>

      {/* AI Response (Cinematic Dialogue Layout - Beneath Orb) */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-full max-w-[900px] text-center px-8 z-30 pointer-events-none">
        {aiResponse && (
          <div className="animate-fadeInUp">
            <p className="text-[32px] md:text-[40px] font-medium tracking-tight leading-snug text-foreground text-balance drop-shadow-2xl filter" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {aiResponse}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
