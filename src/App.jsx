import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import PageLayout from '@/components/layout/PageLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import siteConfig from '@/content/siteConfig'

const PrayForPlagues = lazy(() => import('@/pages/PrayForPlagues'))

const NAV_LINKS = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'skills', label: 'Skills', href: '/#skills' },
  { id: 'availability', label: 'Availability', href: '/#availability' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
]

const Fallback = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
    <CircularProgress color="primary" />
  </Box>
)

export default function App() {
  return (
    <PageLayout navLinks={NAV_LINKS} siteConfig={siteConfig}>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/pray-for-plagues" element={<PrayForPlagues />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageLayout>
  )
}
