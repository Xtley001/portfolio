'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectForm {
  slug: string; name: string; tagline: string; year: number
  status: 'active'|'completed'|'archived'|'stealth'
  tech: string[]; github: string; live: string; image: string
  featured: boolean; description: string; sha?: string
}

interface SiteHero { firstName: string; lastName: string; tagline: string; available: boolean; location: string; handle: string; avatar: string }
interface SiteStack { category: string; items: string[] }
interface SiteStat { value: string; label: string }
interface SiteFocus { area: string; subs: string[] }
interface SiteEntry { year: string; role: string; org: string; note: string }
interface SitePersona { mind: { body: string; interests: string[] }; research: string[]; outside: { label: string; note: string }[] }
interface SiteTimeline { year: string; event: string }
interface SiteContact { email: string; twitter: string; github: string; telegram: string; linkedin?: string; goodreads?: string; note: string }
interface SiteData {
  hero: SiteHero; stack: SiteStack[]; stats: SiteStat[]; focus: SiteFocus[]
  experience: SiteEntry[]; education: SiteEntry[]
  persona: SitePersona; timeline: SiteTimeline[]; contact: SiteContact
}

const emptyProject: ProjectForm = { slug:'', name:'', tagline:'', year: new Date().getFullYear(), status:'active', tech:[], github:'', live:'', image:'', featured:false, description:'' }
const emptyEntry: SiteEntry = { year:'', role:'', org:'', note:'' }

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page:    { minHeight:'100vh', background:'var(--bg)', fontFamily:'var(--font-dm-mono)' } as React.CSSProperties,
  inner:   { maxWidth:'960px', margin:'0 auto', padding:'80px 24px 120px' } as React.CSSProperties,
  label:   { display:'block', fontSize:'10px', letterSpacing:'0.18em', color:'var(--text-faint)', textTransform:'uppercase' as const, marginBottom:'6px', marginTop:'20px' },
  input:   { width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'2px', color:'var(--text)', fontFamily:'var(--font-dm-mono)', fontSize:'13px', padding:'11px 14px', outline:'none' } as React.CSSProperties,
  textarea:{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'2px', color:'var(--text)', fontFamily:'var(--font-dm-mono)', fontSize:'13px', padding:'11px 14px', outline:'none', resize:'vertical' as const, minHeight:'120px' } as React.CSSProperties,
  select:  { width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'2px', color:'var(--text)', fontFamily:'var(--font-dm-mono)', fontSize:'13px', padding:'11px 14px', outline:'none' } as React.CSSProperties,
  btn:  (accent?:boolean) => ({ background: accent?'var(--accent)':'var(--surface)', color: accent?'var(--bg)':'var(--text)', border: accent?'none':'1px solid var(--border)', fontFamily:'var(--font-dm-mono)', fontSize:'11px', letterSpacing:'0.12em', padding:'11px 24px', cursor:'pointer', borderRadius:'2px', textTransform:'uppercase' as const }),
  card:    { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'4px', padding:'18px 20px', marginBottom:'1px', display:'flex', justifyContent:'space-between', alignItems:'center' } as React.CSSProperties,
  section: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'4px', padding:'28px', marginBottom:'20px' } as React.CSSProperties,
  danger:  { background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer', fontSize:'13px' } as React.CSSProperties,
  msg:  (ok:boolean) => ({ fontSize:'12px', color: ok?'var(--accent)':'#ff6b6b' }),
  subhead: { fontSize:'11px', letterSpacing:'0.15em', color:'var(--accent)', marginBottom:'16px', display:'block' } as React.CSSProperties,
}

const TABS = ['Projects','Hero','Stats','Focus','Experience','Stack','Persona','Timeline','Contact'] as const
type Tab = typeof TABS[number]

// ─── Dirty-state guard: warns on navigate-away when form has unsaved changes ──
function useDirtyWarning(current: unknown, initial: unknown) {
  const dirty = JSON.stringify(current) !== JSON.stringify(initial)
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])
  return dirty
}

// ─── Reorder helpers ──────────────────────────────────────────────────────────
function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function ReorderBtns({ i, total, onMove }: { i: number; total: number; onMove: (dir: -1|1) => void }) {
  const s: React.CSSProperties = { background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer', fontSize:'11px', padding:'0 3px', lineHeight:1 }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
      <button style={{ ...s, opacity: i===0 ? 0.2 : 1 }} disabled={i===0} onClick={()=>onMove(-1)}>▲</button>
      <button style={{ ...s, opacity: i===total-1 ? 0.2 : 1 }} disabled={i===total-1} onClick={()=>onMove(1)}>▼</button>
    </div>
  )
}

