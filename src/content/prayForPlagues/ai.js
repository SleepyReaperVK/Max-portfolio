const ai = {
  id: 'ai',
  title: 'AI System',
  summary:
    'A modular, behavior-driven AI architecture: Behavior Trees, EQS positioning, motion-warped attacks and perception-based awareness, built for readable, reactive Souls-borne encounters.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The AI is modular and behavior-driven, aimed at encounters the player can read and react to. Each enemy combines Behavior Trees, custom attack logic and animation-driven telegraphs, so fights stay fair and mechanically consistent with the player’s own moveset.',
        'Encounters are meant to be hard and to demand real decisions. Every enemy type has its own behavioral identity, which keeps fights varied without making them unreadable. What I was after is AI that feels smart, reactive and genuinely dangerous, able to punish a mistake with a motion-warped attack, an AOE ability, or a buff that spikes its damage.',
      ],
      media: [],
    },
    {
      heading: 'Design Goals',
      paragraphs: [
        'The main pillar is behavior differentiation. Bosses and elites run advanced logic: passive-aggressive threat evaluation, dynamic strafing and EQS-driven positioning. The Dark Knight boss, for example, holds his distance when the player disengages and repositions instead of charging in blind. That turns spacing, timing and awareness into the actual fight.',
        'Standard enemies are simpler and more aggressive: 1–2 hit combos and a straight rush. That "dumb" aggression is deliberate, since it plays off the tactical bosses and gives the roster some range. Ranged enemies hold their distance and throw projectiles, which forces the player to manage spacing and pick targets.',
        'Still on the list is a Token Exchange System. When several enemies are on the player, each would have to request a token before it can attack. That makes a group read as coordinated and gives the player room to breathe between rushes.',
      ],
      media: [],
    },
    {
      heading: 'Behavior Trees & State Management',
      paragraphs: [
        'This breakdown leans on a boss, since he has more going on than the regular enemies. Any of these abilities can be handed to any enemy through its own Data Asset.',
        'Every enemy runs on one shared Behavior Tree structure covering the high-level decisions: patrol, engage, reposition, attack, retreat. The tree talks to custom C++/Blueprint tasks that check distance to the player (through a Behavior Tree service), line of sight via AI Perception, cooldowns, which attacks are available, and EQS positioning results.',
        'Bosses get one extra check on top of distance: whether their health bar has actually been drawn.',
        'Advanced enemies, bosses above all, use EQS (Environment Query System) to find good combat positions. If the player keeps their distance, the AI holds off and strafes, which reads as observing. It hits back once the player commits. Keep stalling and it will eventually open with a closing attack of its own.',
        'Regular enemies have a patrol state: they walk a given area and engage once they see the player. Patrol runs off investigation points, and you can hand an enemy several of them, sequential or randomized. Detection uses the AI’s dominant sense, which here is vision, so once it loses sight the enemy goes back to patrolling.',
      ],
      media: [
        { key: 'ai-boss-data-asset', alt: 'Dark Knight enemy boss Data Asset defining its abilities and configuration', caption: 'Dark Knight Enemy Boss Data-Asset' },
        { key: 'ai-idle-to-engage', alt: 'Enemy transitioning from idle state to engaging the player', caption: 'Enemy Idle State → Engage Player' },
        { key: 'ai-strafe-attack', alt: 'Enemy alternating between strafing state and attack state', caption: 'Enemy Strafing State → ← Attack State' },
        { key: 'ai-patrol-loop', alt: 'AI losing sight of the player and returning to its patrol state', caption: 'Player Lost → Patrol Again' },
        { key: 'ai-player-spotted', alt: 'AI spotting the player and engaging in combat', caption: 'Player Spotted → Engage' },
        { key: 'ai-vision-perception', alt: 'AI perception relying on its dominant sense (vision) to spot and lose track of the player', caption: 'Vision-based perception behavior' },
      ],
    },
    {
      heading: 'Detour Crowd Avoidance System',
      paragraphs: [
        'Detour Crowd Avoidance adjusts navigation in real time so AI can move through tight or crowded spaces without colliding or bunching up. It layers avoidance heuristics on top of standard navigation, reading nearby agents and nudging movement vectors to hold spacing and stop enemies jamming a doorway mid-fight or mid-patrol.',
        'Each AI controller sets its own crowd quality, which decides how hard the agent avoids others and how much CPU goes into those calculations. Bosses and elites run high quality so their repositioning and EQS strafing stay smooth. Standard enemies run low quality, which still gets them basic avoidance without the cost.',
      ],
      media: [
        { key: 'ai-crowd-avoidance', alt: 'AI agents dynamically avoiding each other via the Detour Crowd Avoidance System', caption: 'Detour Crowd Avoidance System in action' },
      ],
    },
    {
      heading: 'Attack Manager & Motion Warping',
      paragraphs: [
        'The Attack Manager is the one component that picks, validates and chains enemy attacks. It weighs probability, distance requirements and gameplay tag prerequisites to decide what the AI throws next. It lives on the enemy itself, with Data Assets assigned to it.',
        'Attack montages carry Anim Notify State transition windows so attacks can chain cleanly. While a window is open, the Attack Manager picks the next valid attack and commits, which gives multi-hit combos that never break animation flow. Any enemy type can use this and tune it however you like; the enemy here is a boss, so he uses all of it.',
        'Boss fights run in two phases. On the transition the boss changes behavior, changes attack pattern and picks up new abilities. Phase 1 is close-range attacks the player can parry, some of them motion-warped to make them harder to slip. Drop his health past a threshold and phase 2 starts: unparryable attacks whose AOE damage extends with the VFX, plus projectiles.',
      ],
      media: [
        { key: 'ai-attack-manager-config', alt: 'Attack montage notifies driving combo windows, motion warping, and weapon collision toggling', caption: 'Attack montage notify setup' },
        { key: 'ai-attack-manager-data', alt: 'Attack Manager data asset defining attack conditions and weights', caption: 'Attack Manager data asset' },
        { key: 'ai-boss-phase-1', alt: 'Boss phase 1 close-range parryable attacks, including a motion-warped attack', caption: 'Phase 1' },
        { key: 'ai-boss-phase-transition', alt: 'Boss transitioning from phase 1 to phase 2 after dropping below a health threshold', caption: 'Phase 1 → Phase 2' },
        { key: 'ai-boss-phase-2', alt: 'Boss phase 2 unparryable AOE attack with accompanying VFX', caption: 'Phase 2' },
      ],
    },
    {
      heading: 'Attack Types & Ability Integration',
      paragraphs: [
        'Enemies cover several attack categories: melee combos (1–2 hits for simple enemies, longer chains for bosses), AOE abilities (ground slams, shockwaves, magic bursts), ranged projectiles, buffs (damage amplification, speed boosts, phase transitions) and summoning. All of it is data-driven and runs through the same attack pipeline the player uses.',
      ],
      media: [],
    },
    {
      heading: 'AI Debugging Tools',
      paragraphs: [
        'Iterating on this needed tooling, so the AI leans on Unreal’s built-in debugging plus a custom EQS visualization utility. Between them you can watch perception, navigation, ability activation and decision-making live, which is the only practical way to tell whether a complex behavior is actually doing what you think.',
        'Unreal’s standard suite covers most of it. AI Perception Debugging draws sight, hearing and stimulus events, which is how I check detection ranges, line-of-sight and the patrol-to-combat transition. Detour Crowd Avoidance Debugging shows avoidance radii, agent priorities and movement adjustments, so crowd quality and filter groups can be tuned per archetype. GAS Debugging exposes active abilities, gameplay tags, cooldowns and state transitions, which is how buff attacks, ability unlocks and phase behavior get verified. General AI Debugging draws navigation paths, behavior tree execution, EQS queries and decision flow for checking attack selection, movement and state changes.',
        'On top of that I built a custom EQS Test Pawn. It spawns relative to the player’s capsule and runs EQS queries on their own, with no need to play in editor or drive a full AI behavior to see the result.',
        'Taken together it is a data-driven foundation for encounters that are hard, readable and varied. Modular behavior trees, EQS positioning, motion-warped attacks, perception-based awareness and crowd-avoidance navigation give consistent behavior across the whole roster, from a simple rusher to a multi-phase boss.',
      ],
      media: [],
    },
  ],
}

export default ai
