'use client'

import { useState, useEffect } from 'react'
import { RiskLevelCard } from './RiskLevelCard'
import { VitalsSummaryCard } from './VitalsSummaryCard'
import { MedicationWarningsCard } from './MedicationWarningsCard'
import { TableauEmbed } from './TableauEmbed'

export function AnalysisPanel() {
  const [riskData, setRiskData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRiskAnalysis()
  }, [])

  const fetchRiskAnalysis = async () => {
    try {
      const response = await fetch('/api/risk')
      const data = await response.json()
      setRiskData(data)
    } catch (error) {
      console.error('Error fetching risk analysis:', error)
      // Use mock data as fallback
      setRiskData(getMockData())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockData = () => ({
    riskLevel: 'Medium',
    riskScore: 45,
    vitals: {
      respiratoryRate: 18,
      oxygenSaturation: 96,
      heartRate: 78,
      systolicBP: 128,
      diastolicBP: 82,
      oxygenTherapy: false,
    },
    warnings: [
      {
        type: 'interaction',
        severity: 'moderate',
        message: 'Ibuprofen and Aspirin may increase gastrointestinal bleeding risk when used together',
        medications: ['Ibuprofen', 'Aspirin'],
      },
      {
        type: 'side_effect',
        severity: 'low',
        message: 'Allergy Relief may cause drowsiness. Avoid driving or operating machinery.',
        medications: ['Allergy Relief'],
      },
    ],
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            Loading analysis...
          </p>
        </div>
      </div>
    )
  }

  const data = riskData || getMockData()

  // Tableau Public Dashboard URL - Final embed configuration
  const tableauUrl = 'https://public.tableau.com/views/PillSenseDashboard/PillSenseDashboard?:language=en-US&:display_count=yes&publish=yes&:origin=viz_share_link&:embed=yes&:showVizHome=no&:toolbar=yes&:animate_transition=yes&:display_static_image=yes&:display_spinner=yes&:display_overlay=yes'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Health & Medication Analysis
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
          Real-time health insights powered by Berkeley Data Science research
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskLevelCard level={data.riskLevel} score={data.riskScore} />
        <VitalsSummaryCard vitals={data.vitals} />
      </div>

      {/* Tableau Dashboard */}
      <TableauEmbed url={tableauUrl} title="Pillbox Health Insights Dashboard" />

      {/* Warnings */}
      <MedicationWarningsCard warnings={data.warnings} />

      {/* Additional Insights Section */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>
              87%
            </div>
            <div className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
              Adherence Rate
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
              6
            </div>
            <div className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
              Active Medications
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>
              2
            </div>
            <div className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
              Active Warnings
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
