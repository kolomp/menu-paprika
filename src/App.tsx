import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import {
  badgeDescriptions,
  badgeLabels,
  links,
  localeLabels,
  localeNames,
  localeTags,
  resolveItemDetails,
  resolveItemName,
  resolveLocalizedText,
  resolvePrice,
  resolveLocale,
  supportedLocales,
  sections,
  uiCopy,
  type BadgeId,
  type Locale,
} from './content.ts'
import './App.css'

const storageKey = 'paprikaMenuLocaleV1'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.9"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.9"
      />
    </svg>
  )
}

function ChiliIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.7 4.2c.6 1.7.2 3-.9 4 .7-.2 1.5-.1 2.2.3 1.8 1.1 2.2 3.8.9 6.1-1.7 3-5.4 4.3-8.3 2.9-2.8-1.4-3.7-4.6-2-7.2 1-1.5 2.5-2.4 4.1-2.5-.7-1.2-.7-2.6-.1-4 1.5 1.4 3 1.7 4.1.4Z"
        fill="currentColor"
      />
      <path
        d="M15.8 4.8c-.7.5-1.6.8-2.6.7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19.5 4.5c-5.8 0-10.6 2.7-12.8 7.4-1.2 2.6-.8 5.4.9 7.6 2.3-1 4.3-2.8 5.6-5.2 1.4-2.5 2.1-5.3 2.4-7.5 1.4 1.7 1.9 4 1.3 6.2-.6 2.3-2.2 4.4-4.4 5.9 3.6.3 6.4-1.3 7.7-4.2 1.6-3.5.4-7.8-1.7-10.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function BadgeIcon({ badgeId }: { badgeId: BadgeId }) {
  if (badgeId === 'spicy') {
    return <ChiliIcon />
  }

  return <LeafIcon />
}

function BadgePill({
  badgeId,
  locale,
}: {
  badgeId: BadgeId
  locale: Locale
}) {
  return (
    <span className={`menu-item__badge menu-item__badge--${badgeId}`}>
      <BadgeIcon badgeId={badgeId} />
      <span>{resolveLocalizedText(badgeLabels[badgeId], locale)}</span>
    </span>
  )
}

