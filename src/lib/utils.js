// ─── AI FOOD ANALYZER ──────────────────────────────────
export const analyzeFood = async (query) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: `You are a friendly Indian nutrition expert. Given a food or meal respond with ONLY valid JSON in this exact format:
{
  "name": "food name",
  "calories": 320,
  "protein": 12,
  "carbs": 45,
  "fat": 8,
  "fiber": 6,
  "tip": "one short health tip in Hinglish"
}
No extra text, only JSON.`,
      messages: [{ role: 'user', content: query }]
    })
  })
  const data = await res.json()
  const text = data.content?.map(c => c.text || '').join('')
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return null
  }
}

// ─── AI CHAT (Hinglish) ────────────────────────────────
export const askNutritionAI = async (query) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: 'You are a friendly Indian nutrition expert. Reply in Hinglish (Hindi+English mix), warm tone, 1-2 emoji, max 80 words. Give calories, key macros, and one practical tip.',
      messages: [{ role: 'user', content: query }]
    })
  })
  const data = await res.json()
  return data.content?.map(c => c.text || '').join('') || 'Kuch issue aa gaya, try karo dobara.'
}

// ─── TDEE CALCULATOR ───────────────────────────────────
export const calcTDEE = ({ age, weight, height, gender, activity, goal }) => {
  let bmr = gender === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161

  const actMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }
  let tdee = Math.round(bmr * (actMap[activity] || 1.55))

  if (goal === 'lose') tdee -= 500
  if (goal === 'gain') tdee += 500

  return {
    calories: tdee,
    carbs: Math.round((tdee * 0.45) / 4),
    protein: Math.round((tdee * 0.25) / 4),
    fat: Math.round((tdee * 0.30) / 9),
    bmi: parseFloat((weight / ((height / 100) ** 2)).toFixed(1))
  }
}

// ─── RAZORPAY PAYMENT ──────────────────────────────────
export const openRazorpay = ({ userId, userEmail, userName, onSuccess }) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY,
    amount: 5900,           // ₹59 in paise
    currency: 'INR',
    name: 'CaloriQ',
    description: 'Premium Subscription — 1 Month',
    image: '/logo192.png',
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: { color: '#1a7fe8' },
    handler: function (response) {
      // Payment successful
      onSuccess(response.razorpay_payment_id)
    },
    modal: {
      ondismiss: () => console.log('Payment cancelled')
    }
  }

  // Load Razorpay script dynamically
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => {
    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  document.body.appendChild(script)
}

// ─── FOOD SCANNER (Open Food Facts API) ───────────────
export const scanBarcode = async (barcode) => {
  const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
  const data = await res.json()
  if (data.status === 1) {
    const p = data.product
    const per100 = p.nutriments
    return {
      name: p.product_name || 'Unknown food',
      calories: Math.round(per100['energy-kcal_100g'] || 0),
      protein: Math.round(per100.proteins_100g || 0),
      carbs: Math.round(per100.carbohydrates_100g || 0),
      fat: Math.round(per100.fat_100g || 0),
      fiber: Math.round(per100.fiber_100g || 0),
      image: p.image_url
    }
  }
  return null
}

// ─── BMI LABEL ─────────────────────────────────────────
export const getBMILabel = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#0891b2' }
  if (bmi < 25)   return { label: 'Normal weight ✓', color: '#16a34a' }
  if (bmi < 30)   return { label: 'Overweight', color: '#d97706' }
  return           { label: 'Obese', color: '#dc2626' }
}
