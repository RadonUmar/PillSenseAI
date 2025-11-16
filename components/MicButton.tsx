'use client'

import { Mic, MicOff } from 'lucide-react'

interface MicButtonProps {
  onClick?: () => void
  isListening?: boolean
  isLoading?: boolean
}

export function MicButton({ onClick, isListening = false, isLoading = false }: MicButtonProps) {
  const handleClick = () => {
    if (isLoading) return
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: isListening
          ? 'var(--color-primary)'
          : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
        boxShadow: isListening
          ? '0 10px 25px rgba(244, 168, 159, 0.5)'
          : 'none',
        transform: isListening ? 'scale(1.1)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isListening && !isLoading) {
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(244, 168, 159, 0.5)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isListening && !isLoading) {
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
      title={isLoading ? 'Loading...' : isListening ? 'Stop talking' : 'Start talking'}
    >
      {isLoading ? (
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      ) : isListening ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}

      {isListening && (
        <>
          <span
            className="absolute inset-0 rounded-full border-2 animate-pulse"
            style={{ borderColor: 'var(--color-primary-light)' }}
          />
          <span
            className="absolute inset-0 rounded-full border-2 animate-ping"
            style={{ borderColor: 'var(--color-primary-light)', opacity: 0.6 }}
          />
        </>
      )}
    </button>
  )
}
