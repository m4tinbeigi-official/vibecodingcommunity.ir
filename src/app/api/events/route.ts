import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/events - Get events list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    const sort = searchParams.get('sort') || 'newest'

    const where: any = {}
    if (type) {
      where.type = type
    }
    if (status) {
      where.status = status
    }

    let orderBy: any = {}
    switch (sort) {
      case 'date':
        orderBy = { date: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    })

    // Transform to add registered count
    const eventsWithCounts = events.map(event => ({
      ...event,
      registeredCount: event._count.registrations,
    }))

    return NextResponse.json({ events: eventsWithCounts })

  } catch (error) {
    console.error('Error getting events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
