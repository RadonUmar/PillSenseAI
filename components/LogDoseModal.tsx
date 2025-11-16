'use client'

import { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LogDoseModalProps {
  isOpen: boolean
  onClose: () => void
  medicine: {
    id: string
    name: string
    dosage: string
  }
}

export function LogDoseModal({ isOpen, onClose, medicine }: LogDoseModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timestamp, setTimestamp] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  )

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      console.log('Logging dose for medication:', medicine.id)
      const response = await fetch('/api/dose-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicationId: medicine.id,
          takenAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Failed to log dose:', error)
        throw new Error(error.details || 'Failed to log dose')
      }

      const result = await response.json()
      console.log('Dose logged successfully:', result)

      setIsConfirmed(true)
      setTimeout(() => {
        setIsConfirmed(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error logging dose:', error)
      alert('Failed to log dose. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900/95 to-black/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {!isConfirmed ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                Confirm Dose
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Taking</p>
                <p className="text-2xl font-bold text-white">{medicine.name}</p>
                <p className="text-sm text-purple-400 mt-1">{medicine.dosage}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Logging...' : 'Confirm'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Logged!</h2>
            <p className="text-gray-400">
              {medicine.name} logged at {timestamp}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
