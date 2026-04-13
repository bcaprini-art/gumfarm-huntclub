import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { api } from './lib/api'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Book from './pages/Book'
import MyBookings from './pages/MyBookings'
import MyBirds from './pages/MyBirds'
import Billing from './pages/Billing'
import Profile from './pages/Profile'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminMembers from './pages/Admin/Members'
import AdminBookings from './pages/Admin/Bookings'
import AdminBirds from './pages/Admin/Birds'
import AdminBilling from './pages/Admin/Billing'
import Navbar from './components/Navbar'

export const AuthContext = createContext(null)
export function useAuth() { return useContext(AuthContext) }

function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('gumfarm_token')
    if (token) {
      api.me().then(u => setUser(u)).catch(() => localStorage.removeItem('gumfarm_token')).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('gumfarm_token', token)
    setUser(userData)
  }
  const logout = () => {
    localStorage.removeItem('gumfarm_token')
    setUser(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-green-900">
      <div className="text-white text-xl font-serif">Loading...</div>
    </div>
  )

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {user && <Navbar />}
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/book" element={<PrivateRoute><Book /></PrivateRoute>} />
            <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/my-birds" element={<PrivateRoute><MyBirds /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/members" element={<PrivateRoute adminOnly><AdminMembers /></PrivateRoute>} />
            <Route path="/admin/bookings" element={<PrivateRoute adminOnly><AdminBookings /></PrivateRoute>} />
            <Route path="/admin/birds" element={<PrivateRoute adminOnly><AdminBirds /></PrivateRoute>} />
            <Route path="/admin/billing" element={<PrivateRoute adminOnly><AdminBilling /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
