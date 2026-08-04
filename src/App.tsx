import { useState, useCallback, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import IntroSequence from './components/IntroSequence'
import FlashbangTransition from './components/FlashbangTransition'
import Phase2 from './components/Phase2'
import { preloadAllPhotos } from './utils/preloadImages'

type Phase = 'intro' | 'transitioning' | 'main'

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [flashOrigin, setFlashOrigin] = useState({ x: 50, y: 50 })

  useEffect(() => {
    // Déclenche le préchargement progressif des photos dès l'intro (Phase 1)
    preloadAllPhotos(2)
  }, [])

  const handleReveal = useCallback((origin: { x: number; y: number }) => {
    setFlashOrigin(origin)
    setPhase('transitioning')
  }, [])

  const handleFlashComplete = useCallback(() => {
    setPhase('main')
  }, [])

  return (
    <>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: phase === 'intro' ? 'hidden' : 'auto' }}>
        {/* Phase 1: Intro */}
        {phase === 'intro' && (
          <IntroSequence onReveal={handleReveal} />
        )}

        {/* Phase 2: Main experience — renders during transition so it's ready */}
        {phase !== 'intro' && (
          <div
            style={{
              opacity: phase === 'main' ? 1 : 0,
              transition: 'opacity 0.6s 0.4s ease',
              minHeight: '100vh',
            }}
          >
            <Phase2 />
          </div>
        )}

        {/* Flashbang transition overlay */}
        {phase === 'transitioning' && (
          <FlashbangTransition origin={flashOrigin} onComplete={handleFlashComplete} />
        )}
      </div>
      <Analytics />
    </>
  )
}
