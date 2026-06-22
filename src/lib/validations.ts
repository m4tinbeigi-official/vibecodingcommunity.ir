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

// Optional image URL: trims whitespace, treats blank as empty, validates real URL.
// Tolerates pasted URLs with stray spaces (a common cause of false validation errors).
const optionalImageUrl = (message: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().url(message).optional().or(z.literal(''))
  )

// Optional social field: a profile may paste a full link OR a handle (e.g. @user,
// t.me/user). We only trim and keep it as plain text so handles don't fail validation.
const optionalSocial = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z.string().max(300, 'آدرس بیش از حد طولانی است').optional().or(z.literal(''))
)

// Onboarding Step 1: Basic Info
export const onboardingStep1Schema = z.object({
  firstName: z.string().trim().min(2, 'نام باید حداقل 2 حرف باشد'),
  lastName: z.string().trim().min(2, 'نام خانوادگی باید حداقل 2 حرف باشد'),
  displayName: z.string().trim().min(3, 'نام نمایشی باید حداقل 3 حرف باشد'),
  username: z.string()
    .trim()
    .min(3, 'نام کاربری باید حداقل 3 حرف باشد')
    .max(30, 'نام کاربری باید حداکثر 30 حرف باشد')
    .regex(/^[a-zA-Z0-9_-]+$/, 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و آندرلاین باشد'),
  avatarUrl: optionalImageUrl('آدرس آواتار نامعتبر است'),
  coverUrl: optionalImageUrl('آدرس کاور نامعتبر است'),
  city: z.string().optional(),
  bio: z.string().max(500, 'بیوگرافی باید حداکثر 500 حرف باشد').optional(),
  telegramLink: optionalSocial,
  linkedinLink: optionalSocial,
  githubLink: optionalSocial,
  websiteLink: optionalSocial,
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

// Profile Update Schema (used by PATCH /api/user/profile).
// Basic info stays required (same rules as onboarding step 1), while the
// professional fields are optional so users can save a partially-completed
// profile and fill the rest later from the "complete profile" flow.
export const profileUpdateSchema = onboardingStep1Schema.extend({
  mainField: z.string().optional(),
  secondaryFields: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  tools: z.array(z.string()).optional(),
  membershipGoals: z.array(z.string()).optional(),
  collaborationStatus: z.string().optional(),
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showSocialLinks: z.boolean().optional(),
  profilePublic: z.boolean().optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

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

// Project validation schemas
export const projectSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل 3 حرف باشد').max(100, 'عنوان باید حداکثر 100 حرف باشد'),
  shortDescription: z.string().min(10, 'توضیح کوتاه باید حداقل 10 حرف باشد').max(200, 'توضیح کوتاه باید حداکثر 200 حرف باشد'),
  fullDescription: z.string().min(20, 'توضیح کامل باید حداقل 20 حرف باشد').max(5000, 'توضیح کامل باید حداکثر 5000 حرف باشد'),
  problemSolved: z.string().max(2000, 'مشکل حل شده باید حداکثر 2000 حرف باشد').optional(),
  targetAudience: z.string().max(1000, 'مخاطبان هدف باید حداکثر 1000 حرف باشد').optional(),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  status: z.enum(['idea', 'mvp', 'launched', 'in_development'], {
    errorMap: () => ({ message: 'وضعیت نامعتبر است' })
  }),
  tools: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  demoUrl: z.string().url('آدرس دمو نامعتبر است').optional().or(z.literal('')),
  githubUrl: z.string().url('آدرس گیت‌هاب نامعتبر است').optional().or(z.literal('')),
  imageUrl: z.string().url('آدرس تصویر نامعتبر است').optional().or(z.literal('')),
  images: z.array(z.string().url()).default([]),
  lookingForTeammates: z.boolean().default(false),
  neededRoles: z.array(z.string()).default([]),
})

export const PROJECT_CATEGORIES = [
  'SaaS / Micro-SaaS',
  'Web Application',
  'Mobile Application',
  'Telegram Bot',
  'AI Tool',
  'Automation Tool',
  'E-commerce',
  'Education',
  'Productivity',
  'Social',
  'Developer Tools',
  'Other',
] as const

export const PROJECT_STATUSES = [
  { value: 'idea', label: 'ایده' },
  { value: 'mvp', label: 'MVP' },
  { value: 'in_development', label: 'در حال توسعه' },
  { value: 'launched', label: 'منتشر شده' },
] as const

export type ProjectInput = z.infer<typeof projectSchema>

// Challenge validation schemas
export const challengeSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل 3 حرف باشد').max(100, 'عنوان باید حداکثر 100 حرف باشد'),
  shortDescription: z.string().min(10, 'توضیح کوتاه باید حداقل 10 حرف باشد').max(200, 'توضیح کوتاه باید حداکثر 200 حرف باشد'),
  fullDescription: z.string().min(20, 'توضیح کامل باید حداقل 20 حرف باشد').max(5000, 'توضیح کامل باید حداکثر 5000 حرف باشد'),
  rules: z.string().max(2000, 'قوانین باید حداکثر 2000 حرف باشد').optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ نامعتبر است'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ نامعتبر است'),
  pointsReward: z.number().int().min(0, 'امتیاز باید عدد مثبت باشد'),
  prize: z.string().max(200, 'جایزه باید حداکثر 200 حرف باشد').optional(),
  status: z.enum(['upcoming', 'active', 'completed'], {
    errorMap: () => ({ message: 'وضعیت نامعتبر است' })
  }),
})

