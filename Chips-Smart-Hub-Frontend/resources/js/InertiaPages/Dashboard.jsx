import NotificationBell from '../Components/NotificationBell'

export default function Dashboard({ user, stats }) {
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    document.cookie = 'api_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/dashboard" className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-indigo-600">Smart-Hub</span>
              <span className="hidden lg:inline text-xs text-gray-400">Asset & Booking Management</span>
            </a>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <span className="text-gray-700 text-sm hidden sm:inline">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-md bg-indigo-50 text-indigo-600 font-medium">
              Dashboard
            </a>
            {isAdmin && (
              <>
                <a href="/equipment" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
                  Equipment
                </a>
                <a href="/rooms" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
                  Rooms
                </a>
                <a href="/activity-logs" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
                  Log Aktivitas
                </a>
              </>
            )}
            <a href="/bookings" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
              Bookings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Selamat datang, {user?.name}!</h1>
              <p className="text-gray-600 mt-2">Smart-Hub: Asset & Booking Management</p>
              <p className="text-xs text-gray-400 mt-1">Halaman ini dirender server-side lewat Inertia.js</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Equipment</div>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">{stats?.total_equipment ?? 0}</div>
                    <div className="text-xs text-gray-400 mt-1">{stats?.available_equipment ?? 0} tersedia</div>
                  </div>
                  <div className="text-indigo-100 text-3xl">📦</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Ruangan</div>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">{stats?.total_rooms ?? 0}</div>
                    <div className="text-xs text-gray-400 mt-1">{stats?.available_rooms ?? 0} tersedia</div>
                  </div>
                  <div className="text-indigo-100 text-3xl">🏢</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      {isAdmin ? 'Booking Sedang Berjalan' : 'Booking Saya Sedang Berjalan'}
                    </div>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">{stats?.active_bookings ?? 0}</div>
                  </div>
                  <div className="text-indigo-100 text-3xl">📅</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      {isAdmin ? 'Menunggu Persetujuan' : 'Booking Saya Menunggu'}
                    </div>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">{stats?.pending_bookings ?? 0}</div>
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
        </main>
      </div>
    </div>
  )
}
