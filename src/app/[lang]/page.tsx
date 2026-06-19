import Link from 'next/link'
import { Code2, Users, Rocket, Trophy, Zap, Target, Globe, MessageCircle } from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'
import TelegramCommunity from '@/components/TelegramCommunity'

const features = [
  {
    icon: Users,
    title: { en: 'Community Driven', fa: 'مجتمع توسعه‌دهنده‌ها', ar: 'قيادة المجتمع' },
    description: {
      en: 'Connect with developers from Iran and around the world',
      fa: 'با توسعه‌دهنده‌ها از ایران و سراسر دنیا ارتباط برقرار کن',
      ar: 'تواصل مع المطورين من إيران وحول العالم'
    }
  },
  {
    icon: Rocket,
    title: { en: 'Build Together', fa: 'ساختن با هم', ar: 'البناء معًا' },
    description: {
      en: 'Collaborate on projects and turn ideas into reality',
      fa: 'روی پروژه‌ها همکاری کن و ایده‌ها رو به واقعیت تبدیل کن',
      ar: 'تعاون في المشاريع وحول الأفكار إلى واقع'
    }
  },
  {
    icon: Trophy,
    title: { en: 'Challenges & Rewards', fa: 'چالش‌ها و پاداش‌ها', ar: 'التحديات والمكافآت' },
    description: {
      en: 'Participate in coding challenges and earn badges',
      fa: 'در چالش‌های برنامه‌نویسی شرکت کن و نشان بگیر',
      ar: 'شارك في تحديات البرمجة واحصل على شارات'
    }
  },
  {
    icon: Zap,
    title: { en: 'Learn & Grow', fa: 'یادگیری و رشد', ar: 'تعلم ونمو' },
    description: {
      en: 'Access resources, tutorials, and AI tools',
      fa: 'به منابع، آموزش‌ها و ابزارهای هوش مصنوعی دسترسی داشته باش',
      ar: 'الوصول إلى الموارد والدروس وأدوات الذكاء الاصطناعي'
    }
  },
  {
    icon: Target,
    title: { en: 'Find Your Team', fa: 'تیمت رو پیدا کن', ar: 'ابحث عن فريقك' },
    description: {
      en: 'Discover teammates for your next big project',
      fa: 'هم‌تیمی برای پروژه بعدی‌ات پیدا کن',
      ar: 'ابحث عن زملائك لمشروعك القادم'
    }
  },
  {
    icon: Globe,
    title: { en: 'Go Global', fa: 'دنیا رو فتح کن', ar: 'انتشر عالميًا' },
    description: {
      en: 'Showcase your projects to the world',
      fa: 'پروژه‌هایت را به جهانیان نشان بده',
      ar: 'اعرض مشاريعك للعالم'
    }
  }
]

const stats = [
  { value: '700+', label: { en: 'Developers', fa: 'توسعه‌دهنده', ar: 'مطور' } },
  { value: '100+', label: { en: 'Projects', fa: 'پروژه', ar: 'مشروع' } },
  { value: '20+', label: { en: 'Challenges', fa: 'چالش', ar: 'تحدي' } },
  { value: '50+', label: { en: 'Resources', fa: 'منبع', ar: 'مورد' } }
]

export default function HomePage({ params }: { params: { lang: string } }) {
  const isRTL = ['fa', 'ar'].includes(params.lang)

  const t = (key: 'title' | 'description', obj: any) => {
    return obj[params.lang] || obj.en
  }

  const lang = (['fa', 'en', 'ar'].includes(params.lang) ? params.lang : 'fa') as 'fa' | 'en' | 'ar'

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium">
              <Zap className="w-4 h-4" />
              {isRTL ? 'انجمن توسعه‌دهنده‌های ایران' : 'Iran Developer Community'}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500">
                Vibe Coding
              </span>
              <span className="block text-slate-900 dark:text-white mt-2">
                {params.lang === 'fa' ? 'کامیونیتی' : params.lang === 'ar' ? 'مجتمع' : 'Community'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {params.lang === 'fa'
                ? 'جایی برای توسعه‌دهنده‌ها که با هم کد بزنن، پروژه بسازن و ویب بگیرن 🚀'
                : params.lang === 'ar'
                ? 'مكان للمطورين للبرمجة معًا وبناء المشاريع والاستمتاع 🚀'
                : 'Where developers code together, build projects, and vibe 🚀'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={`/${params.lang}/auth/signup`}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl hover:from-primary-600 hover:to-purple-700 transition-all font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transform"
              >
                {isRTL ? 'شروع کن - رایگان' : 'Get Started - Free'}
              </Link>
              <Link
                href={`/${params.lang}/projects`}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all font-medium hover:-translate-y-0.5 transform"
              >
                {isRTL ? 'پروژه‌ها رو ببین' : 'Explore Projects'}
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-4 justify-center text-sm">
              <Link href="/en" className={`px-4 py-2 rounded-lg transition-colors ${params.lang === 'en' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:text-primary-500'}`}>
                English
              </Link>
              <Link href="/fa" className={`px-4 py-2 rounded-lg transition-colors ${params.lang === 'fa' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:text-primary-500'}`}>
                فارسی
              </Link>
              <Link href="/ar" className={`px-4 py-2 rounded-lg transition-colors ${params.lang === 'ar' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:text-primary-500'}`}>
                العربية
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600">
                  {stat.value}
                </div>
                <div className="mt-2 text-slate-600 dark:text-slate-400">
                  {stat.label[params.lang as 'en' | 'fa' | 'ar'] || stat.label.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {params.lang === 'fa' ? 'چرا Vibe Coding؟' : params.lang === 'ar' ? 'لماذا Vibe Coding؟' : 'Why Vibe Coding?'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {params.lang === 'fa'
                ? 'بیشتر از یک انجمن - یک خانواده برای توسعه‌دهنده‌ها'
                : params.lang === 'ar'
                ? 'أكثر من مجتمع - عائلة للمطورين'
                : 'More than a community - a family for developers'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {t('title', feature.title)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t('description', feature.description)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {params.lang === 'fa'
              ? 'آماده‌ای به جمعمون بپیونی؟'
              : params.lang === 'ar'
              ? 'هل أنت مستعد للانضمام إلينا؟'
              : 'Ready to join us?'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {params.lang === 'fa'
              ? 'همین الان ثبت‌نام کن و شروع کن به ویب گرفتن!'
              : params.lang === 'ar'
              ? 'سجل الآن وابدأ في الاستمتاع!'
              : 'Sign up now and start vibing!'}
          </p>
          <Link
            href={`/${params.lang}/auth/signup`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-slate-100 transition-colors font-medium"
          >
            {isRTL ? 'ثبت‌نام رایگان' : 'Sign Up Free'}
            <Rocket className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Telegram Community */}
      <TelegramCommunity lang={lang} />
    </main>
  )
}
