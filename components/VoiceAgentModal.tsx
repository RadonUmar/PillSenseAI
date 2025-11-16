'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceAgentModalProps {
  isOpen: boolean
  onClose: () => void
  medicineOrPillBox: string
}

interface Message {
  id: string
  type: 'user' | 'agent'
  text: string
}

export function VoiceAgentModal({
  isOpen,
  onClose,
  medicineOrPillBox,
}: VoiceAgentModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      text: `Hello! I'm your ${medicineOrPillBox} AI assistant. How can I help you today?`,
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
    }
    setMessages([...messages, newMessage])
    setInput('')

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        'I understand. Let me help you with that.',
        'That\'s a great question! Based on your medical profile...',
        'I\'ve recorded that information. Is there anything else?',
        'Noted. Do you have any other concerns?',
      ]
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'agent',
          text: randomResponse,
        },
      ])
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            {medicineOrPillBox} Agent
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-foreground-secondary)]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[var(--color-primary)]/30 text-[var(--color-foreground)]'
                    : 'bg-[var(--color-accent)]/20 text-[var(--color-foreground)]'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-[var(--color-border)] p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-foreground)] placeholder-[var(--color-foreground-secondary)]/60 focus:outline-none focus:border-[var(--color-primary)]/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white p-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
