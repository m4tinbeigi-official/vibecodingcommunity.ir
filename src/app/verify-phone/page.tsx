'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import axios from 'axios'

export default function VerifyPhonePage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Send OTP request
      const response = await axios.post('/api/auth/send-otp', {
        phone: phoneNumber
      })

      if (response.data.success) {
        setStep('otp')
        // Start countdown for resend (2 minutes)
        setCountdown(120)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(response.data.message || 'خطا در ارسال کد تایید')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ارسال کد تایید')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Sign in directly via NextAuth — it handles OTP verification internally
      const result = await signIn('phone-otp', {
        phone: phoneNumber,
        otp: otp,
        redirect: false
      })

      if (result?.error) {
        setError('کد تایید اشتباه یا منقضی شده است')
        return
      }

      setSuccess(true)
      // Full navigation (not router.push) so the freshly-set session cookie is
      // picked up reliably and the dashboard doesn't bounce back to /login.
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
    } catch (err: any) {
      setError('خطا در تایید کد')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/send-otp', {
        phone: phoneNumber
      })

      if (response.data.success) {
        setCountdown(120) // Reset countdown
        setError('')
      } else {
        setError(response.data.message || 'خطا در ارسال مجدد کد')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ارسال مجدد کد')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              موفقیت‌آمیز!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              شماره موبایل شما تایید شد. در حال انتقال به داشبورد...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'phone' ? 'تایید شماره موبایل' : 'کد تایید'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {step === 'phone'
                ? 'شماره موبایل خود را وارد کنید'
                : 'کد 4 رقمی ارسال شده را وارد کنید'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            /* Phone Input Form */
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="09123456789"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  'ارسال کد تایید'
                )}
              </button>
            </form>
          ) : (
            /* OTP Input Form */
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  کد تایید
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                  required
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  کد به شماره {phoneNumber} ارسال شد
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    در حال تایید...
                  </>
                ) : (
                  'تایید و ورود'
                )}
              </button>

              {/* Resend Option */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ارسال مجدد تا {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} دقیقه
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>

              {/* Change Number */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  تغییر شماره موبایل
                </button>
              </div>
            </form>
          )}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}