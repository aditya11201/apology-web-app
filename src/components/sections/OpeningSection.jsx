import SectionWrapper, { Wrap } from '../layout/SectionWrapper'
import Reveal from '../layout/Reveal'
import FloatingHearts from '../decorative/FloatingHearts'
import { Heart } from '../../lib/svg'
import { scrollToSel } from '../../lib/scroll'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { copy, GIFS } from '../../data/copy'

// Section 1 — Opening Greeting. Maps reference/index.html #s1 (l. 546–573).
export default function OpeningSection() {
  const reduced = useReducedMotion()
  const s1 = copy.s1

  return (
    <SectionWrapper
      id="s1"
      pageTab={{ label: s1.pageTab }}
      bg={{
        background:
          'radial-gradient(120% 90% at 15% 10%, #FFE3EC 0%, transparent 55%),' +
          'radial-gradient(120% 90% at 90% 20%, #F1E6FF 0%, transparent 50%),' +
          'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-pink) 100%)',
        paddingTop: 'clamp(16px, 3.5vh, 36px)',
        paddingBottom: 'clamp(16px, 3.5vh, 36px)',
      }}
    >
      <FloatingHearts count={8} colors={['#FF8FAB', '#FFD6E0', '#B388EB', '#FF5C8A']} />
      <Wrap>
        <div className="letter mx-auto max-w-[560px] text-center" style={{ paddingInline: 'clamp(14px, 5vw, 30px)' }}>
          <Reveal>
            <div
              className="stamp mx-auto mb-2.5 grid h-11 w-11 -rotate-[8deg] place-items-center rounded-full"
              style={{
                background: 'var(--color-btn)',
                boxShadow: '0 8px 20px -8px rgba(255,92,138,0.7), inset 0 2px 6px rgba(255,255,255,0.35)',
              }}
              aria-hidden="true"
            >
              <div className="h-[30px] w-[30px]">
                <Heart color="#fff" />
              </div>
            </div>
          </Reveal>

          <Reveal d={1} className="eyebrow" >
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(15px, 1.9vw, 21px)', color: 'var(--color-btn)', letterSpacing: '0.5px' }}>
              {s1.eyebrow}
            </div>
          </Reveal>

          <Reveal d={1}>
            <h1
              className="mt-2 font-extrabold"
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 'clamp(24px, 4.4vw, 40px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              {s1.h1}
            </h1>
          </Reveal>

          <Reveal d={2}>
            <div
              className="who mt-1.5"
              style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(22px, 4vw, 32px)', color: 'var(--color-text)', lineHeight: 1.1 }}
            >
              {s1.who}
            </div>
          </Reveal>

          <Reveal d={3}>
            <p
              className="ask mt-2.5"
              style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(15px, 1.9vw, 21px)', color: 'var(--color-text-soft)' }}
            >
              {s1.ask}
            </p>
          </Reveal>

          <Reveal d={3}>
            <div
              className="scene scene--media mx-auto mt-3.5"
              role="img"
              aria-label="Adit lagi semangat nungguin kamu baca ini"
              style={{ background: 'transparent', boxShadow: 'none' }}
            >
              <img
                src={GIFS.opening}
                alt={s1.gifAlt}
                loading="lazy"
                style={{
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 18px 40px -28px rgba(255,92,138,0.45)',
                  maxHeight: '34vh',
                  width: 'auto',
                  maxWidth: '100%',
                }}
              />
            </div>
          </Reveal>

          <Reveal d={4}>
            <div style={{ marginTop: '26px' }}>
              <button
                className="cta inline-flex items-center gap-2.5 rounded-full border-none px-7 py-4 font-bold text-white"
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 'clamp(17px, 2.4vw, 20px)',
                  background: 'var(--color-btn)',
                  boxShadow: '0 18px 34px -16px rgba(255,92,138,0.85)',
                  cursor: 'pointer',
                  transition: 'transform .18s cubic-bezier(0.22,1,0.36,1), box-shadow .25s, background .2s',
                }}
                onClick={() => scrollToSel('#s2', reduced)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-btn-press)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-btn)'
                  e.currentTarget.style.transform = ''
                }}
              >
                {s1.cta} <span className="arr">→</span>
              </button>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </SectionWrapper>
  )
}
