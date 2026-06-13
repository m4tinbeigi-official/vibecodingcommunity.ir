import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/challenges - Get challenges list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || ''
    const sort = searchParams.get('sort') || 'newest'

    const where: any = {}
    if (status) {
      where.status = status
    }

    let orderBy: any = {}
    switch (sort) {
      case 'ending_soon':
        orderBy = { endDate: 'asc' }
        break
      case 'start_date':
        orderBy = { startDate: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const challenges = await prisma.challenge.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    })

    // Transform to add participant count
    const challengesWithCounts = challenges.map(challenge => ({
      ...challenge,
      participantsCount: challenge._count.submissions,
      submissionsCount: challenge._count.submissions,
    }))

    return NextResponse.json({ challenges: challengesWithCounts })

  } catch (error) {
    console.error('Error getting challenges:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
