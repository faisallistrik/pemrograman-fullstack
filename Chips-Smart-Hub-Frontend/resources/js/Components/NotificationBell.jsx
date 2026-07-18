import { useState, useEffect, useRef } from 'react'
import notificationService from '../lib/notificationService'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const containerRef = useRef(null)

  const load = async () => {
    try {
      const data = await notificationService.getAll()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread_count || 0)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = () => {
    setOpen((prev) => !prev)
    if (!open) load()
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      load()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      load()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none rounded-full h-4 min-w-[1rem] px-1 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">Notifikasi</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Tandai semua dibaca
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Belum ada notifikasi</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read_at && handleMarkAsRead(n.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${!n.read_at ? 'bg-indigo-50/50' : ''}`}
                >
                  <p className="text-sm font-medium text-gray-900">{n.data.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{n.data.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{formatDate(n.created_at)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
