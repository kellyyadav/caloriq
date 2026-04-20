-- ═══════════════════════════════════════════════
-- CALORIQ DATABASE SCHEMA
-- Supabase SQL Editor mein ye paste karke run karo
-- ═══════════════════════════════════════════════

-- 1. PROFILES TABLE (user ka extra data)
create table profiles (
  id uuid references auth.users primary key,
  name text,
  phone text,
  weight numeric,
  height numeric,
  goal text default 'maintain',
  allergies text[],
  is_premium boolean default false,
  premium_since timestamptz,
  created_at timestamptz default now()
);

-- 2. MEALS TABLE (kya khaya)
create table meals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  calories numeric not null,
  protein numeric default 0,
  carbs numeric default 0,
  fat numeric default 0,
  fiber numeric default 0,
  meal_type text default 'other',
  logged_at timestamptz default now()
);

-- 3. WEIGHT LOGS TABLE (weight history)
create table weight_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  weight numeric not null,
  logged_at timestamptz default now()
);

-- 4. PAYMENTS TABLE (Razorpay records)
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric,
  status text default 'pending',
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY — user sirf apna data dekhe
-- ═══════════════════════════════════════════════
alter table profiles enable row level security;
alter table meals enable row level security;
alter table weight_logs enable row level security;
alter table payments enable row level security;

create policy "Users see own profile" on profiles for all using (auth.uid() = id);
create policy "Users see own meals" on meals for all using (auth.uid() = user_id);
create policy "Users see own weights" on weight_logs for all using (auth.uid() = user_id);
create policy "Users see own payments" on payments for all using (auth.uid() = user_id);
