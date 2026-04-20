import React, { useState } from 'react'
import { calcTDEE } from '../lib/utils'

const MEAL_PLANS = {
  lose: [['Breakfast','Oats + berries','280 kcal'],['Lunch','Dal + salad','320 kcal'],['Dinner','Grilled paneer + roti','380 kcal'],['Snack','Mixed fruit bowl','150 kcal']],
  maintain: [['Breakfast','Aloo paratha + curd','480 kcal'],['Lunch','Dal chawal','520 kcal'],['Dinner','Sabzi + 2 roti','450 kcal'],['Snack','Banana + milk','240 kcal']],
  gain: [['Breakfast','Anda bhurji + toast','550 kcal'],['Lunch','Rajma chawal + ghee','720 kcal'],['Dinner','Paneer butter masala + naan','680 kcal'],['Snack','Dry fruits + shake','380 kcal']],
}

export default function Calculator() {
  const [f, setF] = useState({ age:25,weight:65,height:170,gender:'male',activity:'moderate',goal:'maintain' })
  const [showPlan, setShowPlan] = useState(false)
  const set = (k,v) => setF(p=>({...p,[k]:v}))
  const result = calcTDEE(f)
  const bmiLabel = result.bmi<18.5?'Underweight':result.bmi<25?'Normal weight ✓':result.bmi<30?'Overweight':'Obese'
  return (
    <div className="page-wrap">
      <div style={{fontSize:19,fontWeight:800,marginBottom:16}}>Calorie Calculator & Meal Planner</div>
      <div className="card">
        <div className="section-title">Kitni calories chahiye rozana?</div>
        <div style={{fontSize:12,color:'var(--t3)',marginBottom:14}}>Mifflin-St Jeor formula — used by nutritionists worldwide</div>
        {[['Age','age',10,80,'yrs'],['Weight (kg)','weight',40,150,'kg'],['Height (cm)','height',140,210,'cm']].map(([label,key,min,max,unit])=>(
          <div key={key} style={{display:'flex',alignItems:'center',gap:10,marginBottom:11}}>
            <label style={{fontSize:12,color:'var(--t2)',minWidth:85,fontWeight:600}}>{label}</label>
            <input type="range" min={min} max={max} value={f[key]} step="1" style={{flex:1,accentColor:'var(--pri)'}} onChange={e=>set(key,parseFloat(e.target.value))}/>
            <span style={{fontSize:13,fontWeight:800,color:'var(--pri)',minWidth:62,textAlign:'right'}}>{f[key]} {unit}</span>
          </div>
        ))}
        <div className="form-group"><label>Activity level</label>
          <select value={f.activity} onChange={e=>set('activity',e.target.value)}>
            <option value="sedentary">Sedentary</option><option value="light">Light</option>
            <option value="moderate">Moderate</option><option value="active">Active</option><option value="veryActive">Very active</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Gender</label><select value={f.gender} onChange={e=>set('gender',e.target.value)}><option value="male">Male</option><option value="female">Female</option></select></div>
          <div className="form-group"><label>Goal</label><select value={f.goal} onChange={e=>set('goal',e.target.value)}><option value="lose">Lose weight</option><option value="maintain">Maintain</option><option value="gain">Gain weight</option></select></div>
        </div>
        <div style={{borderTop:'1.5px solid var(--bdr)',marginTop:14,paddingTop:15}}>
          <div style={{fontSize:12,color:'var(--t3)',fontWeight:600}}>Your daily calorie target</div>
          <div style={{fontSize:32,fontWeight:800,color:'var(--pri)',margin:'10px 0 4px'}}>{result.calories.toLocaleString()} kcal</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
            {[['#e6f4ff','#0c447c',`Carbs: ${result.carbs}g`],['#e0fdf4','#065f46',`Protein: ${result.protein}g`],['#eff6ff','#1e40af',`Fat: ${result.fat}g`]].map(([bg,color,text])=>(
              <div key={text} style={{padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:700,background:bg,color}}>{text}</div>
            ))}
          </div>
          <div style={{fontSize:12.5,color:'var(--t3)',marginTop:10,fontWeight:600}}>BMI: {result.bmi} — {bmiLabel}</div>
        </div>
      </div>
      <div className="card">
        <div className="section-title">AI Meal Plan for today 🍽️</div>
        <button className="btn-primary" style={{fontSize:13,padding:'9px 18px'}} onClick={()=>setShowPlan(true)}>Generate my meal plan</button>
        {showPlan&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginTop:12}}>
          {MEAL_PLANS[f.goal]?.map(([type,name,cal])=>(
            <div key={type} style={{background:'var(--bg3)',borderRadius:11,padding:13}}>
              <div style={{fontSize:10,color:'var(--t3)',marginBottom:3,textTransform:'uppercase',letterSpacing:'.5px',fontWeight:700}}>{type}</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{name}</div>
              <div style={{fontSize:11.5,color:'var(--pri)',fontWeight:700}}>{cal}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}
