import { useState, useEffect, useRef, useCallback } from 'react'
import AudioController from './AudioController'

/* ─── HOOK: scroll-triggered reveal ─── */
function useInView(threshold = 0.12) {
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
const PHASE2_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  dur: Math.random() * 20 + 22,
  delay: Math.random() * 15,
  size: Math.random() * 8 + 4,
  shape: i % 3,
  color: [
    'rgba(247,197,110,0.35)',
    'rgba(242,180,160,0.3)',
    'rgba(255,249,240,0.5)',
  ][i % 3],
}))

function FloatingParticles() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {PHASE2_PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size,
            borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '50% 0',
            background: p.color,
            animation: `particleDrift ${p.dur}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── HERO SECTION ─── */
function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t) }, [])

  const line = (delay: string, children: React.ReactNode, style?: React.CSSProperties) => (
    <div style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.8s ${delay} ease, transform 0.8s ${delay} ease`, transform: mounted ? 'none' : 'translateY(20px)', ...style }}>
      {children}
    </div>
  )

  return (
    <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 700, width: '100%' }}>
        {line('0.1s', (
          <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <i className="fa-solid fa-sparkles" style={{ color: 'var(--gold)', fontSize: '0.7rem' }} />
            Une nouvelle et belle année commence...
            <i className="fa-solid fa-sparkles" style={{ color: 'var(--gold)', fontSize: '0.7rem' }} />
          </p>
        ))}

        {line('0.3s', (
          <h1 className="font-display text-shimmer" style={{ fontSize: 'clamp(2.6rem, 8vw, 5rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px' }}>
            Joyeux Anniversaire,<br />Caramel
          </h1>
        ))}

        {line('0.55s', (
          <p className="font-script" style={{ color: 'var(--gold-dark)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', margin: '0 0 32px', opacity: 0.9 }}>
            Aujourd'hui, c'est ton jour.
          </p>
        ))}

        {line('0.75s', (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 48 }}>
            {['fa-cake-candles', 'fa-heart', 'fa-star'].map((icon, i) => (
              <i key={icon} className={`fa-solid ${icon}`} style={{ color: 'var(--gold)', fontSize: '1.1rem', opacity: 0.7, animation: `starFloat ${2.5 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }} />
            ))}
          </div>
        ))}

        {line('0.95s', (
          <div className="glass-card-light" style={{ display: 'inline-block', padding: '28px 40px', maxWidth: 500 }}>
            <p className="font-serif" style={{ color: 'var(--brown)', lineHeight: 1.8, fontSize: '1rem', margin: 0, fontStyle: 'italic' }}>
              Caramel, aujourd'hui, tout tourne autour de toi.<br /><br />
              Alors, pour une fois...<br />
              Mets le reste du monde sur pause pendant quelques minutes.<br />
              Aujourd'hui, c'est toi la vedette.
            </p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', opacity: mounted ? 0.5 : 0, transition: 'opacity 1s 1.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <p className="font-ui" style={{ color: 'var(--brown-light)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Scroll</p>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
      </div>
    </section>
  )
}

/* ─── VISUAL BREAK SECTION ─── */
function VisualBreakSection() {
  const { ref, inView } = useInView()

  const textLines = [
    "Parce qu'au fond, je n'ai pas besoin d'une galerie entière de photos pour penser à toi.",
    "Et soyons honnêtes, si j'avais dû prendre une photo à chaque fois que tu me traversais l'esprit...",
    "J'aurais probablement beaucoup trop de photos.",
    "Mais certaines personnes ont simplement cette capacité à rester quelque part dans un coin de notre tête.",
    "Une conversation qui revient sans prévenir. Un souvenir qui surgit au beau milieu d'une journée banale.",
    "Et je crois que tu fais partie de ces personnes-là.",
    "Et toi, tu en as laissé une.",
  ]

  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px, 10vw, 120px) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>

        {/* Image collage */}
        <div style={{ position: 'relative', height: 480 }}>
          <div className="glass-card-light" style={{
            position: 'absolute', top: 0, left: 0, width: '75%', height: '65%',
            overflow: 'hidden',
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.9s 0.1s ease, transform 0.9s 0.1s ease',
          }}>
            <img src="https://images.unsplash.com/photo-1490750967868-88df5691cc73?w=600&h=400&fit=crop&auto=format" alt="fleurs roses douces" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div className="glass-card-light" style={{
            position: 'absolute', bottom: 0, right: 0, width: '65%', height: '55%',
            overflow: 'hidden',
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.9s 0.35s ease, transform 0.9s 0.35s ease',
          }}>
            <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=350&fit=crop&auto=format" alt="lumière dorée et nature" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          {/* Decorative element */}
          <div style={{
            position: 'absolute', top: '38%', left: '55%', transform: 'translate(-50%,-50%)',
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(247,197,110,0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(247,197,110,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: inView ? 1 : 0, transition: 'opacity 0.8s 0.6s ease',
          }}>
            <i className="fa-solid fa-heart" style={{ color: 'var(--gold)', fontSize: '1rem' }} />
          </div>
        </div>

        {/* Text content */}
        <div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontStyle: 'italic', fontWeight: 400,
            color: 'var(--brown)', lineHeight: 1.2, marginBottom: 28,
            opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.8s 0.2s ease, transform 0.8s 0.2s ease',
          }}>
            Quelques images...
          </h2>
          <p className="font-ui" style={{
            color: 'var(--brown-light)', fontSize: '0.8rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 24,
            opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.7s 0.35s ease, transform 0.7s 0.35s ease',
          }}>
            Pas pour raconter une histoire. Juste pour créer une petite ambiance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {textLines.map((line, i) => (
              <p key={i} className="font-serif" style={{
                color: 'var(--brown)', lineHeight: 1.75, fontSize: '0.95rem',
                margin: 0, fontStyle: i === textLines.length - 1 ? 'italic' : 'normal',
                fontWeight: i === textLines.length - 1 ? 500 : 400,
                opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)',
                transition: `opacity 0.7s ${0.4 + i * 0.08}s ease, transform 0.7s ${0.4 + i * 0.08}s ease`,
              }}>
                {line}
              </p>
            ))}
          </div>
          <p className="font-serif" style={{
            color: 'var(--brown-light)', fontSize: '0.85rem', fontStyle: 'italic',
            marginTop: 28, borderTop: '1px solid rgba(247,197,110,0.25)', paddingTop: 20,
            opacity: inView ? 1 : 0, transition: 'opacity 0.8s 1.2s ease',
          }}>
            Et maintenant que j'ai réussi à parler de toi pendant quelques paragraphes sans faire semblant de savoir écrire un roman...<br />
            Je voulais quand même prendre le temps de te dire quelque chose.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── LETTER CONTENT ─── */
function LetterContent() {
  const sections = [
    {
      heading: null,
      body: `Bon...\n\nAujourd'hui, c'est ton anniversaire.\n\nDonc techniquement, j'ai le droit de t'embêter un peu plus que d'habitude.\n\nMais pour une fois, je vais essayer d'être sérieux.\n\nEnfin...\n\nJe vais essayer.`,
    },
    {
      heading: null,
      body: `Je voulais simplement profiter de cette journée pour te rappeler quelque chose de simple :\n\nTu es une personne qui compte.\n\nJe ne le dis probablement pas toujours.\n\nLa vie avance, chacun a ses occupations, ses problèmes, ses projets, et parfois on se retrouve à passer beaucoup trop de temps à gérer tout ce qui nous tombe dessus.\n\nMais au milieu de tout ça, certaines personnes gardent une place particulière.\n\nEt toi, tu en fais partie.`,
    },
    {
      heading: "La première fois que je t'ai vue",
      body: `Je me souviens encore de la première fois où je t'ai vue.\n\nC'était pendant notre examen de commerce en L1.\n\nÀ cette époque, comme c'était du télé-enseignement, je n'avais encore jamais vraiment rencontré tout le monde en personne. Et évidemment... J'avais réussi à rater le regroupement qui avait été organisé pour les révisions avant l'examen.\n\nDonc le jour de l'examen, c'était un peu la première fois que je rencontrais vraiment tout le monde.\n\nEt puis je t'ai vue.\n\nEt là, il faut quand même que je fasse un aveu.\n\nC'était un examen sérieux. Un moment où, normalement, on est censé être concentré, réfléchir à ses réponses et essayer de ne pas transformer sa copie en catastrophe académique.\n\nMoi, pendant ce temps-là... J'avais surtout envie que tu me parles.\n\nVoilà.\n\nLa concentration était officiellement en grève.`,
    },
    {
      heading: null,
      body: `Je ne sais pas exactement ce qu'il y avait dans ta façon d'être à ce moment-là, mais tu as immédiatement capté mon attention.\n\nPas juste « tiens, une personne intéressante ».\n\nNon.\n\nJ'ai réellement eu cette impression étrange que toi et moi, on allait finir par devenir très proches.\n\nJe ne savais pas encore comment. Je ne savais même pas pourquoi je pensais ça.\n\nMais je me suis dit quelque chose dans le genre :\n\n« Je sens qu'elle et moi, on va bien s'entendre. »\n\nEt comme si ça ne suffisait pas, j'avais aussi soudainement très envie de te montrer à quel point j'étais intelligent.\n\nDonc chaque fois que je connaissais la réponse à une question... Je te la filais.\n\nOui. Pendant un examen. Le plan était visiblement très subtil.\n\nEt apparemment, mon cerveau avait décidé que le meilleur moyen de créer un lien avec toi était de transformer l'examen en démonstration improvisée de mes talents académiques.\n\nTrès stratégique. Très professionnel. Absolument pas distrait.\n\nBon... Peut-être un peu.\n\nMais malgré tout ça, je crois que j'avais déjà cette intuition. Cette sensation que toi et moi, on allait devenir très proches. Et apparemment, mon intuition avait décidé de faire son travail ce jour-là.`,
    },
    {
      heading: "Ce que j'ai remarqué chez toi",
      body: `Je crois que la première chose qui m'a vraiment captivé chez toi... C'était ton sourire.\n\nUn sourire vraiment éclatant. Le genre de sourire qui attire naturellement l'attention sans même essayer.\n\nEt puis, en te regardant un peu plus, j'ai rapidement remarqué cette impression d'innocence, de douceur et de gentillesse que tu dégageais. Avec, en plus, ce petit côté drôle qui apparaît parfois quand on s'y attend le moins.\n\nBref... Tu avais réussi le combo.\n\nSourire éclatant. Air innocent. Douceur. Gentillesse. Humour.\n\nÀ ce stade-là, ma concentration avait déjà commencé à démissionner.`,
    },
    {
      heading: "Ce que j'apprécie chez toi",
      body: `Au fil du temps, j'ai découvert bien plus que ton sourire.\n\nJ'ai découvert ta manière d'être. Ta façon de parler. Ta façon de rire. Ta manière de voir certaines choses. Ton côté doux. Ton côté drôle.\n\nEt ce petit mélange de personnalité qui fait que tu es simplement... Toi.\n\nJe pense que c'est ça que j'apprécie le plus. Tu as quelque chose de naturel. Quelque chose qui ne donne pas l'impression d'être forcé.\n\nEt tu es le genre de personne qui laisse une impression. Pas nécessairement parce qu'elle cherche à le faire. Simplement parce qu'elle est elle-même.\n\nEt parfois, je pense qu'on ne prend pas assez le temps de dire aux personnes qui comptent pour nous ce qu'on apprécie réellement chez elles.\n\nOn se dit qu'elles le savent déjà.\n\nAlors qu'en réalité... Ça ne fait jamais de mal de le rappeler.\n\nEt aujourd'hui, je voulais que tu le saches.`,
    },
    {
      heading: "Les moments qu'on garde",
      body: `Quand je repense aux moments qu'on a pu partager, je pense surtout à toutes ces petites choses qui, sur le moment, semblaient complètement normales.\n\nLes conversations. Les rires. Les moments parfois totalement absurdes. Les discussions qui partent dans tous les sens. Les échanges dont on ne se rappelle même plus forcément le sujet exact, mais dont on se souvient parfaitement de l'ambiance.\n\nEt finalement, je crois que c'est souvent ça que l'on garde le plus. Pas forcément les grands événements. Mais toutes ces petites choses qui deviennent importantes sans qu'on s'en rende compte.\n\nDes moments simples. Des discussions ordinaires. Des souvenirs qui, pris séparément, ne semblent peut-être pas extraordinaires. Mais qui, avec le temps, prennent une place particulière.\n\nEt je suis reconnaissant d'avoir pu partager tout ça avec toi.`,
    },
    {
      heading: 'Pour cette nouvelle année',
      body: `Pour cette nouvelle année, je te souhaite vraiment beaucoup de belles choses.\n\nDu bonheur, d'abord. Le vrai. Celui qui arrive parfois dans des petits moments tout simples et qui, sans prévenir, rend une journée bien meilleure.\n\nJe te souhaite aussi beaucoup de réussite. Dans tes projets. Dans tes envies. Dans tout ce que tu entreprendras.\n\nJe te souhaite de belles aventures. Des découvertes. Des expériences inattendues. Des endroits que tu n'avais pas prévu de visiter.\n\nJe te souhaite également de la sérénité. Des journées plus légères. Moins de stress inutile. Et cette tranquillité d'esprit qui permet simplement de profiter davantage de la vie.\n\nJe te souhaite de rencontrer de belles personnes. Des personnes sincères. Des personnes qui sauront voir ta valeur, respecter qui tu es et apporter quelque chose de positif dans ta vie.\n\nEt surtout... Je te souhaite une très bonne santé. Vraiment. J'espère que cette nouvelle année sera plus douce pour toi sur ce plan-là aussi.`,
    },
    {
      heading: 'Les rêves et la suite',
      body: `Je te souhaite aussi de voir certaines de tes envies devenir réalité.\n\nQue les choses auxquelles tu penses aujourd'hui prennent peu à peu forme. Que tu oses essayer. Que tu oses recommencer. Que tu oses parfois changer de direction si la route que tu suivais ne te convient plus.\n\nTu n'es pas obligée d'avoir toute la carte du monde avant de commencer à avancer.\n\nParfois, il suffit simplement de faire un pas. Puis un autre. Puis de regarder derrière soi en se demandant comment on a réussi à arriver aussi loin.`,
    },
    {
      heading: null,
      body: `J'espère sincèrement que cette nouvelle année sera belle pour toi.\n\nQu'elle t'apportera de beaux souvenirs. De bons moments. De belles surprises. Des personnes qui sauront prendre soin de toi.\n\nEt suffisamment de bonheur pour que, lorsque tu repenseras à cette année plus tard, tu puisses sourire et te dire :\n\n« Oui... Celle-là, elle valait vraiment le coup. »\n\nAlors profite de ta journée. Profite des gens qui t'aiment. Profite des petits moments qui font du bien.\n\nEt surtout...\n\nN'oublie jamais que tu es une personne précieuse. Tu as une place particulière dans la vie de certaines personnes.\n\nEt même si on ne te le rappelle pas tous les jours...\n\nÇa ne change rien à la valeur que tu as.\n\nJoyeux anniversaire, Caramel.\n\nJe te souhaite sincèrement le meilleur. Et beaucoup de belles choses pour la suite.`,
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
              <p key={pi} style={{ color: 'var(--brown)', lineHeight: 1.82, fontSize: '0.92rem', margin: '0 0 14px', whiteSpace: 'pre-line' }}>
                {para}
              </p>
            ))}
          </div>
        ))}
        <div style={{ textAlign: 'right', paddingTop: 16, borderTop: '1px solid rgba(247,197,110,0.2)' }}>
          <p className="font-serif" style={{ color: 'var(--brown)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: 8 }}>
            Avec toute mon affection,
          </p>
          <p className="font-script" style={{ color: 'var(--gold-dark)', fontSize: '2rem', lineHeight: 1.2, margin: 0, animation: 'signatureReveal 1.2s 0.5s ease both' }}>
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
      <div style={{
        maxWidth: 640, width: '100%',
        opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <i className="fa-solid fa-envelope-open-text" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: 16, display: 'block', opacity: 0.8 }} />
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--brown)', fontStyle: 'italic', margin: '0 0 12px' }}>
            Une lettre pour toi
          </h2>
          <p className="font-serif" style={{ color: 'var(--brown-light)', fontStyle: 'italic', fontSize: '0.95rem', margin: 0 }}>
            Parce que certaines choses sont parfois plus faciles à écrire qu'à dire.
          </p>
        </div>

        {/* Envelope visual */}
        <div className="envelope-wrapper" style={{ position: 'relative', marginBottom: 32 }}>
          {/* Envelope body */}
          <div style={{
            position: 'relative',
            background: 'rgba(255,249,240,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(247,197,110,0.4)',
            borderRadius: 16,
            overflow: 'visible',
            boxShadow: '0 8px 48px rgba(122,78,58,0.12), 0 2px 8px rgba(247,197,110,0.15)',
          }}>
            {/* Envelope flap (top triangle) */}
            <div
              className={`envelope-flap${state !== 'closed' ? ' is-open' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 120,
                background: 'linear-gradient(160deg, rgba(247,220,170,0.9) 0%, rgba(247,197,110,0.7) 100%)',
                zIndex: state === 'open' ? 0 : 3,
                borderRadius: '16px 16px 0 0',
                clipPath: 'polygon(0 0, 100% 0, 50% 80%)',
              }}
            />

            {/* Envelope inner (V shape from bottom) */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0, height: 120,
              background: 'linear-gradient(to top, rgba(247,220,160,0.5), transparent)',
              clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
              borderRadius: '0 0 16px 16px',
              zIndex: 1,
            }} />

            {/* Envelope content */}
            {state !== 'open' ? (
              <div style={{ position: 'relative', zIndex: 2, padding: '130px 40px 60px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(247,197,110,0.2)', border: '1px solid rgba(247,197,110,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <i className="fa-solid fa-heart" style={{ color: 'var(--gold-dark)', fontSize: '1rem' }} />
                </div>
                <p className="font-serif" style={{ color: 'var(--brown)', fontSize: '1rem', fontStyle: 'italic', marginBottom: 28, lineHeight: 1.6 }}>
                  Un message personnel, écrit juste pour toi.
                </p>
                <button
                  onClick={open}
                  disabled={state !== 'closed'}
                  style={{
                    background: 'linear-gradient(135deg, rgba(247,197,110,0.9), rgba(212,168,67,0.85))',
                    border: 'none',
                    borderRadius: 40,
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    padding: '13px 32px',
                    cursor: state === 'closed' ? 'pointer' : 'default',
                    boxShadow: '0 4px 20px rgba(247,197,110,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(247,197,110,0.55)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(247,197,110,0.4)' }}
                >
                  <i className={`fa-solid ${state === 'opening' ? 'fa-envelope-open' : 'fa-envelope-open-text'}`} />
                  {state === 'opening' ? 'Ouverture...' : 'Ouvrir la lettre'}
                </button>
              </div>
            ) : (
              /* Open state: show letter */
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

/* ─── WISHES SECTION ─── */
const WISHES = [
  { icon: 'fa-heart-pulse', title: 'Une bonne santé', text: "Avant toute chose, je te souhaite une santé plus douce et plus stable. De l'énergie pour profiter de tout ce qui t'attend, et surtout moins de moments où ton corps décide de compliquer le scénario." },
  { icon: 'fa-face-smile-beam', title: 'Du bonheur', text: "Le vrai. Celui qui arrive parfois dans des petits moments tout simples et qui, sans prévenir, rend une journée bien meilleure." },
  { icon: 'fa-star', title: 'De la réussite', text: "Dans tes projets, dans tes envies, dans tout ce que tu entreprendras. Que tes efforts portent leurs fruits et que tu puisses en être fière." },
  { icon: 'fa-compass', title: 'Des aventures', text: "Des découvertes, des expériences inattendues, des endroits que tu n'avais pas prévu de visiter, et suffisamment de nouvelles histoires pour avoir de quoi me raconter tout ça après." },
  { icon: 'fa-feather', title: 'De la sérénité', text: "Des journées plus légères, moins de stress inutile, et cette tranquillité d'esprit qui permet simplement de profiter davantage de la vie." },
  { icon: 'fa-handshake-heart', title: 'De la sincérité', text: "De belles personnes autour de toi. Des personnes sincères qui sauront voir ta valeur, respecter qui tu es et apporter quelque chose de positif dans ta vie." },
  { icon: 'fa-moon', title: 'Tes rêves', text: "Que les choses auxquelles tu penses aujourd'hui prennent peu à peu forme. Que tu oses essayer. Que tu oses recommencer. Un pas à la fois suffit." },
  { icon: 'fa-sun', title: 'Les petits bonheurs', text: "Ces petites choses qui, sur le moment, semblent complètement normales. Mais qui, avec le temps, prennent une place particulière et qu'on garde précieusement." },
  { icon: 'fa-gift', title: 'Un dernier vœu', text: "Que cette année soit vraiment belle pour toi. Que tu puisses te dire, en la regardant dans le rétroviseur : « Oui. Celle-là, elle valait vraiment le coup. »", special: true },
]

function WishCard({ wish, index }: { wish: typeof WISHES[0]; index: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(28px) scale(0.96)',
        transition: `opacity 0.7s ${index * 0.07}s ease, transform 0.7s ${index * 0.07}s ease`,
      }}
    >
      <div
        className="glass-card-light"
        style={{
          padding: '28px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          border: (wish as any).special ? '1px solid rgba(247,197,110,0.6)' : undefined,
          boxShadow: (wish as any).special ? '0 8px 40px rgba(247,197,110,0.15), 0 0 0 1px rgba(247,197,110,0.2)' : undefined,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = (wish as any).special
            ? '0 16px 56px rgba(247,197,110,0.25), 0 0 0 1px rgba(247,197,110,0.35)'
            : '0 12px 40px rgba(122,78,58,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = (wish as any).special
            ? '0 8px 40px rgba(247,197,110,0.15), 0 0 0 1px rgba(247,197,110,0.2)'
            : ''
        }}
      >
        {(wish as any).special && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle, rgba(247,197,110,0.25) 0%, transparent 70%)', borderRadius: '0 20px 0 100%' }} />
        )}
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(247,197,110,0.15)', border: '1px solid rgba(247,197,110,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`fa-solid ${wish.icon}`} style={{ color: 'var(--gold-dark)', fontSize: '1rem' }} />
        </div>
        <h3 className="font-display" style={{ color: 'var(--brown)', fontSize: '1.05rem', fontStyle: 'italic', margin: 0, fontWeight: 600 }}>
          {wish.title}
        </h3>
        <p className="font-serif" style={{ color: 'var(--brown)', lineHeight: 1.75, fontSize: '0.88rem', margin: 0, flex: 1 }}>
          {wish.text}
        </p>
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

/* ─── FAKE END SECTION ─── */
function FakeEndSection({ onSurprise }: { onSurprise: () => void }) {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px, 12vw, 140px) 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(32px)', transition: 'opacity 1s ease, transform 1s ease' }}>
        <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', margin: '0 auto 40px' }} />
        <p className="font-display" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--brown)', fontStyle: 'italic', marginBottom: 20 }}>
          Tu pensais que c'était terminé ?
        </p>
        <p className="font-serif" style={{ color: 'var(--brown-light)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 40 }}>
          Évidemment non. Il reste une dernière chose.
        </p>
        <button
          onClick={onSurprise}
          style={{
            background: 'transparent',
            border: '1px solid rgba(247,197,110,0.6)',
            borderRadius: 50,
            color: 'var(--brown)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            padding: '13px 36px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            backdropFilter: 'blur(12px)',
            transition: 'background 0.3s, box-shadow 0.3s, transform 0.3s',
          }}
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

/* ─── CONFETTI CANVAS ─── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#F7C56E', '#F0D8D0', '#E8BFB3', '#D4A843', '#FFF9F0', '#f28b8b', '#b8e0d4']
    const pieces = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 4,
      h: Math.random() * 14 + 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 3.5 + 1.5,
      spin: (Math.random() - 0.5) * 0.15,
      angle: Math.random() * Math.PI * 2,
      sway: Math.random() * 2 - 1,
      swaySpeed: Math.random() * 0.03 + 0.01,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016
      pieces.forEach((p) => {
        p.y += p.speed
        p.angle += p.spin
        p.x += Math.sin(t * p.swaySpeed * 10) * p.sway
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width }
        ctx.save()
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.85
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', handleResize) }
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    />
  )
}

/* ─── GRAND FINALE ─── */
function GrandFinale() {
  const [celebrate, setCelebrate] = useState(false)
  const [showSig, setShowSig] = useState(false)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setShowSig(true), 3800)
      return () => clearTimeout(t)
    }
  }, [inView])

  const handleCelebrate = () => {
    setCelebrate(true)
    setTimeout(() => setShowSig(true), 1000)
  }

  return (
    <>
      <ConfettiCanvas active={celebrate} />
      <section ref={ref} style={{ position: 'relative', zIndex: 3, padding: 'clamp(80px, 12vw, 140px) 24px 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(32px)', transition: 'opacity 1s ease, transform 1s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
            {['fa-cake-candles', 'fa-champagne-glasses', 'fa-star', 'fa-heart', 'fa-sparkles'].map((icon, i) => (
              <i key={icon} className={`fa-solid ${icon}`} style={{ color: 'var(--gold)', fontSize: 'clamp(1rem, 3vw, 1.5rem)', opacity: 0.8, animation: `starFloat ${2.2 + i * 0.3}s ${i * 0.2}s ease-in-out infinite` }} />
            ))}
          </div>
          <h2 className="font-display text-shimmer" style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', lineHeight: 1.15, marginBottom: 24 }}>
            Joyeux Anniversaire,<br />Caramel !
          </h2>
          <p className="font-serif" style={{ color: 'var(--brown)', lineHeight: 1.8, fontSize: '1rem', fontStyle: 'italic', marginBottom: 40 }}>
            Profite de cette belle journée. Profite des gens qui t'aiment.<br />
            Et surtout, profite de toi.
          </p>

          {!celebrate ? (
            <button
              onClick={handleCelebrate}
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                border: 'none',
                borderRadius: 50,
                color: 'white',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '16px 44px',
                cursor: 'pointer',
                boxShadow: '0 6px 32px rgba(247,197,110,0.45)',
                display: 'inline-flex', alignItems: 'center', gap: 12,
                transition: 'transform 0.2s, box-shadow 0.2s',
                animation: 'glowPulse 3s ease-in-out infinite',
              }}
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

          {showSig && (
            <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid rgba(247,197,110,0.2)', animation: 'fadeIn 1.2s ease' }}>
              <p className="font-script" style={{ color: 'var(--gold-dark)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', lineHeight: 1.4, marginBottom: 8, animation: 'signatureReveal 1.5s ease' }}>
                Fait avec amour par ton démon préféré.
              </p>
              <p className="font-ui" style={{ color: 'rgba(122,78,58,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                — avec tout ce qui compte
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* ─── MAIN PHASE 2 EXPORT ─── */
export default function Phase2() {
  const [showSurprise, setShowSurprise] = useState(false)

  return (
    <div className="phase2-bg" style={{ position: 'relative', minHeight: '100vh' }}>
      <FloatingParticles />
      <AudioController />
      <HeroSection />
      <VisualBreakSection />
      <EnvelopeSection />
      <WishesSection />
      <FakeEndSection onSurprise={() => { setShowSurprise(true); setTimeout(() => document.getElementById('grand-finale')?.scrollIntoView({ behavior: 'smooth' }), 100) }} />
      <div id="grand-finale">
        {showSurprise && <GrandFinale />}
      </div>
    </div>
  )
}
