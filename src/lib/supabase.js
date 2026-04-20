import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── AUTH HELPERS ──────────────────────────────────────
export const signUp = async ({ email, password, name, phone, weight, height, goal }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  // Save extra profile info
  await supabase.from('profiles').insert({
    id: data.user.id,
    name, phone, weight, height, goal,
    is_premium: false,
    created_at: new Date().toISOString()
  })
  return data
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  await supabase.auth.signOut()
}

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

// ─── PROFILE ───────────────────────────────────────────
export const getProfile = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
  return data
}

// ─── MEALS ─────────────────────────────────────────────
export const logMeal = async ({ userId, name, calories, protein, carbs, fat, mealType }) => {
  const { data, error } = await supabase.from('meals').insert({
    user_id: userId,
    name, calories, protein, carbs, fat,
    meal_type: mealType,
    logged_at: new Date().toISOString()
  })
  if (error) throw error
  return data
}

export const getTodaysMeals = async (userId) => {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', `${today}T00:00:00`)
    .lte('logged_at', `${today}T23:59:59`)
    .order('logged_at', { ascending: false })
  return data || []
}

export const getWeeklyMeals = async (userId) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', weekAgo)
  return data || []
}

// ─── WEIGHT LOGS ───────────────────────────────────────
export const logWeight = async (userId, weight) => {
  const { data, error } = await supabase.from('weight_logs').insert({
    user_id: userId,
    weight,
    logged_at: new Date().toISOString()
  })
  if (error) throw error
  return data
}

export const getWeightHistory = async (userId) => {
  const { data } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: true })
    .limit(30)
  return data || []
}

// ─── SUBSCRIPTION ──────────────────────────────────────
export const activatePremium = async (userId) => {
  await supabase
    .from('profiles')
    .update({ is_premium: true, premium_since: new Date().toISOString() })
    .eq('id', userId)
}
