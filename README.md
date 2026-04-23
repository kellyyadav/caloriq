# caloriq
# CALORIQ — Complete Setup Guide
## Ek baar padh lo, phir 1 ghante mein live ho jaayega 🚀

---

## STEP 1 — Apne computer mein tools install karo

### Node.js install karo (zaroori hai)
- https://nodejs.org pe jaao
- "LTS" wala download karo
- Install karo (Next Next Finish)
- Check karo: Terminal mein type karo `node -v` → version dikhna chahiye

### VS Code install karo (code editor)
- https://code.visualstudio.com download karo
- Install karo

### Git install karo
- https://git-scm.com download karo
- Install karo (sab default rehne do)

---

## STEP 2 — Project run karo locally

```bash
# 1. Is folder ko apne computer pe rakh lo
# Ya terminal mein:
cd caloriq

# 2. Dependencies install karo
npm install

# 3. .env file banao (important!)
cp .env.example .env
# Ab .env file VS Code mein kholo aur keys fill karo (Step 3 mein milenge)

# 4. App start karo
npm start
# Browser mein http://localhost:3000 pe khulega
```

---

## STEP 3 — Supabase setup (database — FREE)

1. https://supabase.com pe jaao
2. "Start your project" → GitHub se login karo
3. "New Project" → Name: `caloriq`, Password: koi bhi strong password
4. Region: Southeast Asia (Singapore) — India ke sabse paas
5. Project create hone do (1-2 min lagta hai)

### Database tables banao:
1. Left sidebar mein "SQL Editor" pe click karo
2. `src/lib/schema.sql` file ka poora content copy karo
3. SQL Editor mein paste karo → "Run" click karo
4. ✅ Tables ban jaayengi

### Keys copy karo:
1. Left sidebar → "Settings" → "API"
2. `Project URL` copy karo → `.env` mein `REACT_APP_SUPABASE_URL` mein daalo
3. `anon public` key copy karo → `.env` mein `REACT_APP_SUPABASE_ANON_KEY` mein daalo

---

## STEP 4 — Anthropic API key (AI food detection)

1. https://console.anthropic.com pe jaao
2. Sign up / Login
3. "API Keys" → "Create Key"
4. Key copy karo → `.env` mein `REACT_APP_ANTHROPIC_KEY` mein daalo

⚠️  Note: Ye key frontend mein expose hogi. Production mein backend banao.
Free tier mein kaafi calls milti hain starting ke liye.

---

## STEP 5 — Razorpay setup (payment — INDIA)

1. https://razorpay.com pe jaao
2. Sign up → Business details fill karo
3. KYC complete karo (Aadhar/PAN lagega — 1-2 din mein approve hota hai)
4. Dashboard → "Settings" → "API Keys"
5. "Generate Test Key" (pehle test mode mein karo)
6. Key ID copy karo → `.env` mein `REACT_APP_RAZORPAY_KEY` mein daalo

### Test cards for testing:
- Card: 4111 1111 1111 1111
- Expiry: Koi bhi future date
- CVV: Koi bhi 3 digits

---

## STEP 6 — GitHub pe daalo (version control)

```bash
# GitHub.com pe jaao → New Repository → Name: caloriq → Create

# Terminal mein:
cd caloriq
git init
git add .
git commit -m "Initial CaloriQ commit"
git branch -M main
git remote add origin https://github.com/TERA_USERNAME/caloriq.git
git push -u origin main
```

---

## STEP 7 — Vercel pe deploy karo (FREE hosting)

1. https://vercel.com pe jaao
2. "Continue with GitHub" se login karo
3. "New Project" → `caloriq` repository select karo
4. Framework: Create React App (auto detect hoga)
5. **Environment Variables add karo** (bahut zaroori!):
   - `REACT_APP_SUPABASE_URL` → teri Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` → tera Supabase key
   - `REACT_APP_ANTHROPIC_KEY` → tera Anthropic key
   - `REACT_APP_RAZORPAY_KEY` → tera Razorpay key
6. "Deploy" click karo
7. 2-3 minute mein **caloriq.vercel.app** live ho jaayega! 🎉

### Custom domain (optional):
- Vercel → Project → Settings → Domains
- `caloriq.in` ya koi bhi domain add karo
- GoDaddy/Namecheap se domain kharido (~₹500-800/year)

---

## STEP 8 — Har baar code change kaise deploy karein

```bash
# Code change karo VS Code mein
git add .
git commit -m "kya change kiya"
git push
# Vercel automatically deploy kar dega! Magic 🪄
```

---

## COMPLETE TECH STACK SUMMARY

| Cheez | Tool | Cost |
|-------|------|------|
| Frontend | React.js | FREE |
| Hosting | Vercel | FREE |
| Database | Supabase | FREE (500MB) |
| Auth | Supabase Auth | FREE |
| AI | Anthropic Claude | ~$5/month |
| Food data | Open Food Facts API | FREE |
| Payment | Razorpay | 2% per transaction |
| Domain | GoDaddy/Namecheap | ~₹800/year |

**Starting cost = ₹0** (jab tak AI calls zyada na ho jaayein)

---

## FOLDER STRUCTURE

```
caloriq/
├── public/
│   └── index.html
├── src/
│   ├── lib/
│   │   ├── supabase.js    ← database functions
│   │   ├── utils.js       ← AI + payment + calculator
│   │   └── schema.sql     ← database tables
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FoodAI.jsx
│   │   ├── Calculator.jsx
│   │   ├── Progress.jsx
│   │   ├── Exercise.jsx
│   │   ├── Skin.jsx
│   │   ├── Plans.jsx
│   │   └── Profile.jsx
│   ├── App.jsx            ← routing + navbar
│   ├── index.css          ← all styles
│   └── index.js           ← entry point
├── .env.example           ← keys template
├── .gitignore
├── vercel.json            ← deployment config
└── package.json
```

---

## COMMON PROBLEMS & FIXES

**"npm not found"** → Node.js install nahi hua, Step 1 dobara karo

**"Module not found"** → `npm install` dobara run karo

**Login kaam nahi kar raha** → Supabase keys check karo in `.env`

**Payment nahi ho raha** → Razorpay test mode mein ho? Test card use karo

**Vercel deploy fail** → Environment variables check karo Vercel settings mein

---

## AAGE KYA KARNA HAI (future features)

- [ ] Push notifications (weekly reminders)
- [ ] Camera se real barcode scan
- [ ] Google login
- [ ] WhatsApp reminder bot
- [ ] Admin dashboard (kitne users, revenue)
- [ ] React Native se mobile app

---

Made with ❤️ by kelly yadav 
