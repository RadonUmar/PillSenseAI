import fs from 'fs'
import path from 'path'

export interface HealthRiskRecord {
  respiratoryRate: number
  oxygenSaturation: number
  heartRate: number
  systolicBP: number
  diastolicBP: number
  oxygenTherapy: boolean
  riskLevel: 'Low' | 'Medium' | 'High'
}

/**
 * Load and parse the Health_Risk dataset CSV
 * Place your Health_Risk_dataset.csv in /data/ directory
 */
export async function loadHealthRiskDataset(): Promise<HealthRiskRecord[]> {
  const filePath = path.join(process.cwd(), 'data', 'Health_Risk_dataset.csv')

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const lines = fileContent.split('\n').filter(line => line.trim())

    // Skip header row
    const dataLines = lines.slice(1)

    const records: HealthRiskRecord[] = dataLines.map(line => {
      const values = line.split(',')

      return {
        respiratoryRate: parseFloat(values[0]) || 0,
        oxygenSaturation: parseFloat(values[1]) || 0,
        heartRate: parseFloat(values[2]) || 0,
        systolicBP: parseFloat(values[3]) || 0,
        diastolicBP: parseFloat(values[4]) || 0,
        oxygenTherapy: values[5]?.trim().toLowerCase() === 'true' || values[5]?.trim() === '1',
        riskLevel: (values[6]?.trim() as 'Low' | 'Medium' | 'High') || 'Low',
      }
    })

    return records
  } catch (error) {
    console.error('Error loading Health Risk dataset:', error)
    return []
  }
}

/**
 * Simple mock data generator if CSV is not available
 */
export function generateMockHealthData(): HealthRiskRecord[] {
  const mockData: HealthRiskRecord[] = []

  for (let i = 0; i < 100; i++) {
    const riskLevel: 'Low' | 'Medium' | 'High' =
      i < 60 ? 'Low' : i < 85 ? 'Medium' : 'High'

    mockData.push({
      respiratoryRate: 12 + Math.random() * 15,
      oxygenSaturation: 92 + Math.random() * 8,
      heartRate: 60 + Math.random() * 40,
      systolicBP: 110 + Math.random() * 40,
      diastolicBP: 70 + Math.random() * 25,
      oxygenTherapy: Math.random() > 0.8,
      riskLevel,
    })
  }

  return mockData
}
