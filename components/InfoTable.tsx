'use client'

interface InfoField {
  label: string
  value: string
}

interface InfoTableProps {
  data: InfoField[]
}

export function InfoTable({ data }: InfoTableProps) {
  return (
    <div className="space-y-3">
      {data.map((field) => (
        <div
          key={field.label}
          className="flex items-start justify-between p-4 rounded-xl backdrop-blur-sm border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
            {field.label}
          </span>
          <span className="text-sm font-semibold text-right max-w-xs" style={{ color: 'var(--color-foreground)' }}>
            {field.value}
          </span>
        </div>
      ))}
    </div>
  )
}
