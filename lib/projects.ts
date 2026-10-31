import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Project {
  slug: string
  name: string
  tagline: string
  year: number
  status: 'active' | 'completed' | 'archived' | 'stealth'
  tech: string[]
  github: string
  live: string
  image: string
  featured: boolean
  content: string
  ranking?: number
  category?: string
  stats?: string
  docs?: string
  cratesIo?: string
  pypi?: string
  book?: string

  // Compatibility helpers
  id?: string
  title?: string
  description?: string
  techStack?: string[]
  githubUrl?: string
  cratesUrl?: string
  pypiUrl?: string
}

const projectsDir = path.join(process.cwd(), 'content', 'projects')

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDir)) return []
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(projectsDir, file), 'utf8')
      const { data, content } = matter(raw)
      const rankNum = data.ranking !== undefined ? Number(data.ranking) : undefined
      const id = rankNum !== undefined ? rankNum.toString().padStart(2, '0') : undefined

      return {
        slug: data.slug || file.replace('.mdx', ''),
        name: data.name || '',
        tagline: data.tagline || '',
        year: data.year || 2026,
        status: data.status || 'active',
        tech: data.tech || [],
        github: data.github || '',
        live: data.live || '',
        image: data.image || '',
        featured: data.featured ?? false,
        content,
        ranking: rankNum,
        category: data.category || 'Systems & Infrastructure',
        stats: data.stats || '',
        docs: data.docs || '',
        cratesIo: data.cratesIo || '',
        pypi: data.pypi || '',
        book: data.book || '',

        // Compatibility aliases
        id,
        title: data.name || '',
        description: data.tagline || '',
        techStack: data.tech || [],
        githubUrl: data.github || '',
        cratesUrl: data.cratesIo || '',
        pypiUrl: data.pypi || '',
      } as Project
    })
    .sort((a, b) => {
      if (a.ranking !== undefined && b.ranking !== undefined) {
        return a.ranking - b.ranking
      }
      if (a.ranking !== undefined) return -1
      if (b.ranking !== undefined) return 1
      return b.year - a.year
    })
}

export function getProjectBySlug(slug: string): Project | null {
  const all = getAllProjects()
  const found = all.find(p => p.slug === slug || p.id === slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  if (found) return found

  const filePath = path.join(projectsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const rankNum = data.ranking !== undefined ? Number(data.ranking) : undefined
  const id = rankNum !== undefined ? rankNum.toString().padStart(2, '0') : undefined

  return {
    slug,
    name: data.name || '',
    tagline: data.tagline || '',
    year: data.year || 2026,
    status: data.status || 'active',
    tech: data.tech || [],
    github: data.github || '',
    live: data.live || '',
    image: data.image || '',
    featured: data.featured ?? false,
    content,
    ranking: rankNum,
    category: data.category || 'Systems & Infrastructure',
    stats: data.stats || '',
    docs: data.docs || '',
    cratesIo: data.cratesIo || '',
    pypi: data.pypi || '',
    book: data.book || '',

    id,
    title: data.name || '',
    description: data.tagline || '',
    techStack: data.tech || [],
    githubUrl: data.github || '',
    cratesUrl: data.cratesIo || '',
    pypiUrl: data.pypi || '',
  }
}
