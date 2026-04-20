import React, { useState } from 'react'

const EX = {
  lose:[{e:'🏃',n:'Running',d:'Burns fat fast',dur:'30 min',cal:'300 kcal'},{e:'🚴',n:'Cycling',d:'Low-impact cardio',dur:'45 min',cal:'350 kcal'},{e:'🏊',n:'Swimming',d:'Full body burn',dur:'30 min',cal:'400 kcal'},{e:'⚡',n:'HIIT',d:'High intensity intervals',dur:'20 min',cal:'250 kcal'}],
  gain:[{e:'🏋',n:'Weight training',d:'Build muscle mass',dur:'45 min',cal:'200 kcal'},{e:'💪',n:'Push-ups',d:'Upper body strength',dur:'20 min',cal:'100 kcal'},{e:'🦵',n:'Squats',d:'Lower body power',dur:'20 min',cal:'150 kcal'},{e:'🤸',n:'Pull-ups',d:'Back & bicep builder',dur:'15 min',cal:'120 kcal'}],
  maintain:[{e:'🚶',n:'Walking',d:'Easy daily habit',dur:'45 min',cal:'180 kcal'},{e:'🧘',n:'Yoga',d:'Flexibility & calm',dur:'30 min',cal:'100 kcal'},{e:'🏸',n:'Badminton',d:'Fun active sport',dur:'30 min',cal:'200 kcal'},{e:'💃',n:'Dance',d:'Cardio and fun',dur:'30 min',cal:'220 kcal'}],
}

export default function Exercise() {
  const [goal, setGoal] = useState('lose')
  const [cal, setCal] = useState(2000)
  return (
    <div className="page-wrap">
      <div style={{fontSize:19,fontWeight:800,marginBottom:16}}>Exercise Planner 💪</div>
      <div className="card">
        <div className="section-title">Set your daily calorie budget</div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8}}>
          <input type="range" min="1200" max="3500" value={cal} step="50" style={{flex:1,accentColor:'var(--pri)'}} onChange={e=>setCal(parseInt(e.target.value))}/>
          <span style={{fontSize:13,fontWeight:800,color:'var(--pri)',minWidth:110}}>{cal} kcal/day</span>
        </div>
      </div>
      <div style={{display:'flex',gap:7,marginBottom:16,flexWrap:'wrap'}}>
        {[['lose','Lose weight'],['gain','Gain weight'],['maintain','Maintain']].map(([g,l])=>(
          <button key={g} style={{padding:'8px 18px',border:`2px solid ${goal===g?'var(--pri)':'var(--bdr)'}`,borderRadius:22,fontSize:12.5,cursor:'pointer',background:goal===g?'var(--pri)':'none',color:goal===g?'#fff':'var(--t2)',fontFamily:'inherit',fontWeight:600}} onClick={()=>setGoal(g)}>{l}</button>
        ))}
      </div>
      <div className="exercise-grid">
        {EX[goal]?.map(x=>(
          <div key={x.n} className="exercise-card">
            <div style={{fontSize:24,marginBottom:7}}>{x.e}</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{x.n}</div>
            <div style={{fontSize:12,color:'var(--t3)',marginBottom:8}}>{x.d}</div>
            <div style={{display:'flex',gap:6}}><span className="exercise-tag">{x.dur}</span><span className="exercise-tag">{x.cal}</span></div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-title">Light daily workout — no equipment needed</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(105px,1fr))',gap:9,marginTop:4}}>
          {[['🧘','Mountain pose','2 min · Posture'],['🏃','Spot jog','5 min · Cardio'],['🤸','Stretching','5 min · Flex'],['🧗','Plank','1 min · Core']].map(([e,n,d])=>(
            <div key={n} style={{background:'var(--bg3)',borderRadius:11,padding:12,textAlign:'center',fontSize:12.5,color:'var(--t2)'}}>
              {e} {n}<br/><span style={{fontSize:10.5,color:'var(--t3)'}}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
