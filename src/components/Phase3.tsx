import { useState, useEffect, useRef } from 'react'

/* ─── HOOK ─── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── MASKING TAPE ─── */
function Tape({ angle = 0, left = '50%', color = 'rgba(247,197,110,0.5)' }: { angle?: number; left?: string; color?: string }) {
  return (
    <div style={{
      position: 'absolute', top: -10, left,
      transform: `translateX(-50%) rotate(${angle}deg)`,
      width: 52, height: 18,
      background: color,
      borderRadius: 2,
      zIndex: 2,
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)',
    }} />
  )
}

/* ─── POLAROID ─── */
interface PolaroidProps {
  src: string
  alt: string
  rotation: number
  caption?: string
  objectPosition?: string
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
  tapeLeft?: string
  tapeAngle?: number
  color?: string
}

function Polaroid({ src, alt, rotation, caption, objectPosition = 'center center', size = 'md', style, tapeLeft = '50%', tapeAngle = 0 }: PolaroidProps) {
  const heights: Record<string, number> = { sm: 180, md: 240, lg: 320 }
  const widths: Record<string, number> = { sm: 160, md: 210, lg: 280 }

  return (
    <div style={{
      position: 'relative',
      background: 'white',
      padding: '10px 10px 44px',
      borderRadius: 3,
      boxShadow: '0 6px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
      transform: `rotate(${rotation}deg)`,
      width: widths[size],
      flexShrink: 0,
      ...style,
    }}>
      <Tape angle={tapeAngle} left={tapeLeft} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: heights[size], objectFit: 'cover', objectPosition, display: 'block', borderRadius: 1 }}
      />
      {caption && (
        <p className="font-script" style={{ textAlign: 'center', margin: '6px 0 0', fontSize: '1rem', color: '#5a3a2a', lineHeight: 1.2 }}>
          {caption}
        </p>
      )}
    </div>
  )
}

/* ─── TABLEAU WRAPPER ─── */
function Tableau({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(48px)', transition: `opacity 1s ${delay}s ease, transform 1s ${delay}s ease`, marginBottom: 'clamp(60px, 12vw, 120px)' }}>
      {children}
    </div>
  )
}

