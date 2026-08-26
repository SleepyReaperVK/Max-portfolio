import combat from './combat'
import ai from './ai'
import interaction from './interaction'
import inventory from './inventory'
import audio from './audio'
import levelDesign from './levelDesign'

const prayForPlagues = {
  slug: 'pray-for-plagues',
  title: 'Pray For Plagues',
  tagline: 'Action RPG Souls-Borne Prototype — Unreal Engine 5',
  hero: { src: 'caseStudyHero', alt: 'Pray For Plagues gameplay screenshot' },
  stats: [
    { label: 'Engine', value: 'Unreal Engine 5' },
    { label: 'Languages', value: 'C++ / Blueprints' },
    { label: 'Role', value: 'Solo developer' },
    { label: 'Foundation', value: 'GAS + attribute system' },
    { label: 'Tools', value: 'Blender' },
    { label: 'Started', value: '2024' },
  ],
  summary: [
    'A Souls-borne action RPG built around deliberate combat, punishing encounters and systemic gameplay interactions. I wanted the core pillars of the genre: weighty animations, tight timing windows, readable telegraphs and enemies that actually think. And I wanted the systems underneath to stay clean enough to keep extending.',
    'It runs on Unreal Engine 5, built with C++, Blueprints and Blender, and leans heavily on GAS and its attribute system as a foundation.',
  ],
  // The "Video Gameplay" block from the Notion Project Overview page. The
  // facade poster deliberately reuses a self-hosted gameplay clip instead of
  // YouTube's thumbnail — see GameplayVideo.jsx for why.
  gameplay: {
    youtubeId: 'SOW6vvANuUc',
    url: 'https://www.youtube.com/watch?v=SOW6vvANuUc',
    title: 'Pray-For-Plagues Project Gameplay (Dark Knight Boss Fight)',
    poster: {
      key: 'ai-boss-phase-1',
      alt: 'Play the Pray For Plagues gameplay video — the Dark Knight boss fight',
    },
  },
  contributions: [
    { area: 'Gameplay Engineering', items: ['Interaction System', 'Inventory System', 'Dynamic Footstep System', 'Object Destruction System'] },
    { area: 'AI Engineering', items: ['AI Attack Manager', 'Telegraphing System', 'AOE & regular damage', 'Boss behavior logic', 'AI hit reactions', 'Close- and long-range enemies', 'Built on EQS & Behavior Trees'] },
    { area: 'Level Design', items: ['Three-level dungeon', 'Encounter design', 'Environmental interaction integration'] },
    { area: 'Combat System Engineering', items: ['Weapon framework', 'Attack chains & special attacks', 'Damage multipliers', 'Parry system', 'Hit reaction system', 'Dodge system', 'Projectile spawn'] },
    { area: 'Audio & Feedback Systems', items: ['Dynamic boss soundtrack manager'] },
    { area: 'UI & Player Feedback', items: ['Player overlay UI', 'Standard enemy health bar system', 'Visibility rules', 'Unique boss UI with title display'] },
  ],
  systems: [combat, ai, interaction, inventory, audio, levelDesign],
  github: 'https://github.com/Maxer1189/Souls-like_GameProject',
}

export default prayForPlagues
