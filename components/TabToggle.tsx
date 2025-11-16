'use client'

interface TabToggleProps {
  value: 'pillbox' | 'analysis'
  onChange: (value: 'pillbox' | 'analysis') => void
}

export function TabToggle({ value, onChange }: TabToggleProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div
        className="inline-flex items-center rounded-2xl p-1.5"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
      >
        <button
          onClick={() => onChange('pillbox')}
          className={`
            px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
            ${value === 'pillbox'
              ? 'shadow-md'
              : 'hover:opacity-80'
            }
          `}
          style={{
            backgroundColor: value === 'pillbox' ? 'var(--color-primary)' : 'transparent',
            color: value === 'pillbox' ? 'white' : 'var(--color-foreground-secondary)',
          }}
        >
          Pillbox
        </button>
        <button
          onClick={() => onChange('analysis')}
          className={`
            px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
            ${value === 'analysis'
              ? 'shadow-md'
              : 'hover:opacity-80'
            }
          `}
          style={{
            backgroundColor: value === 'analysis' ? 'var(--color-primary)' : 'transparent',
            color: value === 'analysis' ? 'white' : 'var(--color-foreground-secondary)',
          }}
        >
          Analyses
        </button>
      </div>
    </div>
  )
}
