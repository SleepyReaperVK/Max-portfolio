const ai = {
  id: 'ai',
  title: 'AI System',
  summary:
    'A modular, behavior-driven AI architecture — Behavior Trees, EQS positioning, motion-warped attacks, and perception-based awareness — built to deliver readable, reactive, and challenging Souls-borne encounters.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The AI system is built around a modular, behavior-driven architecture designed to support readable, reactive, and challenging encounters in a Souls-borne style combat environment. Each enemy uses a combination of Behavior Trees, custom attack logic, and animation-driven telegraphs to ensure that combat feels fair, intentional, and mechanically consistent with the player’s moveset.',
        'The system is designed to deliver highly challenging, behavior-rich encounters that demand precise decision-making from the player. Each enemy type is built around a distinct behavioral identity, ensuring that combat remains varied, readable, and strategically engaging. The overarching goal is to create AI that feels smart, reactive, and dangerous — capable of punishing mistakes through motion-warped attacks, area-of-effect abilities, and powerful buffs that dramatically increase damage output.',
      ],
      media: [],
    },
    {
      heading: 'Design Goals',
      paragraphs: [
        'A core design pillar is behavior differentiation. Bosses and elite enemies use advanced logic, including passive-aggressive threat evaluation, dynamic strafing, and EQS-driven positioning. For example, the Dark Knight boss maintains distance when the player disengages, repositioning intelligently rather than blindly rushing. This creates encounters where spacing, timing, and situational awareness become critical.',
        'Standard enemies follow simpler, more aggressive patterns, using straightforward 1–2 hit combos and direct rush behavior. Their "dumb" aggression contrasts with the more tactical bosses, creating a layered ecosystem of enemy types that each challenge the player in different ways. Ranged enemies maintain distance and rely on projectile attacks, forcing the player to manage spacing and prioritize threats.',
        'Another design goal that is yet to be made is the Token Exchange System, where when multiple enemies are engaging the player they will request a token from the player to allow them to attack, allowing a group of enemies to be more coordinated and at the same time allow the player to "breathe" in between enemy rushes.',
      ],
      media: [],
    },
    {
      heading: 'Behavior Trees & State Management',
      paragraphs: [
        'The showcase focuses more on a boss character’s mechanics since he’s more advanced and has more abilities, unlike the regular enemies. Naturally all abilities can be applied to any enemy easily within their Data Asset respectively.',
        'All enemies operate through a unified Behavior Tree structure that governs high-level decision-making: patrolling, engaging, repositioning, attacking, and retreating. The Behavior Tree communicates with custom C++/Blueprint tasks that evaluate distance to the player (run through a Behavior Tree service), line-of-sight using AI Perception, cooldowns, available attack types, and EQS positioning results.',
        'For enemy bosses exclusively, another check is performed additionally to distance, which checks whether the boss’s health bar has been drawn successfully.',
        'Advanced enemies (especially bosses) use EQS (Environment Query System) to evaluate optimal combat positions. If the player maintains distance, the AI won’t engage right away and will strafe to simulate "observe" behavior. Only when a player attempts to engage will the AI retaliate. If the player decides to keep the distance, the AI will eventually launch a "close in" attack.',
        'Regular enemies have a "Patrol State" where they will walk around a given area and, once the player has been seen, engage in battle. Patrol works by giving a point for the AI to investigate; multiple points can also be specified, and patrol routes can be sequential or randomized. AI relies on its dominant sense to spot enemies — in this example, the AI’s dominant sense is vision, so when sight is lost, the enemy returns back to the patrol state.',
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
        'The Detour Crowd Avoidance System provides dynamic, real-time navigation adjustments that allow AI characters to move naturally through crowded or narrow environments without colliding or clustering. It extends the standard navigation system with avoidance heuristics that evaluate nearby agents and adjust movement vectors to maintain spacing, preserve formation integrity, and prevent bottlenecking during combat or patrol behavior.',
        'Each AI controller defines its own crowd quality level, determining how aggressively the agent avoids others and how much CPU time is allocated to its avoidance calculations. High-tier enemies (such as bosses or elite units) use higher quality settings to ensure smooth, intentional movement during complex repositioning or EQS-driven strafing. Standard enemies use lower quality settings to maintain performance while still benefiting from basic avoidance.',
      ],
      media: [
        { key: 'ai-crowd-avoidance', alt: 'AI agents dynamically avoiding each other via the Detour Crowd Avoidance System', caption: 'Detour Crowd Avoidance System in action' },
      ],
    },
    {
      heading: 'Attack Manager & Motion Warping',
      paragraphs: [
        'The Attack Manager is a centralized decision-making component responsible for selecting, validating, and chaining enemy attacks. It evaluates multiple conditions — probability weights, distance requirements, and gameplay tag prerequisites — to determine which attack the AI should execute next. The Attack Manager component resides on the enemy, where Data Assets are assigned to it.',
        'Attack montages contain Anim Notify State transition windows, which allow the AI to chain attacks fluidly. When the transition window is active, the Attack Manager evaluates the next valid attack and commits to it, creating seamless multi-hit combos without breaking animation flow. This logic can be applied to all enemy types and be adjusted as the creator decides to; in this showcase the enemy is a boss-type character that utilizes all specified techniques.',
        'Boss fights have a 2-phase structure, where upon transitioning to the next phase, the boss changes its behavior, attack pattern, and gains new abilities. In phase 1, the enemy launches close-range attacks that can be parried, with some attacks using motion warping for a more challenging encounter. Once the enemy’s health has dropped below a certain amount, phase 2 begins. When phase 2 begins, the enemy gains unparryable attacks that have an AOE damage application effect extending along with the VFX, and additionally gains the ability to launch projectiles at the player.',
      ],
      media: [
        { key: 'ai-attack-manager-config', alt: 'Attack Manager component configuration on an enemy', caption: 'Attack Manager component setup' },
        { key: 'ai-attack-manager-data', alt: 'Attack Manager data asset defining attack conditions and weights', caption: 'Attack Manager data asset' },
        { key: 'ai-boss-phase-1', alt: 'Boss phase 1 close-range parryable attacks, including a motion-warped attack', caption: 'Phase 1' },
        { key: 'ai-boss-phase-transition', alt: 'Boss transitioning from phase 1 to phase 2 after dropping below a health threshold', caption: 'Phase 1 → Phase 2' },
        { key: 'ai-boss-phase-2', alt: 'Boss phase 2 unparryable AOE attack with accompanying VFX', caption: 'Phase 2' },
      ],
    },
    {
      heading: 'Attack Types & Ability Integration',
      paragraphs: [
        'Enemies support multiple attack categories: melee combos (1–2 hit for simple enemies, complex chains for bosses), AOE abilities (ground slams, shockwaves, magic bursts), ranged projectiles (long-range units), buffs (damage amplification, speed boosts, phase transitions), and enemy summoning. These abilities are data-driven and integrated into the same attack pipeline used by the player, ensuring systemic consistency.',
      ],
      media: [
        { key: 'ai-attack-types', alt: 'Enemy demonstrating melee, AOE, ranged, and buff attack types', caption: 'Attack types and ability integration' },
      ],
    },
    {
      heading: 'AI Debugging Tools',
      paragraphs: [
        'The AI System relies on a combination of built-in Unreal debugging tools and a custom EQS visualization utility to support rapid iteration, behavior tuning, and encounter balancing. These tools allow designers and programmers to observe AI perception, navigation, ability activation, and decision-making in real time, ensuring that complex behaviors remain readable and functionally correct.',
        'Unreal’s standard debugging suite provides immediate visibility into core systems: AI Perception Debugging displays sight, hearing, and stimulus events, making it easy to verify detection ranges, line-of-sight checks, and transitions between patrol and combat states. Detour Crowd Avoidance Debugging shows avoidance radii, agent priorities, and movement adjustments, allowing fine-tuning of crowd quality settings and filter groups for different enemy archetypes. GAS Debugging reveals active abilities, gameplay tags, cooldowns, and state transitions — essential for verifying buff-based attacks, special ability unlocks, and phase-specific behaviors. General AI Debugging provides visualization for navigation paths, behavior tree execution, EQS queries, and decision flow, helping validate attack selection, movement logic, and state changes.',
        'In addition to these built-in tools, a custom EQS Test Pawn was developed to streamline EQS debugging. This pawn can be spawned relative to the player’s capsule and used to run EQS queries in isolation, without needing to play in editor or trigger full AI behavior.',
        'In conclusion, the AI System forms a cohesive, data-driven foundation for delivering challenging, readable, and behaviorally diverse encounters. Through modular behavior trees, EQS-driven positioning, motion-warped attacks, perception-based awareness, and crowd-avoidance navigation, enemies behave intelligently and consistently across all archetypes — from simple rushers to complex multi-phase bosses.',
      ],
      media: [],
    },
  ],
}

export default ai
