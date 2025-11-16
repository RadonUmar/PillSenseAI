'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { History } from 'lucide-react'
import { PillCard } from '@/components/PillCard'
import { MicButton } from '@/components/MicButton'
import { LogDoseModal } from '@/components/LogDoseModal'
import { TabToggle } from '@/components/TabToggle'
import { AnalysisPanel } from '@/components/AnalysisPanel'
import { useVapiAgent } from '@/hooks/useVapiAgent'
import { buildPillBoxContext, buildUpcomingDosesContext } from '@/lib/vapi-context'

interface Medication {
  id: string
  name: string
  activeIngredient: string
  dosage: string
  frequency: string
  warnings: string
  ageRestriction: string
  notes: string
  quantity: number
}

interface DoseLog {
  id: string
  takenAt: string
  medication: {
    id: string
    name: string
    dosage: string
  }
}

interface UpcomingDose {
  id: string
  scheduledFor: string
  foodInstruction: string
  medication: {
    id: string
    name: string
    dosage: string
  }
}

export default function PillBoxPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'pillbox' | 'analysis'>('pillbox')
  const [medications, setMedications] = useState<Medication[]>([])
  const [recentDoses, setRecentDoses] = useState<DoseLog[]>([])
  const [upcomingDoses, setUpcomingDoses] = useState<UpcomingDose[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medication | null>(null)

  useEffect(() => {
    fetchPillBoxMedications()
    fetchRecentDoses()
    fetchUpcomingDoses()
  }, [])

  const fetchPillBoxMedications = async () => {
    try {
      const response = await fetch('/api/pillbox')
      const data = await response.json()

      // Transform the data to match our interface
      const meds = data.medications?.map((m: any) => ({
        id: m.medication.id,
        name: m.medication.name,
        activeIngredient: m.medication.activeIngredient,
        dosage: m.medication.dosage,
        frequency: m.medication.frequency,
        warnings: m.medication.warnings,
        ageRestriction: m.medication.ageRestriction,
        notes: m.medication.notes,
        quantity: m.quantity
      })) || []

      setMedications(meds)
    } catch (error) {
      console.error('Error fetching pill box medications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecentDoses = async () => {
    try {
      const response = await fetch('/api/dose-logs')
      const data = await response.json()
      setRecentDoses(data.doseLogs || [])
    } catch (error) {
      console.error('Error fetching recent doses:', error)
    }
  }

  const fetchUpcomingDoses = async () => {
    try {
      const response = await fetch('/api/upcoming-doses')
      const data = await response.json()
      setUpcomingDoses(data.upcomingDoses || [])
    } catch (error) {
      console.error('Error fetching upcoming doses:', error)
    }
  }

  const handleLogDose = (medicine: Medication) => {
    setSelectedMedicine(medicine)
    setIsLogModalOpen(true)
  }

  const handleCloseLogModal = async () => {
    setIsLogModalOpen(false)
    setSelectedMedicine(null)
    // Refresh data after modal closes
    await fetchPillBoxMedications()
    await fetchRecentDoses()
    await fetchUpcomingDoses()
  }

  const getFoodInstructionLabel = (instruction: string) => {
    const labels: Record<string, string> = {
      'before_food': 'Before food',
      'after_food': 'After food',
      'with_food': 'With food',
      'any_time': 'Any time'
    }
    return labels[instruction] || instruction
  }

  // Build VAPI context from current page data
  const vapiContext = useMemo(() => {
    const pillBoxContext = buildPillBoxContext({
      medications,
      totalMedications: medications.length
    })
    const dosesContext = buildUpcomingDosesContext(upcomingDoses)
    return pillBoxContext + '\n\n' + dosesContext
  }, [medications, upcomingDoses])

  // Initialize VAPI voice agent
  const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''
  const { isActive, isRequestingPermission, toggleSession, error: vapiError } = useVapiAgent({
    context: vapiContext,
    publicKey: vapiPublicKey,
    onError: (error) => console.error('VAPI error:', error)
  })

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-40" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold" style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Your Pill Box
            </h1>
            <Link
              href="/history"
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <History className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            {activeTab === 'pillbox'
              ? 'Select a medication to view details or log a dose'
              : 'View your health insights and risk analysis'}
          </p>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <TabToggle value={activeTab} onChange={setActiveTab} />
      </div>

      {/* Pillbox Content */}
      {activeTab === 'pillbox' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Medicines Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-foreground-secondary)' }}>Loading medications...</p>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-foreground-secondary)' }}>No medications in your pill box yet.</p>
            <Link href="/admin" className="mt-4 inline-block" style={{ color: 'var(--color-accent)' }}>
              Add medications in admin dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {medications.map((medicine) => (
              <div key={medicine.id} className="relative">
                <PillCard
                  name={medicine.name}
                  dosage={medicine.dosage}
                  quantity={medicine.quantity}
                  isSelected={false}
                  onSelect={() => router.push(`/medicine/${encodeURIComponent(medicine.name.toLowerCase().replace(/\s+/g, '_'))}`)}
                  onLogDose={() => handleLogDose(medicine)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Voice Agent Section */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>Talk to your Pill Box</p>
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

        {/* Upcoming Doses Section */}
        {upcomingDoses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Upcoming Doses
            </h2>
            <div className="space-y-3">
              {upcomingDoses.slice(0, 5).map((dose) => {
                const scheduledDate = new Date(dose.scheduledFor)
                const isToday = scheduledDate.toDateString() === new Date().toDateString()
                const isTomorrow = scheduledDate.toDateString() === new Date(Date.now() + 86400000).toDateString()

                let dayLabel = scheduledDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
                if (isToday) dayLabel = 'Today'
                if (isTomorrow) dayLabel = 'Tomorrow'

                return (
                  <div
                    key={dose.id}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-primary)',
                      borderLeftWidth: '4px'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-lg" style={{ color: 'var(--color-foreground)' }}>
                          {dose.medication.name}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                          {dose.medication.dosage}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
                            🕐 {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                            🍽️ {getFoodInstructionLabel(dose.foodInstruction)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-sm font-medium px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: isToday ? 'rgba(244, 168, 159, 0.2)' : 'rgba(111, 168, 220, 0.2)',
                            color: isToday ? 'var(--color-primary)' : 'var(--color-accent)'
                          }}
                        >
                          {dayLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Doses Section */}
        {recentDoses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Recent Doses
            </h2>
            <div className="space-y-2">
              {recentDoses.slice(0, 5).map((dose) => (
                <div
                  key={dose.id}
                  className="p-4 rounded-lg border flex justify-between items-center"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                      {dose.medication.name}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                      {dose.medication.dosage}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                      {new Date(dose.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
                      {new Date(dose.takenAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      )}

      {/* Analysis Content */}
      {activeTab === 'analysis' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnalysisPanel />
        </div>
      )}

      {/* Modals */}
      {selectedMedicine && (
        <LogDoseModal
          isOpen={isLogModalOpen}
          onClose={handleCloseLogModal}
          medicine={selectedMedicine}
        />
      )}
    </div>
  )
}
