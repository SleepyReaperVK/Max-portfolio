const inventory = {
  id: 'inventory',
  title: 'Inventory System',
  summary:
    'A data-driven inventory built on a shared UDataTable item database, tying world pickups, categorized storage and weapon equip/unequip handling into one pipeline.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The inventory handles every item the player owns: weapons, consumables and inspectable objects. It is the hub for picking things up, holding them and equipping them, which is what keeps world interaction and combat working off the same data.',
        'Items are defined as UDataTable entries, so a plain pickup and a fully featured weapon share the same data format while still behaving differently. When the player interacts with something in the world, the interaction system hands its data straight to the inventory.',
        'Items load asynchronously during gameplay, unless they were already loaded with the level, which keeps hitches out of the moment you pick something up.',
      ],
      media: [],
    },
    {
      heading: 'Item Data Table Structure',
      paragraphs: [
        'One detail on how the Data Table is laid out: an item entry stores the summary and count, while the individual detail entry holds that item’s own properties. Weapons carry extra properties, covered in the combat section.',
      ],
      media: [
        { key: 'inventory-data-table-summary', alt: 'Item Data Table showing items summary and item counts', caption: 'Items summary and items count' },
        { key: 'inventory-data-table-detail', alt: 'Individual item detail entry in the Data Table', caption: "Individual item's detail. Weapons have special properties detailed in the combat section" },
      ],
    },
    {
      heading: 'Inventory',
      paragraphs: [
        'There are four categories: Consumables, Craftables, Weapons and Key Items. Each section has its own stack count per entry, except key items.',
        'Note: the UI widgets in these GIFs are not final. They are here to demonstrate the system, not the look.',
      ],
      media: [],
    },
    {
      heading: 'Categories In Practice',
      paragraphs: [
        'Some items stack, like consumables. Others, weapons included, do not.',
      ],
      media: [
        { key: 'inventory-category-showcase', alt: 'Inventory showing stackable consumables versus non-stackable weapons across categories', caption: 'Stackable and non-stackable items' },
      ],
    },
    {
      heading: 'Stack Overflow Handling',
      paragraphs: [
        'If an item overflows its stack or the inventory’s capacity, the player gets a message saying it went to the stash.',
      ],
      media: [
        { key: 'inventory-stack-overflow', alt: 'Item exceeding its stack or inventory capacity and being sent to the stash', caption: 'Stack Overflow Handling' },
      ],
    },
    {
      heading: 'Action Context Pop Up Menu',
      paragraphs: [
        'Every item has its own action context menu. Weapons equip and unequip, consumables get used. Key items fire automatically when you interact with whatever needs them. Items can be dropped, and dropping is permanent.',
        'The weapon pop-up menu is not yet reading its real stats from the Curve Table. Still on the fix list.',
      ],
      media: [
        { key: 'inventory-action-context-menu', alt: 'Action context pop-up menu for an inventory item', caption: 'Action Context Pop Up Menu' },
      ],
    },
    {
      heading: 'Key Items Usage Handling',
      paragraphs: [
        'Once a key item has served its purpose, the inventory drops it on its own.',
      ],
      media: [
        { key: 'inventory-key-item-usage', alt: 'Key item being consumed and automatically removed from the inventory after use', caption: 'Key Items Usage Handling' },
      ],
    },
    {
      heading: 'Weapon Equip/Unequip Handling',
      paragraphs: [
        'As covered in the combat breakdown, weapons get special handling here. Equipping one applies all of its data to the player: animation layer, damage scaling, special abilities, mapping context and custom montages. Equipping a weapon is closer to changing character than changing a stat, and combat behavior updates immediately.',
        'The inventory is the connective tissue between exploration, interaction and combat. Keeping item definitions central and data-driven makes adding new ones quick and low-risk, while equipping or using something still lands with real weight in gameplay.',
      ],
      media: [],
    },
  ],
}

export default inventory
