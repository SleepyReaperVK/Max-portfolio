import Box from '@mui/material/Box'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'

// A 3px line on the top edge tracking how far down the page the reader is.
// `scaleX` on a full-width bar rather than an animated `width`, so the browser
// composites it instead of laying the page out again on every scroll frame.
export default function ScrollProgressBar() {
  const theme = useTheme()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // The spring is what makes it read as a bar being filled rather than a value
  // being reported. Reduced motion gets the raw, unsmoothed progress.
  const smoothed = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })
  const scaleX = reduce ? scrollYProgress : smoothed

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        // Above the AppBar so the line stays visible once the bar turns solid.
        zIndex: theme.zIndex.appBar + 1,
        pointerEvents: 'none',
      }}
    >
      <Box
        component={motion.div}
        style={{ scaleX }}
        sx={{
          height: '100%',
          transformOrigin: '0 50%',
          bgcolor: 'primary.main',
        }}
      />
    </Box>
  )
}
