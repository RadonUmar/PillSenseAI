'use client'

import { useState } from 'react'
import { Pill, Plus } from 'lucide-react'

interface PillCardProps {
  name: string
  dosage: string
  quantity?: number
  isSelected?: boolean
  onSelect?: () => void
  onLogDose?: () => void
}

export function PillCard({
  name,
  dosage,
  quantity,
  isSelected = false,
  onSelect,
  onLogDose,
}: PillCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleLogClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent any default action
    e.stopPropagation() // Stop event from bubbling up to Link
    onLogDose?.()
  }

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full p-6 rounded-2xl backdrop-blur-md transition-all duration-300 border text-left cursor-pointer"
      style={{
        backgroundColor: isSelected ? 'rgba(244, 168, 159, 0.15)' : 'var(--color-surface)',
        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
        boxShadow: isSelected ? '0 4px 20px rgba(244, 168, 159, 0.3)' : 'none',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl flex-shrink-0"
          style={{
            backgroundColor: isSelected ? 'rgba(244, 168, 159, 0.3)' : 'rgba(111, 168, 220, 0.2)',
          }}
        >
          <Pill
            className="w-6 h-6"
            style={{
              color: isSelected ? 'var(--color-primary)' : 'var(--color-accent)'
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate" style={{ color: 'var(--color-foreground)' }}>
            {name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            {dosage}
          </p>
          {quantity !== undefined && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-foreground-secondary)', opacity: 0.7 }}>
              Qty: {quantity}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick Log Button */}
          <button
            onClick={handleLogClick}
            className="p-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
            title="Log dose"
          >
            <Plus className="w-4 h-4" />
          </button>
          {isSelected && (
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
