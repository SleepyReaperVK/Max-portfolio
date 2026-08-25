import { useState } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useTheme, alpha } from '@mui/material/styles'
import MediaFrame from '@/components/common/MediaFrame'

// Click-to-play facade for the Notion page's YouTube gameplay video.
//
// The rest of the site makes zero third-party requests — every image and clip
// is self-hosted under public/media/. A plain <iframe> would pull YouTube's
// player bundle and set cookies on every case-study visit, so nothing leaves
// this origin until the visitor actually asks for the video.
//
// The facade backdrop is a self-hosted gameplay clip rather than YouTube's own
// thumbnail: that thumbnail is licensed Dark Souls III promotional key art, the
// exact class of asset scripts/fetch-media.mjs already refuses to ship
// (STOCK_ART_MARKERS, "not project evidence, licensing risk if shipped").
const EMBED_ORIGIN = 'https://www.youtube-nocookie.com'
const FRAME_RATIO = '16 / 9'

export default function GameplayVideo({ gameplay }) {
  const theme = useTheme()
  const [playing, setPlaying] = useState(false)

  if (!gameplay) return null

  const { youtubeId, url, title, poster } = gameplay

  return (
    // Wider than `maxTextWidth` — that measure is tuned for prose, and a 16:9
    // video reads as undersized at it. Still capped so the frame doesn't
    // stretch to the full `lg` container on desktop.
    <Box sx={{ maxWidth: theme.breakpoints.values.md }}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {playing ? (
          <Box
            component="iframe"
            src={`${EMBED_ORIGIN}/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            sx={{ display: 'block', width: '100%', aspectRatio: FRAME_RATIO, border: 0 }}
          />
        ) : (
          <>
            {/* MediaFrame owns the hit target: with `onClick` it already renders
                role="button", tabIndex, aria-label and Enter/Space handling, so
                the overlay below stays purely decorative. */}
            <MediaFrame
              mediaKey={poster.key}
              alt={poster.alt}
              ratio={FRAME_RATIO}
              onClick={() => setPlaying(true)}
            />
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                backgroundImage: `linear-gradient(180deg, ${alpha(
                  theme.palette.background.default,
                  0.1,
                )} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 56, md: 72 },
                  height: { xs: 56, md: 72 },
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.background.default, 0.7),
                }}
              >
                <PlayArrowIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Typography variant="caption" component="p" sx={{ color: 'text.secondary', mt: 1.5 }}>
        {title} —{' '}
        <Link href={url} target="_blank" rel="noopener noreferrer" color="inherit">
          watch on YouTube
          <OpenInNewIcon sx={{ fontSize: 'inherit', ml: 0.5, verticalAlign: 'middle' }} />
        </Link>
      </Typography>
    </Box>
  )
}
