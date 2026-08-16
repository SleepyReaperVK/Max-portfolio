const levelDesign = {
  id: 'level-design',
  title: 'Level Design',
  summary:
    'A multi-floor dungeon complex built around looping pathways, unlockable shortcuts, and escalating encounter pacing — inspired by Dark Souls traversal, Bloodborne’s Victorian setting, and Devil May Cry’s gothic environments.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The level design is structured around a multi-layered dungeon complex that emphasizes exploration, spatial mastery, and deliberate encounter pacing. The dungeon consists of three floors, each introducing new enemy types, environmental challenges, and traversal opportunities. The top floor houses two boss arenas, while a massive sealed gate leads players downward to the final boss chamber located on the ground floor, creating a clear sense of progression and escalating tension.',
        'Disclaimer: the level is not fully complete — the final boss section will be made later down the line.',
      ],
      media: [],
    },
    {
      heading: 'Prison Section',
      paragraphs: [
        'The dungeon connects seamlessly to an adjacent prison section, which serves as an early-game area and a natural extension of the dungeon’s narrative and spatial flow.',
      ],
      media: [
        { key: 'level-design-prison-section', alt: 'Top-down navmesh view of the prison section, showing cyan AI navigation-mesh geometry and red AI-perception markers across the layout', caption: 'Prison Section — Navmesh / AI Pathing Coverage' },
      ],
    },
    {
      heading: 'Dungeon Section',
      paragraphs: [
        'Inspired by classic Dark Souls design principles, the dungeon incorporates looping pathways and unlockable shortcuts that allow players to backtrack efficiently and create mental maps of the environment. These shortcuts reward exploration and reduce friction during repeated traversal, especially after boss defeats or difficult encounters.',
        'The level itself is heavily inspired by Bloodborne’s Victorian era theme and Devil May Cry’s gothic environment, giving players an eerie and chilling experience, where nowhere is safe as death lurks in the shadows.',
        'The dungeon spans three floors. The first floor includes the first dungeon entrance, the main hall, the Idol of Death (an upgrade statue), a tunnel variant, and the second dungeon entrance. The second floor includes its own entrance and a balcony on the left wing. The third floor includes a bridge connecting to the right wing, a prayer room, and the entrance to a two-quarter chamber.',
        'Overall, the dungeon’s design combines vertical progression, interconnected pathways, environmental storytelling, and strategic encounter placement to deliver a cohesive, challenging, and exploration-driven experience that aligns with the game’s core combat philosophy.',
      ],
      media: [
        { key: 'level-design-first-floor-entrance', alt: 'First floor dungeon entrance', caption: 'First Floor — First Dungeon Entrance' },
        { key: 'level-design-first-floor-main-hall', alt: 'First floor main hall', caption: 'First Floor — Main Hall' },
        { key: 'level-design-first-floor-idol-of-death', alt: 'A candle-lit rest nook on the first floor with a round table holding a candelabra, a bottle, and a mug', caption: 'First Floor — Rest Nook' },
        { key: 'level-design-first-floor-tunnel', alt: 'First floor tunnel variant', caption: 'First Floor — Tunnel Variant 1' },
        { key: 'level-design-first-floor-second-entrance', alt: 'Second dungeon entrance on the first floor', caption: 'First Floor — Second Dungeon Entrance' },
        { key: 'level-design-second-floor-entrance', alt: 'Second floor entrance', caption: 'Second Floor — Second Floor Entrance' },
        { key: 'level-design-second-floor-balcony', alt: 'Second floor balcony on the left wing', caption: 'Second Floor — Balcony (Left Wing)' },
        { key: 'level-design-third-floor-bridge', alt: 'Third floor bridge connecting to the right wing', caption: 'Third Floor — Bridge Connecting To The Right Wing' },
        { key: 'level-design-third-floor-prayer-room', alt: 'Third floor prayer room', caption: 'Third Floor — Prayer Room' },
        { key: 'level-design-third-floor-chamber-entrance', alt: 'Third floor entrance to the two-quarter chamber', caption: 'Third Floor — 2 Quarter Chamber Entrance' },
        { key: 'level-design-dungeon-environment-1', alt: 'Dungeon corridor showing the gothic, Victorian-inspired environment art', caption: 'Dungeon Section' },
        { key: 'level-design-dungeon-environment-2', alt: 'Dungeon interior showing the gothic, Victorian-inspired environment art', caption: 'Dungeon Section' },
        { key: 'level-design-dungeon-environment-3', alt: 'Dungeon chamber showing the gothic, Victorian-inspired environment art', caption: 'Dungeon Section' },
      ],
    },
  ],
}

export default levelDesign
