import { z } from 'zod'

// Phone number validation for Iranian phone numbers
export const phoneSchema = z.object({
  phone: z.string()
    .regex(/^(\+98|0)?9\d{9}$/, 'شماره موبایل نامعتبر است')
    .transform(val => {
      // Convert to standard format: +989XXXXXXXXX
      let cleaned = val.replace(/\D/g, '')
      if (cleaned.startsWith('0')) {
        cleaned = '98' + cleaned.substring(1)
      } else if (!cleaned.startsWith('98')) {
        cleaned = '98' + cleaned
      }
      return '+' + cleaned
    })
})

// OTP validation
export const otpSchema = z.object({
  phone: z.string()
    .regex(/^(\+98|0)?9\d{9}$/, 'شماره موبایل نامعتبر است'),
  otp: z.string()
    .regex(/^\d{4,6}$/, 'کد تایید باید 4 تا 6 رقم باشد')
})

// Google auth callback validation
export const googleAuthSchema = z.object({
  error: z.string().optional(),
  code: z.string().optional(),
  state: z.string().optional()
})

export type PhoneInput = z.infer<typeof phoneSchema>
export type OTPInput = z.infer<typeof otpSchema>