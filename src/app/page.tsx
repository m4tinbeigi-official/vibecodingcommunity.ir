'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="text-center space-y-8 max-w-4xl w-full">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              انجمن برنامه‌نویسی وایب
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">+۵۰۰</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">برنامه‌نویس</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">+۲۰۰</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">پروژه</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">+۵۰</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">چالش</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ورود به حساب
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            ثبت‌نام رایگان
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-right mt-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              یادگیری عملی
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              از طریق پروژه‌های واقعی و چالش‌های کدنویسی مهارت کسب کنید
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              ارتباط با دیگران
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              با برنامه‌نویسان دیگر ارتباط برقرار کنید و تجربه‌هایتان را به اشتراک بگذارید
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              رشد شغلی
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              مهارت‌های خود را تقویت کنید و فرصت‌های شغلی جدید پیدا کنید
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            چطور شروع کنم؟
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 dark:text-blue-400 font-bold">۱.</div>
              <div>ثبت‌نام کنید و پروفایل خود را تکمیل کنید</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="text-blue-600 dark:text-blue-400 font-bold">۲.</div>
              <div>در چالش‌ها شرکت کنید و پروژه بسازید</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="text-blue-600 dark:text-blue-400 font-bold">۳.</div>
              <div>با دیگران ارتباط برقرار کنید و رشد کنید</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}