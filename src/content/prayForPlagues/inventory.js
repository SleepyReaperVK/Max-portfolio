const inventory = {
  id: 'inventory',
  title: 'Inventory System',
  summary:
    'A data-driven inventory built on a shared UDataTable item database — connecting world pickups, categorized storage, and weapon equip/unequip handling into one consistent pipeline.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The inventory system is built as a data-driven, modular framework that manages all player-owned items, including weapons, consumables, and inspectable objects. It serves as the central hub for item acquisition, storage, and equipment management, ensuring that world interactions and combat systems remain tightly connected through a unified data pipeline.',
        'At its core, the system uses a structured item database where each item is defined through a UDataTable entry. This allows every item — whether a simple pickup or a fully featured weapon — to share a consistent data format while still supporting specialized behavior. When the player interacts with an item in the world, the interaction system passes the item’s data directly into the inventory, ensuring seamless integration between world objects and player progression.',
        'Each item is loaded asynchronously (unless loaded during the level load) during gameplay, to smooth the experience and avoid lag and interruptions.',
      ],
      media: [],
    },
    {
      heading: 'Item Data Table Structure',
      paragraphs: [
        'A small detail on how items are managed in the Data Table: each item entry stores an items summary and item count, while an individual item’s detail entry holds its specific properties. Weapons have special properties detailed in the combat section.',
      ],
      media: [
        { key: 'inventory-data-table-summary', alt: 'Item Data Table showing items summary and item counts', caption: 'Items summary and items count' },
        { key: 'inventory-data-table-detail', alt: 'Individual item detail entry in the Data Table', caption: "Individual item's detail. Weapons have special properties detailed in the combat section" },
      ],
    },
    {
      heading: 'Inventory',
      paragraphs: [
        'The inventory is divided into four categories: Consumables, Craftables, Weapons & Key Items. Each inventory section has its own item entry stack count, except for key items.',
        'Disclaimer: all UI widgets featured in the GIFs are not final and only meant to showcase the system and its mechanics.',
      ],
      media: [],
    },
    {
      heading: 'Category Showcase',
      paragraphs: [
        'Some items are stackable, like consumables, while others, such as weapons, are non-stackable.',
      ],
      media: [
        { key: 'inventory-category-showcase', alt: 'Inventory showing stackable consumables versus non-stackable weapons across categories', caption: 'Category Showcase' },
      ],
    },
    {
      heading: 'Stack Overflow Handling',
      paragraphs: [
        'If an item exceeds the inventory’s capacity or the item’s stack, a message will show up notifying the player that the item is sent to the stash.',
      ],
      media: [
        { key: 'inventory-stack-overflow', alt: 'Item exceeding its stack or inventory capacity and being sent to the stash', caption: 'Stack Overflow Handling' },
      ],
    },
    {
      heading: 'Action Context Pop Up Menu',
      paragraphs: [
        'Each item has its own action context menu. Weapons can be equipped and unequipped, while consumables can be used. Key items, such as keys, are used automatically when interacting with the object that requires that item. Items can be dropped but cannot be recovered.',
        'The item pop-up menu, specifically for weapons, is currently not associated with its actual stats pulled from the Curve Table. This will be fixed later down the line.',
      ],
      media: [
        { key: 'inventory-action-context-menu', alt: 'Action context pop-up menu for an inventory item', caption: 'Action Context Pop Up Menu' },
      ],
    },
    {
      heading: 'Key Items Usage Handling',
      paragraphs: [
        'Once a key item is used and has no further use, the inventory will get rid of it automatically.',
      ],
      media: [
        { key: 'inventory-key-item-usage', alt: 'Key item being consumed and automatically removed from the inventory after use', caption: 'Key Items Usage Handling' },
      ],
    },
    {
      heading: 'Weapon Equip/Unequip Handling',
      paragraphs: [
        'As was showcased in the Combat Breakdown section, weapons receive special handling within the inventory. When a weapon is equipped, the system applies all of its associated data to the player, including its animation layer, damage scaling, special abilities, mapping context, and custom montages. This makes equipping a weapon a full character transformation rather than a simple stat change, and ensures that combat behavior updates instantly and consistently.',
        'Overall, the inventory system acts as the connective tissue between exploration, interaction, and combat. By keeping item definitions centralized, modular, and data-driven, the system makes adding new items fast, safe, and scalable, while ensuring that equipping or using an item has immediate and meaningful gameplay impact.',
      ],
      media: [],
    },
  ],
}

export default inventory
