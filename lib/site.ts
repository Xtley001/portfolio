import fs from 'fs'
import path from 'path'

export interface SiteData {
  hero: {
    firstName: string
    lastName: string
    tagline: string
    available: boolean
    location: string
    handle: string
    avatar: string
  }
  stack: { category: string; items: string[] }[]
  stats: { value: string; label: string }[]
  focus: { area: string; subs: string[] }[]
  experience: { year: string; role: string; org: string; note: string }[]
  education: { year: string; role: string; org: string; note: string }[]
  persona: {
    mind: { body: string; interests: string[] }
    research: string[]
    outside: { label: string; note: string }[]
  }
  timeline: { year: string; event: string }[]
  contact: {
    email: string
    twitter: string
    github: string
    telegram: string
    linkedin?: string
    goodreads?: string
    note: string
  }
}

const siteFile = path.join(process.cwd(), 'content', 'site.json')

export function getSiteData(): SiteData {
  if (!fs.existsSync(siteFile)) return getDefaultSiteData()
  try {
    return JSON.parse(fs.readFileSync(siteFile, 'utf8')) as SiteData
  } catch {
    return getDefaultSiteData()
  }
}

function getDefaultSiteData(): SiteData {
  return {
    hero: {
      firstName: 'CHRISTLEY',
      lastName: 'OLUBELA',
      tagline: 'I build systems that exploit microstructural\ninefficiencies in DeFi markets.',
      available: true,
      location: 'Nigeria',
      handle: '@Xtley001',
      avatar: '/images/avatar.png',
    },
    stack: [],
    stats: [],
    focus: [],
    experience: [],
    education: [],
    persona: {
      mind: { body: '', interests: [] },
      research: [],
      outside: [],
    },
    timeline: [],
    contact: {
      email: '',
      twitter: '',
      github: 'https://github.com/Xtley001',
      telegram: '',
      note: '',
    },
  }
}
