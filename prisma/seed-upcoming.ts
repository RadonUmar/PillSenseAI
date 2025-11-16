import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding upcoming doses...')

  // Get all medications
  const medications = await prisma.medication.findMany()

  if (medications.length === 0) {
    console.log('No medications found. Please run the main seed first.')
    return
  }

  // Clear existing upcoming doses
  await prisma.upcomingDose.deleteMany()

  const now = new Date()

  // Create upcoming doses for the next few days
  const upcomingDoses = [
    // Today
    {
      medicationId: medications[0].id, // Tylenol
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0), // 2:00 PM today
      foodInstruction: 'after_food',
    },
    {
      medicationId: medications[1].id, // Allegra
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0), // 8:00 PM today
      foodInstruction: 'before_food',
    },
    // Tomorrow
    {
      medicationId: medications[2].id, // Advil
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0), // 8:00 AM tomorrow
      foodInstruction: 'with_food',
    },
    {
      medicationId: medications[0].id, // Tylenol
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0), // 2:00 PM tomorrow
      foodInstruction: 'after_food',
    },
    {
      medicationId: medications[4].id, // Zyrtec
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 21, 0), // 9:00 PM tomorrow
      foodInstruction: 'any_time',
    },
    // Day after tomorrow
    {
      medicationId: medications[1].id, // Allegra
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 0), // 9:00 AM
      foodInstruction: 'before_food',
    },
    {
      medicationId: medications[3].id, // Aspirin
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0), // 7:00 PM
      foodInstruction: 'with_food',
    },
    // 3 days from now
    {
      medicationId: medications[2].id, // Advil
      scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 30), // 10:30 AM
      foodInstruction: 'with_food',
    },
  ]

  for (const dose of upcomingDoses) {
    await prisma.upcomingDose.create({
      data: dose,
    })
  }

  console.log(`✅ Created ${upcomingDoses.length} upcoming doses`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
