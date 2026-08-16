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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((closest, entry) =>
          entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest,
        )
        setTrackedActiveId(topMost.target.id)
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
        display: { xs: 'none', lg: 'block' },
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
