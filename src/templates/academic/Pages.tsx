import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useSlot } from '../context'
import { DEFAULT_SECTIONS, type SlotName } from '../slots'
import { Section } from './Sections'
import { assetUrl } from './utils'

function HomeSection({ name }: { name: SlotName }) {
  const Component = useSlot(name)
  const { siteConfig, news } = useLocalizedData()
  return <Component title={siteConfig.title} avatar={siteConfig.avatar} news={news} />
}

export function Home() {
  const { siteConfig } = useLocalizedData()
  const sections = siteConfig.sections ?? DEFAULT_SECTIONS
  return <>{sections.filter(name => name !== 'hero' && name !== 'footer' && name !== 'navbar')
    .filter(name => DEFAULT_SECTIONS.includes(name as SlotName))
    .map(name => <HomeSection key={name} name={name as SlotName} />)}</>
}

export function Experience() {
  const { t, i18n } = useTranslation()
  const { experience, experienceTimeline } = useLocalizedData()
  const date = (value: string) => new Intl.DateTimeFormat(i18n.language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
  return <>
    <div className="academic-page-heading"><h2>{t('nav.experience')}</h2></div>
    <Section id="education" title={t('academic.education')}>
      <ul className="academic-records">{experience.education.courses.map(item => <li key={item.course}>
        <span className="academic-date">{item.year}</span><div><strong>{item.course}</strong><p>{item.institution}</p></div>
      </li>)}</ul>
    </Section>
    <Section id="positions" title={t('academic.positions')}>
      <div className="academic-positions">{[...experienceTimeline].sort((a, b) => b.start.localeCompare(a.start)).map((item, index) => <article key={index}>
        <p className="academic-date">{date(item.start)} — {item.end ? date(item.end) : t('experience.present')}</p>
        <h3>{item.title}</h3>
        <p className="academic-position-org">{item.companyUrl ? <a href={assetUrl(item.companyUrl)} target="_blank" rel="noreferrer">{item.company}</a> : item.company}{item.location ? ` · ${item.location}` : ''}</p>
        <p>{item.summary}</p>
        <ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
      </article>)}</div>
    </Section>
  </>
}

function Collection({ kind }: { kind: 'projects' | 'articles' }) {
  const { t } = useTranslation()
  const data = useLocalizedData()
  return <Section id={kind} title={t(`nav.${kind}`)}><div className="academic-positions">{data[kind].map(item => <article key={item.title}>
    {item.featuredImage && <img className="academic-collection-image" src={assetUrl(item.featuredImage)} alt={item.title} loading="lazy" />}
    <p className="academic-date">{item.date}</p>
    <h3>{item.link ? <a href={assetUrl(item.link)}>{item.title}</a> : item.title}</h3>
    <p>{item.summary}</p>
    {item.highlights?.length ? <ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul> : null}
    <p className="academic-keywords">{item.tags.join(' · ')}</p>
    <div className="academic-text-links">{item.extraLinks?.map(link => <a key={link.url} href={assetUrl(link.url)}>{link.label}</a>)}</div>
  </article>)}</div></Section>
}

export const Projects = () => <Collection kind="projects" />
export const Articles = () => <Collection kind="articles" />
