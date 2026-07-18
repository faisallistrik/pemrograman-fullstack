import { useState } from 'react'
import GuestLayout from '../Layouts/GuestLayout'
import authService from '../lib/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      setMessage(response.message || 'Jika email terdaftar, instruksi reset password telah dikirim.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengirim permintaan reset password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Lupa Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Masukkan email Anda, kami akan mengirimkan token untuk reset password.
        </p>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

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
            placeholder="admin@smart-hub.local"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Mengirim...' : 'Kirim Instruksi Reset'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Ingat password Anda?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Login di sini
          </a>
        </div>
      </form>
    </GuestLayout>
  )
}
