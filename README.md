# Vibe Coding Community

🎯 **انجمن برنامه‌نویسان ایران - پلتفرم کامل برای جامعه برنامه‌نویسی**

---

## 🚀 پروژه چیست؟

یک پلتفرم وب کامل برای جامعه برنامه‌نویسان که شامل:

- ✅ **احراز هویت** با Google OAuth و SMS OTP
- ✅ **سیستم gamification** (امتیاز، سطوح، نشان‌ها)
- ✅ **مدیریت پروژه‌ها** و چالش‌های کدنویسی
- ✅ **رویدادها** و ثبت‌نام آنلاین/حضوری
- ✅ **اشتراک‌گذاری منابع** و پرامپت‌ها
- ✅ **داشبورد ادمین** جامع
- ✅ **Mobile responsive** و RTL

---

## 📚 داکیومنت

برای شروع، به **[DOCS_INDEX.md](./DOCS_INDEX.md)** بروید.

### داکیومنت‌های اصلی:

| فایل | توضیح |
|------|-------|
| **[DOCS_INDEX.md](./DOCS_INDEX.md)** | راهنمای سریع داکیومنت |
| **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** | داکیومنت کامل پروژه |
| **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** | خلاصه نهایی و status |
| **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** | راهنمای deployment |

---

## 🛠️ تکنولوژی‌ها

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hooks**

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**

### Auth
- **NextAuth.js**
- **Google OAuth**
- **SMS.ir OTP**

---

## 📊 آمار پروژه

- **30 صفحه** عمومی و admin
- **29 API route** برای backend
- **10 badge** مختلف
- **6 level** کاربری
- **Full Persian UI** و RTL
- **Production Ready** ✅

---

## 🎯 نحوه شروع

### 1. نصب dependencyها
```bash
npm install
```

### 2. تنظیم environment variables
```bash
cp .env.example .env
# .env را با مقادیر واقعی پر کنید
```

### 3. Setup database
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. اجرا
```bash
npm run dev
```

سپس به `http://localhost:3000` بروید.

---

## 🌐 Deployment

برای deployment به **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** مراجعه کنید.

**پلتفرم‌های پشتیبانی شده:**
- Vercel (توصیه می‌شود)
- Docker
- سرور Linux با Caddy

---

## 🎨 صفحات اصلی

### عمومی
- `/` - صفحه اصلی
- `/login` - ورود
- `/register` - ثبت‌نام
- `/members` - اعضای جامعه
- `/projects` - پروژه‌ها
- `/challenges` - چالش‌ها
- `/events` - رویدادها
- `/resources` - منابع

### کاربری
- `/dashboard` - داشبورد شخصی
- `/profile/edit` - ویرایش پروفایل
- `/onboarding` - راهنمای شروع

### ادمین
- `/admin` - داشبورد ادمین
- `/admin/users` - مدیریت کاربران
- `/admin/projects` - مدیریت پروژه‌ها
- `/admin/challenges` - مدیریت چالش‌ها
- `/admin/events` - مدیریت رویدادها
- `/admin/badges` - مدیریت نشان‌ها
- `/admin/analytics` - آمار و تحلیل

---

## 🏆 سیستم Gamification

### Points (امتیاز)
- تکمیل پروفایل: 50
- اولین پروژه: 100
- شرکت در چالش: 80
- برنده چالش: 300
- ثبت‌نام رویداد: 20
- شرکت در رویداد: 50
- سخنرانی: 200
- و...

### Levels (سطوح)
1. تازه‌وارد (0 points)
2. سازنده (100 points)
3. دموکننده (300 points)
4. فعال جامعه (600 points)
5. منتور (1000 points)
6. لیدر جامعه (1500 points)

### Badges (نشان‌ها)
- 🚀 اولین پروژه
- 🏆 سازنده MVP
- ⭐ عضو فعال
- 🥇 برنده چالش
- و... 10 نشان مختلف

---

## 🔒 امنیت

- ✅ JWT sessions
- ✅ Hashed OTPs
- ✅ Rate limiting
- ✅ Admin route protection
- ✅ Suspended user checks
- ✅ Role-based access control
- ✅ Input validation

---

## 📱 ویژگی‌ها

### ✅ کامل شده
- Google + SMS authentication
- Gamification system
- Admin dashboard
- Project management
- Event management
- Resource sharing
- Badge system
- Analytics

### ⚠️ Placeholder
- Stats numbers روی homepage
- Sample screenshots

---

## 📞 Support

برای سوالات یا مشکلات:
1. به [DOCS_INDEX.md](./DOCS_INDEX.md) بروید
2. [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) را مطالعه کنید
3. Issues در GitHub

---

## 📄 License

این پروژه برای جامعه برنامه‌نویسان ایران ساخته شده است.

---

**ساخته شده با ❤️ برای جامعه برنامه‌نویسان**

برای جزئیات بیشتر: **[DOCS_INDEX.md](./DOCS_INDEX.md)**
