'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Smartphone } from 'lucide-react'
import TelegramLoginButton from '@/components/TelegramLoginButton'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneRegister = () => {
    router.push('/verify-phone')
  }

  const handleGoogleRegister = async () => {
    try {
      setLoading(true)
      setError('')
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('خطا در ثبت‌نام با گوگل')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ایجاد حساب جدید
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              به انجمن وایب کدینگ ایران بپیوندید
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Registration Options */}
          <div className="space-y-4">
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                ثبت‌نام با گوگل
              </span>
            </button>

            {/* Telegram Registration */}
            <TelegramLoginButton onError={setError} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  یا
                </span>
              </div>
            </div>

            {/* Phone Registration */}
            <button
              onClick={handlePhoneRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">ثبت‌نام با موبایل</span>
            </button>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              با ثبت‌نام، شما با{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">
                قوانین و مقررات
              </Link>{' '}
              انجمن موافق هستید
            </p>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}