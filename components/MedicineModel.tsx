'use client'

import { useEffect, useRef } from 'react'

interface MedicineModelProps {
  medicineName: string
}

export function MedicineModel({ medicineName }: MedicineModelProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Gentle floating animation with subtle 3D tilt
    const animate = () => {
      if (containerRef.current) {
        const time = Date.now() / 1000
        const floatY = Math.sin(time * 0.5) * 10 // Gentle up/down float
        const tiltX = Math.sin(time * 0.3) * 5 // Subtle tilt
        const tiltY = Math.cos(time * 0.4) * 3 // Very subtle rotate
        containerRef.current.style.transform = `translateY(${floatY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="flex justify-center mb-8">
      <div className="perspective">
        <div
          ref={containerRef}
          className="w-48 h-80 rounded-3xl backdrop-blur-xl flex items-center justify-center transition-transform duration-300 shadow-2xl border"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(30, 30, 50, 0.9), rgba(20, 20, 35, 0.95))',
            borderColor: 'rgba(111, 168, 220, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(111, 168, 220, 0.2), inset 0 0 60px rgba(111, 168, 220, 0.05)',
          }}
        >
          <div className="text-center">
            <div className="text-6xl font-bold mb-2 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(111, 168, 220, 0.5))' }}>
              💊
            </div>
            <p className="font-semibold text-sm" style={{ color: '#e0e0e0' }}>{medicineName}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(111, 168, 220, 0.7)' }}>Bottle Model</p>
          </div>
        </div>
      </div>
    </div>
  )
}
