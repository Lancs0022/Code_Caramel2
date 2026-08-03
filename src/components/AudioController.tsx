import { useState, useRef, useEffect } from 'react'

interface Props {
  autoPlay?: boolean
}

export default function AudioController({ autoPlay = false }: Props) {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 600)
  }, [])

  const playTone = () => {
    try {
      const ctx = new AudioContext()
      ctxRef.current = ctx
      const gain = ctx.createGain()
      gainRef.current = gain
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5)
      gain.connect(ctx.destination)

      const play = (freq: number, offset: number, duration: number) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        g.gain.setValueAtTime(0, ctx.currentTime + offset)
        g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + offset + 0.4)
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + offset + duration)
        osc.connect(g)
        g.connect(ctx.destination)
        osc.start(ctx.currentTime + offset)
        osc.stop(ctx.currentTime + offset + duration + 0.1)
      }

      const loop = () => {
        const notes = [261.63, 329.63, 392.0, 523.25, 659.25]
        notes.forEach((freq, i) => play(freq, i * 1.2, 2.5))
        setTimeout(loop, notes.length * 1200 + 1000)
      }
      loop()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const stopTone = () => {
    try {
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.5)
        setTimeout(() => ctxRef.current?.close(), 600)
      }
      ctxRef.current = null
      gainRef.current = null
    } catch {}
    setPlaying(false)
  }

  const toggle = () => {
    if (playing) {
      stopTone()
    } else {
      playTone()
    }
  }

  return (
    <button
      onClick={toggle}
      title={playing ? 'Couper la musique' : 'Jouer la musique'}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 500,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid rgba(247,197,110,0.4)',
        background: 'rgba(255,249,240,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(122,78,58,0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7A4E3A',
        fontSize: '0.85rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <i className={`fa-solid ${playing ? 'fa-volume-high' : 'fa-volume-xmark'}`} />
    </button>
  )
}
