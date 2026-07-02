// Scrapbook "hal. 0N" page tab. Maps index.html .pagetab (l. 206–214).
//
// variant: 'default' (lavender) | 'night' (translucent) | 'pink' (btn color)
const variants = {
  default: 'bg-[var(--color-secondary)] text-[var(--color-text)]',
  night: 'bg-white/15 text-[var(--color-star)]',
  pink: 'bg-[var(--color-btn)] text-[var(--color-text)]',
}

export default function PageTab({ label, variant = 'default' }) {
  return (
    <span
      className={`pagetab absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none shadow-[0_8px_18px_-12px_rgba(0,0,0,0.4)] ${variants[variant]}`}
      style={{ fontFamily: 'var(--font-hand)' }}
    >
      {label}
    </span>
  )
}
