'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, CheckCircle, Calendar, MapPin, Video, Building2 } from 'lucide-react'
import axios from 'axios'

type SurveyEvent = {
  id: string
  slug: string
  title: string
  date: string
  type: string
  location: string | null
  attended: boolean
}

export default function PastEventsSurveyPage() {
  const router = useRouter()
  const { status } = useSession()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [events, setEvents] = useState<SurveyEvent[]>([])
  // answers[eventId] = true (attended) | false (did not) | undefined (not answered yet)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/user/past-events')
      const list: SurveyEvent[] = res.data.events || []
      // If there's nothing to ask, or already answered, skip straight to dashboard.
      if (res.data.answered || list.length === 0) {
        router.push('/dashboard')
        return
      }
      setEvents(list)
      const initial: Record<string, boolean> = {}
      list.forEach(e => {
        if (e.attended) initial[e.id] = true
      })
      setAnswers(initial)
    } catch (err) {
      console.error('Error loading past events:', err)
      setError('خطا در بارگذاری رویدادها')
    } finally {
      setLoading(false)
    }
  }

  const setAnswer = (eventId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [eventId]: value }))
  }

  const allAnswered = events.length > 0 && events.every(e => answers[e.id] !== undefined)

  const submit = async () => {
    if (!allAnswered) {
      setError('لطفاً برای هر رویداد یک گزینه را انتخاب کنید')
      return
    }
    setSaving(true)
    setError('')
    try {
      await axios.post('/api/user/past-events', { answers })
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err) {
      console.error('Error saving past events:', err)
      setError('خطا در ثبت پاسخ‌ها')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-xl text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ممنون از پاسخ شما!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            در حال انتقال به داشبورد...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            رویدادهای گذشته جامعه
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ما تا کنون دو رویداد برگزار کرده‌ایم. لطفاً برای هر رویداد جداگانه مشخص کنید
            که آیا در آن شرکت کرده‌اید یا خیر.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                  رویداد {index + 1} از {events.length}
                </span>
                <span className="flex items-center gap-1">
                  {event.type === 'online' ? (
                    <>
                      <Video className="w-3.5 h-3.5" /> آنلاین
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5" /> حضوری
                    </>
                  )}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString('fa-IR')}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                آیا در این رویداد شرکت کردید؟
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAnswer(event.id, true)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                    answers[event.id] === true
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-300'
                  }`}
                >
                  بله، شرکت کردم
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer(event.id, false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                    answers[event.id] === false
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                  }`}
                >
                  خیر، شرکت نکردم
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={submit}
            disabled={saving || !allAnswered}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>ثبت پاسخ‌ها</span>
          </button>
        </div>
      </div>
    </div>
  )
}
