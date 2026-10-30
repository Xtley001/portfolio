import type { Metadata } from 'next'
import '../styles/globals.css'
import Nav from '../components/Nav'
import Cursor from '../components/Cursor'
import ScrollToTop from '../components/ScrollToTop'
import { getSiteData } from '../lib/site'

const SITE_URL = 'https://olubelachristley.dev'

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData()
  const fullName = `${site.hero.firstName} ${site.hero.lastName}`.trim() || 'Christley Olubela'
  const handle = site.hero.handle || '@Xtley001'
  const cleanHandle = handle.replace('@', '')
  const tagline = site.hero.tagline.replace(/\n/g, ' ')

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${fullName} (@${cleanHandle}) — Rust Systems & MEV Infrastructure Engineer`,
      template: `%s | ${fullName}`,
    },
    description: tagline,
    keywords: [
      fullName,
      'Christley Olubela',
      'Xtley001',
      'Rust Systems Engineer',
      'MEV Infrastructure Engineer',
      'REVM Simulation',
      'Alloy',
      'Reth',
      'Driftbrake',
      'optimal-sizing',
      'brain-libraries',
      'Block Building',
      'rbuilder',
      'Flash Loans',
      'Protocol Liquidations',
      'AMM Trade Sizing',
      'Write-Ahead Log',
      'DLMM',
      'Solidity Foundry',
      'Python PyO3',
      'Low-Latency Systems',
    ],
    authors: [{ name: fullName, url: SITE_URL }],
    creator: fullName,
    publisher: fullName,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      title: `${fullName} (@${cleanHandle}) — Rust Systems & MEV Infrastructure Engineer`,
      description: tagline,
      siteName: `${fullName} Portfolio`,
      images: [
        {
          url: '/images/og-card.png',
          width: 1200,
          height: 630,
          alt: `${fullName} — Rust Systems & MEV Infrastructure Engineer`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} (@${cleanHandle}) — Rust Systems & MEV Infrastructure Engineer`,
      description: tagline,
      creator: handle,
      images: ['/images/og-card.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteData()
  const fullName = `${site.hero.firstName} ${site.hero.lastName}`.trim() || 'Christley Olubela'
  const githubUrl = site.contact.github || 'https://github.com/Xtley001'
  const logoText = site.hero.handle?.replace('@', '') || fullName || 'XTLEY001'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    alternateName: ['Xtley001', '@Xtley001'],
    url: SITE_URL,
    image: `${SITE_URL}/images/og-card.png`,
    jobTitle: 'Rust Systems & MEV Infrastructure Engineer',
    knowsAbout: [
      'Rust Systems Programming',
      'Low-Latency EVM & REVM Simulation',
      'Alloy & Reth',
      'MEV Extraction & Block Building',
      'AMM Curve Mathematics',
      'Protocol Liquidations',
      'Write-Ahead Logs (WAL)',
      'Python Native Extensions (PyO3)',
      'Solidity & Foundry',
    ],
    sameAs: [
      githubUrl,
      site.contact.twitter,
      site.contact.linkedin,
      'https://crates.io/users/Xtley001',
      'https://pypi.org/user/Xtley001',
    ].filter(Boolean),
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Cursor />
        <Nav githubUrl={githubUrl} logoText={logoText} />
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}
