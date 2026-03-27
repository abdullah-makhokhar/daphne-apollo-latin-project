// ============================================================
//  DAPHNE'S ROOT — CENTRAL GAME CONFIGURATION
//  See CONFIG.md at the project root for a full tuning guide.
// ============================================================

export interface StoryNode {
  id: string;
  line: string;              // Original Latin line
  translation: string;       // English translation (exact, do not alter)
  part: 1 | 2;               // Part 1 = before >>>>>, Part 2 = after >>>>>
  cost: number;              // Numen cost to unlock
  effect: GameEffect;
  effectDescription: string; // Shown in the upgrade shop
  spriteEffect: string;      // Visual change description shown on sprite
}

export type GameEffect =
  | { type: "clickPower"; bonus: number }
  | { type: "autoClick"; rate: number }
  | { type: "heatReduction"; multiplier: number }
  | { type: "numanMultiplier"; multiplier: number }
  | { type: "refugit"; pushback: number }
  | { type: "finalMultiplier"; multiplier: number }
  | { type: "apolloEvent" }
  | { type: "endgame" };

// ─── STORY NODES ─────────────────────────────────────────────
// Lines 543–561 from Ovid's Metamorphoses, Book I.
// Translations are exact — do NOT alter them.
// Part 1 = lines 543–552 (before the >>>>> divider)
// Part 2 = lines 553–561 (after the >>>>> divider)
// ─────────────────────────────────────────────────────────────

export const STORY_NODES: StoryNode[] = [
  // ── PART 1: THE TRANSFORMATION (lines 543–552) ───────────
  {
    id: "line_543",
    line: "viribus absumptis expalluit illa citaeque",
    translation: "With her strengths spent she paled and having been conquered",
    part: 1,
    cost: 10,
    effect: { type: "clickPower", bonus: 1 },
    effectDescription: "+1 Numen per click",
    spriteEffect: "Her skin begins to pale, exhausted",
  },
  {
    id: "line_544",
    line: "victa labore fugae spectans Peneidas undas",
    translation: "by the effort of swift flight, watching the waves of Peneus,",
    part: 1,
    cost: 25,
    effect: { type: "clickPower", bonus: 1 },
    effectDescription: "+1 Numen per click",
    spriteEffect: "She gazes toward her father's river",
  },
  {
    id: "line_545",
    line: '"fer, pater," inquit "opem! sī flūmina nūmen habētis,',
    translation: '"Father bring help! [O] Rivers, if you have divinity,',
    part: 1,
    cost: 50,
    effect: { type: "clickPower", bonus: 2 },
    effectDescription: "+2 Numen per click — her prayer carries power",
    spriteEffect: "Her arms reach skyward in prayer",
  },
  {
    id: "line_546",
    line: 'quā nimium placuī, mūtandō perde figūram!"',
    translation: 'destroy my shape by which I\'ve pleased too much, by changing [it]!"',
    part: 1,
    cost: 100,
    effect: { type: "autoClick", rate: 1 },
    effectDescription: "Prayer answered: 1 Numen/sec passively",
    spriteEffect: "The river god hears her — roots begin at her feet",
  },
  {
    id: "line_548",
    line: "vix prece finitā torpor gravis occupat artūs,",
    translation: "Having barely finished the prayer, a heavy numbness seizes her limbs,",
    part: 1,
    cost: 200,
    effect: { type: "heatReduction", multiplier: 0.8 },
    effectDescription: "Torpor cools her — Apollo's Heat rises 20% slower",
    spriteEffect: "Bark creeps up her calves — her legs grow still",
  },
  {
    id: "line_549",
    line: "mollia cinguntur tenui praecordia libro,",
    translation: "her soft breasts are girded by thin bark,",
    part: 1,
    cost: 400,
    effect: { type: "autoClick", rate: 2 },
    effectDescription: "Bark generates 2 Numen/sec",
    spriteEffect: "Thin bark wraps her torso — a green tinge spreads",
  },
  {
    id: "line_550",
    line: "in frondem crinēs, in ramos bracchia crescunt,",
    translation: "her hair grows into foliage, her arms into branches,",
    part: 1,
    cost: 700,
    effect: { type: "numanMultiplier", multiplier: 1.5 },
    effectDescription: "×1.5 to all Numen — branches multiply her essence",
    spriteEffect: "Her hair bursts into green leaves — branches crown her",
  },
  {
    id: "line_551",
    line: "pes modo tam velox pigris radicibus haeret,",
    translation: "her foot, just now so swift, clings by sluggish roots,",
    part: 1,
    cost: 1200,
    effect: { type: "numanMultiplier", multiplier: 2 },
    effectDescription: "×2 all Numen — roots dig deep, essence flows",
    spriteEffect: "Deep roots anchor her — full lower bark formed",
  },
  {
    id: "line_552",
    line: "ora cacumen habet: remanet nitor unus in illa.",
    translation: "her face has the top of a tree: a single splendor remains in her.",
    part: 1,
    cost: 2000,
    effect: { type: "clickPower", bonus: 10 },
    effectDescription: "+10 Numen per click — splendor of the tree shines",
    spriteEffect: "Her face crowns the treetop — golden light persists",
  },

  // ── PART 2: APOLLO'S EMBRACE (lines 553–561) ─────────────
  {
    id: "line_553",
    line: "Hanc quoque Phoebus amat positāque in stipite dextrā",
    translation: "Apollo loves this one too and with a right hand placed on the trunk",
    part: 2,
    cost: 3000,
    effect: { type: "apolloEvent" },
    effectDescription: "Apollo's hand appears — the bark must be thicker",
    spriteEffect: "Apollo's golden hand presses the bark — she trembles",
  },
  {
    id: "line_554",
    line: "sentit adhuc trepidare novo sub cortice pectus",
    translation: "feels that her heart still trembles under the new bark,",
    part: 2,
    cost: 4500,
    effect: { type: "heatReduction", multiplier: 0.6 },
    effectDescription: "Bark thickens — Apollo's Heat rises 40% slower",
    spriteEffect: "The bark pulses with her heartbeat — dense and green",
  },
  {
    id: "line_555",
    line: "complexusque suis ramos ut membra lacertis",
    translation: "and having embraced the branches as limbs with his own arms",
    part: 2,
    cost: 6000,
    effect: { type: "autoClick", rate: 5 },
    effectDescription: "5 Numen/sec — branches absorb the sun god's heat",
    spriteEffect: "Her crown expands — full canopy of leaves",
  },
  {
    id: "line_556",
    line: "oscula dat ligno; refugit tamen oscula lignum.",
    translation: "he gives the wood kisses, and the wood shrinks from the kisses.",
    part: 2,
    cost: 9000,
    effect: { type: "refugit", pushback: 25 },
    effectDescription: "Refugit! Each future upgrade pushes Heat back 25%",
    spriteEffect: "The tree recoils — bark repels Apollo's warmth",
  },
  {
    id: "line_557",
    line: 'cui deus "at, quoniam coniunx mea non potes esse,',
    translation: "The god said to her, since you can't be my bride, at least",
    part: 2,
    cost: 13000,
    effect: { type: "numanMultiplier", multiplier: 2 },
    effectDescription: "×2 all Numen — Apollo's declaration empowers her",
    spriteEffect: "Gold light crowns the canopy — Apollo concedes",
  },
  {
    id: "line_558",
    line: 'arbor eris certe" dixit "mea! semper habebunt',
    translation: "you will certainly be my tree! My hair(s) will always have you,",
    part: 2,
    cost: 20000,
    effect: { type: "finalMultiplier", multiplier: 3 },
    effectDescription: "×3 ALL Numen — the eternal tree is declared",
    spriteEffect: "The Laurel stands complete — leaves glow gold and green",
  },
  {
    id: "line_559",
    line: "te coma, te citharae, te nostrae, laure, pharetrae;",
    translation: "my lyres [will have you], my quivers [will have you], o Laurel;",
    part: 2,
    cost: 30000,
    effect: { type: "clickPower", bonus: 50 },
    effectDescription: "+50 Numen per click — she adorns the god forever",
    spriteEffect: "Golden laurel wreaths shimmer in the canopy",
  },
  {
    id: "line_560",
    line: "tu ducibus Latiis aderis, cum laeta Triumphum",
    translation: "You will be present for the Roman generals when a happy voice will sing Triumph,",
    part: 2,
    cost: 45000,
    effect: { type: "autoClick", rate: 20 },
    effectDescription: "20 Numen/sec — the Triumph procession flows",
    spriteEffect: "The tree shimmers with golden triumph light",
  },
  {
    id: "line_561",
    line: "vox canet et visent longās Capitolia pompās;",
    translation: "and the Capitoline will see long processions;",
    part: 2,
    cost: 60000,
    effect: { type: "endgame" },
    effectDescription: "The eternal Laurel stands. The Triumph is complete.",
    spriteEffect: "Complete. Eternal. The Laurel of Rome.",
  },
];