// ─── Image upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value:string; onChange:(u:string)=>void }) {
  const [uploading,setUploading] = useState(false)
  const [err,setErr] = useState('')
  const [imgBroken,setImgBroken] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const upload = async (file:File) => {
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) { setErr('Invalid type'); return }
    if (file.size > 10*1024*1024) { setErr('Max 10MB'); return }
    setUploading(true); setErr(''); setImgBroken(false)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method:'POST', body:fd })
    const data = await res.json()
    setUploading(false)
    if (data.url) onChange(data.url); else setErr(data.error || 'Upload failed')
  }

  return (
    <div>
      {value && !imgBroken && (
        <img src={value} alt="" onError={()=>setImgBroken(true)}
          style={{ height:'80px', borderRadius:'2px', border:'1px solid var(--border)', objectFit:'cover', display:'block', marginBottom:'10px' }} />
      )}
      {value && imgBroken && (
        <div style={{ height:'80px', width:'80px', borderRadius:'2px', border:'1px solid var(--border)', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'10px', fontSize:'10px', color:'var(--text-faint)', letterSpacing:'0.08em' }}>
          NO IMG
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
      <button style={S.btn()} onClick={()=>ref.current?.click()} disabled={uploading}>{uploading?'Uploading…':'Choose Image'}</button>
      {value && !uploading && !imgBroken && <span style={{ marginLeft:'12px', fontSize:'11px', color:'var(--accent)' }}>✓</span>}
      {err && <div style={{ color:'#ff6b6b', fontSize:'11px', marginTop:'6px' }}>{err}</div>}
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }:{ onLogin:()=>void }) {
  const [pw,setPw] = useState(''); const [err,setErr] = useState(''); const [loading,setLoading] = useState(false)
  const submit = async () => {
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password:pw }) })
    setLoading(false)
    if (res.ok) onLogin(); else setErr('Incorrect password')
  }
  return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'320px' }}>
        <div style={{ fontFamily:'var(--font-syne)', fontWeight:800, fontSize:'28px', color:'var(--text)', marginBottom:'40px' }}>ADMIN</div>
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} autoFocus />
        {err && <div style={{ color:'#ff6b6b', fontSize:'12px', marginTop:'8px' }}>{err}</div>}
        <button style={{ ...S.btn(true), marginTop:'20px', width:'100%' }} onClick={submit} disabled={loading}>{loading?'Checking…':'Enter'}</button>
      </div>
    </div>
  )
}

// ─── site data hook ────────────────────────────────────────────────────────────
function useSiteData() {
  const [data, setData] = useState<SiteData|null>(null)
  const [sha, setSha] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/site').then(r=>r.json()).then(d => {
      if (d.content) { setData(d.content); setSha(d.sha||'') }
      else setError('Failed to load site data — check GitHub/env configuration.')
      setLoading(false)
    }).catch(()=>{ setError('Network error loading site data.'); setLoading(false) })
  }, [])

  const save = async (updated:SiteData, cb:(m:string)=>void) => {
    const res = await fetch('/api/admin/site', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content:updated, sha }) })
    const d = await res.json()
    if (d.ok) { setData(updated); setSha(d.sha||sha); cb('✓ Saved — deploying in ~30s') }
    else cb('Error: '+(d.error||'unknown'))
  }

  return { data, setData, sha, loading, error, save }
}

