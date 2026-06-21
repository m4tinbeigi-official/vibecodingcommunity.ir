import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { encryptPassword, decryptPassword } from '@/lib/server-crypto'

export async function GET() {
  try {
    await requireAdmin()

    const servers = await prisma.server.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Decrypt passwords for admin view
    const serversWithPasswords = servers.map(server => ({
      ...server,
      password: decryptPassword(server.passwordHash)
    }))

    return NextResponse.json({ servers: serversWithPasswords })
  } catch (error) {
    console.error('Error fetching servers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch servers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { name, ipAddress, operatingSystem, cpu, ram, storage, macAddress, username, password, description } = body

    if (!name || !ipAddress || !username || !password) {
      return NextResponse.json(
        { error: 'نام، IP، نام کاربری و رمز عبور الزامی هستند' },
        { status: 400 }
      )
    }

    // Check if IP already exists
    const existingServer = await prisma.server.findUnique({
      where: { ipAddress }
    })

    if (existingServer) {
      return NextResponse.json(
        { error: 'این آدرس IP قبلاً ثبت شده است' },
        { status: 400 }
      )
    }

    const encryptedPassword = encryptPassword(password)

    const server = await prisma.server.create({
      data: {
        name,
        ipAddress,
        operatingSystem,
        cpu,
        ram,
        storage,
        macAddress,
        username,
        passwordHash: encryptedPassword,
        description,
      }
    })

    return NextResponse.json({
      success: true,
      server: {
        ...server,
        password: password // Return unencrypted for confirmation
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating server:', error)
    return NextResponse.json(
      { error: 'Failed to create server' },
      { status: 500 }
    )
  }
}
