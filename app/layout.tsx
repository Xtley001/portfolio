import type { Metadata } from 'next'
import '../styles/globals.css'
import Nav from '../components/Nav'
import Cursor from '../components/Cursor'
import { getSiteData } from '../lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData()
  const fullName = `${site.hero.firstName} ${site.hero.lastName}`.trim()
  const handle = site.hero.handle || '@Xtley001'
  const tagline = site.hero.tagline.replace(/\n/g, ' ')
  const githubUrl = site.contact.github || 'https://github.com/Xtley001'

  return {
    title: `${site.hero.handle || fullName} — DeFi Quant`,
    description: tagline,
    keywords: ['DeFi', 'quant trader', 'funding rate arbitrage', 'delta neutral', 'algorithmic trading', 'flash loans', 'MEV'],
    authors: [{ name: fullName, url: githubUrl }],
    openGraph: {
      title: `${site.hero.handle || fullName} — DeFi Quant`,
      description: tagline,
      url: `https://${site.contact.email?.split('@')[1] || 'xtley001.com'}`,
      siteName: site.hero.handle || fullName,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.hero.handle || fullName} — DeFi Quant`,
      creator: handle,
    },
    robots: { index: true, follow: true },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteData()
  const githubUrl = site.contact.github || 'https://github.com/Xtley001'
  const logoText = site.hero.handle?.replace('@', '') || `${site.hero.firstName}${site.hero.lastName}`.trim() || 'XTLEY001'

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Cursor />
        <Nav githubUrl={githubUrl} logoText={logoText} />
        {children}
      </body>
    </html>
  )
}
