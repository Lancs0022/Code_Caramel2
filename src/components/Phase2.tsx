import { useState, useEffect, useRef } from 'react'
import AudioController from './AudioController'
import Phase3 from './Phase3'

/* ─── HOOK ─── */
function useInView(threshold = 0.1) {
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

/* ─── AMBIENT PARTICLES ─── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  dur: Math.random() * 20 + 22,
  delay: Math.random() * 16,
  size: Math.random() * 7 + 4,
  shape: i % 3,
  color: ['rgba(247,197,110,0.3)', 'rgba(242,180,160,0.25)', 'rgba(255,249,240,0.45)'][i % 3],
}))

function FloatingParticles() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {PARTICLES.map((p) => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.left}%`, bottom: -20,
          width: p.size, height: p.size,
          borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '50% 0',
          background: p.color,
          animation: `particleDrift ${p.dur}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  )
}

/* ─── HERO ─── */
function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t) }, [])

  const fade = (delay: string, children: React.ReactNode, extra?: React.CSSProperties) => (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: `opacity 0.85s ${delay} ease, transform 0.85s ${delay} ease`, ...extra }}>
      {children}
    </div>
  )

  return (
    <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 700, width: '100%' }}>
        {fade('0.1s', (
          <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <i className="fa-solid fa-sparkles" style={{ color: 'var(--gold)', fontSize: '0.68rem' }} />
            Une nouvelle et belle année commence...
            <i className="fa-solid fa-sparkles" style={{ color: 'var(--gold)', fontSize: '0.68rem' }} />
          </p>
        ))}
        {fade('0.3s', (
          <h1 className="font-display text-shimmer" style={{ fontSize: 'clamp(2.6rem, 8vw, 5rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px' }}>
            Joyeux Anniversaire,<br />Caramel
          </h1>
        ))}
        {fade('0.5s', (
          <p className="font-script" style={{ color: 'var(--gold-dark)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', margin: '0 0 32px', opacity: 0.9 }}>
            Aujourd'hui, c'est ton jour.
          </p>
        ))}
        {fade('0.7s', (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 44 }}>
            {['fa-cake-candles', 'fa-heart', 'fa-star'].map((icon, i) => (
              <i key={icon} className={`fa-solid ${icon}`} style={{ color: 'var(--gold)', fontSize: '1.1rem', opacity: 0.7, animation: `starFloat ${2.4 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }} />
            ))}
          </div>
        ))}
        {fade('0.9s', (
          <div className="glass-card-light" style={{ display: 'inline-block', padding: '28px 36px', maxWidth: 520 }}>
            <p className="font-serif" style={{ color: 'var(--brown)', lineHeight: 1.85, fontSize: '0.97rem', margin: 0, fontStyle: 'italic' }}>
              Caramel, aujourd'hui, tout tourne autour de toi.<br /><br />
              Alors, pour une fois...<br />
              Mets le reste du monde sur pause pendant quelques minutes.<br /><br />
              Aujourd'hui, c'est toi la vedette.<br /><br />
              Profite bien de ma petite création. C'est tout à ton honneur !
            </p>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', opacity: mounted ? 0.45 : 0, transition: 'opacity 1s 1.6s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>Scroll</p>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
      </div>
    </section>
  )
}

/* ─── SCROLLYTELLING SCRAPBOOK ─── */
function ScrapbookScene({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView(0.08)
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)', transition: `opacity 1s ${delay}s ease, transform 1s ${delay}s ease` }}>
      {children}
    </div>
  )
}

function ScrollytellingScrapbook() {
  const { ref: textRef, inView: textInView } = useInView()

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px, 10vw, 120px) 0' }}>

      {/* Intro text */}
      <div ref={textRef} style={{ textAlign: 'center', padding: '0 24px', marginBottom: 72, opacity: textInView ? 1 : 0, transform: textInView ? 'none' : 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontStyle: 'italic', color: 'var(--brown)', margin: '0 0 14px' }}>
          Une petite parenthèse rien que pour toi.
        </h2>
        <p className="font-serif" style={{ color: 'var(--brown)', lineHeight: 1.85, fontSize: '0.95rem', maxWidth: 540, margin: '0 auto' }}>
          Parce qu'aujourd'hui, j'avais envie de prendre un petit moment pour célébrer la personne derrière tout ça.<br /><br />
          Une personne très souriante, rayonnante, douce... bref, une personne vraiment incroyable.<br /><br />
          Alors autant profiter de cette journée pour mettre quelques images de toi à l'honneur.<br /><br />
          Après tout, aujourd'hui, tu as officiellement le droit de prendre toute la place.
        </p>
      </div>

      {/* SCÈNE 1 — Collage composé ai-1 */}
      <ScrapbookScene>
        <div style={{ padding: '0 clamp(16px, 4vw, 60px)', marginBottom: 80 }}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 80px rgba(122,78,58,0.18), 0 4px 16px rgba(247,197,110,0.12)' }}>
            <img
              src="/photos/ai-1.png"
              alt="Collage anniversaire Caramel"
              loading="lazy"
              style={{ width: '100%', display: 'block', maxHeight: 680, objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(255,249,240,0.15) 100%)' }} />
          </div>
        </div>
      </ScrapbookScene>

      {/* SCÈNE 2 — Photo-08 + photo-09 (route, soleil) */}
      <ScrapbookScene delay={0.1}>
        <div style={{ padding: '0 clamp(16px, 4vw, 60px)', marginBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 900, margin: '0 auto' }}>
            {/* photo-08: debout sur route, chemisier court, lunettes, mains nuque */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 12px 48px rgba(122,78,58,0.14)',
              transform: 'rotate(-1.2deg)',
              transformOrigin: 'center bottom',
              background: 'white',
              padding: '10px 10px 44px',
            }}>
              <img src="/photos/photo-08.jpg" alt="Caramel sous le soleil" loading="lazy" style={{ width: '100%', height: 340, objectFit: 'cover', objectPosition: 'center 20%', display: 'block', borderRadius: 12 }} />
              <p className="font-script" style={{ textAlign: 'center', color: 'var(--brown-light)', fontSize: '1.1rem', margin: '10px 0 0', lineHeight: 1 }}>sous le soleil</p>
            </div>
            {/* photo-09: même route, pose détective, tête à pied */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 12px 48px rgba(122,78,58,0.14)',
              transform: 'rotate(1.5deg)',
              transformOrigin: 'center top',
              background: 'white',
              padding: '10px 10px 44px',
              marginTop: 24,
            }}>
              <img src="/photos/photo-09.jpg" alt="Caramel sur la route" loading="lazy" style={{ width: '100%', height: 340, objectFit: 'cover', objectPosition: 'center 15%', display: 'block', borderRadius: 12 }} />
              <p className="font-script" style={{ textAlign: 'center', color: 'var(--brown-light)', fontSize: '1.1rem', margin: '10px 0 0', lineHeight: 1 }}>bonne humeur</p>
            </div>
          </div>
        </div>
      </ScrapbookScene>

      {/* SCÈNE 3 — Climax : ai-2 cinématique */}
      <ScrapbookScene delay={0.05}>
        <div style={{ position: 'relative', marginBottom: 80 }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src="/photos/ai-2.png"
              alt="Portrait artistique de Caramel"
              loading="lazy"
              style={{ width: '100%', maxHeight: 700, objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
            />
            {/* Overlay gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,249,240,0.05) 0%, rgba(13,10,8,0.4) 100%)' }} />
            {/* Caption */}
            <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <p className="font-script" style={{ color: 'rgba(255,249,240,0.9)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', margin: '0 0 8px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                Parfois, une belle image suffit à créer une ambiance.
              </p>
              <p className="font-ui" style={{ color: 'rgba(247,197,110,0.7)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
                Une vision artistique
              </p>
            </div>
          </div>
        </div>
      </ScrapbookScene>

      {/* TRANSITION vers la lettre */}
      <ScrapbookScene delay={0.1}>
        <div style={{ textAlign: 'center', padding: '20px 24px 60px' }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', margin: '0 auto 32px' }} />
          <p className="font-display" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontStyle: 'italic', color: 'var(--brown)', margin: '0 0 12px' }}>
            Et maintenant...
          </p>
          <p className="font-serif" style={{ color: 'var(--brown-light)', fontSize: '1rem', fontStyle: 'italic', margin: 0 }}>
            Quelques mots spécialement pour toi.
          </p>
        </div>
      </ScrapbookScene>
    </section>
  )
}

/* ─── LETTER CONTENT ─── */
function LetterContent() {
  const sections = [
    {
      heading: null,
      body: `Bon...\n\nAujourd'hui, c'est ton anniversaire.\n\nDonc techniquement, j'ai le droit de t'embêter un peu plus que d'habitude.\n\nMais pour une fois, je vais essayer d'être sérieux.\n\nEnfin...\n\nJe vais essayer.\n\nJe voulais simplement profiter de cette journée pour te souhaiter une très belle année à venir.\n\nUne année pleine de bonnes nouvelles, de beaux projets, de rires et de moments qui méritent vraiment d'être vécus.`,
    },
    {
      heading: "La première fois que je t'ai vue",
      body: `Je me souviens encore de la première fois où je t'ai vue.\n\nC'était pendant notre examen en L1.\n\nC'était aussi l'une des premières fois où je rencontrais réellement tout le monde.\n\nEt puis je t'ai vue...\n\nEt je savais qu'on allait bien nous entendre, tous les deux.\n\nJe ne saurais même pas expliquer pourquoi.\n\nC'était juste une impression.\n\nEt puis, histoire de ne pas arranger les choses, penser à toi m'a distrait pendant tout l'examen.\n\nVoilà.\n\nTrès pratique pour rester concentré.`,
    },
    {
      heading: "Ce que j'apprécie particulièrement chez toi",
      body: `Je crois que la première chose qui captive chez toi, c'est ton sourire.\n\nUn sourire vraiment éclatant.\n\nLe genre de sourire qui attire naturellement l'attention sans même essayer.\n\nEt puis il y a cette impression d'innocence, de douceur et de gentillesse que tu dégages.\n\nAvec, en plus, ce petit côté drôle qui apparaît parfois quand on s'y attend le moins.\n\nBref...\n\nTu as ce petit mélange bien à toi.\n\nDouce. Gentille. Drôle.\n\nAvec ce sourire qui fait son petit travail tranquillement.\n\nEt plus je te connais, plus j'apprécie simplement ta manière d'être.\n\nTa façon de parler. Ta façon de rire. Ta manière de voir certaines choses.\n\nCe petit mélange de personnalité qui fait que tu es simplement...\n\nToi.\n\nEt je pense que c'est ça que j'apprécie particulièrement chez toi.\n\nTu as quelque chose de naturel.\n\nQuelque chose qui ne donne pas l'impression d'être forcé.\n\nEt même sans essayer, tu es le genre de personne qui laisse une impression.`,
    },
    {
      heading: 'Pour cette nouvelle année',
      body: `Pour cette nouvelle année, je te souhaite vraiment beaucoup de belles choses.\n\nDu bonheur, d'abord.\n\nLe vrai.\n\nCelui qui arrive parfois dans des petits moments tout simples et qui, sans prévenir, rend une journée bien meilleure.\n\nJe te souhaite aussi beaucoup de réussite.\n\nDans tes projets. Dans tes envies. Dans tout ce que tu entreprendras.\n\nJ'espère que tes efforts porteront leurs fruits et que tu pourras être fière de tout ce que tu auras accompli.\n\nJe te souhaite aussi de belles aventures.\n\nDes découvertes. Des expériences inattendues. Des endroits que tu n'avais pas prévu de visiter.\n\nJe te souhaite également de la sérénité.\n\nDes journées plus légères. Moins de stress inutile. Et cette tranquillité d'esprit qui permet simplement de profiter davantage de la vie.\n\nJe te souhaite de belles personnes autour de toi.\n\nDes personnes sincères. Des personnes qui sauront respecter qui tu es et apporter quelque chose de positif dans ta vie.\n\nEt surtout...\n\nJe te souhaite une très bonne santé.\n\nVraiment.\n\nJ'espère que cette nouvelle année sera plus douce pour toi sur ce plan-là aussi.\n\nQue ton corps te laissera respirer un peu.\n\nEt qu'il arrêtera de vouloir faire des heures supplémentaires sans prévenir.\n\nParce que oui...\n\nLes rêves, les projets et les aventures, c'est très bien.\n\nMais avec une bonne santé, c'est quand même beaucoup plus pratique.`,
    },
    {
      heading: null,
      body: `Alors profite de cette journée.\n\nProfite des petits moments qui font du bien.\n\nProfite des rires, des belles surprises et de tout ce que cette nouvelle année pourra t'apporter.\n\nEt surtout...\n\nProfite de toi.\n\nJoyeux anniversaire, Caramel.\n\nJe te souhaite sincèrement une très belle année à venir.\n\nEt j'espère qu'elle sera remplie de belles choses.`,
    },
  ]

  return (
    <div className="letter-scroll font-serif" style={{ maxHeight: 520, overflowY: 'auto', padding: '4px 8px 24px 4px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {sections.map((section, si) => (
          <div key={si}>
            {section.heading && (
              <h4 className="font-display" style={{ color: 'var(--brown)', fontSize: '1.05rem', fontWeight: 600, marginBottom: 12, borderBottom: '1px solid rgba(247,197,110,0.25)', paddingBottom: 8 }}>
                {section.heading}
              </h4>
            )}
            {section.body.split('\n\n').map((para, pi) => (
              <p key={pi} style={{ color: 'var(--brown)', lineHeight: 1.85, fontSize: '0.92rem', margin: '0 0 14px', whiteSpace: 'pre-line' }}>
                {para}
              </p>
            ))}
          </div>
        ))}
        <div style={{ textAlign: 'right', paddingTop: 16, borderTop: '1px solid rgba(247,197,110,0.2)' }}>
          <p className="font-script" style={{ color: 'var(--gold-dark)', fontSize: '2rem', lineHeight: 1.2, margin: 0, animation: 'signatureReveal 1.2s 0.3s ease both' }}>
            Ton démon préféré
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── ENVELOPE SECTION ─── */
function EnvelopeSection() {
  const { ref, inView } = useInView()
  const [state, setState] = useState<'closed' | 'opening' | 'open'>('closed')

  const open = () => {
    if (state !== 'closed') return
    setState('opening')
    setTimeout(() => setState('open'), 1100)
  }

  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px, 10vw, 120px) 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 640, width: '100%', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <i className="fa-solid fa-envelope-open-text" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: 16, display: 'block', opacity: 0.8 }} />
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--brown)', fontStyle: 'italic', margin: '0 0 12px' }}>
            Un petit message pour ton anniversaire.
          </h2>
          <p className="font-serif" style={{ color: 'var(--brown-light)', fontStyle: 'italic', fontSize: '0.95rem', margin: 0 }}>
            Quelques mots pour accompagner cette belle journée.
          </p>
        </div>

        <div className="envelope-wrapper" style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ position: 'relative', background: 'rgba(255,249,240,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(247,197,110,0.4)', borderRadius: 16, boxShadow: '0 8px 48px rgba(122,78,58,0.12), 0 2px 8px rgba(247,197,110,0.15)' }}>
            <div
              className={`envelope-flap${state !== 'closed' ? ' is-open' : ''}`}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(160deg, rgba(247,220,170,0.9) 0%, rgba(247,197,110,0.7) 100%)', zIndex: state === 'open' ? 0 : 3, borderRadius: '16px 16px 0 0', clipPath: 'polygon(0 0, 100% 0, 50% 80%)' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, rgba(247,220,160,0.5), transparent)', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)', borderRadius: '0 0 16px 16px', zIndex: 1 }} />

            {state !== 'open' ? (
              <div style={{ position: 'relative', zIndex: 2, padding: '130px 40px 60px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(247,197,110,0.2)', border: '1px solid rgba(247,197,110,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <i className="fa-solid fa-heart" style={{ color: 'var(--gold-dark)', fontSize: '1rem' }} />
                </div>
                <p className="font-serif" style={{ color: 'var(--brown)', fontSize: '1rem', fontStyle: 'italic', marginBottom: 28, lineHeight: 1.6 }}>
                  Quelques mots pour accompagner cette belle journée.
                </p>
                <button
                  onClick={open}
                  disabled={state !== 'closed'}
                  style={{ background: 'linear-gradient(135deg, rgba(247,197,110,0.9), rgba(212,168,67,0.85))', border: 'none', borderRadius: 40, color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.06em', padding: '13px 32px', cursor: state === 'closed' ? 'pointer' : 'default', boxShadow: '0 4px 20px rgba(247,197,110,0.4)', display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(247,197,110,0.55)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(247,197,110,0.4)' }}
                >
                  <i className={`fa-solid ${state === 'opening' ? 'fa-envelope-open' : 'fa-envelope-open-text'}`} />
                  {state === 'opening' ? 'Ouverture...' : 'Ouvrir la lettre'}
                </button>
              </div>
            ) : (
              <div className="envelope-letter is-open" style={{ padding: '20px 36px 36px', position: 'relative', zIndex: 2 }}>
                <div style={{ textAlign: 'center', padding: '16px 0 24px', borderBottom: '1px solid rgba(247,197,110,0.25)', marginBottom: 24 }}>
                  <p className="font-display" style={{ color: 'var(--gold-dark)', fontSize: '1.1rem', fontStyle: 'italic', margin: 0 }}>
                    Joyeux anniversaire, Caramel.
                  </p>
                </div>
                <LetterContent />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── WISHES ─── */
const WISHES = [
  { icon: 'fa-heart-pulse', title: 'Une bonne santé', text: "Avant toute chose, je te souhaite une très bonne santé. De l'énergie pour profiter de tout ce qui t'attend, et surtout beaucoup de journées où ton corps décide enfin de collaborer avec tes projets. Parce que les rêves, les aventures et les grands projets, c'est bien. Avec une bonne santé, c'est encore mieux." },
  { icon: 'fa-face-smile-beam', title: 'Du bonheur', text: "Le vrai. Celui qui se cache dans les petites choses du quotidien et qui, sans prévenir, transforme une journée banale en bonne journée." },
  { icon: 'fa-star', title: 'De la réussite', text: "Que tes efforts portent leurs fruits et que tu puisses être fière du chemin parcouru." },
  { icon: 'fa-compass', title: 'Des aventures', text: "Des découvertes, des expériences inattendues, de nouveaux endroits et suffisamment de belles histoires à raconter." },
  { icon: 'fa-feather', title: 'De la sérénité', text: "Des journées plus légères, moins de stress inutile et assez de tranquillité d'esprit pour profiter pleinement de ce qui compte." },
  { icon: 'fa-handshake-heart', title: 'De belles rencontres', text: "De belles personnes autour de toi. Des personnes sincères, respectueuses et capables d'apporter quelque chose de positif dans ta vie." },
  { icon: 'fa-moon', title: 'Tes rêves', text: "Que les choses auxquelles tu penses aujourd'hui prennent peu à peu forme. Un pas après l'autre." },
  { icon: 'fa-sun', title: 'Les petits bonheurs', text: "Des éclats de rire inattendus, des conversations qui durent beaucoup trop longtemps et des journées qui deviennent de bons souvenirs sans qu'on l'ait prévu." },
  { icon: 'fa-gift', title: 'Un dernier vœu', text: "Que cette année soit vraiment belle pour toi. Et qu'en la regardant dans le rétroviseur, tu puisses sourire et te dire : « Oui. Celle-là, elle valait vraiment le coup. »", special: true },
]

function WishCard({ wish, index }: { wish: typeof WISHES[0]; index: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(28px) scale(0.96)', transition: `opacity 0.7s ${index * 0.07}s ease, transform 0.7s ${index * 0.07}s ease` }}>
      <div
        className="glass-card-light"
        style={{ padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14, border: (wish as any).special ? '1px solid rgba(247,197,110,0.6)' : undefined, boxShadow: (wish as any).special ? '0 8px 40px rgba(247,197,110,0.15)' : undefined, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none' }}
      >
        {(wish as any).special && <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle, rgba(247,197,110,0.25) 0%, transparent 70%)', borderRadius: '0 20px 0 100%' }} />}
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(247,197,110,0.15)', border: '1px solid rgba(247,197,110,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={`fa-solid ${wish.icon}`} style={{ color: 'var(--gold-dark)', fontSize: '1rem' }} />
        </div>
        <h3 className="font-display" style={{ color: 'var(--brown)', fontSize: '1.05rem', fontStyle: 'italic', margin: 0, fontWeight: 600 }}>{wish.title}</h3>
        <p className="font-serif" style={{ color: 'var(--brown)', lineHeight: 1.75, fontSize: '0.88rem', margin: 0, flex: 1 }}>{wish.text}</p>
      </div>
    </div>
  )
}

function WishesSection() {
  const { ref, inView } = useInView()
  return (
    <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px, 10vw, 100px) 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: 56, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
          <i className="fa-solid fa-champagne-glasses" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: 16, display: 'block', opacity: 0.8 }} />
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--brown)', fontStyle: 'italic', margin: '0 0 12px' }}>
            Pour cette nouvelle année...
          </h2>
          <p className="font-serif" style={{ color: 'var(--brown-light)', fontStyle: 'italic', fontSize: '0.95rem', margin: 0 }}>
            Voici ce que je te souhaite.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {WISHES.map((w, i) => <WishCard key={i} wish={w} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ─── FAKE END ─── */
function FakeEndSection({ onSurprise }: { onSurprise: () => void }) {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px, 12vw, 140px) 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(32px)', transition: 'opacity 1s ease, transform 1s ease' }}>
        <div style={{ width: 1, height: 56, background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', margin: '0 auto 40px' }} />
        <p className="font-display" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--brown)', fontStyle: 'italic', margin: '0 0 16px' }}>
          Tu pensais que c'était terminé ?
        </p>
        <p className="font-display" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--brown-light)', fontStyle: 'italic', margin: '0 0 12px' }}>
          Pas tout à fait.
        </p>
        <p className="font-display" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--brown-light)', fontStyle: 'italic', margin: '0 0 8px' }}>
          Il reste encore une petite chose.
        </p>
        <p className="font-serif" style={{ color: 'rgba(122,78,58,0.55)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 40px' }}>
          Parce qu'un anniversaire sans une dernière surprise...<br />
          Ce serait presque trop raisonnable.
        </p>
        <button
          onClick={onSurprise}
          style={{ background: 'transparent', border: '1px solid rgba(247,197,110,0.6)', borderRadius: 50, color: 'var(--brown)', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', letterSpacing: '0.08em', padding: '13px 36px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(12px)', transition: 'background 0.3s, transform 0.3s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(247,197,110,0.12)'; e.currentTarget.style.transform = 'scale(1.04)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none' }}
        >
          <i className="fa-solid fa-gift" />
          Découvrir la dernière surprise
        </button>
      </div>
    </section>
  )
}

/* ─── PHASE 2 EXPORT ─── */
export default function Phase2() {
  const [showPhase3, setShowPhase3] = useState(false)

  const handleSurprise = () => {
    setShowPhase3(true)
    setTimeout(() => document.getElementById('phase3-anchor')?.scrollIntoView({ behavior: 'smooth' }), 120)
  }

  return (
    <div className="phase2-bg" style={{ position: 'relative', minHeight: '100vh' }}>
      <FloatingParticles />
      <AudioController />
      <HeroSection />
      <ScrollytellingScrapbook />
      <EnvelopeSection />
      <WishesSection />
      <FakeEndSection onSurprise={handleSurprise} />
      <div id="phase3-anchor">
        {showPhase3 && <Phase3 />}
      </div>
    </div>
  )
}
