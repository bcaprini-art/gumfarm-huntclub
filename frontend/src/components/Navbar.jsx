import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isAdmin = user?.role === 'ADMIN'
  const active = (path) => location.pathname === path ? 'text-tan-300 border-b-2 border-tan-300' : 'text-white hover:text-tan-200'

  return (
    <nav className="bg-green-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Gumfarm Hunt Club" className="h-10 w-10 rounded-full object-cover border-2 border-tan-300" />
            <span className="text-white font-serif text-lg font-bold hidden sm:block">Gumfarm Hunt Club</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAdmin ? (
              <>
                <Link to="/admin" className={`text-sm font-medium pb-1 ${active('/admin')}`}>Dashboard</Link>
                <Link to="/admin/bookings" className={`text-sm font-medium pb-1 ${active('/admin/bookings')}`}>Bookings</Link>
                <Link to="/admin/members" className={`text-sm font-medium pb-1 ${active('/admin/members')}`}>Members</Link>
                <Link to="/admin/birds" className={`text-sm font-medium pb-1 ${active('/admin/birds')}`}>Birds</Link>
                <Link to="/admin/billing" className={`text-sm font-medium pb-1 ${active('/admin/billing')}`}>Billing</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={`text-sm font-medium pb-1 ${active('/dashboard')}`}>Home</Link>
                <Link to="/book" className={`text-sm font-medium pb-1 ${active('/book')}`}>Book a Hunt</Link>
                <Link to="/my-bookings" className={`text-sm font-medium pb-1 ${active('/my-bookings')}`}>My Hunts</Link>
                <Link to="/my-birds" className={`text-sm font-medium pb-1 ${active('/my-birds')}`}>My Birds</Link>
                <Link to="/billing" className={`text-sm font-medium pb-1 ${active('/billing')}`}>Billing</Link>
              </>
            )}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-green-600">
              <span className="text-tan-200 text-sm">{user?.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-sm text-white bg-green-700 hover:bg-green-600 px-3 py-1 rounded">Logout</button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-green-700 space-y-2">
            {isAdmin ? (
              <>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-white py-1">Dashboard</Link>
                <Link to="/admin/bookings" onClick={() => setMenuOpen(false)} className="block text-white py-1">Bookings</Link>
                <Link to="/admin/members" onClick={() => setMenuOpen(false)} className="block text-white py-1">Members</Link>
                <Link to="/admin/birds" onClick={() => setMenuOpen(false)} className="block text-white py-1">Birds</Link>
                <Link to="/admin/billing" onClick={() => setMenuOpen(false)} className="block text-white py-1">Billing</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-white py-1">Home</Link>
                <Link to="/book" onClick={() => setMenuOpen(false)} className="block text-white py-1">Book a Hunt</Link>
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block text-white py-1">My Hunts</Link>
                <Link to="/my-birds" onClick={() => setMenuOpen(false)} className="block text-white py-1">My Birds</Link>
                <Link to="/billing" onClick={() => setMenuOpen(false)} className="block text-white py-1">Billing</Link>
              </>
            )}
            <button onClick={handleLogout} className="block text-rust-500 py-1 font-medium">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
