import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { onboardingStep1Schema } from '@/lib/validations'

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
        // Validate step 1 data
        const validatedStep1 = onboardingStep1Schema.safeParse(data)
        if (!validatedStep1.success) {
          return NextResponse.json(
            {
              error: validatedStep1.error.errors[0]?.message || 'اطلاعات واردشده نامعتبر است',
              details: validatedStep1.error.errors,
            },
            { status: 400 }
          )
        }

        // Check username availability if provided
        if (validatedStep1.data.username) {
          const existingUser = await prisma.user.findFirst({
            where: {
              username: validatedStep1.data.username,
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

        const step1 = validatedStep1.data
        Object.assign(updateData, {
          firstName: step1.firstName,
          lastName: step1.lastName,
          displayName: step1.displayName,
          username: step1.username,
          avatarUrl: step1.avatarUrl || null,
          coverUrl: step1.coverUrl || null,
          city: step1.city || null,
          bio: step1.bio || null,
          telegramLink: step1.telegramLink || null,
          linkedinLink: step1.linkedinLink || null,
          githubLink: step1.githubLink || null,
          websiteLink: step1.websiteLink || null,
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