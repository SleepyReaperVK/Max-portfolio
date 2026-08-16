import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'
import { useReducedMotion } from 'framer-motion'
import mediaManifest from '@/content/mediaManifest'

const warnedKeys = new Set()

export default function MediaFrame({ mediaKey, alt = '', caption, ratio, priority = false, onClick }) {
  const theme = useTheme()
  const reduce = useReducedMotion()
  // Callback ref (not useRef) so the intersection-observer effects below can
  // depend on the node itself and re-arm if it's ever null on first render
  // (review round 1, M-5) — a plain ref's `.current` isn't a reactive value,
  // so an effect keyed only on `[entry]` can never retry.
  const [videoNode, setVideoNode] = useState(null)
  const [inView, setInView] = useState(false)
  // Posters are real image requests (30+ on the case-study route), so they
  // only attach once a video nears the viewport — not on page load, which
  // would defeat `preload="none"`. `priority` media skip the wait. Monotonic:
  // never resets, so scrolling away doesn't drop a poster already loaded. Its
  // own observer/rootMargin, deliberately separate from the autoplay observer
  // below — sharing one previously started the poster and video request at
  // the same instant, leaving reduced-motion users (poster-only) with nothing
  // to show (review round 1, I-4).
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

  // Poster prefetch — fires well ahead of the viewport (large rootMargin, no
  // intersection-ratio requirement) so the poster is already decoded and
  // painted by the time the autoplay observer below actually fires.
  useEffect(() => {
    if (!entry || entry.type !== 'video' || !videoNode || posterVisible) return undefined
    const observer = new IntersectionObserver(
      ([observedEntry]) => {
        if (observedEntry.isIntersecting) setPosterVisible(true)
      },
      { rootMargin: '600px 0px', threshold: 0 },
    )
    observer.observe(videoNode)
    return () => observer.disconnect()
  }, [entry, videoNode, posterVisible])

  // Autoplay — tighter threshold, own observer, deliberately not shared with
  // the poster prefetch above.
  useEffect(() => {
    if (!entry || entry.type !== 'video' || !videoNode) return undefined
    const observer = new IntersectionObserver(
      ([observedEntry]) => setInView(observedEntry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(videoNode)
    return () => observer.disconnect()
  }, [entry, videoNode])

  useEffect(() => {
    if (!videoNode) return
    if (inView && !reduce) {
      videoNode.play().catch(() => {})
    } else {
      videoNode.pause()
    }
  }, [inView, reduce, videoNode])

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
          // Themed placeholder so a not-yet-loaded image/poster is never a
          // transparent hole onto the section background (review round 1,
          // I-4) — matches the missing-media placeholder above.
          bgcolor: alpha(theme.palette.text.primary, 0.04),
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
            ref={setVideoNode}
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
