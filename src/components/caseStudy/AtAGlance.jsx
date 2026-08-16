import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ASSUMPTION: divider placement below is hand-derived for exactly 6 stats at
// 2 cols (xs) / 3 cols (sm) / 6 cols (md+) — correct only at that count.
// `prayForPlagues.stats` is fixed content (6 entries); if that ever changes,
// this index-based border math needs to be redone for the new column counts.
export default function AtAGlance({ stats = [] }) {
  return (
    <Grid
      container
      spacing={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}
    >
      {stats.map((stat, index) => (
        <Grid
          key={stat.label}
          size={{ xs: 6, sm: 4, md: 2 }}
          sx={{
            p: { xs: 2, md: 3 },
            borderColor: 'divider',
            borderLeftStyle: 'solid',
            borderTopStyle: 'solid',
            borderLeftWidth: {
              xs: index % 2 === 0 ? 0 : 1,
              sm: index % 3 === 0 ? 0 : 1,
              md: index === 0 ? 0 : 1,
            },
            borderTopWidth: {
              xs: index >= 2 ? 1 : 0,
              sm: index >= 3 ? 1 : 0,
              md: 0,
            },
          }}
        >
          <Typography
            variant="h6"
            component="p"
            sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}
          >
            {stat.label}
          </Typography>
          <Typography variant="h5" component="p">
            {stat.value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}
