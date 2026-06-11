import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/user/onboarding - Update onboarding step
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { step, data, completed } = body

    if (!step || !data) {
      return NextResponse.json(
        { error: 'Step and data are required' },
        { status: 400 }
      )
    }

    // Update user based on step
    const updateData: any = {
      onboardingStep: step + 1,
    }

    if (completed) {
      updateData.onboardingCompleted = true
    }

    // Map step data to database fields
    switch (step) {
      case 1:
        Object.assign(updateData, {
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          username: data.username,
          avatarUrl: data.avatarUrl || null,
          coverUrl: data.coverUrl || null,
          city: data.city || null,
          bio: data.bio || null,
          telegramLink: data.telegramLink || null,
          linkedinLink: data.linkedinLink || null,
          githubLink: data.githubLink || null,
          websiteLink: data.websiteLink || null,
        })
        break
      case 2:
        Object.assign(updateData, {
          mainField: data.mainField,
          secondaryFields: data.secondaryFields || [],
        })
        break
      case 3:
        Object.assign(updateData, {
          experienceLevel: data.experienceLevel,
        })
        break
      case 4:
        Object.assign(updateData, {
          tools: data.tools || [],
        })
        break
      case 5:
        Object.assign(updateData, {
          membershipGoals: data.membershipGoals || [],
        })
        break
      case 6:
        Object.assign(updateData, {
          collaborationStatus: data.collaborationStatus,
        })
        break
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      nextStep: completed ? null : step + 1
    })

  } catch (error) {
    console.error('Error updating onboarding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}