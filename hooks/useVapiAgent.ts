/**
 * useVapiAgent Hook
 *
 * A production-ready React hook for integrating VAPI voice agents
 * into the medication assistant application.
 *
 * Features:
 * - Low-latency bidirectional audio streaming
 * - Real-time transcript updates
 * - Context-aware responses (RAG-lite)
 * - Proper error handling and cleanup
 * - Microphone permission management
 */

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Vapi from '@vapi-ai/web'

interface UseVapiAgentProps {
  /** The context string to pass to the agent (medication data) */
  context: string
  /** Public key for VAPI (from env) */
  publicKey?: string
  /** Callback when agent starts speaking */
  onSpeechStart?: () => void
  /** Callback when agent stops speaking */
  onSpeechEnd?: () => void
  /** Callback for transcript updates */
  onTranscriptUpdate?: (transcript: { role: 'user' | 'assistant'; text: string }) => void
  /** Callback for errors */
  onError?: (error: Error) => void
}

interface VapiAgentState {
  /** Whether the agent is currently active/connected */
  isActive: boolean
  /** Whether the agent is speaking */
  isSpeaking: boolean
  /** Whether we're waiting for mic permissions */
  isRequestingPermission: boolean
  /** Current conversation transcript */
  transcript: Array<{ role: 'user' | 'assistant'; text: string; timestamp: Date }>
  /** Any error that occurred */
  error: Error | null
}

