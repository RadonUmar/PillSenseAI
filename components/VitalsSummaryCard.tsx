'use client'

interface VitalsData {
  respiratoryRate: number
  oxygenSaturation: number
  heartRate: number
  systolicBP: number
  diastolicBP: number
  oxygenTherapy: boolean
}

interface VitalsSummaryCardProps {
  vitals: VitalsData
}

export function VitalsSummaryCard({ vitals }: VitalsSummaryCardProps) {
  const getVitalStatus = (value: number, normal: [number, number]) => {
    if (value < normal[0]) return { color: 'rgb(59, 130, 246)', label: 'Low' }
    if (value > normal[1]) return { color: 'rgb(239, 68, 68)', label: 'High' }
    return { color: 'rgb(34, 197, 94)', label: 'Normal' }
  }

  const vitalsConfig = [
    {
      label: 'Respiratory Rate',
      value: vitals.respiratoryRate,
      unit: 'bpm',
      normal: [12, 20] as [number, number],
    },
    {
      label: 'O₂ Saturation',
      value: vitals.oxygenSaturation,
      unit: '%',
      normal: [95, 100] as [number, number],
    },
    {
      label: 'Heart Rate',
      value: vitals.heartRate,
      unit: 'bpm',
      normal: [60, 100] as [number, number],
    },
    {
      label: 'Blood Pressure',
      value: `${vitals.systolicBP}/${vitals.diastolicBP}`,
      unit: 'mmHg',
      normal: [0, 0] as [number, number],
      customStatus: vitals.systolicBP > 140 || vitals.diastolicBP > 90
        ? { color: 'rgb(239, 68, 68)', label: 'High' }
        : { color: 'rgb(34, 197, 94)', label: 'Normal' },
    },
  ]

  return (
    <div
      className="rounded-2xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
          Vitals Summary
        </h3>
        {vitals.oxygenTherapy && (
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: 'rgb(59, 130, 246)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            O₂ Therapy
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {vitalsConfig.map((vital, index) => {
          const status = vital.customStatus || getVitalStatus(typeof vital.value === 'number' ? vital.value : 0, vital.normal)

          return (
            <div key={index} className="space-y-1">
              <p className="text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
                {vital.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                  {vital.value}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                  {vital.unit}
                </span>
              </div>
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${status.color}20`,
                  color: status.color,
                }}
              >
                {status.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
