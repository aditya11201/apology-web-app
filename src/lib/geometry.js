// Pure geometry helpers for the runaway button. Ported verbatim from
// reference/index.html (l. 864–900) but DOM-free: callers pass an `arena`
// object instead of reading clientWidth/offsetWidth. This is what makes the
// RISK-03 "button never leaves the arena" guarantee unit-testable.

/**
 * Clamp a desired top-left (x, y) so the whole button stays inside the arena.
 * @param {number} x - desired left
 * @param {number} y - desired top
 * @param {{rw:number,rh:number,bw:number,bh:number,pad:number}} arena
 *   rw,rh = arena (`.roam`) width/height; bw,bh = button width/height; pad = ROAM_PAD
 */
export function clampPos(x, y, arena) {
  const { rw, rh, bw, bh, pad } = arena
  const maxX = Math.max(pad, rw - bw - pad)
  const maxY = Math.max(pad, rh - bh - pad)
  return {
    x: Math.min(Math.max(x, pad), maxX),
    y: Math.min(Math.max(y, pad), maxY),
  }
}

/**
 * Pick the safe corner farthest from (px, py) — maximally evasive.
 * @param {number} px - pointer x within arena
 * @param {number} py - pointer y within arena
 * @param {{rw:number,rh:number,bw:number,bh:number,pad:number}} arena
 */
export function farPoint(px, py, arena) {
  const { rw, rh, bw, bh, pad } = arena
  const candidates = [
    { x: pad, y: pad },
    { x: rw - bw - pad, y: pad },
    { x: pad, y: rh - bh - pad },
    { x: rw - bw - pad, y: rh - bh - pad },
    { x: (rw - bw) / 2, y: (rh - bh) / 2 },
  ].map((c) => clampPos(c.x, c.y, arena))

  let best = candidates[0]
  let bestDist = -1
  candidates.forEach((c) => {
    const d = Math.hypot(c.x + bw / 2 - (px || 0), c.y + bh / 2 - (py || 0))
    if (d > bestDist) {
      bestDist = d
      best = c
    }
  })
  return best
}

/**
 * Initial centered position for the button (top of the arena, horizontally centered).
 * @param {{rw:number,rh:number,bw:number,bh:number,pad:number}} arena
 */
export function pickInitial(arena) {
  const { rw, bw, pad } = arena
  return clampPos((rw - bw) / 2, pad, arena)
}

/**
 * Translate a clamped top-left (x,y) into the CSS transform value used by the
 * button (which is anchored at left:50%). Ported from applyPos (l. 872–875).
 */
export function toTransform(x, y, arena) {
  const { rw } = arena
  return `translate(${x - rw / 2}px, ${y}px)`
}
