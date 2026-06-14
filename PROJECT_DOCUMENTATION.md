# داکیومنت کامل پروژه - Vibe Coding Community

## 📋 فهرست مطالب

1. [معرفی پروژه](#معرفی-پروژه)
2. [ساختار پروژه](#ساختار-پروژه)
3. [صفحات عمومی](#صفحات-عمومی)
4. [سیستم احراز هویت](#سیستم-احراز-هویت)
5. [صفحات کاربری](#صفحات-کاربری)
6. [صفحات ادمین](#صفحات-ادمین)
7. [API Routes](#api-routes)
8. [سیستم Gamification](#سیستم-gamification)
9. [Database Schema](#database-schema)
10. [کامپوننت‌ها](#کامپوننت-ها)
11. [ابزارها](#ابزارها)
12. [نصب و راه‌اندازی](#نصب-و-راه-اندازی)

---

## معرفی پروژه

**Vibe Coding Community** یک پلتفرم کامل برای جامعه برنامه‌نویسان است که با Next.js 14، Prisma، PostgreSQL، و NextAuth ساخته شده است.

### ویژگی‌های کلیدی
- ✅ احراز هویت با Google OAuth و SMS OTP
- ✅ سیستم gamification (امتیاز، سطوح، نشان‌ها)
- ✅ مدیریت پروژه‌ها و چالش‌ها
- ✅ سیستم رویدادها و ثبت‌نام
- ✅ اشتراک‌گذاری منابع
- ✅ داشبورد ادمین جامع
- ✅ موبایل-responsive و RTL

---

## ساختار پروژه

```
/src
  /app                    # Next.js App Router pages
    /admin                # صفحات ادمین (8 صفحه)
    /api                  # API routes (29 route)
    /dashboard            # داشبورد کاربری
    /members              # اعضای جامعه
    /projects             # پروژه‌ها
    /challenges           # چالش‌ها
    /events               # رویدادها
    /resources            # منابع
    /login                # صفحه ورود
    /register             # صفحه ثبت‌نام
    /onboarding           # راهنمای شروع
    /profile              # پروفایل کاربری
  /lib                   # توابع و helperها
  /components            # کامپوننت‌های React
/prisma                  # Database schema
/public                  # فایل‌های استاتیک
```

---

## صفحات عمومی

### 1. صفحه اصلی (`/`)
**فایل:** `src/app/page.tsx`
**عملکرد:** Landing page جامعه
**ویژگی‌ها:**
- Hero section با آمار جامعه
- CTA buttons برای ورود/ثبت‌نام
- Feature cards
- "چطور شروع کنم؟" section

---

### 2. صفحات احراز هویت

#### ورود (`/login`)
**فایل:** `src/app/login/page.tsx`
**روش‌ها:**
- Google OAuth
- شماره موبایل + OTP

#### ثبت‌نام (`/register`)
**فایل:** `src/app/register/page.tsx`
**روش:** شماره موبایل + OTP

#### تایید موبایل (`/verify-phone`)
**فایل:** `src/app/verify-phone/page.tsx`
**عملکرد:** وارد کردن OTP و تایید

---

## سیستم احراز هویت

### 1. NextAuth Configuration
**فایل:** `src/lib/auth.ts`

**Features:**
- Google OAuth provider
- Phone OTP credentials provider
- JWT session strategy
- Role-based access (user, admin)
- Suspended user checking

**Callbacks:**
```typescript
// JWT callback - adds role, phone, id
// Session callback - adds user data to session
```

### 2. SMS.ir Integration
**فایل:** `src/lib/sms/smsir.ts`

**Features:**
- ارسال OTP
- Template-based messages
- Error handling

### 3. OTP System
**فایل:** `src/lib/otp.ts`

**Features:**
- تولید 6-digit code
- Hash کردن OTP
- Expiration (5 minutes)
- Rate limiting (3 attempts)
- Verification و consumption

---

## صفحات کاربری

### 1. Dashboard (`/dashboard`)
**فایل:** `src/app/dashboard/page.tsx`

**Features:**
- نمایش آمار کاربر
- پروژه‌های اخیر
- نشان‌های دریافت شده
- سطح فعلی و امتیاز

### 2. پروفایل

#### مشاهده پروفایل (`/members/[username]`)
**فایل:** `src/app/members/[username]/page.tsx`

**Features:**
- اطلاعات کاربر
- پروژه‌ها
- نشان‌ها
- سطح و امتیاز

#### ویرایش پروفایل (`/profile/edit`)
**فایل:** `src/app/profile/edit/page.tsx`

**Fields:**
- username
- displayName
- bio
- skills
- github
- twitter
- linkedin

### 3. Onboarding (`/onboarding`)
**فایل:** `src/app/onboarding/page.tsx`

**Steps:**
1. Welcome message
2. Basic info collection
3. Skills selection
4. Completion redirect

---

## صفحات مدیریت (Admin)

### 1. Dashboard (`/admin`)
**فایل:** `src/app/admin/page.tsx`

**Stats:**
- Total users
- New users (30 روز)
- Completed profiles
- Total projects
- Total challenges
- Total events
- Total resources

### 2. User Management (`/admin/users`)
**فایل:** `src/app/admin/users/page.tsx`

**Features:**
- لیست کاربران
- Search و filter
- Suspend/unsuspend
- Change role
- Assign/remove badges
- Feature member

### 3. Project Management (`/admin/projects`)
**فایل:** `src/app/admin/projects/page.tsx`

**Features:**
- لیست پروژه‌ها
- Feature project
- Hide project
- Delete project
- View owner info

### 4. Challenge Management (`/admin/challenges`)
**فایل:** `src/app/admin/challenges/page.tsx`

**Features:**
- ایجاد چالش
- ویرایش چالش
- بستن چالش
- Mark winner
- Award points

### 5. Event Management (`/admin/events`)
**فایل:** `src/app/admin/events/page.tsx`

**Features:**
- ایجاد رویداد
- ویرایش رویداد
- بستن ثبت‌نام
- Award points به participants

### 6. Resource Management (`/admin/resources`)
**فایل:** `src/app/admin/resources/page.tsx`

**Features:**
- ایجاد resource
- ویرایش resource
- Delete resource
- Feature resource

### 7. Badge Management (`/admin/badges`)
**فایل:** `src/app/admin/badges/page.tsx`

**Features:**
- لیست نشان‌ها
- مشاهده دارندگان هر نشان
- Revoke badge

### 8. Analytics (`/admin/analytics`)
**فایل:** `src/app/admin/analytics/page.tsx`

**Stats:**
- User growth
- Project growth
- Activity stats
- Level distribution
- Recent activities

---

## API Routes

### 1. Auth APIs

#### `/api/auth/[...nextauth]/route.ts`
- NextAuth handler

#### `/api/auth/send-otp`
- ارسال OTP به شماره موبایل

#### `/api/auth/verify-otp`
- تایید OTP

#### `/api/auth/check-username`
- بررسی موجود بودن username

### 2. User APIs

#### `/api/user/profile`
- GET: دریافت پروفایل
- PATCH: آپدیت پروفایل

#### `/api/user/projects`
- GET: دریافت پروژه‌های کاربر
- POST: ایجاد پروژه جدید

#### `/api/user/onboarding`
- POST: تکمیل onboarding

### 3. Admin APIs

#### `/api/admin/dashboard`
- GET: دریافت آمار dashboard

#### `/api/admin/users`
- GET: دریافت لیست کاربران
- PATCH: عملیات روی کاربران

#### `/api/admin/projects`
- GET: لیست پروژه‌ها
- POST: ایجاد پروژه featured
- PATCH: عملیات روی پروژه‌ها

#### `/api/admin/challenges`
- GET: لیست چالش‌ها
- POST: ایجاد چالش
- PUT: ویرایش چالش
- PATCH: عملیات (close, mark winner)

#### `/api/admin/events`
- GET: لیست رویدادها
- POST: ایجاد رویداد
- PUT: ویرایش رویداد
- PATCH: عملیات (close, award)

#### `/api/admin/resources`
- GET: لیست منابع
- POST: ایجاد resource
- PUT: ویرایش resource
- PATCH: عملیات (feature, delete)

#### `/api/admin/badges`
- GET: لیست نشان‌ها
- PATCH: revoke badge

#### `/api/admin/analytics`
- GET: آمار جامع

### 4. Public APIs

#### `/api/members`
- GET: لیست کاربران با pagination

#### `/api/projects`
- GET: لیست پروژه‌ها با filter

#### `/api/projects/[slug]`
- GET: جزئیات پروژه
- PATCH: ویرایش پروژه

#### `/api/projects/[slug]/upvote`
- POST: upvote پروژه

#### `/api/challenges`
- GET: لیست چالش‌ها

#### `/api/challenges/[slug]`
- GET: جزئیات چالش
- POST: join challenge

#### `/api/challenges/[slug]/submit`
- POST: submit پروژه به چالش

#### `/api/events`
- GET: لیست رویدادها

#### `/api/events/[slug]`
- GET: جزئیات رویداد

#### `/api/events/[slug]/register`
- POST: ثبت‌نام در رویداد

#### `/api/resources`
- GET: لیست منابع

#### `/api/resources/[slug]`
- GET: جزئیات resource

---

## سیستم Gamification

### فایل: `src/lib/gamification.ts`

### Points Configuration
```typescript
POINTS = {
  COMPLETE_PROFILE: 50,
  ADD_FIRST_PROJECT: 100,
  JOIN_CHALLENGE: 80,
  WIN_CHALLENGE: 300,
  REGISTER_EVENT: 20,      // جدید
  ATTEND_EVENT: 50,
  SPEAK_EVENT: 200,
  PROJECT_UPVOTE: 10,
  INVITE_MEMBER: 50,
  ADD_RESOURCE: 40,
}
```

### Levels
```typescript
LEVELS = [
  { level: 1, name: "تازه‌وارد", points: 0 },
  { level: 2, name: "سازنده", points: 100 },
  { level: 3, name: "دموکننده", points: 300 },
  { level: 4, name: "فعال جامعه", points: 600 },
  { level: 5, name: "منتور", points: 1000 },
  { level: 6, name: "لیدر جامعه", points: 1500 },
]
```

### Badges (10 نشان)
1. 🚀 اولین پروژه
2. 🏆 سازنده MVP
3. ⭐ عضو فعال
4. 🥇 برنده چالش
5. 🤝 منتور جامعه
6. 🎤 سخنران رویداد
7. 🤖 متخصص AI Automation
8. 🛠️ متخصص No-code
9. 💻 متخصص Full-stack
10. 🌟 Vibe Builder

### Functions

#### `awardPoints(userId, action, points, metadata)`
Award امتیاز به کاربر و به‌روزرسانی level

#### `calculateLevel(points)`
محاسبه level بر اساس امتیاز

#### `checkAndAwardBadges(userId, points)`
بررسی و award کردن نشان‌ها

#### `bulkAwardPoints(userIds, action, points, metadata)`
Award امتیاز به چندین کاربر (برای رویدادها)

#### `awardPointsByPhoneNumbers(phoneNumbers, action, points, metadata)`
Award امتیاز به لیست دستی (بر اساس شماره موبایل)

---

## Database Schema

### Main Models

#### User
```prisma
model User {
  id                 String    @id @default(cuid())
  username           String?   @unique
  displayName        String?
  email              String?   @unique
  phone              String?   @unique
  avatarUrl          String?
  bio                String?
  skills             String[]
  github             String?
  twitter            String?
  linkedin           String?
  role               String    @default("user")
  points             Int       @default(0)
  level              Int       @default(1)
  featured           Boolean   @default(false)
  suspended          Boolean   @default(false)
  onboardingCompleted Boolean  @default(false)
  // ... relations
}
```

#### Project
```prisma
model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  imageUrl    String?
  status      String   // idea, in_progress, completed, mvp
  ownerId    String
  featured   Boolean  @default(false)
  upvotesCount Int     @default(0)
  // ... relations
}
```

#### Challenge
```prisma
model Challenge {
  id                String   @id @default(cuid())
  slug              String   @unique
  title             String
  shortDescription  String
  fullDescription   String   @db.Text
  rules             String?  @db.Text
  startDate         DateTime
  endDate           DateTime
  pointsReward      Int      @default(0)
  prize             String?
  status            String   // upcoming, active, completed
  // ... relations
}
```

#### Event
```prisma
model Event {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String   @db.Text
  type        String   // online, in_person
  date        DateTime
  time        String
  location    String?
  onlineUrl   String?
  topics      String[]
  capacity    Int?
  status      String   // upcoming, active, completed
  // ... relations
}
```

#### Resource
```prisma
model Resource {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String   @db.Text
  type        String   // prompt, ai_tool, mvp_checklist, tutorial, experience, beginner
  description String?
  tags        String[]
  authorId    String
  featured    Boolean  @default(false)
  // ... relations
}
```

#### Badge
```prisma
model Badge {
  id             String   @id @default(cuid())
  slug           String   @unique
  name           String
  nameEn         String
  description    String
  icon           String
  requiredPoints Int      @default(0)
  category       String   // achievement, skill, community
  // ... relations
}
```

---

## کامپوننت‌ها

### Admin Layout
**فایل:** `src/components/admin/DashboardLayout.tsx`

**Features:**
- Navigation sidebar
- Protected route
- Mobile responsive

### UI Components
**فایل:** `src/components/ui/`

- `button.tsx` - دکمه‌های استاندارد
- `input.tsx` - input fields استاندارد

---

## ابزارها

### Admin Auth
**فایل:** `src/lib/admin-auth.ts`

**Functions:**
- `requireAdmin()` - بررسی دسترسی admin
- `isAdmin()` - بررسی role
- `requireUser()` - بررسی login

### Admin Helpers
**فایل:** `src/lib/admin-helpers.ts`

**Functions:**
- `getDashboardStats()` - آمار dashboard
- `getLatestUsers()` - آخرین کاربران
- `suspendUser()` - suspend/unsuspend
- `changeUserRole()` - تغییر role
- `featureUser()` - featured user
- `awardEventParticipants()` - award points به شرکت‌کنندگان
- و 20+ function دیگر

### Validation
**فایل:** `src/lib/validations.ts`

**Schemas:**
- `phoneSchema` - اعتبارسنجی شماره موبایل
- `otpSchema` - اعتبارسنجی OTP

### Utils
**فایل:** `src/lib/utils.ts`

**Functions:**
- `cn()` - className merger
- Helper functions

---

## نحوه استفاده

### Award Points به شرکت‌کنندگان رویداد

#### روش ۱: از طریق API
```bash
PATCH /api/admin/events
{
  "eventId": "event_id",
  "action": "award",
  "participantType": "attended",
  "points": 50
}
```

#### روش ۲: از طریق Admin Panel
1. بروید به `/admin/events`
2. روی رویداد مورد نظر کلیک کنید
3. گزینه "Award Points" را انتخاب کنید
4. نوع شرکت‌کننده را انتخاب کنید
5. امتیاز را وارد کنید

### Award Points به لیست دستی

```bash
PATCH /api/admin/events
{
  "eventId": "event_id",
  "action": "award_manual",
  "phoneNumbers": ["989123456789", "989123456790"],
  "points": 50,
  "action": "event_attended"
}
```

---

## تغییرات اخیر

### 🆕 Event Points System (جدید)
**تاریخ:** آخرین بروزرسانی

**تغییرات:**
- ✅ اضافه شدن `REGISTER_EVENT: 20 points`
- ✅ تابع `bulkAwardPoints()` برای award به چندین کاربر
- ✅ تابع `awardPointsByPhoneNumbers()` برای لیست دستی
- ✅ Admin action "award" برای award به شرکت‌کنندگان
- ✅ Admin action "award_manual" برای لیست دستی

**فایل‌های تغییر یافته:**
- `src/lib/gamification.ts` - توابع جدید
- `src/lib/admin-helpers.ts` - helper functions
- `src/app/api/admin/events/route.ts` - API routes جدید

---

## امنیت

### Protected Routes
- `/admin/*` - فقط admin
- `/api/admin/*` - فقط admin
- `/dashboard` - نیاز به login
- `/profile/edit` - نیاز به login
- `/onboarding` - نیاز به login

### Middleware Protection
- همه protected routes بررسی می‌شوند
- Suspended users محدود می‌شوند
- Role-based access control

### Rate Limiting
- OTP attempts: 3 بار در 5 دقیقه
- OTP expiration: 5 دقیقه
- تمام OTPها hash شده

---

## نصب و راه‌اندازی

### 1. Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
SMSIR_API_KEY="..."
SMSIR_MESSAGE_ID="..."
```

### 2. Commands
```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Run development
npm run dev

# Build for production
npm run build
npm start
```

---

## خلاصه

این پروژه شامل:
- **30 صفحه** عمومی و admin
- **29 API route** برای backend
- **10 badge** مختلف
- **6 level** برای کاربران
- **Full RTL** و Persian UI
- **Mobile responsive** design
- **Secure authentication** با Google و SMS
- **Complete admin dashboard** با تمام امکانات

**وضعیت:** ✅ Production Ready

---

**برای اطلاعات بیشتر deployment:** `VERCEL_DEPLOYMENT.md`
