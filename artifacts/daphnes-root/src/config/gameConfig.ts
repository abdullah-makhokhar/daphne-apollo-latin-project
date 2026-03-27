export interface StoryNode {
  id: string;
  line: string;
  translation: string;
  act: 1 | 2 | 3 | 4;
  actName: string;
  cost: number;
  effect: GameEffect;
  effectDescription: string;
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

export interface ActConfig {
  id: 1 | 2 | 3 | 4;
  name: string;
  subtitle: string;
  latinTitle: string;
}

export const ACTS: ActConfig[] = [
  { id: 1, name: "Act I", subtitle: "The Prayer", latinTitle: "Prece Finita" },
  { id: 2, name: "Act II", subtitle: "The Hardening", latinTitle: "Sub Cortice" },
  { id: 3, name: "Act III", subtitle: "The Rejection", latinTitle: "Refugit Oscula" },
  { id: 4, name: "Act IV", subtitle: "The Eternal Laurel", latinTitle: "Arbor Eris" },
];

export const STORY_NODES: StoryNode[] = [
  {
    id: "line_545",
    line: '"fer, pater," inquit "opem!"',
    translation: '"Grant aid, father!" she cried.',
    act: 1,
    actName: "Act I: The Prayer",
    cost: 10,
    effect: { type: "clickPower", bonus: 1 },
    effectDescription: "Your clicks generate +1 Numen",
  },
  {
    id: "line_546",
    line: "numen laesit forma meum",
    translation: "My beauty has damaged my divine protection.",
    act: 1,
    actName: "Act I: The Prayer",
    cost: 25,
    effect: { type: "clickPower", bonus: 2 },
    effectDescription: "Your clicks generate +2 Numen",
  },
  {
    id: "line_547",
    line: "Penei, transfer corpus meum",
    translation: "O Peneus, transform this body of mine.",
    act: 1,
    actName: "Act I: The Prayer",
    cost: 60,
    effect: { type: "clickPower", bonus: 3 },
    effectDescription: "Your clicks generate +3 Numen",
  },
  {
    id: "line_548",
    line: "vix prece finitā torpor gravis occupat artūs",
    translation: "Scarce had her prayer ended when a heavy numbness seized her limbs.",
    act: 1,
    actName: "Act I: The Prayer",
    cost: 100,
    effect: { type: "autoClick", rate: 1 },
    effectDescription: "Torpor generates 1 Numen per second automatically",
  },
  {
    id: "line_549",
    line: "mollia cinguntur tenui praecordia libro",
    translation: "Her soft breast was encircled by a thin layer of bark.",
    act: 2,
    actName: "Act II: The Hardening",
    cost: 200,
    effect: { type: "heatReduction", multiplier: 0.75 },
    effectDescription: "Tenui Libro: Apollo's Heat increases 25% slower",
  },
  {
    id: "line_550",
    line: "in frondem crines, in ramos bracchia crescunt",
    translation: "Her hair grew into leaves, her arms into branches.",
    act: 2,
    actName: "Act II: The Hardening",
    cost: 350,
    effect: { type: "autoClick", rate: 2 },
    effectDescription: "Branching generates +2 Numen per second",
  },
  {
    id: "line_551",
    line: "pes modo tam velox pigris radicibus haeret",
    translation: "The foot that was so swift now clings with sluggish roots.",
    act: 2,
    actName: "Act II: The Hardening",
    cost: 500,
    effect: { type: "numanMultiplier", multiplier: 2 },
    effectDescription: "Pigris Radicibus: doubles all Numen generation",
  },
  {
    id: "line_552",
    line: "os habitā summā est, pulchritūdō manet in illā",
    translation: "Her face remains on the treetop; beauty persists in her.",
    act: 2,
    actName: "Act II: The Hardening",
    cost: 750,
    effect: { type: "clickPower", bonus: 5 },
    effectDescription: "Beauty's remnant grants +5 Numen per click",
  },
  {
    id: "line_553",
    line: "hanc quoque Phoebus amat...",
    translation: "Even this — the tree — does Phoebus love...",
    act: 3,
    actName: "Act III: The Rejection",
    cost: 1000,
    effect: { type: "apolloEvent" },
    effectDescription: "Apollo's hand appears — the pursuit intensifies!",
  },
  {
    id: "line_554",
    line: "sentit adhuc trepidare novo sub cortice pectus",
    translation: "He feels her heart still trembling beneath the new bark.",
    act: 3,
    actName: "Act III: The Rejection",
    cost: 1500,
    effect: { type: "heatReduction", multiplier: 0.6 },
    effectDescription: "Her trembling heart resists — Heat increases 40% slower",
  },
  {
    id: "line_555",
    line: "inque sinum sequitur summumque cacumen",
    translation: "He follows into her bosom and the topmost crown.",
    act: 3,
    actName: "Act III: The Rejection",
    cost: 2000,
    effect: { type: "autoClick", rate: 3 },
    effectDescription: "The crown grows — +3 Numen per second",
  },
  {
    id: "line_556",
    line: "oscula dat ligno; refugit tamen oscula lignum",
    translation: "He kissed the wood; even so the wood recoiled from his kisses.",
    act: 3,
    actName: "Act III: The Rejection",
    cost: 3000,
    effect: { type: "refugit", pushback: 20 },
    effectDescription: "Refugit Oscula: unlocking lines pushes Apollo's Heat back 20%",
  },
  {
    id: "line_557",
    line: "huic ego, si compes nōn sint data, victor abissem",
    translation: "Her I had won, had fetters not been given.",
    act: 4,
    actName: "Act IV: The Eternal Laurel",
    cost: 4000,
    effect: { type: "numanMultiplier", multiplier: 1.5 },
    effectDescription: "Apollo's confession grants +50% to all Numen",
  },
  {
    id: "line_558",
    line: '"arbor eris certe" dixit "mea! semper habebunt..."',
    translation: '"You shall certainly be my tree!" he said. "Always shall they have..."',
    act: 4,
    actName: "Act IV: The Eternal Laurel",
    cost: 6000,
    effect: { type: "finalMultiplier", multiplier: 3 },
    effectDescription: "Semper Habebunt: final multiplier — ×3 all Numen generation",
  },
  {
    id: "line_559",
    line: "tu ducibus Latiis aderis, cum laeta Triumphum",
    translation: "You shall attend the Latin commanders when joyful Triumph is celebrated.",
    act: 4,
    actName: "Act IV: The Eternal Laurel",
    cost: 10000,
    effect: { type: "endgame" },
    effectDescription: "The transformation is complete. The Triumph awaits.",
  },
];

export const GAME_CONFIG = {
  BASE_CLICK_POWER: 1,
  HEAT_INCREASE_RATE: 0.08,
  HEAT_MAX: 100,
  HEAT_PENALTY_THRESHOLD: 80,
  HEAT_PENALTY_SLOW: 0.5,
  TICK_RATE_MS: 100,
  REFUGIT_PUSHBACK: 20,
  SPRITE_STAGES: [
    { threshold: 0, label: "woman", description: "A nymph fleeing" },
    { threshold: 2, label: "roots", description: "Roots begin to form" },
    { threshold: 5, label: "bark", description: "Bark covers her skin" },
    { threshold: 9, label: "branches", description: "Branches reach skyward" },
    { threshold: 13, label: "laurel", description: "The Laurel tree stands eternal" },
  ],
};
