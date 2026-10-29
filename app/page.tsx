import { getSiteData } from '../lib/site'
import { getAllProjects } from '../lib/projects'
import { getLiveDownloadStats } from '../lib/downloads'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Focus from '../components/Focus'
import Projects from '../components/Projects'
import Stack from '../components/Stack'
import Timeline from '../components/Timeline'
import Persona from '../components/Persona'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const site = getSiteData()
  const projects = getAllProjects()
  const downloadStats = await getLiveDownloadStats()

  const year = new Date().getFullYear()
  const logoText = site.hero.handle?.replace('@', '') || `${site.hero.firstName}${site.hero.lastName}`.trim() || 'XTLEY001'
  const domain = 'christleyolubela.tech'

  return (
    <main style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
      <Hero hero={site.hero} />
      {site.stats && site.stats.length > 0 && (
        <Stats
          stats={site.stats}
          initialLiveDownloads={{
            total: downloadStats.totalDownloads,
            crates: downloadStats.cratesDownloads,
            pypi: downloadStats.pypiDownloads,
          }}
        />
      )}
      <Focus focus={site.focus} mindBody={site.persona?.mind?.body} />
      {projects.length > 0 && <Projects projects={projects} />}
      {site.stack && site.stack.length > 0 && <Stack stack={site.stack} />}
      <Timeline experience={site.experience || []} education={site.education || []} timeline={site.timeline || []} />
      <Persona persona={site.persona} goodreads={undefined} />
      <Contact contact={site.contact} />
      <Footer copyright={`© ${year} ${logoText}`} domain={domain} />
    </main>
  )
}
