import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useActiveSection from './useActiveSection'

export default function SystemNav({ systems = [], activeId: activeIdProp }) {
  const theme = useTheme()
  const trackedActiveId = useActiveSection(systems)
  const activeId = activeIdProp ?? trackedActiveId

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
              aria-current={isActive ? 'true' : undefined}
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
