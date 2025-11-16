import { NextResponse } from 'next/server'
import { loadHealthRiskDataset, generateMockHealthData } from '@/lib/csv-loader'
import { predictRiskLevel } from '@/lib/risk-prediction'

export async function GET() {
  try {
    // Try to load real dataset, fall back to mock data
    let dataset = await loadHealthRiskDataset()

    if (dataset.length === 0) {
      console.log('Using mock health data')
      dataset = generateMockHealthData()
    }

    // For demo purposes, use the most recent record or generate sample vitals
    const sampleVitals = dataset.length > 0
      ? dataset[0]
      : {
          respiratoryRate: 18,
          oxygenSaturation: 96,
          heartRate: 78,
          systolicBP: 128,
          diastolicBP: 82,
          oxygenTherapy: false,
        }

    // Run risk prediction
    const prediction = predictRiskLevel(sampleVitals)

    // Mock medication warnings based on user's pillbox
    const warnings = [
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
    ]

    // Return analysis results
    return NextResponse.json({
      riskLevel: prediction.riskLevel,
      riskScore: prediction.riskScore,
      factors: prediction.factors,
      vitals: {
        respiratoryRate: sampleVitals.respiratoryRate,
        oxygenSaturation: sampleVitals.oxygenSaturation,
        heartRate: sampleVitals.heartRate,
        systolicBP: sampleVitals.systolicBP,
        diastolicBP: sampleVitals.diastolicBP,
        oxygenTherapy: sampleVitals.oxygenTherapy,
      },
      warnings,
      metadata: {
        modelVersion: 'decision-tree-v1',
        datasetSize: dataset.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error in risk API:', error)
    return NextResponse.json(
      {
        error: 'Failed to calculate risk analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
