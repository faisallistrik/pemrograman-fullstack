import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <a href="/dashboard" className="ml-4 text-xl font-bold text-indigo-600">
                Smart-Hub
              </a>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
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
        <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r border-gray-200 min-h-screen`}>
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
              Dashboard
            </a>
            {user?.role === 'admin' && (
              <>
                <a href="/equipment" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
                  Equipment
                </a>
                <a href="/rooms" className="block px-4 py-2 rounded-md hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition">
                  Rooms
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
          {children}
        </main>
      </div>
    </div>
  )
}
