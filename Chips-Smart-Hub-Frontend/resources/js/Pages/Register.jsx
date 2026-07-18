import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuestLayout from '../Layouts/GuestLayout'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.password_confirmation) {
      setError('Password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)

    try {
      await register(
        formData.name,
        formData.email,
        formData.password
      )
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Registrasi gagal. Periksa kembali data Anda.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-heading font-bold text-center text-ink dark:text-white mb-6">
          Daftar ke smarthub
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="user@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Konfirmasi Password
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-ink dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Daftar'}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Sudah punya akun?{' '}
          <a href="/login" className="text-primary hover:opacity-80 font-medium">
            Login di sini
          </a>
        </div>
      </form>
    </GuestLayout>
  )
}
