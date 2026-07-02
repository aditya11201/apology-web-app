// Smooth-scroll helper. Ported from index.html scrollToSel (l. 731–735).
// `reduced` disables smooth behavior to respect prefers-reduced-motion.
export function scrollToSel(sel, reduced = false) {
  const el = document.querySelector(sel)
  if (!el) return
  const top =
    el.getBoundingClientRect().top +
    (window.pageYOffset || document.documentElement.scrollTop)
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
}
