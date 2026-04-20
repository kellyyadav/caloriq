import React, { useState, useEffect, useRef } from 'react'
import { logWeight, getWeightHistory, getWeeklyMeals } from '../lib/supabase'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function Progress({ user }) {
  const [wtInput, setWtInput] = useState('')
  const [weights, setWeights] = useState([])
  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0))
  const svgRef = useRef(null)

  useEffect(() => {
    if (!user) return
    getWeightHistory(user.id).then(setWeights)
    getWeeklyMeals(user.id).then(data => {
      const b = Array(7).fill(0)
      data.forEach(m => { const d = new Date(m.logged_at).getDay(); b[d] = (b[d]||0) + m.calories })
      setWeeklyData(b)
    })
  }, [user])

  useEffect(() => { if (weights.length > 1) drawLine() }, [weights])

  const drawLine = () => {
    const svg = svgRef.current; if (!svg) return
    const W = svg.parentElement.offsetWidth || 280, H = 120
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    const vals = weights.map(w => w.weight)
    const mn = Math.min(...vals)-1, mx = Math.max(...vals)+1
    const pts = vals.map((v,i) => ({ x: Math.round(22+(i/(vals.length-1))*(W-44)), y: Math.round(10+((mx-v)/(mx-mn))*(H-28)), v }))
    svg.innerHTML = `<path d="M${pts.map(p=>`${p.x},${p.y}`).join(' L')}" fill="none" stroke="#1a7fe8" stroke-width="2.5" stroke-linejoin="round"/>
      ${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#1a7fe8"/><text x="${p.x}" y="${p.y-10}" text-anchor="middle" font-size="9" fill="#7a9fc0" font-weight="600">${p.v}</text>`).join('')}
      ${pts.map((p,i)=>`<text x="${p.x}" y="${H-2}" text-anchor="middle" font-size="8.5" fill="#aaa">${weights[i]?.logged_at?new Date(weights[i].logged_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}):''}</text>`).join('')}`
  }

  const handleAdd = async () => {
    const v = parseFloat(wtInput); if (isNaN(v)||!user) return
    await logWeight(user.id, v)
    const updated = await getWeightHistory(user.id)
    setWeights(updated); setWtInput('')
  }

  const max = Math.max(...weeklyData, 1)

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'22px 16px' }}>
      <div style={{fontSize:19,fontWeight:800,marginBottom:16}}>Progress & Weight Tracker</div>
      <div className="card">
        <div className="section-title">Log today's weight</div>
        <div style={{display:'flex',gap:8,marginTop:10}}>
          <input style={{background:'var(--inp)',border:'1.5px solid var(--bdr)',borderRadius:9,padding:'9px 12px',fontSize:13,color:'var(--text)',outline:'none',fontFamily:'inherit',width:130}}
            type="number" step="0.1" placeholder="e.g. 65.5 kg" value={wtInput}
            onChange={e=>setWtInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAdd()}/>
          <button className="btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>
      <div className="card">
        <div className="section-title">Weight trend</div>
        {weights.length < 2
          ? <div style={{color:'var(--t3)',fontSize:13,padding:'16px 0'}}>Log at least 2 weights to see your trend.</div>
          : <svg ref={svgRef} style={{width:'100%',overflow:'visible'}} height="120"/>}
      </div>
      <div className="card">
        <div className="section-title">Weekly calories</div>
        <div className="bars-chart">
          {weeklyData.map((v,i)=><div key={i} className="bar-wrap"><div className="bar-fill" style={{height:Math.round((v/max)*74),background:'var(--pri)',opacity:.72}}/></div>)}
        </div>
        <div style={{display:'flex',marginTop:3}}>{DAYS.map(d=><span key={d} className="bar-label" style={{flex:1,textAlign:'center'}}>{d}</span>)}</div>
      </div>
      <div className="card">
        <div className="section-title">Good days vs bad days</div>
        <div style={{display:'flex',gap:12,marginBottom:9,flexWrap:'wrap'}}>
          {[['var(--grn)','Under goal'],['var(--red)','Over goal']].map(([c,l])=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:12.5,color:'var(--t2)',fontWeight:600}}>
              <div style={{width:12,height:12,borderRadius:3,background:c}}/>{l}
            </div>
          ))}
        </div>
        <div className="bars-chart">
          {weeklyData.map((v,i)=><div key={i} className="bar-wrap"><div className="bar-fill" style={{height:Math.round((v/max)*74),background:v>0&&v<=2000?'var(--grn)':v>2000?'var(--red)':'#e5e7eb'}}/></div>)}
        </div>
        <div style={{display:'flex',marginTop:3}}>{DAYS.map(d=><span key={d} className="bar-label" style={{flex:1,textAlign:'center'}}>{d}</span>)}</div>
      </div>
    </div>
  )
}
