import React from 'react'
import { useNavigate } from 'react-router-dom'
import { openRazorpay, activatePremium } from '../lib/utils'
import { activatePremium as dbActivate } from '../lib/supabase'

export default function Plans({ user }) {
  const navigate = useNavigate()

  const handlePay = () => {
    if (!user) { navigate('/signup'); return }
    openRazorpay({
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.name || 'User',
      onSuccess: async (paymentId) => {
        await dbActivate(user.id)
        alert(`Payment successful! 🎉\nPayment ID: ${paymentId}\nPremium activated!`)
      }
    })
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Simple, honest pricing 🙌</h2>
      <p style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 36 }}>
        Free for everyone. Ek mahine baad sirf ₹59/month.
      </p>

      <div className="plan-grid">
        {/* Free Plan */}
        <div className="plan-card">
          <div className="plan-name">Free</div>
          <div className="plan-price">₹0 <span>/ month</span></div>
          <div className="plan-desc">Sab kuch free mein — hamesha</div>
          <ul className="plan-features">
            {['Unlimited calorie tracking', 'BMI calculator', 'Meal log — 7 day history', 'Basic exercise guide', 'Skin care corner', 'Water tracker'].map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className="btn-outline" style={{ width: '100%', fontSize: 13.5, padding: 11 }} onClick={() => navigate('/signup')}>
            Start free
          </button>
        </div>

        {/* Premium Plan */}
        <div className="plan-card featured">
          <div className="plan-badge">Most popular ⭐</div>
          <div className="plan-name">Premium</div>
          <div className="plan-price">₹59 <span>/ month</span></div>
          <div className="plan-desc">Pehla mahina free — phir ₹59/mo</div>
          <ul className="plan-features">
            {['Everything in Free', 'AI food photo detection', 'Unlimited history & graphs', 'Smart meal planner', 'Full exercise plans', 'Weekly reminders', 'TDEE & macro calculator', 'Priority support'].map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className="btn-primary" style={{ width: '100%', fontSize: 13.5, padding: 11 }} onClick={handlePay}>
            Start free — ₹59 second month
          </button>
        </div>
      </div>

      {/* Payment info */}
      <div style={{ marginTop: 14, padding: 14, background: 'var(--bg3)', borderRadius: 12, fontSize: 13, color: 'var(--t2)', border: '1.5px solid var(--bdr)' }}>
        Payment via <strong>Razorpay</strong> — UPI, cards, netbanking. 100% secure. No hidden charges.
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 12 }}>
        Cancel anytime. Student & health worker discounts available on request.
      </div>
    </div>
  )
}
