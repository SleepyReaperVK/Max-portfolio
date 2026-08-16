import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'
import AnimatedReveal from '@/components/common/AnimatedReveal'
import CaseStudyHero from '@/components/caseStudy/CaseStudyHero'
import AtAGlance from '@/components/caseStudy/AtAGlance'
import SystemNav from '@/components/caseStudy/SystemNav'
import SystemBreakdown from '@/components/caseStudy/SystemBreakdown'
import Lightbox from '@/components/caseStudy/Lightbox'
import prayForPlagues from '@/content/prayForPlagues'
import siteConfig from '@/content/siteConfig'
import mediaManifest from '@/content/mediaManifest'

// `prayForPlagues.hero.src` stores a siteConfig.media lookup key ("caseStudyHero"),
// not a raw mediaManifest key — resolve it here so components stay content-free.
const heroKey = siteConfig.media[prayForPlagues.hero.src] || prayForPlagues.hero.src

export default function PrayForPlagues() {
  const theme = useTheme()
  const [lightbox, setLightbox] = useState({ items: [], index: 0, open: false })

  const handleOpenMedia = (items, index) => {
    const resolved = items.map((item) => ({ ...item, ...mediaManifest[item.key] }))
    setLightbox({ items: resolved, index, open: true })
  }

  const handleCloseLightbox = () => setLightbox((prev) => ({ ...prev, open: false }))
  const handleNavigateLightbox = (nextIndex) => setLightbox((prev) => ({ ...prev, index: nextIndex }))

  return (
    <Box>
      <CaseStudyHero
        title={prayForPlagues.title}
        tagline={prayForPlagues.tagline}
        heroKey={heroKey}
        heroAlt={prayForPlagues.hero.alt}
        github={prayForPlagues.github}
      />

      <Section id="at-a-glance" dense>
        <AtAGlance stats={prayForPlagues.stats} />
      </Section>

      <Section id="overview" eyebrow="Overview" title="About the Project">
        <Box sx={{ maxWidth: theme.custom.maxTextWidth }}>
          {prayForPlagues.summary.map((paragraph, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{ color: 'text.secondary', mb: index === prayForPlagues.summary.length - 1 ? 0 : 2.5 }}
            >
              {paragraph}
            </Typography>
          ))}
        </Box>
      </Section>

      <Section id="contributions" eyebrow="My Role" title="Role & Contributions">
        <Grid container spacing={3}>
          {prayForPlagues.contributions.map((contribution, index) => (
            <Grid key={contribution.area} size={{ xs: 12, sm: 6, md: 4 }}>
              <AnimatedReveal delay={Math.min(index * 0.04, 0.16)}>
                <Box sx={{ height: '100%', p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ mb: 1.5 }}>
                    {contribution.area}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 3, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {contribution.items.map((item) => (
                      <Typography key={item} component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </AnimatedReveal>
            </Grid>
          ))}
        </Grid>
      </Section>

      <Box component="section" id="systems" aria-label="System breakdowns" sx={{ py: theme.custom.section.paddingBlock }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            {/* Hide the grid cell itself (not just SystemNav's inner content) below
                `lg` — hiding only the child would still leave an empty cell
                contributing a `spacing` gap above the first system. */}
            <Grid size={{ xs: 12, lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
              <SystemNav systems={prayForPlagues.systems} />
            </Grid>
            <Grid size={{ xs: 12, lg: 9 }} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
              {prayForPlagues.systems.map((system, index) => (
                <SystemBreakdown key={system.id} system={system} index={index} onOpenMedia={handleOpenMedia} />
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Section id="get-in-touch" title="Interested in working together?">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component="a"
            href={prayForPlagues.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </Button>
          <Button variant="contained" color="primary" size="large" component={RouterLink} to="/#contact">
            Get in touch
          </Button>
        </Box>
      </Section>

      <Lightbox
        items={lightbox.items}
        index={lightbox.index}
        open={lightbox.open}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />
    </Box>
  )
}
