import { useEffect, useState } from 'react'

// Mirrors index.html's reduceMotion check (l. 722) and stays in sync if the
// user toggles the OS preference while the app is open.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  return reduced
}
