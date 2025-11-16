import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE medication from pill box
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> }
) {
  try {
    const { medicationId } = await params

    const pillBox = await prisma.pillBox.findFirst()
    if (!pillBox) {
      return NextResponse.json(
        { error: 'Pill box not found' },
        { status: 404 }
      )
    }

    await prisma.pillBoxMedication.delete({
      where: {
        pillBoxId_medicationId: {
          pillBoxId: pillBox.id,
          medicationId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing medication from pill box:', error)
    return NextResponse.json(
      { error: 'Failed to remove medication from pill box' },
      { status: 500 }
    )
  }
}
