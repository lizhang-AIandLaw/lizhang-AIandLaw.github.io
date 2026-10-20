import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import type { Publication } from '@/types'
import { assetUrl, shortVenue } from './utils'
import { Section } from './Sections'

export function PublicationEntry({ publication: pub }: { publication: Publication }) {
  const { t } = useTranslation()
  const { siteConfig } = useLocalizedData()
  const [expanded, setExpanded] = useState(false)
  const [allAuthors, setAllAuthors] = useState(false)
  const isOwner = (author: string) => siteConfig.name.authorVariants.includes(author.replace(/[*†‡]/g, '').trim())
  const manyAuthors = pub.authors.length > 8
  const visibleIndices = pub.authors.map((_, index) => index).filter(index =>
    allAuthors || !manyAuthors || index < 3 || isOwner(pub.authors[index]) || index === pub.authors.length - 1)
  const links: { key: keyof Publication['links']; label: string }[] = [
    { key: 'paper', label: t('about.paper') }, { key: 'arxiv', label: 'arXiv' },
    { key: 'code', label: t('about.code') }, { key: 'dataset', label: t('about.dataset') },
    { key: 'projectPage', label: t('about.project') }, { key: 'demo', label: t('about.demo') },
  ]
  const venueLabel = shortVenue(pub.venue)
  const mainLink = pub.links.paper || pub.links.arxiv || pub.links.projectPage
  return <article className="academic-paper">
    <div className="academic-paper-label">
      <span className="academic-venue-tag">{venueLabel}</span>
      <span className="academic-paper-year">{pub.year}</span>
      {pub.featuredImage && <a href={assetUrl(pub.featuredImage)} target="_blank" rel="noreferrer">
        <img src={assetUrl(pub.featuredImage)} alt={pub.title} loading="lazy" />
      </a>}
    </div>
    <div className="academic-paper-body">
      <h3>{mainLink ? <a href={assetUrl(mainLink)} target="_blank" rel="noreferrer">{pub.title}</a> : pub.title}</h3>
      <p className="academic-authors" id={`authors-${pub.id}`}>
        {visibleIndices.map((index, position) => <span key={index}>
          {position > 0 && (index > visibleIndices[position - 1] + 1 ? ', …, ' : ', ')}
          {isOwner(pub.authors[index]) ? <strong>{pub.authors[index]}</strong> : pub.authors[index]}
        </span>)}
        {manyAuthors && <> <button className="academic-inline-button" onClick={() => setAllAuthors(!allAuthors)}
          aria-expanded={allAuthors} aria-controls={`authors-${pub.id}`}>
          {allAuthors ? t('academic.fewerAuthors') : t('academic.allAuthors', { count: pub.authors.length })}
        </button></>}
      </p>
      <p className="academic-paper-venue"><em>{pub.venue}{String(pub.venue).includes(String(pub.year)) ? '' : `, ${pub.year}`}</em>
        {pub.status === 'accepted' && <span> · {t('academic.accepted')}</span>}
        {pub.status === 'preprint' && <span> · {t('academic.preprint')}</span>}
      </p>
      {Boolean(pub.specialBadges?.length || pub.isCoFirst) && <p className="academic-paper-honors">
        {pub.specialBadges?.map(badge => <span key={badge}>{badge}</span>)}
        {pub.isCoFirst && <span>{t('about.equalContribution')}</span>}
      </p>}
      <div className="academic-paper-actions">
        {pub.abstract && <button aria-expanded={expanded} aria-controls={`abstract-${pub.id}`} onClick={() => setExpanded(!expanded)}>{t('about.abstract')}</button>}
        {links.map(({ key, label }) => pub.links[key] && <a key={key} href={assetUrl(pub.links[key]!)} target="_blank" rel="noreferrer">{label}</a>)}
      </div>
      {pub.abstract && <div className="academic-abstract" id={`abstract-${pub.id}`} hidden={!expanded}>
        <p>{pub.abstract}</p>
        {pub.keywords?.length ? <p className="academic-keywords">{pub.keywords.join(' · ')}</p> : null}
      </div>}
    </div>
  </article>
}

export function SelectedPublications() {
  const { t } = useTranslation()
  const { publications, siteConfig } = useLocalizedData()
  const selected = siteConfig.selectedPublicationIds.flatMap(id => {
    const pub = publications.find(item => item.id === id)
    return pub ? [pub] : []
  })
  if (!siteConfig.features.publications || !selected.length) return null
  return <Section id="selected-publications" title={t('about.selectedPublications')} action={<Link to="/publications">{t('academic.viewAll')} <span aria-hidden="true">↗</span></Link>}>
    <div className="academic-papers">{selected.map(pub => <PublicationEntry key={pub.id} publication={pub} />)}</div>
  </Section>
}

