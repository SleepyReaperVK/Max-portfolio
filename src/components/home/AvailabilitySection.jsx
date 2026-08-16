import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import PublicIcon from '@mui/icons-material/Public'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import { useTheme } from '@mui/material/styles'
import Section from '@/components/common/Section'
import AnimatedReveal from '@/components/common/AnimatedReveal'

const MODE_ICONS = {
  Hybrid: HomeWorkIcon,
  Remote: PublicIcon,
  Relocation: FlightTakeoffIcon,
}

export default function AvailabilitySection({ modes, location, note }) {
  const theme = useTheme()

  return (
    <Section
      id="availability"
      eyebrow="Availability"
      title="Open to hybrid, remote, and relocation"
      sx={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        bgcolor: 'background.paper',
        borderTop: '2px solid',
        borderBottom: '2px solid',
        borderColor: 'primary.main',
      }}
    >
      <AnimatedReveal>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ flexWrap: 'wrap', mb: { xs: 3, md: 4 } }}
        >
          {modes.map((mode) => {
            const Icon = MODE_ICONS[mode]
            return (
              <Chip
                key={mode}
                icon={Icon ? <Icon /> : undefined}
                label={mode}
                color="primary"
                variant="outlined"
                sx={{
                  fontSize: theme.typography.h6.fontSize,
                  py: 3,
                  px: 1,
                  '& .MuiChip-icon': { fontSize: theme.typography.h5.fontSize },
                }}
              />
            )
          })}
        </Stack>
      </AnimatedReveal>

      <AnimatedReveal delay={0.06}>
        <Typography
          variant="subtitle1"
          component="p"
          color="text.secondary"
          sx={{ maxWidth: theme.custom.maxTextWidth, mb: { xs: 4, md: 5 } }}
        >
          {note || `Based in ${location} and open to opportunities abroad and relocation.`}
        </Typography>
      </AnimatedReveal>

      <AnimatedReveal delay={0.12}>
        <Box>
          <Button variant="contained" color="primary" size="large" href="#contact">
            Get in touch
          </Button>
        </Box>
      </AnimatedReveal>
    </Section>
  )
}
