import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET pill box (for now, we'll just get the first one or create one)
export async function GET() {
  try {
    let pillBox = await prisma.pillBox.findFirst({
      include: {
        medications: {
          include: {
            medication: true
          }
        }
      }
    })

    // If no pillbox exists, create a default one
    if (!pillBox) {
      pillBox = await prisma.pillBox.create({
        data: {
          name: 'My Pill Box'
        },
        include: {
          medications: {
            include: {
              medication: true
            }
          }
        }
      })
    }

    return NextResponse.json(pillBox)
  } catch (error) {
    console.error('Error fetching pill box:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pill box' },
      { status: 500 }
    )
  }
}

// POST add medication to pill box
export async function POST(request: NextRequest) {
  try {
    const { medicationId, quantity } = await request.json()

    // Get or create pillbox
    let pillBox = await prisma.pillBox.findFirst()
    if (!pillBox) {
      pillBox = await prisma.pillBox.create({
        data: { name: 'My Pill Box' }
      })
    }

    // Check if medication already exists in pillbox
    const existing = await prisma.pillBoxMedication.findUnique({
      where: {
        pillBoxId_medicationId: {
          pillBoxId: pillBox.id,
          medicationId
        }
      }
    })

    let pillBoxMedication

    if (existing) {
      // Update quantity
      pillBoxMedication = await prisma.pillBoxMedication.update({
        where: { id: existing.id },
        data: { quantity },
        include: { medication: true }
      })
    } else {
      // Add new medication to pillbox
      pillBoxMedication = await prisma.pillBoxMedication.create({
        data: {
          pillBoxId: pillBox.id,
          medicationId,
          quantity: quantity || 0
        },
        include: { medication: true }
      })
    }

    return NextResponse.json(pillBoxMedication, { status: 201 })
  } catch (error) {
    console.error('Error adding medication to pill box:', error)
    return NextResponse.json(
      { error: 'Failed to add medication to pill box' },
      { status: 500 }
    )
  }
}
