"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default function AdminResources() {
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "prompt",
    description: "",
    tags: "",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const response = await fetch("/api/admin/resources");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch resources");
      }
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingResource
        ? `/api/admin/resources?id=${editingResource.id}`
        : "/api/admin/resources";

      const response = await fetch(url, {
        method: editingResource ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save resource");
      }

      await fetchResources();
      setShowCreateModal(false);
      setEditingResource(null);
      setFormData({
        title: "",
        content: "",
        type: "prompt",
        description: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error saving resource:", error);
      alert("خطا در ذخیره منبع");
    }
  }

  async function handleResourceAction(resourceId: string, action: string, value?: any) {
    try {
      const response = await fetch("/api/admin/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, action, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      await fetchResources();
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("خطا در بروزرسانی منبع");
    }
  }

  function openEditModal(resource: any) {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      content: resource.content,
      type: resource.type,
      description: resource.description || "",
      tags: Array.isArray(resource.tags) ? resource.tags.join(", ") : "",
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
            <h1 className="text-2xl font-bold text-gray-900">مدیریت منابع</h1>
            <p className="text-gray-600 mt-1">مدیریت منابع و پرامپت‌های جامعه</p>
          </div>
          <button
            onClick={() => {
              setEditingResource(null);
              setFormData({
                title: "",
                content: "",
                type: "prompt",
                description: "",
                tags: "",
              });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ایجاد منبع جدید
          </button>
        </div>

        {/* Resources List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نویسنده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    برچسب‌ها
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ویژه
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      هیچ منبعی وجود ندارد
                    </td>
                  </tr>
                ) : (
                  resources.map((resource: any) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {resource.title}
                        </div>
                        {resource.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {resource.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded bg-blue-100 text-blue-800`}>
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {resource.author?.displayName || resource.author?.username || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {Array.isArray(resource.tags) && resource.tags.length > 0
                          ? resource.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs ml-1">
                                {tag}
                              </span>
                            ))
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {resource.featured ? (
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                            ویژه
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm space-y-2 space-x-2">
                        <button
                          onClick={() => openEditModal(resource)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleResourceAction(resource.id, "feature", !resource.featured)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          {resource.featured ? "حذف ویژه" : "ویژه"}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("آیا مطمئن هستید؟")) {
                              handleResourceAction(resource.id, "delete");
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          حذف
                        </button>
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
                {editingResource ? "ویرایش منبع" : "ایجاد منبع جدید"}
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
                    نوع
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="prompt">پرامپت</option>
                    <option value="ai_tool">ابزار هوش مصنوعی</option>
                    <option value="mvp_checklist">چک‌لیست MVP</option>
                    <option value="tutorial">آموزش</option>
                    <option value="experience">تجربه</option>
                    <option value="beginner">مبتدی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    محتوا
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    برچسب‌ها (با کاما جدا کنید)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: ai, automation, n8n"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingResource(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingResource ? "بروزرسانی" : "ایجاد"}
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
