/**
 * VAPI Context Builder
 *
 * This module converts page-specific medication data into a structured context
 * that VAPI agents can use to answer questions. The agent is instructed to ONLY
 * use this data and not hallucinate beyond what's provided.
 */

interface Medication {
  id: string
  name: string
  activeIngredient: string
  dosage: string
  frequency: string
  warnings: string
  ageRestriction: string
  notes: string
  quantity?: number
}

interface PillBoxContext {
  medications: Medication[]
  totalMedications: number
}

/**
 * Build context for a single medication page
 * This context is passed to VAPI to ensure the agent only discusses this specific pill
 */
export function buildMedicationContext(medication: Medication): string {
  return `You are a helpful medication assistant. You can ONLY answer questions about the following medication. Do not provide medical advice beyond what is stated here.

MEDICATION INFORMATION:
- Name: ${medication.name}
- Active Ingredient: ${medication.activeIngredient}
- Dosage: ${medication.dosage}
- Frequency: ${medication.frequency}
- Warnings: ${medication.warnings}
- Age Restriction: ${medication.ageRestriction}
- Additional Notes: ${medication.notes}
${medication.quantity ? `- Current Quantity in Pill Box: ${medication.quantity}` : ''}

INSTRUCTIONS:
- Answer questions about this medication's name, ingredients, dosage, frequency, warnings, age restrictions, and notes
- If asked about other medications or medical conditions not mentioned here, respond: "I can only answer based on the medication information available on this page."
- Be concise and helpful
- Never provide medical advice beyond what is stated in this data
- If the user needs medical advice, recommend they consult with a healthcare professional`
}

/**
 * Build context for the pill box page
 * This context includes all medications in the user's pill box
 */
export function buildPillBoxContext(pillBoxData: PillBoxContext): string {
  const medicationsList = pillBoxData.medications
    .map((med, index) => `
${index + 1}. ${med.name}
   - Active Ingredient: ${med.activeIngredient}
   - Dosage: ${med.dosage}
   - Frequency: ${med.frequency}
   - Warnings: ${med.warnings}
   - Age Restriction: ${med.ageRestriction}
   - Notes: ${med.notes}
   - Quantity: ${med.quantity || 'Not specified'}`)
    .join('\n')

  return `You are a helpful medication assistant for a pill box. You can ONLY answer questions about the medications listed below. Do not provide medical advice beyond what is stated here.

PILL BOX INFORMATION:
Total Medications: ${pillBoxData.totalMedications}

MEDICATIONS IN PILL BOX:
${medicationsList}

INSTRUCTIONS:
- Answer questions about any of the medications listed above
- Help the user understand their medications, dosages, warnings, and schedules
- If asked about medications not in this list, respond: "I can only answer based on the medication information available in your pill box."
- If asked about drug interactions, only mention if they're stated in the warnings
- Be concise and helpful
- Never provide medical advice beyond what is stated in this data
- If the user needs medical advice or has concerns about interactions, recommend they consult with a healthcare professional or pharmacist`
}

/**
 * Build context for upcoming doses
 * Useful if the user asks about their schedule
 */
export function buildUpcomingDosesContext(upcomingDoses: any[]): string {
  if (upcomingDoses.length === 0) {
    return 'No upcoming doses scheduled.'
  }

  const dosesList = upcomingDoses
    .map((dose, index) => {
      const scheduledDate = new Date(dose.scheduledFor)
      const isToday = scheduledDate.toDateString() === new Date().toDateString()
      const dayLabel = isToday ? 'Today' : scheduledDate.toLocaleDateString()

      return `${index + 1}. ${dose.medication.name} (${dose.medication.dosage})
   - When: ${dayLabel} at ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
   - Food Instruction: ${dose.foodInstruction.replace('_', ' ')}`
    })
    .join('\n')

  return `\n\nUPCOMING DOSES:
${dosesList}`
}
