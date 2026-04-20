import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabase'

export default function Signup({ setUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', weight: '', height: '', goal: 'lose', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      const data = await signUp({
        email: form.email,
        password: form.password,
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        goal: form.goal,
      })
      setUser(data.user)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message || 'Signup failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 14px', background: 'var(--bg)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, borderRadius: 18, padding: '30px 26px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 800, marginBottom: 3 }}>Join CaloriQ 🎉</h2>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 22 }}>Free forever — no card needed</div>

        <div className="auth-tabs">
          <button className="auth-tab" onClick={() => navigate('/login')}>Login</button>
          <button className="auth-tab active">Sign up</button>
        </div>

        <div className="form-row">
          <div className="form-group"><label>First name</label><input placeholder="Rahul" value={form.firstName} onChange={e => set('firstName', e.target.value)} /></div>
          <div className="form-group"><label>Last name</label><input placeholder="Sharma" value={form.lastName} onChange={e => set('lastName', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div className="form-group"><label>Phone</label><input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>Weight (kg)</label><input type="number" placeholder="65" value={form.weight} onChange={e => set('weight', e.target.value)} /></div>
          <div className="form-group"><label>Height (cm)</label><input type="number" placeholder="170" value={form.height} onChange={e => set('height', e.target.value)} /></div>
        </div>

        <div className="form-group">
          <label>Your goal</label>
          <div className="goal-btns">
            {['lose', 'gain', 'maintain'].map(g => (
              <button key={g} className={`goal-btn${form.goal === g ? ' active' : ''}`} onClick={() => set('goal', g)}>
                {g === 'lose' ? 'Lose weight' : g === 'gain' ? 'Gain weight' : 'Maintain'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group"><label>Password</label><input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} /></div>

        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 10, padding: '8px 10px', background: '#fff0ee', borderRadius: 7 }}>{error}</div>}

        <button className="btn-primary btn-full" style={{ marginTop: 6 }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : "Create my account — it's free!"}
        </button>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12.5, color: 'var(--t3)' }}>
          Already registered? <span style={{ color: 'var(--pri)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/login')}>Login here</span>
        </div>
      </div>
    </div>
  )
}
