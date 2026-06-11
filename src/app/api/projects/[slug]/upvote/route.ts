import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/projects/[slug]/upvote - Upvote a project
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

    const project = await prisma.project.findUnique({
      where: { slug: params.slug }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if already upvoted
    const existing = await prisma.projectUpvote.findUnique({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: session.user.id
        }
      }
    })

    if (existing) {
      // Remove upvote
      await prisma.projectUpvote.delete({
        where: { id: existing.id }
      })

      // Update count
      const updated = await prisma.project.update({
        where: { id: project.id },
        data: {
          upvotesCount: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({
        upvoted: false,
        upvotesCount: updated.upvotesCount
      })
    }

    // Add upvote
    await prisma.projectUpvote.create({
      data: {
        projectId: project.id,
        userId: session.user.id
      }
    })

    // Update count
    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        upvotesCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      upvoted: true,
      upvotesCount: updated.upvotesCount
    })

  } catch (error) {
    console.error('Error toggling upvote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}