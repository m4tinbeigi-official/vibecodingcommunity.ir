import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const server = await prisma.server.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, server })
  } catch (error) {
    console.error('Error deleting server:', error)
    return NextResponse.json(
      { error: 'Failed to delete server' },
      { status: 500 }
    )
  }
}
