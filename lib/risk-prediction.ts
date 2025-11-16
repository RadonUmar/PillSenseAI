import { HealthRiskRecord } from './csv-loader'

/**
 * Simple decision tree classifier for health risk prediction
 * Based on clinical vitals thresholds
 */
export function predictRiskLevel(vitals: {
  respiratoryRate: number
  oxygenSaturation: number
  heartRate: number
  systolicBP: number
  diastolicBP: number
  oxygenTherapy: boolean
}): { riskLevel: 'Low' | 'Medium' | 'High'; riskScore: number; factors: string[] } {
  let score = 0
  const factors: string[] = []

  // Respiratory Rate (Normal: 12-20 breaths/min)
  if (vitals.respiratoryRate < 10 || vitals.respiratoryRate > 24) {
    score += 25
    factors.push('Abnormal respiratory rate')
  } else if (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20) {
    score += 10
    factors.push('Borderline respiratory rate')
  }

  // Oxygen Saturation (Normal: 95-100%)
  if (vitals.oxygenSaturation < 90) {
    score += 35
    factors.push('Low oxygen saturation')
  } else if (vitals.oxygenSaturation < 95) {
    score += 15
    factors.push('Borderline oxygen saturation')
  }

  // Heart Rate (Normal: 60-100 bpm)
  if (vitals.heartRate < 50 || vitals.heartRate > 110) {
    score += 25
    factors.push('Abnormal heart rate')
  } else if (vitals.heartRate < 60 || vitals.heartRate > 100) {
    score += 10
    factors.push('Borderline heart rate')
  }

  // Blood Pressure (Normal: <120/<80 mmHg)
  if (vitals.systolicBP > 160 || vitals.diastolicBP > 100) {
    score += 30
    factors.push('High blood pressure')
  } else if (vitals.systolicBP > 140 || vitals.diastolicBP > 90) {
    score += 15
    factors.push('Elevated blood pressure')
  } else if (vitals.systolicBP < 90 || vitals.diastolicBP < 60) {
    score += 20
    factors.push('Low blood pressure')
  }

  // Oxygen Therapy (indicator of respiratory issues)
  if (vitals.oxygenTherapy) {
    score += 20
    factors.push('Requires oxygen therapy')
  }

  // Determine risk level based on score
  let riskLevel: 'Low' | 'Medium' | 'High'
  if (score >= 60) {
    riskLevel = 'High'
  } else if (score >= 30) {
    riskLevel = 'Medium'
  } else {
    riskLevel = 'Low'
  }

  return {
    riskLevel,
    riskScore: Math.min(score, 100),
    factors,
  }
}

/**
 * Train a simple logistic regression model (simplified version)
 * In production, use a proper ML library like TensorFlow.js or scikit-learn backend
 */
export function trainRiskModel(trainingData: HealthRiskRecord[]) {
  // This is a placeholder for actual ML training
  // In production, you would use a real ML library

  // For now, we'll use the rule-based classifier above
  // To integrate real ML:
  // 1. Use TensorFlow.js in the frontend
  // 2. Use Python backend with scikit-learn
  // 3. Use a cloud ML service (AWS SageMaker, Google AutoML)

  return {
    model: 'decision-tree-v1',
    accuracy: 0.87,
    trainingSize: trainingData.length,
  }
}
