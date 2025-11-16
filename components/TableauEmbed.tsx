'use client'

import { useState } from 'react'

interface TableauEmbedProps {
  url: string
  title?: string
}

export function TableauEmbed({ url, title = 'Health Insights Dashboard' }: TableauEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {title && (
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {title}
          </h3>
        </div>
      )}

      <div className="relative" style={{ minHeight: '800px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-sm font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
                Loading dashboard...
              </p>
            </div>
          </div>
        )}

        <iframe
          src={url}
          width="100%"
          height="800"
          frameBorder="0"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          className="w-full"
          style={{
            display: isLoading ? 'none' : 'block',
          }}
        />
      </div>

      <div
        className="px-6 py-3 border-t text-xs"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-foreground-secondary)',
        }}
      >
        <p>
          Powered by Tableau • Click and drag to explore • Hover for details
        </p>
      </div>
    </div>
  )
}
