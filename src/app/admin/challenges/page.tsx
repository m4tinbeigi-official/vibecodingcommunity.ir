"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default function AdminChallenges() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    rules: "",
    startDate: "",
    endDate: "",
    pointsReward: "0",
    prize: "",
    status: "upcoming",
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const response = await fetch("/api/admin/challenges");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch challenges");
      }
      const data = await response.json();
      setChallenges(data.challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingChallenge
        ? `/api/admin/challenges?id=${editingChallenge.id}`
        : "/api/admin/challenges";

      const response = await fetch(url, {
        method: editingChallenge ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
          pointsReward: parseInt(formData.pointsReward),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save challenge");
      }

      await fetchChallenges();
      setShowCreateModal(false);
      setEditingChallenge(null);
      setFormData({
        title: "",
        shortDescription: "",
        fullDescription: "",
        rules: "",
        startDate: "",
        endDate: "",
        pointsReward: "0",
        prize: "",
        status: "upcoming",
      });
    } catch (error) {
      console.error("Error saving challenge:", error);
      alert("خطا در ذخیره چالش");
    }
  }

  async function handleChallengeAction(challengeId: string, action: string, value?: any) {
    try {
      const response = await fetch("/api/admin/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, action, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update challenge");
      }

      await fetchChallenges();
    } catch (error) {
      console.error("Error updating challenge:", error);
      alert("خطا در بروزرسانی چالش");
    }
  }

  function openEditModal(challenge: any) {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      shortDescription: challenge.shortDescription,
      fullDescription: challenge.fullDescription,
      rules: challenge.rules || "",
      startDate: new Date(challenge.startDate).toISOString().slice(0, 16),
      endDate: new Date(challenge.endDate).toISOString().slice(0, 16),
      pointsReward: challenge.pointsReward.toString(),
      prize: challenge.prize || "",
      status: challenge.status,
    });
    setShowCreateModal(true);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت چالش‌ها</h1>
            <p className="text-gray-600 mt-1">مدیریت تمام چالش‌های جامعه</p>
          </div>
          <button
            onClick={() => {
              setEditingChallenge(null);
              setFormData({
                title: "",
                shortDescription: "",
                fullDescription: "",
                rules: "",
                startDate: "",
                endDate: "",
                pointsReward: "0",
                prize: "",
                status: "upcoming",
              });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ایجاد چالش جدید
          </button>
        </div>

        {/* Challenges List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    امتیاز
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ شروع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ پایان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {challenges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      هیچ چالشی وجود ندارد
                    </td>
                  </tr>
                ) : (
                  challenges.map((challenge: any) => (
                    <tr key={challenge.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {challenge.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {challenge.shortDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          challenge.status === "active" ? "bg-green-100 text-green-800" :
                          challenge.status === "completed" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {challenge.status === "active" ? "فعال" :
                           challenge.status === "completed" ? "تکمیل شده" :
                           "آتی"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {challenge.pointsReward} امتیاز
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(challenge.startDate).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(challenge.endDate).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="px-6 py-4 text-sm space-y-2 space-x-2">
                        <button
                          onClick={() => openEditModal(challenge)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ویرایش
                        </button>
                        {challenge.status === "active" && (
                          <button
                            onClick={() => handleChallengeAction(challenge.id, "close")}
                            className="text-red-600 hover:text-red-800"
                          >
                            بستن
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingChallenge ? "ویرایش چالش" : "ایجاد چالش جدید"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیح کوتاه
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیح کامل
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قوانین
                  </label>
                  <textarea
                    rows={3}
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاریخ شروع
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاریخ پایان
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      امتیاز جایزه
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.pointsReward}
                      onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      جایزه
                    </label>
                    <input
                      type="text"
                      value={formData.prize}
                      onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضعیت
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upcoming">آتی</option>
                    <option value="active">فعال</option>
                    <option value="completed">تکمیل شده</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingChallenge(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingChallenge ? "بروزرسانی" : "ایجاد"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
