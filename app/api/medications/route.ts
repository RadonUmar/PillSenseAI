import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all medications
export async function GET() {
  try {
    const medications = await prisma.medication.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(medications)
  } catch (error) {
    console.error('Error fetching medications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    )
  }
}

// POST create new medication
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/medications - Request received')
    const body = await request.json()
    console.log('Request body:', body)

    const {
      name,
      activeIngredient,
      dosage,
      frequency,
      warnings,
      ageRestriction,
      notes,
      nfcId,
      imageUrl
    } = body

    console.log('Creating medication...')
    const medication = await prisma.medication.create({
      data: {
        name,
        activeIngredient,
        dosage,
        frequency,
        warnings,
        ageRestriction,
        notes,
        nfcId: nfcId || null,
        imageUrl: imageUrl || null
      }
    })

    console.log('Medication created:', medication)
    return NextResponse.json(medication, { status: 201 })
  } catch (error) {
    console.error('Error creating medication:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to create medication', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
