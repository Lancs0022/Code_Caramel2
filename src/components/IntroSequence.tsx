import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  onReveal: (origin: { x: number; y: number }) => void
}

const SEQUENCES = [
  {
    text: "Il y a des jours qui méritent un peu plus\nqu'un simple message...",
    hint: 'Clique pour continuer',
  },
  {
    text: "Et aujourd'hui en fait clairement partie.",
    hint: 'Encore une chose...',
  },
  {
    text: "Alors, comme promis...\nJ'ai préparé quelque chose pour toi.",
    hint: 'Continue',
  },
  {
    text: 'Pour une personne qui compte particulièrement.\n\nPour toi, Caramel.',
    hint: '',
  },
]

const STAR_COUNT = 28

export default function IntroSequence({ onReveal }: Props) {
  const [step, setStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [buttonReady, setButtonReady] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const stars = useRef(
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      dur: Math.random() * 3 + 1.8,
      delay: Math.random() * 4,
    }))
  )

  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: Math.random() * 12 + 14,
      delay: Math.random() * 8,
      size: Math.random() * 6 + 3,
      color: i % 2 === 0 ? 'rgba(247,197,110,0.3)' : 'rgba(242,180,160,0.25)',
    }))
  )

  useEffect(() => {
    if (step === SEQUENCES.length - 1) {
      const t = setTimeout(() => {
        setShowButton(true)
        setTimeout(() => setButtonReady(true), 80)
      }, 1400)
      return () => clearTimeout(t)
    }
  }, [step])

  const advance = useCallback(() => {
    if (step < SEQUENCES.length - 1) {
      setStep((s) => s + 1)
      setAnimKey((k) => k + 1)
    }
  }, [step])

  const handleReveal = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100
    onReveal({ x, y })
  }, [onReveal])

  const seq = SEQUENCES[step]
  const isLast = step === SEQUENCES.length - 1

  return (
    <div
      className="phase1-bg"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: isLast && showButton ? 'default' : 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onClick={!isLast ? advance : undefined}
    >
      {/* Stars */}
      {stars.current.map((s) => (
        <div
          key={s.id}
          className="anim-twinkle"
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'rgba(255, 240, 200, 0.85)',
            '--tw-dur': `${s.dur}s`,
            '--tw-delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Floating particles */}
      {particles.current.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            animation: `particleDrift ${p.dur}s ${p.delay}s linear infinite`,
          }}
        />
      ))}

      {/* Ambient halo */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,197,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 48,
          padding: '0 32px',
          maxWidth: 640,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <p
          key={animKey}
          className="anim-blur-in font-display"
          style={{
            color: 'var(--dark-text)',
            fontSize: 'clamp(1.35rem, 4vw, 2rem)',
            lineHeight: 1.65,
            fontStyle: 'italic',
            fontWeight: 400,
            whiteSpace: 'pre-line',
            margin: 0,
            textShadow: '0 2px 20px rgba(247,197,110,0.15)',
          }}
        >
          {seq.text}
        </p>

        {/* Hint or CTA button */}
        {!isLast || !showButton ? (
          seq.hint && (
            <div
              key={`hint-${animKey}`}
              style={{
                opacity: 0,
                animation: 'fadeIn 0.5s 1.2s ease forwards',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--dark-muted)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <i className="fa-solid fa-circle-dot" style={{ fontSize: 6, opacity: 0.6 }} />
              {seq.hint}
              <i className="fa-solid fa-circle-dot" style={{ fontSize: 6, opacity: 0.6 }} />
            </div>
          )
        ) : (
          <button
            ref={btnRef}
            onClick={handleReveal}
            className={`glass-card anim-breathe font-ui`}
            style={{
              opacity: buttonReady ? 1 : 0,
              transition: 'opacity 0.8s ease',
              border: '1px solid rgba(247,197,110,0.5)',
              background: 'rgba(247,197,110,0.12)',
              color: 'var(--gold)',
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              padding: '14px 36px',
              borderRadius: 50,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <i className="fa-solid fa-sparkles" style={{ fontSize: '0.85rem' }} />
            Découvrir la surprise
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}
      >
        {SEQUENCES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i === step
                  ? 'rgba(247,197,110,0.8)'
                  : i < step
                    ? 'rgba(247,197,110,0.4)'
                    : 'rgba(255,255,255,0.15)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
