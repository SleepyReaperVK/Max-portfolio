import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import { useTheme, alpha } from '@mui/material/styles'
import MediaFrame from '../common/MediaFrame'

export default function ProjectCard({ project, featured = false }) {
  const theme = useTheme()
  const titleId = `project-title-${project.slug}`

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: 'divider',
        transition: theme.transitions.create(['transform', 'border-color', 'box-shadow'], {
          duration: theme.custom.motion.fast,
          easing: theme.custom.motion.easing,
        }),
        '&:hover, &:focus-within': {
          transform: `translateY(-${theme.spacing(0.5)})`,
          borderColor: alpha(theme.palette.primary.main, 0.6),
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={project.href}
        aria-labelledby={titleId}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: featured ? { xs: 'column', md: 'row' } : 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          '&.Mui-focusVisible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        <Box
          sx={{
            width: featured ? { xs: '100%', md: '60%' } : '100%',
            flexShrink: 0,
            display: 'flex',
            '& > div, & > div > div': { height: '100%' },
          }}
        >
          <MediaFrame mediaKey={project.cover} alt={`${project.title} cover art`} />
        </Box>
        <CardContent
          sx={{
            width: featured ? { xs: '100%', md: '40%' } : '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <Typography id={titleId} variant="h3" component="h3">
            {project.title}
          </Typography>
          <Typography variant="h6" component="p" sx={{ color: 'primary.main' }}>
            {project.tagline}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {project.summary}
          </Typography>
          <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
            {(project.tags ?? []).map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" size="small" />
            ))}
          </Stack>
          <Button
            component="span"
            variant="outlined"
            tabIndex={-1}
            aria-hidden="true"
            sx={{ mt: 1, pointerEvents: 'none' }}
          >
            Read the case study
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
