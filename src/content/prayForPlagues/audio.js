const audio = {
  id: 'audio',
  title: 'Audio & Feedback Systems',
  summary:
    'Dynamic audio and visual feedback systems — a reactive boss soundtrack manager, surface-aware footsteps, and combat hit VFX/SFX — that reinforce clarity, impact, and emotional pacing across combat and exploration.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The Audio & Feedback Systems are designed to reinforce clarity, impact, and emotional pacing throughout combat and exploration. These systems combine dynamic audio behavior with responsive visual feedback to ensure that every action — whether a footstep, a weapon strike, or a boss phase transition — feels grounded and intentional. Each sound effect is followed with optional visual effects or decals that are applied on the player, enemy, or world.',
        'In order to showcase all mentioned systems, the full gameplay video demonstrates all of them coming into play together.',
      ],
      media: [],
    },
    {
      heading: 'Dynamic Boss Soundtrack Manager',
      paragraphs: [
        'A key component is the Dynamic Soundtrack Manager, which controls music transitions during boss encounters. The manager monitors boss health thresholds and phase changes, seamlessly shifting between soundtrack layers to match the intensity of the fight. This creates a reactive audio experience where music escalates as the encounter becomes more dangerous, enhancing tension and player immersion.',
      ],
      media: [
        { key: 'audio-boss-soundtrack-manager', alt: 'BP_DarkKnight_MusicManager blueprint showing Phase1Audio, Phase2Audio, and TransitionToPhase2Audio properties', caption: 'Dynamic Boss Soundtrack Manager' },
      ],
    },
    {
      heading: 'Dynamic Footstep System',
      paragraphs: [
        'Moment-to-moment feedback is supported by the Dynamic Footstep System, which adjusts sound effects, particle effects, and decals based on the surface the player is walking on. Each material type — stone, dirt, metal, water — triggers its own audio and visual response, making movement feel connected to the environment and improving spatial awareness.',
      ],
      media: [
        { key: 'audio-dynamic-footstep', alt: 'Footstep Data Asset entry for the Stone surface tag, defining its Foot Step Run Sound, FX, and Decal', caption: 'Dynamic Footstep System' },
      ],
    },
    {
      heading: 'Dynamic Combat Hit VFX/SFX and Camera Shake',
      paragraphs: [
        'Combat feedback is tightly integrated with the damage pipeline. Successful hits trigger distinct impact sounds and VFX, while parries and counterattacks play unique audio cues to emphasize timing and mastery. These responses are driven by gameplay events, animation notifies, and customizable sound cues, ensuring that audio and visual feedback remain perfectly synchronized with combat actions.',
      ],
      media: [],
    },
  ],
}

export default audio
