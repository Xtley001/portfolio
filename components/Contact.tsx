'use client'
import { useEffect, useRef, useState } from 'react'
import type { SiteData } from '../lib/site'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)
const GoodreadsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.43 23.995c-3.608-.208-6.274-2.077-6.448-5.488.695.007 1.375-.013 2.07-.006.224 1.342 1.065 2.43 2.683 3.026 1.583.496 3.737.46 5.082-.174 2.198-1.084 2.433-3.862 2.374-6.126a11.07 11.07 0 0 1-1.096 1.735c-1.193 1.448-2.86 2.133-4.787 2.012-1.67-.09-3.145-.83-4.233-2.118C5.988 15.716 5.622 13.9 5.655 12c-.03-2.075.39-3.89 1.394-5.33 1.184-1.713 3.032-2.635 5.135-2.573 2.264.048 3.898 1.388 4.637 3.07h.053V4.285h2.013V17.33c.002 2.213-.173 4.008-1.052 5.316-1.496 2.157-4.307 2.52-6.415 2.35zm.68-20.335c-1.52-.04-2.906.65-3.744 1.878-.91 1.165-1.243 2.733-1.244 4.387-.013 1.827.284 3.51 1.275 4.65.91 1.016 2.271 1.544 3.712 1.458 1.412-.085 2.56-.694 3.363-1.733.988-1.213 1.29-2.84 1.46-4.447-.077-1.645-.364-3.29-1.352-4.524-.88-1.085-2.08-1.64-3.47-1.669z"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10"/>
  </svg>
)

export default function Contact({ contact }: { contact: SiteData['contact'] }) {
  const ref = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
      }, { threshold: 0.05 })
      ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }, 80)
    return () => clearTimeout(t)
  }, [])

  const links = [
    contact.email    && { label: 'Email',      href: `mailto:${contact.email}`,  display: contact.email,                                                                   icon: <EmailIcon />    },
    contact.github   && { label: 'GitHub',     href: contact.github,             display: contact.github.replace('https://github.com/', ''),                               icon: <GithubIcon />   },
    contact.twitter  && { label: 'X / Twitter',href: contact.twitter,            display: '@' + (contact.twitter.split('/').pop() || ''),                                  icon: <TwitterIcon />  },
    contact.linkedin && { label: 'LinkedIn',   href: contact.linkedin,           display: 'linkedin.com/in/' + (contact.linkedin.split('/in/')[1] || '').replace(/\/$/, ''), icon: <LinkedInIcon /> },
    contact.goodreads && { label: 'Goodreads', href: contact.goodreads,          display: 'goodreads.com',                                                                 icon: <GoodreadsIcon />},
    contact.telegram && { label: 'Telegram',   href: contact.telegram,           display: contact.telegram.replace('https://t.me/', '@'),                                  icon: <TelegramIcon /> },
  ].filter(Boolean) as { label: string; href: string; display: string; icon: React.ReactNode }[]

  return (
    <section ref={ref} id="contact" style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 40px) 120px', maxWidth: '1200px', margin: '0 auto' }}>
      <hr style={{ marginBottom: '48px' }} />

      <div className="reveal" style={{ marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          06 — Contact
        </span>
      </div>

      {/* contact-grid CSS class overrides to 1fr on mobile */}
      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

        {/* LEFT — headline + CTA */}
        <div className="reveal">
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '24px' }}>
            LET&apos;S<br />TALK.
          </h2>
          {contact.note && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 'clamp(13px, 1.4vw, 15px)', color: 'var(--text-dim)', lineHeight: 1.9, maxWidth: '320px' }}>
              {contact.note}
            </p>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '28px', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'var(--font-dm-mono)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 22px', borderRadius: '2px', transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Send Message <ArrowIcon />
            </a>
          )}
        </div>

        {/* RIGHT — link list, overflow-safe */}
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', borderBottom: '1px solid var(--border)', transition: 'all 0.2s', color: 'var(--text-dim)', minWidth: 0, overflow: 'hidden', WebkitTapHighlightColor: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.paddingLeft = '4px' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; (e.currentTarget as HTMLElement).style.paddingLeft = '0' }}
            >
              {/* Icon */}
              <span style={{ flexShrink: 0, opacity: 0.6 }}>{link.icon}</span>

              {/* Label */}
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>
                {link.label}
              </span>

              {/* Display — truncated with ellipsis so it never overflows */}
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', letterSpacing: '0.02em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
                {link.display}
              </span>

              <span style={{ flexShrink: 0 }}><ArrowIcon /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
