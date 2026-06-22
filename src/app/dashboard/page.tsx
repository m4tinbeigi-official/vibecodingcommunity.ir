'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, LogOut, Settings, Bell, UserPlus, Briefcase, ArrowUp, Plus, Edit, Trash2, CalendarCheck, Home, Users, Calendar, Sparkles } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      checkOnboarding()
    }
  }, [status, router])

  const checkOnboarding = async () => {
    try {
      const response = await axios.get('/api/user/profile')
      setUserData(response.data)

      if (!response.data.onboardingCompleted) {
        router.push(`/onboarding?step=${response.data.onboardingStep}`)
      }
    } catch (error) {
      console.error('Error checking onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      loadProjects()
    }
  }, [status])

  const loadProjects = async () => {
    setProjectsLoading(true)
    try {
      const response = await axios.get('/api/user/projects')
      setProjects(response.data.projects)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setProjectsLoading(false)
    }
  }

  const deleteProject = async (slug: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این پروژه را حذف کنید؟')) {
      return
    }

    try {
      await axios.delete(`/api/projects/${slug}`)
      loadProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('خطا در حذف پروژه')
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

  if (!session || !userData) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand + Home link */}
          <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold shrink-0">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">صفحه اصلی</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <Link href="/dashboard" className="px-3 py-1.5 text-sm rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium whitespace-nowrap">
              داشبورد
            </Link>
            <Link href="/projects" className="px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 whitespace-nowrap">
              <Briefcase className="w-4 h-4" />
              <span>پروژه‌ها</span>
            </Link>
            <Link href="/events" className="px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 whitespace-nowrap">
              <Calendar className="w-4 h-4" />
              <span>رویدادها</span>
            </Link>
            <Link href="/members" className="px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 whitespace-nowrap">
              <Users className="w-4 h-4" />
              <span>اعضا</span>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => router.push('/profile/edit')}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              title="ویرایش پروفایل"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              title="خروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 md:p-8">
      {/* User greeting header */}
      <header className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              خوش آمدید، {userData.displayName || session.user.name || 'کاربر'}!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              داشبورد شخصی شما
            </p>
          </div>
          <div className="flex items-center gap-3">
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center overflow-hidden">
              {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt={userData.displayName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {userData.displayName || session.user.name || 'کاربر'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                @{userData.username || 'username'} {userData.city && `• ${userData.city}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {userData.mainField || 'حوزه فعالیت'} {userData.experienceLevel && `• ${userData.experienceLevel}`}
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            به انجمن وایب کدینگ ایران خوش آمدید!
          </h2>
          <p className="text-primary-100 mb-4">
            اینجا می‌توانید با برنامه‌نویسان دیگر ارتباط برقرار کنید، پروژه‌های خود را به اشتراک بگذارید و مهارت‌های خود را تقویت کنید.
          </p>
          <div className="flex gap-4">
            <Link
              href="/projects"
              className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              مشاهده پروژه‌ها
            </Link>
            <Link
              href="/projects/new"
              className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium"
            >
              شروع پروژه جدید
            </Link>
          </div>
        </div>

        {/* Complete-profile prompt (awards points once completed) */}
        {!(userData.mainField && userData.experienceLevel && userData.collaborationStatus) && (
          <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  پروفایلت را کامل کن و ۵۰ امتیاز بگیر
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  حوزه فعالیت، سطح تجربه و وضعیت همکاری‌ات را اضافه کن تا اعضای دیگر بهتر پیدایت کنند.
                </p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="self-start md:self-auto whitespace-nowrap px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              تکمیل پروفایل
            </Link>
          </div>
        )}

        {/* Past events attendance survey prompt */}
        {userData.pastEventsAnswered === false && (
          <div className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-800 rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <CalendarCheck className="w-6 h-6 text-primary-600 dark:text-primary-400 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  در رویدادهای گذشته ما شرکت کرده‌اید؟
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  لطفاً برای دو رویداد گذشته جامعه، جداگانه مشخص کنید که در آن‌ها حضور داشته‌اید یا خیر.
                </p>
              </div>
            </div>
            <Link
              href="/past-events"
              className="self-start md:self-auto whitespace-nowrap px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              پاسخ می‌دهم
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              پروژه‌های من
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{projects.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              پروژه ثبت شده
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              چالش‌ها
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              به زودی
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              امتیاز
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{userData.points || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              امتیاز کل
            </p>
          </div>
        </div>

        {/* My Projects Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                پروژه‌های من
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                پروژه‌هایی که ثبت کرده‌اید
              </p>
            </div>
            <Link
              href="/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>پروژه جدید</span>
            </Link>
          </div>

          {projectsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                هنوز پروژه‌ای ثبت نکرده‌اید
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                اولین پروژه خود را ثبت کنید
              </p>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت پروژه</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'launched' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                          project.status === 'mvp' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                          project.status === 'in_development' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {project.status === 'launched' ? 'منتشر شده' :
                           project.status === 'mvp' ? 'MVP' :
                           project.status === 'in_development' ? 'در حال توسعه' : 'ایده'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {project.shortDescription}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <ArrowUp className="w-4 h-4" />
                          <span>{project.upvotesCount} رای</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{project.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                        title="مشاهده"
                      >
                        <Briefcase className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/projects/${project.slug}/edit`}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="ویرایش"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteProject(project.slug)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              در حال ساخت
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              قابلیت‌های بیشتر به زودی اضافه خواهند شد
            </p>
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}