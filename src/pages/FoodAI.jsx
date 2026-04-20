import React, { useState } from 'react'
import { askNutritionAI, analyzeFood, scanBarcode } from '../lib/utils'
import { logMeal } from '../lib/supabase'

const QUICK_FOODS = [
  { icon: '🍚', name: 'Rice 1 cup', cal: 206, protein: 4, carbs: 45, fat: 0 },
  { icon: '🫓', name: 'Roti', cal: 71, protein: 2, carbs: 15, fat: 1 },
  { icon: '🥚', name: 'Boiled egg', cal: 78, protein: 6, carbs: 1, fat: 5 },
  { icon: '🍌', name: 'Banana', cal: 89, protein: 1, carbs: 23, fat: 0 },
  { icon: '🥛', name: 'Milk 1 glass', cal: 149, protein: 8, carbs: 12, fat: 8 },
  { icon: '🫘', name: 'Dal 1 bowl', cal: 116, protein: 7, carbs: 20, fat: 1 },
]
const ALLERGIES = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy', 'Shellfish']

export default function FoodAI({ user }) {
  const [query, setQuery] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [detected, setDetected] = useState(null)
  const [activeAllergies, setActiveAllergies] = useState(['Dairy'])
  const [logMsg, setLogMsg] = useState('')
  const [barcode, setBarcode] = useState('')

  const handleAsk = async () => {
    if (!query.trim()) return
    setAiLoading(true); setAiResult('')
    const result = await askNutritionAI(query)
    setAiResult(result); setAiLoading(false)
  }

  const handlePhotoDemo = async () => {
    setAiLoading(true)
    const result = await analyzeFood('Dal Makhani one plate Indian restaurant serving')
    if (result) setDetected(result)
    setAiLoading(false)
  }

  const handleScanBarcode = async () => {
    if (!barcode.trim()) return
    const result = await scanBarcode(barcode.trim())
    if (result) setDetected(result)
    else alert('Product not found. Try another barcode.')
  }

  const handleLogMeal = async (food, mealType = 'other') => {
    if (!user) return
    try {
      await logMeal({ userId: user.id, name: food.name, calories: food.calories || food.cal, protein: food.protein || 0, carbs: food.carbs || 0, fat: food.fat || 0, mealType })
      setLogMsg(`✓ ${food.name} logged!`)
      setTimeout(() => setLogMsg(''), 2500)
    } catch { setLogMsg('Error logging. Try again.') }
  }

  const toggleAllergy = (a) => setActiveAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  return (
    <div className="page-wrap">
      <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 4 }}>Food & AI Tracker</div>
      <div style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 18 }}>Calorie data from USDA Open Food Database · 3M+ foods</div>

      {logMsg && <div style={{ background: '#e6f4ff', color: 'var(--pri)', border: '1.5px solid var(--bdr)', borderRadius: 9, padding: '9px 12px', marginBottom: 12, fontWeight: 600, fontSize: 13 }}>{logMsg}</div>}

      {/* Photo Upload */}
      <div className="card" style={{ border: '2px dashed var(--pri)', background: 'var(--bg3)', textAlign: 'center', padding: '32px 20px', cursor: 'pointer' }} onClick={handlePhotoDemo}>
        <div style={{ fontSize: 32 }}>📷</div>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '9px 0 5px' }}>Upload a food photo</h3>
        <p style={{ fontSize: 12.5, color: 'var(--t3)' }}>AI will detect the dish and show calories</p>
        <p style={{ marginTop: 6, fontSize: 11.5, color: 'var(--pri)', fontWeight: 700 }}>Tap to see a demo</p>
      </div>

      {/* Barcode Scanner */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 4 }}>Barcode scanner 📦</div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 10 }}>Packaged food ka barcode number type karo</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ flex: 1, background: 'var(--inp)', border: '1.5px solid var(--bdr)', borderRadius: 9, padding: '9px 12px', fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: 'inherit' }}
            placeholder="e.g. 8901030869329" value={barcode} onChange={e => setBarcode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScanBarcode()} />
          <button className="btn-primary" onClick={handleScanBarcode}>Scan</button>
        </div>
      </div>

      {/* Detected Food Result */}
      {detected && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700 }}>{detected.name} 🎯</h3>
            <div style={{ background: 'var(--bg3)', color: 'var(--pri)', fontSize: 13, fontWeight: 800, padding: '4px 13px', borderRadius: 20, border: '1.5px solid var(--bdr)' }}>{detected.calories} kcal</div>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
            {[['Protein', detected.protein + 'g'], ['Fat', detected.fat + 'g'], ['Carbs', detected.carbs + 'g'], ['Fiber', (detected.fiber || 0) + 'g']].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--bg3)', borderRadius: 9, padding: '9px 11px', textAlign: 'center', flex: 1, minWidth: 58 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 9.5, color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
          {detected.tip && <div style={{ fontSize: 12.5, color: 'var(--t2)', marginBottom: 11, padding: '9px 11px', background: 'var(--bg3)', borderRadius: 8, lineHeight: 1.6 }}>{detected.tip}</div>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['breakfast', 'lunch', 'dinner', 'snack'].map(t => (
              <button key={t} className="btn-outline" style={{ fontSize: 11.5, padding: '5px 12px' }} onClick={() => handleLogMeal(detected, t)}>
                + {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Chat */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 3 }}>Ask AI about any food 🤖</div>
        <div style={{ fontSize: 12.5, color: 'var(--t3)' }}>Hindi, English ya Hinglish mein type karo</div>
        <div className="ai-input-row">
          <input placeholder="2 roti with dal, paneer tikka 200g..." value={query}
            onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} />
          <button className="btn-primary" onClick={handleAsk} style={{ padding: '9px 16px' }}>Ask</button>
        </div>
        {aiLoading && <div className="ai-loading">Analyzing <div style={{ display: 'inline-flex', gap: 3, marginLeft: 4 }}><span className="dot" /><span className="dot" /><span className="dot" /></div></div>}
        {aiResult && <div className="ai-result">{aiResult}</div>}
      </div>

      {/* Allergy Filter */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 4 }}>Allergy filter</div>
        <div style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 9 }}>Mark allergens — excluded from suggestions</div>
        {ALLERGIES.map(a => (
          <span key={a} className={`allergy-tag${activeAllergies.includes(a) ? ' active' : ''}`} onClick={() => toggleAllergy(a)}>{a}</span>
        ))}
      </div>

      {/* Quick Log */}
      <div className="section-title">Quick log</div>
      <div className="quick-grid">
        {QUICK_FOODS.map(f => (
          <div key={f.name} className="quick-item" onClick={() => handleLogMeal(f)}>
            <div className="quick-icon">{f.icon}</div>
            <div className="quick-name">{f.name}</div>
            <div className="quick-cal">{f.cal} kcal</div>
          </div>
        ))}
      </div>
    </div>
  )
}
