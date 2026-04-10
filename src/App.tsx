import type { CSSProperties, SVGProps } from 'react'
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  links,
  localeLabels,
  localeTags,
  locales,
  messages,
  resolveLocale,
  rewardPool,
  type Locale,
  type ReviewPlatformId,
  type RewardDefinition,
  type RewardId,
} from './content.ts'
import {
  getSpinTargetDegrees,
  pickWeightedSegment,
  wheelSegments,
} from './spin.ts'
import './App.css'

type StepId = 'welcome' | 'spin' | 'gift' | 'review' | 'claim'

type ClaimSnapshot = {
  createdAt: Date
  platform: ReviewPlatformId
  spinNumber: number
}

type RewardIconProps = {
  className?: string
}

const stepOrder: StepId[] = ['welcome', 'spin', 'gift', 'review', 'claim']

const rewardMap = rewardPool.reduce<Record<RewardId, RewardDefinition>>(
  (accumulator, reward) => {
    accumulator[reward.id] = reward
    return accumulator
  },
  {} as Record<RewardId, RewardDefinition>,
)

function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
      <path
        d="M3.5 12h17M12 3c2.2 2.4 3.4 5.6 3.4 9S14.2 18.6 12 21M12 3C9.8 5.4 8.6 8.6 8.6 12s1.2 6.6 3.4 9"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TeaIcon({ className }: RewardIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 4.5c0 1-1 1.2-1 2.3 0 1 1 1.4 1 2.4M13 4.5c0 1-1 1.2-1 2.3 0 1 1 1.4 1 2.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10.5h8.8v5.7c0 2.4-1.9 4.3-4.3 4.3h-.2a4.3 4.3 0 0 1-4.3-4.3v-5.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M15.3 11.4h1.6a2.6 2.6 0 1 1 0 5.2h-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BaklavaIcon({ className }: RewardIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 3.5 20 12l-8 8.5L4 12 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 7.3 16.2 12 12 16.7 7.8 12 12 7.3ZM8.7 8.7l6.6 6.6M15.3 8.7l-6.6 6.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CoffeeIcon({ className }: RewardIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M7 5.2c0 1.1-.9 1.3-.9 2.4S7 9 7 10M10.2 5.2c0 1.1-.9 1.3-.9 2.4s.9 1.4.9 2.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.5 10.5h11v4.8a4.2 4.2 0 0 1-4.2 4.2H8.7a4.2 4.2 0 0 1-4.2-4.2v-4.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M15.5 11.3h1.6a2.4 2.4 0 1 1 0 4.8h-1.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M4 20.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function RewardIcon({
  rewardId,
  className,
}: {
  rewardId: RewardId
  className?: string
}) {
  if (rewardId === 'tea') return <TeaIcon className={className} />
  if (rewardId === 'baklava') return <BaklavaIcon className={className} />
  return <CoffeeIcon className={className} />
}

function App() {
  const [locale, setLocale] = useState<Locale>(() =>
    resolveLocale(typeof navigator === 'undefined' ? undefined : navigator.languages),
  )
  const [step, setStep] = useState<StepId>('welcome')
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [spinRotation, setSpinRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedRewardId, setSelectedRewardId] = useState<RewardId | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [claimSnapshot, setClaimSnapshot] = useState<ClaimSnapshot | null>(null)
  const [burstSeed, setBurstSeed] = useState(0)

  const deferredLocale = useDeferredValue(locale)
  const copy = messages[deferredLocale]
  const activeReward = selectedRewardId ? rewardMap[selectedRewardId] : null

  const spinTimeoutRef = useRef<number | null>(null)
  const storageKey = 'paprikaSpinRewardV1'

  const playSpinSound = () => {
    try {
      const AudioContextCtor =
        window.AudioContext || (window as typeof window & { webkitAudioContext?: AudioContext }).webkitAudioContext
      if (!AudioContextCtor) {
        const fallback = new Audio(
          'data:audio/wav;base64,UklGRoQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YVAAAAD//w8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8P'
        )
        fallback.play().catch(() => undefined)
        return
      }

      const audioContext = new AudioContextCtor()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(520, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.6)

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.65)

      oscillator.connect(gain).connect(audioContext.destination)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.7)
      oscillator.onended = () => {
        audioContext.close()
      }
    } catch {
      // Ignore audio errors or blocked autoplay.
      try {
        const fallback = new Audio(
          'data:audio/wav;base64,UklGRoQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YVAAAAD//w8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8P'
        )
        fallback.play().catch(() => undefined)
      } catch {
        // ignore
      }
    }
  }

  useEffect(() => {
    try {
      const storedRaw = window.localStorage.getItem(storageKey)

      if (!storedRaw) return

      const stored = JSON.parse(storedRaw) as {
        claimed?: boolean
        claimedAt?: string
        platform?: ReviewPlatformId
        rewardId?: RewardId
        spinNumber?: number
      }

      if (!stored.rewardId || !(stored.rewardId in rewardMap)) return

      setSelectedRewardId(stored.rewardId)
      setSpinCount(stored.spinNumber ?? 1)
      setHasSpun(true)

      if (stored.claimed && stored.platform) {
        setClaimSnapshot({
          createdAt: stored.claimedAt ? new Date(stored.claimedAt) : new Date(),
          platform: stored.platform,
          spinNumber: stored.spinNumber ?? 1,
        })
        setStep('claim')
      } else {
        setStep('gift')
      }
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = localeTags[deferredLocale]
    document.title = copy.pageTitle
  }, [copy.pageTitle, deferredLocale])

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current !== null) {
        window.clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [])

  const stepLabels = {
    claim: copy.stepClaim,
    gift: copy.stepGift,
    review: copy.stepReview,
    spin: copy.stepSpin,
    welcome: copy.stepWelcome,
  }

  const currentStepIndex = stepOrder.indexOf(step)

  const wheelBackground = `conic-gradient(${wheelSegments
    .map((segment, index) => {
      const start = index * 36
      const end = start + 36

      return `${rewardMap[segment].segmentColor} ${start}deg ${end}deg`
    })
    .join(', ')})`

  const setLocaleWithTransition = (nextLocale: Locale) => {
    startTransition(() => {
      setLocale(nextLocale)
      setIsLanguageOpen(false)
    })
  }

  const handleSpin = () => {
    if (isSpinning || hasSpun) return

    if (spinTimeoutRef.current !== null) {
      window.clearTimeout(spinTimeoutRef.current)
    }

    const selectedSegment = pickWeightedSegment()

    playSpinSound()
    setIsSpinning(true)
    setSelectedRewardId(null)
    setClaimSnapshot(null)
    setSpinRotation((currentRotation) => {
      const targetRotation = getSpinTargetDegrees(selectedSegment.index)
      const currentOffset = ((currentRotation % 360) + 360) % 360
      const delta = (targetRotation - currentOffset + 360) % 360

      return currentRotation + 2160 + delta
    })

    spinTimeoutRef.current = window.setTimeout(() => {
      setSelectedRewardId(selectedSegment.rewardId)
      setSpinCount((currentCount) => currentCount + 1)
      setBurstSeed((current) => current + 1)
      setHasSpun(true)
      setIsSpinning(false)
      setStep('gift')

      const payload = {
        rewardId: selectedSegment.rewardId,
        spinNumber: 1,
        claimed: false,
      }

      window.localStorage.setItem(storageKey, JSON.stringify(payload))
    }, 4200)
  }

  const handleDirectReview = (platform: ReviewPlatformId) => {
    setClaimSnapshot({
      createdAt: new Date(),
      platform,
      spinNumber: Math.max(1, spinCount),
    })
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        rewardId: selectedRewardId ?? 'tea',
        spinNumber: Math.max(1, spinCount),
        claimed: true,
        claimedAt: new Date().toISOString(),
        platform,
      }),
    )
    setStep('claim')
  }

  const claimTimestamp = claimSnapshot
    ? new Intl.DateTimeFormat(localeTags[deferredLocale], {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
      }).format(claimSnapshot.createdAt)
    : ''

  return (
    <main className="app-shell">
      <section className="wizard-card">
        <header className="wizard-header">
          <div className="header-top">
            <span className="brand-wordmark">paprika</span>

            <button
              type="button"
              className="language-trigger"
              aria-label={copy.changeLanguage}
              onClick={() => setIsLanguageOpen((current) => !current)}
            >
              <GlobeIcon className="globe-icon" />
              <span>{localeLabels[deferredLocale]}</span>
            </button>
          </div>

          {isLanguageOpen ? (
            <div className="language-sheet" role="dialog" aria-label={copy.changeLanguage}>
              {locales.map((availableLocale) => (
                <button
                  key={availableLocale}
                  type="button"
                  className={`language-option ${
                    availableLocale === deferredLocale ? 'language-option--active' : ''
                  }`}
                  onClick={() => setLocaleWithTransition(availableLocale)}
                >
                  {localeLabels[availableLocale]}
                </button>
              ))}
            </div>
          ) : null}

          <div className="progress-bar">
            {stepOrder.map((stepId, index) => (
              <div
                key={stepId}
                className={`progress-node ${
                  index <= currentStepIndex ? 'progress-node--active' : ''
                }`}
              >
                <span>{index + 1}</span>
                <small>{stepLabels[stepId]}</small>
              </div>
            ))}
          </div>
        </header>

        <div className="wizard-stage">
          {step === 'welcome' ? (
            <section className="page page--welcome">
              <div className="hero-stack">
                <div className="welcome-copy">
                  <h1>{copy.welcomeTitle}</h1>
                  <p className="page-copy">{copy.welcomeBody}</p>
                </div>

                <div className="food-fan" aria-hidden="true">
                  <img src="/assets/paprika-food-1.jpg" alt="" className="food-fan__left" />
                  <img src="/assets/paprika-food-2.jpg" alt="" className="food-fan__center" />
                  <img src="/assets/paprika-food-3.jpg" alt="" className="food-fan__right" />
                </div>

                <div className="stat-row">
                  {rewardPool.map((reward) => (
                    <article
                      key={reward.id}
                      className="stat-pill"
                      style={{ '--reward-accent': reward.accent } as CSSProperties}
                    >
                      <RewardIcon rewardId={reward.id} className="stat-pill__icon" />
                      <span>{reward.labelByLocale[deferredLocale]}</span>
                    </article>
                  ))}
                </div>

                <button
                  type="button"
                  className="action-button"
                  onClick={() => setStep(hasSpun ? 'gift' : 'spin')}
                >
                  {copy.startButton}
                </button>
              </div>
            </section>
          ) : null}

          {step === 'spin' ? (
            <section className="page page--spin">
              <div className="page-head">
                <h2>{copy.spinTitle}</h2>
                <p className="page-copy">{copy.spinBody}</p>
              </div>

              <div className="wheel-shell">
                <div className="wheel-pointer" aria-hidden="true"></div>
                <div
                  className="wheel"
                  style={
                    {
                      backgroundImage: wheelBackground,
                      transform: `rotate(${spinRotation}deg)`,
                    } as CSSProperties
                  }
                >
                  {wheelSegments.map((segment, index) => (
                    <div
                      key={`${segment}-${index}`}
                      className="wheel-label"
                      style={{ '--index': index } as CSSProperties}
                    >
                      <div className="wheel-label__inner">
                        <RewardIcon rewardId={segment} className="wheel-label__icon" />
                        <span>{rewardMap[segment].shortLabelByLocale[deferredLocale]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="spin-trigger"
                  onClick={handleSpin}
                  disabled={isSpinning || hasSpun}
                >
                  {hasSpun ? copy.stepGift : isSpinning ? copy.spinningButton : copy.spinButton}
                </button>
              </div>

              <div className="page-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setStep('welcome')}
                >
                  {copy.backButton}
                </button>
              </div>
            </section>
          ) : null}

          {step === 'gift' && activeReward ? (
            <section
              key={burstSeed}
              className="page page--gift"
              style={
                {
                  '--reward-accent': activeReward.accent,
                  '--reward-burst': activeReward.burst,
                } as CSSProperties
              }
            >
              <div className="burst-scene" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => (
                  <span
                    key={`spark-${index}`}
                    className="burst-spark"
                    style={{ '--spark-index': index } as CSSProperties}
                  ></span>
                ))}
              </div>

              <div className="gift-core">
                <div className="gift-core__icon">
                  <RewardIcon rewardId={activeReward.id} className="gift-core__svg" />
                </div>
                <h2>{copy.giftTitle.replace('{reward}', activeReward.labelByLocale[deferredLocale])}</h2>
                <p className="page-copy">{copy.giftBody}</p>
              </div>

              <div className="page-actions">
                <button
                  type="button"
                  className="action-button"
                  onClick={() => setStep('review')}
                >
                  {copy.stepReview}
                </button>
              </div>
            </section>
          ) : null}

          {step === 'review' && activeReward ? (
            <section className="page page--review">
              <div className="page-head">
                <h2>{copy.reviewTitle}</h2>
                <p className="page-copy">{copy.reviewBody}</p>
              </div>

              <p className="direct-hint">{copy.directReviewHint}</p>

              <div className="review-grid">
                <a
                  className="review-card"
                  href={links.googleReview}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleDirectReview('google')}
                >
                  <img
                    src="/assets/google-badge.png"
                    alt="Google"
                    className="review-card__logo review-card__logo--google"
                  />
                  <strong>{copy.googleCta}</strong>
                </a>

                <a
                  className="review-card"
                  href={links.tripadvisorReview}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleDirectReview('tripadvisor')}
                >
                  <img
                    src="/assets/tripadvisor-icon.png"
                    alt="TripAdvisor"
                    className="review-card__logo review-card__logo--tripadvisor"
                  />
                  <strong>{copy.tripadvisorCta}</strong>
                </a>
              </div>

              <div className="page-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setStep('gift')}
                >
                  {copy.backButton}
                </button>
              </div>
            </section>
          ) : null}

          {step === 'claim' && activeReward && claimSnapshot ? (
            <section
              className="page page--claim"
              style={{ '--reward-accent': activeReward.accent } as CSSProperties}
            >
              <div className="claim-card">
                <RewardIcon rewardId={activeReward.id} className="claim-card__icon" />
                <h2>{copy.claimTitle}</h2>
                <p className="page-copy">{activeReward.staffInstructionByLocale[deferredLocale]}</p>
                <p className="claim-card__body">{copy.claimBody}</p>

                <div className="claim-card__meta">
                  <span>
                    {copy.platformOpened}:{' '}
                    {claimSnapshot.platform === 'google' ? 'Google' : 'TripAdvisor'}
                  </span>
                  <span>{claimTimestamp}</span>
                  <span>#{String(claimSnapshot.spinNumber).padStart(2, '0')}</span>
                </div>
              </div>

              <div className="page-actions">
                <button
                  type="button"
                  className="action-button"
                  onClick={() => {
                    setSelectedRewardId(null)
                    setClaimSnapshot(null)
                    setStep('review')
                  }}
                >
                  {copy.stepReview}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <footer className="footer-bar">
        <a href={links.website} target="_blank" rel="noreferrer">
          {copy.websiteCta}
        </a>
        <a href={links.maps} target="_blank" rel="noreferrer">
          {copy.mapCta}
        </a>
        <a href={links.instagram} target="_blank" rel="noreferrer">
          {copy.instagramCta}
        </a>
        <a href={links.phone}>{copy.callCta}</a>
      </footer>
    </main>
  )
}

export default App
