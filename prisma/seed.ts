import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.doseLog.deleteMany()
  await prisma.pillBoxMedication.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.pillBox.deleteMany()

  // Create medications
  const medications = await Promise.all([
    prisma.medication.create({
      data: {
        name: 'Tylenol',
        activeIngredient: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'Every 4-6 hours as needed',
        warnings: 'Do not exceed 3000mg per day. May cause liver damage if taken in excess.',
        ageRestriction: '12+',
        notes: 'Take with food if stomach upset occurs. Do not combine with alcohol.',
        nfcId: 'NFC-TYLENOL-001',
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Allegra',
        activeIngredient: 'Fexofenadine',
        dosage: '180mg',
        frequency: 'Once daily',
        warnings: 'May cause drowsiness. Do not take with fruit juices.',
        ageRestriction: '12+',
        notes: 'Take on an empty stomach. Wait 2 hours after eating before taking.',
        nfcId: 'NFC-ALLEGRA-001',
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Advil',
        activeIngredient: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'Every 4-6 hours as needed',
        warnings: 'May cause stomach irritation. Do not use if you have a history of stomach ulcers.',
        ageRestriction: '12+',
        notes: 'Take with food or milk to reduce stomach upset. Do not exceed 1200mg in 24 hours.',
        nfcId: 'NFC-ADVIL-001',
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Zyrtec',
        activeIngredient: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily',
        warnings: 'May cause drowsiness. Avoid driving or operating machinery.',
        ageRestriction: '6+',
        notes: 'Can be taken with or without food. Effects last 24 hours.',
        nfcId: 'NFC-ZYRTEC-001',
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Aspirin',
        activeIngredient: 'Acetylsalicylic acid',
        dosage: '325mg',
        frequency: 'Every 4-6 hours as needed',
        warnings: 'Not for children under 16. May increase bleeding risk.',
        ageRestriction: '16+',
        notes: 'Take with food. Do not use with other pain relievers. Consult doctor if on blood thinners.',
        nfcId: 'NFC-ASPIRIN-001',
      },
    }),
  ])

  console.log(`✅ Created ${medications.length} medications`)

  // Create a pill box
  const pillBox = await prisma.pillBox.create({
    data: {
      name: 'My Pill Box',
      nfcId: 'NFC-PILLBOX-001',
    },
  })

  console.log('✅ Created pill box')

  // Add some medications to the pill box
  await Promise.all([
    prisma.pillBoxMedication.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId: medications[0].id, // Tylenol
        quantity: 24,
      },
    }),
    prisma.pillBoxMedication.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId: medications[1].id, // Allegra
        quantity: 30,
      },
    }),
    prisma.pillBoxMedication.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId: medications[2].id, // Advil
        quantity: 20,
      },
    }),
  ])

  console.log('✅ Added medications to pill box')

  // Add some dose logs
  const now = new Date()
  await Promise.all([
    prisma.doseLog.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId: medications[0].id, // Tylenol
        takenAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    }),
    prisma.doseLog.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId: medications[1].id, // Allegra
        takenAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
    }),
    prisma.doseLog.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId: medications[0].id, // Tylenol
        takenAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
  ])

  console.log('✅ Added dose logs')
  console.log('\n🎉 Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
