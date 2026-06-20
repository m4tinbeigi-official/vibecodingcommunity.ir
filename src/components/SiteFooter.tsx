import Link from 'next/link'
import { TELEGRAM_GROUP, TELEGRAM_CHANNEL } from './SiteHeader'

type Lang = 'fa' | 'en' | 'ar'

const labels: Record<Lang, {
  tagline: string
  projects: string
  events: string
  members: string
  resources: string
  group: string
  channel: string
  poweredBy: string
  brand: string
}> = {
  fa: {
    tagline: 'انجمن وایب کدینگ ایران',
    projects: 'پروژه‌ها',
    events: 'رویدادها',
    members: 'اعضا',
    resources: 'منابع',
    group: 'گروه تلگرام',
    channel: 'کانال تلگرام',
    poweredBy: 'قدرت‌گرفته از',
    brand: 'نقطه',
  },
  en: {
    tagline: 'Vibe Coding Community',
    projects: 'Projects',
    events: 'Events',
    members: 'Members',
    resources: 'Resources',
    group: 'Telegram Group',
    channel: 'Telegram Channel',
    poweredBy: 'Powered by',
    brand: 'Noqte',
  },
  ar: {
    tagline: 'مجتمع Vibe Coding',
    projects: 'المشاريع',
    events: 'الفعاليات',
    members: 'الأعضاء',
    resources: 'الموارد',
    group: 'مجموعة تلجرام',
    channel: 'قناة تلجرام',
    poweredBy: 'مشغّل بواسطة',
    brand: 'Noqte',
  },
}

export default function SiteFooter({ lang = 'fa' }: { lang?: Lang }) {
  const t = labels[lang] || labels.fa

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="font-bold text-gray-900 dark:text-white">
            {t.tagline}
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <Link href="/projects" className="hover:text-blue-600 transition-colors">{t.projects}</Link>
            <Link href="/events" className="hover:text-blue-600 transition-colors">{t.events}</Link>
            <Link href="/members" className="hover:text-blue-600 transition-colors">{t.members}</Link>
            <Link href="/resources" className="hover:text-blue-600 transition-colors">{t.resources}</Link>
            <a href={TELEGRAM_GROUP} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">{t.group}</a>
            <a href={TELEGRAM_CHANNEL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">{t.channel}</a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} {t.tagline}</span>
          <span>
            {t.poweredBy}{' '}
            <a
              href="https://noqte.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {t.brand}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