/* ─── CONFETTI ─── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#F7C56E', '#F0D8D0', '#E8BFB3', '#D4A843', '#FFF9F0', '#f5a3a3', '#b8e0d4', '#f7b8d4']
    const pieces = Array.from({ length: 240 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.5,
      w: Math.random() * 11 + 4,
      h: Math.random() * 14 + 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 3.5 + 1.5,
      spin: (Math.random() - 0.5) * 0.14,
      angle: Math.random() * Math.PI * 2,
      sway: Math.random() * 1.8 - 0.9,
      swayFreq: Math.random() * 0.03 + 0.01,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016
      pieces.forEach((p) => {
        p.y += p.speed
        p.angle += p.spin
        p.x += Math.sin(t * p.swayFreq * 10) * p.sway
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width }
        ctx.save()
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.88
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }} />
}

/* ─── PHASE 3 MAIN ─── */
export default function Phase3() {
  const [celebrate, setCelebrate] = useState(false)
  const [showSig, setShowSig] = useState(false)
  const { ref: headerRef, inView: headerInView } = useInView()

  const handleCelebrate = () => {
    setCelebrate(true)
    setTimeout(() => setShowSig(true), 1200)
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom, #FFF9F0 0%, #fdf2e5 100%)', position: 'relative', overflow: 'hidden' }}>
      <ConfettiCanvas active={celebrate} />

      {/* ─── HEADER ─── */}
      <div
        ref={headerRef}
        style={{ textAlign: 'center', padding: 'clamp(80px, 14vw, 140px) 24px clamp(40px, 8vw, 80px)', opacity: headerInView ? 1 : 0, transform: headerInView ? 'none' : 'translateY(32px)', transition: 'opacity 1s ease, transform 1s ease' }}
      >
        <i className="fa-solid fa-camera" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: 20, display: 'block', opacity: 0.7 }} />
        <h2 className="font-display text-shimmer" style={{ fontSize: 'clamp(2.4rem, 7vw, 4.2rem)', lineHeight: 1.12, margin: '0 0 20px' }}>
          Joyeux Anniversaire,<br />Caramel !
        </h2>
        <p className="font-serif" style={{ color: 'var(--brown)', fontStyle: 'italic', lineHeight: 1.8, fontSize: '1rem', maxWidth: 440, margin: '0 auto' }}>
          Profite de cette belle journée.<br />
          Profite des gens qui t'aiment.<br />
          Et surtout, profite de toi.
        </p>
      </div>

      {/* ─── TABLEAU 1 — Polaroids 10/10 (photo-01, photo-12, photo-19) ─── */}
      <Tableau>
        <div style={{ padding: '0 clamp(16px, 5vw, 80px)' }}>
          <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 40, opacity: 0.7 }}>
            — Tableau I —
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, alignItems: 'flex-start' }}>
            {/* photo-01: canapé, cheveux, de tête au genou, espace à gauche — recadre vers droite */}
            <Polaroid
              src="/photos/photo-01.jpg"
              alt="Caramel assise sur le canapé"
              rotation={-3.5}
              caption="toujours classe"
              objectPosition="70% center"
              size="lg"
              tapeAngle={-5}
              tapeLeft="40%"
            />
            {/* photo-12: jupe jean, crop top, cheveux attachés, 10/10, dents visibles */}
            <Polaroid
              src="/photos/photo-12.jpg"
              alt="Caramel souriante en jupe jean"
              rotation={1.8}
              caption="ce sourire ✨"
              objectPosition="center 20%"
              size="lg"
              style={{ marginTop: 40 }}
              tapeAngle={4}
              tapeLeft="60%"
            />
            {/* photo-19: robe noire, ciel bleu, nuages, profil, 10/10 */}
            <Polaroid
              src="/photos/photo-19.jpg"
              alt="Caramel en robe noire sous le ciel"
              rotation={-1.2}
              caption="dans ses pensées"
              objectPosition="center 15%"
              size="md"
              style={{ marginTop: -20 }}
              tapeAngle={2}
              tapeLeft="55%"
            />
          </div>
        </div>
      </Tableau>

      {/* ─── TABLEAU 2 — Éditorial dominant (photo-05, photo-03, photo-13) ─── */}
      <Tableau delay={0.05}>
        <div style={{ padding: '0 clamp(16px, 5vw, 80px)' }}>
          <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 40, opacity: 0.7 }}>
            — Tableau II —
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto', alignItems: 'start' }}>
            {/* photo-05: plage, rochers, vent dans les cheveux — image dominante */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 60px rgba(122,78,58,0.16)', transform: 'rotate(-0.8deg)' }}>
              <img src="/photos/photo-05.jpg" alt="Caramel sur la plage" loading="lazy" style={{ width: '100%', height: 480, objectFit: 'cover', objectPosition: 'center 25%', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(122,78,58,0.25) 0%, transparent 50%)' }} />
              <p className="font-script" style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '1.4rem', whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,0.3)', margin: 0 }}>
                en bord de mer
              </p>
            </div>

            {/* Colonne droite */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* photo-03: buissons, verdure, ensoleillé, robe courte */}
              <div style={{ position: 'relative', background: 'white', padding: '8px 8px 36px', borderRadius: 3, boxShadow: '0 6px 28px rgba(0,0,0,0.12)', transform: 'rotate(2.2deg)' }}>
                <Tape angle={-3} left="45%" />
                <img src="/photos/photo-03.jpg" alt="Caramel dans la verdure" loading="lazy" style={{ width: '100%', height: 200, objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
                <p className="font-script" style={{ textAlign: 'center', margin: '6px 0 0', fontSize: '0.95rem', color: '#5a3a2a' }}>au grand air</p>
              </div>
              {/* photo-13: selfie sur le lit, piercing, cheveux libres */}
              <div style={{ position: 'relative', background: 'white', padding: '8px 8px 36px', borderRadius: 3, boxShadow: '0 6px 28px rgba(0,0,0,0.12)', transform: 'rotate(-1.5deg)', marginTop: 8 }}>
                <Tape angle={5} left="60%" color="rgba(242,180,160,0.55)" />
                <img src="/photos/photo-13.jpg" alt="Caramel selfie souriant" loading="lazy" style={{ width: '100%', height: 200, objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} />
                <p className="font-script" style={{ textAlign: 'center', margin: '6px 0 0', fontSize: '0.95rem', color: '#5a3a2a' }}>détendue</p>
              </div>
            </div>
          </div>
        </div>
      </Tableau>

      {/* ─── TABLEAU 3 — Asymétrique (photo-02, photo-14, photo-15, photo-20) ─── */}
      <Tableau delay={0.05}>
        <div style={{ padding: '0 clamp(16px, 5vw, 80px)' }}>
          <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 40, opacity: 0.7 }}>
            — Tableau III —
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 28, alignItems: 'flex-start', maxWidth: 900, margin: '0 auto' }}>
            {/* photo-02: même canapé, penche la tête, tee-shirt + short */}
            <Polaroid
              src="/photos/photo-02.jpg"
              alt="Caramel qui penche la tête"
              rotation={2}
              caption="naturellement elle"
              objectPosition="65% center"
              size="md"
              tapeAngle={-4}
              tapeLeft="45%"
            />
            {/* photo-14: polo jaune, cheveux bouclés, de profil regardant cam */}
            <Polaroid
              src="/photos/photo-14.jpg"
              alt="Caramel polo jaune"
              rotation={-2.8}
              caption="couleur soleil"
              objectPosition="center 20%"
              size="md"
              style={{ marginTop: 50 }}
              tapeAngle={6}
              tapeLeft="55%"
              color="rgba(247,197,110,0.5)"
            />
            {/* photo-15: selfie tee-shirt blanc, sourire, mur brique */}
            <Polaroid
              src="/photos/photo-15.jpg"
              alt="Caramel selfie sourire"
              rotation={1.5}
              caption="bon sourire"
              objectPosition="center 15%"
              size="md"
              style={{ marginTop: 20 }}
              tapeAngle={-2}
              tapeLeft="50%"
            />
            {/* photo-20: calèches, tenue jaune, soleil couchant, ciel bleu */}
            <Polaroid
              src="/photos/photo-20.jpg"
              alt="Caramel en jaune au coucher du soleil"
              rotation={-1}
              caption="golden hour"
              objectPosition="center 30%"
              size="lg"
              style={{ marginTop: -30 }}
              tapeAngle={3}
              tapeLeft="40%"
            />
          </div>
        </div>
      </Tableau>

      {/* ─── TABLEAU 4 — Grand final (photo-06, photo-17, photo-18, photo-21, photo-22) ─── */}
      <Tableau delay={0.05}>
        <div style={{ padding: '0 clamp(16px, 5vw, 80px)' }}>
          <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 40, opacity: 0.7 }}>
            — Tableau IV —
          </p>

          {/* Layout éditorial dense */}
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {/* Rangée du haut */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>
              {/* photo-06: canapé, sac, mains dans cheveux */}
              <Polaroid
                src="/photos/photo-06.jpg"
                alt="Caramel assise avec assurance"
                rotation={-2}
                caption="confiance"
                objectPosition="center 20%"
                size="md"
                tapeAngle={5}
                tapeLeft="50%"
              />
              {/* photo-17: selfie sous parapluie, cheveux masquant côté */}
              <Polaroid
                src="/photos/photo-17.jpg"
                alt="Caramel sous un parapluie"
                rotation={3}
                caption="même sous la pluie"
                objectPosition="center 15%"
                size="md"
                style={{ marginTop: 36 }}
                tapeAngle={-4}
                tapeLeft="45%"
              />
              {/* photo-18: lunettes serre-tête, selfie, boucle d'oreille */}
              <Polaroid
                src="/photos/photo-18.jpg"
                alt="Caramel lunettes en serre-tête"
                rotation={-1.5}
                caption="style impeccable"
                objectPosition="center 10%"
                size="md"
                style={{ marginTop: -16 }}
                tapeAngle={2}
                tapeLeft="55%"
              />
            </div>

            {/* Rangée du bas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, alignItems: 'flex-start' }}>
              {/* photo-21: tenue jaune, cheville, regarde l'objectif */}
              <Polaroid
                src="/photos/photo-21.jpg"
                alt="Caramel en tenue jaune"
                rotation={1.2}
                caption="pleine de vie"
                objectPosition="center 25%"
                size="md"
                tapeAngle={-5}
                tapeLeft="40%"
              />
              {/* photo-22: plus jeune, cheveux bicolores, s'appuie sur bus */}
              <Polaroid
                src="/photos/photo-22.jpg"
                alt="Caramel souriante devant un bus"
                rotation={-3.5}
                caption="depuis le début"
                objectPosition="center 20%"
                size="lg"
                style={{ marginTop: 24 }}
                tapeAngle={6}
                tapeLeft="55%"
                color="rgba(242,180,160,0.55)"
              />
            </div>
          </div>
        </div>
      </Tableau>

      {/* ─── CÉLÉBRATION FINALE ─── */}
      <div style={{ textAlign: 'center', padding: 'clamp(60px, 10vw, 120px) 24px clamp(80px, 14vw, 140px)' }}>
        {/* Ralentissement visuel — retour au calme */}
        <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, var(--gold), transparent)', margin: '0 auto 48px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
          {['fa-cake-candles', 'fa-champagne-glasses', 'fa-star', 'fa-heart', 'fa-sparkles'].map((icon, i) => (
            <i key={icon} className={`fa-solid ${icon}`} style={{ color: 'var(--gold)', fontSize: 'clamp(1rem, 3vw, 1.5rem)', opacity: celebrate ? 1 : 0.65, animation: `starFloat ${2.2 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`, transition: 'opacity 0.6s ease' }} />
          ))}
        </div>

        <h2 className="font-display text-shimmer" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', lineHeight: 1.15, margin: '0 0 20px' }}>
          Joyeux Anniversaire,<br />Caramel !
        </h2>
        <p className="font-serif" style={{ color: 'var(--brown)', fontStyle: 'italic', lineHeight: 1.85, fontSize: '1rem', maxWidth: 440, margin: '0 auto 44px' }}>
          Profite de cette belle journée.<br />
          Profite des gens qui t'aiment.<br />
          Et surtout, profite de toi.
        </p>

        {!celebrate ? (
          <button
            onClick={handleCelebrate}
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', border: 'none', borderRadius: 50, color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.06em', padding: '16px 44px', cursor: 'pointer', boxShadow: '0 6px 32px rgba(247,197,110,0.45)', display: 'inline-flex', alignItems: 'center', gap: 12, animation: 'glowPulse 3s ease-in-out infinite', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 10px 48px rgba(247,197,110,0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(247,197,110,0.45)' }}
          >
            <i className="fa-solid fa-champagne-glasses" />
            Fêter ça !
            <i className="fa-solid fa-sparkles" />
          </button>
        ) : (
          <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <i className="fa-solid fa-champagne-glasses" style={{ color: 'var(--gold)', fontSize: '2.5rem', animation: 'starFloat 2s ease-in-out infinite' }} />
          </div>
        )}

        {/* Signature secrète */}
        {showSig && (
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(247,197,110,0.2)', animation: 'fadeIn 1.4s ease' }}>
            <p className="font-script" style={{ color: 'var(--gold-dark)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', margin: '0 0 10px', animation: 'signatureReveal 1.8s ease' }}>
              Fait avec amour par ton démon préféré.
            </p>
            <p className="font-ui" style={{ color: 'rgba(122,78,58,0.35)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
              — avec tout ce qui compte
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
