import HeroSection from '@/components/home/HeroSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import AboutSection from '@/components/home/AboutSection'
import SkillsSection from '@/components/home/SkillsSection'
import about from '@/content/about'
import skills from '@/content/skills'
import projects from '@/content/projects'
import siteConfig from '@/content/siteConfig'
import mediaManifest from '@/content/mediaManifest'

const heroMedia = mediaManifest[siteConfig.media.heroBackground]

// `projects[].cover` stores a siteConfig.media lookup key (e.g. "projectCover"),
// not a raw mediaManifest key — resolve it here so components stay content-free.
const resolvedProjects = projects.map((project) => ({
  ...project,
  cover: siteConfig.media[project.cover] || project.cover,
}))

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
        backgroundSrc={heroMedia?.src}
        backgroundWidth={heroMedia?.width}
        backgroundHeight={heroMedia?.height}
      />
      <ProjectsSection projects={resolvedProjects} />
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
