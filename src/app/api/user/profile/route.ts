import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { onboardingStep1Schema } from '@/lib/validations'

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        displayName: true,
        username: true,
        avatarUrl: true,
        coverUrl: true,
        city: true,
        bio: true,
        telegramLink: true,
        linkedinLink: true,
        githubLink: true,
        websiteLink: true,
        mainField: true,
        secondaryFields: true,
        experienceLevel: true,
        tools: true,
        skills: true,
        membershipGoals: true,
        collaborationStatus: true,
        showEmail: true,
        showPhone: true,
        showSocialLinks: true,
        profilePublic: true,
        onboardingCompleted: true,
        onboardingStep: true,
        pastEventsAnswered: true,
        points: true,
        level: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('Error getting profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate the data
    const validatedData = onboardingStep1Schema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: validatedData.error.errors[0]?.message || 'اطلاعات واردشده نامعتبر است',
          details: validatedData.error.errors,
        },
        { status: 400 }
      )
    }

    // Check username if provided
    if (body.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: body.username,
          NOT: { id: session.user.id }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'این نام کاربری قبلاً گرفته شده است' },
          { status: 400 }
        )
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData.data
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}