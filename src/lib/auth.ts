import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { phoneSchema, otpSchema } from './validations'
import { verifyAndConsumeOTP } from './otp'

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

        // Verify OTP
        const otpResult = await verifyAndConsumeOTP(phoneNumber, otpCode)
        if (!otpResult.valid) {
          throw new Error(otpResult.error || 'Invalid OTP')
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