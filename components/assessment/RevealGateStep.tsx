'use client'
import { useState } from 'react'

export interface ContactForm {
  name: string
  email: string
  whatsapp: string
  businessType: string
  businessStage: string
}

const BUSINESS_TYPES = [
  'Other',
  'Coaching / Consulting',
  'Photography / Creative',
  'Events / Planning',
  'Agency / Marketing',
  'Local Service Business',
  'E-commerce',
]

const BUSINESS_STAGES = ['Getting some clients', 'Just starting out', 'Steady and growing', 'Established, want more']

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '2px',
  color: 'var(--text)',
  fontFamily: 'var(--font-dm-mono)',
  fontSize: '14px',
  padding: '14px 16px',
  outline: 'none',
  minHeight: '44px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-dm-mono)',
  fontSize: '10px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
  marginBottom: '6px',
  marginTop: '18px',
}

export default function RevealGateStep({
  contact,
  honeypot,
  submitting,
  error,
  onChange,
  onHoneypotChange,
  onSubmit,
  onBack,
}: {
  contact: ContactForm
  honeypot: string
  submitting: boolean
  error: string
  onChange: (field: keyof ContactForm, value: string) => void
  onHoneypotChange: (value: string) => void
  onSubmit: () => void
  onBack: () => void
}) {
  const [touched, setTouched] = useState(false)

  const hasContact = contact.whatsapp.trim().length > 0 || contact.email.trim().length > 0
  const valid = contact.name.trim().length > 0 && hasContact

  const handleSubmit = () => {
    setTouched(true)
    if (!valid || submitting) return
    onSubmit()
  }

  return (
    <div className="reveal visible" style={{ width: '100%', maxWidth: '480px' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '12px',
          padding: 0,
          marginBottom: '24px',
        }}
      >
        ← back
      </button>

      <h2
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(20px, 4vw, 26px)',
          color: 'var(--text)',
          marginBottom: '10px',
        }}
      >
        Almost there — where should we send your results?
      </h2>
      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: 'var(--text-faint)', marginBottom: '8px' }}>
        No spam. Just your results and one follow-up.
      </p>

      <label style={labelStyle}>Name</label>
      <input style={inputStyle} value={contact.name} onChange={e => onChange('name', e.target.value)} placeholder="Your name" />

      <label style={labelStyle}>WhatsApp number</label>
      <input
        style={inputStyle}
        type="tel"
        value={contact.whatsapp}
        onChange={e => onChange('whatsapp', e.target.value)}
        placeholder="+234 800 000 0000"
      />
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-faint)', marginTop: '5px' }}>
        We'll message you there if you'd rather skip email.
      </div>

      <label style={labelStyle}>Email {contact.whatsapp.trim() ? '(optional)' : ''}</label>
      <input style={inputStyle} type="email" value={contact.email} onChange={e => onChange('email', e.target.value)} placeholder="you@example.com" />

      <label style={labelStyle}>Business type</label>
      <select style={inputStyle as React.CSSProperties} value={contact.businessType} onChange={e => onChange('businessType', e.target.value)}>
        {BUSINESS_TYPES.map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Business stage</label>
      <select style={inputStyle as React.CSSProperties} value={contact.businessStage} onChange={e => onChange('businessStage', e.target.value)}>
        {BUSINESS_STAGES.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Honeypot — off-screen (not display:none/type=hidden) so bots that skip real hidden
          inputs still fill it, but real users never see or reach it. */}
      <div
        style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
        aria-hidden="false"
      >
        <label htmlFor="company_website">Company Website</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={e => onHoneypotChange(e.target.value)}
        />
      </div>

      {touched && !valid && (
        <div style={{ marginTop: '14px', fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: '#ff6b6b' }}>
          Please add your name and at least a WhatsApp number or email.
        </div>
      )}
      {error && (
        <div style={{ marginTop: '14px', fontFamily: 'var(--font-dm-mono)', fontSize: '12px', color: '#ff6b6b' }}>{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          marginTop: '24px',
          width: '100%',
          background: 'var(--accent)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: '2px',
          padding: '16px 20px',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: submitting ? 'default' : 'pointer',
          opacity: submitting ? 0.7 : 1,
          minHeight: '44px',
        }}
      >
        {submitting ? 'Getting your results…' : 'Show My Results →'}
      </button>
    </div>
  )
}
