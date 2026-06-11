'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User, LogOut, Settings, Bell } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              داشبورد
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              خوش آمدید، {session.user.name || 'کاربر'}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <Bell className="w-6 h-6" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <Settings className="w-6 h-6" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              title="خروج"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {session.user.name || 'کاربر'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {session.user.email || session.user.phone || 'ایمیل یا شماره موبایل'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                سطح دسترسی: {session.user.role === 'admin' ? 'مدیر' : 'کاربر'}
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            به انجمن برنامه‌نویسی وایب خوش آمدید!
          </h2>
          <p className="text-primary-100 mb-4">
            اینجا می‌توانید با برنامه‌نویسان دیگر ارتباط برقرار کنید، پروژه‌های خود را به اشتراک بگذارید و مهارت‌های خود را تقویت کنید.
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
              مشاهده پروژه‌ها
            </button>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium">
              شروع پروژه جدید
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              پروژه‌های من
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              پروژه فعال
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              چالش‌ها
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              چالش تکمیل شده
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              امتیاز
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              امتیاز کل
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              در حال ساخت
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              قابلیت‌های بیشتر به زودی اضافه خواهند شد
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}