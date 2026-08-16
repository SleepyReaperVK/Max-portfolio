import { createTheme } from '@mui/material/styles'
import palette from './palette'
import typography from './typography'
import components from './components'
import motion, { reveal } from './motion'

let theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 8 },
  spacing: 8,
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
})

theme = createTheme(theme, {
  components: components(theme),
  custom: {
    motion,
    reveal,
    section: { paddingBlock: { xs: theme.spacing(8), md: theme.spacing(14) } },
    maxTextWidth: '68ch',
    // Fixed navbar height (also the "solid after Npx" scroll-trigger threshold).
    // Single source of truth for NavBar, Section, SectionHeading, PageLayout.
    navbarHeight: theme.spacing(8),
  },
})

export default theme
