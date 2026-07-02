import PageTab from './PageTab'

// Maps index.html `section` (l. 84–91) + `.wrap` (l. 77–82).
// Each section is full-viewport-height, centered, with a max-width wrap.
//
// Props:
//   id       — anchor id (s1..s6)
//   bg       — inline style for the section background (gradients)
//   pageTab  — { label, variant? } for the scrapbook tab
//   className— extra classes on the inner wrap
//   children — section content
export default function SectionWrapper({ id, bg, pageTab, className = '', children }) {
  return (
    <section
      id={id}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      style={{ paddingTop: 'clamp(64px, 12vh, 120px)', paddingBottom: 'clamp(64px, 12vh, 120px)', ...bg }}
    >
      {pageTab && <PageTab label={pageTab.label} variant={pageTab.variant} />}
      {children}
    </section>
  )
}

// The centered max-width column (index.html `.wrap`, l. 77–82).
export function Wrap({ className = '', children, ...rest }) {
  return (
    <div
      className={`relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
