import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import DownloadIcon from '@mui/icons-material/Download'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'
import AnimatedReveal from '@/components/common/AnimatedReveal'

export default function ContactSection({ email, links, cv }) {
  const theme = useTheme()

  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something" align="center">
      <AnimatedReveal>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{
            color: 'text.secondary',
            maxWidth: theme.custom.maxTextWidth,
            mx: 'auto',
            mb: { xs: 4, md: 5 },
            textAlign: 'center',
          }}
        >
          Get in touch about gameplay programming roles, collaborations, or anything above. I read every message.
        </Typography>
      </AnimatedReveal>

      <AnimatedReveal delay={0.06}>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 3, md: 4 },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<EmailIcon />}
            href={`mailto:${email}`}
          >
            Email me
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<LinkedInIcon />}
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<GitHubIcon />}
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>

          {cv.enabled ? (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<DownloadIcon />}
              href={cv.path}
              download
            >
              {cv.label}
            </Button>
          ) : null}

          {links.youtube ? (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<YouTubeIcon />}
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Showreel
            </Button>
          ) : null}
        </Stack>
      </AnimatedReveal>

      <AnimatedReveal delay={0.12}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            component="p"
            variant="body1"
            sx={{ color: 'text.secondary', userSelect: 'text' }}
          >
            {email}
          </Typography>
        </Box>
      </AnimatedReveal>
    </Section>
  )
}
