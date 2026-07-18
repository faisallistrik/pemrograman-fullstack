import { useState } from 'react'
import GuestLayout from '../Layouts/GuestLayout'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { token } = await login(email, password)
      // Dashboard is server-rendered via Inertia, so it needs the token
      // available to the Laravel backend (cookie) — a full navigation
      // (not client-side routing) is required to actually hit that route.
      document.cookie = `api_token=${token}; path=/;`
      window.location.href = '/dashboard'
    } catch (err) {
      const message = err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Login ke Smart-Hub
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="admin@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Lupa password?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Daftar di sini
          </a>
        </div>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        <p className="font-semibold mb-2">Demo Credentials:</p>
        <p>Email: admin@smart-hub.local</p>
        <p>Password: password</p>
      </div>
    </GuestLayout>
  )
}
