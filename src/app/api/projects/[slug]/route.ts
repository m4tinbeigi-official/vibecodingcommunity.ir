import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/projects/[slug] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            city: true,
            mainField: true,
            bio: true,
          }
        },
        _count: {
          select: { upvotes: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Block unapproved projects from non-owners
    if (!project.approved && project.ownerId !== session?.user?.id) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if current user has upvoted
    let hasUpvoted = false
    if (session?.user?.id) {
      const upvote = await prisma.projectUpvote.findUnique({
        where: {
          projectId_userId: {
            projectId: project.id,
            userId: session.user.id
          }
        }
      })
      hasUpvoted = !!upvote
    }

    return NextResponse.json({
      ...project,
      hasUpvoted
    })

  } catch (error) {
    console.error('Error getting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[slug] - Update project
export async function PATCH(
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

    const project = await prisma.project.findUnique({
      where: { slug: params.slug }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own projects' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const updated = await prisma.project.update({
      where: { slug: params.slug },
      data: body
    })

    return NextResponse.json(updated)

  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[slug] - Delete project
export async function DELETE(
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

    const project = await prisma.project.findUnique({
      where: { slug: params.slug }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own projects' },
        { status: 403 }
      )
    }

    await prisma.project.delete({
      where: { slug: params.slug }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}