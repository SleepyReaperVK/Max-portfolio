import Grid from '@mui/material/Grid'
import MediaFrame from '@/components/common/MediaFrame'

export default function MediaGallery({ items = [], onOpen }) {
  if (!items.length) return null

  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid key={item.key} size={{ xs: 12, md: 6 }}>
          <MediaFrame
            mediaKey={item.key}
            alt={item.alt}
            caption={item.caption}
            onClick={onOpen ? () => onOpen(index) : undefined}
          />
        </Grid>
      ))}
    </Grid>
  )
}
