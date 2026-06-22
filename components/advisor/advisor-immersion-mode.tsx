'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Sparkles, Keyboard, Loader2, ArrowLeft, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VoiceOrb } from '@/components/ui/voice-orb'
import { toast } from 'sonner'

interface AdvisorResponse {
  bestAction?: string;
  reason?: string;
  expectedGain?: string;
  estimatedTime?: string;
  message?: string;
  basedOn?: { opportunities: number; profile: number; documents: number };
  confidence?: 'High' | 'Medium' | 'Low';
}

interface Message {
  id: string;
  role: 'user' | 'advisor';
  content: string;
  metadata?: AdvisorResponse;
}

type AdvisorState = 'idle' | 'listening' | 'thinking' | 'speaking'

export function AdvisorImmersionMode({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [advisorState, setAdvisorState] = useState<AdvisorState>('idle')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [suggestions] = useState([
    "What should I do today?",
    "Which deadline is closest?",
    "What documents am I missing?",
  ])
  
  // Animation & Rendering States
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Progressive Revealing & Auto-Scroll States
  const [revealedCharCount, setRevealedCharCount] = useState<number>(0)
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({})
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const recognitionRef = useRef<unknown>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // ─── PROGRESSIVE TEXT REVEALER ───
  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    if (!latestMessage) return

    if (latestMessage.role === 'user') {
      setRevealedCharCount(latestMessage.content.length)
      return
    }

    if (advisorState === 'idle') {
      setRevealedCharCount(latestMessage.content.length)
      return
    }

    if (advisorState === 'speaking') {
      const timer = setInterval(() => {
        setRevealedCharCount((prev) => {
          if (prev < latestMessage.content.length) {
            return prev + 3 // Reveal 3 chars per ~30ms (simulates speaking pace)
          }
          clearInterval(timer)
          return latestMessage.content.length
        })
      }, 30)
      return () => clearInterval(timer)
    }
  }, [messages, advisorState])

  // Reset expanded sections when a new message arrives
  useEffect(() => {
    setExpandedSections({})
    setAutoScrollEnabled(true)
    setRevealedCharCount(0)
  }, [messages.length])

  // ─── AUTO SCROLL LOGIC ───
  useEffect(() => {
    if (autoScrollEnabled && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [revealedCharCount, messages.length, autoScrollEnabled, expandedSections])

  const handleUserScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Check if scrolled up significantly
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    if (!isAtBottom && autoScrollEnabled) {
      setAutoScrollEnabled(false);
    } else if (isAtBottom && !autoScrollEnabled) {
      setAutoScrollEnabled(true);
    }
  }, [autoScrollEnabled])

  // ─── MOUNT & ANIMATION LOGIC ───
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsRendered(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ─── UNIVERSAL CLOSE SYSTEM ───
  const handleClose = useCallback(() => {
    if (window.history.state?.advisorOpen) {
      window.history.back()
    } else {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return;

    if (document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }

    window.history.pushState({ advisorOpen: true }, '');

    const handlePopState = (e: PopStateEvent) => {
      onClose();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
      if (window.history.state?.advisorOpen) {
        window.history.back()
      }
    }
  }, [isOpen, onClose, handleClose])


  // Focus input when keyboard shown
  useEffect(() => {
    if (showKeyboard && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showKeyboard])

  // Generate initial greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'
      setMessages([{
        id: '1',
        role: 'advisor',
        content: `Good ${timeOfDay}. I am your ClearPath Advisor. Ask me anything about your opportunities, deadlines, or readiness.`,
      }])
    }
  }, [isOpen, messages.length])

  // ─── AUDIO PLAYBACK ───
  const playAudio = useCallback(async (base64Audio: string) => {
    try {
      setAdvisorState('speaking')
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
      source.onended = () => setAdvisorState('idle')
      source.start(0)
      sourceNodeRef.current = source
    } catch {
      setAdvisorState('idle')
    }
  }, [])

  const fallbackTTS = useCallback((text: string) => {
    setAdvisorState('speaking')
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.onend = () => setAdvisorState('idle')
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setAdvisorState('idle'), 3000)
    }
  }, [])

  // ─── PROCESS USER INPUT ───
  const processInput = useCallback(async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLiveTranscript('')
    setShowKeyboard(false)
    setAdvisorState('thinking')

    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      })

      if (!res.ok) throw new Error('Orchestrator failed')

      const data = await res.json()
      
      const advisorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'advisor',
        content: data.text || 'I processed your request.',
      }
      setMessages(prev => [...prev, advisorMsg])

      if (data.audioBase64) {
        playAudio(data.audioBase64)
      } else {
        fallbackTTS(data.text || advisorMsg.content)
      }
    } catch {
      try {
        const allMessages = [...messages, userMsg].map(m => ({
          role: m.role === 'advisor' ? 'assistant' : 'user',
          content: m.content
        }))

        const res = await fetch('/api/advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages })
        })

        if (res.ok) {
          const data: AdvisorResponse = await res.json()
          const advisorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'advisor',
            content: data.message || 'I processed your request.',
            metadata: data
          }
          setMessages(prev => [...prev, advisorMsg])
          fallbackTTS(data.message || advisorMsg.content)
        } else {
          throw new Error('Both APIs failed')
        }
      } catch {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'advisor',
          content: 'I encountered an error connecting to the intelligence engine. Please check your network connection.'
        }])
        setAdvisorState('idle')
      }
    }
  }, [messages, playAudio, fallbackTTS])

  // ─── SPEECH RECOGNITION (Web Speech API) ───
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition not supported. Use the keyboard instead.")
      setShowKeyboard(true)
      return
    }

    setAdvisorState('listening')
    setLiveTranscript('')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let finalTranscript = ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setLiveTranscript(finalTranscript + interim)
    }

    recognition.onend = () => {
      const text = finalTranscript.trim()
      if (text.length > 0) {
        processInput(text)
      } else {
        setAdvisorState('idle')
      }
    }

    recognition.onerror = () => {
      setAdvisorState('idle')
      toast.error("Could not capture audio. Please try again.")
    }

    recognition.start()
    recognitionRef.current = recognition
  }, [processInput])

  const handleToggleListen = useCallback(() => {
    if (advisorState === 'listening' && recognitionRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).stop()
    } else if (advisorState === 'speaking') {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop()
      }
      window.speechSynthesis?.cancel()
      setAdvisorState('idle')
    } else if (advisorState === 'idle') {
      startListening()
    }
  }, [advisorState, startListening])

  if (!isRendered) return null

  const latestMessage = messages[messages.length - 1]
  const showActionCard = latestMessage?.role === 'advisor' && latestMessage.metadata?.bestAction
  const isAdvisorLatest = latestMessage?.role === 'advisor'

  // Render logic for progressive text
  let visibleSections: string[] = []
  if (isAdvisorLatest) {
    const revealedSubstring = latestMessage.content.substring(0, revealedCharCount)
    // Split by double newline to form sections
    visibleSections = revealedSubstring.split(/\n\n+/).filter(s => s.trim().length > 0)
    // Ensure at least one section if we have content but no newlines
    if (visibleSections.length === 0 && revealedSubstring.trim().length > 0) {
      visibleSections = [revealedSubstring]
    }
  }

  // State label
  const stateLabel = advisorState === 'listening' ? 'Listening...'
    : advisorState === 'thinking' ? 'Thinking...'
    : advisorState === 'speaking' ? 'Speaking...'
    : 'Tap to speak'

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[200] font-sans flex flex-col items-center justify-between overflow-hidden bg-[#030712]/90",
        "transition-all duration-200 ease-in-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )} 
      style={{ backdropFilter: 'blur(10px)' }}
    >
      
      {/* Background ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none gpu-accelerate">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full animate-ambientPulse" style={{ background: 'radial-gradient(circle, rgba(61,14,97,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(133,138,227,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* ─── DESKTOP/MOBILE CLOSE BUTTON ─── */}
      <button 
        onClick={handleClose} 
        aria-label="Close Advisor"
        title="Close Advisor"
        className="absolute z-50 flex items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/5 text-muted-foreground hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(133,138,227,0.5)] md:top-[24px] md:right-[24px] md:w-12 md:h-12 w-11 h-11 right-4 top-4"
        style={{ paddingTop: 'env(safe-area-inset-top)', boxSizing: 'content-box' }}
      >
        <X className="w-5 h-5" />
      </button>

      {/* ─── HEADER ─── */}
      <div className="w-full flex items-center p-5 relative z-10 shrink-0" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#071225] border border-glass-border flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#97DFFC]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-foreground">ClearPath Intelligence</span>
            <span className="text-[10px] text-[#97DFFC] uppercase tracking-[0.1em] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#97DFFC] animate-breathe" /> Active
            </span>
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE CENTERPIECE ─── */}
      <div 
        ref={scrollContainerRef}
        onWheel={handleUserScroll}
        onTouchMove={handleUserScroll}
        className="flex-1 w-full flex flex-col items-center justify-start relative z-10 px-6 gap-8 pb-20 md:pb-12 overflow-y-auto scrollbar-none"
      >
        
        {/* Faded Transcript History */}
        <div className="w-full max-w-[700px] flex flex-col gap-4 mt-8">
          {messages.slice(0, -1).map((msg, idx) => (
            <div 
              key={msg.id}
              className={cn(
                "flex flex-col transition-crisp",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
              style={{ opacity: 0.3 }}
            >
              <div className={cn(
                "px-4 py-2.5 rounded-2xl max-w-[85%] text-[15px] leading-[1.6]",
                msg.role === 'user' ? "bg-white/4 text-white/70" : "text-[#97DFFC]/70"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Live Transcription */}
        {liveTranscript && advisorState === 'listening' && (
          <div className="text-[18px] text-muted-foreground text-center w-full max-w-[700px] animate-fadeInUp mt-4">
            &ldquo;{liveTranscript}&rdquo;
          </div>
        )}

        {/* Active Content */}
        <div className="w-full max-w-[700px] flex flex-col items-center justify-start gap-5 min-h-[50vh]">
          {advisorState === 'thinking' ? (
            <div className="text-[16px] text-[#858AE3]/60 flex items-center justify-center gap-2.5 font-medium animate-fadeInUp mt-8">
              <Loader2 className="w-4 h-4 animate-spin" /> Reasoning over your data...
            </div>
          ) : latestMessage ? (
            <div className="flex flex-col items-center gap-5 w-full animate-fadeInUp mt-8">
              
              {/* User message rendering */}
              {latestMessage.role === 'user' && (
                <p className="text-[20px] md:text-[24px] font-medium leading-[1.45] tracking-[-0.01em] text-white text-center">
                  {latestMessage.content}
                </p>
              )}

              {/* Advisor progressive text rendering with chunking */}
              {isAdvisorLatest && visibleSections.map((section, idx) => {
                const isLatestSection = idx === visibleSections.length - 1;
                const isExpanded = expandedSections[idx] || isLatestSection;
                const alignLeft = section.length > 80 || visibleSections.length > 1;

                if (!isExpanded) {
                  return (
                    <button 
                      key={idx}
                      onClick={() => setExpandedSections(prev => ({ ...prev, [idx]: true }))}
                      className="w-full max-w-[90vw] md:max-w-[700px] liquid-glass-card p-4 text-left flex items-center justify-between border-glass-border hover:bg-white/5 transition-all text-[#858AE3] rounded-[16px] animate-fadeInUp"
                    >
                      <span className="text-[14px] font-medium truncate">Previous Guidance</span>
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    </button>
                  )
                }

                return (
                  <div key={idx} className="w-full flex flex-col gap-2 animate-fadeInUp">
                    {/* Optional collapse button if it's not the last section but was manually expanded */}
                    {!isLatestSection && (
                      <button 
                        onClick={() => setExpandedSections(prev => ({ ...prev, [idx]: false }))}
                        className="self-end text-[12px] text-muted-foreground hover:text-white flex items-center gap-1 mb-1"
                      >
                        Collapse <ChevronUp className="w-3 h-3" />
                      </button>
                    )}
                    <p className={cn(
                      "text-[18px] md:text-[22px] font-medium leading-[1.7] tracking-[-0.01em] text-[#97DFFC] max-w-[90vw] md:max-w-[700px]",
                      alignLeft ? "text-left" : "text-center self-center"
                    )}>
                      {section}
                    </p>
                  </div>
                )
              })}

              {/* Intelligence Card */}
              {showActionCard && latestMessage.metadata && revealedCharCount >= latestMessage.content.length && (
                <div className="w-full max-w-[90vw] md:max-w-[700px] liquid-glass-card p-5 text-left border-[#858AE3]/15 mt-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-card-label text-[#858AE3] mb-1.5">Recommended Action</div>
                      <div className="text-[18px] font-semibold text-white">{latestMessage.metadata.bestAction}</div>
                    </div>
                    {latestMessage.metadata.confidence && (
                      <div className="px-2.5 py-1 rounded-full bg-[#858AE3]/8 border border-[#858AE3]/15 text-[#858AE3] text-[10px] uppercase tracking-[0.1em] font-semibold shrink-0 h-fit flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {latestMessage.metadata.confidence}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-glass-border pt-4">
                    {latestMessage.metadata.expectedGain && (
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium mb-1">Expected ROI</div>
                        <div className="text-[13px] font-medium text-[#97DFFC]">{latestMessage.metadata.expectedGain}</div>
                      </div>
                    )}
                    {latestMessage.metadata.estimatedTime && (
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium mb-1">Time</div>
                        <div className="text-[13px] font-medium text-white">{latestMessage.metadata.estimatedTime}</div>
                      </div>
                    )}
                    {latestMessage.metadata.basedOn && (
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium mb-1">Context</div>
                        <div className="text-[12px] font-medium text-muted-foreground">
                          {latestMessage.metadata.basedOn.opportunities} Opps · {latestMessage.metadata.basedOn.profile} Profile
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Suggestions when idle */}
          {!latestMessage && advisorState !== 'thinking' && (
            <div className="flex flex-col items-center gap-4 animate-fadeInUp mt-8">
              <p className="text-[14px] text-muted-foreground mb-1">Try saying:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => processInput(s)}
                    className="text-[12px] font-medium text-muted-foreground bg-white/4 hover:bg-white/8 hover:text-foreground border border-white/6 rounded-full px-4 py-2 transition-crisp"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Floating "Jump to Latest" Button */}
        {!autoScrollEnabled && advisorState === 'speaking' && (
          <div className="sticky bottom-4 z-50 animate-fadeInUp">
            <button 
              onClick={() => {
                setAutoScrollEnabled(true)
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
                }
              }}
              className="flex items-center gap-2 bg-[#858AE3] text-[#030712] px-4 py-2 rounded-full font-semibold shadow-[0_0_20px_rgba(133,138,227,0.3)] hover:scale-105 transition-all text-[13px]"
            >
              <ArrowDown className="w-4 h-4" /> Jump to Latest
            </button>
          </div>
        )}

        <div ref={messagesEndRef} className="h-8 shrink-0" />
      </div>

      {/* ─── BOTTOM CONTROLS (FIXED) ─── */}
      <div className="w-full shrink-0 flex flex-col items-center justify-end p-6 relative z-10 min-h-[100px] mb-[env(safe-area-inset-bottom)] md:mb-0 border-t border-white/5 bg-[#030712]/50">
        {/* Voice Orb */}
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 shrink-0">
          <VoiceOrb 
            isListening={advisorState === 'listening'}
            isProcessing={advisorState === 'thinking'}
            isSpeaking={advisorState === 'speaking'}
            onToggleListen={handleToggleListen}
          />
          <span className={cn(
            "text-[10px] uppercase tracking-[0.12em] font-medium transition-crisp",
            advisorState === 'listening' ? "text-[#97DFFC]" :
            advisorState === 'thinking' ? "text-[#858AE3]" :
            advisorState === 'speaking' ? "text-[#858AE3]" :
            "text-muted-foreground"
          )}>
            {stateLabel}
          </span>
        </div>

        {showKeyboard ? (
          <div className="w-full max-w-xl flex items-center gap-2 bg-[#071225]/80 border border-glass-border p-2 rounded-2xl animate-fadeInUp mb-12 md:mb-0 mt-8" style={{ backdropFilter: 'blur(12px)' }}>
            <button 
              onClick={() => setShowKeyboard(false)}
              className="p-2.5 text-muted-foreground hover:text-white transition-crisp"
            >
              <X className="w-4 h-4" />
            </button>
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processInput(input)}
              placeholder="Ask ClearPath Intelligence..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-white placeholder:text-muted-foreground/60 px-2"
            />
            <button 
              onClick={() => processInput(input)}
              disabled={!input.trim()}
              className="p-2.5 bg-[#858AE3] text-[#030712] rounded-full disabled:opacity-30 disabled:bg-[#071225] disabled:text-muted-foreground transition-crisp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-5 animate-fadeInUp mb-14 md:mb-0 mt-8 w-full max-w-xl justify-end">
            <button 
              onClick={() => setShowKeyboard(true)}
              className="p-3.5 rounded-full bg-[#071225] border border-glass-border hover:bg-white/5 hover:border-white/10 text-muted-foreground hover:text-white transition-crisp"
            >
              <Keyboard className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* ─── MOBILE BOTTOM EXIT ACTION ─── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button 
          onClick={handleClose}
          aria-label="Back to Dashboard"
          className="w-full min-h-[56px] flex items-center justify-center gap-2 bg-[#030712]/95 border-t border-glass-border text-[15px] font-medium text-white/90 hover:bg-[#071225] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
      </div>

    </div>
  )
}
