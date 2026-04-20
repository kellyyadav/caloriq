import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './index.css'
import { supabase } from './lib/supabase'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import FoodAI from './pages/FoodAI'
import Calculator from './pages/Calculator'
import Progress from './pages/Progress'
import Exercise from './pages/Exercise'
import Skin from './pages/Skin'
import Plans from './pages/Plans'
import Profile from './pages/Profile'

// ─── SPLASH SCREEN ────────────────────────────────────
function Splash({ onDone }) {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => {
      setOut(true)
      setTimeout(onDone, 650)
    }, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`splash${out ? ' out' : ''}`}>
      <div className="splash-logo">CALORI<em>Q</em></div>
      <div className="splash-tag">Health & Calories Tracker</div>
      <div className="splash-quote">"All body types are beautiful."</div>
      <div className="splash-bar" />
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────
function Navbar({ user, dark, setDark }) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/food', label: 'Food & AI' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/progress', label: 'Progress' },
    { to: '/exercise', label: 'Exercise' },
    { to: '/skin', label: 'Skin' },
    { to: '/plans', label: 'Plans' },
    ...(user ? [{ to: '/profile', label: 'Profile' }] : [{ to: '/login', label: 'Login' }]),
  ]

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        CALORI<span>Q</span>
      </div>
      <div className="navbar-links">
        {links.map(l => (
          <button
            key={l.to}
            className={`nav-btn${path === l.to ? ' active' : ''}`}
            onClick={() => navigate(l.to)}
          >
            {l.label}
          </button>
        ))}
        <button className="theme-btn" onClick={() => setDark(!dark)}>
          {dark ? '☾ Dark' : '☀ Light'}
        </button>
      </div>
    </nav>
  )
}

// ─── PROTECTED ROUTE ──────────────────────────────────
function Protected({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

// ─── MAIN APP ─────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [user, setUser] = useState(null)
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null)
      setLoading(false)
    })
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.className = dark ? 'dark' : ''
  }, [dark])

  if (loading) return null

  return (
    <BrowserRouter>
      {showSplash && <Splash onDone={() => setShowSplash(false)} />}
      <Navbar user={user} dark={dark} setDark={setDark} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/dashboard" element={<Protected user={user}><Dashboard user={user} /></Protected>} />
        <Route path="/food" element={<Protected user={user}><FoodAI user={user} /></Protected>} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/progress" element={<Protected user={user}><Progress user={user} /></Protected>} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/skin" element={<Skin />} />
        <Route path="/plans" element={<Plans user={user} />} />
        <Route path="/profile" element={<Protected user={user}><Profile user={user} setUser={setUser} dark={dark} setDark={setDark} /></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}
