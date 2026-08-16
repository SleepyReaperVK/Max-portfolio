import AboutSection from '@/components/home/AboutSection'
import SkillsSection from '@/components/home/SkillsSection'
import about from '@/content/about'
import skills from '@/content/skills'

export default function Home() {
  return (
    <>
      {/* MOUNT 1: HeroSection — Task 4 */}
      {/* MOUNT 2: ProjectsSection — Task 6 */}
      <AboutSection heading={about.heading} paragraphs={about.paragraphs} portraitKey={about.portrait} />
      <SkillsSection skills={skills} />
      {/* MOUNT 5: AvailabilitySection + ContactSection — Task 7 */}
    </>
  )
}
