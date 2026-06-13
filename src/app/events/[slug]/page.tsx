'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, MapPin, Users, Video, Building2, CheckCircle2, ArrowLeft, Loader2, UserPlus, Tag, Clock } from 'lucide-react'
import axios from 'axios'
import { EVENT_TYPES, EVENT_STATUSES } from '@/lib/validations'

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    loadEvent()
  }, [slug])

  const loadEvent = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/events/${slug}`)
      setEvent(response.data)
      setRegistered(response.data.registrations?.some((r: any) => r.userId === session?.user?.id) || false)
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setRegistering(true)
    try {
      await axios.post(`/api/events/${slug}/register`)
      setRegistered(true)
      alert('ثبت‌نام با موفقیت انجام شد')
      loadEvent()
    } catch (error: any) {
      console.error('Error registering:', error)
      alert(error.response?.data?.error || 'خطا در ثبت‌نام')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            رویداد یافت نشد
          </h1>
          <button
            onClick={() => router.push('/events')}
            className="text-primary-600 hover:text-primary-700"
          >
            بازگشت به رویدادها
          </button>
        </div>
      </div>
    )
  }

  const status = EVENT_STATUSES.find(s => s.value === event.status)
  const type = EVENT_TYPES.find(t => t.value === event.type)

  const spotsLeft = event.capacity ? event.capacity - event.registeredCount : null
  const isFull = event.capacity && spotsLeft !== null && spotsLeft <= 0

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/events')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>بازگشت به رویدادها</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  event.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                  event.status === 'ongoing' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                  event.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {status?.label || event.status}
                </span>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  {event.type === 'online' ? (
                    <>
                      <Video className="w-4 h-4" />
                      <span className="text-sm">{type?.label}</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{type?.label}</span>
                    </>
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(event.date).toLocaleDateString('fa-IR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Location or Online URL */}
          {event.type === 'in_person' && event.location ? (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          ) : event.type === 'online' && event.onlineUrl && (
            <div className="mb-6">
              <a
                href={event.onlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                لینک آنلاین: {event.onlineUrl}
              </a>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              توضیحات
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Topics */}
          {event.topics && event.topics.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                موضوعات
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.topics.map((topic: string) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                سخنرانان
              </h2>
              <div className="space-y-2">
                {event.speakers.map((speaker: string) => (
                  <div key={speaker} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <UserPlus className="w-4 h-4 text-gray-500" />
                    <span>{speaker}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capacity & Registration */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="w-5 h-5" />
                <span>{event.registeredCount} ثبت‌نام</span>
              </div>
              {event.capacity && (
                <span className="text-gray-600 dark:text-gray-400">
                  / {event.capacity}
                </span>
              )}
            </div>
            {event.capacity && spotsLeft !== null && (
              <span className={`text-sm ${isFull ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {isFull ? 'ظرفیت تکمیل شده' : `${spotsLeft} جای باقی‌مانده`}
              </span>
            )}
          </div>

          {/* Register Button */}
          {event.status !== 'cancelled' && event.status !== 'completed' && (
            <div>
              {registered ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>شما در این رویداد ثبت‌نام کرده‌اید</span>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || isFull || !session}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      در حال ثبت‌نام...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      {session ? 'ثبت‌نام در رویداد' : 'ورود برای ثبت‌نام'}
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Attendees */}
        {event.registrations && event.registrations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              شرکت‌کنندگان ({event.registrations.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.registrations.map((registration: any) => (
                <div
                  key={registration.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/members/${registration.user.username}`)}
                >
                  {registration.user.avatarUrl ? (
                    <img
                      src={registration.user.avatarUrl}
                      alt={registration.user.displayName || 'Avatar'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {registration.user.displayName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {registration.user.displayName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      @{registration.user.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
