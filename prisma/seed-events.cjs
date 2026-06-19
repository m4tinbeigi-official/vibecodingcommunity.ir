// One-off seed: add the two community events we held (sourced from Evand).
// Idempotent via upsert on slug. Run with:
//   DATABASE_URL=... node prisma/seed-events.cjs
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const events = [
  {
    slug: 'vibecoding-meetup-tehran',
    title: 'دورهمی جامعه وایب کدینگ؛ نقطه شروع',
    description:
      'اولین دورهمی حضوری جامعه وایب کدینگ با محوریت هوش مصنوعی و برنامه‌نویسی؛ نقطه شروع مسیر ما در کنار هم. ' +
      'این رویداد در تهران برگزار شد. برای مشاهده جزئیات و بلیت‌ها به صفحه رویداد در ایوند مراجعه کنید.',
    type: 'in_person',
    date: new Date('2026-06-11T16:00:00+03:30'),
    time: '۱۶:۰۰ تا ۱۷:۳۰',
    location:
      'تهران، خیابان انقلاب، خیابان وصال شیرازی، نرسیده به طالقانی، پلاک ۶۵، طبقه اول، کافه سپید و سیاه',
    onlineUrl: 'https://evand.com/events/vibecoding',
    topics: ['هوش مصنوعی', 'وایب کدینگ', 'دورهمی'],
    speakers: [],
    status: 'completed',
  },
  {
    slug: 'vibecoding-meetup-online',
    title: 'دورهمی آنلاین جامعه وایب کدینگ؛ ادامه مسیر',
    description:
      'دومین دورهمی جامعه وایب کدینگ، این‌بار به‌صورت آنلاین؛ ادامه مسیر یادگیری و ساختن در حوزه هوش مصنوعی و برنامه‌نویسی. ' +
      'برای مشاهده جزئیات و ثبت‌نام به صفحه رویداد در ایوند مراجعه کنید.',
    type: 'online',
    date: new Date('2026-06-12T17:30:00+03:30'),
    time: '۱۷:۳۰ تا ۱۹:۰۰',
    location: null,
    onlineUrl: 'https://evand.com/events/vibecoding-online',
    topics: ['هوش مصنوعی', 'وایب کدینگ', 'آنلاین'],
    speakers: [],
    status: 'completed',
  },
]

async function main() {
  for (const e of events) {
    const { slug, ...data } = e
    await prisma.event.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    })
    console.log('upserted event:', slug)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
