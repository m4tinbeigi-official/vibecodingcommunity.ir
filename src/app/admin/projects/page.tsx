"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/admin/projects");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleProjectAction(projectId: string, action: string, value?: any) {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, action, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Refresh projects
      await fetchProjects();
      setShowModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("خطا در بروزرسانی پروژه");
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت پروژه‌ها</h1>
          <p className="text-gray-600 mt-1">مدیریت تمام پروژه‌های جامعه</p>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پروژه
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    صاحب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دسته‌بندی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تایید
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    امتیاز
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
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      هیچ پروژه‌ای یافت نشد
                    </td>
                  </tr>
                ) : (
                  projects.map((project: any) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {project.imageUrl ? (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                          )}
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {project.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              project.owner.avatarUrl ||
                              "/default-avatar.png"
                            }
                            alt={project.owner.displayName || project.owner.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="mr-2">
                            <div className="text-sm text-gray-900">
                              {project.owner.displayName ||
                                project.owner.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.approvalStatus === "approved" ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            تایید شده
                          </span>
                        ) : project.approvalStatus === "rejected" ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            رد شده
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            در انتظار
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === "launched"
                              ? "bg-green-100 text-green-800"
                              : project.status === "mvp"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "in_development"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status === "launched"
                            ? "منتشر شده"
                            : project.status === "mvp"
                            ? "MVP"
                            : project.status === "in_development"
                            ? "در حال توسعه"
                            : "ایده"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.upvotesCount} 👍
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.featured ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                ویژه
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                عادی
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          مدیریت
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Modal */}
        {showModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">مدیریت پروژه</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedProject.title}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProject.shortDescription}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تایید انتشار
                  </label>
                  <div className="flex gap-2">
                    {selectedProject.approvalStatus !== "approved" && (
                      <button
                        onClick={() => handleProjectAction(selectedProject.id, "approve")}
                        className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                      >
                        تایید و انتشار
                      </button>
                    )}
                    {selectedProject.approvalStatus !== "rejected" && (
                      <button
                        onClick={() => handleProjectAction(selectedProject.id, "reject")}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        رد کردن
                      </button>
                    )}
                    {selectedProject.approvalStatus !== "pending" && (
                      <button
                        onClick={() => handleProjectAction(selectedProject.id, "pending")}
                        className="flex-1 px-3 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
                      >
                        برگشت به انتظار
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت ویژه بودن
                  </label>
                  <button
                    onClick={() =>
                      handleProjectAction(
                        selectedProject.id,
                        "feature",
                        !selectedProject.featured
                      )
                    }
                    className={`w-full px-3 py-2 rounded ${
                      selectedProject.featured
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedProject.featured
                      ? "حذف از ویژه‌ها"
                      : "افزودن به ویژه‌ها"}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عملیات خطرناک
                  </label>
                  <button
                    onClick={() => {
                      if (confirm("آیا از حذف این پروژه اطمینان دارید؟")) {
                        handleProjectAction(selectedProject.id, "delete");
                      }
                    }}
                    className="w-full px-3 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    حذف پروژه
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
