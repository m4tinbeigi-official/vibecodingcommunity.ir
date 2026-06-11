import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { available: false, message: 'نام کاربری الزامی است' },
        { status: 400 }
      )
    }

    // Check username format
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      return NextResponse.json(
        { available: false, message: 'فرمت نام کاربری نامعتبر است' },
        { status: 400 }
      )
    }

    // Check if username exists
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    })

    if (user) {
      return NextResponse.json({
        available: false,
        message: 'این نام کاربری قبلاً گرفته شده است'
      })
    }

    return NextResponse.json({
      available: true,
      message: 'این نام کاربری آزاد است'
    })

  } catch (error) {
    console.error('Error checking username:', error)
    return NextResponse.json(
      { available: false, message: 'خطا در بررسی نام کاربری' },
      { status: 500 }
    )
  }
}