// ─── Projects Tab (full CRUD) ─────────────────────────────────────────────────
function ProjectsTab() {
  const [files, setFiles] = useState<{name:string;sha:string}[]>([])
  const [form, setForm] = useState<ProjectForm|null>(null)
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)
  const [msg, setMsg] = useState('')

  const loadList = () => {
    fetch('/api/admin/projects').then(r=>r.json()).then(d=>setFiles(d.files||[]))
  }
  useEffect(()=>{ loadList() }, [])

  const startNew = () => { setForm({ ...emptyProject }); setTechInput(''); setMsg('') }

  const startEdit = async (slug:string) => {
    setLoadingEdit(true); setMsg('')
    const res = await fetch(`/api/admin/projects?slug=${slug}`)
    if (!res.ok) { setMsg('Could not load project'); setLoadingEdit(false); return }
    const data = await res.json()
    setForm({
      slug: data.slug || slug,
      name: data.name || slug,
      tagline: data.tagline || '',
      year: data.year || new Date().getFullYear(),
      status: data.status || 'active',
      tech: Array.isArray(data.tech) ? data.tech : [],
      github: data.github || '',
      live: data.live || '',
      image: data.image || '',
      featured: !!data.featured,
      description: data.description || '',
      sha: data.sha,
    })
    setTechInput('')
    setLoadingEdit(false)
  }

  const del = async (slug:string, sha:string) => {
    if (!confirm(`Delete ${slug}?`)) return
    setDeleting(slug)
    const res = await fetch('/api/admin/projects', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug, sha }) })
    const d = await res.json()
    setDeleting(null)
    if (d.ok) { setMsg('✓ Deleted'); loadList(); if (form?.slug===slug) setForm(null) }
    else setMsg('Error: '+(d.error||'unknown'))
  }

  const save = async () => {
    if (!form) return
    if (!form.slug || !form.name) { setMsg('Slug and Name are required'); return }
    setSaving(true); setMsg('')
    const res = await fetch('/api/admin/publish', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form }),
    })
    const d = await res.json()
    setSaving(false)
    if (d.ok) { setMsg('✓ Saved — deploying in ~30s'); loadList() }
    else setMsg('Error: '+(d.error||'unknown'))
  }

  const f = (k:keyof ProjectForm, v:unknown) => setForm(prev => prev ? { ...prev, [k]:v } : prev)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
        <span style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)' }}>Projects</span>
        <button style={S.btn(true)} onClick={startNew}>+ New Project</button>
      </div>

      {msg && <div style={{ ...S.msg(msg.startsWith('✓')), marginBottom:'16px' }}>{msg}</div>}

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginBottom:'32px' }}>
          {files.map(f => {
            const slug = f.name.replace('.mdx','')
            return (
              <div key={f.name} style={S.card}>
                <span style={{ fontSize:'13px', color:'var(--text-dim)', fontFamily:'var(--font-dm-mono)' }}>{slug}</span>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button style={S.btn()} onClick={()=>startEdit(slug)} disabled={loadingEdit}>{loadingEdit?'Loading…':'Edit'}</button>
                  <button style={{ ...S.btn(), color:'#ff6b6b', borderColor:'#ff6b6b44' }} onClick={()=>del(slug,f.sha)} disabled={deleting===slug}>{deleting===slug?'Deleting…':'Delete'}</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit / New form */}
      {form && (
        <div style={S.section}>
          <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'16px', color:'var(--text)', marginBottom:'24px' }}>
            {form.sha ? `Editing: ${form.slug}` : 'New Project'}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <div>
              <label style={S.label}>Slug (URL key)</label>
              <input style={S.input} value={form.slug} onChange={e=>f('slug',e.target.value.toLowerCase().replace(/\s+/g,'-'))} placeholder="osprey" disabled={!!form.sha} />
              {!!form.sha && <div style={{ fontSize:'10px', color:'var(--text-faint)', marginTop:'5px', letterSpacing:'0.05em' }}>Slug locked after creation. To rename: delete this project and recreate with the new slug.</div>}
            </div>
            <div>
              <label style={S.label}>Display Name</label>
              <input style={S.input} value={form.name} onChange={e=>f('name',e.target.value)} placeholder="OSPREY" />
            </div>
          </div>

          <label style={S.label}>Tagline</label>
          <input style={S.input} value={form.tagline} onChange={e=>f('tagline',e.target.value)} placeholder="One-line description" />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <div>
              <label style={S.label}>Year</label>
              <input style={S.input} type="number" value={form.year} onChange={e=>f('year',Number(e.target.value))} />
            </div>
            <div>
              <label style={S.label}>Status</label>
              <select style={S.select} value={form.status} onChange={e=>f('status',e.target.value)}>
                {['active','completed','archived','stealth'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop:'20px' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'13px', color:'var(--text-dim)' }}>
              <input type="checkbox" checked={form.featured} onChange={e=>f('featured',e.target.checked)} />
              Featured (shows larger, first in grid)
            </label>
          </div>

          <label style={S.label}>Tech Stack (Enter to add)</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'8px' }}>
            {form.tech.map(t=>(
              <span key={t} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', padding:'4px 10px', borderRadius:'2px', fontSize:'12px', color:'var(--text-dim)', display:'flex', alignItems:'center', gap:'6px' }}>
                {t}
                <button onClick={()=>f('tech',form.tech.filter(x=>x!==t))} style={{ background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer' }}>×</button>
              </span>
            ))}
          </div>
          <input style={S.input} value={techInput} onChange={e=>setTechInput(e.target.value)} placeholder="Rust — press Enter"
            onKeyDown={e=>{if(e.key==='Enter'&&techInput.trim()){f('tech',[...form.tech,techInput.trim()]);setTechInput('')}}} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <div>
              <label style={S.label}>GitHub URL</label>
              <input style={S.input} value={form.github} onChange={e=>f('github',e.target.value)} placeholder="https://github.com/…" />
            </div>
            <div>
              <label style={S.label}>Live URL</label>
              <input style={S.input} value={form.live} onChange={e=>f('live',e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <label style={S.label}>Project Image</label>
          <ImageUpload value={form.image} onChange={url=>f('image',url)} />

          <label style={S.label}>Description (supports MDX / markdown)</label>
          <textarea style={{ ...S.textarea, minHeight:'160px' }} value={form.description} onChange={e=>f('description',e.target.value)} />

          <div style={{ display:'flex', gap:'12px', marginTop:'28px', alignItems:'center', flexWrap:'wrap' }}>
            <button style={S.btn(true)} onClick={save} disabled={saving}>{saving?'Saving…':'Publish'}</button>
            <button style={S.btn()} onClick={()=>setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Hero Tab ─────────────────────────────────────────────────────────────────
function HeroTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [form,setForm] = useState<SiteHero>(data.hero)
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const f=(k:keyof SiteHero,v:unknown)=>setForm(p=>({...p,[k]:v}))
  const dirty = useDirtyWarning(form, data.hero)
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const submit=async()=>{ setSaving(true); await save({...data,hero:form},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Hero</div>
      <div style={S.section}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label style={S.label}>First Name (displays large)</label><input style={S.input} value={form.firstName} onChange={e=>f('firstName',e.target.value.toUpperCase())} /></div>
          <div><label style={S.label}>Last Name (accent color)</label><input style={S.input} value={form.lastName} onChange={e=>f('lastName',e.target.value.toUpperCase())} /></div>
        </div>
        <label style={S.label}>Tagline (two lines, use \n)</label>
        <textarea style={{ ...S.textarea, minHeight:'80px' }} value={form.tagline} onChange={e=>f('tagline',e.target.value)} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label style={S.label}>Location</label><input style={S.input} value={form.location} onChange={e=>f('location',e.target.value)} /></div>
          <div><label style={S.label}>Handle</label><input style={S.input} value={form.handle} onChange={e=>f('handle',e.target.value)} /></div>
        </div>
        <label style={S.label}>Avatar</label>
        <ImageUpload value={form.avatar} onChange={url=>f('avatar',url)} />
        <div style={{ marginTop:'20px' }}>
          <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'13px', color:'var(--text-dim)' }}>
            <input type="checkbox" checked={form.available} onChange={e=>f('available',e.target.checked)} />
            Show "● Available" badge
          </label>
        </div>
        <div style={{ display:'flex', gap:'12px', marginTop:'28px', alignItems:'center' }}>
          <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Hero'}</button>
          {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [stats,setStats] = useState<SiteStat[]>(data.stats)
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const dirty = useDirtyWarning(stats, data.stats)
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const submit=async()=>{ setSaving(true); await save({...data,stats},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Stats</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
        {stats.map((s,i)=>(
          <div key={i} style={S.section}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'10px', color:'var(--text-faint)', letterSpacing:'0.1em' }}>STAT {i+1}</span>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <ReorderBtns i={i} total={stats.length} onMove={d=>setStats(p=>moveItem(p,i,i+d))} />
                <button onClick={()=>setStats(p=>p.filter((_,j)=>j!==i))} style={S.danger}>✕</button>
              </div>
            </div>
            <label style={S.label}>Value</label>
            <input style={S.input} value={s.value} onChange={e=>setStats(p=>p.map((x,j)=>j===i?{...x,value:e.target.value}:x))} placeholder="68" />
            <label style={S.label}>Label</label>
            <input style={S.input} value={s.label} onChange={e=>setStats(p=>p.map((x,j)=>j===i?{...x,label:e.target.value}:x))} placeholder="GitHub Repos" />
          </div>
        ))}
      </div>
      <button style={{ ...S.btn(), marginBottom:'24px' }} onClick={()=>setStats(p=>[...p,{value:'',label:''}])}>+ Add Stat</button>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Stats'}</button>
        {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
      </div>
    </div>
  )
}

// ─── Focus Tab ────────────────────────────────────────────────────────────────
function FocusTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [focus,setFocus]=useState<SiteFocus[]>(data.focus||[])
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const dirty = useDirtyWarning(focus, data.focus||[])
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const [newArea,setNewArea]=useState('')
  const [newSubs,setNewSubs]=useState<Record<number,string>>({})
  const submit=async()=>{ setSaving(true); await save({...data,focus},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Focus Areas</div>
      {focus.map((area,ai)=>(
        <div key={ai} style={{ ...S.section, marginBottom:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <input style={{ ...S.input, fontWeight:700, flex:1 }} value={area.area} onChange={e=>setFocus(p=>p.map((a,i)=>i===ai?{...a,area:e.target.value}:a))} placeholder="Area name" />
            <div style={{ display:'flex', gap:'8px', alignItems:'center', marginLeft:'12px' }}>
              <ReorderBtns i={ai} total={focus.length} onMove={d=>setFocus(p=>moveItem(p,ai,ai+d))} />
              <button onClick={()=>setFocus(p=>p.filter((_,i)=>i!==ai))} style={S.danger}>✕</button>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {area.subs.map((sub,si)=>(
              <div key={si} style={{ display:'flex', gap:'8px' }}>
                <input style={{ ...S.input, flex:1 }} value={sub} onChange={e=>setFocus(p=>p.map((a,i)=>i===ai?{...a,subs:a.subs.map((s,j)=>j===si?e.target.value:s)}:a))} />
                <ReorderBtns i={si} total={area.subs.length} onMove={d=>setFocus(p=>p.map((a,i)=>i===ai?{...a,subs:moveItem(a.subs,si,si+d)}:a))} />
                <button onClick={()=>setFocus(p=>p.map((a,i)=>i===ai?{...a,subs:a.subs.filter((_,j)=>j!==si)}:a))} style={S.danger}>✕</button>
              </div>
            ))}
            <input style={S.input} value={newSubs[ai]||''} onChange={e=>setNewSubs(p=>({...p,[ai]:e.target.value}))} placeholder="Add sub-item — Enter"
              onKeyDown={e=>{if(e.key==='Enter'&&newSubs[ai]?.trim()){setFocus(p=>p.map((a,i)=>i===ai?{...a,subs:[...a.subs,newSubs[ai].trim()]}:a));setNewSubs(p=>({...p,[ai]:''}));}}} />
          </div>
        </div>
      ))}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
        <input style={{ ...S.input, flex:1 }} value={newArea} onChange={e=>setNewArea(e.target.value)} placeholder="New area name" />
        <button style={S.btn()} onClick={()=>{if(newArea.trim()){setFocus(p=>[...p,{area:newArea.trim(),subs:[]}]);setNewArea('')}}}>+ Add Area</button>
      </div>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Focus'}</button>
        {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
      </div>
    </div>
  )
}

// ─── Experience Tab ───────────────────────────────────────────────────────────
function ExperienceTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [experience,setExperience]=useState<SiteEntry[]>(data.experience||[])
  const [education,setEducation]=useState<SiteEntry[]>(data.education||[])
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const dirty = useDirtyWarning({experience,education}, {experience:data.experience||[], education:data.education||[]})
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const submit=async()=>{ setSaving(true); await save({...data,experience,education},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  const entryBlock = (entries:SiteEntry[], set:React.Dispatch<React.SetStateAction<SiteEntry[]>>, i:number) => (
    <div key={i} style={{ ...S.section, marginBottom:'10px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <div><label style={S.label}>Year / Range</label><input style={S.input} value={entries[i].year} onChange={e=>set(p=>p.map((x,j)=>j===i?{...x,year:e.target.value}:x))} placeholder="2026 →" /></div>
        <div><label style={S.label}>Role / Degree</label><input style={S.input} value={entries[i].role} onChange={e=>set(p=>p.map((x,j)=>j===i?{...x,role:e.target.value}:x))} placeholder="Quantitative Trader" /></div>
        <div><label style={S.label}>Organisation</label><input style={S.input} value={entries[i].org} onChange={e=>set(p=>p.map((x,j)=>j===i?{...x,org:e.target.value}:x))} placeholder="Algorealm Inc." /></div>
        <div><label style={S.label}>Note (optional)</label><input style={S.input} value={entries[i].note} onChange={e=>set(p=>p.map((x,j)=>j===i?{...x,note:e.target.value}:x))} placeholder="Iowa City · Hybrid" /></div>
      </div>
      <div style={{ display:'flex', gap:'12px', alignItems:'center', marginTop:'12px' }}>
        <ReorderBtns i={i} total={entries.length} onMove={d=>set(p=>moveItem(p,i,i+d))} />
        <button onClick={()=>set(p=>p.filter((_,j)=>j!==i))} style={{ ...S.danger, fontSize:'11px' }}>✕ Remove entry</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Experience & Education</div>
      <span style={S.subhead}>EXPERIENCE</span>
      {experience.map((_,i)=>entryBlock(experience,setExperience,i))}
      <button style={{ ...S.btn(), marginBottom:'32px' }} onClick={()=>setExperience(p=>[...p,{...emptyEntry}])}>+ Add Role</button>
      <span style={S.subhead}>EDUCATION</span>
      {education.map((_,i)=>entryBlock(education,setEducation,i))}
      <button style={{ ...S.btn(), marginBottom:'32px' }} onClick={()=>setEducation(p=>[...p,{...emptyEntry}])}>+ Add Degree</button>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save'}</button>
        {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
      </div>
    </div>
  )
}

// ─── Stack Tab ────────────────────────────────────────────────────────────────
function StackTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [stack,setStack]=useState<SiteStack[]>(data.stack)
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const [newCat,setNewCat]=useState('')
  const [newItems,setNewItems]=useState<Record<number,string>>({})
  const dirty = useDirtyWarning(stack, data.stack)
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const submit=async()=>{ setSaving(true); await save({...data,stack},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Tech Stack</div>
      {stack.map((cat,ci)=>(
        <div key={ci} style={{ ...S.section, marginBottom:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <input style={{ ...S.input, fontWeight:700, flex:1 }} value={cat.category} onChange={e=>setStack(p=>p.map((c,i)=>i===ci?{...c,category:e.target.value}:c))} />
            <div style={{ display:'flex', gap:'8px', alignItems:'center', marginLeft:'12px' }}>
              <ReorderBtns i={ci} total={stack.length} onMove={d=>setStack(p=>moveItem(p,ci,ci+d))} />
              <button onClick={()=>setStack(p=>p.filter((_,i)=>i!==ci))} style={S.danger}>✕</button>
            </div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'8px' }}>
            {cat.items.map((item,ii)=>(
              <span key={ii} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', padding:'4px 10px', borderRadius:'2px', fontSize:'12px', color:'var(--text-dim)', display:'flex', alignItems:'center', gap:'6px' }}>
                {item}
                <button onClick={()=>setStack(p=>p.map((c,i)=>i===ci?{...c,items:c.items.filter((_,j)=>j!==ii)}:c))} style={{ background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer' }}>×</button>
              </span>
            ))}
          </div>
          <input style={S.input} value={newItems[ci]||''} onChange={e=>setNewItems(p=>({...p,[ci]:e.target.value}))} placeholder="Add item — Enter"
            onKeyDown={e=>{if(e.key==='Enter'&&newItems[ci]?.trim()){setStack(p=>p.map((c,i)=>i===ci?{...c,items:[...c.items,newItems[ci].trim()]}:c));setNewItems(p=>({...p,[ci]:''}));}}} />
        </div>
      ))}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
        <input style={{ ...S.input, flex:1 }} value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category" />
        <button style={S.btn()} onClick={()=>{if(newCat.trim()){setStack(p=>[...p,{category:newCat.trim(),items:[]}]);setNewCat('')}}}>+ Category</button>
      </div>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Stack'}</button>
        {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
      </div>
    </div>
  )
}

// ─── Persona Tab ──────────────────────────────────────────────────────────────
function PersonaTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [persona,setPersona]=useState<SitePersona>(data.persona)
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const dirty = useDirtyWarning(persona, data.persona)
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const [newR,setNewR]=useState('')
  const [newI,setNewI]=useState('')
  const [newOL,setNewOL]=useState(''); const [newON,setNewON]=useState('')
  const submit=async()=>{ setSaving(true); await save({...data,persona},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Persona</div>

      <div style={S.section}>
        <span style={S.subhead}>THE MIND (shows near top of page)</span>
        <label style={S.label}>Body text</label>
        <textarea style={S.textarea} value={persona.mind.body} onChange={e=>setPersona(p=>({...p,mind:{...p.mind,body:e.target.value}}))} />
        <label style={{ ...S.label, marginTop:'16px' }}>Interests</label>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {(persona.mind.interests||[]).map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:'8px' }}>
              <input style={{ ...S.input, flex:1 }} value={s} onChange={e=>setPersona(p=>({...p,mind:{...p.mind,interests:(p.mind.interests||[]).map((x,j)=>j===i?e.target.value:x)}}))} />
              <ReorderBtns i={i} total={(persona.mind.interests||[]).length} onMove={d=>setPersona(p=>({...p,mind:{...p.mind,interests:moveItem(p.mind.interests||[],i,i+d)}}))} />
              <button onClick={()=>setPersona(p=>({...p,mind:{...p.mind,interests:(p.mind.interests||[]).filter((_,j)=>j!==i)}}))} style={S.danger}>✕</button>
            </div>
          ))}
          <input style={S.input} value={newI} onChange={e=>setNewI(e.target.value)} placeholder="Add interest — Enter"
            onKeyDown={e=>{if(e.key==='Enter'&&newI.trim()){setPersona(p=>({...p,mind:{...p.mind,interests:[...(p.mind.interests||[]),newI.trim()]}}));setNewI('')}}} />
        </div>
      </div>

      <div style={S.section}>
        <span style={S.subhead}>CURRENTLY RESEARCHING</span>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {persona.research.map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:'8px' }}>
              <input style={{ ...S.input, flex:1 }} value={s} onChange={e=>setPersona(p=>({...p,research:p.research.map((x,j)=>j===i?e.target.value:x)}))} />
              <ReorderBtns i={i} total={persona.research.length} onMove={d=>setPersona(p=>({...p,research:moveItem(p.research,i,i+d)}))} />
              <button onClick={()=>setPersona(p=>({...p,research:p.research.filter((_,j)=>j!==i)}))} style={S.danger}>✕</button>
            </div>
          ))}
          <input style={S.input} value={newR} onChange={e=>setNewR(e.target.value)} placeholder="Add topic — Enter"
            onKeyDown={e=>{if(e.key==='Enter'&&newR.trim()){setPersona(p=>({...p,research:[...p.research,newR.trim()]}));setNewR('')}}} />
        </div>
      </div>

      <div style={S.section}>
        <span style={S.subhead}>OUTSIDE THE TERMINAL</span>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {persona.outside.map((item,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto auto', gap:'8px', alignItems:'center' }}>
              <input style={S.input} value={item.label} onChange={e=>setPersona(p=>({...p,outside:p.outside.map((x,j)=>j===i?{...x,label:e.target.value}:x)}))} placeholder="Label" />
              <input style={S.input} value={item.note} onChange={e=>setPersona(p=>({...p,outside:p.outside.map((x,j)=>j===i?{...x,note:e.target.value}:x)}))} placeholder="Note (optional)" />
              <ReorderBtns i={i} total={persona.outside.length} onMove={d=>setPersona(p=>({...p,outside:moveItem(p.outside,i,i+d)}))} />
              <button onClick={()=>setPersona(p=>({...p,outside:p.outside.filter((_,j)=>j!==i)}))} style={S.danger}>✕</button>
            </div>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'8px', alignItems:'center' }}>
            <input style={S.input} value={newOL} onChange={e=>setNewOL(e.target.value)} placeholder="Label" />
            <input style={S.input} value={newON} onChange={e=>setNewON(e.target.value)} placeholder="Note (optional)" />
            <button style={S.btn()} onClick={()=>{if(newOL.trim()){setPersona(p=>({...p,outside:[...p.outside,{label:newOL.trim(),note:newON.trim()}]}));setNewOL('');setNewON('')}}}>+</button>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Persona'}</button>
        {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
      </div>
    </div>
  )
}

// ─── Timeline Tab ─────────────────────────────────────────────────────────────
function TimelineTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [timeline,setTimeline]=useState<SiteTimeline[]>(data.timeline||[])
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const dirty = useDirtyWarning(timeline, data.timeline||[])
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const submit=async()=>{ setSaving(true); await save({...data,timeline},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'8px' }}>On-chain Timeline</div>
      <p style={{ fontSize:'12px', color:'var(--text-faint)', marginBottom:'28px' }}>Entries appear as an "On-chain" row below Experience &amp; Education on the site.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
        {timeline.map((item,i)=>(
          <div key={i} style={{ ...S.section, marginBottom:0, display:'grid', gridTemplateColumns:'100px 1fr auto', gap:'12px', alignItems:'center' }}>
            <input style={S.input} value={item.year} onChange={e=>setTimeline(p=>p.map((x,j)=>j===i?{...x,year:e.target.value}:x))} placeholder="2024" />
            <input style={S.input} value={item.event} onChange={e=>setTimeline(p=>p.map((x,j)=>j===i?{...x,event:e.target.value}:x))} placeholder="Event description" />
            <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
              <ReorderBtns i={i} total={timeline.length} onMove={d=>setTimeline(p=>moveItem(p,i,i+d))} />
              <button onClick={()=>setTimeline(p=>p.filter((_,j)=>j!==i))} style={S.danger}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <button style={{ ...S.btn(), marginBottom:'24px' }} onClick={()=>setTimeline(p=>[...p,{year:String(new Date().getFullYear()),event:''}])}>+ Add Entry</button>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Timeline'}</button>
        {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
      </div>
    </div>
  )
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────
function ContactTab({ data, save, onDirty }:{ data:SiteData; save:(d:SiteData,cb:(m:string)=>void)=>void; onDirty:(v:boolean)=>void }) {
  const [contact,setContact]=useState<SiteContact>(data.contact)
  const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('')
  const dirty = useDirtyWarning(contact, data.contact)
  useEffect(()=>onDirty(dirty),[dirty,onDirty])
  const f=(k:keyof SiteContact,v:string)=>setContact(p=>({...p,[k]:v}))
  const submit=async()=>{ setSaving(true); await save({...data,contact},m=>{setMsg(m); if(m.startsWith('✓')) onDirty(false)}); setSaving(false) }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-syne)', fontWeight:700, fontSize:'20px', color:'var(--text)', marginBottom:'28px' }}>Contact & Links</div>
      <div style={S.section}>
        <label style={S.label}>Email</label>
        <input style={S.input} type="email" value={contact.email} onChange={e=>f('email',e.target.value)} placeholder="you@example.com" />
        <label style={S.label}>GitHub URL</label>
        <input style={S.input} value={contact.github} onChange={e=>f('github',e.target.value)} placeholder="https://github.com/handle" />
        <label style={S.label}>X / Twitter URL</label>
        <input style={S.input} value={contact.twitter} onChange={e=>f('twitter',e.target.value)} placeholder="https://x.com/handle" />
        <label style={S.label}>LinkedIn URL</label>
        <input style={S.input} value={contact.linkedin||''} onChange={e=>f('linkedin',e.target.value)} placeholder="https://linkedin.com/in/handle" />
        <label style={S.label}>Goodreads URL</label>
        <input style={S.input} value={contact.goodreads||''} onChange={e=>f('goodreads',e.target.value)} placeholder="https://www.goodreads.com/user/show/…" />
        <label style={S.label}>Telegram URL</label>
        <input style={S.input} value={contact.telegram} onChange={e=>f('telegram',e.target.value)} placeholder="https://t.me/handle" />
        <label style={S.label}>Note (shown below "Let's Talk")</label>
        <textarea style={{ ...S.textarea, minHeight:'80px' }} value={contact.note} onChange={e=>f('note',e.target.value)} />
        <div style={{ display:'flex', gap:'12px', marginTop:'28px', alignItems:'center' }}>
          <button style={S.btn(true)} onClick={submit} disabled={saving}>{saving?'Saving…':'Save Contact'}</button>
          {msg && <span style={S.msg(msg.startsWith('✓'))}>{msg}</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,setAuthed]=useState(false)
  const [checking,setChecking]=useState(true)
  const [tab,setTab]=useState<Tab>('Projects')
  const [dirtyTabs,setDirtyTabs]=useState<Set<Tab>>(new Set())
  const { data, loading, error, save } = useSiteData()

  // Stable per-tab dirty callbacks — useCallback prevents infinite render loop
  const markDirtyHero       = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Hero'):s.delete('Hero');return s}),[])
  const markDirtyStats      = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Stats'):s.delete('Stats');return s}),[])
  const markDirtyFocus      = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Focus'):s.delete('Focus');return s}),[])
  const markDirtyExperience = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Experience'):s.delete('Experience');return s}),[])
  const markDirtyStack      = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Stack'):s.delete('Stack');return s}),[])
  const markDirtyPersona    = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Persona'):s.delete('Persona');return s}),[])
  const markDirtyTimeline   = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Timeline'):s.delete('Timeline');return s}),[])
  const markDirtyContact    = useCallback((v:boolean)=>setDirtyTabs(p=>{const s=new Set(p);v?s.add('Contact'):s.delete('Contact');return s}),[] )

  useEffect(()=>{
    fetch('/api/admin/me').then(r=>{ if(r.ok) setAuthed(true); setChecking(false) }).catch(()=>setChecking(false))
  },[])

  if (checking) return <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontSize:'13px' }}>…</div>
  if (!authed) return <LoginScreen onLogin={()=>setAuthed(true)} />

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'48px', flexWrap:'wrap', gap:'16px' }}>
          <span style={{ fontFamily:'var(--font-syne)', fontWeight:800, fontSize:'22px', color:'var(--text)' }}>ADMIN</span>
          <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontFamily:'var(--font-dm-mono)', fontSize:'11px', color:'var(--text-dim)', letterSpacing:'0.1em', padding:'8px 16px', border:'1px solid var(--border)', textDecoration:'none', transition:'color 0.2s' }}>Preview Site ↗</a>
            <button style={S.btn()} onClick={async()=>{ await fetch('/api/admin/logout',{method:'POST'}); setAuthed(false) }}>Logout</button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:'2px', marginBottom:'40px', flexWrap:'wrap' }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ ...S.btn(tab===t), padding:'9px 16px', fontSize:'10px', borderRadius:'2px', position:'relative' }}>
              {t}{dirtyTabs.has(t) && <span style={{ position:'absolute', top:'5px', right:'5px', width:'5px', height:'5px', borderRadius:'50%', background:'var(--accent)', display:'block' }} />}
            </button>
          ))}
        </div>

        {tab==='Projects' && <ProjectsTab />}

        {loading && tab!=='Projects' && (
          <div style={{ color:'var(--text-faint)', fontSize:'13px' }}>Loading…</div>
        )}
        {!loading && error && tab!=='Projects' && (
          <div style={{ background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.25)', borderRadius:'4px', padding:'16px 20px', color:'#ff6b6b', fontFamily:'var(--font-dm-mono)', fontSize:'13px' }}>
            {error}
          </div>
        )}
        {!loading && data && (
          <>
            {tab==='Hero'       && <HeroTab data={data} save={save} onDirty={markDirtyHero} />}
            {tab==='Stats'      && <StatsTab data={data} save={save} onDirty={markDirtyStats} />}
            {tab==='Focus'      && <FocusTab data={data} save={save} onDirty={markDirtyFocus} />}
            {tab==='Experience' && <ExperienceTab data={data} save={save} onDirty={markDirtyExperience} />}
            {tab==='Stack'      && <StackTab data={data} save={save} onDirty={markDirtyStack} />}
            {tab==='Persona'    && <PersonaTab data={data} save={save} onDirty={markDirtyPersona} />}
            {tab==='Timeline'   && <TimelineTab data={data} save={save} onDirty={markDirtyTimeline} />}
            {tab==='Contact'    && <ContactTab data={data} save={save} onDirty={markDirtyContact} />}
          </>
        )}
      </div>
    </div>
  )
}
