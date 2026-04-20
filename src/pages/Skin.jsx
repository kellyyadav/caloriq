import React, { useState } from 'react'

const SKIN_DATA = {
  'Glowing skin': [{i:'🍊',f:'Oranges',b:'Vitamin C builds collagen and brightens skin',t:'Daily'},{i:'🥑',f:'Avocado',b:'Healthy fats keep skin soft and supple',t:'3x/week'},{i:'🍅',f:'Tomatoes',b:'Lycopene protects from sun damage',t:'Every meal'},{i:'🥕',f:'Carrots',b:'Beta-carotene gives a natural glow',t:'Daily'}],
  'Acne': [{i:'🥦',f:'Broccoli',b:'Antioxidants fight acne-causing bacteria',t:'Daily'},{i:'🐟',f:'Fish (omega-3)',b:'Reduces skin inflammation',t:'2x/week'},{i:'🫐',f:'Blueberries',b:'Fights oxidative stress in skin',t:'Daily'},{i:'🌿',f:'Green tea',b:'Anti-inflammatory — 2 cups daily',t:'2 cups/day'}],
  'Dryness': [{i:'🥑',f:'Avocado',b:'Deep moisturizing from inside out',t:'Daily'},{i:'🫒',f:'Olive oil',b:'Locks in skin moisture',t:'In cooking'},{i:'🥜',f:'Almonds',b:'Vitamin E repairs dry skin',t:'Handful/day'},{i:'🍯',f:'Honey',b:'Natural humectant',t:'With food'}],
  'Dark circles': [{i:'🍃',f:'Spinach',b:'Iron reduces dark circles',t:'Daily'},{i:'🫐',f:'Blueberries',b:'Improves blood circulation',t:'Daily'},{i:'🥒',f:'Cucumber',b:'Reduces puffiness',t:'Eat + apply'},{i:'🌰',f:'Walnuts',b:'Omega-3 strengthens vessels',t:'Daily'}],
  'Anti-aging': [{i:'🍇',f:'Grapes',b:'Resveratrol slows skin aging',t:'Daily'},{i:'🍵',f:'Matcha',b:'Highest antioxidants of any tea',t:'1 cup/day'},{i:'🥚',f:'Eggs',b:'Amino acids boost collagen',t:'Daily'},{i:'🫚',f:'Flaxseeds',b:'Omega-3 maintains elasticity',t:'1 tbsp/day'}],
}

export default function Skin() {
  const [concern, setConcern] = useState('Glowing skin')
  const [glasses, setGlasses] = useState(Array(8).fill(false))
  return (
    <div className="page-wrap">
      <div style={{fontSize:19,fontWeight:800,marginBottom:4}}>Skin Care Corner ✨</div>
      <div style={{fontSize:13,color:'var(--t2)',marginBottom:18}}>Jo tum khate ho woh tumhare skin pe dikhta hai</div>
      <div className="concern-tabs">
        {Object.keys(SKIN_DATA).map(c=>(
          <button key={c} className={`concern-btn${concern===c?' active':''}`} onClick={()=>setConcern(c)}>{c}</button>
        ))}
      </div>
      <div className="skin-grid">
        {SKIN_DATA[concern]?.map(s=>(
          <div key={s.f} className="skin-card">
            <div style={{fontSize:22,marginBottom:8}}>{s.i}</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{s.f}</div>
            <div style={{fontSize:12,color:'var(--t2)',marginBottom:7,lineHeight:1.4}}>{s.b}</div>
            <span className="skin-tag">{s.t}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title">Water tracker 💧</div>
        <div style={{fontSize:12.5,color:'var(--t3)'}}>Tap each glass — goal: 8 glasses/day</div>
        <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:10}}>
          {glasses.map((on,i)=>(
            <button key={i} className={`glass-btn${on?' filled':''}`} onClick={()=>setGlasses(g=>g.map((v,j)=>j===i?!v:v))}>🥤</button>
          ))}
        </div>
        <div style={{fontSize:12,color:'var(--t3)',marginTop:8}}>{glasses.filter(Boolean).length} / 8 glasses today</div>
      </div>
      <div className="card">
        <div className="section-title">Avoid these foods 🚫</div>
        <div style={{marginTop:6}}>
          {['Sugary drinks','Fried food','Excess dairy','Processed snacks'].map(f=>(
            <span key={f} style={{background:'#fff0ee',color:'#c2410c',border:'1.5px solid #fed7aa',borderRadius:20,fontSize:12,padding:'4px 12px',display:'inline-block',margin:3,fontWeight:700}}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
