import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET medication by NFC ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nfcId: string }> }
) {
  try {
    const { nfcId } = await params
    const medication = await prisma.medication.findUnique({
      where: { nfcId }
    })

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found for this NFC tag' },
        { status: 404 }
      )
    }

    return NextResponse.json(medication)
  } catch (error) {
    console.error('Error fetching medication by NFC:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medication' },
      { status: 500 }
    )
  }
}
