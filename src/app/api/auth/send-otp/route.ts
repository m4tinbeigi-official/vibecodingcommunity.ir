import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, hashOTP, createOTPRecord, checkRateLimit } from '@/lib/otp'
import { phoneSchema } from '@/lib/validations'
import { getSMSirService } from '@/lib/sms/smsir'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    // Validate phone number
    const validatedPhone = phoneSchema.safeParse({ phone })
    if (!validatedPhone.success) {
      return NextResponse.json(
        { success: false, message: 'شماره موبایل نامعتبر است' },
        { status: 400 }
      )
    }

    const phoneNumber = validatedPhone.data.phone

    // Check rate limit
    const rateLimit = await checkRateLimit(phoneNumber, 'send_otp')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً 15 دقیقه دیگر تلاش کنید.'
        },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpHash = await hashOTP(otp)

    // Save OTP record
    await createOTPRecord(phoneNumber, otpHash, 5) // 5 minutes expiration

    // Send SMS
    const smsService = getSMSirService()
    if (smsService) {
      const smsResult = await smsService.sendOTP({
        phoneNumber,
        otp
      })

      if (smsResult.status === 'error') {
        console.error('SMS sending failed:', smsResult.message)
        // Still return success to prevent phone number enumeration
        // But log the error for monitoring
      }
    } else {
      console.warn('SMS service not configured, OTP would be:', otp)
      // For development: log OTP to console
      console.log('Development Mode - OTP:', otp)
    }

    return NextResponse.json({
      success: true,
      message: 'کد تایید ارسال شد'
    })

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ارسال کد تایید' },
      { status: 500 }
    )
  }
}