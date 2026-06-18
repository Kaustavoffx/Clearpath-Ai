'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, X, Send, Sparkles, AlertCircle, FileText, BrainCircuit, User, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function AdvisorPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'advisor',
      content: 'Good Evening. I am your ClearPath Advisor. What should we tackle today?',
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    "What should I do today?",
    "Which opportunity is most important?",
    "What documents am I missing?",
    "How can I improve readiness?"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return

    const newId = String(new Date().getTime())
    const userMessage: Message = { id: newId, role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

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
        setMessages(prev => [...prev, advisorMessage])
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

  return (
    <>
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-[#07111D]/90 backdrop-blur-2xl border-l border-[rgba(255,255,255,0.08)] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] z-[100] flex flex-col font-sans transition-transform duration-300 transform translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B1E2E]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(232,235,104,0.2)]">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground leading-tight">ClearPath Advisor</h2>
              <p className="text-[11px] text-success flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> System Online</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Judge Demo Button */}
        <div className="px-6 py-3 border-b border-white/5 bg-[#0B1E2E]/30">
          <button 
            onClick={() => setIsJudgeDemoOpen(true)}
            className="w-full py-2.5 rounded-[12px] bg-warning/10 border border-warning/30 text-warning text-[12px] font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-warning/20 transition-colors shadow-[0_0_15px_rgba(213,138,58,0.1)]"
          >
            <BrainCircuit className="w-4 h-4" />
            Show Advisor Intelligence
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-none">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col max-w-[90%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
              
              <div className={cn(
                "p-4 rounded-[16px] text-[14px] leading-[1.6]",
                msg.role === 'user' 
                  ? "bg-glass-layer border border-glass-border text-foreground" 
                  : "bg-primary/10 border border-primary/20 text-foreground shadow-[0_4px_20px_rgba(232,235,104,0.05)]"
              )}>
                {msg.content}
              </div>

              {/* Action Strategist Metadata */}
              {msg.metadata && msg.role === 'advisor' && msg.metadata.bestAction && (
                <div className="mt-3 w-full bg-[#0B1E2E] border border-white/10 rounded-[12px] p-4 flex flex-col gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                  <div className="flex justify-between items-start border-b border-white/5 pb-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Best Action</div>
                      <div className="text-[15px] font-semibold text-primary">{msg.metadata.bestAction}</div>
                    </div>
                    {msg.metadata.confidence && (
                      <div className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-[6px]", msg.metadata.confidence === 'High' ? "bg-success/20 text-success" : "bg-warning/20 text-warning")}>
                        {msg.metadata.confidence} Confidence
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Expected Gain</div>
                      <div className="text-[13px] font-medium text-success">{msg.metadata.expectedGain}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Time Req</div>
                      <div className="text-[13px] font-medium text-foreground">{msg.metadata.estimatedTime}</div>
                    </div>
                  </div>

                  {msg.metadata.basedOn && (
                    <div className="mt-1 pt-3 border-t border-white/5 flex gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      <span className="text-white/40">Based On:</span>
                      <span>{msg.metadata.basedOn.opportunities} Opps</span>
                      <span>{msg.metadata.basedOn.profile} Profile</span>
                      <span>{msg.metadata.basedOn.documents} Docs</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="self-start items-start bg-primary/10 border border-primary/20 text-foreground p-4 rounded-[16px] text-[14px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#07111D] border-t border-white/10">
          
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map(q => (
              <button 
                key={q} 
                onClick={() => handleSubmit(q)}
                className="text-[11px] font-medium text-muted-foreground bg-white/5 hover:bg-white/10 hover:text-foreground border border-white/10 rounded-[999px] px-3 py-1.5 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(input)}
              placeholder="Ask the Decision Engine..."
              className="w-full bg-[#0B1E2E] border border-white/10 rounded-[16px] pl-4 pr-24 py-4 text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                 <Mic className="w-4 h-4" />
                 <span className="text-[10px] uppercase font-bold tracking-widest hidden group-hover:block">Push</span>
              </button>
              <button onClick={() => handleSubmit(input)} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-center mt-3 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
            ClearPath Advisor • Responsible AI
          </div>
        </div>
      </div>

      {/* Judge Demo Modal */}
      {isJudgeDemoOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0B1E2E] border border-primary/30 rounded-[24px] shadow-[0_0_80px_rgba(232,235,104,0.15)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#07111D]">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-warning" />
                <h2 className="text-[20px] font-semibold text-foreground tracking-tight">Advisor Intelligence Flow</h2>
              </div>
              <button onClick={() => setIsJudgeDemoOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Data Sources */}
              <div className="flex flex-col gap-4 relative z-10">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">1. Data Sources</div>
                <div className="bg-[#07111D] p-4 rounded-[12px] border border-white/5 shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                   <User className="w-5 h-5 text-blue-400" />
                   <div className="text-[13px] font-medium text-white">Profile Data</div>
                </div>
                <div className="bg-[#07111D] p-4 rounded-[12px] border border-white/5 shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                   <Target className="w-5 h-5 text-success" />
                   <div className="text-[13px] font-medium text-white">Saved Opportunities</div>
                </div>
                <div className="bg-[#07111D] p-4 rounded-[12px] border border-white/5 shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                   <FileText className="w-5 h-5 text-warning" />
                   <div className="text-[13px] font-medium text-white">Missing Documents</div>
                </div>
              </div>

              {/* Context Engine */}
              <div className="flex flex-col gap-4 relative z-10 justify-center">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2 text-center">2. Context Builder</div>
                <div className="bg-primary/10 border border-primary/30 p-6 rounded-[16px] flex flex-col items-center text-center shadow-[0_0_30px_rgba(232,235,104,0.1)] animate-in zoom-in duration-500 delay-300">
                  <BrainCircuit className="w-10 h-10 text-primary mb-3 animate-pulse" />
                  <div className="text-[14px] font-semibold text-white mb-2">Reasoning Layer</div>
                  <div className="text-[11px] text-primary/80">Cross-referencing deadlines, requirements, and readiness impact.</div>
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col gap-4 relative z-10 justify-end">
                 <div className="text-[11px] font-semibold uppercase tracking-widest text-success mb-2 text-right">3. Action Strategist</div>
                 <div className="bg-[#07111D] p-5 rounded-[12px] border border-success/30 shadow-sm flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-500 delay-500">
                   <div className="text-[11px] text-muted-foreground uppercase tracking-widest">Recommendation</div>
                   <div className="text-[15px] font-semibold text-success">Upload Income Cert</div>
                   <div className="text-[12px] text-white/60">Expected Impact: +18 Readiness</div>
                 </div>
              </div>

              {/* Connecting Lines (Decorative) */}
              <div className="absolute top-1/2 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-blue-400/20 via-primary/50 to-success/20 z-0 hidden md:block animate-pulse" />
            </div>

            <div className="p-6 bg-warning/10 border-t border-warning/20 flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-warning shrink-0" />
              <div>
                <h4 className="text-[14px] font-semibold text-warning mb-1">Why this matters (Judge Demo)</h4>
                <p className="text-[13px] text-warning/80 leading-relaxed">
                  Most student &quot;AI&quot; tools are generic chatbots summarizing documents. ClearPath Advisor acts as an execution engine—it reads the student&apos;s personal database state, calculates mathematical ROI, and dictates the single most optimal action to take to secure funding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
