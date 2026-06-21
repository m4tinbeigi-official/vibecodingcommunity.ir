'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/admin/DashboardLayout'
import { Copy, Trash2, Plus } from 'lucide-react'

interface Server {
  id: string
  name: string
  ipAddress: string
  operatingSystem: string
  cpu: string
  ram: string
  storage: string
  macAddress?: string
  username: string
  password: string
  description?: string
  createdAt: string
}

export default function AdminServers() {
  const router = useRouter()
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    operatingSystem: '',
    cpu: '',
    ram: '',
    storage: '',
    macAddress: '',
    username: '',
    password: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchServers()
  }, [])

  async function fetchServers() {
    try {
      const response = await fetch('/api/admin/servers')
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch servers')
      }
      const data = await response.json()
      setServers(data.servers)
    } catch (err) {
      console.error('Error fetching servers:', err)
      setError('خطا در بارگذاری سرورها')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddServer(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      setSuccess('سرور با موفقیت اضافه شد')
      setFormData({
        name: '',
        ipAddress: '',
        operatingSystem: '',
        cpu: '',
        ram: '',
        storage: '',
        macAddress: '',
        username: '',
        password: '',
        description: '',
      })
      setShowForm(false)
      await fetchServers()
    } catch (err: any) {
      setError(err.message || 'خطا در اضافه کردن سرور')
    }
  }

  async function handleDeleteServer(serverId: string) {
    if (!confirm('آیا از حذف این سرور اطمینان دارید؟')) return

    try {
      const response = await fetch(`/api/admin/servers/${serverId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')
      setSuccess('سرور حذف شد')
      await fetchServers()
    } catch (err) {
      setError('خطا در حذف سرور')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setSuccess('کپی شد!')
    setTimeout(() => setSuccess(''), 2000)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت سرورها</h1>
            <p className="text-gray-600 mt-1">مدیریت تمام سرورهای پروژه</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            سرور جدید
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {success}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAddServer} className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="نام سرور"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border rounded text-right"
                required
              />
              <input
                type="text"
                placeholder="IP Address"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="px-4 py-2 border rounded text-right"
                required
              />
              <input
                type="text"
                placeholder="سیستم عامل"
                value={formData.operatingSystem}
                onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                className="px-4 py-2 border rounded text-right"
              />
              <input
                type="text"
                placeholder="CPU"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                className="px-4 py-2 border rounded text-right"
              />
              <input
                type="text"
                placeholder="RAM"
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                className="px-4 py-2 border rounded text-right"
              />
              <input
                type="text"
                placeholder="Storage"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                className="px-4 py-2 border rounded text-right"
              />
              <input
                type="text"
                placeholder="MAC Address"
                value={formData.macAddress}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                className="px-4 py-2 border rounded text-right"
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="px-4 py-2 border rounded text-right"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="px-4 py-2 border rounded text-right"
                required
              />
            </div>
            <textarea
              placeholder="توضیحات"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded text-right"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                اضافه کردن
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                لغو
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">IP</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">OS</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">CPU/RAM</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {servers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      هیچ سرویری یافت نشد
                    </td>
                  </tr>
                ) : (
                  servers.map((server) => (
                    <tr key={server.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{server.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {server.ipAddress}
                          <button
                            onClick={() => copyToClipboard(server.ipAddress)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{server.operatingSystem}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{server.cpu} / {server.ram}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {server.username}
                          <button
                            onClick={() => copyToClipboard(server.username)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteServer(server.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
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
      </div>
    </DashboardLayout>
  )
}
