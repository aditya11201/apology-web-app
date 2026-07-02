import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper, { Wrap } from '../layout/SectionWrapper'
import Reveal from '../layout/Reveal'
import StarsLayer from '../decorative/StarsLayer'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { scrollToSel } from '../../lib/scroll'
import { copy, GIFS } from '../../data/copy'

// Section 4 — Overthinking Last Night. Maps reference/index.html #s4 (l. 623–645).
// Night-themed background, blinking stars, staggered thought bubbles, GIF, CTA.
export default function OverthinkingSection() {
  const s4 = copy.s4
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })

  const [shownThoughts, setShownThoughts] = useState(0)

  useEffect(() => {
    if (!inView) return
    const timers = s4.thoughts.map((_, idx) =>
      setTimeout(() => setShownThoughts(idx + 1), reduced ? 60 * idx + 60 : 700 * idx + 300),
    )
    return () => timers.forEach(clearTimeout)
  }, [inView, reduced, s4.thoughts])

  return (
    <SectionWrapper
      id="s4"
      pageTab={{ label: s4.pageTab, variant: 'night' }}
      bg={{
        background:
          'radial-gradient(120% 80% at 70% 0%, #2C1A47 0%, transparent 60%),' +
          'linear-gradient(180deg, var(--color-night-1), var(--color-night-2) 60%, var(--color-night-3))',
        color: '#F4ECFF',
      }}
    >
      <div ref={sectionRef} className="contents" />
      <StarsLayer />

      <Wrap>
        <div className="night-inner relative z-[1] mx-auto max-w-[680px] text-center">
          <Reveal>
            <svg className="moon mx-auto mb-3.5 h-16 w-16" viewBox="0 0 24 24" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 18px rgba(255,231,176,0.6))' }}>
              <path fill="#FFE7B0" d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 1 0 9.8 9.8z" />
            </svg>
          </Reveal>

          <Reveal>
            <h2 className="font-bold text-white" style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(24px,4.4vw,36px)' }}>
              {s4.h2}
            </h2>
          </Reveal>

          <Reveal d={1}>
            <p className="mt-3.5" style={{ color: '#D9CCF2', fontSize: 'clamp(16px,2.2vw,18px)', whiteSpace: 'pre-line' }}>
              {s4.body}
            </p>
          </Reveal>

          <div className="thoughts mt-[30px] flex flex-col items-center gap-3.5">
            {s4.thoughts.map((t, idx) => {
              const isEven = idx % 2 === 1 // nth-child(even) in CSS is 1-indexed
              const shown = idx < shownThoughts
              return (
                <motion.div
                  key={idx}
                  className="thought relative"
                  initial={{ opacity: 0, y: 12 }}
                  animate={shown ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'rgba(255,255,255,0.94)',
                    color: 'var(--color-text)',
                    padding: '13px 22px',
                    borderRadius: '24px',
                    maxWidth: '80%',
                    fontSize: 'clamp(15px,2.2vw,17px)',
                    boxShadow: '0 14px 30px -18px rgba(0,0,0,0.6)',
                    alignSelf: isEven ? 'flex-end' : 'center',
                  }}
                >
                  {t}
                </motion.div>
              )
            })}
          </div>

          <Reveal d={3}>
            <div className="scene scene--media mx-auto mt-3.5" role="img" aria-label="Adit belum bisa tidur, overthinking soal kamu">
              <img
                src={GIFS.overthinking}
                alt={s4.gifAlt}
                loading="lazy"
                style={{
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 18px 40px -26px rgba(0,0,0,0.6)',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </Reveal>

          <Reveal d={4}>
            <div style={{ marginTop: '30px' }}>
              <button
                className="cta inline-flex items-center gap-2.5 rounded-full border-none px-7 py-4 font-bold text-white"
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 'clamp(17px, 2.4vw, 20px)',
                  background: 'var(--color-btn)',
                  boxShadow: '0 18px 34px -16px rgba(255,92,138,0.85)',
                  cursor: 'pointer',
                }}
                onClick={() => scrollToSel('#s5', reduced)}
              >
                {s4.cta} <span className="arr">→</span>
              </button>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </SectionWrapper>
  )
}
