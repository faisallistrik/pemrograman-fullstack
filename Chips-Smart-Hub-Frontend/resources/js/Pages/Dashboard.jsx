import AppLayout from '../Layouts/AppLayout'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat datang, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Dashboard Smart-Hub Management System</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Total Equipment</div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">0</div>
              </div>
              <div className="text-indigo-100 text-3xl">📦</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Available Rooms</div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">0</div>
              </div>
              <div className="text-indigo-100 text-3xl">🏢</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Active Bookings</div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">0</div>
              </div>
              <div className="text-indigo-100 text-3xl">📅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Pending Check-ins</div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">0</div>
              </div>
              <div className="text-indigo-100 text-3xl">✅</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tentang Smart-Hub</h2>
          <p className="text-gray-600 mb-4">
            Sistem manajemen terpadu untuk mengelola peminjaman ruangan, inventaris peralatan, dan status check-in dengan mudah dan efisien.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">📊 Dashboard</h3>
              <p className="text-sm text-indigo-700">Pantau semua data dan statistik secara real-time</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">⚙️ Master Data</h3>
              <p className="text-sm text-blue-700">Kelola equipment dan ruangan dengan mudah</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-900 mb-2">📝 Transaksi</h3>
              <p className="text-sm text-cyan-700">Atur booking dan check-in dengan cepat</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
