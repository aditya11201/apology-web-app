import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRunaway } from '../hooks/useRunaway'

// useRunaway encapsulates the runaway-button lifecycle (reference l. 858–949):
// attempts increment with a cooldown; after maxAttempts it flips to 'popping';
// after resetAfter ms it auto-resets to 'idle' with attempts=0.

describe('useRunaway', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle with zero attempts', () => {
    const { result } = renderHook(() => useRunaway())
    expect(result.current.phase).toBe('idle')
    expect(result.current.attempts).toBe(0)
  })

  it('increments attempts on each tryFlee (cooldowns elapsed)', () => {
    const { result } = renderHook(() => useRunaway({ cooldown: 0 }))
    for (let i = 1; i <= 5; i++) {
      act(() => {
        vi.advanceTimersByTime(1)
        result.current.tryFlee(0, 0)
      })
      expect(result.current.attempts).toBe(i)
      expect(result.current.phase).toBe('idle')
    }
  })

  it('flips to popping on the (maxAttempts+1)-th try', () => {
    const { result } = renderHook(() => useRunaway({ maxAttempts: 5, cooldown: 0 }))
    for (let i = 0; i < 5; i++) {
      act(() => {
        vi.advanceTimersByTime(1)
        result.current.tryFlee(0, 0)
      })
    }
    expect(result.current.phase).toBe('idle')
    // 6th attempt triggers the balloon pop.
    act(() => {
      vi.advanceTimersByTime(1)
      result.current.tryFlee(0, 0)
    })
    expect(result.current.phase).toBe('popping')
    expect(result.current.attempts).toBe(6)
  })

  it('ignores tryFlee while popping', () => {
    const { result } = renderHook(() => useRunaway({ maxAttempts: 1, cooldown: 0 }))
    act(() => {
      vi.advanceTimersByTime(1)
      result.current.tryFlee(0, 0)
    }) // attempt 1
    act(() => {
      vi.advanceTimersByTime(1)
      result.current.tryFlee(0, 0)
    }) // attempt 2 -> popping
    expect(result.current.phase).toBe('popping')
    const attemptsBefore = result.current.attempts
    act(() => {
      vi.advanceTimersByTime(1)
      result.current.tryFlee(0, 0)
    }) // ignored
    expect(result.current.attempts).toBe(attemptsBefore)
    expect(result.current.phase).toBe('popping')
  })

  it('auto-resets to idle after resetAfter ms', () => {
    const { result } = renderHook(() => useRunaway({ maxAttempts: 1, cooldown: 0, resetAfter: 1000 }))
    act(() => {
      vi.advanceTimersByTime(1)
      result.current.tryFlee(0, 0)
    })
    act(() => {
      vi.advanceTimersByTime(1)
      result.current.tryFlee(0, 0)
    })
    expect(result.current.phase).toBe('popping')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.phase).toBe('idle')
    expect(result.current.attempts).toBe(0)
  })

  it('respects cooldown — rapid calls within cooldown do not count', () => {
    // Control performance.now directly so cooldown math is deterministic.
    // Start at a realistic non-zero time (real performance.now() is never 0
    // at runtime, which is what lets lastAttemptAt's initial 0 act as "never").
    const nowSpy = vi.spyOn(performance, 'now')
    let t = 1000
    nowSpy.mockImplementation(() => t)

    const { result } = renderHook(() => useRunaway({ cooldown: 500, maxAttempts: 99 }))
    act(() => result.current.tryFlee(0, 0)) // t=1000, first call counts
    expect(result.current.attempts).toBe(1)

    t = 1100
    act(() => result.current.tryFlee(0, 0)) // within 500ms cooldown — ignored
    expect(result.current.attempts).toBe(1)

    t = 1600
    act(() => result.current.tryFlee(0, 0)) // past cooldown — counts
    expect(result.current.attempts).toBe(2)

    nowSpy.mockRestore()
  })
})
