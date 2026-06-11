'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Users, ArrowUp, Calendar, MapPin, Link as LinkIcon, Github, Send, Loader2 } from 'lucide-react'
import { PROJECT_STATUSES } from '@/lib/validations'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'

interface PageProps {
  params: {
    slug: string
  }
}

export default function ProjectPage({ params }: PageProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upvoted, setUpvoted] = useState(false)
  const [upvotesCount, setUpvotesCount] = useState(0)
  const [upvoting, setUpvoting] = useState(false)

  useEffect(() => {
    loadProject()
  }, [params.slug])

  const loadProject = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/projects/${params.slug}`)
      setProject(response.data)
      setUpvoted(response.data.hasUpvoted || false)
      setUpvotesCount(response.data.upvotesCount || 0)
    } catch (error) {
      console.error('Error loading project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setUpvoting(true)
    try {
      const response = await axios.post(`/api/projects/${params.slug}/upvote`)
      setUpvoted(response.data.upvoted)
      setUpvotesCount(response.data.upvotesCount)
    } catch (error: any) {
      console.error('Error upvoting:', error)
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setUpvoting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            پروژه یافت نشد
          </h1>
          <button
            onClick={() => router.push('/projects')}
            className="text-primary-600 hover:text-primary-700"
          >
            بازگشت به پروژه‌ها
          </button>
        </div>
      </div>
    )
  }

  const status = PROJECT_STATUSES.find(s => s.value === project.status)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Briefcase className="w-16 h-16 text-white" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {project.title}
            </h1>
            <p className="text-white/80 text-lg">
              {project.shortDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Status & Meta */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'launched' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                  project.status === 'mvp' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                  project.status === 'in_development' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {status?.label || project.status}
                </span>

                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  {project.category}
                </span>

                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <ArrowUp className="w-4 h-4" />
                  <span>{upvotesCount} رای</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="prose prose-sm max-w-none text-right">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  توضیحات کامل
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.fullDescription}
                </p>
              </div>

              {/* Problem Solved */}
              {project.problemSolved && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    مشکل حل شده
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.problemSolved}
                  </p>
                </div>
              )}

              {/* Target Audience */}
              {project.targetAudience && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    مخاطبان هدف
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.targetAudience}
                  </p>
                </div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    تکنولوژی‌ها
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {project.tools && project.tools.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    ابزارها
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool: string) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.demoUrl || project.githubUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>دمو</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>گیت‌هاب</span>
                    </a>
                  )}
                </div>
              )}

              {/* Images Gallery */}
              {project.images && project.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    تصاویر پروژه
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${project.title} - تصویر ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Teammates Section */}
            {project.lookingForTeammates && project.neededRoles && project.neededRoles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  به دنبال هم‌تیمی
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.neededRoles.map((role: string) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Owner Card */}
          <div className="space-y-6">
            {/* Owner Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                سازنده پروژه
              </h3>

              <Link
                href={`/members/${project.owner.username}`}
                className="block"
              >
                <div className="flex items-center gap-4 mb-4">
                  {project.owner.avatarUrl ? (
                    <img
                      src={project.owner.avatarUrl}
                      alt={project.owner.displayName || 'Avatar'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {project.owner.displayName?.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {project.owner.displayName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{project.owner.username}
                    </p>
                  </div>
                </div>
              </Link>

              {project.owner.city && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{project.owner.city}</span>
                </div>
              )}

              {project.owner.mainField && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{project.owner.mainField}</span>
                </div>
              )}

              {project.owner.experienceLevel && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {project.owner.experienceLevel}
                </p>
              )}

              <button
                onClick={() => router.push(`/members/${project.owner.username}`)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                مشاهده پروفایل
              </button>

              {project.owner.telegramLink && (
                <a
                  href={project.owner.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>تماس در تلگرام</span>
                </a>
              )}
            </div>

            {/* Dates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                اطلاعات پروژه
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>ایجاد شده در {new Date(project.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
            </div>

            {/* Upvote Button */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <button
                onClick={handleUpvote}
                disabled={upvoting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  upvoted
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {upvoting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>در حال ثبت...</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-5 h-5" />
                    <span>{upvoted ? 'رای داده شده' : 'رای دهید'}</span>
                    <span className="text-sm">({upvotesCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
