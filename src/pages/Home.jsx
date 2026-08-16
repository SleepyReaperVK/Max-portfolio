import HeroSection from '@/components/home/HeroSection'
import siteConfig from '@/content/siteConfig'

export default function Home() {
  return (
    <>
      <HeroSection
        name={siteConfig.name}
        role={siteConfig.role}
        tagline={siteConfig.tagline}
        ctas={[
          { label: 'View the case study', href: '/projects/pray-for-plagues', variant: 'contained' },
          { label: 'Get in touch', href: '#contact', variant: 'outlined' },
        ]}
        backgroundKey={siteConfig.media.heroBackground}
      />
      {/* MOUNT 2: ProjectsSection — Task 6 */}
      {/* MOUNT 3: AboutSection — Task 5 */}
      {/* MOUNT 4: SkillsSection — Task 5 */}
      {/* MOUNT 5: AvailabilitySection + ContactSection — Task 7 */}
    </>
  )
}
