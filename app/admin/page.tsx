'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Medication {
  id: string
  name: string
  activeIngredient: string
  dosage: string
  frequency: string
  warnings: string
  ageRestriction: string
  notes: string
  nfcId?: string
}

export default function AdminPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    activeIngredient: '',
    dosage: '',
    frequency: '',
    warnings: '',
    ageRestriction: '',
    notes: '',
    nfcId: ''
  })

  useEffect(() => {
    fetchMedications()
  }, [])

  const fetchMedications = async () => {
    try {
      const response = await fetch('/api/medications')
      const data = await response.json()
      setMedications(data)
    } catch (error) {
      console.error('Error fetching medications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log('Submitting medication:', formData)
      const url = editingMedication
        ? `/api/medications/${editingMedication.id}`
        : '/api/medications'

      const method = editingMedication ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Response:', data)

      if (response.ok) {
        alert('Medication saved successfully!')
        await fetchMedications()
        resetForm()
      } else {
        alert(`Error: ${data.error || 'Failed to save medication'}`)
      }
    } catch (error) {
      console.error('Error saving medication:', error)
      alert('Failed to save medication. Check console for details.')
    }
  }

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication)
    setFormData({
      name: medication.name,
      activeIngredient: medication.activeIngredient,
      dosage: medication.dosage,
      frequency: medication.frequency,
      warnings: medication.warnings,
      ageRestriction: medication.ageRestriction,
      notes: medication.notes,
      nfcId: medication.nfcId || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) return

    try {
      await fetch(`/api/medications/${id}`, { method: 'DELETE' })
      await fetchMedications()
    } catch (error) {
      console.error('Error deleting medication:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      activeIngredient: '',
      dosage: '',
      frequency: '',
      warnings: '',
      ageRestriction: '',
      notes: '',
      nfcId: ''
    })
    setEditingMedication(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-40" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href="/pillbox" className="p-2 rounded-lg transition-colors" style={{ color: 'var(--color-foreground)' }}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                Admin Dashboard
              </h1>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            Manage medications in the system
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Add/Edit Form */}
        {showForm && (
          <div className="rounded-2xl p-6 mb-8 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
              {editingMedication ? 'Edit Medication' : 'Add New Medication'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Active Ingredient *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.activeIngredient}
                    onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Frequency *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Age Restriction *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ageRestriction}
                    onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                    NFC ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.nfcId}
                    onChange={(e) => setFormData({ ...formData, nfcId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)'
                    }}
                    placeholder="e.g., NFC-TYL-001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                  Warnings *
                </label>
                <textarea
                  required
                  value={formData.warnings}
                  onChange={(e) => setFormData({ ...formData, warnings: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)'
                  }}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground-secondary)' }}>
                  Notes *
                </label>
                <textarea
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)'
                  }}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  {editingMedication ? 'Update' : 'Create'}
                </Button>
                <Button type="button" onClick={resetForm} style={{ backgroundColor: 'var(--color-surface-tertiary)', color: 'var(--color-foreground)' }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Medications List */}
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
            All Medications
          </h2>

          {isLoading ? (
            <p style={{ color: 'var(--color-foreground-secondary)' }}>Loading...</p>
          ) : medications.length === 0 ? (
            <p style={{ color: 'var(--color-foreground-secondary)' }}>No medications found. Add your first medication above.</p>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-4 rounded-lg border flex items-start justify-between"
                  style={{ backgroundColor: 'var(--color-surface-secondary)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--color-foreground)' }}>
                      {medication.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                      {medication.activeIngredient} - {medication.dosage}
                    </p>
                    {medication.nfcId && (
                      <p className="text-xs mt-1" style={{ color: 'var(--color-accent)' }}>
                        NFC: {medication.nfcId}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(medication)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
