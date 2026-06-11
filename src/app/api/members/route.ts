import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/members - Get members list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const mainField = searchParams.get('mainField') || ''
    const city = searchParams.get('city') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const tool = searchParams.get('tool') || ''
    const collaborationStatus = searchParams.get('collaborationStatus') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      profilePublic: true,
      onboardingCompleted: true,
    }

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (mainField) {
      where.mainField = mainField
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel
    }

    if (tool) {
      where.tools = {
        has: tool
      }
    }

    if (collaborationStatus) {
      where.collaborationStatus = collaborationStatus
    }

    // Build order by
    let orderBy: any = {}
    switch (sort) {
      case 'points':
        orderBy = { points: 'desc' }
        break
      case 'active':
        orderBy = { updatedAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get members
    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          displayName: true,
          username: true,
          avatarUrl: true,
          mainField: true,
          city: true,
          experienceLevel: true,
          points: true,
          collaborationStatus: true,
          tools: true,
          createdAt: true,
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error getting members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}