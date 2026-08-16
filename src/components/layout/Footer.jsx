import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import { useTheme } from '@mui/material/styles'

export default function Footer({ siteConfig }) {
  const theme = useTheme()
  const year = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 6 }}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {siteConfig?.name} &copy; {year}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {siteConfig?.links?.linkedin ? (
            <IconButton
              aria-label="LinkedIn profile"
              component="a"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              sx={{ color: 'text.secondary' }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          ) : null}
          {siteConfig?.links?.github ? (
            <IconButton
              aria-label="GitHub profile"
              component="a"
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer noopener"
              sx={{ color: 'text.secondary' }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          ) : null}
          {siteConfig?.email ? (
            <IconButton
              aria-label="Send an email"
              component="a"
              href={`mailto:${siteConfig.email}`}
              sx={{ color: 'text.secondary' }}
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: theme.typography.fontFamily }}>
          Built with React &amp; MUI
        </Typography>
      </Container>
    </Box>
  )
}
