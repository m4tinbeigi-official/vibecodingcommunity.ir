import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'

// GET /api/projects - Get projects list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const tool = searchParams.get('tool') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { approved: true }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { fullDescription: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (tool) {
      where.tools = {
        has: tool
      }
    }

    // Build order by
    let orderBy: any = {}
    switch (sort) {
      case 'upvotes':
        orderBy = { upvotesCount: 'desc' }
        break
      case 'featured':
        orderBy = [{ featured: 'desc' }, { upvotesCount: 'desc' }]
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get projects
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              displayName: true,
              username: true,
              avatarUrl: true,
            }
          }
        }
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error getting projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
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

    // Validate
    const validated = projectSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.errors },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = validated.data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now().toString(36)

    // Create project
    const project = await prisma.project.create({
      data: {
        ...validated.data,
        slug,
        ownerId: session.user.id,
      }
    })

    return NextResponse.json(project, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}