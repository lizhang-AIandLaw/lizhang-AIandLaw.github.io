import { createContext, useContext, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaEnvelope, FaMapMarkerAlt, FaSun, FaMoon, FaDesktop } from 'react-icons/fa'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { navItems } from '@/site.config'
import { useSlot } from '../context'
import { DEFAULT_SECTIONS } from '../slots'
import type { HeroSlotProps } from '../slots'
import type { LayoutProps } from '../types'
import DynamicIcon from '@/components/DynamicIcon'
import { assetUrl } from './utils'
import './academic.css'

type Appearance = 'light' | 'dark' | 'system'
const AppearanceContext = createContext<{ appearance: Appearance; setAppearance: (value: Appearance) => void }>({ appearance: 'light', setAppearance: () => {} })

export function Profile({ avatar }: HeroSlotProps) {
  const { siteConfig, experience, experienceTimeline } = useLocalizedData()
  const education = experience.education.courses[0]
  const currentResearch = experienceTimeline.find(item => item.isCurrent && item.category === 'research')
  const address = siteConfig.contact.address || siteConfig.contact.location
  const addressBreak = siteConfig.contact.address ? address.indexOf(',') : -1
  return (
    <div className="academic-profile">
      <img className="academic-avatar" src={assetUrl(avatar.startsWith('/') || /^https?:/.test(avatar) ? avatar : `images/${avatar}`)} alt={siteConfig.name.display} width="168" height="168" />
      <h1>{siteConfig.name.display}</h1>
      {education && <div className="academic-affiliation">
        <p>{currentResearch?.title ?? education.course}</p>
        <p className="academic-institution">{education.institution}</p>
      </div>}
      <div className="academic-profile-links">
        {address && <span className="academic-profile-address"><FaMapMarkerAlt aria-hidden="true" /><span className="academic-address-text">{addressBreak >= 0 ? <>{address.slice(0, addressBreak)}<br />{address.slice(addressBreak + 1).trim()}</> : address}</span></span>}
        {siteConfig.contact.email && <a href={`mailto:${siteConfig.contact.email}`}><FaEnvelope aria-hidden="true" />{siteConfig.contact.email}</a>}
        {siteConfig.heroSocialIcons.map(item => {
          const href = (siteConfig.social as Record<string, string>)[item.platform]
          return href ? <a key={item.platform} href={assetUrl(href)} target="_blank" rel="noreferrer">
            <DynamicIcon name={item.icon} boxSize="15px" aria-hidden="true" />{item.label}
          </a> : null
        })}
      </div>
      {siteConfig.social.cv && <a className="academic-cv" href={assetUrl(siteConfig.social.cv)} target="_blank" rel="noreferrer">Curriculum vitae <span aria-hidden="true">↗</span></a>}
    </div>
  )
}

export function Navigation() {
  const { t } = useTranslation()
  return <header className="academic-header">
    <nav aria-label={t('nav.navigation')}>
      {navItems.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'}>{t(item.labelKey)}</NavLink>)}
    </nav>
    <AppearanceSwitch />
  </header>
}

function AppearanceSwitch() {
  const { t } = useTranslation()
  const { appearance, setAppearance } = useContext(AppearanceContext)
  return <div className="academic-appearance" role="group" aria-label={t('academic.appearance')}>
    {([{ mode: 'light', Icon: FaSun }, { mode: 'dark', Icon: FaMoon }, { mode: 'system', Icon: FaDesktop }] as const).map(({ mode, Icon }) =>
      <button key={mode} type="button" aria-label={t(`academic.${mode}Mode`)} title={t(`academic.${mode}Mode`)} aria-pressed={appearance === mode} onClick={() => setAppearance(mode)}><Icon aria-hidden="true" /></button>)}
  </div>
}

export function Footer() {
  const { siteConfig } = useLocalizedData()
  return <footer className="academic-footer"><span>© {new Date().getFullYear()} {siteConfig.name.display}</span></footer>
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const { i18n, t } = useTranslation()
  const { siteConfig, research, experience, institutionLogos } = useLocalizedData()
  const Navbar = useSlot('navbar')
  const Hero = useSlot('hero')
  const PageFooter = useSlot('footer')
  const sections: readonly string[] = siteConfig.sections ?? DEFAULT_SECTIONS
  const showProfile = sections.includes('hero')
  useEffect(() => { void i18n.changeLanguage('en') }, [i18n])
  const [appearance, setAppearance] = useState<Appearance>(() => {
    try {
      const saved = localStorage.getItem('academic-appearance')
      return saved === 'dark' || saved === 'system' ? saved : 'light'
    } catch { return 'light' }
  })
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    try { localStorage.setItem('academic-appearance', appearance) } catch { /* Preference storage is optional. */ }
  }, [appearance])

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => {
    document.documentElement.lang = i18n.language
    const label = navItems.find(item => item.path === pathname)
    document.title = `${siteConfig.name.display} · ${label ? t(label.labelKey) : t('nav.home')}`
  }, [pathname, i18n.language, siteConfig.name.display, t])

  return <AppearanceContext.Provider value={{ appearance, setAppearance }}><div className="academic-site" data-appearance={appearance === 'system' ? (systemDark ? 'dark' : 'light') : appearance}>
    <a className="academic-skip" href="#main-content">{t('academic.skipToContent')}</a>
    <div className="academic-shell">
      <Navbar />
      <div className={`academic-columns${showProfile ? '' : ' academic-no-profile'}`}>
        {showProfile && <aside className="academic-sidebar" aria-label={siteConfig.name.display}>
          <Hero title={siteConfig.title} avatar={siteConfig.avatar} research={research.currentResearch}
            researchLogos={institutionLogos} education={experience.education.courses} educationLogos={institutionLogos} />
        </aside>}
        <main id="main-content" tabIndex={-1}><div className="academic-page" key={pathname}>{children}</div></main>
      </div>
      {sections.includes('footer') && <PageFooter />}
    </div>
  </div></AppearanceContext.Provider>
}
