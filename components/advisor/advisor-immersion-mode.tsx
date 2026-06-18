'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Keyboard, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VoiceOrb } from '@/components/ui/voice-orb'
import { motion, AnimatePresence } from 'framer-motion'

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

export function AdvisorImmersionMode({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'advisor',
      content: 'Good Evening. I am your ClearPath Advisor. What should we tackle today?',
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, showKeyboard])

  const handleToggleListen = () => {
    if (isListening) {
      setIsListening(false)
      // Simulating voice processing
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setIsSpeaking(true)
        setMessages(prev => [...prev, 
          { id: Date.now().toString(), role: 'user', content: 'What is my top priority today?' },
          { id: (Date.now() + 1).toString(), role: 'advisor', content: 'Based on your profile, you should apply for the State Merit Scholarship. It takes 15 minutes.' }
        ])
        setTimeout(() => setIsSpeaking(false), 4000)
      }, 1500)
    } else {
      setIsListening(true)
    }
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return

    const newId = String(new Date().getTime())
    const userMessage: Message = { id: newId, role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)
    setShowKeyboard(false)

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role === 'advisor' ? 'assistant' : 'user', content: m.content }))
        })
      })

      if (response.ok) {
        const data: AdvisorResponse = await response.json()
        const advisorMessage: Message = {
          id: String(new Date().getTime() + 1),
          role: 'advisor',
          content: data.message || 'I processed your request.',
          metadata: data
        }
        setIsSpeaking(true)
        setMessages(prev => [...prev, advisorMessage])
        setTimeout(() => setIsSpeaking(false), 4000)
      } else {
        throw new Error("Failed to fetch")
      }
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'advisor', content: 'I encountered an error connecting to the Context Engine.' }])
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  // We only want to show the latest advisor metadata card, or none if it's just text
  const latestMessage = messages[messages.length - 1]
  const showActionCard = latestMessage?.role === 'advisor' && latestMessage.metadata?.bestAction

  return (
    <div className="fixed inset-0 z-[200] font-sans flex flex-col items-center justify-between overflow-hidden bg-[#07111D]/80 backdrop-blur-2xl">
      
      {/* Background gradients for extra depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#3D0E61]/20 blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#858AE3]/10 blur-[150px] mix-blend-screen" />
      </div>

      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-glass-layer border border-glass-border flex items-center justify-center shadow-glass-card">
            <Sparkles className="w-5 h-5 text-[#97DFFC]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold tracking-wide text-foreground">ClearPath OS Intelligence</span>
            <span className="text-[11px] text-[#97DFFC] uppercase tracking-widest font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#97DFFC] animate-pulse" /> Active
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-3 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Centerpiece: Faded Timeline + Orb + Action Card */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10 px-6 gap-12">
        
        {/* Floating Transcript (faded) */}
        <div className="w-full max-w-2xl max-h-[30vh] overflow-y-auto scrollbar-none flex flex-col gap-6 mask-image-b-fade pb-10">
          {messages.slice(0, -1).map((msg, idx) => {
            const isLastOfHistory = idx === messages.length - 2
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isLastOfHistory ? 0.6 : 0.3, y: 0 }}
                className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
              >
                <div className={cn(
                  "px-5 py-3 rounded-[20px] max-w-[85%] text-[16px] leading-[1.6]",
                  msg.role === 'user' ? "bg-white/5 text-white/80" : "text-[#97DFFC]/80"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* The Voice Orb */}
        <motion.div 
          layoutId="advisor-orb"
          className="flex justify-center shrink-0"
        >
          <VoiceOrb 
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking || (!isProcessing && !isListening && latestMessage?.role === 'advisor')}
            onToggleListen={handleToggleListen}
          />
        </motion.div>

        {/* Current Active Content */}
        <div className="w-full max-w-2xl min-h-[120px] flex flex-col items-center justify-start text-center gap-6">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[18px] text-[#97DFFC]/60 flex items-center gap-3 font-medium"
              >
                <Loader2 className="w-5 h-5 animate-spin" /> Reasoning...
              </motion.div>
            ) : (
              <motion.div
                key={latestMessage?.id || 'empty'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                {/* Active Message Text */}
                <h3 className={cn(
                  "text-[22px] md:text-[28px] font-medium leading-[1.4] tracking-tight max-w-[90%]",
                  latestMessage?.role === 'user' ? "text-white" : "text-[#97DFFC]"
                )}>
                  {latestMessage?.content}
                </h3>

                {/* OS Intelligence Card */}
                {showActionCard && latestMessage.metadata && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full bg-[#0B1E2E]/80 backdrop-blur-xl border border-[#858AE3]/30 rounded-[24px] p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-[#858AE3] font-semibold mb-2">Recommended Action</div>
                        <div className="text-[20px] font-semibold text-white">{latestMessage.metadata.bestAction}</div>
                      </div>
                      {latestMessage.metadata.confidence && (
                        <div className="px-3 py-1.5 rounded-full bg-[#858AE3]/10 border border-[#858AE3]/30 text-[#858AE3] text-[11px] uppercase tracking-wider font-bold shrink-0 h-fit flex items-center gap-2">
                           <Sparkles className="w-3 h-3" />
                           {latestMessage.metadata.confidence} Confidence
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-5">
                      {latestMessage.metadata.expectedGain && (
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">Expected ROI</div>
                          <div className="text-[14px] font-medium text-[#97DFFC]">{latestMessage.metadata.expectedGain}</div>
                        </div>
                      )}
                      {latestMessage.metadata.estimatedTime && (
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">Time to Execute</div>
                          <div className="text-[14px] font-medium text-white">{latestMessage.metadata.estimatedTime}</div>
                        </div>
                      )}
                      {latestMessage.metadata.basedOn && (
                        <div className="col-span-2 md:col-span-1">
                          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">Context Engine Base</div>
                          <div className="text-[13px] font-medium text-muted-foreground">
                            {latestMessage.metadata.basedOn.opportunities} Opps • {latestMessage.metadata.basedOn.profile} Profile
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full flex flex-col items-center justify-end p-8 relative z-10 min-h-[140px]">
        <AnimatePresence mode="wait">
          {showKeyboard ? (
            <motion.div
              key="keyboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl flex items-center gap-3 bg-glass-surface/80 backdrop-blur-xl border border-glass-border p-2 rounded-[24px] shadow-glass-card"
            >
              <button 
                onClick={() => setShowKeyboard(false)}
                className="p-3 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <input 
                type="text"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(input)}
                placeholder="Ask ClearPath Intelligence..."
                className="flex-1 bg-transparent border-none outline-none text-[16px] text-white placeholder:text-muted-foreground px-2"
              />
              <button 
                onClick={() => handleSubmit(input)}
                disabled={!input.trim()}
                className="p-3 bg-[#858AE3] text-[#07111D] rounded-full disabled:opacity-50 disabled:bg-glass-layer disabled:text-muted-foreground transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="controls"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-6"
            >
              <button 
                onClick={() => setShowKeyboard(true)}
                className="p-4 rounded-full bg-glass-layer border border-glass-border hover:bg-white/10 hover:border-white/20 text-muted-foreground hover:text-white transition-all shadow-elevation-1"
              >
                <Keyboard className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
