import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper, { Wrap } from '../layout/SectionWrapper'
import Reveal from '../layout/Reveal'
import { copy } from '../../data/copy'

// Section 3 — Reassurance. Maps reference/index.html #s3 (l. 593–620).
// The PRD's emoji cards are replaced by the index.html "checked-off moments"
// list (gap reconciliation #3), which still satisfies FR-07.

function Tick({ checked }) {
  return (
    <svg className="h-full w-full overflow-visible" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        style={{
          fill: checked ? 'var(--color-btn)' : 'rgba(255,255,255,0.6)',
          stroke: checked ? 'var(--color-btn)' : 'var(--color-secondary)',
          strokeWidth: 2,
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transform: checked ? 'scale(1.06)' : 'scale(1)',
          transition: 'fill .4s cubic-bezier(0.22,1,0.36,1), stroke .4s cubic-bezier(0.22,1,0.36,1), transform .45s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <path
        d="M7 12.5 L10.5 16 L17 9"
        pathLength="1"
        style={{
          fill: 'none',
          stroke: '#fff',
          strokeWidth: 2.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeDasharray: 1,
          strokeDashoffset: checked ? 0 : 1,
          transition: 'stroke-dashoffset .45s cubic-bezier(0.22,1,0.36,1) .2s',
        }}
      />
    </svg>
  )
}

function Moment({ item, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <motion.li
      ref={ref}
      className="moment flex items-start gap-4 py-[18px]"
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="tick mt-0.5 h-[34px] w-[34px] flex-none" aria-hidden="true">
        <Tick checked={inView} />
      </span>
      <span className="moment-txt">
        <b
          className="block leading-tight"
          style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(18px,2.6vw,22px)' }}
        >
          {item.b}
        </b>
        <span className="mt-0.5 block" style={{ color: 'var(--color-text-soft)', fontSize: '15px' }}>
          {item.span}
        </span>
      </span>
    </motion.li>
  )
}

export default function ReassuranceSection() {
  const s3 = copy.s3
  return (
    <SectionWrapper
      id="s3"
      pageTab={{ label: s3.pageTab }}
      bg={{ background: 'linear-gradient(180deg, #FBEEFF 0%, #F3FBFF 100%)' }}
    >
      <Wrap>
        <Reveal className="reassure-head mx-auto mb-[34px] max-w-[640px] text-center">
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800 }}>
            {s3.h2}
          </h2>
          <p className="mt-3.5" style={{ color: 'var(--color-text-soft)', fontSize: 'clamp(16px,2.2vw,18px)' }}>
            {s3.body}
          </p>
        </Reveal>

        <ul
          className="moments mx-auto my-0 flex list-none flex-col p-0"
          style={{ maxWidth: '560px' }}
        >
          {s3.moments.map((m, i) => (
            <Moment
              key={m.b}
              item={m}
              delay={[0, 0.08, 0.16, 0.24, 0.32][i + 1] ?? 0}
            />
          ))}
        </ul>

        <Reveal>
          <p
            className="plea mx-auto mt-7 text-center"
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 'clamp(18px,2.6vw,24px)',
              color: 'var(--color-text)',
              maxWidth: '560px',
              lineHeight: 1.5,
            }}
          >
            {s3.plea}
          </p>
        </Reveal>
      </Wrap>
    </SectionWrapper>
  )
}
