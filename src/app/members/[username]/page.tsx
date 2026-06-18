import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Calendar, MapPin, Mail, Briefcase, Trophy, Users, Wrench } from 'lucide-react'

interface PageProps {
  params: {
    username: string
  }
}

async function getUserData(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
      profilePublic: true,
    },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      coverUrl: true,
      city: true,
      bio: true,
      mainField: true,
      secondaryFields: true,
      experienceLevel: true,
      tools: true,
      membershipGoals: true,
      collaborationStatus: true,
      telegramLink: true,
      linkedinLink: true,
      githubLink: true,
      websiteLink: true,
      showEmail: true,
      showSocialLinks: true,
      points: true,
      level: true,
      createdAt: true,
    },
  })

  return user
}

export async function generateMetadata({ params }: PageProps) {
  const user = await getUserData(params.username)

  if (!user) {
    return {
      title: 'کاربر یافت نشد',
    }
  }

  return {
    title: `${user.displayName} (@${user.username}) | انجمن وایب کدینگ ایران`,
    description: user.bio || `پروفایل ${user.displayName} در انجمن وایب کدینگ ایران`,
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const user = await getUserData(params.username)

  if (!user) {
    notFound()
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 relative">
        {user.coverUrl && (
          <img
            src={user.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-6">
          <div className="flex flex-col sm:flex-row items-end sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900">
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {user.displayName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name & Info */}
            <div className="flex-1 text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {user.displayName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              {user.city && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.city}</span>
                </div>
              )}
            </div>

            {/* Contact Buttons */}
            {user.showSocialLinks && (
              <div className="flex gap-2">
                {user.telegramLink && (
                  <a
                    href={user.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    تلگرام
                  </a>
                )}
                {user.websiteLink && (
                  <a
                    href={user.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    وبسایت
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 pb-12">
          {/* Left Column - Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {user.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  درباره من
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-right">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Professional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                اطلاعات حرفه‌ای
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">حوزه اصلی</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.mainField || '—'}</p>
                </div>

                {user.secondaryFields && user.secondaryFields.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">حوزه‌های فرعی</p>
                    <div className="flex flex-wrap gap-2">
                      {user.secondaryFields.map((field) => (
                        <span
                          key={field}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">سطح تجربه</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.experienceLevel || '—'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">وضعیت همکاری</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.collaborationStatus || '—'}</p>
                </div>

                {user.tools && user.tools.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">ابزارها</p>
                    <div className="flex flex-wrap gap-2">
                      {user.tools.slice(0, 10).map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                      {user.tools.length > 10 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{user.tools.length - 10} دیگر
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Goals */}
            {user.membershipGoals && user.membershipGoals.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  اهداف عضویت
                </h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {user.membershipGoals.map((goal) => (
                    <div
                      key={goal}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {user.showSocialLinks && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  لینک‌های اجتماعی
                </h2>
                <div className="space-y-3">
                  {user.githubLink && (
                    <a
                      href={user.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🐙</span>
                      </div>
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {user.linkedinLink && (
                    <a
                      href={user.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💼</span>
                      </div>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                آمار
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">امتیاز</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {user.points}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">سطح</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {user.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Member Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                اطلاعات عضویت
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>عضو از {joinDate}</span>
                </div>
              </div>
            </div>

            {/* Collaboration CTA */}
            {user.collaborationStatus && (
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
                <h3 className="font-semibold mb-2">وضعیت همکاری</h3>
                <p className="text-primary-100 text-sm mb-4">{user.collaborationStatus}</p>
                {user.telegramLink && user.showSocialLinks && (
                  <a
                    href={user.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                  >
                    تماس در تلگرام
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}