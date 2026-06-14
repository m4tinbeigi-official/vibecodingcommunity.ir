'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Smartphone, Loader2, Send } from 'lucide-react'

declare global {
  interface Window {
    Telegram?: {
      Login: {
        auth: (callback: (data: any) => void, request: any) => void
      }
    }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPhoneInput, setShowPhoneInput] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('خطا در ورود با گوگل')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTelegramLogin = () => {
    try {
      setLoading(true)
      setError('')

      if (typeof window !== 'undefined' && window.Telegram?.Login?.auth) {
        window.Telegram.Login.auth(
          (data: any) => {
            if (data) {
              signIn('telegram', {
                callbackUrl: '/dashboard',
                authData: JSON.stringify(data)
              }).catch((err) => {
                setError('خطا در ورود با تلگرام')
                console.error(err)
                setLoading(false)
              })
            } else {
              setError('خطا در احراز هویت تلگرام')
              setLoading(false)
            }
          },
          { request_access: false }
        )
      } else {
        // Fallback: Create a form and submit
        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?22'
        script.setAttribute('data-telegram-login', 'vibe_coding_bot')
        script.setAttribute('data-size', 'large')
        script.setAttribute('data-request-access', 'write')
        script.async = true

        script.onload = () => {
          setError('لطفاً روی دکمه تلگرام کلیک کنید')
          setLoading(false)
        }

        document.body.appendChild(script)
        setError('در حال بارگذاری دکمه تلگرام...')
        setLoading(false)
      }
    } catch (error) {
      setError('خطا در ورود با تلگرام')
      console.error(error)
      setLoading(false)
    }
  }

  const handlePhoneSignIn = () => {
    setShowPhoneInput(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ورود به حساب
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              خوش آمدید! لطفاً وارد حساب خود شوید
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Options */}
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                ورود با گوگل
              </span>
            </button>

            {/* Telegram Login */}
            <button
              onClick={handleTelegramLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="font-medium">ورود با تلگرام</span>
            </button>

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

            {/* Phone Sign In */}
            <button
              onClick={handlePhoneSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">ورود با موبایل</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              حساب ندارید؟{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                ثبت‌نام کنید
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