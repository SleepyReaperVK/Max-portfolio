const siteConfig = {
  name: 'Max Masarski',
  role: 'Gameplay Programmer (Unreal Engine 5)',
  tagline:
    'Building expressive, systemic action gameplay — melee combat, AI behavior, animation-driven mechanics, and modular ability systems.',
  email: 'maxer.masarski@gmail.com',
  location: 'Israel',
  availability: {
    modes: ['Hybrid', 'Remote', 'Relocation'],
    note: 'Based in Israel and open to opportunities abroad and relocation.',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/max-masarski-86256b222/',
    github: 'https://github.com/Maxer1189/Souls-like_GameProject',
    // PLACEHOLDER: paste the showreel URL here; the showreel block stays hidden while this is empty
    youtube: '',
  },
  cv: {
    // PLACEHOLDER: set enabled to true once the PDF is dropped at public/cv/max-masarski-cv.pdf
    enabled: false,
    path: '/cv/max-masarski-cv.pdf',
    label: 'Download CV',
  },
  seo: {
    title: 'Max Masarski — Gameplay Programmer (Unreal Engine 5)',
    description:
      'Portfolio of Max Masarski, a gameplay programmer specializing in melee combat, AI behavior, and modular ability systems in Unreal Engine 5. Featuring Pray For Plagues, a Souls-borne action RPG prototype.',
    ogImage: '/media/og-cover.jpg',
  },
  media: {
    heroBackground: 'hero-background', // the main gameplay screenshot from the Notion landing page
    portrait: 'portrait', // Max's photo
    projectCover: 'project-cover', // Pray For Plagues card cover
    caseStudyHero: 'case-study-hero', // case study page hero image
    ogCover: 'og-cover', // social share image
  },
}

export default siteConfig
