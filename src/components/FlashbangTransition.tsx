import { useEffect, useState } from 'react'

interface Props {
  origin: { x: number; y: number }
  onComplete: () => void
}

export default function FlashbangTransition({ origin, onComplete }: Props) {
  const [phase, setPhase] = useState<'expand' | 'fade' | 'done'>('expand')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'), 700)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  if (phase === 'done') return null

  const originStr = `${origin.x}% ${origin.y}%`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Bloom/blur halo expanding from origin */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${originStr}, rgba(255,255,255,1) 0%, rgba(255,250,235,0.95) 20%, rgba(255,245,210,0.7) 50%, transparent 80%)`,
          opacity: phase === 'expand' ? 1 : 0,
          transition: phase === 'fade' ? 'opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          clipPath: phase === 'expand'
            ? `circle(200% at ${originStr})`
            : `circle(200% at ${originStr})`,
          animation: phase === 'expand'
            ? `flashExpand 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards`
            : 'none',
        }}
      />

      {/* Secondary warm glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${originStr}, rgba(247,197,110,0.3) 0%, transparent 60%)`,
          opacity: phase === 'expand' ? 1 : 0,
          transition: phase === 'fade' ? 'opacity 0.9s 0.1s ease' : 'none',
          animation: phase === 'expand' ? 'flashExpand 0.8s 0.1s ease forwards' : 'none',
        }}
      />

      <style>{`
        @keyframes flashExpand {
          from { clip-path: circle(0% at ${originStr}); }
          to   { clip-path: circle(200% at ${originStr}); }
        }
      `}</style>
    </div>
  )
}
