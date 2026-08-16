import AboutSection from '@/components/home/AboutSection'
import SkillsSection from '@/components/home/SkillsSection'
import about from '@/content/about'
import skills from '@/content/skills'
import siteConfig from '@/content/siteConfig'

export default function Home() {
  return (
    <>
      {/* MOUNT 1: HeroSection — Task 4 */}
      {/* MOUNT 2: ProjectsSection — Task 6 */}
      <AboutSection
        heading={about.heading}
        paragraphs={about.paragraphs}
        portraitKey={about.portrait}
        portraitAlt={`Portrait of ${siteConfig.name}`}
      />
      <SkillsSection skills={skills} />
      {/* MOUNT 5: AvailabilitySection + ContactSection — Task 7 */}
    </>
  )
}
