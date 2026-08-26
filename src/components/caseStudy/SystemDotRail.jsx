import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme, alpha } from '@mui/material/styles'
import useActiveSection from './useActiveSection'

// The mobile counterpart to SystemNav: the same section tracking, reduced to a
// column of dots pinned to the left edge. Rendered instead of SystemNav below
// `lg`, where the titled list is too wide to sit beside the breakdowns.
export default function SystemDotRail({ systems = [], sectionId = 'systems', activeId: activeIdProp }) {
  const theme = useTheme()
  const trackedActiveId = useActiveSection(systems)
  const activeId = activeIdProp ?? trackedActiveId

  // The rail only means anything while the breakdowns are on screen. Left
  // always-on it sat over the hero and clipped the title and the back link.
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (!section) return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(section)
    return () => observer.disconnect()
  }, [sectionId])

  return (
    <Box
      component="nav"
      aria-label="System sections"
      aria-hidden={inView ? undefined : 'true'}
      sx={{
        position: 'fixed',
        // Clears the text column: at the very edge with no capsule the dots
        // read as bullet points hanging off the paragraph.
        left: theme.spacing(1),
        top: '50%',
        // Under the AppBar and the mobile drawer, above page content.
        zIndex: theme.zIndex.appBar - 1,
        display: 'flex',
        flexDirection: 'column',
        py: 0.75,
        borderRadius: 999,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: `blur(${theme.spacing(1)})`,
        opacity: inView ? 1 : 0,
        pointerEvents: inView ? 'auto' : 'none',
        transform: inView ? 'translate(0, -50%)' : `translate(-${theme.spacing(1.5)}, -50%)`,
        transition: theme.transitions.create(['opacity', 'transform'], {
          duration: theme.custom.motion.fast,
          easing: theme.custom.motion.easing,
        }),
      }}
    >
      {systems.map((system) => {
        const isActive = system.id === activeId
        return (
          <Box
            key={system.id}
            component="a"
            href={`#${system.id}`}
            aria-label={system.title}
            aria-current={isActive ? 'true' : undefined}
            // Not a tab stop while the rail is invisible.
            tabIndex={inView ? 0 : -1}
            sx={{
              // 24x36 tap area around the dot: the dot is the visual, the rest
              // is the target. Kept narrow so the rail stays out of the text
              // column at 390px.
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 36,
              '&:focus-visible': { outlineOffset: -4 },
            }}
          >
            <Box
              sx={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                borderRadius: '50%',
                bgcolor: isActive ? 'primary.main' : 'text.disabled',
                transition: theme.transitions.create(['background-color', 'width', 'height'], {
                  duration: theme.custom.motion.fast,
                  easing: theme.custom.motion.easing,
                }),
              }}
            />
          </Box>
        )
      })}
    </Box>
  )
}
