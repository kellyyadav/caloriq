# CaloriQ — Complete Setup Guide

## Step 1: VS Code Install karo
1. https://code.visualstudio.com pe jao
2. Download karo apne OS ke liye
3. Install karo

## Step 2: Node.js Install karo
1. https://nodejs.org pe jao
2. LTS version download karo
3. Install karo

## Step 3: Ye folder VS Code mein kholo
1. VS Code open karo
2. File > Open Folder
3. "caloriq" folder select karo
4. Open karo

## Step 4: Terminal mein ye commands chalaao
VS Code mein Terminal > New Terminal likho, phir:

npm install

## Step 5: Supabase setup karo (FREE)
1. https://supabase.com pe jao
2. New project banao — naam: caloriq
3. Project create hone ke baad:
   - Settings > API pe jao
   - Project URL copy karo
   - anon public key copy karo
4. SQL Editor pe jao → src/lib/schema.sql ka content paste karo → Run karo

## Step 6: .env file banao
caloriq folder mein .env naam ki file banao:

REACT_APP_SUPABASE_URL=apna-url-yahan
REACT_APP_SUPABASE_ANON_KEY=apni-key-yahan
REACT_APP_ANTHROPIC_KEY=apni-anthropic-key-yahan
REACT_APP_RAZORPAY_KEY=apni-razorpay-key-yahan

## Step 7: App chalaao
Terminal mein:
npm start

Browser mein http://localhost:3000 khulega!

## Step 8: GitHub pe daalo
1. https://github.com pe account banao
2. New repository banao — naam: caloriq
3. Terminal mein:
   git init
   git add .
   git commit -m "CaloriQ first version"
   git remote add origin https://github.com/TUMHARA_USERNAME/caloriq.git
   git push -u origin main

## Step 9: Vercel pe deploy karo (FREE — live website!)
1. https://vercel.com pe jao
2. GitHub se login karo
3. Import Project > caloriq select karo
4. Environment Variables mein apni .env values daalo
5. Deploy!
6. Tumhe milega: caloriq.vercel.app

## Step 10: Razorpay setup karo
1. https://razorpay.com pe jao
2. Sign up karo → KYC karo (Aadhaar + PAN)
3. Test mode mein key milegi turant
4. Live mode ke liye 1-2 din mein approve hoga

## Keys kahan se milenge:
- Supabase: supabase.com → project → Settings → API
- Anthropic: console.anthropic.com → API Keys
- Razorpay: dashboard.razorpay.com → Settings → API Keys
