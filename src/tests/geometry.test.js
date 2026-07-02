import { describe, it, expect } from 'vitest'
import { clampPos, farPoint } from '../lib/geometry'

// RISK-03 is the core guarantee these tests lock down: the runaway button
// can never be placed outside the .roam arena, no matter the pointer input.

describe('clampPos', () => {
  const arena = { rw: 300, rh: 200, bw: 80, bh: 40, pad: 12 }

  it('keeps a centered point inside the arena', () => {
    const p = clampPos(120, 80, arena)
    expect(p.x).toBeGreaterThanOrEqual(12)
    expect(p.y).toBeGreaterThanOrEqual(12)
    expect(p.x).toBeLessThanOrEqual(300 - 80 - 12)
    expect(p.y).toBeLessThanOrEqual(200 - 40 - 12)
  })

  it('clamps an out-of-bounds point back inside', () => {
    const p = clampPos(-50, 9999, arena)
    expect(p.x).toBe(12)
    expect(p.y).toBe(200 - 40 - 12)
  })

  it('clamps negative coordinates to the pad', () => {
    const p = clampPos(-100, -100, arena)
    expect(p.x).toBe(12)
    expect(p.y).toBe(12)
  })
})

describe('farPoint', () => {
  const arena = { rw: 300, rh: 200, bw: 80, bh: 40, pad: 12 }

  it('returns the corner farthest from a top-left pointer', () => {
    const p = farPoint(0, 0, arena)
    expect(p.x).toBeGreaterThan(120)
    expect(p.y).toBeGreaterThan(80)
  })

  // The critical property test: brute-force every plausible pointer position
  // and assert the returned point is always within bounds.
  it('ALWAYS returns an in-bounds point for any pointer position', () => {
    for (let px = -40; px <= 340; px += 30) {
      for (let py = -40; py <= 240; py += 30) {
        const p = farPoint(px, py, arena)
        expect(p.x).toBeGreaterThanOrEqual(12)
        expect(p.x).toBeLessThanOrEqual(300 - 80 - 12)
        expect(p.y).toBeGreaterThanOrEqual(12)
        expect(p.y).toBeLessThanOrEqual(200 - 40 - 12)
      }
    }
  })

  it('handles a tiny arena where button nearly fills it', () => {
    const tiny = { rw: 100, rh: 60, bw: 70, bh: 40, pad: 12 }
    const p = farPoint(50, 30, tiny)
    // Upper bounds use max(pad, ...) like the implementation (l. 867–868):
    // when the button nearly fills the arena, the valid range collapses to [pad, pad].
    const maxX = Math.max(12, 100 - 70 - 12)
    const maxY = Math.max(12, 60 - 40 - 12)
    expect(p.x).toBeGreaterThanOrEqual(12)
    expect(p.x).toBeLessThanOrEqual(maxX)
    expect(p.y).toBeGreaterThanOrEqual(12)
    expect(p.y).toBeLessThanOrEqual(maxY)
  })
})
