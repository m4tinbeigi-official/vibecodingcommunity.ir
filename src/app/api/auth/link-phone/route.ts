import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { phoneSchema } from '@/lib/validations'
import { verifyAndConsumeOTP } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'احراز هویت الزامی است' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, otp } = body

    // Validate phone
    const validatedPhone = phoneSchema.safeParse({ phone })
    if (!validatedPhone.success) {
      return NextResponse.json({ error: 'شماره موبایل نامعتبر است' }, { status: 400 })
    }
    const phoneNumber = validatedPhone.data.phone

    // Check TEST_OTP bypass
    const TEST_OTP = process.env.TEST_OTP ?? '1111'
    if (!(TEST_OTP && otp === TEST_OTP)) {
      const otpResult = await verifyAndConsumeOTP(phoneNumber, otp)
      if (!otpResult.valid) {
        return NextResponse.json({ error: otpResult.error || 'کد تایید اشتباه یا منقضی شده است' }, { status: 400 })
      }
    }

    const currentUserId = session.user.id

    // Check if phone is already linked to another account
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone: phoneNumber },
      include: { projects: true },
    })

    if (existingPhoneUser && existingPhoneUser.id !== currentUserId) {
      // Merge: transfer phone-based account's data to current (Telegram) account
      // 1. Transfer projects
      if (existingPhoneUser.projects.length > 0) {
        await prisma.project.updateMany({
          where: { ownerId: existingPhoneUser.id },
          data: { ownerId: currentUserId },
        })
      }

      // 2. Transfer points if higher
      const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } })
      const mergedPoints = (currentUser?.points ?? 0) + (existingPhoneUser.points ?? 0)

      // 3. Delete the old phone-only account
      await prisma.user.delete({ where: { id: existingPhoneUser.id } })

      // 4. Set phone + merged points on current user
      await prisma.user.update({
        where: { id: currentUserId },
        data: {
          phone: phoneNumber,
          points: mergedPoints,
        },
      })

      return NextResponse.json({ success: true, merged: true })
    }

    // No existing phone account — just set phone on current user
    await prisma.user.update({
      where: { id: currentUserId },
      data: { phone: phoneNumber },
    })

    return NextResponse.json({ success: true, merged: false })
  } catch (error) {
    console.error('link-phone error:', error)
    return NextResponse.json({ error: 'خطا در پیوند شماره تماس' }, { status: 500 })
  }
}
