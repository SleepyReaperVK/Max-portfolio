import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

export default function SystemNav({ systems = [], activeId: activeIdProp }) {
  const theme = useTheme()
  const [trackedActiveId, setTrackedActiveId] = useState(systems[0]?.id)
  const activeId = activeIdProp ?? trackedActiveId

  useEffect(() => {
    const elements = systems.map((system) => document.getElementById(system.id)).filter(Boolean)
    if (!elements.length) return undefined

    // The observer callback only ever receives entries whose intersection
    // state just changed — not the full observed set. So we keep our own
    // running map of "is this element currently inside the band" per
    // element, updated incrementally from each callback, and recompute the
    // topmost currently-visible element from that map every time — instead
    // of trying to pick a winner out of the (possibly single-element,
    // possibly stale) `entries` array alone.
    const isIntersecting = new Map(elements.map((element) => [element, false]))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => isIntersecting.set(entry.target, entry.isIntersecting))

        const visible = elements.filter((element) => isIntersecting.get(element))
        if (visible.length === 0) return

        // Pick the section that entered the band *last* (greatest `top`), not
        // the one highest on the page. Adjacent sections both intersect the
        // narrow 30%-40% band during a transition, and the outgoing one always
        // has the smaller `top` (it starts far above the viewport), so choosing
        // the topmost kept the nav one section behind the heading on screen.
        const current = visible.reduce((best, element) =>
          element.getBoundingClientRect().top >= best.getBoundingClientRect().top ? element : best,
        )
        setTrackedActiveId(current.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [systems])

  return (
    <Box
      component="nav"
      aria-label="System sections"
      sx={{
        position: 'sticky',
        top: `calc(${theme.custom.navbarHeight} + ${theme.spacing(3)})`,
      }}
    >
      <List dense disablePadding>
        {systems.map((system) => {
          const isActive = system.id === activeId
          return (
            <ListItemButton
              key={system.id}
              component="a"
              href={`#${system.id}`}
              selected={isActive}
              sx={{
                borderLeft: '2px solid',
                borderColor: isActive ? 'primary.main' : 'transparent',
                py: 1,
                '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
                '&.Mui-selected': { bgcolor: 'transparent' },
                '&.Mui-selected:hover': { bgcolor: 'transparent' },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {system.title}
                  </Typography>
                }
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}
