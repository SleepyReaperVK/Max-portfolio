import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import SectionHeading from '@/components/common/SectionHeading'
import AnimatedReveal from '@/components/common/AnimatedReveal'
import MediaGallery from './MediaGallery'

export default function SystemBreakdown({ system, index = 0, onOpenMedia }) {
  const theme = useTheme()
  const alternate = index % 2 === 1

  return (
    <Box
      component="section"
      id={system.id}
      sx={{
        py: { xs: 5, md: 8 },
        px: { xs: 2, md: 4 },
        borderRadius: 2,
        scrollMarginTop: theme.custom.navbarHeight,
        bgcolor: alternate ? 'background.paper' : 'transparent',
      }}
    >
      <SectionHeading eyebrow="System" title={system.title} />

      <Typography
        variant="subtitle1"
        component="p"
        sx={{ color: 'text.secondary', maxWidth: theme.custom.maxTextWidth, mb: { xs: 4, md: 6 } }}
      >
        {system.summary}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 5, md: 7 } }}>
        {system.sections.map((section, sectionIndex) => (
          <AnimatedReveal key={section.heading} delay={Math.min(sectionIndex * 0.03, 0.18)}>
            <Box>
              <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
                {section.heading}
              </Typography>

              <Box sx={{ maxWidth: theme.custom.maxTextWidth, mb: section.media?.length ? 3 : 0 }}>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <Typography
                    key={paragraphIndex}
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: paragraphIndex === section.paragraphs.length - 1 ? 0 : 2,
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>

              {section.media?.length ? (
                <MediaGallery
                  items={section.media}
                  onOpen={(mediaIndex) => onOpenMedia(section.media, mediaIndex)}
                />
              ) : null}
            </Box>
          </AnimatedReveal>
        ))}
      </Box>
    </Box>
  )
}
