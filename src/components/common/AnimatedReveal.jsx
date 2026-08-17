import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'

// `immediate` is for above-the-fold content (the hero). A `whileInView` reveal
// waits on an IntersectionObserver callback, so the element sits at opacity 0
// for at least a frame after mount — on a render-throttled or slow client that
// gap is visible as an empty screen, which a UI review caught on the hero.
// Content that is already in the viewport at mount animates on mount instead.
export default function AnimatedReveal({ children, delay = 0, as = 'div', immediate = false }) {
  const theme = useTheme()
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduce) {
    const fade = { opacity: 1 }
    return (
      <MotionTag
        initial={{ opacity: 0 }}
        {...(immediate
          ? { animate: fade }
          : { whileInView: fade, viewport: { once: true } })}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      initial="hidden"
      {...(immediate
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: '-80px' } })}
      custom={delay}
      variants={theme.custom.reveal}
    >
      {children}
    </MotionTag>
  )
}
