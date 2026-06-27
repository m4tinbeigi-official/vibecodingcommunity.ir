'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios'

type PhoneLinkStep = 'idle' | 'phone' | 'otp' | 'done'

export default function MiniAppAutoLogin() {
  const { data: session, status, update: updateSession } = useSession() as any
  const router = useRouter()
  const pathname = usePathname()
  const attempted = useRef(false)
  const phoneLinked = useRef(false)
  const dismissed = useRef(false)

  // Phone linking state
  const [inMiniApp, setInMiniApp] = useState(false)
  const [linkStep, setLinkStep] = useState<PhoneLinkStep>('idle')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Auto-login when inside Telegram / Bale ────────────────────────────────
  useEffect(() => {
    if (status === 'authenticated' || attempted.current) return

    const tg = (window as any).Telegram?.WebApp
    const bale = (window as any).Bale?.WebApp

    if (tg?.initData && tg.initData.length > 0) {
      attempted.current = true
      setInMiniApp(true)
      tg.ready()
      tg.expand()

      signIn('telegram-miniapp', { initData: tg.initData, redirect: false }).then((result) => {
        if (!result?.error) {
          if (pathname === '/dashboard') window.location.reload()
          else router.push('/dashboard')
        }
      })
      return
    }

    if (bale?.initData && bale.initData.length > 0) {
      attempted.current = true
      setInMiniApp(true)
      bale.ready?.()
      bale.expand?.()

      signIn('bale-miniapp', { initData: bale.initData, redirect: false }).then((result) => {
        if (!result?.error) {
          if (pathname === '/dashboard') window.location.reload()
          else router.push('/dashboard')
        }
      })
    }
  }, [status, pathname, router])

  // ── After login in mini-app: show phone link if no phone ─────────────────
  useEffect(() => {
    if (status !== 'authenticated') return
    // Detect mini-app context even after session refresh
    const tg = (window as any).Telegram?.WebApp
    const bale = (window as any).Bale?.WebApp
    const isMiniApp = !!(tg?.initData?.length || bale?.initData?.length)
    if (!isMiniApp) return

    setInMiniApp(true)
    // If user has no phone, prompt to link
    if (!session?.user?.phone && linkStep === 'idle' && !phoneLinked.current && !dismissed.current) {
      setLinkStep('phone')
    }
  }, [status, session?.user?.phone, linkStep])

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!phone) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/send-otp', { phone })
      if (res.data.success) {
        setLinkStep('otp')
        setCountdown(120)
      } else {
        setError(res.data.message || 'خطا در ارسال کد')
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/link-phone', { phone, otp })
      if (res.data.success) {
        phoneLinked.current = true
      await updateSession()   // refresh session so phone shows up
        setLinkStep('done')
        setTimeout(() => setLinkStep('idle'), 2000)
      } else {
        setError(res.data.error || 'خطا در تایید')
      }
    } catch (e: any) {
      setError(e.response?.data?.error || 'خطا در تایید کد')
    } finally {
      setLoading(false)
    }
  }

  // ── Render: only show UI when inside mini-app and needs phone ─────────────
  if (!inMiniApp || linkStep === 'idle') return null

  if (linkStep === 'done') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 bg-black/40">
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-semibold text-gray-800 dark:text-white">شماره تماس با موفقیت متصل شد</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 bg-black/40">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {linkStep === 'phone' ? 'اتصال شماره تماس' : 'تایید کد'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {linkStep === 'phone'
            ? 'برای اتصال حساب تلگرام به شماره تماس، شماره خود را وارد کنید'
            : `کد ۴ رقمی ارسال شده به ${phone} را وارد کنید`}
        </p>

        {error && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {linkStep === 'phone' ? (
          <>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              dir="ltr"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-center text-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { dismissed.current = true; setLinkStep('idle') }}
                className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm"
              >
                بعداً
              </button>
              <button
                onClick={handleSendOTP}
                disabled={loading || !phone}
                className="flex-1 py-3 rounded-xl bg-primary-600 text-white font-medium text-sm disabled:opacity-50"
              >
                {loading ? '...' : 'ارسال کد'}
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              dir="ltr"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-center text-2xl tracking-widest mb-4"
              maxLength={4}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 4}
              className="w-full py-3 rounded-xl bg-primary-600 text-white font-medium disabled:opacity-50 mb-3"
            >
              {loading ? '...' : 'تایید و اتصال'}
            </button>
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  ارسال مجدد تا {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </p>
              ) : (
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  ارسال مجدد کد
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
