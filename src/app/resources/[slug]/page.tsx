'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, BookOpen, MessageSquare, Cpu, ListChecks, GraduationCap, Lightbulb, Tag, Calendar, User, Link as LinkIcon } from 'lucide-react'
import axios from 'axios'
import { RESOURCE_TYPES } from '@/lib/validations'
import Link from 'next/link'

export default function ResourceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResource()
  }, [slug])

  const loadResource = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/resources/${slug}`)
      setResource(response.data)
    } catch (error) {
      console.error('Error loading resource:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            منبع یافت نشد
          </h1>
          <button
            onClick={() => router.push('/resources')}
            className="text-primary-600 hover:text-primary-700"
          >
            بازگشت به منابع
          </button>
        </div>
      </div>
    )
  }

  const Icon = getTypeIcon(resource.type)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/resources')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>بازگشت به منابع</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          {/* Type Badge */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getTypeColor(resource.type)}`}>
              <Icon className="w-4 h-4" />
              {getTypeLabel(resource.type)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {resource.title}
          </h1>

          {/* Description */}
          {resource.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {resource.description}
            </p>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author & Date */}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              {resource.author.avatarUrl ? (
                <img
                  src={resource.author.avatarUrl}
                  alt={resource.author.displayName || 'Avatar'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {resource.author.displayName?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{resource.author.displayName}</span>
                </div>
                <span className="text-xs">@{resource.author.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(resource.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            محتوا
          </h2>
          <div className="prose prose-sm max-w-none text-right">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {resource.content}
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {resource.relatedResources && resource.relatedResources.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              منابع مرتبط
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {resource.relatedResources.map((related: any) => {
                const RelatedIcon = getTypeIcon(related.type)
                return (
                  <Link
                    key={related.id}
                    href={`/resources/${related.slug}`}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <RelatedIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className={`text-xs px-2 py-1 rounded ${getTypeColor(related.type)}`}>
                        {getTypeLabel(related.type)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {related.title}
                    </h3>
                    {related.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {related.description}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
