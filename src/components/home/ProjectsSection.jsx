import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Section from '../common/Section'
import AnimatedReveal from '../common/AnimatedReveal'
import ProjectCard from './ProjectCard'

export default function ProjectsSection({ projects }) {
  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <Section id="work" eyebrow="Featured project" title="Selected work">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>
        {featuredProjects.map((project, index) => (
          <AnimatedReveal key={project.slug} delay={index * 0.06}>
            <ProjectCard project={project} featured />
          </AnimatedReveal>
        ))}
        {otherProjects.length ? (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {otherProjects.map((project, index) => (
              <Grid key={project.slug} size={{ xs: 12, sm: 6 }}>
                <AnimatedReveal delay={index * 0.06}>
                  <ProjectCard project={project} />
                </AnimatedReveal>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </Section>
  )
}
