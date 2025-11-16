'use client'

import Link from 'next/link'
import { Pill, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-background)] via-[var(--color-surface)]/80 to-[var(--color-background)] text-[var(--color-foreground)] flex flex-col items-center justify-center px-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8">
          <div className="inline-block p-4 bg-[var(--color-primary)]/10 border border-[var(--color-border)] rounded-2xl backdrop-blur-sm mb-4">
            <Pill className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent mb-2">
            PillSense
          </h1>
          <h2 className="text-xl text-[var(--color-foreground-secondary)] mb-4">Agents</h2>
          <p className="text-[var(--color-foreground-secondary)] leading-relaxed">
            Your intelligent medication management system. Scan NFC tags to access detailed medicine information and manage your doses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <Link href="/pillbox" className="block">
            <Button className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:from-[var(--color-primary-light)] hover:to-[var(--color-accent-light)] text-white text-lg py-6">
              Open Pill Box
            </Button>
          </Link>
          <Link href="/history" className="block">
            <Button
              variant="outline"
              className="w-full border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]/50 text-[var(--color-foreground)] text-lg py-6"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </Link>
        </div>

        {/* Feature list */}
        <div className="mt-12 space-y-2 text-left">
          <p className="text-sm text-[var(--color-foreground-secondary)]">Features:</p>
          <ul className="space-y-2 text-sm text-[var(--color-foreground-secondary)]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              NFC-based medicine identification
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              AI voice agent assistance
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              Dose tracking and history
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
