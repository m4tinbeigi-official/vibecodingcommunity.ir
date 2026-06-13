import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/challenges/[slug]/join - Join a challenge
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const challenge = await prisma.challenge.findUnique({
      where: { slug: params.slug }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    if (challenge.status !== 'active') {
      return NextResponse.json(
        { error: 'چالش فعال نیست' },
        { status: 400 }
      )
    }

    // Check if already submitted
    const existingSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        challengeId: challenge.id,
        userId: session.user.id
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'شما قبلاً در این چالش شرکت کرده‌اید' },
        { status: 400 }
      )
    }

    // For now, joining is just a flag that user can submit
    // We don't create a record until they submit a project
    return NextResponse.json({
      message: 'شما می‌توانید پروژه ارسال کنید',
      canSubmit: true
    })

  } catch (error) {
    console.error('Error joining challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
