"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default function AdminBadges() {
  const router = useRouter();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [badgeUsers, setBadgeUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchBadges();
  }, []);

  async function fetchBadges() {
    try {
      const response = await fetch("/api/admin/badges");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch badges");
      }
      const data = await response.json();
      setBadges(data.badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBadgeAction(badgeId: string, action: string, value?: any) {
    try {
      const response = await fetch("/api/admin/badges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeId, action, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update badge");
      }

      await fetchBadges();
    } catch (error) {
      console.error("Error updating badge:", error);
      alert("خطا در بروزرسانی نشان");
    }
  }

  async function viewBadgeUsers(badge: any) {
    setSelectedBadge(badge);
    setBadgeUsers(badge.users || []);
    setShowUsersModal(true);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت نشان‌ها</h1>
          <p className="text-gray-600 mt-1">مدیریت تمام نشان‌های جامعه</p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge: any) => (
            <div key={badge.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="text-4xl mr-3">{badge.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-500">{badge.nameEn}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  badge.category === "achievement" ? "bg-purple-100 text-purple-800" :
                  badge.category === "skill" ? "bg-blue-100 text-blue-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {badge.category === "achievement" ? "دستاورد" :
                   badge.category === "skill" ? "مهارت" :
                   "جامعه"}
                </span>
              </div>

              {badge.description && (
                <p className="text-sm text-gray-600 mt-3">{badge.description}</p>
              )}

              {badge.requiredPoints > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  امتیاز مورد نیاز: {badge.requiredPoints}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => viewBadgeUsers(badge)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  مشاهده کاربران ({badge.users?.length || 0})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Users Modal */}
        {showUsersModal && selectedBadge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  کاربران دارای نشان {selectedBadge.name}
                </h2>
                <button
                  onClick={() => {
                    setShowUsersModal(false);
                    setSelectedBadge(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {badgeUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    هیچ کاربری این نشان را ندارد
                  </p>
                ) : (
                  badgeUsers.map((userBadge: any) => (
                    <div
                      key={userBadge.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <img
                          src={userBadge.user.avatarUrl || "/default-avatar.png"}
                          alt={userBadge.user.displayName || userBadge.user.username}
                          className="w-10 h-10 rounded-full ml-3"
                        />
                        <div>
                          <p className="font-medium">
                            {userBadge.user.displayName || userBadge.user.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            دریافت شده در: {new Date(userBadge.awardedAt).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("آیا مطمئن هستید که می‌خواهید این نشان را از این کاربر حذف کنید؟")) {
                            handleBadgeAction(selectedBadge.id, "revoke", userBadge.user.id);
                            setShowUsersModal(false);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
