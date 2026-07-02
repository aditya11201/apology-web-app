import { useCallback, useEffect, useRef, useState } from 'react'

// Encapsulates the runaway-button lifecycle (reference l. 858–949):
//   - tryFlee() increments `attempts`, one per cooldown window.
//   - Once attempts exceed maxAttempts, phase flips to 'popping' (balloon pop).
//   - After resetAfter ms in 'popping', it auto-resets to 'idle' (attempts=0).
//
// This hook owns ONLY the state machine; the geometry + DOM wiring live in
// RunawayButton.jsx. That separation is what makes the cooldown/pop/reset
// behavior unit-testable without a DOM.
//
// Defaults match reference: ATTEMPT_COOLDOWN=360ms, pop reset ~3600ms, >5 tries.
export function useRunaway({ maxAttempts = 5, cooldown = 360, resetAfter = 3600 } = {}) {
  const [attempts, setAttempts] = useState(0)
  const [phase, setPhase] = useState('idle') // 'idle' | 'popping'

  const lastAttemptAt = useRef(0)
  const resetTimer = useRef(null)

  const reset = useCallback(() => {
    setAttempts(0)
    setPhase('idle')
    lastAttemptAt.current = 0
    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }
  }, [])

  // tryFlee returns the new phase so the caller can react synchronously.
  const tryFlee = useCallback(() => {
    if (phase === 'popping') return phase

    const now = performance.now()
    if (now - lastAttemptAt.current < cooldown) return phase
    lastAttemptAt.current = now

    const next = attempts + 1
    setAttempts(next)

    if (next > maxAttempts) {
      setPhase('popping')
      // Auto-reset after the gag has played (reference l. 942–948).
      resetTimer.current = setTimeout(() => {
        setAttempts(0)
        setPhase('idle')
        lastAttemptAt.current = 0
        resetTimer.current = null
      }, resetAfter)
    }
    return next > maxAttempts ? 'popping' : 'idle'
  }, [attempts, phase, cooldown, maxAttempts, resetAfter])

  // Clean up the reset timer on unmount.
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  return { attempts, phase, tryFlee, reset }
}
