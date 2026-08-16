import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import SectionHeading from './SectionHeading'
import { NAVBAR_SPACING_UNITS } from '@/components/layout/NavBar'

export default function Section({ id, title, eyebrow, dense = false, children }) {
  const theme = useTheme()
  const navbarHeight = theme.spacing(NAVBAR_SPACING_UNITS)

  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: dense ? { xs: theme.spacing(4), md: theme.spacing(7) } : theme.custom.section.paddingBlock,
        scrollMarginTop: navbarHeight,
      }}
    >
      <Container maxWidth="lg">
        {title ? <SectionHeading eyebrow={eyebrow} title={title} /> : null}
        {children}
      </Container>
    </Box>
  )
}
