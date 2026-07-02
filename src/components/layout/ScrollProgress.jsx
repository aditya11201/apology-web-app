import { useEffect, useRef } from 'react'

// Fixed 3px gradient bar that tracks scroll progress.
// Ported verbatim from index.html #scroll-progress (l. 68–74) +
// rAF-throttled update logic (l. 1014–1027). Transform-only for perf.
export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let ticking = false

    const update = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight || 1
      const p = Math.min(1, Math.max(0, (h.scrollTop || document.body.scrollTop) / max))
      bar.style.transform = `scaleX(${p})`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left scale-x-0"
      style={{
        background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
        boxShadow: '0 0 8px rgba(179,136,235,0.45)',
        pointerEvents: 'none',
      }}
    />
  )
}
