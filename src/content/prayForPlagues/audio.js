const audio = {
  id: 'audio',
  title: 'Audio & Feedback Systems',
  summary:
    'Audio and visual feedback: a reactive boss soundtrack manager, surface-aware footsteps and combat hit VFX/SFX, all working on clarity, impact and pacing in combat and exploration.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'These systems carry clarity, impact and pacing through combat and exploration. Audio behavior and visual feedback are built together so a footstep, a weapon strike or a boss phase change all land as deliberate. Sounds can be paired with VFX or decals applied to the player, the enemy or the world.',
        'The full gameplay video is the best place to see all of these working at once.',
      ],
      media: [],
    },
    {
      heading: 'Dynamic Boss Soundtrack Manager',
      paragraphs: [
        'The Dynamic Soundtrack Manager handles music transitions during boss fights. It watches boss health thresholds and phase changes and moves between soundtrack layers to match how the fight is going, so the music climbs as the encounter gets more dangerous.',
      ],
      media: [
        { key: 'audio-boss-soundtrack-manager', alt: 'BP_DarkKnight_MusicManager blueprint showing Phase1Audio, Phase2Audio, and TransitionToPhase2Audio properties', caption: 'Dynamic Boss Soundtrack Manager' },
      ],
    },
    {
      heading: 'Dynamic Footstep System',
      paragraphs: [
        'The Dynamic Footstep System handles moment-to-moment feedback, swapping sounds, particles and decals based on the surface underfoot. Stone, dirt, metal and water each get their own audio and visual response, which ties movement to the environment and helps the player place themselves in it.',
      ],
      media: [
        { key: 'audio-dynamic-footstep', alt: 'Footstep Data Asset entry for the Stone surface tag, defining its Foot Step Run Sound, FX, and Decal', caption: 'Dynamic Footstep System' },
      ],
    },
    {
      heading: 'Dynamic Combat Hit VFX/SFX and Camera Shake',
      paragraphs: [
        'Combat feedback hangs off the damage pipeline. A landed hit fires its own impact sound and VFX; parries and counterattacks get their own cues so good timing sounds like good timing. All of it is driven by gameplay events, animation notifies and configurable sound cues, which keeps the audio and visuals in step with the action.',
      ],
      media: [],
    },
  ],
}

export default audio
