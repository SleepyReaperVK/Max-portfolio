import ProjectsSection from '@/components/home/ProjectsSection'
import projects from '@/content/projects'
import siteConfig from '@/content/siteConfig'

// `projects[].cover` stores a siteConfig.media lookup key (e.g. "projectCover"),
// not a raw mediaManifest key — resolve it here so components stay content-free.
const resolvedProjects = projects.map((project) => ({
  ...project,
  cover: siteConfig.media[project.cover] || project.cover,
}))

export default function Home() {
  return (
    <>
      {/* MOUNT 1: HeroSection — Task 4 */}
      <ProjectsSection projects={resolvedProjects} />
      {/* MOUNT 3: AboutSection — Task 5 */}
      {/* MOUNT 4: SkillsSection — Task 5 */}
      {/* MOUNT 5: AvailabilitySection + ContactSection — Task 7 */}
    </>
  )
}
