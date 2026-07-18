import { useState } from 'react'
import NotificationBell from '../Components/NotificationBell'
import ThemeToggle from '../Components/ThemeToggle'
import Logo from '../Components/Logo'

export default function Dashboard({ user, stats }) {
  const isAdmin = user?.role === 'admin'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    document.cookie = 'api_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-ink transition-colors">
      {/* Navbar */}
      <nav className="bg-white dark:bg-ink-soft shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <a href="/dashboard" className="ml-4">
                <Logo className="h-8" />
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <NotificationBell />
              <span className="text-gray-700 dark:text-gray-300 text-sm hidden sm:inline">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white dark:bg-ink-soft border-r border-gray-200 dark:border-white/10 min-h-screen transition-colors`}>
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-md bg-primary/10 text-primary dark:text-primary-dark font-medium">
              Dashboard
            </a>
            {isAdmin && (
              <>
                <a href="/equipment" className="block px-4 py-2 rounded-md hover:bg-primary/10 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-dark transition">
                  Equipment
                </a>
                <a href="/rooms" className="block px-4 py-2 rounded-md hover:bg-primary/10 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-dark transition">
                  Rooms
                </a>
                <a href="/activity-logs" className="block px-4 py-2 rounded-md hover:bg-primary/10 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-dark transition">
                  Log Aktivitas
                </a>
              </>
            )}
            <a href="/bookings" className="block px-4 py-2 rounded-md hover:bg-primary/10 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-dark transition">
              Bookings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-extrabold text-ink dark:text-white">Selamat datang, {user?.name}!</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">smarthub: Asset & Booking Management</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Halaman ini dirender server-side lewat Inertia.js</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white dark:bg-ink-soft rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Equipment</div>
                    <div className="text-3xl font-bold text-primary dark:text-primary-dark mt-2">{stats?.total_equipment ?? 0}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stats?.available_equipment ?? 0} tersedia</div>
                  </div>
                  <div className="text-primary/20 dark:text-primary-dark/20 text-3xl">📦</div>
                </div>
              </div>

              <div className="bg-white dark:bg-ink-soft rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Ruangan</div>
                    <div className="text-3xl font-bold text-primary dark:text-primary-dark mt-2">{stats?.total_rooms ?? 0}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stats?.available_rooms ?? 0} tersedia</div>
                  </div>
                  <div className="text-primary/20 dark:text-primary-dark/20 text-3xl">🏢</div>
                </div>
              </div>

              <div className="bg-white dark:bg-ink-soft rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isAdmin ? 'Booking Sedang Berjalan' : 'Booking Saya Sedang Berjalan'}
                    </div>
                    <div className="text-3xl font-bold text-info mt-2">{stats?.active_bookings ?? 0}</div>
                  </div>
                  <div className="text-info/20 text-3xl">📅</div>
                </div>
              </div>

              <div className="bg-white dark:bg-ink-soft rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {isAdmin ? 'Menunggu Persetujuan' : 'Booking Saya Menunggu'}
                    </div>
                    <div className="text-3xl font-bold text-warning mt-2">{stats?.pending_bookings ?? 0}</div>
                  </div>
                  <div className="text-warning/20 text-3xl">✅</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-ink-soft rounded-lg shadow p-6">
              <h2 className="text-xl font-heading font-semibold text-ink dark:text-white mb-4">Tentang smarthub</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sistem manajemen terpadu untuk mengelola peminjaman ruangan, inventaris peralatan, dan status check-in dengan mudah dan efisien.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold text-ink dark:text-white mb-2">📊 Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pantau semua data dan statistik secara real-time</p>
                </div>
                <div className="p-4 bg-info/10 rounded-lg">
                  <h3 className="font-semibold text-ink dark:text-white mb-2">⚙️ Master Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kelola equipment dan ruangan dengan mudah</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg">
                  <h3 className="font-semibold text-ink dark:text-white mb-2">📝 Transaksi</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Atur booking dan check-in dengan cepat</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
