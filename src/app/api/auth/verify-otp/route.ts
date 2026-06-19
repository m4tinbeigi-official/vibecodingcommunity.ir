import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAndConsumeOTP, checkRateLimit } from '@/lib/otp'
import { phoneSchema, otpSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    // Validate phone number
    const validatedPhone = phoneSchema.safeParse({ phone })
    if (!validatedPhone.success) {
      return NextResponse.json(
        { success: false, message: 'شماره موبایل نامعتبر است' },
        { status: 400 }
      )
    }

    const phoneNumber = validatedPhone.data.phone

    // Validate OTP format
    const validatedOTP = otpSchema.safeParse({ phone, otp })
    if (!validatedOTP.success) {
      return NextResponse.json(
        { success: false, message: 'فرمت کد تایید نامعتبر است' },
        { status: 400 }
      )
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(phoneNumber, 'verify_otp')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً 15 دقیقه دیگر تلاش کنید.'
        },
        { status: 429 }
      )
    }

    // Verify OTP. A master test code (TEST_OTP, default "1111") allows login
    // without real SMS delivery — useful while the SMS template is unavailable.
    // Must stay in sync with the phone-otp provider in src/lib/auth.ts.
    // Disable by setting TEST_OTP="".
    const TEST_OTP = process.env.TEST_OTP ?? '1111'
    if (!(TEST_OTP && otp === TEST_OTP)) {
      const result = await verifyAndConsumeOTP(phoneNumber, otp)
      if (!result.valid) {
        return NextResponse.json(
          { success: false, message: result.error || 'کد تایید اشتباه است' },
          { status: 400 }
        )
      }
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: phoneNumber }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phone: phoneNumber,
          name: `کاربر ${phoneNumber.substring(phoneNumber.length - 4)}`,
          emailVerified: new Date(), // Phone is verified
        }
      })
    } else {
      // Update user's phone verification status
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }

    // In a real implementation, you would create a session here
    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'کد تایید صحیح است',
      userId: user.id
    })

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در تایید کد' },
      { status: 500 }
    )
  }
}