function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null

  const stored = window.localStorage.getItem(storageKey)

  return supportedLocales.find((locale) => locale === stored) ?? null
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = readStoredLocale()

    if (stored) return stored

    if (typeof navigator === 'undefined') return 'en'

    return resolveLocale(navigator.languages)
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(
    sections.find((section) => section.id !== 'bar')?.id ?? sections[0].id,
  )

  const deferredLocale = useDeferredValue(locale)
  const copy = uiCopy[deferredLocale]
  const foodSections = sections.filter((section) => section.id !== 'bar')

  useEffect(() => {
    document.documentElement.lang = localeTags[deferredLocale]
    document.title = copy.pageTitle

    const descriptionTag = document.querySelector('meta[name="description"]')
    descriptionTag?.setAttribute('content', copy.pageDescription)
  }, [copy.pageDescription, copy.pageTitle, deferredLocale])

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, locale)
    } catch {
      // Ignore private mode or storage access errors.
    }
  }, [locale])

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const sectionElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-menu-section="true"]'),
    )

    if (sectionElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visibleEntry?.target.id) {
          setActiveSectionId(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-22% 0px -54% 0px',
        threshold: [0.2, 0.4, 0.65],
      },
    )

    sectionElements.forEach((sectionElement) => observer.observe(sectionElement))

    return () => {
      observer.disconnect()
    }
  }, [])

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const switchLocale = (nextLocale: Locale) => {
    startTransition(() => {
      setLocale(nextLocale)
    })
    closeMenu()
  }

  return (
    <div className="menu-shell">
      <div className="menu-shell__orb menu-shell__orb--left" aria-hidden="true" />
      <div className="menu-shell__orb menu-shell__orb--right" aria-hidden="true" />

      {isMenuOpen ? (
        <button
          type="button"
          className="drawer-backdrop"
          aria-label={copy.closeMenu}
          onClick={closeMenu}
        />
      ) : null}

      {isMenuOpen ? (
        <aside
          id="menu-drawer"
          className="drawer"
          role="dialog"
          aria-modal="true"
          aria-label={copy.menuTitle}
        >
          <div className="drawer__header">
            <div className="drawer__title-wrap">
              <p className="drawer__eyebrow">{copy.qrBadge}</p>
              <h2>{copy.menuTitle}</h2>
            </div>

            <button
              type="button"
              className="icon-button"
              aria-label={copy.closeMenu}
              onClick={closeMenu}
            >
              <CloseIcon />
            </button>
          </div>

          <p className="drawer__note">{copy.originalNote}</p>

          <section className="drawer__group">
            <p className="drawer__label">{copy.languageLabel}</p>
            <div className="drawer__languages" role="group" aria-label={copy.languageLabel}>
              {supportedLocales.map((localeOption) => (
                <button
                  key={localeOption}
                  type="button"
                  className={
                    localeOption === deferredLocale
                      ? 'language-chip language-chip--active'
                      : 'language-chip'
                  }
                  aria-pressed={localeOption === deferredLocale}
                  aria-label={localeNames[localeOption]}
                  onClick={() => switchLocale(localeOption)}
                >
                  <strong>{localeLabels[localeOption]}</strong>
                  <span>{localeNames[localeOption]}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="drawer__group">
            <p className="drawer__label">{copy.actionsLabel}</p>
            <div className="drawer__links">
              <a className="quick-link" href={links.phone} onClick={closeMenu}>
                {copy.quickCall}
              </a>
              <a
                className="quick-link"
                href={links.directions}
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                {copy.quickDirections}
              </a>
              <a
                className="quick-link"
                href={links.website}
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                {copy.quickWebsite}
              </a>
            </div>
          </section>

          <nav className="drawer__sections" aria-label={copy.sectionsLabel}>
            <p className="drawer__label">{copy.sectionsLabel}</p>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="drawer__section-link" onClick={closeMenu}>
                {resolveLocalizedText(section.title, deferredLocale)}
              </a>
            ))}
          </nav>
        </aside>
      ) : null}

      <div className="menu-app">
        <header className="topbar">
          <a href="#bar" className="brandmark">
            paprika
          </a>

          <div className="topbar__actions">
            <span className="topbar__badge">{copy.qrBadge}</span>
            <span className="topbar__locale">{localeLabels[deferredLocale]}</span>
            <button
              type="button"
              className="icon-button"
              aria-label={copy.menuButton}
              aria-controls="menu-drawer"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </header>

        <section className="sticky-toolbar">
          <div className="sticky-toolbar__group">
            <p className="sticky-toolbar__label">{copy.languageLabel}</p>
            <div className="sticky-toolbar__languages" role="group" aria-label={copy.languageLabel}>
              {supportedLocales.map((localeOption) => (
                <button
                  key={localeOption}
                  type="button"
                  className={
                    localeOption === deferredLocale
                      ? 'language-chip language-chip--active'
                      : 'language-chip'
                  }
                  aria-pressed={localeOption === deferredLocale}
                  aria-label={localeNames[localeOption]}
                  onClick={() => switchLocale(localeOption)}
                >
                  <strong>{localeLabels[localeOption]}</strong>
                  <span>{localeNames[localeOption]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sticky-toolbar__group">
            <p className="sticky-toolbar__label">{copy.foodQuickMenuLabel}</p>
            <nav className="food-quick-nav" aria-label={copy.foodQuickMenuLabel}>
              {foodSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={
                    section.id === activeSectionId
                      ? 'food-quick-nav__link food-quick-nav__link--active'
                      : 'food-quick-nav__link'
                  }
                >
                  {resolveLocalizedText(section.title, deferredLocale)}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <main className="section-stack">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              data-menu-section="true"
              className="menu-section"
            >
              <div className="menu-section__header">
                <p className="menu-section__eyebrow">{copy.sectionsLabel}</p>
                <h2>{resolveLocalizedText(section.title, deferredLocale)}</h2>
              </div>

              <div className="subsection-grid">
                {section.subSections.map((subSection) => (
                  <div key={subSection.id} className="menu-block">
                    <div className="menu-block__header">
                      <h3>{resolveLocalizedText(subSection.title, deferredLocale)}</h3>
                    </div>

                    <div className="menu-items">
                      {subSection.items.map((menuItem) => {
                        const details = resolveItemDetails(menuItem.details, deferredLocale)

                        return (
                          <article key={menuItem.id} className="menu-item">
                            <div className="menu-item__row">
                              <div className="menu-item__copy">
                                <h4>{resolveItemName(menuItem.name, deferredLocale)}</h4>
                              </div>
                              <strong className="menu-item__price">{resolvePrice(menuItem.price, deferredLocale)}</strong>
                            </div>

                            {(menuItem.badge || details) && (
                              <div className="menu-item__meta">
                                {menuItem.badge ? (
                                  <div className="menu-item__badge-row">
                                    <BadgePill badgeId={menuItem.badge} locale={deferredLocale} />
                                    <p className="menu-item__badge-note">
                                      {resolveLocalizedText(badgeDescriptions[menuItem.badge], deferredLocale)}
                                    </p>
                                  </div>
                                ) : null}
                                {details ? <p className="menu-item__details">{details}</p> : null}
                              </div>
                            )}
                          </article>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="menu-footer">
          <p>{copy.allPricesNote}</p>
          <a href={links.website} target="_blank" rel="noreferrer">
            paprikacappadocia.com
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App
