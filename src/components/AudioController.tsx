import { useState, useRef, useEffect } from 'react'

interface Props {
  autoPlay?: boolean
}

export default function AudioController({ autoPlay = true }: Props) {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600)

    const audio = new Audio('/audio/birthday_song.mp3')
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    if (autoPlay) {
      audio.play()
        .then(() => {
          setPlaying(true)
        })
        .catch((err) => {
          console.warn('Lecture automatique bloquée par le navigateur :', err)
          setPlaying(false)
        })
    }

    return () => {
      clearTimeout(timer)
      audio.pause()
      audioRef.current = null
    }
  }, [autoPlay])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
        .then(() => {
          setPlaying(true)
        })
        .catch((err) => {
          console.error('Erreur lors de la lecture audio :', err)
        })
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

