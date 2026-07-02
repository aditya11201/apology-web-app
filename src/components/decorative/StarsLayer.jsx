import { useMemo } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Blinking stars for the night (s4) section.
// Ports index.html star generator (l. 839–851) + .star/.star.big (l. 361–363).
export default function StarsLayer({ count }) {
  const reduced = useReducedMotion()
  const n = count ?? (reduced ? 18 : 46)

  const stars = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        id: i,
        big: Math.random() > 0.8,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: -Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })),
    [n],
  )

  return (
    <div className="stars-layer pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.big ? '5px' : '3px',
            height: s.big ? '5px' : '3px',
            background: 'var(--color-star)',
            boxShadow: '0 0 6px var(--color-star)',
            animation: `twinkle ${s.duration}s infinite cubic-bezier(0.22,1,0.36,1)`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
