'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, User, MapPin, Briefcase, Trophy, Users } from 'lucide-react'
import axios from 'axios'
import {
  MAIN_FIELDS,
  EXPERIENCE_LEVELS,
  TOOLS,
  COLLABORATION_STATUSES,
} from '@/lib/validations'

export default function MembersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    mainField: '',
    city: '',
    experienceLevel: '',
    tool: '',
    collaborationStatus: '',
  })
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadMembers()
  }, [search, filters, sort, page])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        ...filters,
        sort,
        page: page.toString(),
        limit: '24',
      })

      const response = await axios.get(`/api/members?${params}`)
      setMembers(response.data.members)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      mainField: '',
      city: '',
      experienceLevel: '',
      tool: '',
      collaborationStatus: '',
    })
    setSearch('')
    setPage(1)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            اعضای جامعه
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            با برنامه‌نویسان دیگر آشنا شوید و شبکه‌سازی کنید
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو بر اساس نام، نام کاربری..."
                className="w-full pr-10 pl-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                حوزه اصلی
              </label>
              <select
                value={filters.mainField}
                onChange={(e) => handleFilterChange('mainField', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="">همه</option>
                {MAIN_FIELDS.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                سطح تجربه
              </label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="">همه</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                وضعیت همکاری
              </label>
              <select
                value={filters.collaborationStatus}
                onChange={(e) => handleFilterChange('collaborationStatus', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="">همه</option>
                {COLLABORATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setSort('newest')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sort === 'newest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                جدیدترین
              </button>
              <button
                onClick={() => setSort('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sort === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                فعال‌ترین
              </button>
              <button
                onClick={() => setSort('points')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sort === 'points'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                بیشترین امتیاز
              </button>
            </div>

            {(search || Object.values(filters).some(v => v)) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              عضوی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              با فیلترهای دیگری尝试 کنید
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  onClick={() => router.push(`/members/${member.username}`)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 overflow-hidden mb-3">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {member.displayName?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {member.displayName}
                  </h3>

                  {/* Username */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    @{member.username}
                  </p>

                  {/* Main Field */}
                  {member.mainField && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <Briefcase className="w-3 h-3" />
                      <span>{member.mainField}</span>
                    </div>
                  )}

                  {/* City */}
                  {member.city && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{member.city}</span>
                    </div>
                  )}

                  {/* Experience Level */}
                  {member.experienceLevel && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      {member.experienceLevel}
                    </p>
                  )}

                  {/* Points */}
                  <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 mb-3">
                    <Trophy className="w-3 h-3" />
                    <span>{member.points} امتیاز</span>
                  </div>

                  {/* Collaboration Status */}
                  {member.collaborationStatus && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {member.collaborationStatus}
                    </div>
                  )}

                  {/* Tools */}
                  {member.tools && member.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.tools.slice(0, 3).map((tool: string) => (
                        <span
                          key={tool}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                      {member.tools.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{member.tools.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 24 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  صفحه {page} از {Math.ceil(total / 24)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 24)}
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}