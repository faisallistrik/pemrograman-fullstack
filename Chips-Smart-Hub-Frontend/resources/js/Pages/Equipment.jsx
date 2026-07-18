import { useState, useEffect } from 'react'
import AppLayout from '../Layouts/AppLayout'
import Pagination from '../Components/Pagination'
import equipmentService from '../lib/equipmentService'

export default function Equipment() {
  const [equipmentList, setEquipmentList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    quantity: '',
    condition: 'Baik',
    status: 'Tersedia',
    description: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  // Fetch equipment list (server-side search + pagination)
  useEffect(() => {
    const timeout = setTimeout(() => loadEquipment(), 300)
    return () => clearTimeout(timeout)
  }, [searchTerm, page])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      const response = await equipmentService.getAll({ search: searchTerm || undefined, page })
      setEquipmentList(Array.isArray(response) ? response : response.data || [])
      setLastPage(response.last_page || 1)
      setTotal(response.total ?? (Array.isArray(response) ? response.length : 0))
      setError('')
    } catch (err) {
      setError('Gagal memuat data equipment')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await equipmentService.create(formData)
      setFormData({
        code: '',
        name: '',
        category: '',
        quantity: '',
        condition: 'Baik',
        status: 'Tersedia',
        description: '',
      })
      setShowModal(false)
      loadEquipment()
    } catch (err) {
      setError('Gagal membuat equipment')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus equipment ini?')) {
      try {
        await equipmentService.delete(id)
        loadEquipment()
      } catch (err) {
        setError('Gagal menghapus equipment')
      }
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-heading font-extrabold text-ink dark:text-white">Equipment Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + Tambah Equipment
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Cari berdasarkan kode atau nama..."
            value={searchTerm}
            onChange={(e) => {
              setPage(1)
              setSearchTerm(e.target.value)
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink-soft dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Equipment List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-ink-soft rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Belum ada equipment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {equipmentList.map((item) => (
              <div key={item.id} className="bg-white dark:bg-ink-soft rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-ink dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.code}</p>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium text-ink dark:text-white">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                    <span className="font-medium text-ink dark:text-white">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                    <span className="font-medium text-ink dark:text-white">{item.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'Tersedia'
                          ? 'bg-primary/10 text-primary dark:text-primary-dark'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 py-2 rounded hover:bg-red-100 dark:hover:bg-red-500/20 transition text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={page} lastPage={lastPage} total={total} onPageChange={setPage} />

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-ink-soft rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-heading font-bold text-ink dark:text-white mb-4">Tambah Equipment</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kode Equipment
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="EQ-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Equipment
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Projector"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="A/V"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kondisi
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option>Baik</option>
                      <option>Rusak</option>
                      <option>Perbaikan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option>Tersedia</option>
                      <option>Dipinjam</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Deskripsi..."
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
                  >
                    Simpan
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
