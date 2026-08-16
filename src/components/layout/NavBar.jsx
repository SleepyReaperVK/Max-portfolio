import { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { useTheme, alpha } from '@mui/material/styles'

// Number of theme spacing units used for the navbar's fixed height. Shared
// with Section/SectionHeading/PageLayout so anchor scroll offsets and the
// "solid after N px" scroll trigger stay derived from the same theme token.
export const NAVBAR_SPACING_UNITS = 8

export default function NavBar({ navLinks = [], siteConfig }) {
  const theme = useTheme()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isHome = location.pathname === '/'
  const navbarHeight = theme.spacing(NAVBAR_SPACING_UNITS)
  const scrollThreshold = parseFloat(theme.spacing(NAVBAR_SPACING_UNITS))

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: scrollThreshold })

  const closeDrawer = () => setOpen(false)

  const renderLink = (link, onNavigate) =>
    isHome ? (
      <Box
        key={link.id}
        component="a"
        href={`#${link.id}`}
        onClick={onNavigate}
        sx={{
          color: 'text.primary',
          textDecoration: 'none',
          fontWeight: 600,
          '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
        }}
      >
        {link.label}
      </Box>
    ) : (
      <Box
        key={link.id}
        component={RouterLink}
        to={link.href}
        onClick={onNavigate}
        sx={{
          color: 'text.primary',
          textDecoration: 'none',
          fontWeight: 600,
          '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
        }}
      >
        {link.label}
      </Box>
    )

  const contactHref = isHome ? '#contact' : '/#contact'

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: trigger ? 'background.paper' : 'transparent',
        borderBottom: trigger ? '1px solid' : '1px solid transparent',
        borderColor: trigger ? 'divider' : 'transparent',
        backdropFilter: trigger ? `blur(${theme.spacing(1)})` : 'none',
        transition: `background-color ${theme.custom.motion.base}ms ${theme.custom.motion.easing}, border-color ${theme.custom.motion.base}ms ${theme.custom.motion.easing}`,
      }}
    >
      <Toolbar sx={{ height: navbarHeight, minHeight: navbarHeight, justifyContent: 'space-between' }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h5"
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            fontFamily: theme.typography.h3.fontFamily,
            '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
          }}
        >
          {siteConfig?.name}
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          {navLinks.map((link) => renderLink(link))}
          <Button
            variant="contained"
            color="primary"
            component={isHome ? 'a' : RouterLink}
            href={isHome ? contactHref : undefined}
            to={isHome ? undefined : contactHref}
          >
            Get in touch
          </Button>
        </Box>

        <IconButton
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <Box sx={{ width: theme.spacing(32), height: '100%', bgcolor: 'background.paper', p: 2 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton aria-label="Close navigation menu" onClick={closeDrawer} sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.id} disablePadding>
                {isHome ? (
                  <ListItemButton component="a" href={`#${link.id}`} onClick={closeDrawer}>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                ) : (
                  <ListItemButton component={RouterLink} to={link.href} onClick={closeDrawer}>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                component={isHome ? 'a' : RouterLink}
                href={isHome ? contactHref : undefined}
                to={isHome ? undefined : contactHref}
                onClick={closeDrawer}
              >
                Get in touch
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}
