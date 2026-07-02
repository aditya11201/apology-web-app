import { useMemo } from 'react'
import { Heart } from '../../lib/svg'

// Ambient floating hearts layer for s1 and s6.
// Ports index.html seedHearts() (l. 757–773) + .heart-float (l. 252–263).
//
// Hearts are seeded once on mount with randomized left/size/duration/delay.
export default function FloatingHearts({ count = 8, colors = ['#FF8FAB', '#FFD6E0', '#B388EB', '#FF5C8A'] }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 12 + Math.random() * 16
        return {
          id: i,
          size,
          left: Math.random() * 100,
          duration: 7 + Math.random() * 7,
          delay: -Math.random() * 10,
          color: colors[i % colors.length],
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count],
  )

  return (
    <div className="hearts-layer pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float absolute -bottom-10 opacity-0"
          style={{
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animation: `floatUp ${h.duration}s linear infinite`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <Heart color={h.color} />
        </span>
      ))}
    </div>
  )
}
