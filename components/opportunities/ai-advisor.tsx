'use client'

import React, { useState } from 'react'
import { Bot, Send, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AiAdvisor({ opportunityData }: { opportunityData: any }) {
  const [query, setQuery] = useState('')
  const [chat, setChat] = useState([
    {
      id: 1,
      sender: 'ai',
      message: `Hello! I am your Context-Aware AI Advisor. I have fully analyzed "${opportunityData?.title || 'this document'}" and understand your current readiness score. What specific questions do you have about the eligibility criteria or deadlines?`
    }
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const userMessage = { id: Date.now(), sender: 'user', message: query }
    setChat(prev => [...prev, userMessage])
    setQuery('')

    // Mock AI response for Phase 3 UI
    setTimeout(() => {
      setChat(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          sender: 'ai', 
          message: 'The integration for live generative responses is scheduled for the upcoming platform iteration. I have securely logged your query regarding the context of this specific opportunity.' 
        }
      ])
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
      
      {/* Context Sidebar */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="liquid-glass-card p-6 rounded-[24px] border border-glass-border">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" /> Active Context
          </h3>
          <p className="text-[14px] text-foreground leading-relaxed mb-4">
            I am constrained to answering questions exclusively based on the contents of the uploaded source document and your active profile.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[13px] font-medium text-success bg-success/10 p-2.5 rounded-lg border border-success/20">
              <ShieldCheck className="w-4 h-4" /> Context Locked
            </div>
            <div className="flex items-center gap-2 text-[13px] font-medium text-warning bg-warning/10 p-2.5 rounded-lg border border-warning/20">
              <AlertTriangle className="w-4 h-4" /> No external hallucinations
            </div>
          </div>
        </div>

        <div className="liquid-glass-card p-6 rounded-[24px] border border-glass-border flex-1">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Suggested Queries
          </h3>
          <div className="space-y-2">
            {[
              "Explain the hidden eligibility traps.",
              "What happens if I miss the deadline?",
              "Do I strictly need the income certificate?"
            ].map((q, i) => (
              <button 
                key={i}
                onClick={() => setQuery(q)}
                className="w-full text-left text-[13px] p-3 rounded-xl bg-glass-surface/50 border border-glass-border hover:bg-glass-layer hover:text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 liquid-glass-card border border-glass-border rounded-[24px] flex flex-col relative overflow-hidden shadow-glass-card">
        {/* Soft background glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10">
          {chat.map((msg) => (
            <div key={msg.id} className={cn("flex w-full", msg.sender === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-[20px] text-[15px] leading-relaxed shadow-sm",
                msg.sender === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-glass-surface border border-glass-border rounded-tl-sm text-foreground"
              )}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-glass-surface/80 border-t border-glass-border backdrop-blur-md z-10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the advisor about this document..." 
              className="w-full bg-background/50 border border-glass-border rounded-full pl-6 pr-14 py-4 text-[15px] text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
