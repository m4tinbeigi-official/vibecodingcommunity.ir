'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import axios from 'axios'
import {
  MAIN_FIELDS,
  EXPERIENCE_LEVELS,
  TOOLS,
  MEMBERSHIP_GOALS,
  COLLABORATION_STATUSES,
} from '@/lib/validations'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  // Form data for each step
  const [step1Data, setStep1Data] = useState({
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
  })

  const [step2Data, setStep2Data] = useState({
    mainField: '',
    secondaryFields: [] as string[],
  })

  const [step3Data, setStep3Data] = useState({
    experienceLevel: '',
  })

  const [step4Data, setStep4Data] = useState({
    tools: [] as string[],
  })

  const [step5Data, setStep5Data] = useState({
    membershipGoals: [] as string[],
  })

  const [step6Data, setStep6Data] = useState({
    collaborationStatus: '',
  })

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
    setStep1Data({ ...step1Data, username: value })
    if (value.length >= 3) {
      checkUsernameAvailability(value)
    } else {
      setUsernameAvailable(null)
    }
  }

  const toggleSecondaryField = (field: string) => {
    setStep2Data({
      ...step2Data,
      secondaryFields: step2Data.secondaryFields.includes(field)
        ? step2Data.secondaryFields.filter(f => f !== field)
        : [...step2Data.secondaryFields, field],
    })
  }

  const toggleTool = (tool: string) => {
    setStep4Data({
      ...step4Data,
      tools: step4Data.tools.includes(tool)
        ? step4Data.tools.filter(t => t !== tool)
        : [...step4Data.tools, tool],
    })
  }

  const toggleGoal = (goal: string) => {
    setStep5Data({
      ...step5Data,
      membershipGoals: step5Data.membershipGoals.includes(goal)
        ? step5Data.membershipGoals.filter(g => g !== goal)
        : [...step5Data.membershipGoals, goal],
    })
  }

  const submitStep = async (stepNumber: number, data: any, isLastStep = false) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/user/onboarding', {
        step: stepNumber,
        data,
        completed: isLastStep,
      })

      if (response.data.success) {
        if (isLastStep) {
          setCompleted(true)
          setTimeout(() => {
            // Ask about attendance at our past events before the dashboard.
            router.push('/past-events')
          }, 2000)
        } else {
          setStep(stepNumber + 1)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در ثبت اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
            نام *
          </label>
          <input
            type="text"
            value={step1Data.firstName}
            onChange={(e) => setStep1Data({ ...step1Data, firstName: e.target.value })}
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
            value={step1Data.lastName}
            onChange={(e) => setStep1Data({ ...step1Data, lastName: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          نام نمایشی *
        </label>
        <input
          type="text"
          value={step1Data.displayName}
          onChange={(e) => setStep1Data({ ...step1Data, displayName: e.target.value })}
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
          value={step1Data.username}
          onChange={handleUsernameChange}
          className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right ${
            usernameAvailable === false ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="مثال: ahmad_rezaei"
          required
        />
        {checkingUsername && (
          <p className="text-xs text-gray-500 mt-1 text-right">در حال بررسی...</p>
        )}
        {usernameAvailable === true && (
          <p className="text-xs text-green-600 mt-1 text-right">این نام کاربری آزاد است ✓</p>
        )}
        {usernameAvailable === false && (
          <p className="text-xs text-red-600 mt-1 text-right">این نام کاربری قبلاً گرفته شده است</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          لینک آواتار (اختیاری)
        </label>
        <input
          type="url"
          value={step1Data.avatarUrl}
          onChange={(e) => setStep1Data({ ...step1Data, avatarUrl: e.target.value })}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          لینک کاور (اختیاری)
        </label>
        <input
          type="url"
          value={step1Data.coverUrl}
          onChange={(e) => setStep1Data({ ...step1Data, coverUrl: e.target.value })}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          شهر (اختیاری)
        </label>
        <input
          type="text"
          value={step1Data.city}
          onChange={(e) => setStep1Data({ ...step1Data, city: e.target.value })}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          بیوگرافی کوتاه (اختیاری)
        </label>
        <textarea
          value={step1Data.bio}
          onChange={(e) => setStep1Data({ ...step1Data, bio: e.target.value })}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1 text-right">{step1Data.bio.length}/500</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">لینک‌های اجتماعی (اختیاری)</h3>
        <div className="space-y-3">
          <input
            type="url"
            value={step1Data.telegramLink}
            onChange={(e) => setStep1Data({ ...step1Data, telegramLink: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
            placeholder="تلگرام"
          />
          <input
            type="url"
            value={step1Data.linkedinLink}
            onChange={(e) => setStep1Data({ ...step1Data, linkedinLink: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
            placeholder="لینکدین"
          />
          <input
            type="url"
            value={step1Data.githubLink}
            onChange={(e) => setStep1Data({ ...step1Data, githubLink: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
            placeholder="گیت‌هاب"
          />
          <input
            type="url"
            value={step1Data.websiteLink}
            onChange={(e) => setStep1Data({ ...step1Data, websiteLink: e.target.value })}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
            placeholder="وبسایت/پورتفولیو"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">
          حوزه اصلی خود را انتخاب کنید *
        </h3>
        <div className="space-y-2">
          {MAIN_FIELDS.map((field) => (
            <label
              key={field}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                step2Data.mainField === field
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
              }`}
            >
              <input
                type="radio"
                name="mainField"
                value={field}
                checked={step2Data.mainField === field}
                onChange={(e) => setStep2Data({ ...step2Data, mainField: e.target.value })}
                className="ml-2"
              />
              <span className="text-gray-900 dark:text-white">{field}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">
          حوزه‌های فرعی (اختیاری)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-right">
          می‌توانید چندین گزینه انتخاب کنید
        </p>
        <div className="grid md:grid-cols-2 gap-2">
          {MAIN_FIELDS.filter(f => f !== step2Data.mainField).map((field) => (
            <label
              key={field}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                step2Data.secondaryFields.includes(field)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
              }`}
            >
              <input
                type="checkbox"
                checked={step2Data.secondaryFields.includes(field)}
                onChange={() => toggleSecondaryField(field)}
                className="ml-2"
              />
              <span className="text-sm text-gray-900 dark:text-white">{field}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">
        سطح تجربه خود را انتخاب کنید *
      </h3>
      <div className="space-y-2">
        {EXPERIENCE_LEVELS.map((level) => (
          <label
            key={level}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              step3Data.experienceLevel === level
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <input
              type="radio"
              name="experienceLevel"
              value={level}
              checked={step3Data.experienceLevel === level}
              onChange={(e) => setStep3Data({ ...step3Data, experienceLevel: e.target.value })}
              className="ml-2"
            />
            <span className="text-gray-900 dark:text-white">{level}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-right">
        ابزارهایی که استفاده می‌کنید *
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-right">
        حداقل یک ابزار را انتخاب کنید
      </p>
      <div className="grid md:grid-cols-3 gap-2">
        {TOOLS.map((tool) => (
          <label
            key={tool}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              step4Data.tools.includes(tool)
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <input
              type="checkbox"
              checked={step4Data.tools.includes(tool)}
              onChange={() => toggleTool(tool)}
              className="ml-2"
            />
            <span className="text-sm text-gray-900 dark:text-white">{tool}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-right">
        اهداف عضویت شما *
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-right">
        حداقل یک هدف را انتخاب کنید
      </p>
      <div className="grid md:grid-cols-2 gap-2">
        {MEMBERSHIP_GOALS.map((goal) => (
          <label
            key={goal}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              step5Data.membershipGoals.includes(goal)
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <input
              type="checkbox"
              checked={step5Data.membershipGoals.includes(goal)}
              onChange={() => toggleGoal(goal)}
              className="ml-2"
            />
            <span className="text-sm text-gray-900 dark:text-white">{goal}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-right">
        وضعیت همکاری *
      </h3>
      <div className="space-y-2">
        {COLLABORATION_STATUSES.map((status) => (
          <label
            key={status}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              step6Data.collaborationStatus === status
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            <input
              type="radio"
              name="collaborationStatus"
              value={status}
              checked={step6Data.collaborationStatus === status}
              onChange={(e) => setStep6Data({ ...step6Data, collaborationStatus: e.target.value })}
              className="ml-2"
            />
            <span className="text-gray-900 dark:text-white">{status}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const handleNext = () => {
    switch (step) {
      case 1:
        if (!step1Data.firstName || !step1Data.lastName || !step1Data.displayName ||
            !step1Data.username || usernameAvailable === false) {
          setError('لطفاً تمام فیلدهای الزامی را پر کنید')
          return
        }
        submitStep(1, step1Data)
        break
      case 2:
        if (!step2Data.mainField) {
          setError('لطفاً حوزه اصلی خود را انتخاب کنید')
          return
        }
        submitStep(2, step2Data)
        break
      case 3:
        if (!step3Data.experienceLevel) {
          setError('لطفاً سطح تجربه خود را انتخاب کنید')
          return
        }
        submitStep(3, step3Data)
        break
      case 4:
        if (step4Data.tools.length === 0) {
          setError('حداقل یک ابزار را انتخاب کنید')
          return
        }
        submitStep(4, step4Data)
        break
      case 5:
        if (step5Data.membershipGoals.length === 0) {
          setError('حداقل یک هدف را انتخاب کنید')
          return
        }
        submitStep(5, step5Data)
        break
      case 6:
        if (!step6Data.collaborationStatus) {
          setError('لطفاً وضعیت همکاری خود را انتخاب کنید')
          return
        }
        submitStep(6, step6Data, true)
        break
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              خوش آمدید! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              پروفایل شما با موفقیت تکمیل شد. در حال انتقال به داشبورد...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              مرحله {step} از 6
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((step / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-right">
            {step === 1 && 'اطلاعات پایه'}
            {step === 2 && 'حوزه فعالیت'}
            {step === 3 && 'سطح تجربه'}
            {step === 4 && 'ابزارها'}
            {step === 5 && 'اهداف عضویت'}
            {step === 6 && 'وضعیت همکاری'}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-right">{error}</p>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت</span>
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{step === 6 ? 'تکمیل' : 'بعدی'}</span>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              step < 6 && <ArrowLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}