'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { doseHistory } from '@/lib/dummyData'

export default function HistoryPage() {
  // Sort history by timestamp, newest first
  const sortedHistory = [...doseHistory].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

  // Group by date
  const groupedByDate = sortedHistory.reduce(
    (acc, item) => {
      const date = item.timestamp.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    },
    {} as Record<string, typeof doseHistory>
  )

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#fafaf8', color: '#3d3d3d' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ borderColor: '#e0d4cf', backgroundColor: '#f3eeea' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/pillbox"
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Dose History</h1>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date} className="mb-8">
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold">{date}</h2>
              <div className="flex-1 h-px" style={{ backgroundImage: 'linear-gradient(to right, #e0d4cf, transparent)' }} />
            </div>

            {/* Timeline Items */}
            <div className="space-y-3 relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-6 bottom-0 w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(249, 127, 130, 0.5), transparent)' }} />

              {items.map((item, idx) => (
                <div key={item.id} className="flex gap-4 relative">
                  {/* Timeline dot */}
                  <div className="pt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f97f82', boxShadow: '0 0 0 4px rgba(249, 127, 130, 0.2)' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4 pt-1">
                    <div className="border rounded-xl p-4 transition-colors hover:opacity-90" style={{ backgroundColor: '#f3eeea', borderColor: '#e0d4cf' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {item.medicine}
                          </p>
                          <p className="text-sm mt-1" style={{ color: '#f97f82' }}>
                            {item.dosage}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium" style={{ color: '#6b6b6b' }}>
                            {item.time}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#6b6b6b' }}>
                            {item.timestamp.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
