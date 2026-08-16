import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'
import { useReducedMotion } from 'framer-motion'
import mediaManifest from '@/content/mediaManifest'

const warnedKeys = new Set()

export default function MediaFrame({ mediaKey, alt = '', caption, ratio, priority = false, onClick }) {
  const theme = useTheme()
  const reduce = useReducedMotion()
  const videoRef = useRef(null)
  const [inView, setInView] = useState(false)
  // Posters are real image requests, not free — loading all of them near page
  // load (30+ on the case-study route) defeats `preload="none"`. Track
  // whether the video has ever entered the viewport and only attach `poster`
  // then; `priority` media skip the wait entirely. Monotonic (never resets)
  // so scrolling away doesn't drop a poster that already loaded.
  const [posterVisible, setPosterVisible] = useState(priority)
  const entry = mediaManifest[mediaKey]

  useEffect(() => {
    if (!entry && !warnedKeys.has(mediaKey)) {
      warnedKeys.add(mediaKey)
      // eslint-disable-next-line no-console
      console.warn(`MediaFrame: unknown media key "${mediaKey}"`)
    }
  }, [entry, mediaKey])

  useEffect(() => {
    if (entry && entry.type === 'image' && !alt && !warnedKeys.has(`${mediaKey}:alt`)) {
      warnedKeys.add(`${mediaKey}:alt`)
      // eslint-disable-next-line no-console
      console.warn(`MediaFrame: missing "alt" for image media key "${mediaKey}"`)
    }
  }, [entry, mediaKey, alt])

  useEffect(() => {
    if (!entry || entry.type !== 'video') return undefined
    const node = videoRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([observedEntry]) => {
        setInView(observedEntry.isIntersecting)
        if (observedEntry.isIntersecting) setPosterVisible(true)
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [entry])

  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    if (inView && !reduce) {
      node.play().catch(() => {})
    } else {
      node.pause()
    }
  }, [inView, reduce])

  const interactiveProps = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': alt || undefined,
        onClick,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick(event)
          }
        },
      }
    : {}

  if (!entry) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: ratio || '16 / 9',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.text.primary, 0.04),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...interactiveProps}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Missing media: {mediaKey}
        </Typography>
      </Box>
    )
  }

  const aspectRatio = ratio || `${entry.width} / ${entry.height}`

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          borderRadius: 1,
          cursor: onClick ? 'pointer' : 'default',
        }}
        {...interactiveProps}
      >
        {entry.type === 'image' ? (
          <Box
            component="img"
            src={entry.src}
            alt={alt}
            width={entry.width}
            height={entry.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box
            component="video"
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={posterVisible ? entry.poster : undefined}
            width={entry.width}
            height={entry.height}
            aria-label={alt}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          >
            <source src={entry.src} type="video/mp4" />
            Your browser does not support embedded video.
          </Box>
        )}
      </Box>
      {caption ? (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
          {caption}
        </Typography>
      ) : null}
    </Box>
  )
}
