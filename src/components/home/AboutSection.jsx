import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'
import Section from '@/components/common/Section'
import AnimatedReveal from '@/components/common/AnimatedReveal'
import MediaFrame from '@/components/common/MediaFrame'

export default function AboutSection({ heading, paragraphs = [], portraitKey }) {
  const theme = useTheme()

  return (
    <Section id="about" title={heading}>
      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <AnimatedReveal>
            <Box sx={{ maxWidth: theme.custom.maxTextWidth }}>
              {paragraphs.map((paragraph, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: index === paragraphs.length - 1 ? 0 : 2.5 }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </AnimatedReveal>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnimatedReveal delay={0.06}>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                transition: theme.transitions.create(['box-shadow', 'transform', 'border-color'], {
                  duration: theme.custom.motion.fast,
                  easing: theme.custom.motion.easing,
                }),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'primary.main',
                  boxShadow: `0 0 ${theme.spacing(3)} ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              <MediaFrame mediaKey={portraitKey} alt="Portrait of Max Masarski" ratio="4 / 5" />
            </Box>
          </AnimatedReveal>
        </Grid>
      </Grid>
    </Section>
  )
}
