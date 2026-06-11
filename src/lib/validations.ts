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

// Onboarding Step 1: Basic Info
export const onboardingStep1Schema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل 2 حرف باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل 2 حرف باشد'),
  displayName: z.string().min(3, 'نام نمایشی باید حداقل 3 حرف باشد'),
  username: z.string()
    .min(3, 'نام کاربری باید حداقل 3 حرف باشد')
    .max(30, 'نام کاربری باید حداکثر 30 حرف باشد')
    .regex(/^[a-zA-Z0-9_-]+$/, 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و آندرلاین باشد'),
  avatarUrl: z.string().url('آدرس آواتار نامعتبر است').optional().or(z.literal('')),
  coverUrl: z.string().url('آدرس کاور نامعتبر است').optional().or(z.literal('')),
  city: z.string().optional(),
  bio: z.string().max(500, 'بیوگرافی باید حداکثر 500 حرف باشد').optional(),
  telegramLink: z.string().url('آدرس تلگرام نامعتبر است').optional().or(z.literal('')),
  linkedinLink: z.string().url('آدرس لینکدین نامعتبر است').optional().or(z.literal('')),
  githubLink: z.string().url('آدرس گیت‌هاب نامعتبر است').optional().or(z.literal('')),
  websiteLink: z.string().url('آدرس وبسایت نامعتبر است').optional().or(z.literal('')),
})

// Onboarding Step 2: Main Field
export const onboardingStep2Schema = z.object({
  mainField: z.string().min(1, 'لطفاً حوزه اصلی خود را انتخاب کنید'),
  secondaryFields: z.array(z.string()).default([]),
})

// Onboarding Step 3: Experience Level
export const onboardingStep3Schema = z.object({
  experienceLevel: z.string().min(1, 'لطفاً سطح تجربه خود را انتخاب کنید'),
})

// Onboarding Step 4: Tools
export const onboardingStep4Schema = z.object({
  tools: z.array(z.string()).min(1, 'حداقل یک ابزار را انتخاب کنید'),
})

// Onboarding Step 5: Membership Goals
export const onboardingStep5Schema = z.object({
  membershipGoals: z.array(z.string()).min(1, 'حداقل یک هدف را انتخاب کنید'),
})

// Onboarding Step 6: Collaboration Status
export const onboardingStep6Schema = z.object({
  collaborationStatus: z.string().min(1, 'لطفاً وضعیت همکاری خود را انتخاب کنید'),
})

// Profile Edit Schema (combines all steps)
export const profileEditSchema = onboardingStep1Schema
  .merge(onboardingStep2Schema)
  .merge(onboardingStep3Schema)
  .merge(onboardingStep4Schema)
  .merge(onboardingStep5Schema)
  .merge(onboardingStep6Schema)
  .extend({
    showEmail: z.boolean().default(false),
    showPhone: z.boolean().default(false),
    showSocialLinks: z.boolean().default(true),
    profilePublic: z.boolean().default(true),
  })

// Constants
export const MAIN_FIELDS = [
  'Frontend Development',
  'Backend Development',
  'Full-stack Development',
  'UI/UX Design',
  'Product Design',
  'AI / Machine Learning',
  'AI Automation',
  'No-code / Low-code',
  'Prompt Engineering',
  'Telegram Bot Development',
  'SaaS / Micro-SaaS Building',
  'Product Management',
  'Startup Founder',
  'Growth / Marketing',
  'AI Content Creation',
  'Data Analysis',
  'DevOps / Cloud',
  'Cybersecurity',
  'Education / Mentoring',
  'Freelancer',
  'Beginner / Learning',
] as const

export const EXPERIENCE_LEVELS = [
  'تازه‌وارد',
  'در حال یادگیری',
  'متوسط',
  'حرفه‌ای',
  'منتور',
  'بنیان‌گذار / سازنده محصول',
] as const

export const TOOLS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Cursor',
  'GitHub Copilot',
  'Replit',
  'Lovable',
  'Bolt',
  'v0',
  'Framer',
  'Webflow',
  'Make',
  'Zapier',
  'n8n',
  'Notion',
  'Airtable',
  'Figma',
  'Supabase',
  'Firebase',
  'Vercel',
  'GitHub',
  'Docker',
  'Other',
] as const

export const MEMBERSHIP_GOALS = [
  'یادگیری وایب‌کدینگ',
  'ساخت MVP',
  'پیدا کردن هم‌تیمی',
  'گرفتن بازخورد روی پروژه',
  'شرکت در چالش‌ها',
  'دمو کردن پروژه',
  'پیدا کردن پروژه فریلنسری',
  'شبکه‌سازی',
  'منتور شدن',
  'جذب همکار برای استارتاپ',
  'ساخت محصول واقعی',
] as const

export const COLLABORATION_STATUSES = [
  'آماده همکاری هستم',
  'دنبال هم‌تیمی هستم',
  'دنبال منتور هستم',
  'می‌توانم منتور باشم',
  'فعلاً فقط یاد می‌گیرم',
  'دنبال پروژه فریلنسری هستم',
  'دنبال جذب نیرو هستم',
] as const

export type PhoneInput = z.infer<typeof phoneSchema>
export type OTPInput = z.infer<typeof otpSchema>
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>
export type OnboardingStep4Input = z.infer<typeof onboardingStep4Schema>
export type OnboardingStep5Input = z.infer<typeof onboardingStep5Schema>
export type OnboardingStep6Input = z.infer<typeof onboardingStep6Schema>
export type ProfileEditInput = z.infer<typeof profileEditSchema>