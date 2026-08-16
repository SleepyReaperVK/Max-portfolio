import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'

export default function AnimatedReveal({ children, delay = 0, as = 'div' }) {
  const theme = useTheme()
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduce) {
    return (
      <MotionTag initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      custom={delay}
      variants={theme.custom.reveal}
    >
      {children}
    </MotionTag>
  )
}
