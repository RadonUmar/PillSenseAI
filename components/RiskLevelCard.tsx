'use client'

interface RiskLevelCardProps {
  level: 'Low' | 'Medium' | 'High'
  score?: number
}

export function RiskLevelCard({ level, score }: RiskLevelCardProps) {
  const colors = {
    Low: {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: 'rgb(34, 197, 94)',
    },
    Medium: {
      bg: 'rgba(251, 191, 36, 0.1)',
      border: 'rgba(251, 191, 36, 0.3)',
      text: 'rgb(251, 191, 36)',
    },
    High: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: 'rgb(239, 68, 68)',
    },
  }

  const config = colors[level]

  return (
    <div
      className="rounded-2xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
            Current Clinical Risk Level
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold" style={{ color: config.text }}>
              {level}
            </h2>
            {score !== undefined && (
              <span className="text-lg font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
                {score}%
              </span>
            )}
          </div>
        </div>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.bg, border: `2px solid ${config.border}` }}
        >
          <span className="text-2xl">
            {level === 'Low' && '✓'}
            {level === 'Medium' && '!'}
            {level === 'High' && '⚠'}
          </span>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--color-foreground-secondary)' }}>
        Based on vitals, medication adherence, and health markers
      </p>
    </div>
  )
}
