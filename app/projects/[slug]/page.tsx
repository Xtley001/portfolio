import type { Metadata } from 'next'
import { getAllProjects, getProjectBySlug } from '../../../lib/projects'
import MarkdownContent from '../../../components/MarkdownContent'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const SITE_URL = 'https://christleyolubela.tech'

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params)
  const project = getProjectBySlug(slug)
  if (!project) return {}

  const url = `${SITE_URL}/projects/${slug}`
  const title = `${project.name} — ${project.tagline}`

  return {
    title: project.name,
    description: project.tagline,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url,
      title,
      description: project.tagline,
      siteName: 'Christley Olubela Portfolio',
      images: [
        {
          url: '/images/avatar.png',
          width: 800,
          height: 800,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.tagline,
      creator: '@Xtley001',
      images: ['/images/avatar.png'],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const { slug } = await Promise.resolve(params)
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.name,
    description: project.tagline,
    url: `${SITE_URL}/projects/${project.slug}`,
    codeRepository: project.github || undefined,
    programmingLanguage: project.tech,
    author: {
      '@type': 'Person',
      name: 'Christley Olubela',
      url: SITE_URL,
    },
  }

  return (
    <main style={{ padding: '120px 24px 80px', maxWidth: '800px', margin: '0 auto' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/#projects"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '11px',
          color: 'var(--text-dim)',
          letterSpacing: '0.1em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '60px',
          transition: 'color 0.15s',
        }}
      >
        ← back
      </Link>

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {project.ranking !== undefined && (
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em' }}>
            #{project.ranking.toString().padStart(2, '0')}
          </span>
        )}
        {project.category && (
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '2px' }}>
            {project.category}
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.15em' }}>
          {project.year}
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1, marginBottom: '20px', textTransform: 'uppercase' }}>
        {project.name}
      </h1>

      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '32px' }}>
        {project.tagline}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', border: '1px solid var(--accent-dim)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            github ↗
          </a>
        )}
        {project.cratesIo && (
          <a
            href={project.cratesIo}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            crates.io ↗
          </a>
        )}
        {project.pypi && (
          <a
            href={project.pypi}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', border: '1px solid var(--accent-dim)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            pypi ↗
          </a>
        )}
        {project.docs && (
          <a
            href={project.docs}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            docs.rs ↗
          </a>
        )}
        {project.book && (
          <a
            href={project.book}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            book ↗
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '11px', color: 'var(--accent)', border: '1px solid var(--accent-dim)', padding: '6px 16px', letterSpacing: '0.08em', transition: 'all 0.2s' }}
          >
            {project.live.toLowerCase().endsWith('.pdf') ? 'tearsheet ↗' : 'live demo ↗'}
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

      <div className="mdx-content">
        <MarkdownContent content={project.content} />
      </div>
    </main>
  )
}
