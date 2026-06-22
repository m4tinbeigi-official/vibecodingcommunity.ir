import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { awardPointsOnce, POINTS } from '@/lib/gamification'

// GET /api/user/past-events
// Returns the completed events plus whether the current user already attended
// each one, and whether they've already answered the attendance survey.
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: { status: 'completed' },
      orderBy: { date: 'asc' },
      select: { id: true, slug: true, title: true, date: true, type: true, location: true },
    })

    const registrations = await prisma.eventRegistration.findMany({
      where: { userId: session.user.id, eventId: { in: events.map(e => e.id) } },
      select: { eventId: true },
    })
    const attendedIds = new Set(registrations.map(r => r.eventId))

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pastEventsAnswered: true },
    })

    return NextResponse.json({
      answered: user?.pastEventsAnswered ?? false,
      events: events.map(e => ({ ...e, attended: attendedIds.has(e.id) })),
    })
  } catch (error) {
    console.error('Error loading past events survey:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/user/past-events
// Body: { answers: { [eventId]: boolean } } — one answer per completed event.
// "true" records attendance (creates a registration); "false" records nothing.
// Marks the survey as answered so the user isn't asked again.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const answers = body?.answers
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'پاسخ‌ها نامعتبر است' }, { status: 400 })
    }

    const completedEvents = await prisma.event.findMany({
      where: { status: 'completed' },
      select: { id: true },
    })
    const completedIds = new Set(completedEvents.map(e => e.id))

    for (const [eventId, attended] of Object.entries(answers)) {
      if (!completedIds.has(eventId)) continue

      if (attended === true) {
        // Record attendance (idempotent).
        await prisma.eventRegistration.upsert({
          where: { eventId_userId: { eventId, userId: session.user.id } },
          update: {},
          create: { eventId, userId: session.user.id },
        })

        // Award attendance points (idempotent per event).
        await awardPointsOnce(
          session.user.id,
          'event_attended',
          POINTS.ATTEND_EVENT,
          'eventId',
          eventId,
        )
      } else {
        // Answered "no": remove any prior attendance record if it exists.
        await prisma.eventRegistration.deleteMany({
          where: { eventId, userId: session.user.id },
        })
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pastEventsAnswered: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving past events survey:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
