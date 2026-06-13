import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/challenges/[slug] - Get single challenge
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { slug: params.slug },
      include: {
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                username: true,
                avatarUrl: true,
              }
            },
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
                shortDescription: true,
                imageUrl: true,
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        },
        _count: {
          select: { submissions: true }
        }
      }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Get unique participants
    const uniqueParticipants = new Set(challenge.submissions.map(s => s.userId))

    return NextResponse.json({
      ...challenge,
      participantsCount: uniqueParticipants.size,
    })

  } catch (error) {
    console.error('Error getting challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
