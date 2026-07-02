import { useEffect, useState } from 'react'
import { Heart } from '../../lib/svg'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Heart confetti for the forgiveness climax.
// Ports index.html fireConfetti() (l. 992–1010) + .confetti-heart (l. 501–507).
//
// `fire` is a boolean: when it flips to true, a burst of hearts is generated.
// Each heart auto-removes after its animation completes (~5s).
const COLORS = ['#FF8FAB', '#FF5C8A', '#B388EB', '#FFD6E0', '#FFB3C6', '#FFFFFF']

export default function ConfettiHearts({ fire }) {
  const reduced = useReducedMotion()
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    if (!fire) return
    const n = reduced ? 18 : 70
    const batch = Array.from({ length: n }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      size: 9 + Math.random() * 15,
      left: 5 + Math.random() * 90,
      top: -10 - Math.random() * 15,
      dx: (Math.random() - 0.5) * 240,
      rot: Math.random() * 720 - 360,
      duration: 2.6 + Math.random() * 2.6,
      delay: Math.random() * 0.5,
      color: COLORS[i % COLORS.length],
    }))
    setHearts(batch)

    // Clean up after the longest-running heart settles.
    const maxLife = Math.max(...batch.map((h) => h.duration + h.delay)) * 1000 + 500
    const t = setTimeout(() => setHearts([]), Math.max(maxLife, 5000))
    return () => clearTimeout(t)
  }, [fire, reduced])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="confetti-heart absolute"
          style={{
            top: `${h.top}%`,
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            '--dx': `${h.dx}px`,
            '--rot': `${h.rot}deg`,
            animation: `confettiFall ${h.duration}s linear forwards`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <Heart color={h.color} />
        </span>
      ))}
    </div>
  )
}
