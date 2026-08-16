import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'

export default function NotFound() {
  const theme = useTheme()

  return (
    <Section id="not-found">
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: theme.custom.maxTextWidth }}>
        This page doesn&apos;t exist.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography component={RouterLink} to="/" variant="body1" sx={{ color: 'primary.main' }}>
          Back to home
        </Typography>
      </Box>
    </Section>
  )
}