export default function Publications() {
  const { t } = useTranslation()
  const { publications, siteConfig } = useLocalizedData()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const year = params.get('year') ?? 'all'
  const category = params.get('show') ?? 'all'
  const venue = params.get('venue') ?? 'all'
  const topic = params.get('topic') ?? 'all'
  const [filtersOpen, setFiltersOpen] = useState(venue !== 'all' || topic !== 'all')
  const updateFilter = (key: string, value: string) => setParams(previous => {
    const next = new URLSearchParams(previous)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    return next
  }, { replace: true })
  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a)
  const venues = [...new Set(publications.map(pub => shortVenue(pub.venue)))].sort()
  const topics = [...new Set(publications.flatMap(pub => pub.keywords ?? []))].sort()
  const categories = [
    { id: 'all', label: t('academic.allPapers'), match: () => true },
    { id: 'selected', label: t('academic.representative'), match: (pub: Publication) => siteConfig.selectedPublicationIds.includes(pub.id) },
    { id: 'first', label: t('academic.firstAuthor'), match: (pub: Publication) => Boolean(pub.isFirstAuthor || pub.isCoFirst) },
    { id: 'awards', label: t('academic.awardPapers'), match: (pub: Publication) => Boolean(pub.specialBadges?.some(badge => /\b(best|award|prize)\b/i.test(badge))) },
  ]
  const categoryFilter = categories.find(item => item.id === category) ?? categories[0]
  const active = Boolean(query || year !== 'all' || category !== 'all' || venue !== 'all' || topic !== 'all')
  const filtered = publications.filter(pub =>
    (year === 'all' || pub.year === Number(year)) &&
    categoryFilter.match(pub) &&
    (venue === 'all' || shortVenue(pub.venue) === venue) &&
    (topic === 'all' || pub.keywords?.includes(topic)) &&
    `${pub.title} ${pub.authors.join(' ')} ${pub.venue} ${pub.keywords?.join(' ') ?? ''}`.toLowerCase().includes(query.toLowerCase().trim())
  ).sort((a, b) => b.year - a.year || (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || a.title.localeCompare(b.title))
  return <>
    <div className="academic-page-heading"><h2>{t('nav.publications')}</h2><p>{t('academic.publicationCount', { count: publications.length })}</p></div>
    <div className="academic-filter-tabs" role="group" aria-label={t('academic.filterBy')}>
      {categories.map(item => <button key={item.id} aria-pressed={categoryFilter.id === item.id} onClick={() => updateFilter('show', item.id)}>
        {item.label}<span>{publications.filter(item.match).length}</span>
      </button>)}
    </div>
    <div className="academic-filters">
      <label><span>{t('academic.search')}</span><input type="search" value={query} onChange={event => updateFilter('q', event.target.value)} placeholder={t('academic.searchPlaceholder')} /></label>
      <label><span>{t('academic.year')}</span><select value={year} onChange={event => updateFilter('year', event.target.value)}>
        <option value="all">{t('academic.allYears')}</option>{years.map(item => <option key={item}>{item}</option>)}
      </select></label>
    </div>
    <button className="academic-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="publication-filters">
      {t('academic.moreFilters')}{venue !== 'all' || topic !== 'all' ? ' •' : ''} <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
    </button>
    <div className="academic-filter-panel" id="publication-filters" hidden={!filtersOpen}>
      <div role="group" aria-label={t('academic.venue')}><h3>{t('academic.venue')}</h3><div className="academic-filter-chips">
        <button aria-pressed={venue === 'all'} onClick={() => updateFilter('venue', 'all')}>{t('academic.allVenues')}</button>
        {venues.map(item => <button key={item} aria-pressed={venue === item} onClick={() => updateFilter('venue', item)}>{item}</button>)}
      </div></div>
      <label className="academic-topic"><span>{t('academic.topic')}</span><select value={topic} onChange={event => updateFilter('topic', event.target.value)}>
        <option value="all">{t('academic.allTopics')}</option>{topics.map(item => <option key={item}>{item}</option>)}
      </select></label>
    </div>
    <div className="academic-results"><p className="academic-result-count" role="status">{t('academic.results', { count: filtered.length })}</p>
      {active && <button className="academic-inline-button" onClick={() => setParams({}, { replace: true })}>{t('academic.clearFilters')}</button>}
    </div>
    {years.filter(item => filtered.some(pub => pub.year === item)).map(item => <Section key={item} id={`year-${item}`} title={String(item)}>
      <div className="academic-papers">{filtered.filter(pub => pub.year === item).map(pub => <PublicationEntry key={pub.id} publication={pub} />)}</div>
    </Section>)}
    {!filtered.length && <p className="academic-empty">{t('academic.noPublications')}</p>}
  </>
}
