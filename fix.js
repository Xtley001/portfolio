const fs = require('fs');

// ── globals.css ──────────────────────────────────────────────────────────
const css = [
  "@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');",
  "",
  "@tailwind base;",
  "@tailwind components;",
  "@tailwind utilities;",
  "",
  ":root {",
  "  --bg: #0a0a0a; --surface: #111111; --surface-2: #1a1a1a;",
  "  --border: #2a2a2a; --border-bright: #3a3a3a;",
  "  --text: #e8e8e8; --text-dim: #888888; --text-faint: #444444;",
  "  --accent: #c8b89a; --accent-dim: #7a6e5f;",
  "  --font-syne: 'Syne', sans-serif;",
  "  --font-dm-mono: 'DM Mono', monospace;",
  "}",
  "",
  "* { box-sizing: border-box; margin: 0; padding: 0; }",
  "html { scroll-behavior: smooth; overflow-x: hidden; max-width: 100vw; scrollbar-gutter: stable; }",
  "body { background-color: var(--bg); color: var(--text); font-family: var(--font-dm-mono); font-size: 15px; line-height: 1.75; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; cursor: none; overflow-x: hidden; max-width: 100vw; }",
  "",
  ".cursor { position: fixed; width: 8px; height: 8px; background: var(--accent); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s, opacity 0.2s; }",
  ".cursor-ring { position: fixed; width: 32px; height: 32px; border: 1px solid var(--accent-dim); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: all 0.12s ease-out; opacity: 0.5; }",
  "body:hover .cursor { opacity: 1; }",
  "",
  "::selection { background: var(--accent); color: var(--bg); }",
  "::-webkit-scrollbar { width: 2px; }",
  "::-webkit-scrollbar-track { background: var(--bg); }",
  "::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }",
  "::-webkit-scrollbar-thumb:hover { background: var(--accent-dim); }",
  "",
  "body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\"); pointer-events: none; z-index: 1; opacity: 0.35; }",
  "",
  "@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }",
  "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }",
  "@keyframes drawLine { from { width: 0; } to { width: 100%; } }",
  "",
  ".animate-fade-up { animation: fadeUp 0.7s ease forwards; opacity: 0; }",
  ".animate-fade-in { animation: fadeIn 0.6s ease forwards; opacity: 0; }",
  ".delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }",
  ".delay-300 { animation-delay: 0.3s; } .delay-400 { animation-delay: 0.4s; }",
  ".delay-500 { animation-delay: 0.5s; } .delay-600 { animation-delay: 0.6s; }",
  ".delay-700 { animation-delay: 0.7s; } .delay-800 { animation-delay: 0.8s; }",
  "",
  ".reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }",
  ".reveal.visible { opacity: 1; transform: translateY(0); }",
  ".avatar-wrapper { position: relative; display: inline-block; }",
  ".avatar-wrapper::after { content: ''; position: absolute; inset: 0; background: var(--bg); transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1); transform-origin: bottom; }",
  ".avatar-wrapper.revealed::after { transform: scaleY(0); }",
  ".draw-line { width: 0; height: 1px; background: var(--accent); animation: drawLine 1.2s cubic-bezier(0.76, 0, 0.24, 1) 0.4s forwards; }",
  "",
  "hr { border: none; border-top: 1px solid var(--border); margin: 0; }",
  "a { color: inherit; text-decoration: none; }",
  "*:focus-visible { outline: 1px solid var(--accent); outline-offset: 2px; }",
  "",
  ".mdx-content { font-family: var(--font-dm-mono); font-size: 13px; color: var(--text-dim); line-height: 2; }",
  ".mdx-content p { margin-bottom: 1.4em; }",
  ".mdx-content h1, .mdx-content h2, .mdx-content h3 { font-family: var(--font-syne); font-weight: 700; color: var(--text); letter-spacing: 0.02em; margin: 2em 0 0.6em; }",
  ".mdx-content h1 { font-size: 1.5rem; } .mdx-content h2 { font-size: 1.15rem; }",
  ".mdx-content h3 { font-size: 0.95rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }",
  ".mdx-content strong { color: var(--text); font-weight: 500; }",
  ".mdx-content em { color: var(--text-dim); font-style: italic; }",
  ".mdx-content a { color: var(--accent); transition: opacity 0.15s; }",
  ".mdx-content a:hover { opacity: 0.7; }",
  ".mdx-content code { font-family: var(--font-dm-mono); font-size: 12px; background: var(--surface); border: 1px solid var(--border); padding: 1px 7px; border-radius: 2px; color: var(--accent); }",
  ".mdx-content pre { background: var(--surface); border: 1px solid var(--border); padding: 20px 24px; border-radius: 4px; overflow-x: auto; margin: 1.6em 0; }",
  ".mdx-content pre code { background: none; border: none; padding: 0; color: var(--text-dim); font-size: 12px; }",
  ".mdx-content ul, .mdx-content ol { padding-left: 1.4em; margin-bottom: 1.4em; }",
  ".mdx-content li { margin-bottom: 0.4em; }",
  ".mdx-content blockquote { border-left: 2px solid var(--accent); padding-left: 20px; margin: 1.6em 0; color: var(--text-faint); font-style: italic; }",
  ".mdx-content hr { border-color: var(--border); margin: 2.4em 0; }",
  "",
  "/* RESPONSIVE */",
  "@media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2, 1fr) !important; } }",
  "@media (max-width: 768px) { .timeline-grid { grid-template-columns: 1fr !important; gap: 40px !important; } .contact-grid { grid-template-columns: 1fr !important; } }",
  "",
  "@media (max-width: 640px) {",
  "  body { cursor: auto; font-size: 14px; }",
  "  .cursor, .cursor-ring { display: none !important; }",
  "  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }",
  "  .animate-fade-up, .animate-fade-in { animation: none !important; opacity: 1 !important; transform: none !important; }",
  "  .hero-name { font-size: 10vw !important; white-space: nowrap !important; word-break: keep-all !important; overflow: hidden !important; }",
  "  .projects-grid { grid-template-columns: 1fr !important; }",
  "  .timeline-grid { grid-template-columns: 1fr !important; gap: 32px !important; }",
  "  .contact-grid { grid-template-columns: 1fr !important; gap: 36px !important; }",
  "  .stack-grid { grid-template-columns: 1fr 1fr !important; }",
  "  .focus-grid { grid-template-columns: 1fr 1fr !important; }",
  "  img, video, iframe { max-width: 100% !important; }",
  "  section, article { overflow-x: hidden; }",
  "}",
  "",
  "@media (max-width: 480px) {",
  "  .hero-name { font-size: 9.5vw !important; white-space: nowrap !important; word-break: keep-all !important; }",
  "  .focus-grid { grid-template-columns: 1fr !important; }",
  "  .stack-grid { grid-template-columns: 1fr !important; }",
  "  .mdx-content { font-size: 12px; }",
  "}",
  "",
  "@media (hover: none) { .cursor, .cursor-ring { display: none !important; } body { cursor: auto !important; } }",
].join('\n');

