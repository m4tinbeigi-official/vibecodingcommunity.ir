import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/resources/[slug] - Get single resource
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { slug: params.slug },
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

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Get related resources (same type)
    const relatedResources = await prisma.resource.findMany({
      where: {
        type: resource.type,
        id: { not: resource.id }
      },
      take: 4,
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

    return NextResponse.json({
      ...resource,
      relatedResources
    })

  } catch (error) {
    console.error('Error getting resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
