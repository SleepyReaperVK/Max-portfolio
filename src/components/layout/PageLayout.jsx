import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import NavBar, { NAVBAR_SPACING_UNITS } from './NavBar'
import Footer from './Footer'

export default function PageLayout({ navLinks, siteConfig, children }) {
  const theme = useTheme()
  const { pathname } = useLocation()
  const navbarHeight = theme.spacing(NAVBAR_SPACING_UNITS)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translateY(-100%)',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 2,
          py: 1,
          zIndex: theme.zIndex.tooltip,
          transition: `transform ${theme.custom.motion.fast}ms ${theme.custom.motion.easing}`,
          '&:focus-visible': {
            transform: 'translateY(0%)',
          },
        }}
      >
        Skip to content
      </Box>

      <NavBar navLinks={navLinks} siteConfig={siteConfig} />

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{ flex: 1, pt: navbarHeight, outline: 'none' }}
      >
        {children}
      </Box>

      <Footer siteConfig={siteConfig} />
    </Box>
  )
}
