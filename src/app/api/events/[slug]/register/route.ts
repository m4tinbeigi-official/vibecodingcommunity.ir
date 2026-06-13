import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/events/[slug]/register - Register for event
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

    const event = await prisma.event.findUnique({
      where: { slug: params.slug }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.status === 'cancelled') {
      return NextResponse.json(
        { error: 'این رویداد لغو شده است' },
        { status: 400 }
      )
    }

    if (event.status === 'completed') {
      return NextResponse.json(
        { error: 'این رویداد به پایان رسیده است' },
        { status: 400 }
      )
    }

    // Check capacity
    if (event.capacity) {
      const registeredCount = await prisma.eventRegistration.count({
        where: { eventId: event.id }
      })

      if (registeredCount >= event.capacity) {
        return NextResponse.json(
          { error: 'ظرفیت رویداد تکمیل شده است' },
          { status: 400 }
        )
      }
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: session.user.id
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'شما قبلاً در این رویداد ثبت‌نام کرده‌اید' },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        userId: session.user.id,
      }
    })

    return NextResponse.json({
      message: 'ثبت‌نام با موفقیت انجام شد',
      registration
    })

  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
