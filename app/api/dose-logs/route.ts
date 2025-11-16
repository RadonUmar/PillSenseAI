import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all dose logs
export async function GET() {
  try {
    const doseLogs = await prisma.doseLog.findMany({
      include: {
        medication: true,
        pillBox: true
      },
      orderBy: {
        takenAt: 'desc'
      }
    })

    return NextResponse.json({ doseLogs })
  } catch (error) {
    console.error('Error fetching dose logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dose logs' },
      { status: 500 }
    )
  }
}

// POST create new dose log
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/dose-logs - Request received')
    const { medicationId, notes, takenAt } = await request.json()
    console.log('Dose log data:', { medicationId, notes, takenAt })

    // Get or create pillbox
    let pillBox = await prisma.pillBox.findFirst()
    if (!pillBox) {
      console.log('No pillbox found, creating one...')
      pillBox = await prisma.pillBox.create({
        data: { name: 'My Pill Box' }
      })
    }

    console.log('Creating dose log...')
    const doseLog = await prisma.doseLog.create({
      data: {
        pillBoxId: pillBox.id,
        medicationId,
        notes: notes || null,
        takenAt: takenAt ? new Date(takenAt) : new Date()
      },
      include: {
        medication: true
      }
    })

    console.log('Dose log created:', doseLog)
    return NextResponse.json(doseLog, { status: 201 })
  } catch (error) {
    console.error('Error creating dose log:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to create dose log', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
