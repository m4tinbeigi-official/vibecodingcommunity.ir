'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, User, Settings, LogOut } from 'lucide-react'
import axios from 'axios'
import {
  MAIN_FIELDS,
  EXPERIENCE_LEVELS,
  TOOLS,
  MEMBERSHIP_GOALS,
  COLLABORATION_STATUSES,
} from '@/lib/validations'

export default function ProfileEditPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    username: '',
    avatarUrl: '',
    coverUrl: '',
    city: '',
    bio: '',
    telegramLink: '',
    linkedinLink: '',
    githubLink: '',
    websiteLink: '',
    mainField: '',
    secondaryFields: [] as string[],
    experienceLevel: '',
    tools: [] as string[],
    membershipGoals: [] as string[],
    collaborationStatus: '',
    showEmail: false,
    showPhone: false,
    showSocialLinks: true,
    profilePublic: true,
  })

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    } else if (sessionStatus === 'authenticated') {
      loadProfile()
    }
  }, [sessionStatus, router])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/user/profile')
      setFormData(response.data)
    } catch (err) {
      setError('خطا در بارگذاری پروفایل')
    } finally {
      setLoading(false)
    }
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const response = await axios.get(`/api/auth/check-username?username=${username}`)
      setUsernameAvailable(response.data.available)
    } catch (error) {
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, username: value })
    if (value.length >= 3 && value !== formData.username) {
      checkUsernameAvailability(value)
    }
  }

  const toggleArrayItem = (field: 'secondaryFields' | 'tools' | 'membershipGoals', value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].includes(value)
        ? formData[field].filter(item => item !== value)
        : [...formData[field], value],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await axios.patch('/api/user/profile', formData)
      setSuccess('پروفایل با موفقیت ذخیره شد')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در ذخیره پروفایل')
    } finally {
      setSaving(false)
    }
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ویرایش پروفایل
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                اطلاعات پروفایل خود را管理和 ویرایش کنید
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              بازگشت به داشبورد
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              اطلاعات پایه
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  نام *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  نام خانوادگی *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  نام نمایشی *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  نام کاربری *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right ${
                    usernameAvailable === false ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
                {checkingUsername && (
                  <p className="text-xs text-gray-500 mt-1 text-right">در حال بررسی...</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-xs text-green-600 mt-1 text-right">✓ این نام کاربری آزاد است</p>
                )}
                {usernameAvailable === false && (
                  <p className="text-xs text-red-600 mt-1 text-right">این نام کاربری قبلاً گرفته شده است</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  شهر
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  لینک آواتار
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  بیوگرافی
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.bio.length}/500</p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              اطلاعات حرفه‌ای
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  حوزه اصلی *
                </label>
                <select
                  value={formData.mainField}
                  onChange={(e) => setFormData({ ...formData, mainField: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {MAIN_FIELDS.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  سطح تجربه *
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  وضعیت همکاری *
                </label>
                <select
                  value={formData.collaborationStatus}
                  onChange={(e) => setFormData({ ...formData, collaborationStatus: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {COLLABORATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              لینک‌های اجتماعی
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  تلگرام
                </label>
                <input
                  type="url"
                  value={formData.telegramLink}
                  onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://t.me/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  لینکدین
                </label>
                <input
                  type="url"
                  value={formData.linkedinLink}
                  onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  گیت‌هاب
                </label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  وبسایت / پورتفولیو
                </label>
                <input
                  type="url"
                  value={formData.websiteLink}
                  onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              تنظیمات حریم خصوصی
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">نمایش ایمیل</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ایمیل شما در پروفایل عمومی نمایش داده شود</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showEmail}
                  onChange={(e) => setFormData({ ...formData, showEmail: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">نمایش شماره موبایل</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">شماره موبایل شما در پروفایل نمایش داده شود</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showPhone}
                  onChange={(e) => setFormData({ ...formData, showPhone: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">نمایش لینک‌های اجتماعی</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">لینک‌های شما در پروفایل عمومی نمایش داده شود</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showSocialLinks}
                  onChange={(e) => setFormData({ ...formData, showSocialLinks: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">پروفایل عمومی</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">پروفایل شما برای دیگران قابل مشاهده باشد</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.profilePublic}
                  onChange={(e) => setFormData({ ...formData, profilePublic: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                'ذخیره تغییرات'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}