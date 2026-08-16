const combat = {
  id: 'combat',
  title: 'Combat System',
  summary:
    'An animation-driven melee framework built for weighty attacks, precise timing windows, and readable feedback — modular and data-driven so new weapons and movesets need no core logic changes.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The combat system is built around a Souls-borne inspired, animation-driven framework designed to deliver weighty attacks, precise timing windows, and clear player feedback. Each weapon features its own unique animation layer, complete with distinct light and heavy attack chains, special attacks with cooldowns, and combo-based damage multipliers that reward commitment and mastery.',
        'Combat interactions are fully systemic: hitboxes are synchronized with animation events, parryable attacks follow strict telegraph rules, and both player and enemies use a shared directional hit reaction system that reinforces impact and readability. The system is modular, data-driven, and designed for scalability — new weapons, movesets, and attack behaviors can be added without modifying core logic.',
        'This page breaks down the architecture, design goals, implementation details, and engineering decisions behind the combat system, supported by GIFs demonstrating attack chains, parries and hit reactions in action.',
      ],
      media: [],
    },
    {
      heading: 'Design Goals',
      paragraphs: [
        'The combat system is built around core design goals inspired by Souls-borne combat philosophy: deliberate actions, readable enemy intent, and punishing-but-fair encounters. Every mechanic — from attack chains to parry windows — is designed to reinforce clarity, weight, and player mastery.',
        'Combat must feel committed, attacks have meaningful recovery, timing matters, and players are rewarded for understanding spacing, telegraphs, and combo flow. Weapon identity is central to the experience, so each weapon has a unique moveset, animation layer, and damage profile that supports different playstyles.',
        'Enemy behavior and player feedback are tightly integrated. Telegraphs must be readable, parryable attacks must follow consistent rules, and hit reactions must communicate impact clearly without disrupting combat flow. The system prioritizes responsiveness, consistency, and scalability, so new weapons, attacks, and enemy behaviors can be added without rewriting core logic.',
        'These goals guide every architectural decision in the combat system, shaping how attacks are animated, how damage is calculated, and how players read danger and opportunity during encounters.',
      ],
      media: [],
    },
    {
      heading: 'Animation Layers, Move-sets & Attack Chains',
      paragraphs: [
        'At the core of the system is the Weapon Framework, which assigns each weapon its own animation layer and moveset. Light and heavy attack chains are defined through data assets that specify animation sequences, combo routing, damage values, and special attack cooldowns. This allows new weapons and movesets to be added without modifying core combat logic.',
        'Attack execution is fully synchronized with animation events. Hitboxes are spawned at specific frames, combo counters are updated based on animation state transitions, and parry windows are defined through event markers that ensure consistent timing across all weapons. The system supports both standard and special attacks, each with unique multipliers and behavior rules.',
        'The player has distinct animation-driven states for being unequipped, and for equipping light, heavy, and (planned) dual-wield weapons — each with its own moveset. A dual-wield player state is planned but not yet implemented.',
        'Damage calculation flows through a centralized pipeline: base weapon damage, combo multipliers, special attack modifiers, and enemy-specific resistances (if present). This pipeline ensures consistent results across player and AI attacks and simplifies debugging and balancing.',
        'The Hit Reaction System is integrated directly into the architecture. Both player and enemies use a shared directional reaction logic that determines impact direction and selects the appropriate animation. Bosses can selectively disable hit reactions through simple configuration flags, preserving their intended combat presence without altering the underlying system. Each player state has its own unique hit reaction animations.',
        'Bosses exclusively may have a weighted random chance of triggering a hit reaction, for difficulty purposes. The setting can easily be adjusted within the enemy’s Gameplay Ability.',
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
        'The hitbox and hurtbox system is built around a precise, animation-driven collision workflow that ensures attacks feel fair, consistent, and tightly synchronized with weapon motion. The system uses weapon-based hitboxes that interact with the target’s capsule collider, allowing for clean, predictable detection across both player and enemy characters.',
        'During an attack, the weapon’s hitbox is activated through an AnimNotifyState placed directly inside the attack montage. This notify defines the exact window in which the weapon can deal damage, ensuring that collision is only enabled during the correct animation frames. When the notify begins, the weapon’s hitbox becomes active; when it ends, collision is disabled again. This approach guarantees that timing, spacing, and animation readability remain consistent across all weapons and movesets.',
        'When the hitbox overlaps a capsule, the system performs a hostility check to determine whether the target is a valid enemy or player. If the target is hostile, the damage pipeline is triggered, applying the appropriate values based on weapon type, combo count, and special attack modifiers.',
      ],
      media: [
        { key: 'combat-damage-player', alt: 'Damage application demonstrated on the player character', caption: 'Damage Application Only On Player' },
        { key: 'combat-damage-hostile', alt: 'Damage applied only to a hostile enemy', caption: 'Damage Application On Hostile Enemy' },
      ],
    },
    {
      heading: 'Parry System',
      paragraphs: [
        'The parry system is built around a timed, animation-driven window that allows the player to negate incoming damage and immediately transition into a counterattack. The mechanic is designed to feel precise, rewarding, and consistent with Souls-borne combat philosophy, where timing and commitment define success.',
        'When the player initiates a parry attempt, a dedicated parry animation is played. Inside this montage, a carefully placed parry window grants the player a temporary gameplay tag that marks them as "parry-ready." This tag represents the active parry state and ensures that the timing of the mechanic is fully synchronized with the animation frames.',
        'During this window, if an enemy attack connects, the combat system checks whether the player currently holds the parry tag. If the tag is present, the incoming damage is completely negated, and the system transitions the player into a successful parry animation. This animation features distinct visual and audio feedback — reinforcing the impact and clarity of the mechanic — and overrides the standard hit reaction logic while also granting a counter-attack opportunity.',
      ],
      media: [
        { key: 'combat-parry', alt: 'Player successfully parrying an enemy attack and following up with a counter-attack', caption: 'Parry & Counter-Attack' },
      ],
    },
    {
      heading: 'Weapon Framework',
      paragraphs: [
        'The weapon framework is built around a data-driven architecture that allows each weapon to define its own behavior, moveset, and gameplay identity without requiring changes to core combat logic. All weapon data is stored in a centralized UDataTable, which manages every item in the game. Weapons extend this structure with additional fields that define their combat functionality, animation behavior, and special abilities.',
        'Each weapon entry contains its own Weapon Animation Layer, which determines the moveset the player uses when the weapon is equipped. This includes unique light and heavy attack chains, special attacks, dodge animations, and custom hit reaction montages. By assigning animation layers per weapon, the system ensures that switching weapons immediately updates the player’s entire combat profile.',
        'Weapons also define their Damage-Scalable-Float, allowing damage to scale dynamically based on player level or progression. This keeps balancing centralized and makes tuning weapon strength straightforward. Special abilities and weapon skills are also stored in the weapon’s data entry, enabling the framework to grant abilities automatically when the weapon is equipped.',
        'To support responsiveness and clarity, each weapon includes its own Mapping Context, which updates the player’s input profile when switching weapons. This allows different weapons to introduce unique control schemes or special attack inputs without affecting other weapons.',
        'Cooldowns for weapon abilities are managed through a Curve-Table, which defines cooldown durations and scaling behavior. This keeps cooldown logic flexible and data-driven, allowing designers to adjust ability pacing without modifying code.',
      ],
      media: [
        { key: 'combat-weapon-data', alt: 'Weapon data table entry showing per-weapon combat properties', caption: 'Weapon data entry in the UDataTable' },
      ],
    },
    {
      heading: 'Lock On Target System',
      paragraphs: [
        'The lock-on system provides the player with precise control over combat targeting, ensuring that attacks, movement, and camera behavior remain focused on a selected enemy. When activated, the system identifies the nearest valid target based on distance, angle, and visibility, then anchors the camera and player orientation toward that enemy.',
        'Lock-on directly integrates with the combat framework. Attack direction, hitbox alignment, and the 4-direction hit reaction system all use the locked target as a reference point, ensuring consistent and readable combat behavior. The system also supports dynamic target switching, allowing the player to cycle between nearby enemies during multi-target encounters. Additionally, when an enemy is defeated the lock-on will switch to the next nearby target.',
        'If no target is discovered during a lock-on attempt, the camera will perform a reset relative to the player’s forward vector. Naturally, if the player dies during a lock-on, the lock-on will be canceled out.',
        'By combining spatial checks, camera alignment, and combat integration, the lock-on system enhances clarity, responsiveness, and player control — especially in encounters where positioning and timing are critical.',
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
        'The Foot IK system ensures that the character’s feet align naturally with uneven terrain, improving grounding, stability, and animation fidelity during movement and combat. The system performs a downward trace from each foot to detect the slope or surface beneath the character, then adjusts the leg bones and pelvis position to match the terrain. This prevents foot sliding and floating, especially on angled or irregular surfaces.',
      ],
      media: [
        { key: 'combat-foot-ik', alt: 'Character feet adjusting to align with uneven terrain via the Foot IK system', caption: 'Foot IK' },
      ],
    },
  ],
}

export default combat
