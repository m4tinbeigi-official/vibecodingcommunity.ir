'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, BookOpen, MessageSquare, Cpu, ListChecks, GraduationCap, Lightbulb, Tag, Calendar, User } from 'lucide-react'
import axios from 'axios'
import { RESOURCE_TYPES } from '@/lib/validations'

export default function ResourcesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<any[]>([])
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    loadResources()
  }, [typeFilter, search, sort])

  const loadResources = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(typeFilter && { type: typeFilter }),
        ...(search && { search }),
        sort,
      })

      const response = await axios.get(`/api/resources?${params}`)
      setResources(response.data.resources)
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prompt':
        return MessageSquare
      case 'ai_tool':
        return Cpu
      case 'mvp_checklist':
        return ListChecks
      case 'tutorial':
        return GraduationCap
      case 'experience':
        return Lightbulb
      case 'beginner':
        return BookOpen
      default:
        return BookOpen
    }
  }

  const getTypeLabel = (type: string) => {
    const t = RESOURCE_TYPES.find(x => x.value === type)
    return t?.label || type
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prompt':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
      case 'ai_tool':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      case 'mvp_checklist':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'tutorial':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
      case 'experience':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      case 'beginner':
        return 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
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
            منابع آموزشی
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            پرامپت‌ها، ابزارها، آموزش‌ها و تجربیات اعضا
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در منابع..."
                className="w-full pr-10 pl-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              نوع:
            </span>
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
            {RESOURCE_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setTypeFilter(type.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  typeFilter === type.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              منبعی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              منبعی با این مشخصات وجود ندارد
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const Icon = getTypeIcon(resource.type)
              return (
                <div
                  key={resource.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Type Badge */}
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${getTypeColor(resource.type)}`}>
                      <Icon className="w-3 h-3" />
                      {getTypeLabel(resource.type)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {resource.description || resource.content.slice(0, 150) + '...'}
                  </p>

                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{resource.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Author & Date */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{resource.author.displayName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(resource.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    مشاهده منبع
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
