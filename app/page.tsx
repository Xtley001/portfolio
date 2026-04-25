import { getSiteData } from '../lib/site'
import { getAllProjects } from '../lib/projects'
import Hero from '../components/Hero'
import Focus from '../components/Focus'
import Projects from '../components/Projects'
import Stack from '../components/Stack'
import Timeline from '../components/Timeline'
import Persona from '../components/Persona'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const site = getSiteData()
  const projects = getAllProjects()

  const year = new Date().getFullYear()
  const logoText = site.hero.handle?.replace('@', '') || `${site.hero.firstName}${site.hero.lastName}`.trim() || 'XTLEY001'
  const domain = site.contact.email ? site.contact.email.split('@')[1] : 'xtley001.com'

  return (
    <main style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
      <Hero hero={site.hero} />
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
