'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users, Video, Building2, Filter } from 'lucide-react'
import axios from 'axios'
import { EVENT_TYPES, EVENT_STATUSES } from '@/lib/validations'

export default function EventsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    loadEvents()
  }, [typeFilter, statusFilter, sort])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
        sort,
      })

      const response = await axios.get(`/api/events?${params}`)
      setEvents(response.data.events)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const s = EVENT_STATUSES.find(x => x.value === status)
    return s?.label || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      case 'ongoing':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            رویدادها
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            در رویدادها شرکت کنید و با جامعه آشنا شوید
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                فیلتر:
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter('')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setTypeFilter('online')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === 'online'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                آنلاین
              </button>
              <button
                onClick={() => setTypeFilter('in_person')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === 'in_person'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                حضوری
              </button>
            </div>

            <div className="flex items-center gap-2 mr-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مرتب‌سازی:
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">جدیدترین</option>
                <option value="date">تاریخ برگزاری</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              رویدادی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              به زودی رویدادهای جدید اضافه خواهند شد
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>

                {/* Type */}
                <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
                  {event.type === 'online' ? (
                    <>
                      <Video className="w-4 h-4" />
                      <span className="text-sm">آنلاین</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">حضوری</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {event.description.slice(0, 150)}...
                </p>

                {/* Date & Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('fa-IR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">ساعت:</span>
                    <span>{event.time}</span>
                  </div>
                  {event.type === 'in_person' && event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{event.registeredCount} ثبت‌نام</span>
                  </div>
                  {event.capacity && (
                    <span className="text-gray-600 dark:text-gray-400">
                      / {event.capacity}
                    </span>
                  )}
                </div>

                {/* View Button */}
                <Link
                  href={`/events/${event.slug}`}
                  className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  مشاهده رویداد
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
