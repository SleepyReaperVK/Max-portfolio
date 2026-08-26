const interaction = {
  id: 'interaction',
  title: 'Interaction System',
  summary:
    'A modular framework for interacting with world objects: pickups, doors, chests and notes. Everything runs through one interaction interface, so a new interactable type needs no changes to core logic.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The interaction system covers everything the player can touch in the world, from a simple pickup to an inspectable item to environment pieces like doors and chests. It stays lightweight and data-driven, and adding to it does not mean touching core logic.',
        'Every interactable implements one shared interaction interface. When the player enters an interaction zone or targets an object, the system checks for that interface and works out which interaction applies. One piece of player logic then handles every category, and object-specific behavior stays where it belongs.',
        'Animations for opening doors and chests, and for climbing ladders, are still to come.',
      ],
      media: [],
    },
    {
      heading: 'World Interaction',
      paragraphs: [
        'The player interacting with the different object types: picking up items, opening doors, opening locked doors, reading a note and opening a chest.',
        'A locked door checks the player’s inventory for an item under a specified tag before it will open.',
        'Chests can be locked the same way and need the right item to open. Later on some may want other conditions instead, currency for example.',
      ],
      media: [
        { key: 'interaction-pickup-item', alt: 'Player picking up an item in the world', caption: 'Picking Up Items' },
        { key: 'interaction-open-door', alt: 'Player opening a door', caption: 'Opening Doors' },
        { key: 'interaction-open-locked-door', alt: 'Player opening a locked door that requires a tagged inventory item', caption: 'Opening Locked Doors' },
        { key: 'interaction-inspect-note', alt: 'Player inspecting a readable note', caption: 'Inspecting A Note' },
        { key: 'interaction-open-chest', alt: 'Player opening a chest', caption: 'Opening A Chest' },
      ],
    },
    {
      heading: 'Interaction And Player State',
      paragraphs: [
        'As covered in the combat breakdown, equipping a different weapon type changes the player’s state, and the pickup animations follow it. The animation played depends on what is equipped and how high the item sits. Right now this only applies to picking items up.',
      ],
      media: [
        { key: 'interaction-pickup-heavy-weapon', alt: 'Player picking up an item while equipped with a heavy weapon, using the matching pickup animation', caption: 'Player Item Pickup While Equipped With Heavy Weapon' },
      ],
    },
    {
      heading: 'Using Items',
      paragraphs: [
        'Using items is not wired into GAS in this project yet. That comes later.',
        'On the whole it is a flexible base for world interactivity that handles simple and complex objects without getting muddy or hard to extend.',
      ],
      media: [],
    },
  ],
}

export default interaction
