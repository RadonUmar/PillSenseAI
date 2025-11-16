'use client'

import { useState, use, useEffect, useMemo } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { MedicineModel } from '@/components/MedicineModel'
import { InfoTable } from '@/components/InfoTable'
import { MicButton } from '@/components/MicButton'
import { Button } from '@/components/ui/button'
import { useVapiAgent } from '@/hooks/useVapiAgent'
import { buildMedicationContext } from '@/lib/vapi-context'

interface Medication {
  id: string
  name: string
  activeIngredient: string
  dosage: string
  frequency: string
  warnings: string
  ageRestriction: string
  notes: string
}

export default function MedicineAgentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = use(params)
  const [medicine, setMedicine] = useState<Medication | null>(null)
  const [isLoadingMedicine, setIsLoadingMedicine] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isInPillBox, setIsInPillBox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(0)

  useEffect(() => {
    fetchMedication()
  }, [name])

  useEffect(() => {
    if (medicine) {
      checkPillBoxStatus()
    }
  }, [medicine])

  const fetchMedication = async () => {
    try {
      // Decode the URL parameter and convert back to normal name
      const decodedName = decodeURIComponent(name).replace(/_/g, ' ')

      // Fetch all medications and find by name (case-insensitive)
      const response = await fetch('/api/medications')
      if (response.ok) {
        const medications = await response.json()

        // API returns an array directly
        const found = medications.find(
          (m: Medication) => m.name.toLowerCase() === decodedName.toLowerCase()
        )
        setMedicine(found || null)
      }
    } catch (error) {
      console.error('Error fetching medication:', error)
    } finally {
      setIsLoadingMedicine(false)
    }
  }


  const checkPillBoxStatus = async () => {
    if (!medicine) return

    try {
      const response = await fetch('/api/pillbox')
      const data = await response.json()

      const medicationInBox = data.medications?.find(
        (m: any) => m.medicationId === medicine.id
      )

      if (medicationInBox) {
        setIsInPillBox(true)
        setCurrentQuantity(medicationInBox.quantity)
        setQuantity(medicationInBox.quantity)
      }
    } catch (error) {
      console.error('Error checking pill box status:', error)
    }
  }

  const handleAddToPillBox = async () => {
    if (!medicine) return

    setIsLoading(true)
    try {
      console.log('Adding to pill box:', { medicationId: medicine.id, quantity })
      const response = await fetch('/api/pillbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicationId: medicine.id,
          quantity: quantity
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to add to pill box')
      }

      const result = await response.json()
      console.log('Added to pill box:', result)

      setIsInPillBox(true)
      setCurrentQuantity(quantity)
      alert(`Successfully ${isInPillBox ? 'updated' : 'added to'} pill box!`)
    } catch (error) {
      console.error('Error adding to pill box:', error)
      alert('Failed to add to pill box. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Build VAPI context for this specific medication
  const vapiContext = useMemo(() => {
    if (!medicine) return ''
    return buildMedicationContext(medicine)
  }, [medicine])

  // Initialize VAPI voice agent
  const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''
  const { isActive, isRequestingPermission, toggleSession, error: vapiError } = useVapiAgent({
    context: vapiContext,
    publicKey: vapiPublicKey,
    onError: (error) => console.error('VAPI error:', error)
  })

  if (isLoadingMedicine) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <p style={{ color: 'var(--color-foreground-secondary)' }}>Loading...</p>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Medicine not found</p>
          <Link href="/pillbox" className="mt-4 inline-block hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
            Back to Pill Box
          </Link>
        </div>
      </div>
    )
  }

  const infoData = [
    { label: 'Active Ingredient', value: medicine.activeIngredient },
    { label: 'Dosage', value: medicine.dosage },
    { label: 'Frequency', value: medicine.frequency },
    { label: 'Warnings', value: medicine.warnings },
    { label: 'Age Restriction', value: medicine.ageRestriction },
    { label: 'Notes', value: medicine.notes },
  ]

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/pillbox"
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-foreground)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{medicine.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 3D Model */}
        <MedicineModel medicineName={medicine.name} />

        {/* Voice Agent Section */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>Ask your medicine anything</p>
          <div className="flex justify-center">
            <MicButton
              onClick={toggleSession}
              isListening={isActive}
              isLoading={isRequestingPermission}
            />
          </div>
          {vapiError && (
            <p className="text-sm text-red-500 mt-2">Voice agent error: {vapiError}</p>
          )}
        </div>

        {/* Add to Pill Box Section */}
        <div className="rounded-2xl p-6 mb-8 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
            {isInPillBox ? 'Update Quantity' : 'Add to Pill Box'}
          </h2>

          {isInPillBox && (
            <p className="text-sm mb-4" style={{ color: 'var(--color-foreground-secondary)' }}>
              Current quantity: <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{currentQuantity}</span>
            </p>
          )}

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground-secondary)' }}>
                Quantity
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)'
                }}
              />
            </div>
            <div className="pt-6">
              <Button
                onClick={handleAddToPillBox}
                disabled={isLoading || quantity <= 0}
                className="flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  opacity: (isLoading || quantity <= 0) ? 0.5 : 1
                }}
              >
                <Plus className="w-4 h-4" />
                {isLoading ? 'Saving...' : (isInPillBox ? 'Update' : 'Add to Pill Box')}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
            Medication Details
          </h2>
          <InfoTable data={infoData} />
        </div>
      </div>
    </div>
  )
}
