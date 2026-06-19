import Link from 'next/link'

const TELEGRAM_GROUP = 'https://t.me/+NPQiEl2kUQ5jZTRk'
const TELEGRAM_CHANNEL = 'https://t.me/vibecodersai'

type Lang = 'fa' | 'en' | 'ar'

const labels: Record<Lang, {
  brand: string
  projects: string
  events: string
  members: string
  group: string
  login: string
  register: string
}> = {
  fa: {
    brand: 'انجمن وایب کدینگ ایران',
    projects: 'پروژه‌ها',
    events: 'رویدادها',
    members: 'اعضا',
    group: 'گروه تلگرام',
    login: 'ورود',
    register: 'عضویت',
  },
  en: {
    brand: 'Vibe Coding Community',
    projects: 'Projects',
    events: 'Events',
    members: 'Members',
    group: 'Telegram Group',
    login: 'Login',
    register: 'Sign Up',
  },
  ar: {
    brand: 'مجتمع Vibe Coding',
    projects: 'المشاريع',
    events: 'الفعاليات',
    members: 'الأعضاء',
    group: 'مجموعة تلجرام',
    login: 'تسجيل الدخول',
    register: 'اشترك',
  },
}

export default function SiteHeader({ lang = 'fa' }: { lang?: Lang }) {
  const t = labels[lang] || labels.fa

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-base md:text-lg text-gray-900 dark:text-white whitespace-nowrap">
          {t.brand}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
          <Link href="/projects" className="hover:text-blue-600 transition-colors">{t.projects}</Link>
          <Link href="/events" className="hover:text-blue-600 transition-colors">{t.events}</Link>
          <Link href="/members" className="hover:text-blue-600 transition-colors">{t.members}</Link>
          <a
            href={TELEGRAM_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <span aria-hidden>✈️</span>
            {t.group}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t.login}
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t.register}
          </Link>
        </div>
      </div>
    </header>
  )
}

export { TELEGRAM_GROUP, TELEGRAM_CHANNEL }
