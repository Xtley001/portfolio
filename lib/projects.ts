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
}

const projectsDir = path.join(process.cwd(), 'content', 'projects')

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDir)) return []
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(projectsDir, file), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: data.slug || file.replace('.mdx', ''),
        name: data.name || '',
        tagline: data.tagline || '',
        year: data.year || 2024,
        status: data.status || 'active',
        tech: data.tech || [],
        github: data.github || '',
        live: data.live || '',
        image: data.image || '',
        featured: data.featured ?? false,
        content,
      } as Project
    })
    .sort((a, b) => b.year - a.year)
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(projectsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    name: data.name || '',
    tagline: data.tagline || '',
    year: data.year || 2024,
    status: data.status || 'active',
    tech: data.tech || [],
    github: data.github || '',
    live: data.live || '',
    image: data.image || '',
    featured: data.featured ?? false,
    content,
  }
}
