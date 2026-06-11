import Link from 'next/link'

export default function HomePage({ params }: { params: { lang: string } }) {
  const isRTL = ['fa', 'ar'].includes(params.lang)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600">
          Vibe Coding Community
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300">
          {params.lang === 'fa'
            ? 'جایی برای توسعه‌دهنده‌ها که با هم کد بزنن و ویب بگیرن'
            : params.lang === 'ar'
            ? 'مكان للمطورين للبرمجة معًا والاستمتاع'
            : 'A place for developers to code together and vibe'}
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href={`/${params.lang}/auth/signin`}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            {isRTL ? 'ورود' : 'Sign In'}
          </Link>
          <Link
            href={`/${params.lang}/auth/signup`}
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            {isRTL ? 'ثبت‌نام' : 'Sign Up'}
          </Link>
        </div>

        <div className="flex gap-2 justify-center text-sm">
          <Link href="/en" className="text-slate-500 hover:text-primary-500">
            English
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/fa" className="text-slate-500 hover:text-primary-500">
            فارسی
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/ar" className="text-slate-500 hover:text-primary-500">
            العربية
          </Link>
        </div>
      </div>
    </main>
  )
}
