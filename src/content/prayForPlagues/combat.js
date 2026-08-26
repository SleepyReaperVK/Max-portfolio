const combat = {
  id: 'combat',
  title: 'Combat System',
  summary:
    'An animation-driven melee framework built for weighty attacks, tight timing windows and readable feedback. It is modular and data-driven, so new weapons and movesets drop in without touching core logic.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'Combat is an animation-driven framework in the Souls-borne mould: weighty attacks, tight timing windows, and feedback the player can read. Each weapon gets its own animation layer with its own light and heavy chains, special attacks on cooldown, and combo damage multipliers that pay off commitment.',
        'Everything runs through the same systems. Hitboxes are driven by animation events, parryable attacks follow strict telegraph rules, and player and enemies share one directional hit reaction system so impacts land the same way for both. New weapons, movesets and attack behaviors are data, not code changes.',
        'This page walks through the architecture, the design goals and the decisions behind them, with GIFs of attack chains, parries and hit reactions running.',
      ],
      media: [],
    },
    {
      heading: 'Design Goals',
      paragraphs: [
        'The design goals come straight from Souls-borne combat: deliberate actions, readable enemy intent, encounters that punish you fairly. Every mechanic, from attack chains to parry windows, exists to support clarity, weight and mastery.',
        'Attacks have to feel committed. Recovery frames matter, timing matters, and reading spacing, telegraphs and combo flow is what carries a fight. Weapon identity does a lot of that work, so each weapon has its own moveset, animation layer and damage profile for a different playstyle.',
        'Enemy behavior and player feedback are built together. Telegraphs have to be readable, parryable attacks have to follow the same rules every time, and hit reactions have to sell the impact without stalling the fight. Responsiveness and consistency come first, then room to add weapons, attacks and enemy behaviors without rewriting anything.',
        'Those goals drove the architecture: how attacks are animated, how damage is calculated, and how the player reads danger and opportunity mid-fight.',
      ],
      media: [],
    },
    {
      heading: 'Animation Layers, Move-sets & Attack Chains',
      paragraphs: [
        'The Weapon Framework sits at the center and gives each weapon its own animation layer and moveset. Light and heavy chains live in data assets that hold the animation sequences, combo routing, damage values and special attack cooldowns, so a new weapon is a new data entry rather than new combat code.',
        'Attack execution is driven entirely by animation events. Hitboxes spawn on specific frames, combo counters update on animation state transitions, and parry windows are marked by events so timing stays identical across every weapon. Standard and special attacks both go through this, each with their own multipliers and rules.',
        'The player has separate animation-driven states for unequipped, light weapon and heavy weapon, each with its own moveset. A dual-wield state is planned but not built yet.',
        'Damage runs through one pipeline: base weapon damage, combo multipliers, special attack modifiers, and enemy resistances where they exist. Player and AI attacks use the same path, which keeps results consistent and makes debugging and balancing far less painful.',
        'Hit reactions are part of the same architecture. Player and enemies share the directional logic that works out impact direction and picks the animation. Bosses can switch reactions off with a config flag, which keeps their combat presence intact without a special case in the system. Each player state has its own reaction animations.',
        'Bosses alone can be given a weighted random chance of reacting at all, purely as a difficulty lever. That weight lives in the enemy’s Gameplay Ability and is quick to tune.',
      ],
      media: [
        { key: 'combat-state-unequipped', alt: 'Player character in the unequipped combat state', caption: 'Unequipped Player State' },
        { key: 'combat-state-light-weapon', alt: 'Player character equipped with a light weapon', caption: 'Equipped Light Weapon Player State' },
        { key: 'combat-state-heavy-weapon', alt: 'Player character equipped with a heavy weapon', caption: 'Equipped Heavy Weapon Player State' },
        { key: 'combat-players-stats', alt: 'Player stats data driving the combat damage pipeline', caption: 'Players Stats' },
        { key: 'combat-weapons-stats', alt: 'Weapon stats data driving the combat damage pipeline', caption: 'Weapons Stats' },
        { key: 'combat-damage-calc-ge', alt: 'Custom damage calculation and application gameplay effect shared by enemies and the player', caption: 'Custom Damage Calculation And Application Gameplay Effect For Both Enemy & Player' },
        { key: 'combat-hit-reaction-unarmed', alt: 'Player hit reaction animation while in the unarmed state', caption: "Players Hit Reaction (Unarmed State)" },
      ],
    },
    {
      heading: 'Hitbox & Hurtbox System',
      paragraphs: [
        'Collision is animation-driven so attacks stay fair, consistent and locked to the weapon’s actual motion. Weapon hitboxes test against the target’s capsule collider, which keeps detection predictable for the player and enemies alike.',
        'The hitbox is switched on by an AnimNotifyState placed inside the attack montage. That notify is the damage window: collision turns on when it begins and off when it ends, so the weapon can only hit during the frames it should. Timing, spacing and readability then stay consistent across every weapon and moveset.',
        'On overlap, a hostility check decides whether the capsule belongs to a valid target. If it does, the damage pipeline runs and applies values based on weapon type, combo count and any special attack modifiers.',
      ],
      media: [
        { key: 'combat-damage-player', alt: 'Damage application demonstrated on the player character', caption: 'Damage Application Only On Player' },
        { key: 'combat-damage-hostile', alt: 'Damage applied only to a hostile enemy', caption: 'Damage Application On Hostile Enemy' },
      ],
    },
    {
      heading: 'Parry System',
      paragraphs: [
        'The parry is a timed, animation-driven window that cancels incoming damage and rolls straight into a counterattack. It should feel sharp and worth the risk, in line with the rest of the combat, where timing and commitment decide the fight.',
        'A parry attempt plays a dedicated animation. Inside that montage, a tuned window grants a temporary gameplay tag marking the player as "parry-ready." The tag is the active parry state, which keeps the mechanic tied to the animation frames rather than a separate timer.',
        'If an enemy attack connects during that window, combat checks for the tag. With the tag present, the damage is fully negated and the player moves into the successful parry animation, which has its own VFX and audio, overrides the normal hit reaction, and opens the counter-attack.',
      ],
      media: [
        { key: 'combat-parry', alt: 'Player successfully parrying an enemy attack and following up with a counter-attack', caption: 'Parry & Counter-Attack' },
      ],
    },
    {
      heading: 'Weapon Framework',
      paragraphs: [
        'The weapon framework is data-driven, so each weapon defines its own behavior, moveset and identity without core combat changes. Weapon data lives in the same central UDataTable that manages every item in the game; weapons just extend that structure with extra fields for combat function, animation behavior and special abilities.',
        'Every entry carries a Weapon Animation Layer that decides the moveset while it is equipped: light and heavy chains, special attacks, dodge animations and custom hit reaction montages. Because the layer is per weapon, swapping weapons swaps the player’s whole combat profile at once.',
        'Weapons also define a Damage-Scalable-Float so damage can scale with player level or progression. Balancing stays in one place and tuning a weapon is a single value. Special abilities and weapon skills sit in the same entry, so the framework grants them automatically on equip.',
        'Each weapon also ships its own Mapping Context, which swaps the player’s input profile on equip. A weapon can introduce its own control scheme or special attack input without touching any other weapon.',
        'Ability cooldowns come from a Curve Table that holds durations and scaling, so ability pacing can be retuned as data instead of code.',
      ],
      media: [
        { key: 'combat-weapon-data', alt: 'Weapon data table entry showing per-weapon combat properties', caption: 'Weapon data entry in the UDataTable' },
      ],
    },
    {
      heading: 'Lock On Target System',
      paragraphs: [
        'Lock-on gives the player firm control over targeting, keeping attacks, movement and camera pointed at one enemy. On activation it picks the nearest valid target by distance, angle and visibility, then anchors the camera and the player’s orientation to it.',
        'It plugs straight into the combat framework: attack direction, hitbox alignment and the 4-direction hit reaction system all use the locked target as their reference. The player can cycle between nearby enemies mid-fight, and when a target dies lock-on moves to the next one nearby.',
        'If nothing valid is found, the camera resets relative to the player’s forward vector. If the player dies while locked on, lock-on is cancelled.',
        'Between the spatial checks, camera alignment and combat integration, it does a lot for clarity and control, most of all in fights where positioning and timing decide the outcome.',
      ],
      media: [
        { key: 'combat-lock-on-switch', alt: 'Player locking onto a target and switching between nearby enemies', caption: 'Lock On Target & Switch Target' },
        { key: 'combat-lock-on-death-switch', alt: 'Lock-on automatically switching to the next target after an enemy dies', caption: 'Switch Target After Death' },
        { key: 'combat-camera-reset', alt: "Camera resetting relative to the player's forward vector when no lock-on target is found", caption: 'Camera Reset' },
      ],
    },
    {
      heading: 'Foot IK System',
      paragraphs: [
        'Foot IK keeps the character’s feet planted on uneven terrain, which helps grounding and animation fidelity while moving and fighting. Each foot traces downward to find the slope beneath it, then the leg bones and pelvis are adjusted to match. That clears up the sliding and floating you otherwise get on angled or broken surfaces.',
      ],
      media: [
        { key: 'combat-foot-ik', alt: 'Character feet adjusting to align with uneven terrain via the Foot IK system', caption: 'Foot IK' },
      ],
    },
  ],
}

export default combat
