import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodaysMeals, getWeeklyMeals, getProfile } from '../lib/supabase'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function BarChart({ data, days, colors }) {
  const max = Math.max(...data, 1)
  return (
    <div>
      <div className="bars-chart">
        {data.map((v, i) => (
          <div key={i} className="bar-wrap">
            <div className="bar-fill" style={{ height: Math.round((v / max) * 74), background: colors ? colors[i] : 'var(--pri)', opacity: i === data.length - 1 ? 1 : 0.65 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 3 }}>
        {days.map(d => <span key={d} className="bar-label" style={{ flex: 1, textAlign: 'center' }}>{d}</span>)}
      </div>
    </div>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const [meals, setMeals] = useState([])
  const [profile, setProfile] = useState(null)
  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0))
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    if (!user) return
    getTodaysMeals(user.id).then(setMeals)
    getProfile(user.id).then(setProfile)
    getWeeklyMeals(user.id).then(data => {
      const buckets = Array(7).fill(0)
      data.forEach(m => {
        const day = new Date(m.logged_at).getDay()
        buckets[day] = (buckets[day] || 0) + m.calories
      })
      setWeeklyData(buckets)
    })
  }, [user])

  const todayCals = meals.reduce((s, m) => s + (m.calories || 0), 0)
  const goalCals = profile?.goal === 'lose' ? 1800 : profile?.goal === 'gain' ? 2500 : 2000
  const pct = Math.min(Math.round((todayCals / goalCals) * 100), 100)
  const bmi = profile ? parseFloat((profile.weight / ((profile.height / 100) ** 2)).toFixed(1)) : null

  const macros = meals.reduce((acc, m) => ({
    carbs: acc.carbs + (m.carbs || 0),
    protein: acc.protein + (m.protein || 0),
    fat: acc.fat + (m.fat || 0),
  }), { carbs: 0, protein: 0, fat: 0 })

  return (
    <div className="page-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800 }}>{greeting}, {profile?.name?.split(' ')[0] || 'there'} 👋</div>
          <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 2 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} — You're doing great!</div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/food')}>+ Log meal</button>
      </div>

      {/* Metric cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Calories today</div>
          <div className="metric-value" style={{ color: 'var(--pri)' }}>{todayCals.toLocaleString()}</div>
          <div className="metric-sub">Goal: {goalCals.toLocaleString()} kcal</div>
          <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${pct}%`, background: 'var(--pri)' }} /></div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Carbs</div>
          <div className="metric-value" style={{ color: '#1a7fe8' }}>{macros.carbs}g</div>
          <div className="metric-sub">From today's meals</div>
          <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${Math.min((macros.carbs / 250) * 100, 100)}%`, background: '#1a7fe8' }} /></div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Protein</div>
          <div className="metric-value" style={{ color: '#00bcd4' }}>{macros.protein}g</div>
          <div className="metric-sub">From today's meals</div>
          <div className="metric-bar"><div className="metric-bar-fill" style={{ width: `${Math.min((macros.protein / 120) * 100, 100)}%`, background: '#00bcd4' }} /></div>
        </div>
        <div className="metric-card">
          <div className="metric-label">BMI</div>
          <div className="metric-value" style={{ color: 'var(--grn)' }}>{bmi || '—'}</div>
          <div className="metric-sub">{bmi ? (bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal ✓' : bmi < 30 ? 'Overweight' : 'Obese') : 'Set in profile'}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="two-col">
        <div className="card">
          <div className="section-title">This week's calories</div>
          <BarChart data={weeklyData} days={DAYS} />
        </div>
        <div className="card">
          <div className="section-title">Today's macros</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="31" fill="none" stroke="#e6f4ff" strokeWidth="13" />
              <circle cx="44" cy="44" r="31" fill="none" stroke="#1a7fe8" strokeWidth="13" strokeDasharray="78 117" strokeDashoffset="0" transform="rotate(-90 44 44)" />
              <circle cx="44" cy="44" r="31" fill="none" stroke="#00bcd4" strokeWidth="13" strokeDasharray="49 146" strokeDashoffset="-78" transform="rotate(-90 44 44)" />
              <circle cx="44" cy="44" r="31" fill="none" stroke="#7c3aed" strokeWidth="13" strokeDasharray="68 127" strokeDashoffset="-127" transform="rotate(-90 44 44)" />
            </svg>
            <div>
              {[['#1a7fe8', 'Carbs 40%'], ['#00bcd4', 'Protein 25%'], ['#7c3aed', 'Fat 35%']].map(([c, l]) => (
                <div key={l} style={{ fontSize: 12, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: c, flexShrink: 0 }} />{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meals list */}
      <div className="card">
        <div className="section-title">Today's meals</div>
        {meals.length === 0
          ? <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--t3)', fontSize: 13 }}>No meals logged yet. <span style={{ color: 'var(--pri)', cursor: 'pointer' }} onClick={() => navigate('/food')}>Log your first meal →</span></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {meals.map((m, i) => (
                <div key={m.id}>
                  {i > 0 && <div style={{ height: 1, background: 'var(--bdr)', marginBottom: 10 }} />}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--t3)' }}>{m.meal_type} · {new Date(m.logged_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--pri)' }}>{m.calories} kcal</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
