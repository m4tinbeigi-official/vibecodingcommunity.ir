"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";

interface AnalyticsData {
  userGrowth: { thisMonth: number; lastMonth: number; total: number };
  projectGrowth: { thisMonth: number; lastMonth: number; total: number };
  activityStats: {
    totalActivities: number;
    totalPointsAwarded: number;
    totalBadgesAwarded: number;
    adminActions: number;
    userUpdates: number;
    projectUpdates: number;
  };
  levelDistribution: Array<{ level: number; name: string; count: number }>;
  recentActivities: Array<any>;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }

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

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">خطا در بارگذاری اطلاعات</p>
        </div>
      </DashboardLayout>
    );
  }

  const {
    userGrowth,
    projectGrowth,
    activityStats,
    levelDistribution,
    recentActivities,
  } = analytics as {
    userGrowth: { thisMonth: number; lastMonth: number; total: number };
    projectGrowth: { thisMonth: number; lastMonth: number; total: number };
    activityStats: {
      totalActivities: number;
      totalPointsAwarded: number;
      totalBadgesAwarded: number;
      adminActions: number;
      userUpdates: number;
      projectUpdates: number;
    };
    levelDistribution: Array<{ level: number; name: string; count: number }>;
    recentActivities: Array<any>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">آمار و تحلیل</h1>
          <p className="text-gray-600 mt-1">آمار جامع جامعه</p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">آمار فعالیت‌ها</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">کل فعالیت‌ها:</span>
                <span className="font-bold">{activityStats?.totalActivities || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">امتیازهای داده شده:</span>
                <span className="font-bold">{activityStats?.totalPointsAwarded || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">نشان‌های داده شده:</span>
                <span className="font-bold">{activityStats?.totalBadgesAwarded || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">توزیع سطوح</h3>
            <div className="space-y-3">
              {levelDistribution?.map((level: any) => (
                <div key={level.level} className="flex justify-between items-center">
                  <span className="text-gray-600">{level.name}:</span>
                  <div className="flex items-center">
                    <span className="font-bold ml-2">{level.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(level.count / (levelDistribution?.reduce((sum: number, l: any) => sum + l.count, 0) || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )) || <p className="text-gray-500">داده‌ای موجود نیست</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">عملیات ادمین</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">کل عملیات:</span>
                <span className="font-bold">{activityStats?.adminActions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تغییرات کاربر:</span>
                <span className="font-bold">{activityStats?.userUpdates || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تغییرات پروژه:</span>
                <span className="font-bold">{activityStats?.projectUpdates || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">رشد کاربران</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userGrowth?.thisMonth || 0}</div>
                <div className="text-sm text-gray-600">این ماه</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userGrowth?.lastMonth || 0}</div>
                <div className="text-sm text-gray-600">ماه قبل</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userGrowth?.total || 0}</div>
                <div className="text-sm text-gray-600">کل</div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">رشد پروژه‌ها</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{projectGrowth?.thisMonth || 0}</div>
                <div className="text-sm text-gray-600">این ماه</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{projectGrowth?.lastMonth || 0}</div>
                <div className="text-sm text-gray-600">ماه قبل</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{projectGrowth?.total || 0}</div>
                <div className="text-sm text-gray-600">کل</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">آخرین فعالیت‌ها</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentActivities?.length === 0 ? (
                <p className="text-center text-gray-500 py-4">هیچ فعالیتی ثبت نشده</p>
              ) : (
                recentActivities?.slice(0, 10).map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={activity.user.avatarUrl || "/default-avatar.png"}
                        alt={activity.user.displayName || activity.user.username}
                        className="w-8 h-8 rounded-full ml-3"
                      />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">
                            {activity.user.displayName || activity.user.username}
                          </span>{" "}
                          <span className="text-gray-600">{activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>
                    {activity.points > 0 && (
                      <div className="text-green-600 font-bold">+{activity.points}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
