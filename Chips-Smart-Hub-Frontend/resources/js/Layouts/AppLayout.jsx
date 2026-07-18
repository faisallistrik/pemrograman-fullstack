import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from '../Components/NotificationBell'
import ThemeToggle from '../Components/ThemeToggle'
import Logo from '../Components/Logo'

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    document.cookie = 'api_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-ink transition-colors">
      {/* Navbar */}
      <nav className="bg-white dark:bg-ink-soft shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
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

            {/* User Menu */}
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
            <a href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-primary/10 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-dark transition">
              Dashboard
            </a>
            {user?.role === 'admin' && (
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
          {children}
        </main>
      </div>
    </div>
  )
}
