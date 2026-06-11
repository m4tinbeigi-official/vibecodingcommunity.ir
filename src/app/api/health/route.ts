import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        auth: 'configured',
        sms: process.env.SMSIR_API_KEY ? 'configured' : 'not configured',
        google: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured',
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        nextauth_url: process.env.NEXTAUTH_URL,
      }
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      },
      { status: 503 }
    )
  }
}