import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'
import AnimatedReveal from '@/components/common/AnimatedReveal'

export default function SkillsSection({ skills = [] }) {
  const theme = useTheme()

  return (
    <Section id="skills" title="Skills" eyebrow="What I bring">
      <Grid container spacing={3}>
        {skills.map((skill, index) => (
          <Grid key={skill.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <AnimatedReveal delay={index * 0.06}>
              <Paper
                variant="outlined"
                sx={{
                  height: '100%',
                  p: 3,
                  borderColor: 'divider',
                  transition: theme.transitions.create(['border-color', 'transform'], {
                    duration: theme.custom.motion.fast,
                    easing: theme.custom.motion.easing,
                  }),
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Typography variant="h6" component="p" color="primary.main" sx={{ mb: 1 }}>
                  {skill.category?.toUpperCase()}
                </Typography>
                <Typography variant="h5" component="h3" sx={{ mb: 1.5 }}>
                  {skill.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {skill.blurb}
                </Typography>
              </Paper>
            </AnimatedReveal>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}
