import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { phoneSchema, otpSchema } from './validations'
import { verifyAndConsumeOTP } from './otp'
import * as crypto from 'crypto'

// Telegram Login Widget verification
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

function checkTelegramAuthData(authData: any): boolean {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set')
    return false
  }

  const { hash, ...data } = authData
  if (!hash) return false

  // Create data check string
  const dataCheckString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n')

  // Calculate hash
  const secretKey = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest()
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  return calculatedHash === hash
}

// Extend the session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
      role: string
    }
  }

  interface User {
    id: string
    phone?: string | null
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    phone?: string | null
    role: string
    username?: string | null
    displayName?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'telegram',
      name: 'Telegram',
      credentials: {
        authData: { label: 'Telegram Auth Data', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.authData) {
          throw new Error('Telegram auth data is required')
        }

        try {
          const authData = JSON.parse(credentials.authData as string)

          // Verify Telegram auth data
          if (!checkTelegramAuthData(authData)) {
            throw new Error('Invalid Telegram auth data')
          }

          // Extract user info
          const telegramId = authData.id?.toString()
          const firstName = authData.first_name || ''
          const lastName = authData.last_name || ''
          const username = authData.username || ''
          const photoUrl = authData.photo_url || ''

          if (!telegramId) {
            throw new Error('Invalid Telegram user data')
          }

          // Check if user exists by telegram ID
          let user = await prisma.user.findFirst({
            where: {
              email: `telegram_${telegramId}@telegram.local`
            }
          })

          if (!user) {
            // Create new user from Telegram data
            const fullName = [firstName, lastName].filter(Boolean).join(' ')
            const displayName = username || fullName || firstName

            user = await prisma.user.create({
              data: {
                email: `telegram_${telegramId}@telegram.local`,
                name: fullName || firstName,
                firstName: firstName || null,
                lastName: lastName || null,
                displayName: displayName,
                username: username || null,
                avatarUrl: photoUrl || null,
                emailVerified: new Date(),
              }
            })
          } else {
            // Update existing user info
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                avatarUrl: photoUrl || user.avatarUrl,
              }
            })
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          }
        } catch (error) {
          console.error('Error in Telegram authorization:', error)
          throw new Error('Telegram authentication failed')
        }
      },
    }),
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error('Phone number and OTP are required')
        }

        // Validate phone format
        const validatedPhone = phoneSchema.safeParse({ phone: credentials.phone })
        if (!validatedPhone.success) {
          throw new Error('Invalid phone number format')
        }

        // Validate OTP format
        const validatedOTP = otpSchema.safeParse({
          phone: credentials.phone,
          otp: credentials.otp
        })
        if (!validatedOTP.success) {
          throw new Error('Invalid OTP format')
        }

        const phoneNumber = validatedPhone.data.phone
        const otpCode = validatedOTP.data.otp

        // Verify OTP. A master test code (TEST_OTP, default "11111") allows
        // login without real SMS delivery — useful while the SMS template is
        // unavailable and for admin access. Disable by setting TEST_OTP="".
        const TEST_OTP = process.env.TEST_OTP ?? '11111'
        if (!(TEST_OTP && otpCode === TEST_OTP)) {
          const otpResult = await verifyAndConsumeOTP(phoneNumber, otpCode)
          if (!otpResult.valid) {
            throw new Error(otpResult.error || 'Invalid OTP')
          }
        }

        try {
          // Find or create user by phone number
          let user = await prisma.user.findUnique({
            where: { phone: phoneNumber }
          })

          if (!user) {
            // Create new user with phone number
            user = await prisma.user.create({
              data: {
                phone: phoneNumber,
                name: `کاربر ${phoneNumber}`, // Placeholder name
                emailVerified: new Date(), // Phone is considered verified if OTP is valid
              }
            })
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          }
        } catch (error) {
          console.error('Error in phone OTP authorization:', error)
          throw new Error('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
        // Fetch user data to get username and displayName
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, displayName: true }
        })
        if (userData) {
          token.username = userData.username
          token.displayName = userData.displayName
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.phone = token.phone
        session.user.role = token.role
      }
      return session
    },
  },
}