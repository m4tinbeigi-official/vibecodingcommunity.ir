'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, ArrowUp, Briefcase, Wrench } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { PROJECT_CATEGORIES, PROJECT_STATUSES, TOOLS } from '@/lib/validations'

export default function ProjectsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    tool: '',
  })
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadProjects()
  }, [search, filters, sort, page])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        ...filters,
        sort,
        page: page.toString(),
        limit: '12',
      })

      const response = await axios.get(`/api/projects?${params}`)
      setProjects(response.data.projects)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Error loading projects:', error)
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
      category: '',
      status: '',
      tool: '',
    })
    setSearch('')
    setPage(1)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              پروژه‌های جامعه
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              پروژه‌های ساخته شده توسط اعضا و کمک کنید
            </p>
          </div>

          {session && (
            <Link
              href="/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>پروژه جدید</span>
            </Link>
          )}
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
                placeholder="جستجو در پروژه‌ها..."
                className="w-full pr-10 pl-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                دسته‌بندی
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="">همه</option>
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                وضعیت
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="">همه</option>
                {PROJECT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                ابزار
              </label>
              <select
                value={filters.tool}
                onChange={(e) => handleFilterChange('tool', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              >
                <option value="">همه</option>
                {TOOLS.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
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
                onClick={() => setSort('upvotes')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sort === 'upvotes'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                محبوب‌ترین
              </button>
              <button
                onClick={() => setSort('featured')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sort === 'featured'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                ویژه
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

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              پروژه‌ای یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              هنوز پروژه‌ای ثبت نشده است
            </p>
            {session && (
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                اولین پروژه را ثبت کنید
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Project Image */}
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-white" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* Status Badge */}
                    <div className="mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'launched' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                        project.status === 'mvp' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                        project.status === 'in_development' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {PROJECT_STATUSES.find(s => s.value === project.status)?.label || project.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {project.shortDescription}
                    </p>

                    {/* Owner */}
                    <div className="flex items-center gap-2 mb-3">
                      {project.owner.avatarUrl ? (
                        <img
                          src={project.owner.avatarUrl}
                          alt={project.owner.displayName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            {project.owner.displayName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {project.owner.displayName}
                      </span>
                    </div>

                    {/* Tools */}
                    {project.tools && project.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tools.slice(0, 3).map((tool: string) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {tool}
                          </span>
                        ))}
                        {project.tools.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{project.tools.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      {/* Upvotes */}
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-sm">{project.upvotesCount}</span>
                      </div>

                      {/* View Button */}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        مشاهده
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  صفحه {page} از {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 12)}
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
