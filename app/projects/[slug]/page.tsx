import { getAllProjects, getProjectBySlug } from '../../../lib/projects'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const statusColor: Record<string, string> = {
    active: '#c8b89a', completed: '#666', archived: '#444', stealth: '#555',
  }

  return (
    <main style={{ padding: '120px 24px 80px', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/#projects"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '60px', transition: 'color 0.15s' }}
      >
        ← back
      </Link>

      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.15em' }}>
          {project.year}
        </span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: statusColor[project.status] || '#666' }}>
          {project.status}
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1, marginBottom: '16px', textTransform: 'uppercase' }}>
        {project.name}
      </h1>

      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '32px' }}>
        {project.tagline}
      </p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', border: '1px solid var(--accent-dim)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            github ↗
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            live ↗
          </a>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px' }}>
        {project.tech.map((t: string) => (
          <span key={t} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '2px', letterSpacing: '0.08em' }}>
            {t}
          </span>
        ))}
      </div>

      <hr style={{ marginBottom: '48px' }} />

      {/* MDX content with full formatting support */}
      <div className="mdx-content">
        <MDXRemote source={project.content} />
      </div>
    </main>
  )
}
