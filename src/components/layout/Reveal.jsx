import { motion } from 'framer-motion'
import { revealVariants, delays } from '../../lib/motion'

// Declarative scroll-reveal wrapper. Replaces index.html's
// .reveal + IntersectionObserver pattern (l. 100–104, 738–748).
//
// `d` selects a delay tier (0..4) matching .reveal.d1..d4.
export default function Reveal({ d = 0, className = '', children, ...rest }) {
  const delay = delays[d] ?? 0
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
