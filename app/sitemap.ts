import { MetadataRoute } from 'next'
import { getAllProjects } from '../lib/projects'

const BASE_URL = 'https://olubelachristley.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects()
  const now = new Date()

  const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p.featured ? 0.9 : 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/resume`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...projectRoutes,
  ]
}
