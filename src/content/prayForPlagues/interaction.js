const interaction = {
  id: 'interaction',
  title: 'Interaction System',
  summary:
    'A modular, extensible framework for interacting with world objects — pickups, doors, chests, and notes — built on a unified interaction interface so new interactable types require no changes to core logic.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The interaction system is built as a modular, extensible framework that allows the player to interact with a wide range of world objects — from simple pickups to complex inspectable items and actionable environment elements such as doors and chests. The system is designed to be lightweight, data-driven, and easy to expand without modifying core logic.',
        'At its core, the system uses a unified interaction interface that all interactable objects implement. When the player enters an interaction zone or targets an object, the system checks for this interface and determines the appropriate interaction type. This allows the same player logic to support multiple categories of interactions while keeping object-specific behavior isolated and clean.',
        'Animation for opening doors and chests, as well as ladder climbing, is planned for a future implementation.',
      ],
      media: [],
    },
    {
      heading: 'World Interaction',
      paragraphs: [
        'A showcase of the player interacting with different types of objects within the world: picking up items, opening doors, opening locked doors, inspecting a note, and opening a chest.',
        'The door requests an item labeled under a specified tag to be present within the player’s inventory in order to be operated.',
        'Chests can be locked as doors are and require certain items to open. In a future implementation, some chests might require other conditions to unlock, such as currency.',
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
      heading: 'Player Interaction depending on his state',
      paragraphs: [
        'As has been showcased in the combat breakdown section, the player can equip different types of weapons, which changes his state. Along with that, his pickup animations adapt with the change: depending on the equipped item and the item’s elevation, different animations will be played. Currently this is supported only for picking up items.',
      ],
      media: [
        { key: 'interaction-pickup-heavy-weapon', alt: 'Player picking up an item while equipped with a heavy weapon, using the matching pickup animation', caption: 'Player Item Pickup While Equipped With Heavy Weapon' },
      ],
    },
    {
      heading: 'Using Items',
      paragraphs: [
        'Currently, item usability is not supported by the GAS system within this project; it will be implemented down the line.',
        'Overall, the interaction system provides a flexible foundation for world interactivity, supporting both simple and complex objects while maintaining clarity, modularity, and ease of expansion.',
      ],
      media: [],
    },
  ],
}

export default interaction
