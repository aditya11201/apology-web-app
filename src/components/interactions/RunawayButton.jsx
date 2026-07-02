import { useCallback, useEffect, useRef, useState } from 'react'
import { useRunaway } from '../../hooks/useRunaway'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { clampPos, farPoint, pickInitial, toTransform } from '../../lib/geometry'
import { copy } from '../../data/copy'

// The ngambek button that flees inside a safe arena, then inflates and pops.
// Ports reference/index.html (l. 438–521, 853–977) to React + the tested
// geometry helpers. The button is clamped to .roam and can never leave it
// (RISK-03), enforced by lib/geometry + verified by tests.

const FLEE_RADIUS = 120
const ROAM_PAD = 12

export default function RunawayButton() {
  const reduced = useReducedMotion()
  const { phase, tryFlee } = useRunaway({ maxAttempts: 5, cooldown: 360, resetAfter: 3600 })

  const roamRef = useRef(null)
  const wrapRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [showFunny, setShowFunny] = useState(false)
  const [burst, setBurst] = useState(null) // { cx, cy } when popping starts
  const finePointer =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

  // Read arena + button dimensions into the geometry-helpers' arena shape.
  const arena = useCallback(() => {
    const roam = roamRef.current
    const wrap = wrapRef.current
    return {
      rw: roam?.clientWidth || 0,
      rh: roam?.clientHeight || 0,
      bw: wrap?.offsetWidth || 0,
      bh: wrap?.offsetHeight || 0,
      pad: ROAM_PAD,
    }
  }, [])

  const applyPos = useCallback(
    (p) => {
      setPos(p)
    },
    [],
  )

  const placeInitial = useCallback(() => {
    const wrap = wrapRef.current
    if (wrap) wrap.style.transition = 'none'
    const p = pickInitial(arena())
    applyPos(p)
    // reflow then re-enable transition
    if (wrap) {
      // eslint-disable-next-line no-unused-expressions
      wrap.offsetWidth
      wrap.style.transition = ''
    }
  }, [arena, applyPos])

  useEffect(() => {
    placeInitial()
  }, [placeInitial])

  // Re-center on resize (l. 977), but not mid-pop.
  useEffect(() => {
    const onResize = () => {
      if (phase !== 'popping') placeInitial()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [phase, placeInitial])

  // One dodge — wraps tryFlee with geometry + position application.
  const flee = useCallback(
    (px, py) => {
      const result = tryFlee()
      if (result === 'popping') {
        return
      }
      const p = farPoint(px, py, arena())
      applyPos(p)
    },
    [tryFlee, arena, applyPos],
  )

  // When the hook flips to 'popping', fire the balloon sequence.
  useEffect(() => {
    if (phase !== 'popping') {
      setShowFunny(false)
      setBurst(null)
      return
    }
    // After the inflate animation (0.9s), spawn the burst + gag.
    const burstTimer = setTimeout(() => {
      const wrap = wrapRef.current
      const rect = wrap?.getBoundingClientRect()
      if (rect) {
        setBurst({ cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 })
      }
      setShowFunny(true)
    }, 900)
    // Reset burst visual after shards settle.
    const cleanup = setTimeout(() => setBurst(null), 1900)
    return () => {
      clearTimeout(burstTimer)
      clearTimeout(cleanup)
    }
  }, [phase])

  // Re-place initial when returning to idle after a pop.
  useEffect(() => {
    if (phase === 'idle') placeInitial()
  }, [phase, placeInitial])

  // Pointer handlers (l. 914–931).
  const onArenaPointerMove = (ev) => {
    if (phase === 'popping' || !finePointer || reduced) return
    const roam = roamRef.current
    const wrap = wrapRef.current
    if (!roam || !wrap) return
    const r = roam.getBoundingClientRect()
    const wr = wrap.getBoundingClientRect()
    const bx = wr.left - r.left + wr.width / 2
    const by = wr.top - r.top + wr.height / 2
    if (Math.hypot(ev.clientX - r.left - bx, ev.clientY - r.top - by) < FLEE_RADIUS) {
      flee(ev.clientX - r.left, ev.clientY - r.top)
    }
  }

  const onButtonPointerDown = (ev) => {
    const roam = roamRef.current
    if (!roam) return
    const r = roam.getBoundingClientRect()
    flee(ev.clientX - r.left, ev.clientY - r.top)
  }

  const onButtonClick = () => flee()

  return (
    <div
      ref={roamRef}
      className="roam relative w-full"
      style={{ minHeight: 'clamp(168px, 26vh, 240px)' }}
      onPointerMove={onArenaPointerMove}
    >
      <button
        ref={wrapRef}
        type="button"
        className="ngambek-wrap absolute left-1/2 top-0 border-none bg-transparent p-0"
        style={{
          transform: toTransform(pos.x, pos.y, arena()),
          transition: 'transform .42s cubic-bezier(.16,1,.3,1)',
          zIndex: 3,
          visibility: phase === 'popping' && showFunny ? 'hidden' : 'visible',
        }}
        onPointerDown={onButtonPointerDown}
        onClick={onButtonClick}
      >
        <span
          className="ngambek-face inline-flex items-center justify-center text-center"
          style={
            phase === 'popping'
              ? balloonFaceStyle
              : {
                  background: '#fff',
                  color: 'var(--color-text)',
                  border: '2px solid var(--color-line)',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: 'clamp(14px,2vw,16px)',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  maxWidth: '86vw',
                  transition: 'background .3s, color .3s, border-color .3s, box-shadow .2s, transform .12s',
                }
          }
        >
          {copy.s6.ngambek}
        </span>
      </button>

      {showFunny && (
        <div
          className="funny absolute left-1/2 top-1/2 w-[86%] text-center"
          style={{
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            color: 'var(--color-text)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            fontFamily: 'var(--font-hand)',
            fontSize: 'clamp(16px,2.4vw,20px)',
          }}
        >
          {copy.s6.funny}
        </div>
      )}

      {burst && <Burst cx={burst.cx} cy={burst.cy} />}
    </div>
  )
}

// Balloon silhouette during inflate (reference .ngambek-face.popping, l. 461–481).
const balloonFaceStyle = {
  position: 'relative',
  background: 'radial-gradient(circle at 30% 25%, #FFCADB, var(--color-btn) 64%)',
  color: '#fff',
  border: 'none',
  borderRadius: '48% 48% 50% 50% / 44% 44% 58% 58%',
  boxShadow:
    'inset -5px -7px 12px rgba(150,20,60,0.12), inset 4px 5px 10px rgba(255,255,255,0.45), 0 12px 22px -12px rgba(255,92,138,0.7)',
  animation: 'balloonInflate .9s cubic-bezier(0.22,1,0.36,1) forwards',
  fontFamily: 'var(--font-head)',
  fontWeight: 600,
  fontSize: 'clamp(14px,2vw,16px)',
  padding: '12px 20px',
}

// Pop flash + rubber shards (reference spawnBurst, l. 950–974).
function Burst({ cx, cy }) {
  const colors = ['#FF5C8A', '#FF8FAB', '#FFB3C6', '#B388EB', '#FFD6E0']
  const n = 20
  const shards = Array.from({ length: n }, (_, i) => {
    const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.5
    const dist = 52 + Math.random() * 72
    return {
      id: i,
      color: colors[i % colors.length],
      bx: Math.cos(ang) * dist,
      by: Math.sin(ang) * dist,
      rot: Math.random() * 540 - 270,
      dur: 0.6 + Math.random() * 0.35,
    }
  })

  return (
    <>
      <span
        className="pop-flash pointer-events-none fixed h-[34px] w-[34px] rounded-full"
        style={{
          left: `${cx}px`,
          top: `${cy}px`,
          transform: 'translate(-50%,-50%) scale(.2)',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,143,171,0.55) 58%, transparent 72%)',
          animation: 'popFlash .36s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
      />
      {shards.map((s) => (
        <span
          key={s.id}
          className="shard pointer-events-none fixed h-[17px] w-[17px]"
          style={{
            left: `${cx}px`,
            top: `${cy}px`,
            transform: 'translate(-50%,-50%) scale(.5)',
            '--bx': `${s.bx}px`,
            '--by': `${s.by}px`,
            '--rot': `${s.rot}deg`,
            animation: `shardFly ${s.dur}s cubic-bezier(0.18,0.7,0.3,1) forwards`,
          }}
        >
          <svg viewBox="0 0 10 10" className="h-full w-full" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.12))' }}>
            <path d="M1 1 Q7 0 8 5 Q9 9 3 9 Q0 6 1 1 Z" fill={s.color} />
          </svg>
        </span>
      ))}
    </>
  )
}
