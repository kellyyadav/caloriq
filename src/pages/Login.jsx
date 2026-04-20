import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabase'

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      const data = await signIn(form)
      setUser(data.user)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message || 'Login failed. Check email/password.')
    }
    setLoading(false)
  }

  return (
    <div className="awrap" style={{ minHeight: 'calc(100vh - 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 14px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, borderRadius: 18, padding: '30px 26px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 800, marginBottom: 3 }}>Welcome back 👋</h2>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 22 }}>Good to see you again</div>

        <div className="auth-tabs">
          <button className="auth-tab active">Login</button>
          <button className="auth-tab" onClick={() => navigate('/signup')}>Sign up</button>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="you@email.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 10, padding: '8px 10px', background: '#fff0ee', borderRadius: 7 }}>{error}</div>}

        <button className="btn-primary btn-full" style={{ marginTop: 6 }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login to CaloriQ'}
        </button>

        <div className="divider">or</div>
        <button className="btn-outline btn-full">Continue with Google</button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12.5, color: 'var(--t3)' }}>
          New here? <span style={{ color: 'var(--pri)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/signup')}>Create a free account</span>
        </div>
      </div>
    </div>
  )
}
