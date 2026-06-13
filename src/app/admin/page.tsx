"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">خطا: {error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, latestUsers, latestProjects, topMembers, mostUpvoted } = data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">داشبورد مدیریت</h1>
          <p className="text-gray-600 mt-1">نمای کلی از جامعه Vibe Coding</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">کل کاربران</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 016-6h12a6 6 0 016 6v1H3v-1z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">کاربران جدید (۳۰ روز)</p>
                <p className="text-2xl font-bold">{stats.newUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">پروفایل‌های تکمیل</p>
                <p className="text-2xl font-bold">{stats.completedProfiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">کل پروژه‌ها</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">چالش‌ها</p>
                <p className="text-2xl font-bold">{stats.totalChallenges}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">رویدادها</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">آخرین کاربران</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {latestUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center">
                    <img
                      src={user.avatarUrl || "/default-avatar.png"}
                      alt={user.displayName || user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="mr-3 flex-1">
                      <p className="font-medium">{user.displayName || user.username}</p>
                      <p className="text-sm text-gray-600">{user.points} امتیاز</p>
                    </div>
                    {user.role === "admin" && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        ادمین
                      </span>
                    )}
                    {user.featured && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mr-2">
                        ویژه
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Projects */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">آخرین پروژه‌ها</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {latestProjects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center">
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="mr-3 flex-1">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-gray-600">
                        {project.owner.displayName || project.owner.username}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">{project.upvotesCount} 👍</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Members */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">برترین اعضا</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {topMembers.slice(0, 5).map((member, index) => (
                  <div key={member.id} className="flex items-center">
                    <div className="w-8 text-center font-bold text-gray-400">
                      #{index + 1}
                    </div>
                    <img
                      src={member.avatarUrl || "/default-avatar.png"}
                      alt={member.displayName || member.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{member.displayName || member.username}</p>
                      <p className="text-sm text-gray-600">{member.points} امتیاز</p>
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      سطح {member.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most Upvoted Projects */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">پروژه‌های محبوب</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {mostUpvoted.slice(0, 5).map((project, index) => (
                  <div key={project.id} className="flex items-center">
                    <div className="w-8 text-center font-bold text-gray-400">
                      #{index + 1}
                    </div>
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1 mr-3">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-gray-600">
                        {project.owner.displayName || project.owner.username}
                      </p>
                    </div>
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded flex items-center">
                      <span className="mr-1">{project.upvotesCount}</span>
                      <span>👍</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
