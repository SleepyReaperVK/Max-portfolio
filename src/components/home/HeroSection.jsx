import { Link as RouterLink } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTheme, alpha } from '@mui/material/styles'
import AnimatedReveal from '../common/AnimatedReveal'

export default function HeroSection({
  name,
  role,
  tagline,
  ctas = [],
  backgroundSrc,
  backgroundWidth,
  backgroundHeight,
}) {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minHeight: { xs: '88vh', md: '92vh' },
        overflow: 'hidden',
      }}
    >
      {backgroundSrc ? (
        <Box
          component="img"
          src={backgroundSrc}
          width={backgroundWidth}
          height={backgroundHeight}
          alt=""
          loading="eager"
          decoding="async"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
      ) : null}

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.78)} 0%, ${alpha(theme.palette.background.default, 0.94)} 100%)`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack
          spacing={3}
          sx={{
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <AnimatedReveal delay={0}>
            <Typography variant="h6" component="p" sx={{ color: 'primary.main' }}>
              {role}
            </Typography>
          </AnimatedReveal>

          <AnimatedReveal delay={0.08}>
            <Typography variant="h1" component="h1">
              {name}
            </Typography>
          </AnimatedReveal>

          <AnimatedReveal delay={0.16}>
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ color: 'text.secondary', maxWidth: theme.custom.maxTextWidth }}
            >
              {tagline}
            </Typography>
          </AnimatedReveal>

          <AnimatedReveal delay={0.24}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              {ctas.map((cta) => {
                const isHash = cta.href.startsWith('#')
                return (
                  <Button
                    key={cta.label}
                    variant={cta.variant}
                    color="primary"
                    size="large"
                    component={isHash ? 'a' : RouterLink}
                    href={isHash ? cta.href : undefined}
                    to={isHash ? undefined : cta.href}
                  >
                    {cta.label}
                  </Button>
                )
              })}
            </Stack>
          </AnimatedReveal>
        </Stack>
      </Container>

      {!reduceMotion ? (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            bottom: theme.spacing(4),
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            color: 'text.secondary',
            display: 'flex',
            animation: `hero-scroll-cue ${theme.custom.motion.slow * 2}ms ${theme.custom.motion.easing} infinite`,
            '@keyframes hero-scroll-cue': {
              '0%, 100%': { transform: 'translate(-50%, 0)' },
              '50%': { transform: `translate(-50%, ${theme.spacing(1)})` },
            },
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </Box>
      ) : null}
    </Box>
  )
}
