import { useState, useEffect } from 'react'
import AppLayout from '../Layouts/AppLayout'
import Pagination from '../Components/Pagination'
import bookingService from '../lib/bookingService'
import equipmentService from '../lib/equipmentService'
import roomService from '../lib/roomService'
import { useAuth } from '../contexts/AuthContext'

export default function Bookings() {
  const { user } = useAuth()
  const [bookingsList, setBookingsList] = useState([])
  const [equipment, setEquipment] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [formData, setFormData] = useState({
    equipment_id: '',
    room_id: '',
    start_time: '',
    end_time: '',
    purpose: '',
  })

  // Fetch pickers (equipment/room) once — full list, not paginated
  useEffect(() => {
    loadPickers()
  }, [])

  // Fetch bookings whenever filter/page changes
  useEffect(() => {
    loadBookings()
  }, [filterStatus, page])

  const loadPickers = async () => {
    try {
      const [equipmentRes, roomsRes] = await Promise.all([
        equipmentService.getAll({ per_page: 100 }),
        roomService.getAll({ per_page: 100 }),
      ])

      setEquipment(Array.isArray(equipmentRes) ? equipmentRes : equipmentRes.data || [])
      setRooms(Array.isArray(roomsRes) ? roomsRes : roomsRes.data || [])
    } catch (err) {
      setError('Gagal memuat data equipment/ruangan')
      console.error(err)
    }
  }

  const loadBookings = async () => {
    try {
      setLoading(true)
      const bookingsRes = await bookingService.getAll({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        page,
      })

      setBookingsList(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes.data || [])
      setLastPage(bookingsRes.last_page || 1)
      setTotal(bookingsRes.total ?? (Array.isArray(bookingsRes) ? bookingsRes.length : 0))
      setError('')
    } catch (err) {
      setError('Gagal memuat data booking')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadAllData = () => {
    loadPickers()
    loadBookings()
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.equipment_id && !formData.room_id) {
      setError('Pilih minimal salah satu: Equipment atau Ruangan.')
      return
    }

    try {
      await bookingService.create({
        ...formData,
        equipment_id: formData.equipment_id || null,
        room_id: formData.room_id || null,
        user_id: user?.id,
      })
      setFormData({
        equipment_id: '',
        room_id: '',
        start_time: '',
        end_time: '',
        purpose: '',
      })
      setShowModal(false)
      loadAllData()
    } catch (err) {
      setError('Gagal membuat booking')
    }
  }

  const handleCheckIn = async (id) => {
    try {
      await bookingService.checkIn(id)
      loadAllData()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal check-in')
    }
  }

  const handleApprove = async (id) => {
    try {
      await bookingService.approve(id)
      loadAllData()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyetujui booking')
    }
  }

  const handleReject = async (id) => {
    if (window.confirm('Tolak/batalkan booking ini?')) {
      try {
        await bookingService.reject(id)
        loadAllData()
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menolak booking')
      }
    }
  }

  const handleComplete = async (id) => {
    try {
      await bookingService.complete(id)
      loadAllData()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyelesaikan booking')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus booking ini?')) {
      try {
        await bookingService.delete(id)
        loadAllData()
      } catch (err) {
        setError('Gagal menghapus booking')
      }
    }
  }

  const getEquipmentName = (id) => {
    return equipment.find((e) => e.id === id)?.name || '-'
  }

  const getRoomName = (id) => {
    return rooms.find((r) => r.id === id)?.name || '-'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  const statusLabels = {
    pending: 'Pending',
    approved: 'Disetujui',
    checked_in: 'Checked-in',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  const statusBadgeClass = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-purple-100 text-purple-800',
    checked_in: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Buat Booking
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'checked_in', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setPage(1)
                setFilterStatus(status)
              }}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'Semua' : statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : bookingsList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">Belum ada booking</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {bookingsList.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="mb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Booking #{booking.id}
                    </h3>
                    <p className="text-sm text-gray-500">{booking.purpose}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${statusBadgeClass[booking.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {statusLabels[booking.status] || booking.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium">{getEquipmentName(booking.equipment_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ruangan:</span>
                    <span className="font-medium">{getRoomName(booking.room_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mulai:</span>
                    <span className="font-medium">{formatDate(booking.start_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selesai:</span>
                    <span className="font-medium">{formatDate(booking.end_time)}</span>
                  </div>
                  {booking.check_in_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{formatDate(booking.check_in_at)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {booking.status === 'pending' && user?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="flex-1 bg-purple-50 text-purple-600 py-2 rounded hover:bg-purple-100 transition text-sm font-medium"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition text-sm font-medium"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <button
                      onClick={() => handleCheckIn(booking.id)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition text-sm font-medium"
                    >
                      Check-in
                    </button>
                  )}
                  {booking.status === 'checked_in' && (
                    <button
                      onClick={() => handleComplete(booking.id)}
                      className="flex-1 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 transition text-sm font-medium"
                    >
                      Selesai / Kembalikan
                    </button>
                  )}
                  {!['completed', 'cancelled'].includes(booking.status) && (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex-1 bg-gray-100 text-gray-600 py-2 rounded hover:bg-gray-200 transition text-sm font-medium"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={page} lastPage={lastPage} total={total} onPageChange={setPage} />

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Buat Booking</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-gray-500 -mb-2">Pilih minimal salah satu: Equipment atau Ruangan.</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment
                  </label>
                  <select
                    name="equipment_id"
                    value={formData.equipment_id}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Tidak perlu equipment</option>
                    {equipment.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ruangan
                  </label>
                  <select
                    name="room_id"
                    value={formData.room_id}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Tidak perlu ruangan</option>
                    {rooms.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keperluan
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Keperluan booking..."
                    rows="3"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Buat Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
