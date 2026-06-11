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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            انجمن برنامه‌نویسی وایب
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
          >
            ورود به حساب
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            ثبت‌نام
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-right mt-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              یادگیری عملی
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              از طریق پروژه‌های واقعی و چالش‌های کدنویسی مهارت کسب کنید
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              ارتباط با دیگران
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              با برنامه‌نویسان دیگر ارتباط برقرار کنید و تجربه‌هایتان را به اشتراک بگذارید
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              رشد شغلی
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              مهارت‌های خود را تقویت کنید و فرصت‌های شغلی جدید پیدا کنید
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}