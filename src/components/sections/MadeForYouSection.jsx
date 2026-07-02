import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper, { Wrap } from '../layout/SectionWrapper'
import Reveal from '../layout/Reveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { copy } from '../../data/copy'

// Section 5 — Made Especially for You. Maps reference/index.html #s5 (l. 648–670).
// The loading bar animates once when the section scrolls into view (l. 814–836).
export default function MadeForYouSection() {
  const s5 = copy.s5
  const reduced = useReducedMotion()
  const laptopRef = useRef(null)
  const inView = useInView(laptopRef, { once: true, amount: 0.25 })

  const [progress, setProgress] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const dur = reduced ? 600 : 2300

    const step = (now) => {
      const k = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - k, 2)
      setProgress(Math.round(eased * 100))
      setStatusIdx(Math.min(s5.statuses.length - 1, Math.floor(eased * s5.statuses.length)))
      if (k < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setDone(true)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, s5.statuses.length])

  return (
    <SectionWrapper
      id="s5"
      pageTab={{ label: s5.pageTab }}
      bg={{ background: 'linear-gradient(180deg, #F3FBFF 0%, #FFF7F0 100%)' }}
    >
      <Wrap>
        <div className="made-inner mx-auto max-w-[640px] text-center">
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800 }}>
              {s5.h2}
            </h2>
          </Reveal>
          <Reveal d={1}>
            <p className="mt-3.5" style={{ color: 'var(--color-text-soft)', fontSize: 'clamp(16px,2.2vw,18px)' }}>
              {s5.body}
            </p>
          </Reveal>

          <motion.div
            ref={laptopRef}
            className="laptop relative mx-auto mt-[34px]"
            style={{
              maxWidth: '440px',
              background: '#1c1430',
              borderRadius: '16px 16px 8px 8px',
              padding: '16px 14px 22px',
              boxShadow: 'var(--shadow-card)',
              opacity: 0,
              y: 26,
            }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="screen text-left" style={{ background: '#120C22', borderRadius: '10px', padding: '20px 18px', color: '#E8DEF8' }}>
              <div className="dots mb-3.5 flex gap-1.5">
                <i className="h-[9px] w-[9px] rounded-full" style={{ background: '#3a2c55' }} />
                <i className="h-[9px] w-[9px] rounded-full" style={{ background: '#3a2c55' }} />
                <i className="h-[9px] w-[9px] rounded-full" style={{ background: '#3a2c55' }} />
              </div>
              <div className="load-label" style={{ fontFamily: "'Patrick Hand', monospace", color: '#FFD6E0', fontSize: '15px' }}>
                {s5.loadLabel}
              </div>
              <div
                className="progress my-2.5 h-3.5 overflow-hidden rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                <i
                  className="block h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    transition: 'width .18s linear',
                  }}
                />
              </div>
              <div className="progress-row flex justify-between" style={{ fontFamily: 'var(--font-hand)', fontSize: '15px', color: '#CBB9EC' }}>
                <span />
                <span>{progress}%</span>
              </div>
              <div className="status mt-2" style={{ fontFamily: 'var(--font-hand)', color: '#FFE7B0', fontSize: '16px', minHeight: '22px' }}>
                {done ? s5.finalStatus : s5.statuses[statusIdx]}
              </div>
              <span
                className="done-tag mt-2.5 inline-flex items-center gap-2"
                style={{
                  display: done ? 'inline-flex' : 'none',
                  color: '#8EE6A8',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {s5.done}
              </span>
            </div>
          </motion.div>
        </div>
      </Wrap>
    </SectionWrapper>
  )
}
