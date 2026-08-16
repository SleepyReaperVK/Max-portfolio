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
    'This project is a Souls-borne inspired action RPG built around deliberate combat, punishing enemy encounters, and systemic gameplay interactions. The goal is to recreate the core pillars of the genre — weighty animations, precise timing windows, readable telegraphs, and intelligent enemy behavior — while building the underlying systems in a clean, extensible engineering architecture.',
    'The game is developed in Unreal Engine 5, using a combination of C++, Blueprints and Blender, where its foundation is heavily built around GAS and its attribute system.',
  ],
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
