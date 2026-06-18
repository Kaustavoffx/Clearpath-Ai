'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { VoiceOrb } from '@/components/ui/voice-orb'
import { toast } from 'sonner'
import { UploadWidget } from '@/components/opportunities/upload-widget'
import { useRouter } from 'next/navigation'
import { Brain, User as UserIcon, Activity, Target, Shield, X, Mic, Cpu } from 'lucide-react'

// Mock Data for Context Widgets
const MOCK_CONTEXT = {
  profile: { name: 'Student', readiness: 72, goal: 'College Admissions' },
  activeOpportunity: { title: 'OASIS Scholarship', deadline: '2026-07-15' },
  missingDoc: 'Income Certificate'
}

export function VoiceInterface() {
  const [isActive, setIsActive] = useState(false) // Controls the immersive overlay
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [documentContext, setDocumentContext] = useState<string | null>(null)
  const router = useRouter()

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

  const playAudio = useCallback(async (base64Audio: string) => {
    try {
      setIsSpeaking(true)
      const audioData = atob(base64Audio)
      const arrayBuffer = new ArrayBuffer(audioData.length)
      const view = new Uint8Array(arrayBuffer)
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i)
      }
      
      if (!audioContextRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      source.onended = () => setIsSpeaking(false)
      source.start(0)
      sourceNodeRef.current = source
    } catch (e) {
      console.error("Audio playback failed", e)
      setIsSpeaking(false)
    }
  }, [])

  const processTranscript = useCallback(async (finalText: string) => {
    setIsProcessing(true)
    setAiResponse("")
    
    try {
      // In full implementation, this hits Deepgram & OpenAI orchestration
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: finalText }]
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to process intent')
      
      // Assume the advisor returns { message: "..." }
      const responseText = data.message || "I've analyzed your request."
      setAiResponse(responseText)
      
      // Fallback to native TTS for hackathon since we might not have Deepgram fully integrated for TTS
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
    setIsActive(true) // Open immersive mode if not already

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
      // Handled by recognition.onend natively
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
        className="group relative flex items-center gap-4 bg-[#0B1E2E]/40 border border-white/10 p-4 rounded-[24px] cursor-pointer hover:bg-[#0B1E2E]/60 hover:border-primary/50 transition-all overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(133,138,227,0.3)]">
          <Mic className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-white">ClearPath Educational Copilot</h4>
          <p className="text-[12px] text-muted-foreground">Tap to start a voice session</p>
        </div>
      </div>
    )
  }

  // IMMERSIVE OVERLAY
  return (
    <div className="fixed inset-0 z-[999] flex flex-col bg-[#030712]/80 backdrop-blur-xl animate-in fade-in duration-500 font-sans text-white overflow-hidden">
      
      {/* Dynamic Background Glow based on state */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000" 
           style={{ backgroundColor: isSpeaking ? 'rgba(147, 202, 246, 0.15)' : isProcessing ? 'rgba(133, 138, 227, 0.2)' : isListening ? 'rgba(151, 223, 252, 0.15)' : 'rgba(255,255,255,0.02)' }} />

      {/* Header */}
      <div className="flex items-center justify-between p-8 relative z-10">
        <div className="flex items-center gap-3">
           <Brain className="w-6 h-6 text-primary" />
           <span className="text-[14px] font-bold tracking-wider uppercase text-primary/80">Educational Copilot</span>
        </div>
        <button 
          onClick={() => {
            setIsActive(false)
            if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
          }} 
          className="p-3 rounded-full hover:bg-white/10 transition-colors border border-white/5 bg-white/5"
        >
          <X className="w-5 h-5 text-muted-foreground hover:text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex w-full max-w-[1400px] mx-auto px-8 gap-8">
        
        {/* Left Side: Context Widgets */}
        <div className="w-[300px] hidden lg:flex flex-col gap-4 animate-in slide-in-from-left-8 duration-700 fade-in delay-150">
           <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">Live Context Memory</h3>
           
           <div className="bg-white/5 border border-white/10 rounded-[16px] p-5 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-3 text-white/90">
               <UserIcon className="w-4 h-4 text-[#93CAF6]" />
               <span className="text-[14px] font-medium">Profile Context</span>
             </div>
             <div className="text-[12px] text-muted-foreground space-y-2">
                <div className="flex justify-between"><span>Readiness</span><span className="text-white">{MOCK_CONTEXT.profile.readiness}%</span></div>
                <div className="flex justify-between"><span>Goal</span><span className="text-white">{MOCK_CONTEXT.profile.goal}</span></div>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[16px] p-5 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-3 text-white/90">
               <Target className="w-4 h-4 text-primary" />
               <span className="text-[14px] font-medium">Opportunity Context</span>
             </div>
             <div className="text-[12px] text-muted-foreground space-y-2">
                <div className="flex justify-between"><span>Active</span><span className="text-white">{MOCK_CONTEXT.activeOpportunity.title}</span></div>
                <div className="flex justify-between"><span>Deadline</span><span className="text-white">{MOCK_CONTEXT.activeOpportunity.deadline}</span></div>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[16px] p-5 backdrop-blur-md border-l-2 border-l-[#F87171]">
             <div className="flex items-center gap-3 mb-3 text-white/90">
               <Shield className="w-4 h-4 text-[#F87171]" />
               <span className="text-[14px] font-medium text-[#F87171]">Missing Documents</span>
             </div>
             <div className="text-[12px] text-white">
                {MOCK_CONTEXT.missingDoc}
             </div>
           </div>
        </div>

        {/* Center: The Orb and Conversation */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          <div className="flex flex-col items-center justify-center w-full max-w-2xl gap-12 relative z-10 -mt-16">
            
            <div className="text-center space-y-6 w-full min-h-[160px] flex flex-col justify-end px-4">
              {transcript && !aiResponse && (
                <div className="inline-block p-4 rounded-[20px] bg-white/5 backdrop-blur-md border border-white/10 mx-auto animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-[20px] text-white/90 leading-relaxed font-medium">
                    &quot;{transcript}&quot;
                  </p>
                </div>
              )}
              
              {aiResponse && (
                <div className="inline-block p-6 rounded-[24px] bg-primary/10 backdrop-blur-md border border-primary/20 shadow-[0_0_40px_rgba(133,138,227,0.15)] mx-auto animate-in fade-in zoom-in-95 duration-500">
                  <p className="text-[24px] font-medium tracking-tight leading-relaxed text-white">
                    {aiResponse}
                  </p>
                </div>
              )}
              
              {!transcript && !aiResponse && !isListening && (
                <p className="text-[18px] text-muted-foreground/60 font-medium tracking-wide">
                  Tap to speak. Try asking about your missing documents.
                </p>
              )}

              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 mt-4 text-[12px] uppercase tracking-widest font-bold">
                {isListening && <span className="text-[#97DFFC] animate-pulse flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#97DFFC]" /> Listening...</span>}
                {isProcessing && <span className="text-primary flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Thinking...</span>}
                {isSpeaking && <span className="text-[#93CAF6] flex items-center gap-2"><Activity className="w-3 h-3 animate-pulse" /> Speaking...</span>}
              </div>
            </div>

            <div className="relative mt-8" onClick={handleToggleListen}>
              {/* Dynamic sound wave background behind orb */}
              {(isListening || isSpeaking || isProcessing) && (
                <div className="absolute inset-0 m-auto w-[250px] h-[250px] flex items-center justify-center pointer-events-none">
                  <div className="absolute w-full h-full rounded-full border border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute w-[80%] h-[80%] rounded-full border border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                </div>
              )}
              
              <VoiceOrb 
                isListening={isListening}
                isProcessing={isProcessing}
                isSpeaking={isSpeaking}
                onToggleListen={handleToggleListen}
              />
            </div>
            
          </div>

        </div>

        {/* Right Side: Tech Stack Routing Info */}
        <div className="w-[280px] hidden lg:flex flex-col gap-4 animate-in slide-in-from-right-8 duration-700 fade-in delay-300">
           <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2 text-right">Engine Routing</h3>
           
           <div className="bg-[#0B1E2E]/40 border border-white/5 rounded-[16px] p-5 ml-auto w-full">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[13px] text-white/80">Voice Input</span>
               <div className="flex items-center gap-1.5 text-[11px] text-[#97DFFC] bg-[#97DFFC]/10 px-2 py-1 rounded-full border border-[#97DFFC]/20">
                 <Cpu className="w-3 h-3" /> Deepgram
               </div>
             </div>
             
             <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/5">
               <span className="text-[13px] text-white/80">Reasoning</span>
               <div className="flex items-center gap-1.5 text-[11px] text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                 <Brain className="w-3 h-3" /> OpenAI
               </div>
             </div>
             
             <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <span className="text-[13px] text-white/80">Data Scope</span>
               <div className="flex items-center gap-1.5 text-[11px] text-white/60 bg-white/5 px-2 py-1 rounded-full">
                 <Shield className="w-3 h-3" /> Protected
               </div>
             </div>
           </div>
        </div>

      </div>

    </div>
  )
}
