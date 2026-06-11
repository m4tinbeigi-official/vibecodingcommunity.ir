'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, Briefcase, Plus, X, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { PROJECT_CATEGORIES, PROJECT_STATUSES, TOOLS } from '@/lib/validations'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [notAuthorized, setNotAuthorized] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    problemSolved: '',
    targetAudience: '',
    category: '',
    status: 'idea',
    tools: [] as string[],
    technologies: [] as string[],
    demoUrl: '',
    githubUrl: '',
    imageUrl: '',
    images: [] as string[],
    lookingForTeammates: false,
    neededRoles: [] as string[],
  })

  const [newTool, setNewTool] = useState('')
  const [newTech, setNewTech] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newRole, setNewRole] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      loadProject()
    }
  }, [status, slug])

  const loadProject = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/projects/${slug}`)

      if (!response.data) {
        setNotFound(true)
        return
      }

      // Check ownership
      if (response.data.owner?.id !== session?.user?.id) {
        setNotAuthorized(true)
        return
      }

      setFormData({
        title: response.data.title || '',
        shortDescription: response.data.shortDescription || '',
        fullDescription: response.data.fullDescription || '',
        problemSolved: response.data.problemSolved || '',
        targetAudience: response.data.targetAudience || '',
        category: response.data.category || '',
        status: response.data.status || 'idea',
        tools: response.data.tools || [],
        technologies: response.data.technologies || [],
        demoUrl: response.data.demoUrl || '',
        githubUrl: response.data.githubUrl || '',
        imageUrl: response.data.imageUrl || '',
        images: response.data.images || [],
        lookingForTeammates: response.data.lookingForTeammates || false,
        neededRoles: response.data.neededRoles || [],
      })
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNotFound(true)
      } else if (err.response?.status === 403) {
        setNotAuthorized(true)
      } else {
        console.error('Error loading project:', err)
        setError('خطا در بارگذاری پروژه')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }))
  }

  const addCustomTool = () => {
    if (newTool && !formData.tools.includes(newTool)) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool]
      }))
      setNewTool('')
    }
  }

  const addTechnology = () => {
    if (newTech && !formData.technologies.includes(newTech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech]
      }))
      setNewTech('')
    }
  }

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }))
      setNewImage('')
    }
  }

  const addRole = () => {
    if (newRole && !formData.neededRoles.includes(newRole)) {
      setFormData(prev => ({
        ...prev,
        neededRoles: [...prev.neededRoles, newRole]
      }))
      setNewRole('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await axios.patch(`/api/projects/${slug}`, formData)
      router.push(`/projects/${slug}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در بروزرسانی پروژه')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
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

  if (notAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            دسترسی غیرمجاز
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            شما فقط می‌توانید پروژه‌های خود را ویرایش کنید
          </p>
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>بازگشت</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ویرایش پروژه
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تغییرات مورد نظر خود را اعمال کنید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              اطلاعات پایه
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  عنوان پروژه *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                  placeholder="مثال: پلتفرم یادگیری آنلاین"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  توضیح کوتاه *
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  rows={2}
                  maxLength={200}
                  required
                  placeholder="توضیح کوتاه در 200 حرف"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.shortDescription.length}/200</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  توضیح کامل *
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  rows={6}
                  maxLength={5000}
                  required
                  placeholder="توضیح کامل پروژه..."
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.fullDescription.length}/5000</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              جزئیات پروژه
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  دسته‌بندی *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  وضعیت *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  required
                >
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  مشکل حل شده
                </label>
                <textarea
                  value={formData.problemSolved}
                  onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  rows={4}
                  maxLength={2000}
                  placeholder="چه مشکلی را حل می‌کند؟"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  مخاطبان هدف
                </label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  rows={3}
                  maxLength={1000}
                  placeholder="مخاطبان هدف پروژه چیست؟"
                />
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ابزارها
            </h2>

            <div className="grid md:grid-cols-2 gap-2 mb-4">
              {TOOLS.slice(0, 12).map((tool) => (
                <label
                  key={tool}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.tools.includes(tool)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tools.includes(tool)}
                    onChange={() => toggleTool(tool)}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">{tool}</span>
                </label>
              ))}
            </div>

            {/* Add Custom Tool */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                placeholder="ابزار دیگر..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTool())}
              />
              <button
                type="button"
                onClick={addCustomTool}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              تکنولوژی‌ها
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      technologies: prev.technologies.filter(t => t !== tech)
                    }))}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                placeholder="تکنولوژی جدید..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              لینک‌ها
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  لینک دمو
                </label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  لینک گیت‌هاب
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://github.com/user/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                  لینک تصویر اصلی
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              تصاویر اضافی
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <img
                    src={image}
                    alt={`تصویر ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                placeholder="لینک تصویر..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              هم‌تیمی
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">به دنبال هم‌تیمی</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">آیا به دنبال هم‌تیمی هستید؟</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.lookingForTeammates}
                  onChange={(e) => setFormData({ ...formData, lookingForTeammates: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
              </label>

              {formData.lookingForTeammates && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    نقش‌های مورد نیاز
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.neededRoles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            neededRoles: prev.neededRoles.filter(r => r !== role)
                          }))}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                      placeholder="نقش مورد نیاز..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                    />
                    <button
                      type="button"
                      onClick={addRole}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
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