fs.writeFileSync('styles/globals.css', css);
console.log('globals.css written');

// ── Footer.tsx ───────────────────────────────────────────────────────────
const footer = [
  "export default function Footer() {",
  "  const year = new Date().getFullYear()",
  "  return (",
  "    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px clamp(16px, 4vw, 24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>",
  "      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>",
  "        {`© ${year} Xtley001`}",
  "      </span>",
  "      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>",
  "        olubelachristley@gmail.com",
  "      </span>",
  "    </footer>",
  "  )",
  "}",
].join('\n');

fs.writeFileSync('components/Footer.tsx', footer);
console.log('Footer.tsx written');

// ── ScrollToTop.tsx ──────────────────────────────────────────────────────
const scrollTop = [
  "'use client'",
  "import { useEffect, useState } from 'react'",
  "",
  "export default function ScrollToTop() {",
  "  const [opacity, setOpacity] = useState(0)",
  "  const [visible, setVisible] = useState(false)",
  "",
  "  useEffect(() => {",
  "    const onScroll = () => {",
  "      const scrolled = window.scrollY",
  "      const total = document.body.scrollHeight - window.innerHeight",
  "      if (total <= 0) return",
  "      const progress = scrolled / total",
  "      const show = scrolled > 300",
  "      setVisible(show)",
  "      setOpacity(show ? Math.min(1, 0.25 + progress * 1.25) : 0)",
  "    }",
  "    window.addEventListener('scroll', onScroll, { passive: true })",
  "    return () => window.removeEventListener('scroll', onScroll)",
  "  }, [])",
  "",
  "  return (",
  "    <button",
  "      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}",
  "      aria-label='Back to top'",
  "      style={{ position: 'fixed', bottom: 'clamp(20px, 5vw, 36px)', right: 'clamp(16px, 4vw, 32px)', zIndex: 90, background: 'transparent', border: '1px solid var(--border)', color: 'var(--accent)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: visible ? opacity : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.3s ease, transform 0.3s ease, border-color 0.2s, background 0.2s', pointerEvents: visible ? 'auto' : 'none', WebkitTapHighlightColor: 'transparent', borderRadius: '2px' }}",
  "      onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--accent)'; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--bg)'; }}",
  "      onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--accent)'; }}",
  "    >",
  "      <svg width='14' height='14' viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>",
  "        <line x1='7' y1='12' x2='7' y2='2' />",
  "        <polyline points='3,6 7,2 11,6' />",
  "      </svg>",
  "    </button>",
  "  )",
  "}",
].join('\n');

fs.writeFileSync('components/ScrollToTop.tsx', scrollTop);
console.log('ScrollToTop.tsx written');

// ── layout.tsx — inject ScrollToTop if missing ───────────────────────────
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
if (!layout.includes('ScrollToTop')) {
  layout = layout.replace(
    "import Nav from",
    "import ScrollToTop from '../components/ScrollToTop'\nimport Nav from"
  );
  layout = layout.replace('</body>', '        <ScrollToTop />\n      </body>');
  fs.writeFileSync('app/layout.tsx', layout);
  console.log('layout.tsx updated');
} else {
  console.log('layout.tsx already has ScrollToTop — skipped');
}

console.log('Done');
