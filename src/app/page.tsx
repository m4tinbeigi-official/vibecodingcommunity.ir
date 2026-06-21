'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import TelegramCommunity from '@/components/TelegramCommunity'

interface HomeData {
  upcomingEvents: any[]
  pastEvents: any[]
  recentActivities: any[]
  featuredMembers: any[]
  topProjects: any[]
  blogPosts: any[]
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const { status } = useSession()
  const isAuthed = status === 'authenticated'

  useEffect(() => {
    // Fetch home data
    fetch('/api/home')
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 md:p-8">
        <div className="text-center space-y-8 max-w-4xl w-full">
          <div className="space-y-4">
            <p className="text-sm md:text-base font-medium text-blue-600 dark:text-blue-400 tracking-widest uppercase">
              Vibe Coding Community
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              انجمن وایب کدینگ ایران
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              جایی برای برنامه‌نویس‌ها، سازنده‌ها و علاقه‌مندان هوش مصنوعی که می‌خواهند سریع‌تر یاد بگیرند، پروژه بسازند و کنار هم رشد کنند.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthed ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                رفتن به داشبورد
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                شروع رایگان
              </Link>
            )}
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              مشاهده پروژه‌ها
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">+700</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">عضو فعال</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">+100</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">پروژه</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">+20</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">چالش</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">+50</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">منبع آموزشی</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            چرا Vibe Coding Community؟
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            اینجا فقط یک انجمن برنامه‌نویسی نیست؛ فضایی است برای یادگیری عملی، ساخت پروژه‌های واقعی و ارتباط با آدم‌هایی که به تکنولوژی، هوش مصنوعی و محصول‌سازی علاقه دارند.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">جامعه‌ای از سازنده‌ها</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              با برنامه‌نویس‌ها، طراح‌ها، فعالان هوش مصنوعی و افراد محصول‌محور ارتباط بگیر و از تجربه‌هایشان یاد بگیر.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">پروژه‌محور یاد بگیر</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              به‌جای یادگیری پراکنده، روی پروژه‌های واقعی کار کن، خروجی بساز و مهارتت را در عمل تقویت کن.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">چالش‌ها و مسیر رشد</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              در چالش‌های برنامه‌نویسی و هوش مصنوعی شرکت کن، بازخورد بگیر و توانایی‌هایت را بهتر بسنج.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">منابع کاربردی</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              به آموزش‌ها، ابزارها، نمونه‌پروژه‌ها و منابعی دسترسی داشته باش که برای ساخت سریع‌تر و بهتر به کارت می‌آیند.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">هم‌تیمی پیدا کن</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              برای ایده‌ها، پروژه‌های جانبی یا محصول بعدی‌ات هم‌تیمی پیدا کن و مسیر ساخت را تنها پیش نبر.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">پروژه‌ات را دیده‌شدنی کن</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              خروجی کارت را با جامعه به اشتراک بگذار، بازخورد بگیر و فرصت‌های جدید برای همکاری بساز.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            آماده‌ای وارد جمع سازنده‌ها شوی؟
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            به انجمن وایب کدینگ ایران بپیوند و یادگیری، ساختن و رشد کردن را از همین امروز شروع کن.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ثبت‌نام رایگان
          </Link>
        </div>
      </div>

      {/* Telegram Community */}
      <TelegramCommunity lang="fa" />

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
        {!loading && data && (
          <>
            {/* Featured Members */}
            {data.featuredMembers && data.featuredMembers.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    اعضای برجسته
                  </h2>
                  <Link href="/members" className="text-blue-600 hover:text-blue-800">
                    مشاهده همه ←
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {data.featuredMembers.map((member) => (
                    <Link
                      key={member.id}
                      href={`/members/${member.username}`}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                        <img
                          src={member.avatarUrl || "/default-avatar.png"}
                          alt={member.displayName || member.username}
                          className="w-16 h-16 rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform"
                        />
                        <h3 className="font-semibold text-sm text-center text-gray-900 dark:text-white">
                          {member.displayName || member.username}
                        </h3>
                        <div className="text-xs text-center text-gray-500 mt-1">
                          سطح {member.level} • {member.points} امتیاز
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Events */}
            {data.upcomingEvents && data.upcomingEvents.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    رویدادهای پیش‌رو
                  </h2>
                  <Link href="/events" className="text-blue-600 hover:text-blue-800">
                    مشاهده همه ←
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {data.upcomingEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.slug}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            event.type === 'online'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {event.type === 'online' ? 'آنلاین' : 'حضوری'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            event.status === 'active'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status === 'active' ? 'فعال' : 'آتی'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Blog Posts */}
            {data.blogPosts && data.blogPosts.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    آخرین مقالات
                  </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {data.blogPosts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                      <div className="p-6">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Activities */}
            {data.recentActivities && data.recentActivities.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  آخرین فعالیت‌ها
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {data.recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4">
                        <img
                          src={activity.user.avatarUrl || "/default-avatar.png"}
                          alt={activity.user.displayName || activity.user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {activity.user.displayName || activity.user.username}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 mr-2">
                              {activity.action}
                            </span>
                          </p>
                          {activity.points > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                              +{activity.points} امتیاز
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Top Projects */}
            {data.topProjects && data.topProjects.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    پروژه‌های برتر
                  </h2>
                  <Link href="/projects" className="text-blue-600 hover:text-blue-800">
                    مشاهده همه ←
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {data.topProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.slug}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                        {project.imageUrl && (
                          <div className="h-48 bg-gray-200 relative">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {project.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <img
                                src={project.owner.avatarUrl || "/default-avatar.png"}
                                alt={project.owner.displayName || project.owner.username}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-gray-600 dark:text-gray-300">
                                {project.owner.displayName || project.owner.username}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <span>❤️</span>
                              <span>{project.upvotesCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}