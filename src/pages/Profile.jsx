import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, signOut } from '../lib/supabase'

export default function Profile({ user, setUser, dark, setDark }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (user) getProfile(user.id).then(setProfile) }, [user])

  const set = (k,v) => setProfile(p=>({...p,[k]:v}))

  const handleSave = async () => {
    await updateProfile(user.id, { weight: profile.weight, height: profile.height, goal: profile.goal })
    setSaved(true); setTimeout(()=>setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await signOut(); setUser(null); navigate('/')
  }

  const initials = profile?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '?'
  const bmi = profile ? parseFloat((profile.weight/((profile.height/100)**2)).toFixed(1)) : null

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'22px 16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:18,background:'var(--card)',border:'1.5px solid var(--bdr)',borderRadius:16,padding:18}}>
        <div style={{width:54,height:54,borderRadius:'50%',background:'var(--pri)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:18,fontWeight:800,flexShrink:0}}>{initials}</div>
        <div>
          <div style={{fontSize:17,fontWeight:800}}>{profile?.name||user?.email}</div>
          <div style={{fontSize:12,color:'var(--t3)',marginTop:2}}>{user?.email}</div>
          <div style={{display:'inline-block',background:'var(--bg3)',color:'var(--pri)',fontSize:11,padding:'2px 10px',borderRadius:10,marginTop:4,fontWeight:800,border:'1.5px solid var(--bdr)'}}>
            {profile?.is_premium?'Premium · Active ✓':'Free plan'}
          </div>
        </div>
      </div>
      <div className="profile-stats">
        {[['BMI',bmi||'—'],['Weight',(profile?.weight||'—')+' kg'],['Height',(profile?.height||'—')+' cm'],['Goal',profile?.goal||'—']].map(([l,v])=>(
          <div key={l} className="profile-stat"><div className="profile-stat-val">{v}</div><div className="profile-stat-lbl">{l}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="section-title">Edit profile</div>
        <div className="form-row">
          <div className="form-group"><label>Weight (kg)</label><input type="number" value={profile?.weight||''} onChange={e=>set('weight',parseFloat(e.target.value))}/></div>
          <div className="form-group"><label>Height (cm)</label><input type="number" value={profile?.height||''} onChange={e=>set('height',parseFloat(e.target.value))}/></div>
        </div>
        <div className="form-group"><label>Goal</label>
          <select value={profile?.goal||'maintain'} onChange={e=>set('goal',e.target.value)}>
            <option value="lose">Lose weight</option><option value="maintain">Maintain</option><option value="gain">Gain weight</option>
          </select>
        </div>
        <button className="btn-primary" style={{fontSize:13,padding:'9px 20px',marginTop:4}} onClick={handleSave}>
          {saved?'Saved ✓':'Save changes'}
        </button>
      </div>
      <div className="settings-list">
        <div className="settings-item">Dark mode<button className={`toggle${dark?' on':''}`} onClick={()=>setDark(!dark)}/></div>
        <div className="settings-item">Weekly reminders<button className="toggle on" onClick={e=>e.currentTarget.classList.toggle('on')}/></div>
        <div className="settings-item">Daily calorie alert<button className="toggle on" onClick={e=>e.currentTarget.classList.toggle('on')}/></div>
        <div className="settings-item" style={{color:'var(--red)',cursor:'pointer',fontWeight:700}} onClick={handleLogout}>Log out</div>
      </div>
    </div>
  )
}
