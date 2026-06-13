import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { challengeSubmissionSchema } from '@/lib/validations'

// POST /api/challenges/[slug]/submit - Submit project to challenge
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

    const body = await request.json()
    const validatedData = challengeSubmissionSchema.parse(body)

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

    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      )
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'این پروژه متعلق به شما نیست' },
        { status: 403 }
      )
    }

    // Check if already submitted
    const existingSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        challengeId: challenge.id,
        userId: session.user.id,
        projectId: validatedData.projectId
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'شما قبلاً این پروژه را ارسال کرده‌اید' },
        { status: 400 }
      )
    }

    // Create submission
    const submission = await prisma.challengeSubmission.create({
      data: {
        challengeId: challenge.id,
        projectId: validatedData.projectId,
        userId: session.user.id,
        note: validatedData.note,
      }
    })

    return NextResponse.json(submission)

  } catch (error) {
    console.error('Error submitting to challenge:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
