import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/resources - Get resources list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || ''
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'newest'

    const where: any = {}
    if (type) {
      where.type = type
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    let orderBy: any = {}
    switch (sort) {
      case 'title':
        orderBy = { title: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          }
        }
      }
    })

    return NextResponse.json({ resources })

  } catch (error) {
    console.error('Error getting resources:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/resources - Create new resource
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

    // Validate with Zod (basic validation)
    if (!body.title || body.title.length < 3) {
      return NextResponse.json(
        { error: 'عنوان باید حداقل 3 حرف باشد' },
        { status: 400 }
      )
    }

    if (!body.content || body.content.length < 20) {
      return NextResponse.json(
        { error: 'محتوا باید حداقل 20 حرف باشد' },
        { status: 400 }
      )
    }

    if (!body.type || !['prompt', 'ai_tool', 'mvp_checklist', 'tutorial', 'experience', 'beginner'].includes(body.type)) {
      return NextResponse.json(
        { error: 'نوع منبع نامعتبر است' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now()

    const resource = await prisma.resource.create({
      data: {
        slug,
        title: body.title,
        content: body.content,
        type: body.type,
        description: body.description || null,
        tags: body.tags || [],
        authorId: session.user.id,
      }
    })

    return NextResponse.json(resource)

  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
