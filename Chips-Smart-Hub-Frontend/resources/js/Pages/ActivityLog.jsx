import { useState, useEffect } from 'react'
import AppLayout from '../Layouts/AppLayout'
import Pagination from '../Components/Pagination'
import activityLogService from '../lib/activityLogService'

const actionLabels = {
  created: 'Membuat',
  updated: 'Memperbarui',
  deleted: 'Menghapus',
  approved: 'Menyetujui',
  rejected: 'Menolak',
  checked_in: 'Check-in',
  completed: 'Menyelesaikan',
}

const actionBadgeClass = {
  created: 'bg-green-100 text-green-800',
  updated: 'bg-blue-100 text-blue-800',
  deleted: 'bg-red-100 text-red-800',
  approved: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  checked_in: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-emerald-100 text-emerald-800',
}

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadLogs()
  }, [page])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const response = await activityLogService.getAll({ page })
      setLogs(Array.isArray(response) ? response : response.data || [])
      setLastPage(response.last_page || 1)
      setTotal(response.total ?? 0)
      setError('')
    } catch (err) {
      setError('Gagal memuat log aktivitas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-600 mt-2">Riwayat perubahan data oleh seluruh pengguna.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">Belum ada aktivitas tercatat</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className={`inline-block w-fit px-2 py-1 rounded text-xs font-medium ${actionBadgeClass[log.action] || 'bg-gray-100 text-gray-800'}`}>
                  {actionLabels[log.action] || log.action}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{log.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.user?.name || 'Sistem'} &middot; {formatDate(log.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={page} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
    </AppLayout>
  )
}
