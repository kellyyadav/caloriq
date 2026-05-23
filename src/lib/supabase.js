import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── AUTH ─────────────────────────────────────────────
export const signUp = async ({ email, password, name, phone, weight, height, goal }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  // Wait a moment then upsert profile (avoids race condition 401)
  if (data.user) {
    await new Promise(r => setTimeout(r, 500))
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name: name || '',
      phone: phone || '',
      weight: parseFloat(weight) || 0,
      height: parseFloat(height) || 0,
      goal: goal || 'maintain',
      is_premium: false,
    }, { onConflict: 'id' })
  }
  return data
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => { await supabase.auth.signOut() }

// ─── PROFILE ──────────────────────────────────────────
export const getProfile = async (userId) => {
  if (!userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()          // maybeSingle fixes 406 — returns null instead of error
  if (error) { console.error('getProfile:', error); return null }
  return data
}

export const updateProfile = async (userId, updates) => {
  if (!userId) return
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' })
  if (error) throw error
}

// ─── MEALS ────────────────────────────────────────────
export const logMeal = async ({ userId, name, calories, protein, carbs, fat, fiber, mealType }) => {
  if (!userId) throw new Error('Not logged in')
  const { data, error } = await supabase.from('meals').insert({
    user_id: userId,
    name,
    calories: Math.round(parseFloat(calories) || 0),
    protein: Math.round(parseFloat(protein) || 0),
    carbs: Math.round(parseFloat(carbs) || 0),
    fat: Math.round(parseFloat(fat) || 0),
    fiber: Math.round(parseFloat(fiber) || 0),
    meal_type: mealType || 'other',
    logged_at: new Date().toISOString(),
  }).select()
  if (error) throw error
  return data
}

export const getTodaysMeals = async (userId) => {
  if (!userId) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', today.toISOString())
    .order('logged_at', { ascending: false })
  if (error) { console.error('getTodaysMeals:', error); return [] }
  return data || []
}

export const getWeeklyMeals = async (userId) => {
  if (!userId) return []
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', weekAgo)
  if (error) return []
  return data || []
}

export const deleteMeal = async (mealId) => {
  const { error } = await supabase.from('meals').delete().eq('id', mealId)
  if (error) throw error
}

// ─── WEIGHT LOGS ──────────────────────────────────────
export const logWeight = async (userId, weight) => {
  if (!userId) throw new Error('Not logged in')
  const { error } = await supabase.from('weight_logs').insert({
    user_id: userId,
    weight: parseFloat(weight),
    logged_at: new Date().toISOString(),
  })
  if (error) throw error
}

export const getWeightHistory = async (userId) => {
  if (!userId) return []
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: true })
    .limit(30)
  if (error) return []
  return data || []
}

// ─── REAL STATS ───────────────────────────────────────
export const getRealStats = async () => {
  try {
    const [{ count: users }, { count: meals }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('meals').select('*', { count: 'exact', head: true }),
    ])
    return { users: users || 0, mealsTracked: meals || 0 }
  } catch { return { users: 0, mealsTracked: 0 } }
}

// ─── PREMIUM ──────────────────────────────────────────
export const activatePremium = async (userId) => {
  await supabase.from('profiles').upsert({
    id: userId,
    is_premium: true,
    premium_since: new Date().toISOString(),
  }, { onConflict: 'id' })
}
