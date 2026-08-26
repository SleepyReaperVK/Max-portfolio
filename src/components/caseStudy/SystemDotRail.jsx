import Box from '@mui/material/Box'
import { useTheme, alpha } from '@mui/material/styles'
import useActiveSection from './useActiveSection'

// The mobile counterpart to SystemNav: the same section tracking, reduced to a
// column of dots pinned to the left edge. Rendered instead of SystemNav below
// `lg`, where the titled list is too wide to sit beside the breakdowns.
export default function SystemDotRail({ systems = [], activeId: activeIdProp }) {
  const theme = useTheme()
  const trackedActiveId = useActiveSection(systems)
  const activeId = activeIdProp ?? trackedActiveId

  return (
    <Box
      component="nav"
      aria-label="System sections"
      sx={{
        position: 'fixed',
        // The whole rail has to clear the 32px text column, otherwise the dots
        // read as bullet points attached to the copy rather than as a rail.
        left: theme.spacing(0.5),
        top: '50%',
        transform: 'translateY(-50%)',
        // Under the AppBar and the mobile drawer, above page content.
        zIndex: theme.zIndex.appBar - 1,
        display: 'flex',
        flexDirection: 'column',
        py: 0.5,
        borderRadius: 999,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: `blur(${theme.spacing(1)})`,
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
            sx={{
              // 24x40 tap area around an 8px dot: the dot is the visual, the
              // rest is the target. Kept narrow so the rail stays out of the
              // text column at 390px.
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 40,
              '&:focus-visible': { outlineOffset: -4 },
            }}
          >
            <Box
              sx={{
                width: isActive ? 10 : 8,
                height: isActive ? 10 : 8,
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
