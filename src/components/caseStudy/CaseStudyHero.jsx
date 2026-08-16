import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useTheme, alpha } from '@mui/material/styles'
import MediaFrame from '@/components/common/MediaFrame'
import AnimatedReveal from '@/components/common/AnimatedReveal'

export default function CaseStudyHero({ title, tagline, heroKey, heroAlt, github }) {
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        minHeight: { xs: '58vh', md: '74vh' },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          '& > div, & > div > div': { height: '100%', width: '100%' },
        }}
      >
        <MediaFrame mediaKey={heroKey} alt={heroAlt} priority />
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.3)} 0%, ${alpha(theme.palette.background.default, 0.96)} 100%)`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: { xs: 12, md: 16 }, pb: { xs: 6, md: 9 } }}>
        <Stack spacing={2.5} sx={{ maxWidth: theme.custom.maxTextWidth }}>
          <Box
            component={RouterLink}
            to="/#work"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              width: 'fit-content',
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <ArrowBackIcon fontSize="small" />
            <Typography variant="body2" component="span">
              Back to work
            </Typography>
          </Box>

          <AnimatedReveal>
            <Typography variant="h1" component="h1">
              {title}
            </Typography>
          </AnimatedReveal>

          <AnimatedReveal delay={0.06}>
            <Typography variant="subtitle1" component="p" sx={{ color: 'text.secondary' }}>
              {tagline}
            </Typography>
          </AnimatedReveal>

          <AnimatedReveal delay={0.12}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component="a"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon />}
              sx={{ width: 'fit-content' }}
            >
              View on GitHub
            </Button>
          </AnimatedReveal>
        </Stack>
      </Container>
    </Box>
  )
}
