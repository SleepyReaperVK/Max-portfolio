import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTheme, alpha } from '@mui/material/styles'

export default function Lightbox({ items = [], index = 0, open, onClose, onNavigate }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const total = items.length
  const item = items[index]

  const goTo = (nextIndex) => {
    if (!total) return
    onNavigate((nextIndex + total) % total)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(total - 1)
    }
  }

  if (!open || !item) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      onKeyDown={handleKeyDown}
      slotProps={{
        backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.92) } },
      }}
    >
      <DialogContent sx={{ position: 'relative', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', top: theme.spacing(1), right: theme.spacing(1), zIndex: 1, color: 'text.primary' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, md: 2 } }}>
          {total > 1 ? (
            <IconButton aria-label="Previous media" onClick={() => goTo(index - 1)} sx={{ color: 'text.primary' }}>
              <ChevronLeftIcon />
            </IconButton>
          ) : null}

          <Box sx={{ width: '100%', maxWidth: theme.spacing(120) }}>
            {item.type === 'video' ? (
              <Box
                component="video"
                key={item.key}
                controls
                loop
                playsInline
                poster={item.poster}
                width={item.width}
                height={item.height}
                aria-label={item.alt}
                sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: 1 }}
              >
                <source src={item.src} type="video/mp4" />
                Your browser does not support embedded video.
              </Box>
            ) : (
              <Box
                component="img"
                key={item.key}
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: 1 }}
              />
            )}

            {item.caption ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                {item.caption}
              </Typography>
            ) : null}
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              {index + 1} of {total}
            </Typography>
          </Box>

          {total > 1 ? (
            <IconButton aria-label="Next media" onClick={() => goTo(index + 1)} sx={{ color: 'text.primary' }}>
              <ChevronRightIcon />
            </IconButton>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
