import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'
import Seo from '@/components/common/Seo'

export default function NotFound() {
  const theme = useTheme()

  return (
    <Section id="not-found">
      <Seo title="Page not found" description="This page doesn't exist." path="/404" noindex />
      <Box sx={{ textAlign: 'center', maxWidth: theme.custom.maxTextWidth, mx: 'auto' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </Typography>
        <Button variant="contained" color="primary" size="large" component={RouterLink} to="/">
          Back to home
        </Button>
      </Box>
    </Section>
  )
}
