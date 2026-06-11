import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { addMinutes, isBefore } from 'date-fns'

// Rate limiting configuration
const RATE_LIMITS = {
  SEND_OTP: {
    MAX_ATTEMPTS: 3,
    WINDOW_MINUTES: 15
  },
  VERIFY_OTP: {
    MAX_ATTEMPTS: 5,
    WINDOW_MINUTES: 15
  }
}

// Generate a 4-digit OTP
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Hash OTP for storage
export async function hashOTP(otp: string): Promise<string> {
  return await bcrypt.hash(otp, 10)
}

// Verify OTP against hash
export async function verifyOTP(otp: string, otpHash: string): Promise<boolean> {
  return await bcrypt.compare(otp, otpHash)
}

// Check rate limit for a specific action
export async function checkRateLimit(
  identifier: string,
  action: 'send_otp' | 'verify_otp'
): Promise<{ allowed: boolean; remainingAttempts: number }> {
  const limit = action === 'send_otp' ? RATE_LIMITS.SEND_OTP : RATE_LIMITS.VERIFY_OTP
  const windowStart = addMinutes(new Date(), -limit.WINDOW_MINUTES)

  // Clean old rate limit records
  await prisma.rateLimit.deleteMany({
    where: {
      identifier,
      action,
      windowStart: { lt: windowStart }
    }
  })

  // Get current count
  const current = await prisma.rateLimit.findUnique({
    where: {
      identifier_action_windowStart: {
        identifier,
        action,
        windowStart: new Date()
      }
    }
  })

  const count = current?.count || 0
  const allowed = count < limit.MAX_ATTEMPTS
  const remainingAttempts = Math.max(0, limit.MAX_ATTEMPTS - count - 1)

  if (!allowed) {
    return { allowed: false, remainingAttempts: 0 }
  }

  // Increment counter or create new record
  if (current) {
    await prisma.rateLimit.update({
      where: { id: current.id },
      data: { count: count + 1 }
    })
  } else {
    await prisma.rateLimit.create({
      data: {
        identifier,
        action,
        count: 1,
        windowStart: new Date()
      }
    })
  }

  return { allowed: true, remainingAttempts }
}

// Create OTP record
export async function createOTPRecord(
  phoneNumber: string,
  otpHash: string,
  expirationMinutes: number = 5
): Promise<void> {
  const expiresAt = addMinutes(new Date(), expirationMinutes)

  await prisma.phoneOTP.create({
    data: {
      phoneNumber,
      otpHash,
      expiresAt
    }
  })
}

// Verify and consume OTP
export async function verifyAndConsumeOTP(
  phoneNumber: string,
  otp: string
): Promise<{ valid: boolean; error?: string }> {
  // Find the latest OTP for this phone number
  const otpRecord = await prisma.phoneOTP.findFirst({
    where: {
      phoneNumber,
      verified: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (!otpRecord) {
    return { valid: false, error: 'کد تایید یافت نشد' }
  }

  // Check expiration
  if (!isBefore(new Date(), otpRecord.expiresAt)) {
    return { valid: false, error: 'کد تایید منقضی شده است' }
  }

  // Verify OTP
  const isValid = await verifyOTP(otp, otpRecord.otpHash)
  if (!isValid) {
    return { valid: false, error: 'کد تایید اشتباه است' }
  }

  // Mark as verified
  await prisma.phoneOTP.update({
    where: { id: otpRecord.id },
    data: { verified: true }
  })

  return { valid: true }
}