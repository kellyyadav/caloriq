// ─── AI via Vercel serverless (fixes CORS) ────────────
const callAI = async ({ system, messages, max_tokens = 500 }) => {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages, max_tokens }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

// ─── AI FOOD ANALYZER → structured JSON ───────────────
export const analyzeFood = async (query) => {
  try {
    const data = await callAI({
      max_tokens: 400,
      system: `You are a nutrition expert. Given any food or meal, respond with ONLY valid JSON — no markdown, no extra text:
{"name":"food name","calories":320,"protein":12,"carbs":45,"fat":8,"fiber":3,"tip":"short health tip in Hinglish"}`,
      messages: [{ role: 'user', content: query }],
    })
    const text = data.content?.map(c => c.text || '').join('').trim()
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (e) {
    console.error('analyzeFood:', e)
    return null
  }
}

// ─── AI HINGLISH CHAT ─────────────────────────────────
export const askNutritionAI = async (query) => {
  try {
    const data = await callAI({
      max_tokens: 250,
      system: 'You are a friendly Indian nutrition expert. Given a food or meal: 1) Calorie estimate 2) Key macros 3) One practical tip. Reply in Hinglish (Hindi+English mix), warm friendly tone, 1-2 emoji, under 90 words.',
      messages: [{ role: 'user', content: query }],
    })
    return data.content?.map(c => c.text || '').join('') || 'Kuch issue aa gaya.'
  } catch (e) {
    return 'AI se connect nahi ho paya. Thodi der mein try karo.'
  }
}

// ─── TDEE CALCULATOR ──────────────────────────────────
export const calcTDEE = ({ age, weight, height, gender, activity, goal }) => {
  const w = parseFloat(weight) || 65
  const h = parseFloat(height) || 170
  const a = parseFloat(age) || 25
  let bmr = gender === 'female'
    ? (10 * w) + (6.25 * h) - (5 * a) - 161
    : (10 * w) + (6.25 * h) - (5 * a) + 5
  const actMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }
  let tdee = Math.round(bmr * (actMap[activity] || 1.55))
  if (goal === 'lose') tdee -= 500
  if (goal === 'gain') tdee += 500
  return {
    calories: Math.max(tdee, 1200),
    carbs: Math.round((tdee * 0.45) / 4),
    protein: Math.round((tdee * 0.25) / 4),
    fat: Math.round((tdee * 0.30) / 9),
    bmi: parseFloat((w / ((h / 100) ** 2)).toFixed(1)),
  }
}

// ─── BARCODE SCANNER ──────────────────────────────────
export const scanBarcode = async (barcode) => {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const data = await res.json()
    if (data.status === 1 && data.product) {
      const p = data.product
      const n = p.nutriments || {}
      return {
        name: p.product_name || p.product_name_en || 'Unknown product',
        calories: Math.round(n['energy-kcal_100g'] || 0),
        protein: Math.round(n.proteins_100g || 0),
        carbs: Math.round(n.carbohydrates_100g || 0),
        fat: Math.round(n.fat_100g || 0),
        fiber: Math.round(n.fiber_100g || 0),
        brand: p.brands || '',
      }
    }
    return null
  } catch { return null }
}

// ─── RAZORPAY ─────────────────────────────────────────
export const openRazorpay = ({ userEmail, userName, onSuccess }) => {
  // Key Vercel env var se aati hai (REACT_APP_ prefix se public hoti hai)
  const key = process.env.REACT_APP_RAZORPAY_KEY
  if (!key) {
    alert('Razorpay key missing!\nVercel Dashboard → Settings → Environment Variables mein\nREACT_APP_RAZORPAY_KEY add karo')
    return
  }
  const open = () => {
    const rzp = new window.Razorpay({
      key,
      amount: 5900,
      currency: 'INR',
      name: 'CaloriQ',
      description: 'Premium — 1 Month',
      prefill: { name: userName || '', email: userEmail || '' },
      theme: { color: '#1a7fe8' },
      handler: (r) => onSuccess(r.razorpay_payment_id),
    })
    rzp.open()
  }
  if (window.Razorpay) { open(); return }
  const s = document.createElement('script')
  s.src = 'https://checkout.razorpay.com/v1/checkout.js'
  s.onload = open
  document.body.appendChild(s)
}
