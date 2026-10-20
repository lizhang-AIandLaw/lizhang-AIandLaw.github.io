import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import service from '@content/service.json'
import type { NewsDisplaySlotProps } from '../slots'
import { assetUrl, periodStart } from './utils'

export function Section({ id, title, action, children }: { id: string; title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="academic-section" id={id} aria-labelledby={`${id}-heading`}>
    <div className="academic-section-heading"><h2 id={`${id}-heading`}>{title}</h2>{action}</div>
    {children}
  </section>
}

function BoldText({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}</>
}

export function Bio() {
  const { t } = useTranslation()
  const { about } = useLocalizedData()
  if (!about.journey) return null
  return <Section id="about" title={t('academic.about')}>
    {/* This HTML is generated at build time from the owner's existing Markdown. */}
    {about.journeyHtml ? <div className="academic-prose" dangerouslySetInnerHTML={{ __html: about.journeyHtml }} />
      : <div className="academic-prose"><p>{about.journey}</p></div>}
  </Section>
}

export function News({ news }: NewsDisplaySlotProps) {
  const { t } = useTranslation()
  const { siteConfig } = useLocalizedData()
  const [showAll, setShowAll] = useState(false)
  const sorted = [...news].sort((a, b) => (b.sortDate ?? '').localeCompare(a.sortDate ?? ''))
  if (!siteConfig.features.news || !news.length) return null
  return <Section id="news" title={t('news.title')}>
    <div className="academic-news">
      {(showAll ? sorted : sorted.slice(0, 3)).map((item, index) => <div className="academic-news-row" key={`${item.title}-${index}`}>
        <span className="academic-date">{item.date}</span>
        <details>
          <summary>{item.title}</summary>
          <p>{item.description}</p>
          <div className="academic-text-links">{item.links.map(link => <a key={link.url} href={assetUrl(link.url)} target="_blank" rel="noreferrer">{link.text} ↗</a>)}</div>
        </details>
      </div>)}
    </div>
    {sorted.length > 3 && <button className="academic-more" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>
      {showAll ? t('academic.lessNews') : t('academic.moreNews', { count: sorted.length - 3 })} <span aria-hidden="true">{showAll ? '↑' : '↓'}</span>
    </button>}
  </Section>
}

export function Journey() {
  const { t } = useTranslation()
  const { about, siteConfig } = useLocalizedData()
  if (!about.journeyPhases?.length) return null
  const phases = [...about.journeyPhases].sort((a, b) => periodStart(b.period) - periodStart(a.period))
  return <Section id="journey" title={t('about.myJourney')} action={siteConfig.features.experience ? <Link to="/experience">{t('academic.viewAll')} ↗</Link> : undefined}>
    <div className="academic-entries">{phases.map((phase, index) => <details className="academic-entry" key={`${phase.title}-${index}`}>
      <summary><span className="academic-date">{phase.period}</span><span><strong>{phase.title}</strong><span className="academic-entry-org">{phase.org}</span></span></summary>
      <p><BoldText text={phase.description} /></p>
      {phase.tags?.length ? <p className="academic-keywords">{phase.tags.join(' · ')}</p> : null}
    </details>)}</div>
  </Section>
}

export function Skills() {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  if (!siteOwner.skills.length) return null
  return <Section id="skills" title={t('academic.skills')}><ul className="academic-skill-list">{siteOwner.skills.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul></Section>
}

export function Awards() {
  const { t } = useTranslation()
  const { awards } = useLocalizedData()
  if (!awards.length) return null
  return <Section id="awards" title={t('about.awardsAndHonors')}><ul className="academic-records">{awards.map((award, index) => <li key={index}>
    <span className="academic-date">{award.date}</span><div><strong>{award.link ? <a href={assetUrl(award.link)}>{award.title}</a> : award.title}</strong><span className="academic-entry-org">{award.org}</span></div>
  </li>)}</ul></Section>
}

export function Service() {
  const { t } = useTranslation()
  return <Section id="service" title={t('service.title')}><div className="academic-service">
    {[{ title: t('service.conferences'), venues: service.conferences }, { title: t('service.journals'), venues: service.journals }].map(group => <div key={group.title}>
      <h3>{group.title}</h3><ul>{group.venues.map(venue => <li key={venue}>{venue}</li>)}</ul>
    </div>)}
  </div></Section>
}

export function Contact() {
  const { t } = useTranslation()
  const { siteConfig } = useLocalizedData()
  return <Section id="contact" title={t('contact.title')}>
    <div className="academic-contact"><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email} ↗</a><span>{siteConfig.contact.address || siteConfig.contact.location}</span></div>
  </Section>
}

export function Mentorship() {
  const { about } = useLocalizedData()
  if (!about.mentorship?.mentees.length) return null
  return <Section id="mentorship" title={about.mentorship.heading}><p>{about.mentorship.description}</p><ul className="academic-simple-list">
    {about.mentorship.mentees.map(person => <li key={person.name}><a href={assetUrl(person.url)}>{person.name}</a> {person.note}</li>)}
  </ul></Section>
}

export function Talks() {
  const { t } = useTranslation()
  const { talks } = useLocalizedData()
  if (!talks.length) return null
  return <Section id="talks" title={t('academic.talks')}><ul className="academic-records">{talks.map((talk, index) => <li key={index}>
    <span className="academic-date">{talk.date}</span><div><strong>{talk.title}</strong><p>{talk.event}{talk.location ? ` · ${talk.location}` : ''}</p><p>{talk.description}</p>
      <div className="academic-text-links">
        {talk.slidesUrl && <a href={assetUrl(talk.slidesUrl)}>{t('academic.slides')}</a>}
        {talk.videoUrl && <a href={assetUrl(talk.videoUrl)}>{t('academic.video')}</a>}
        {talk.links?.map(link => <a key={link.url} href={assetUrl(link.url)}>{link.label}</a>)}
      </div>
    </div>
  </li>)}</ul></Section>
}

export function Teaching() {
  const { t } = useTranslation()
  const { teaching } = useLocalizedData()
  if (!teaching.length) return null
  return <Section id="teaching" title={t('academic.teaching')}><ul className="academic-records">{teaching.map((item, index) => <li key={index}>
    <span className="academic-date">{item.semester}</span><div><strong>{item.link ? <a href={assetUrl(item.link)}>{item.course}</a> : item.course}</strong><p>{item.institution} · {item.role}</p><p>{item.description}</p></div>
  </li>)}</ul></Section>
}
