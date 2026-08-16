import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { NAVBAR_SPACING_UNITS } from '@/components/layout/NavBar'

export default function SectionHeading({ eyebrow, title, align = 'left' }) {
  const theme = useTheme()
  const navbarHeight = theme.spacing(NAVBAR_SPACING_UNITS)
  const itemsAlign = align === 'center' ? 'center' : 'flex-start'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: itemsAlign,
        textAlign: align,
        scrollMarginTop: navbarHeight,
        mb: { xs: 4, md: 6 },
      }}
    >
      {eyebrow ? (
        <Typography variant="h6" component="p" color="primary.main" sx={{ mb: 1.5 }}>
          {eyebrow}
        </Typography>
      ) : null}
      {title ? (
        <Typography variant="h2" component="h2">
          {title}
        </Typography>
      ) : null}
      <Box
        sx={{
          width: theme.spacing(6),
          height: theme.spacing(0.25),
          bgcolor: 'primary.main',
          mt: 2,
        }}
      />
    </Box>
  )
}