export function useVapiAgent({
  context,
  publicKey,
  onSpeechStart,
  onSpeechEnd,
  onTranscriptUpdate,
  onError,
}: UseVapiAgentProps) {
  // State management
  const [state, setState] = useState<VapiAgentState>({
    isActive: false,
    isSpeaking: false,
    isRequestingPermission: false,
    transcript: [],
    error: null,
  })

  // Refs for VAPI client and cleanup
  const vapiRef = useRef<Vapi | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  /**
   * Set up VAPI event listeners for real-time updates
   */
  const setupEventListeners = useCallback(
    (vapi: Vapi) => {
      // When call starts
      vapi.on('call-start', () => {
        console.log('[VAPI] Call started')
        setState((prev) => ({ ...prev, isActive: true, error: null }))
      })

      // When call ends
      vapi.on('call-end', () => {
        console.log('[VAPI] Call ended')
        setState((prev) => ({
          ...prev,
          isActive: false,
          isSpeaking: false,
        }))
      })

      // When agent starts speaking
      vapi.on('speech-start', () => {
        console.log('[VAPI] Agent started speaking')
        setState((prev) => ({ ...prev, isSpeaking: true }))
        onSpeechStart?.()
      })

      // When agent stops speaking
      vapi.on('speech-end', () => {
        console.log('[VAPI] Agent stopped speaking')
        setState((prev) => ({ ...prev, isSpeaking: false }))
        onSpeechEnd?.()
      })

      // Transcript updates (user speech recognized)
      vapi.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'partial') {
          // Partial transcript (in progress)
          console.log('[VAPI] Partial transcript:', message.transcript)
        } else if (message.type === 'transcript' && message.transcriptType === 'final') {
          // Final transcript
          const transcript = {
            role: message.role as 'user' | 'assistant',
            text: message.transcript,
            timestamp: new Date(),
          }

          setState((prev) => ({
            ...prev,
            transcript: [...prev.transcript, transcript],
          }))

          onTranscriptUpdate?.({
            role: transcript.role,
            text: transcript.text,
          })

          console.log('[VAPI] Final transcript:', transcript)
        }
      })

      // Error handling
      vapi.on('error', (error: any) => {
        try {
          console.error('[VAPI] Error:', error)
          // Better error handling for various error formats
          let errorMessage = 'VAPI error occurred'

          if (error && typeof error === 'object') {
            try {
              if (error.message) {
                errorMessage = error.message
              } else if (error.error) {
                errorMessage = String(error.error)
              } else if (Object.keys(error).length > 0) {
                errorMessage = JSON.stringify(error)
              }
            } catch (e) {
              errorMessage = 'VAPI error (unable to parse)'
            }
          } else if (error) {
            errorMessage = String(error)
          }

          const err = new Error(errorMessage)
          setState((prev) => ({ ...prev, error: err }))
          onError?.(err)
        } catch (handlerError) {
          console.error('[VAPI] Error in error handler:', handlerError)
          const err = new Error('VAPI error occurred')
          setState((prev) => ({ ...prev, error: err }))
          onError?.(err)
        }
      })
    },
    [onSpeechStart, onSpeechEnd, onTranscriptUpdate, onError]
  )

  /**
   * Initialize VAPI client
   * This creates a new instance with the public key from env
   */
  const initializeVapi = useCallback(() => {
    if (vapiRef.current) return vapiRef.current

    // Use provided key or fallback to env variable
    const key = publicKey || process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY

    if (!key) {
      const error = new Error(
        'VAPI public key not found. Please set NEXT_PUBLIC_VAPI_PUBLIC_KEY in your .env file'
      )
      setState((prev) => ({ ...prev, error }))
      onError?.(error)
      return null
    }

    try {
      const vapi = new Vapi(key)
      vapiRef.current = vapi

      // Set up event listeners
      setupEventListeners(vapi)

      return vapi
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to initialize VAPI')
      setState((prev) => ({ ...prev, error: err }))
      onError?.(err)
      return null
    }
  }, [publicKey, onError, setupEventListeners])

  /**
   * Start voice session
   * This initializes the VAPI client, requests microphone access,
   * and starts streaming with the provided context
   */
  const startSession = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isRequestingPermission: true, error: null }))

      // Initialize VAPI if needed
      const vapi = initializeVapi()
      if (!vapi) {
        setState((prev) => ({ ...prev, isRequestingPermission: false }))
        return
      }

      console.log('[VAPI] Starting session with context length:', context.length)

      // Get assistant ID from environment or use default
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

      // Start the call with either assistant ID or transient config
      if (assistantId) {
        // Use pre-configured assistant from VAPI dashboard
        await vapi.start(assistantId)
      } else {
        // Fallback to transient assistant (requires VAPI account setup)
        await vapi.start({
          transcriber: {
            provider: 'deepgram',
            model: 'nova-2',
            language: 'en-US',
          },
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: context,
              },
            ],
            temperature: 0.7,
          },
          voice: {
            provider: '11labs',
            voiceId: 'burt',
          },
          endCallFunctionEnabled: false,
        })
      }

      console.log('[VAPI] Session started successfully')
      setState((prev) => ({ ...prev, isRequestingPermission: false }))
    } catch (error) {
      console.error('[VAPI] Failed to start session:', error)

      // Better error message extraction
      let errorMessage = 'Failed to start voice session'
      if (error && typeof error === 'object') {
        if ((error as any).message) {
          errorMessage = (error as any).message
        } else {
          errorMessage = JSON.stringify(error)
        }
      } else if (error) {
        errorMessage = String(error)
      }

      const err = new Error(errorMessage)
      setState((prev) => ({
        ...prev,
        error: err,
        isRequestingPermission: false,
        isActive: false,
      }))
      onError?.(err)
    }
  }, [context, initializeVapi, onError])

  /**
   * Stop voice session
   * This ends the call and cleans up resources
   */
  const stopSession = useCallback(() => {
    if (vapiRef.current && state.isActive) {
      try {
        vapiRef.current.stop()
        console.log('[VAPI] Session stopped')
      } catch (error) {
        console.error('[VAPI] Error stopping session:', error)
      }
    }
  }, [state.isActive])

  /**
   * Toggle session on/off
   * Convenient for mic button click handlers
   */
  const toggleSession = useCallback(async () => {
    if (state.isActive) {
      stopSession()
    } else {
      await startSession()
    }
  }, [state.isActive, startSession, stopSession])

  /**
   * Clear transcript
   */
  const clearTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: [] }))
  }, [])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop()
        } catch (error) {
          console.error('[VAPI] Error during cleanup:', error)
        }
      }
    }
  }, [])

  return {
    // State
    ...state,

    // Actions
    startSession,
    stopSession,
    toggleSession,
    clearTranscript,
  }
}
