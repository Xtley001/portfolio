import type { Metadata } from 'next'
import '../styles/globals.css'
import Nav from '../components/Nav'
import Cursor from '../components/Cursor'
import ScrollToTop from '../components/ScrollToTop'
import { getSiteData } from '../lib/site'

const SITE_URL = 'https://christleyolubela.tech'

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteData()
  const fullName = `${site.hero.firstName} ${site.hero.lastName}`.trim() || 'Christley Olubela'
  const handle = site.hero.handle || '@Xtley001'
  const cleanHandle = handle.replace('@', '')
  const tagline = site.hero.tagline.replace(/\n/g, ' ')

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${fullName} (@${cleanHandle}) — Systems & DeFi Quant Engineer`,
      template: `%s | ${fullName}`,
    },
    description: tagline,
    keywords: [
      fullName,
      'Christley Olubela',
      'Xtley001',
      'Driftbrake',
      'optimal-sizing',
      'brain-libraries',
      'Rust Engineer',
      'DeFi Quant',
      'MEV Extraction',
      'REVM Simulation',
      'AMM Trade Sizing',
      'Hierarchical Risk Parity',
      'Algorithmic Trading',
      'Flash Loans',
      'WorldQuant BRAIN',
      'Market Microstructure',
    ],
    authors: [{ name: fullName, url: SITE_URL }],
    creator: fullName,
    publisher: fullName,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      title: `${fullName} (@${cleanHandle}) — Systems & DeFi Quant Engineer`,
      description: tagline,
      siteName: `${fullName} Portfolio`,
      images: [
        {
          url: '/images/avatar.png',
          width: 800,
          height: 800,
          alt: `${fullName} — Profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} (@${cleanHandle}) — Systems & DeFi Quant Engineer`,
      description: tagline,
      creator: handle,
      images: ['/images/avatar.png'],
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
    image: `${SITE_URL}/images/avatar.png`,
    jobTitle: 'Systems & DeFi Quant Engineer',
    knowsAbout: [
      'Rust',
      'Python',
      'EVM & REVM Simulation',
      'MEV Extraction',
      'AMM Curve Math',
      'Algorithmic Trading',
      'Hierarchical Risk Parity',
      'Market Microstructure',
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
