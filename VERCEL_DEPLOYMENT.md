# راهنمای Deployment - Vibe Coding Community

## 📋 فهرست مطالب

1. [پیش‌نیازها](#پیش‌نیازها)
2. [راه‌اندازی محیط محلی](#راه‌اندازی-محیط-محلی)
3. [تنظیمات محیطی](#تنظیمات-محیطی)
4. [Deployment به Vercel](#deployment-به-vercel)
5. [چک‌لیست تولید](#چک‌لیست-تولید)

## 🚀 پیش‌نیازها

- Node.js 18+ و npm
- PostgreSQL database (Supabase، Neon، یا Railway)
- حساب Google OAuth
- حساب SMS.ir (برای ارسال OTP)
- حساب Vercel (برای deployment)

## 💻 راه‌اندازی محلی

### 1. کلون کردن پروژه

```bash
git clone <your-repo-url>
cd vibecommunity
```

### 2. نصب dependencyها

```bash
npm install
```

### 3. تنظیم environment variables

فایل `.env.example` را به `.env` کپی کنید و مقادیر را پر کنید:

```bash
cp .env.example .env
```

### 4. تنظیم database

```bash
# ایجاد Prisma client
npx prisma generate

# اجرای migrationها
npx prisma migrate dev

# (اختیاری) Seeding database
npx prisma db seed
```

### 5. اجرای پروژه

```bash
# Development mode
npm run dev

# Production build test
npm run build
npm start
```

پروژه در `http://localhost:3000` در دسترس خواهد بود.

## ⚙️ تنظیمات محیطی

### Environment Variables مورد نیاز

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# SMS.ir
SMSIR_API_KEY="your-smsir-api-key"
SMSIR_MESSAGE_ID="your-smsir-message-id"

# (اختیاری) Production URLs
NEXTAUTH_URL="https://yourdomain.com"
APP_URL="https://yourdomain.com"
```

### به‌دست آوردن Google OAuth Credentials

1. به [Google Console](https://console.cloud.google.com/) بروید
2. یک پروژه جدید بسازید یا پروژه موجود را انتخاب کنید
3. Google+ API را فعال کنید
4. به صفحه "Credentials" بروید
5. "OAuth 2.0 Client IDs" را ایجاد کنید
6. Application type: "Web application"
7. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### به‌دست آوردن SMS.ir Credentials

1. به [SMS.ir](https://sms.ir/) بروید و ثبت‌نام کنید
2. از پنل کاربری، API Key را کپی کنید
3. یک پیامک OTP در پنل ایجاد کنید و Message ID را کپی کنید

## 🌐 Deployment به Vercel

### 1. آماده‌سازی پروژه

```bash
# Build test محلی
npm run build

# اگر خطایی نداشت، آماده deployment است
```

### 2. اتصال به Vercel

```bash
# نصب Vercel CLI
npm i -g vercel

# Login به Vercel
vercel login

# Deploy اولیه
vercel
```

### 3. تنظیم Environment Variables در Vercel

از طریق Vercel Dashboard:

1. پروژه را باز کنید
2. به Settings > Environment Variables بروید
3. همه متغیرهای محیطی را اضافه کنید:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SMSIR_API_KEY`
   - `SMSIR_MESSAGE_ID`

### 4. تنظیم Database برای Production

```bash
# Production database URL را تنظیم کنید
export DATABASE_URL="your-production-database-url"

# Production migration
npx prisma migrate deploy

# Prisma client را بازسازی کنید
npx prisma generate
```

### 5. Deploy نهایی

```bash
# Deploy به production
vercel --prod
```

## 🔒 چک‌لیست تولید

### قبل از Deploy

- [ ] همه environment variables تنظیم شده‌اند
- [ ] Database در production آماده است
- [ ] Google OAuth redirect URIs صحیح هستند
- [ ] SMS.ir API key و Message ID صحیح هستند
- [ ] `NEXTAUTH_SECRET` یک رشته تصادفی قوی است
- [ ] Build بدون خطا کامل می‌شود: `npm run build`

### بعد از Deploy

- [ ] صفحه اصلی بارگذاری می‌شود
- [ ] Login با Google کار می‌کند
- [ ] Login با شماره موبایل کار می‌کند
- [ ] OTP ارسال می‌شود
- [ ] Dashboard در دسترس است
- [ ] Admin routes محافظت می‌شوند
- [ ] Mobile responsive کار می‌کند
- [ ] RTL layout صحیح است
- [ ] Persian text درست نمایش داده می‌شود

### تست Security

- [ ] `/admin` بدون login به `/login` redirect می‌شود
- [ ] `/api/admin/*` بدون auth 401 برمی‌گرداند
- [ ] Normal users نمی‌توانند به admin routes دسترسی داشته باشند
- [ ] Suspended users نمی‌توانند action انجام دهند
- [ ] Phone numbers و emails private هستند
- [ ] Rate limiting برای OTP وجود دارد
- [ ] OTPها expire می‌شوند

### Performance Check

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 5s
- [ ] Bundle size مناسب است
- [ ] Images optimized هستند

## 🐛 Troubleshooting

### Migration Problems

```bash
# اگر migration fail شود
npx prisma migrate reset --force

# یا manually
npx prisma db push
```

### Build Errors

```bash
# Clean build
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection

```bash
# Test connection
npx prisma db push

# View database
npx prisma studio
```

### SMS.ir Issues

- API Key را چک کنید
- Message ID را در پنل SMS.ir بررسی کنید
- شماره موبایل باید با 98 شروع شود (مثال: 989123456789)

## 📊 Monitoring بعد از Deploy

- [ ] Vercel Analytics را فعال کنید
- [ ] Error logging (مثل Sentry) را تنظیم کنید
- [ ] Database backup را فعال کنید
- [ ] Uptime monitoring را تنظیم کنید
- [ ] Admin action logs را مرتب بررسی کنید

## 🔄 به‌روزرسانی بعد از Deploy

```bash
# آخرین changes
git pull

# Dependencyهای جدید
npm install

# Migrationهای جدید
npx prisma migrate deploy

# Redeploy
vercel --prod
```

---

**سوالات؟** با تیم توسعه تماس بگیرید یا یک Issue در GitHub ایجاد کنید.

**موفق باشید! 🚀**
