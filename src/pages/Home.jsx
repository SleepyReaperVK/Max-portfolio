import AvailabilitySection from '@/components/home/AvailabilitySection'
import ContactSection from '@/components/home/ContactSection'
import siteConfig from '@/content/siteConfig'

export default function Home() {
  return (
    <>
      {/* MOUNT 1: HeroSection — Task 4 */}
      {/* MOUNT 2: ProjectsSection — Task 6 */}
      {/* MOUNT 3: AboutSection — Task 5 */}
      {/* MOUNT 4: SkillsSection — Task 5 */}
      <AvailabilitySection
        modes={siteConfig.availability.modes}
        location={siteConfig.location}
        note={siteConfig.availability.note}
      />
      <ContactSection email={siteConfig.email} links={siteConfig.links} cv={siteConfig.cv} />
    </>
  )
}
