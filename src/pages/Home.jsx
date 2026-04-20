import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '🔥', title: 'Calorie tracking', desc: 'Log meals by photo or search — calories from USDA database' },
  { icon: '🤖', title: 'AI food helper', desc: 'Ask in Hindi or English — instant nutrition info' },
  { icon: '⚖️', title: 'BMI & weight', desc: 'Track your weight journey with clean graphs' },
  { icon: '📊', title: 'Progress charts', desc: 'Weekly calories, weight trend and macros' },
  { icon: '💪', title: 'Exercise plans', desc: 'Workouts for your goal — lose, gain or maintain' },
  { icon: '✨', title: 'Skin care corner', desc: 'Food tips for glowing skin based on your concern' },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '56px 18px 40px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'var(--bg3)', border: '1.5px solid var(--bdr)', borderRadius: 20, padding: '4px 14px', fontSize: 11.5, color: 'var(--pri)', fontWeight: 700, marginBottom: 18 }}>
          Free forever · Premium just ₹59/month
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 10, letterSpacing: -0.5 }}>
          Track smarter,<br /><span style={{ color: 'var(--pri)' }}>live healthier.</span>
        </h1>
        <div style={{ fontSize: 16, color: 'var(--sec)', fontStyle: 'italic', fontWeight: 600, marginBottom: 12 }}>
          "All body types are beautiful."
        </div>
        <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 28 }}>
          Track calories, understand your body, get AI food tips — all in one place. Made for Indian lifestyles, Indian food.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/signup')}>Start for free</button>
          <button className="btn-outline" onClick={() => navigate('/dashboard')}>See dashboard</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1.5px solid var(--bdr)', borderBottom: '1.5px solid var(--bdr)', background: 'var(--bg2)', padding: '20px 0', flexWrap: 'wrap', marginBottom: 40 }}>
        {[['50K+', 'Users'], ['2M+', 'Meals tracked'], ['Free', 'First month'], ['₹59', 'Then/month']].map(([n, l]) => (
          <div key={l} style={{ padding: '0 28px', textAlign: 'center', borderRight: '1.5px solid var(--bdr)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pri)' }}>{n}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12, padding: '0 16px 48px', maxWidth: 880, margin: '0 auto' }}>
        {features.map(f => (
          <div key={f.title} className="card" style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
