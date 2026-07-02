import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper, { Wrap } from '../layout/SectionWrapper'
import Reveal from '../layout/Reveal'
import FloatingHearts from '../decorative/FloatingHearts'
import ConfettiHearts from '../decorative/ConfettiHearts'
import RunawayButton from '../interactions/RunawayButton'
import { Heart } from '../../lib/svg'
import { scrollToSel } from '../../lib/scroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { copy, GIFS } from '../../data/copy'

// Section 6 — Main Forgiveness Question + Final state.
// Maps reference/index.html #s6 (l. 673–710) + the forgiveness climax (l. 980–1010).
// AnimatePresence crossfades the question -> final when the primary button is clicked.
export default function MainQuestionSection() {
  const s6 = copy.s6
  const reduced = useReducedMotion()
  const [forgiven, setForgiven] = useState(false)

  const handleForgive = () => {
    setForgiven(true)
    // Scroll the section into view so the final state is centered.
    setTimeout(() => scrollToSel('#s6', reduced), 100)
  }

  return (
    <SectionWrapper
      id="s6"
      pageTab={{ label: s6.pageTab, variant: 'pink' }}
      bg={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #FFD9E6 0%, transparent 55%),' +
          'linear-gradient(180deg, #FFC2D6 0%, #FF9DBB 100%)',
      }}
    >
      <FloatingHearts count={10} colors={['#FF5C8A', '#FFFFFF', '#FFD6E0', '#FF8FAB']} />
      <Wrap>
        <div className="q-card relative mx-auto max-w-[600px] text-center" style={{ padding: 'clamp(10px,4vw,28px) clamp(14px,5vw,40px)' }}>
          <AnimatePresence mode="wait">
            {!forgiven ? (
              <motion.div
                key="question"
                className="q-state"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(34px,7vw,54px)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.02em' }}>
                  {s6.h2[0]}<br />{s6.h2[1]}
                </h2>
                <div className="name mt-3.5" style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(22px,3.4vw,28px)', color: 'var(--color-text)' }}>
                  {s6.name}
                </div>
                <div className="q-flourish my-[22px] flex items-center justify-center gap-2.5" style={{ color: 'var(--color-btn)' }}>
                  <span className="ln" style={{ width: '44px', height: '2px', borderRadius: '2px', background: 'linear-gradient(90deg,transparent,rgba(255,92,138,0.65),transparent)' }} />
                  <div className="h-4 w-4"><Heart color="var(--color-btn)" /></div>
                  <span className="ln" style={{ width: '44px', height: '2px', borderRadius: '2px', background: 'linear-gradient(90deg,transparent,rgba(255,92,138,0.65),transparent)' }} />
                </div>

                <div className="btn-area mt-7 flex flex-col items-center gap-[18px]">
                  <button
                    className="btn-primary w-full cursor-pointer"
                    style={{
                      maxWidth: '420px',
                      background: 'var(--color-btn)',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.92)',
                      fontFamily: 'var(--font-head)',
                      fontWeight: 700,
                      fontSize: 'clamp(16px,2.3vw,19px)',
                      lineHeight: 1.35,
                      padding: '17px 24px',
                      borderRadius: '18px',
                      boxShadow: '0 20px 36px -16px rgba(255,92,138,0.9)',
                    }}
                    onClick={handleForgive}
                  >
                    {s6.forgiveBtn[0]}<br />{s6.forgiveBtn[1]}
                  </button>

                  <RunawayButton />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="final"
                className="final"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(30px,6vw,46px)', fontWeight: 800 }}>
                  {s6.finalH2}
                </h2>
                <p className="mx-auto mt-3.5" style={{ color: 'var(--color-text)', fontSize: 'clamp(16px,2.3vw,19px)', maxWidth: '52ch', whiteSpace: 'pre-line' }}>
                  {s6.finalP}
                </p>
                <div className="gif-label mt-6" style={{ fontFamily: 'var(--font-hand)', color: 'var(--color-text)', fontSize: 'clamp(20px,3vw,26px)' }}>
                  {s6.gifLabel}
                </div>
                <div
                  className="scene scene--lg scene--media mx-auto"
                  role="img"
                  aria-label={s6.gifLabel + ': senang banget dimaafin'}
                  style={{ maxWidth: '340px', marginTop: '12px' }}
                >
                  <img
                    src={GIFS.final}
                    alt={s6.gifAlt}
                    loading="lazy"
                    style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Wrap>

      <ConfettiHearts fire={forgiven} />
    </SectionWrapper>
  )
}
