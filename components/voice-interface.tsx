'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { VoiceOrb } from '@/components/ui/voice-orb'
import { toast } from 'sonner'
import { UploadWidget } from '@/components/opportunities/upload-widget'

export function VoiceInterface() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [documentContext, setDocumentContext] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)

  // A simplified mock of Deepgram STT for the sake of this prototype.
  // In a full production build, we'd use @deepgram/sdk via WebSockets here.
  // We'll use the native Web Speech API as a lightweight polyfill if available,
  // falling back to a text-input simulation if needed.
  
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
       toast.error("Speech recognition is not supported in this browser.")
       return
    }
    
    setIsListening(true)
    setTranscript("")
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex
      const result = event.results[current][0].transcript
      setTranscript(result)
    }
    
    recognition.onend = () => {
      setIsListening(false)
      // When listening ends, send to orchestrator
      if (transcript.trim().length > 0) {
        processTranscript(transcript)
      }
    }
    
    recognition.start()
  }, [transcript])

  const processTranscript = async (finalText: string) => {
    setIsProcessing(true)
    setAiResponse("")
    
    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: finalText,
          activeDocumentContext: documentContext 
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      setAiResponse(data.text)
      
      if (data.audioBase64) {
        playAudio(data.audioBase64)
      } else {
        // Fallback to native TTS if OpenAI fails/missing key
        fallbackTTS(data.text)
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to process intent')
    } finally {
      setIsProcessing(false)
    }
  }

  const playAudio = async (base64Audio: string) => {
    try {
      setIsSpeaking(true)
      const audioData = atob(base64Audio)
      const arrayBuffer = new ArrayBuffer(audioData.length)
      const view = new Uint8Array(arrayBuffer)
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i)
      }
      
      if (!audioContextRef.current) {
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
  }

  const fallbackTTS = (text: string) => {
    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleToggleListen = () => {
    if (isListening) {
      // Stop logic handled by recognition.onend
    } else if (isSpeaking && sourceNodeRef.current) {
      sourceNodeRef.current.stop()
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl mx-auto gap-12 relative z-10">
      
      <div className="text-center space-y-4 max-w-2xl min-h-[120px] flex flex-col justify-end">
         {transcript && !aiResponse && (
           <p className="text-2xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4">
             "{transcript}"
           </p>
         )}
         {aiResponse && (
           <p className="text-3xl font-medium tracking-tight animate-in fade-in slide-in-from-bottom-4">
             {aiResponse}
           </p>
         )}
         {!transcript && !aiResponse && !isListening && (
           <p className="text-xl text-muted-foreground opacity-50">
             Tap the orb and say, "What's my next deadline?"
           </p>
         )}
      </div>

      <VoiceOrb 
        isListening={isListening}
        isProcessing={isProcessing}
        isSpeaking={isSpeaking}
        onToggleListen={handleToggleListen}
      />
      
      {/* Hidden/Minimalist Document Dropzone */}
      <div className="absolute bottom-10 opacity-30 hover:opacity-100 transition-opacity w-full max-w-md">
         <p className="text-xs text-center text-muted-foreground mb-2">Drag and drop a document here to analyze</p>
         <UploadWidget 
            onUploadComplete={(id) => {
              toast.success("Document cached for voice analysis.")
              // In a real app, we'd fetch the document text here to populate context.
              setDocumentContext("Document ID: " + id + " has been uploaded.")
            }} 
         />
      </div>

    </div>
  )
}
