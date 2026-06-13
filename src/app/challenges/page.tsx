'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Calendar, Users, TrendingUp, Clock, Filter } from 'lucide-react'
import axios from 'axios'
import { CHALLENGE_STATUSES } from '@/lib/validations'

export default function ChallengesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    loadChallenges()
  }, [filter, sort])

  const loadChallenges = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(filter && { status: filter }),
        sort,
      })

      const response = await axios.get(`/api/challenges?${params}`)
      setChallenges(response.data.challenges)
    } catch (error) {
      console.error('Error loading challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const s = CHALLENGE_STATUSES.find(x => x.value === status)
    return s?.label || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
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
            چالش‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            در چالش‌ها شرکت کنید و جوایز را ببرید
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                وضعیت:
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                فعال
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                در انتظار
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                تکمیل شده
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
                <option value="start_date">تاریخ شروع</option>
                <option value="ending_soon">در حال پایان</option>
              </select>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              چالشی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              به زودی چالش‌های جدید اضافه خواهند شد
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(challenge.status)}`}>
                    {getStatusLabel(challenge.status)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {challenge.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {challenge.shortDescription}
                </p>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(challenge.startDate).toLocaleDateString('fa-IR')} - {new Date(challenge.endDate).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participantsCount} شرکت‌کننده</span>
                  </div>
                  {challenge.pointsReward > 0 && (
                    <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                      <Trophy className="w-4 h-4" />
                      <span>{challenge.pointsReward} امتیاز</span>
                    </div>
                  )}
                </div>

                {/* Prize */}
                {challenge.prize && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <Trophy className="w-4 h-4" />
                      <span>{challenge.prize}</span>
                    </div>
                  </div>
                )}

                {/* View Button */}
                <Link
                  href={`/challenges/${challenge.slug}`}
                  className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  مشاهده چالش
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
