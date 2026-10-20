import { extendTheme } from '@chakra-ui/react'
import type { TemplateConfig } from '../types'
import Layout, { Navigation, Profile, Footer } from './Layout'
import { Home, Experience, Projects, Articles } from './Pages'
import Publications, { SelectedPublications } from './Publications'
import { Bio, News, Journey, Skills, Awards, Service, Contact, Mentorship, Talks, Teaching } from './Sections'
import GuideLanding from '@/components/GuideLanding'
import GuideDocs from '@/components/GuideDocs'

const academicTemplate: TemplateConfig = {
  id: 'academic',
  name: 'Academic Light',
  description: 'A spacious two-column academic homepage with compact bibliography entries',
  theme: extendTheme({
    config: { initialColorMode: 'light', useSystemColorMode: false },
    fonts: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    styles: { global: { body: { bg: '#ffffff', color: '#30343b' } } },
  }),
  layout: Layout,
  pages: { home: Home, publications: Publications, experience: Experience, projects: Projects, articles: Articles, guide: GuideLanding, guideDocs: GuideDocs },
  slots: {
    navbar: Navigation, hero: Profile, footer: Footer, newsDisplay: News,
    bio: Bio, selectedPublications: SelectedPublications, journey: Journey,
    skills: Skills, accomplishments: Awards, service: Service, contact: Contact,
    mentorship: Mentorship, talks: Talks, teaching: Teaching,
  },
}

export default academicTemplate
