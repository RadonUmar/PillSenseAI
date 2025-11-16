import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all upcoming doses (not completed, ordered by scheduledFor)
export async function GET() {
  try {
    const upcomingDoses = await prisma.upcomingDose.findMany({
      where: {
        completed: false,
        scheduledFor: {
          gte: new Date() // Only future doses
        }
      },
      include: {
        medication: true
      },
      orderBy: {
        scheduledFor: 'asc'
      }
    })

    return NextResponse.json({ upcomingDoses })
  } catch (error) {
    console.error('Error fetching upcoming doses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming doses' },
      { status: 500 }
    )
  }
}

// POST create new upcoming dose
export async function POST(request: NextRequest) {
  try {
    const { medicationId, scheduledFor, foodInstruction } = await request.json()

    const upcomingDose = await prisma.upcomingDose.create({
      data: {
        medicationId,
        scheduledFor: new Date(scheduledFor),
        foodInstruction: foodInstruction || 'any_time'
      },
      include: {
        medication: true
      }
    })

    return NextResponse.json(upcomingDose, { status: 201 })
  } catch (error) {
    console.error('Error creating upcoming dose:', error)
    return NextResponse.json(
      { error: 'Failed to create upcoming dose' },
      { status: 500 }
    )
  }
}

// PATCH mark dose as completed
export async function PATCH(request: NextRequest) {
  try {
    const { id, completed } = await request.json()

    const upcomingDose = await prisma.upcomingDose.update({
      where: { id },
      data: { completed }
    })

    return NextResponse.json(upcomingDose)
  } catch (error) {
    console.error('Error updating upcoming dose:', error)
    return NextResponse.json(
      { error: 'Failed to update upcoming dose' },
      { status: 500 }
    )
  }
}