export const CHALLENGE_STATUSES = [
  { value: 'upcoming', label: 'در انتظار' },
  { value: 'active', label: 'فعال' },
  { value: 'completed', label: 'تکمیل شده' },
] as const

export const challengeSubmissionSchema = z.object({
  projectId: z.string().min(1, 'پروژه الزامی است'),
  note: z.string().max(500, 'یادداشت باید حداکثر 500 حرف باشد').optional(),
})

export type ChallengeInput = z.infer<typeof challengeSchema>
export type ChallengeSubmissionInput = z.infer<typeof challengeSubmissionSchema>

// Event validation schemas
export const eventSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل 3 حرف باشد').max(100, 'عنوان باید حداکثر 100 حرف باشد'),
  description: z.string().min(20, 'توضیح باید حداقل 20 حرف باشد').max(5000, 'توضیح باید حداکثر 5000 حرف باشد'),
  type: z.enum(['online', 'in_person'], {
    errorMap: () => ({ message: 'نوع رویداد نامعتبر است' })
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ نامعتبر است'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت زمان نامعتبر است'),
  location: z.string().max(200, 'مکان باید حداکثر 200 حرف باشد').optional(),
  onlineUrl: z.string().url('آدرس آنلاین نامعتبر است').optional().or(z.literal('')),
  speakers: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  capacity: z.number().int().positive('ظرفیت باید عدد مثبت باشد').optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'وضعیت نامعتبر است' })
  }),
})

export const EVENT_TYPES = [
  { value: 'online', label: 'آنلاین' },
  { value: 'in_person', label: 'حضوری' },
] as const

export const EVENT_STATUSES = [
  { value: 'upcoming', label: 'در انتظار' },
  { value: 'ongoing', label: 'در حال برگزاری' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'cancelled', label: 'لغو شده' },
] as const

export type EventInput = z.infer<typeof eventSchema>

// Resource validation schemas
export const resourceSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل 3 حرف باشد').max(100, 'عنوان باید حداکثر 100 حرف باشد'),
  content: z.string().min(20, 'محتوا باید حداقل 20 حرف باشد').max(10000, 'محتوا باید حداکثر 10000 حرف باشد'),
  type: z.enum(['prompt', 'ai_tool', 'mvp_checklist', 'tutorial', 'experience', 'beginner'], {
    errorMap: () => ({ message: 'نوع منبع نامعتبر است' })
  }),
  description: z.string().max(500, 'توضیح باید حداکثر 500 حرف باشد').optional(),
  tags: z.array(z.string()).default([]),
})

export const RESOURCE_TYPES = [
  { value: 'prompt', label: 'پرامپت' },
  { value: 'ai_tool', label: 'ابزار هوش مصنوعی' },
  { value: 'mvp_checklist', label: 'چک‌لیست MVP' },
  { value: 'tutorial', label: 'آموزش' },
  { value: 'experience', label: 'تجربه عضو' },
  { value: 'beginner', label: 'منبع مبتدی' },
] as const

export type ResourceInput = z.infer<typeof resourceSchema>