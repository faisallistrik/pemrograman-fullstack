import './bootstrap'
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute, PublicRoute, AdminRoute } from './Components/ProtectedRoute'

// Pages
import Login from './Pages/Login'
import Register from './Pages/Register'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import Dashboard from './Pages/Dashboard'
import Equipment from './Pages/Equipment'
import Rooms from './Pages/Rooms'
import Bookings from './Pages/Bookings'
import ActivityLog from './Pages/ActivityLog'

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/equipment" element={<AdminRoute><Equipment /></AdminRoute>} />
          <Route path="/rooms" element={<AdminRoute><Rooms /></AdminRoute>} />
          <Route path="/activity-logs" element={<AdminRoute><ActivityLog /></AdminRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  )
}

const root = createRoot(document.getElementById('app'))
root.render(<App />)
