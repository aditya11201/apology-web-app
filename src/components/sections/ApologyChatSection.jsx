import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import SectionWrapper, { Wrap } from '../layout/SectionWrapper'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { copy } from '../../data/copy'

// Section 2 — Playful Apology. Maps reference/index.html #s2 (l. 576–590).
// Chat bubbles play in sequence when the section enters view (l. 776–803):
// typing indicator -> bubble -> gap -> repeat -> end with "Maaf ya…".

export default function ApologyChatSection() {
  const s2 = copy.s2
  const reduced = useReducedMotion()
  const chatRef = useRef(null)
  const inView = useInView(chatRef, { once: true, amount: 0.25 })

  const [visible, setVisible] = useState([]) // { id, text, lost }
  const [typing, setTyping] = useState(false)
  const [showSorry, setShowSorry] = useState(false)

  useEffect(() => {
    if (!inView) return
    let i = 0
    let timers = []
    const typingMs = reduced ? 200 : 850
    const gapMs = reduced ? 50 : 650

    const next = () => {
      if (i >= s2.lines.length) {
        setShowSorry(true)
        return
      }
      setTyping(true)
      timers.push(
        setTimeout(() => {
          setTyping(false)
          const line = s2.lines[i]
          setVisible((prev) => [
            ...prev,
            { id: i, text: typeof line === 'string' ? line : line.text, lost: typeof line === 'object' ? line.lost : false },
          ])
          i++
          timers.push(setTimeout(next, gapMs))
        }, typingMs),
      )
    }
    timers.push(setTimeout(next, 200))
    return () => timers.forEach(clearTimeout)
  }, [inView, reduced, s2.lines])

  return (
    <SectionWrapper
      id="s2"
      pageTab={{ label: s2.pageTab }}
      bg={{ background: 'linear-gradient(180deg, var(--color-bg-pink) 0%, #FBEEFF 100%)' }}
    >
      <Wrap>
        <motion.div
          ref={chatRef}
          className="chat mx-auto max-w-[560px]"
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-soft)',
            padding: 'clamp(22px, 4vw, 34px)',
            border: '1px solid #fff',
            opacity: 0,
            y: 26,
          }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="chat-head mb-[18px] flex items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--color-line)' }}>
            <div
              className="ava grid h-11 w-11 place-items-center rounded-full font-extrabold text-white"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', fontFamily: 'var(--font-head)' }}
            >
              A
            </div>
            <div>
              <b style={{ fontFamily: 'var(--font-head)', fontSize: '18px' }}>{s2.name}</b>
              <span className="block" style={{ fontSize: '13px', color: 'var(--color-text-soft)' }}>
                {s2.status}
              </span>
            </div>
          </div>

          <div className="chat-stage flex min-h-[40px] flex-col gap-3">
            <AnimatePresence>
              {visible.map((b) => (
                <motion.div
                  key={b.id}
                  className="bubble"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    alignSelf: 'flex-start',
                    background: b.lost ? '#FFE7C2' : 'var(--color-bg-pink)',
                    color: 'var(--color-text)',
                    fontStyle: b.lost ? 'italic' : 'normal',
                    padding: '13px 17px',
                    borderRadius: '20px 20px 20px 5px',
                    maxWidth: '84%',
                    fontSize: 'clamp(16px, 2.2vw, 18px)',
                    boxShadow: '0 8px 18px -14px rgba(58,46,57,0.4)',
                  }}
                >
                  {b.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <div
                className="typing inline-flex gap-[5px] self-start"
                style={{ background: 'var(--color-bg-pink)', padding: '14px 18px', borderRadius: '20px 20px 20px 5px' }}
              >
                {[0, 0.2, 0.4].map((d, i) => (
                  <i
                    key={i}
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: 'var(--color-primary)', animation: 'blink 1.2s infinite', animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            )}

            {showSorry && (
              <motion.div
                className="sorry text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(26px,5vw,38px)', color: 'var(--color-btn)', marginTop: '16px' }}
              >
                {s2.sorry}
              </motion.div>
            )}
          </div>
        </motion.div>
      </Wrap>
    </SectionWrapper>
  )
}
