# Vibe Coding Community - Phase 1 Setup

## نصب و راه‌اندازی

### ۱. نصب وابستگی‌ها
```bash
npm install
```

### ۲. تنظیم Environment Variables
فایل `.env` را در ریشه پروژه ایجاد کنید و مقادیر زیر را پر کنید:

```env
# Database
DATABASE_URL=postgresql://vibeuser:PASSWORD@db:5432/vibecommunity

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# SMS.ir
SMSIR_API_KEY=your-smsir-api-key
SMSIR_MESSAGE_ID=your-smsir-message-id

# App Config
NODE_ENV=development
```

### ۳. راه‌اندازی Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### ۴. اجرای پروژه
```bash
npm run dev
```

پروژه در آدرس `http://localhost:3000` در دسترس خواهد بود.

## ویژگی‌های پیاده‌سازی شده در Phase 1

### ✅ احراز هویت
- **Google Login**: ورود با حساب گوگل
- **Phone OTP**: ارسال و تایید کد تایید SMS
- **Rate Limiting**: محدودیت تعداد تلاش برای OTP
- **Session Management**: مدیریت جلسات کاربری

### ✅ صفحات
- **Homepage**: صفحه اصلی معرفی
- **Login**: صفحه ورود
- **Register**: صفحه ثبت‌نام
- **Verify Phone**: تایید شماره موبایل
- **Dashboard**: داشبورد محافظت شده

### ✅ Security
- **OTP Hashing**: رمزنگاری کدهای تایید
- **Rate Limiting**: محدودیت درخواست‌ها
- **OTP Expiration**: انقضای کدهای تایید
- **Protected Routes**: مسیرهای محافظت شده

## نحوه کار Google Login

1. کاربر روی "ورود با گوگل" کلیک می‌کند
2. به صفحه احراز هویت گوگل هدایت می‌شود
3. پس از تایید، گوگل اطلاعات کاربر را برمی‌گرداند
4. NextAuth کاربر را در دیتابیس ذخیره/به‌روز می‌کند
5. Session ایجاد شده و کاربر به داشبورد هدایت می‌شود

## نحوه کار Phone OTP Login

1. کاربر شماره موبایل خود را وارد می‌کند
2. سرور یک کد 4 رقمی تولید می‌کند
3. کد با bcrypt هش می‌شود
4. هش در دیتابیس ذخیره می‌شود
5. SMS.ir پیامک ارسال می‌کند (در محیط development، کد در console چاپ می‌شود)
6. کاربر کد را وارد می‌کند
7. سرور کد را با هش مقایسه می‌کند
8. در صورت صحیح بودن، کاربر ایجاد/به‌روزرسانی می‌شود

## تنظیمات SMS.ir

برای استفاده از SMS.ir:

1. در [sms.ir](https://sms.ir) ثبت‌نام کنید
2. API Key را از پنل کاربری دریافت کنید
3. یک پیامک تپلیت (Template) بسازید با پارامتر `OTP`
4. Message ID را در env متغیر `SMSIR_MESSAGE_ID` قرار دهید
5. API Key را در `SMSIR_API_KEY` قرار دهید

## چیزهایی که Mock یا ناقص هستند

### 🔲 Mock
- **Dashboard Content**: محتوای داشبورد فعلاً placeholder است
- **SMS sending در Development**: در محیط development، SMS واقعی ارسال نمی‌شود و کد در console چاپ می‌شود

### 🔲 ناقص
- **Onboarding Flow**: flow کامل onboarding پیاده‌سازی نشده
- **User Profile Edit**: ویرایش پروفایل کاربر
- **Admin Panel**: پنل مدیریت
- **گزارش‌گیری و Analytics**: آمار و گزارش‌ها

## فازهای بعدی

**Phase 2**: User Profiles, Onboarding, Member Directory
**Phase 3**: Projects, Challenges, Gamification
**Phase 4**: Events, Resources, Community Features
**Phase 5**: Admin Panel, Analytics, Advanced Features

## رفع اشکال

### خطای Database Connection
```bash
# مطمئن شوید PostgreSQL در حال اجرا است
docker-compose up -d db

# یا از Prisma Migrate استفاده کنید
npx prisma migrate dev --name init
```

### خطای Google OAuth
- مطمئن شوید Redirect URL در Google Console صحیح است
- `NEXTAUTH_URL` باید با URL پروژه مطابقت داشته باشد

### خطای SMS.ir
- API Key و Message ID را بررسی کنید
- موجودی حساب SMS.ir خود را چک کنید
- Template باید با پارامتر `OTP` ساخته شده باشد

## امنیت

⚠️ **نکات مهم امنیتی**:
- هرگز `.env` را در git commit نکنید
- `NEXTAUTH_SECRET` را با `openssl rand -base64 32` تولید کنید
- در production، از HTTPS استفاده کنید
- به‌روزرسانی‌های امنیتی را نصب کنید

## تکنولوژی‌ها استفاده شده

- **Next.js 14**: React Framework
- **TypeScript**: Type Safety
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **NextAuth.js**: Authentication
- **Tailwind CSS**: Styling
- **Vazirmatn**: Persian Font
- **SMS.ir**: SMS Service