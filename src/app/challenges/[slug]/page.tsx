'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Trophy, Calendar, Users, TrendingUp, Clock, Award, ArrowLeft, Send, Briefcase, Loader2 } from 'lucide-react'
import axios from 'axios'
import { CHALLENGE_STATUSES } from '@/lib/validations'

export default function ChallengeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()

  const [challenge, setChallenge] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [userProjects, setUserProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [submissionNote, setSubmissionNote] = useState('')

  useEffect(() => {
    loadChallenge()
  }, [slug])

  const loadChallenge = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/challenges/${slug}`)
      setChallenge(response.data)
    } catch (error) {
      console.error('Error loading challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProjects = async () => {
    try {
      const response = await axios.get('/api/user/projects')
      setUserProjects(response.data.projects)
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const handleJoin = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      await axios.post(`/api/challenges/${slug}/join`)
      setShowSubmitForm(true)
      loadUserProjects()
    } catch (error: any) {
      console.error('Error joining challenge:', error)
      alert(error.response?.data?.error || 'خطا در شرکت در چالش')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProject) {
      alert('لطفاً یک پروژه انتخاب کنید')
      return
    }

    setSubmitting(true)
    try {
      await axios.post(`/api/challenges/${slug}/submit`, {
        projectId: selectedProject,
        note: submissionNote,
      })
      alert('پروژه با موفقیت ارسال شد')
      setShowSubmitForm(false)
      loadChallenge()
    } catch (error: any) {
      console.error('Error submitting:', error)
      alert(error.response?.data?.error || 'خطا در ارسال پروژه')
    } finally {
      setSubmitting(false)
    }
  }

  const hasUserSubmitted = challenge?.submissions?.some((s: any) => s.userId === session?.user?.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            چالش یافت نشد
          </h1>
          <button
            onClick={() => router.push('/challenges')}
            className="text-primary-600 hover:text-primary-700"
          >
            بازگشت به چالش‌ها
          </button>
        </div>
      </div>
    )
  }

  const status = CHALLENGE_STATUSES.find(s => s.value === challenge.status)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/challenges')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>بازگشت به چالش‌ها</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  challenge.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                  challenge.status === 'completed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                  'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                }`}>
                  {status?.label || challenge.status}
                </span>
                {challenge.pointsReward > 0 && (
                  <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                    <Trophy className="w-4 h-4" />
                    <span>{challenge.pointsReward} امتیاز</span>
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {challenge.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(challenge.startDate).toLocaleDateString('fa-IR')} - {new Date(challenge.endDate).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{challenge.participantsCount} شرکت‌کننده</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prize */}
          {challenge.prize && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Award className="w-5 h-5" />
                <span className="font-semibold">جایزه: {challenge.prize}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              توضیحات
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {challenge.fullDescription}
            </p>
          </div>

          {/* Rules */}
          {challenge.rules && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                قوانین
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {challenge.rules}
              </p>
            </div>
          )}

          {/* Actions */}
          {challenge.status === 'active' && (
            <div className="flex gap-4">
              {hasUserSubmitted ? (
                <div className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                  شما در این چالش شرکت کرده‌اید
                </div>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={!session}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {session ? 'شرکت در چالش' : 'ورود برای شرکت'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Submit Form */}
        {showSubmitForm && !hasUserSubmitted && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ارسال پروژه
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  انتخاب پروژه *
                </label>
                {userProjects.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    شما پروژه‌ای ندارید. ابتدا یک پروژه بسازید.
                  </p>
                ) : (
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {userProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  یادداشت (اختیاری)
                </label>
                <textarea
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="توضیحات در مورد پروژه..."
                  maxLength={500}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting || !selectedProject}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      ارسال پروژه
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Submissions / Leaderboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ارسال‌ها ({challenge.submissions?.length || 0})
          </h2>

          {challenge.submissions?.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                هنوز ارسال‌ای وجود ندارد
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {challenge.submissions.map((submission: any, index: number) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                        index === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                        index === 2 ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* User */}
                      <div className="flex items-center gap-2 mb-2">
                        {submission.user.avatarUrl ? (
                          <img
                            src={submission.user.avatarUrl}
                            alt={submission.user.displayName || 'Avatar'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                              {submission.user.displayName?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {submission.user.displayName}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          @{submission.user.username}
                        </span>
                      </div>

                      {/* Project */}
                      <button
                        onClick={() => router.push(`/projects/${submission.project.slug}`)}
                        className="text-right w-full"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400">
                          {submission.project.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {submission.project.shortDescription}
                        </p>
                      </button>

                      {/* Note */}
                      {submission.note && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                          &ldquo;{submission.note}&rdquo;
                        </p>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          ارسال شده در {new Date(submission.submittedAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
