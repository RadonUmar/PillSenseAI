'use client'

interface Warning {
  type: 'interaction' | 'allergy' | 'contraindication' | 'side_effect'
  severity: 'low' | 'moderate' | 'high'
  message: string
  medications: string[]
}

interface MedicationWarningsCardProps {
  warnings: Warning[]
}

export function MedicationWarningsCard({ warnings }: MedicationWarningsCardProps) {
  const severityConfig = {
    low: {
      icon: 'ℹ️',
      color: 'rgb(59, 130, 246)',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    moderate: {
      icon: '⚠️',
      color: 'rgb(251, 191, 36)',
      bg: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    high: {
      icon: '🚫',
      color: 'rgb(239, 68, 68)',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
  }

  const typeLabels = {
    interaction: 'Drug Interaction',
    allergy: 'Allergy Risk',
    contraindication: 'Contraindication',
    side_effect: 'Side Effect Alert',
  }

  return (
    <div
      className="rounded-2xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
        Medication Safety Warnings
      </h3>

      {warnings.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            No active warnings. Your medication regimen appears safe.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((warning, index) => {
            const config = severityConfig[warning.severity]

            return (
              <div
                key={index}
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: config.bg,
                  borderColor: config.border,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{config.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-semibold uppercase"
                        style={{ color: config.color }}
                      >
                        {typeLabels[warning.type]}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: config.bg,
                          color: config.color,
                          border: `1px solid ${config.border}`,
                        }}
                      >
                        {warning.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-foreground)' }}>
                      {warning.message}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {warning.medications.map((med, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: 'var(--color-surface-secondary)',
                            color: 'var(--color-foreground-secondary)',
                          }}
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
