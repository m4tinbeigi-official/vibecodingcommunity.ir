'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react'
import axios from 'axios'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  // Only the essential basic info is collected at sign-up. Everything else
  // (field, experience, tools, goals, links...) is filled later from the
  // "complete profile" page so registration stays short.
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    username: '',
    city: '',
    bio: '',
  })

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const response = await axios.get(`/api/auth/check-username?username=${username}`)
      setUsernameAvailable(response.data.available)
    } catch (error) {
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setData({ ...data, username: value })
    if (value.length >= 3) {
      checkUsernameAvailability(value)
    } else {
      setUsernameAvailable(null)
    }
  }

  const handleSubmit = async () => {
    if (!data.firstName || !data.lastName || !data.displayName ||
        !data.username || usernameAvailable === false) {
      setError('لطفاً تمام فیلدهای الزامی را پر کنید')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await axios.post('/api/user/onboarding', {
        step: 1,
        data,
        completed: true,
      })

      if (response.data.success) {
        setCompleted(true)
        setTimeout(() => {
          // Ask about attendance at our past events before the dashboard.
          router.push('/past-events')
        }, 1500)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در ثبت اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              خوش آمدید! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              حساب شما ساخته شد. در حال انتقال...
            </p>
          </div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-right">
            یک قدم تا عضویت 🚀
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-right">
            فقط چند فیلد ضروری را پر کنید؛ بقیه اطلاعات را بعداً از پروفایل تکمیل می‌کنید.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-right">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  نام *
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => setData({ ...data, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  نام خانوادگی *
                </label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => setData({ ...data, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                نام نمایشی *
              </label>
              <input
                type="text"
                value={data.displayName}
                onChange={(e) => setData({ ...data, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                نام کاربری *
              </label>
              <input
                type="text"
                value={data.username}
                onChange={handleUsernameChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right ${
                  usernameAvailable === false ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="مثال: ahmad_rezaei"
                required
              />
              {checkingUsername && (
                <p className="text-xs text-gray-500 mt-1 text-right">در حال بررسی...</p>
              )}
              {usernameAvailable === true && (
                <p className="text-xs text-green-600 mt-1 text-right">این نام کاربری آزاد است ✓</p>
              )}
              {usernameAvailable === false && (
                <p className="text-xs text-red-600 mt-1 text-right">این نام کاربری قبلاً گرفته شده است</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                شهر (اختیاری)
              </label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                بیوگرافی کوتاه (اختیاری)
              </label>
              <textarea
                value={data.bio}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{data.bio.length}/500</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
            <Sparkles className="w-4 h-4" />
            <span>بعد از ورود، با تکمیل پروفایل ۵۰ امتیاز هدیه بگیرید.</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>ورود به جامعه</span>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
