const levelDesign = {
  id: 'level-design',
  title: 'Level Design',
  summary:
    'A multi-floor dungeon built on looping pathways, unlockable shortcuts and escalating encounter pacing, drawing on Dark Souls traversal, Bloodborne’s Victorian setting and Devil May Cry’s gothic environments.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The level is a layered dungeon complex built for exploration, learning the space, and paced encounters. Three floors, each bringing new enemy types, environmental problems and routes. The top floor holds two boss arenas, and a huge sealed gate takes the player back down to the final boss chamber on the ground floor.',
        'Note: the level is not finished. The final boss section is still to be built.',
      ],
      media: [],
    },
    {
      heading: 'Prison Section',
      paragraphs: [
        'The dungeon runs straight into an adjacent prison section, which acts as the early-game area and a natural extension of the space.',
      ],
      media: [
        { key: 'level-design-prison-section', alt: 'Top-down navmesh view of the prison section, showing cyan AI navigation-mesh geometry and red AI-perception markers across the layout', caption: 'Prison Section — Navmesh / AI Pathing Coverage' },
      ],
    },
    {
      heading: 'Dungeon Section',
      paragraphs: [
        'Following classic Dark Souls layout thinking, the dungeon uses looping pathways and unlockable shortcuts so players can backtrack quickly and build a mental map of the place. The shortcuts pay off exploration and take the sting out of walking the same route again after a boss or a rough fight.',
        'Visually it leans hard on Bloodborne’s Victorian era and Devil May Cry’s gothic environments. The idea is that nowhere in it feels safe.',
        'The three floors break down like this. First floor: the first dungeon entrance, the main hall, the Idol of Death (an upgrade statue), a tunnel variant, and the second dungeon entrance. Second floor: its own entrance and a balcony on the left wing. Third floor: a bridge across to the right wing, a prayer room, and the entrance to a two-quarter chamber.',
        'Between the vertical progression, the interconnected routes, the environmental storytelling and where the fights are placed, the dungeon holds together as one space to explore, and it asks the same things of the player that the combat does.',
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
