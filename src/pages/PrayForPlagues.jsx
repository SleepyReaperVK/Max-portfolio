import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'
import MediaFrame from '@/components/common/MediaFrame'
import prayForPlagues from '@/content/prayForPlagues'

export default function PrayForPlagues() {
  const theme = useTheme()

  return (
    <Section id="case-study">
      <Typography variant="h1" gutterBottom>
        {prayForPlagues.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: theme.custom.maxTextWidth, mb: 4 }}>
        {prayForPlagues.tagline}
      </Typography>

      {/* Temporary MediaFrame smoke test for Task 3 — proves a real image key
          and a real video key both resolve through mediaManifest. A later
          task replaces this skeleton with the real case-study layout. */}
      <Stack spacing={4} sx={{ maxWidth: theme.custom.maxTextWidth }}>
        <MediaFrame
          mediaKey="hero-background"
          alt="Pray For Plagues gameplay screenshot"
          caption="Hero background image key"
          priority
        />
        <MediaFrame
          mediaKey="ai-boss-phase-1"
          alt="Boss AI phase one behavior demo"
          caption="Boss phase video key"
        />
      </Stack>
    </Section>
  )
}