// ─── GAME CONSTANTS ───────────────────────────────────────────
// Tune these to adjust game feel and difficulty.
// See CONFIG.md for full documentation.
// ─────────────────────────────────────────────────────────────
export const GAME_CONFIG = {
  // Numen generation
  BASE_CLICK_POWER: 1,               // Numen earned per raw click (before upgrades)

  // Apollo's Heat
  HEAT_INCREASE_RATE: 0.45,          // Heat added per tick (0.1 = slow, 0.8 = brutal)
  HEAT_MAX: 100,                     // Heat cap (don't change)
  HEAT_PENALTY_THRESHOLD: 75,        // Heat % that triggers Numen slow-down
  HEAT_PENALTY_SLOW: 0.5,            // Multiplier applied when over threshold (0.5 = half)

  // Timing
  TICK_RATE_MS: 100,                 // Game loop interval in milliseconds

  // Refugit mechanic
  REFUGIT_PUSHBACK: 25,              // Heat % reduction on each purchase after Refugit unlocked

  // Visual / sprite
  PART1_TOTAL: 9,                    // Number of lines in Part 1 (do not change unless adding lines)
  PART2_TOTAL: 9,                    // Number of lines in Part 2

  // Click feedback animation
  CLICK_RING_DURATION_MS: 600,       // How long the orange ring lasts (ms)
  CLICK_FLOAT_DURATION_MS: 1000,     // How long "+N" floats upward (ms)

  // Particle background
  PARTICLE_COUNT: 40,                // Number of background glowing particles
  PARTICLE_SPEED_MIN: 0.2,           // Minimum upward drift speed
  PARTICLE_SPEED_MAX: 0.8,           // Maximum upward drift speed
};

// Two section headers
export const PARTS = {
  1: {
    title: "Part I",
    subtitle: "The Transformation",
    latinTitle: "Prece Finitā",
    lines: "543–552",
    description: "Daphne's prayer and her body's metamorphosis",
  },
  2: {
    title: "Part II",
    subtitle: "Apollo's Embrace",
    latinTitle: "Hanc Quoque Phoebus Amat",
    lines: "553–561",
    description: "Apollo reaches for the tree — and the Laurel is declared eternal",
  },
} as const;
