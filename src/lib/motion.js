// Shared motion primitives.
// EASE matches --ease-soft (cubic-bezier(0.22, 1, 0.36, 1)) from index.html :root.
const EASE = [0.22, 1, 0.36, 1]

// Replaces index.html .reveal/.reveal.in (l. 100–104):
//   opacity 0, translateY(26px) -> opacity 1, none, over .9s ease.
export const revealVariants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
}

// Delay ladder mirrors .reveal.d1..d4 (l. 103–104):
//   d1=.08s, d2=.16s, d3=.24s, d4=.32s.
export const delays = [0, 0.08, 0.16, 0.24, 0.32]

// Bubble-in for chat bubbles, sorry text, final-state entrance (l. 300–303).
export const bubbleVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

export { EASE }
