import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import SectionHeading from './SectionHeading'

export default function Section({ id, title, eyebrow, dense = false, align = 'left', sx, children }) {
  const theme = useTheme()
  const navbarHeight = theme.custom.navbarHeight

  return (
    <Box
      component="section"
      id={id}
      sx={[
        {
          py: dense ? { xs: theme.spacing(4), md: theme.spacing(7) } : theme.custom.section.paddingBlock,
          scrollMarginTop: navbarHeight,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Container maxWidth="lg">
        {title ? <SectionHeading eyebrow={eyebrow} title={title} align={align} /> : null}
        {children}
      </Container>
    </Box>
  )
}
