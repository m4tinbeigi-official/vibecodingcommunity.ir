import { TELEGRAM_GROUP, TELEGRAM_CHANNEL } from './SiteHeader'

type Lang = 'fa' | 'en' | 'ar'

const content: Record<Lang, {
  badge: string
  title: string
  desc: string
  group: string
  channel: string
}> = {
  fa: {
    badge: 'گروه ۷۰۰ نفره و در حال رشد',
    title: 'به جمع تلگرامی ما بپیوند',
    desc: 'بیش از ۷۰۰ برنامه‌نویس و علاقه‌مند هوش مصنوعی هر روز در گروه تلگرامی ما گفتگو می‌کنند، سؤال می‌پرسند و پروژه می‌سازند. اخبار و آموزش‌ها هم در کانال منتشر می‌شود.',
    group: 'عضویت در گروه تلگرام',
    channel: 'دنبال‌کردن کانال',
  },
  en: {
    badge: '700+ members and growing',
    title: 'Join our Telegram community',
    desc: 'More than 700 developers and AI enthusiasts chat, ask questions, and build projects every day in our Telegram group. News and tutorials are posted on the channel.',
    group: 'Join Telegram Group',
    channel: 'Follow Channel',
  },
  ar: {
    badge: 'أكثر من ٧٠٠ عضو وفي تزايد',
    title: 'انضم إلى مجتمعنا على تلجرام',
    desc: 'أكثر من ٧٠٠ مطور ومهتم بالذكاء الاصطناعي يتحدثون ويطرحون الأسئلة ويبنون المشاريع كل يوم في مجموعتنا على تلجرام. تُنشر الأخبار والدروس على القناة.',
    group: 'انضم إلى المجموعة',
    channel: 'تابع القناة',
  },
}

export default function TelegramCommunity({ lang = 'fa' }: { lang?: Lang }) {
  const t = content[lang] || content.fa

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-8 md:p-12 text-center text-white shadow-xl">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-5">
          <span aria-hidden>✈️</span>
          {t.badge}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{t.title}</h2>
        <p className="text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={TELEGRAM_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
          >
            {t.group}
          </a>
          <a
            href={TELEGRAM_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-700/40 text-white border border-white/40 rounded-lg font-medium hover:bg-blue-700/60 transition-colors"
          >
            {t.channel}
          </a>
        </div>
      </div>
    </section>
  )
}
