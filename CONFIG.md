# Daphne's Root — Configuration Guide

Two files handle all configuration — no need to touch game logic:

```
artifacts/daphnes-root/src/config/gameConfig.ts   ← gameplay & balance
artifacts/daphnes-root/src/config/soundConfig.ts  ← all sounds
```

---

## Table of Contents

1. [Game Constants (`GAME_CONFIG`)](#1-game-constants)
2. [Story Nodes — Latin Lines & Effects](#2-story-nodes)
3. [Adding a New Line / Upgrade](#3-adding-a-new-line--upgrade)
4. [Changing Visual Stages](#4-changing-visual-sprite-stages)
5. [Particle Background](#5-particle-background)
6. [Click Feedback](#6-click-feedback-animation)
7. [Part Headers](#7-part-headers)
8. [Theme / Colors](#8-theme--colors)
9. [Sound System](#9-sound-system)

---

## 1. Game Constants

Located at the bottom of `gameConfig.ts` in the `GAME_CONFIG` object.

```ts
export const GAME_CONFIG = {
  BASE_CLICK_POWER: 1,           // Numen per raw click before upgrades
  HEAT_INCREASE_RATE: 0.45,      // Heat added per tick (higher = faster danger)
  HEAT_MAX: 100,                 // Do not change
  HEAT_PENALTY_THRESHOLD: 75,    // Heat % when Numen generation is cut in half
  HEAT_PENALTY_SLOW: 0.5,        // Multiplier when over threshold (0.5 = 50%)
  TICK_RATE_MS: 100,             // Game loop interval in ms (lower = smoother but heavier)
  REFUGIT_PUSHBACK: 25,          // Heat reduction per purchase after Refugit is unlocked
  CLICK_RING_DURATION_MS: 600,   // Duration of orange click ring animation
  CLICK_FLOAT_DURATION_MS: 1000, // Duration of floating "+N" text
  PARTICLE_COUNT: 40,            // Background particle count
  PARTICLE_SPEED_MIN: 0.2,       // Slowest particle drift
  PARTICLE_SPEED_MAX: 0.8,       // Fastest particle drift
};
```

### Tuning suggestions

| Goal | Change |
|------|--------|
| Easier game | Lower `HEAT_INCREASE_RATE` to `0.2` |
| Harder / more tension | Raise to `0.7` or `0.9` |
| Later penalty kick-in | Raise `HEAT_PENALTY_THRESHOLD` to `85` or `90` |
| Softer penalty | Raise `HEAT_PENALTY_SLOW` to `0.7` (70% of normal) |
| More particles | Raise `PARTICLE_COUNT` to `80` |
| Slower clicking feel | Raise `TICK_RATE_MS` to `200` |

---

## 2. Story Nodes

Each entry in `STORY_NODES` represents one Latin line from Ovid that the player can unlock.

```ts
{
  id: "line_543",              // Unique ID — used for save state, do not duplicate
  line: "viribus absumptis…",  // The Latin text shown in the upgrade shop
  translation: "With her strengths spent…", // English translation — exact, do not paraphrase
  part: 1,                     // 1 = Part I (lines 543–552), 2 = Part II (lines 553–561)
  cost: 10,                    // Numen required to purchase
  effect: { type: "clickPower", bonus: 1 }, // See effect types below
  effectDescription: "+1 Numen per click",  // Short text shown in the shop
  spriteEffect: "Her skin begins to pale",  // Visual description shown on the sprite
}
```

### Effect Types

| Type | Properties | What it does |
|------|-----------|--------------|
| `clickPower` | `bonus: number` | Adds flat Numen per click |
| `autoClick` | `rate: number` | Adds Numen per second (passive) |
| `heatReduction` | `multiplier: number` | Multiplies heat rate (0.8 = 20% slower) |
| `numanMultiplier` | `multiplier: number` | Multiplies ALL Numen (stacks multiplicatively) |
| `refugit` | `pushback: number` | Enables Refugit mode (heat pushed back per future purchase) |
| `finalMultiplier` | `multiplier: number` | Same as numanMultiplier, used for endgame lines |
| `apolloEvent` | — | Makes Apollo's hand appear in the UI |
| `endgame` | — | Triggers the Triumph ending |

### Example: Changing a cost

```ts
// Make line_548 cheaper:
{ id: "line_548", cost: 80, ... }
// Was 200, now 80 — much earlier in the game
```

### Example: Changing a heat reduction

```ts
// Make bark more protective:
{ id: "line_549", effect: { type: "heatReduction", multiplier: 0.5 }, ... }
// 0.5 = heat rises 50% slower (was 0.8 = 20% slower)
```

---

## 3. Adding a New Line / Upgrade

1. Pick a unique `id` (e.g. `"line_544b"`)
2. Set `part: 1` or `part: 2` depending on which poem section
3. Choose an effect type from the table above
4. Add a `spriteEffect` description for the sprite caption
5. Append the object to `STORY_NODES` in order

```ts
{
  id: "line_544b",
  line: "et nova poenarum facies...",
  translation: "And a new form of punishment...",
  part: 1,
  cost: 75,
  effect: { type: "autoClick", rate: 1 },
  effectDescription: "+1 Numen/sec — the river flows through her",
  spriteEffect: "River water traces her veins",
},
```

> **Note:** If you add lines, update `GAME_CONFIG.PART1_TOTAL` or `PART2_TOTAL` to match.

---

## 4. Changing Visual Sprite Stages

The sprite (`DaphneSprite.tsx`) reacts to how many Part I and Part II lines are unlocked. It does **not** need to be configured in `gameConfig.ts` — it reads `unlockedIds` directly.

Key thresholds (by Part I unlock count):
- 0–1 unlocked: woman in flesh tones, arms down
- 2: paling skin, slight posture change
- 3+: arms raised in prayer pose
- 4+: roots appear below
- 5+: bark wraps torso
- 6+: hair becomes leaves, arms become branches
- 7+: deeper roots, sub-branches grow
- 8+: full bark face, crown of leaves forms
- 9: point at the treetop appears

Part II unlocks add:
- Wider canopy, more leaf clusters
- Golden adornments
- Glow effects

To adjust when something appears, edit the `p1 >= N` thresholds in `DaphneSprite.tsx`.

---

## 5. Particle Background

Controlled by `GAME_CONFIG`:

```ts
PARTICLE_COUNT: 40,        // Total simultaneous particles
PARTICLE_SPEED_MIN: 0.2,   // Slowest rising speed
PARTICLE_SPEED_MAX: 0.8,   // Fastest rising speed
```

The particle color palette is defined in `ParticleBackground.tsx`:

```ts
const COLORS = [
  "rgba(212,175,55,",   // gold
  "rgba(74,154,53,",    // leaf green
  "rgba(139,90,43,",    // bark
  "rgba(251,191,36,",   // bright amber
  "rgba(61,122,27,",    // dark green
];
```

Change or add colors there. Each entry must end with a trailing comma (it gets the opacity appended).

Particle behavior:
- Heat above 50% → red tint appears on screen
- Unlocks above 30% → green ambient glow appears

---

## 6. Click Feedback Animation

Orange ring + floating text appear at each click. Timing is in `GAME_CONFIG`:

```ts
CLICK_RING_DURATION_MS: 600,    // Ring expand + fade time
CLICK_FLOAT_DURATION_MS: 1000,  // "+N" text rise + fade time
```

The ring color, text color, and animation are in `ClickFeedback.tsx`. Change `border-orange-400` and `bg-orange-400` there to alter the click ring color.

---

## 7. Part Headers

The two poem section labels shown in the upgrade shop are configured in:

```ts
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
}
```

Edit any field here to change the headers.

---

## 8. Theme / Colors

The visual theme is a **Dark Academia** palette defined in:

```
artifacts/daphnes-root/src/index.css
```

Key CSS variables (HSL format):

| Variable | Default | Notes |
|----------|---------|-------|
| `--background` | `20 14% 8%` | Dark charcoal |
| `--foreground` | `38 25% 85%` | Warm parchment text |
| `--primary` | `43 74% 49%` | Golden amber |
| `--accent` | `25 40% 25%` | Bark brown |
| `--destructive` | `0 62% 45%` | Apollo's red |

Fonts are defined at:

```css
--app-font-sans: 'Palatino Linotype', 'Palatino', 'Book Antiqua', Georgia, serif;
--app-font-serif: 'Palatino Linotype', 'Palatino', 'Book Antiqua', Georgia, serif;
```

Replace with any Google Font by adding an `@import` at the top of `index.css` and updating these variables.

---

## Save Data

Progress is saved to `localStorage` under the key `daphnes-root-save` using Zustand's persist middleware. To clear a save: open browser DevTools → Application → Local Storage → delete `daphnes-root-save`.

To change the save key (useful if you want separate save slots):

```ts
// In gameStore.ts:
{ name: "daphnes-root-save-v2" }
```

---

## 9. Sound System

### Overview

All sound configuration lives in one file:

```
artifacts/daphnes-root/src/config/soundConfig.ts
```

Sound files themselves go in:

```
artifacts/daphnes-root/public/sounds/
```

The sound system uses browser-native `HTMLAudioElement` pools — no extra libraries required. Sounds are preloaded on first render and pooled (up to 4 simultaneous instances per event) so rapid clicks never stall.

---

### Step 1 — Add your file

Drop a `.mp3`, `.ogg`, or `.wav` file into:

```
artifacts/daphnes-root/public/sounds/your-file.mp3
```

---

### Step 2 — Wire it to an event

Open `src/config/soundConfig.ts` and find the event in `SOUND_CONFIG`:

```ts
click: {
  src: "click.mp3",   // ← your filename
  volume: 0.5,        // 0.0–1.0
  enabled: true,
},
```

---

### Sound Events

| Key | When it fires |
|-----|---------------|
| `click` | Every sprite click (can be very rapid — use low volume) |
| `upgrade` | Any upgrade purchased (unless per-upgrade override exists) |
| `refugit` | The Refugit (heat-pushback) upgrade specifically |
| `heatWarning` | One-shot when heat first crosses 75% |
| `heatPenaltyLoop` | Repeats every 8 s while heat stays ≥ 75% |
| `heatDanger` | One-shot when heat first hits 90%+ |
| `apolloAppears` | One-shot when Apollo becomes visible |
| `triumph` | One-shot on the final upgrade / triumph screen |
| `reset` | Player clicks "abandon transformation" |

---

### Per-Upgrade Sound Overrides

To give one specific Latin line its own sound, add it to `UPGRADE_SOUND_OVERRIDES`:

```ts
export const UPGRADE_SOUND_OVERRIDES: Partial<Record<string, SoundSlot>> = {
  "line_556": { src: "oscula.mp3",     volume: 1.0, enabled: true },
  "line_561": { src: "arbor-eris.mp3", volume: 0.9, enabled: true },
};
```

This plays **instead of** the generic `upgrade` sound for those lines. All other lines continue using the `upgrade` slot.

---

### Muting

**One event:** set `enabled: false` in its slot.

**Everything at once:** set `SOUND_ENABLED = false` at the top of `soundConfig.ts`.

```ts
export const SOUND_ENABLED = false;  // total silence
```

---

### Adjusting the penalty loop interval

The `heatPenaltyLoop` event fires on a timer in `Game.tsx`. To change how often it plays (default 8 s):

```ts
// In src/pages/Game.tsx — search for penaltyLoopRef
penaltyLoopRef.current = setInterval(() => {
  play("heatPenaltyLoop");
}, 8000);   // ← change this value (milliseconds)
```

---

### Tips

- Keep `click.mp3` short (< 0.3 s) — it fires on every click.
- Keep `heatPenaltyLoop` subtle (`volume: 0.2–0.3`) — it repeats.
- `.mp3` works everywhere and compresses to small sizes.
- `.ogg` is also fine; `.wav` works but is much larger.

---

## File Map

```
artifacts/daphnes-root/
├── public/
│   └── sounds/              ← DROP SOUND FILES HERE (.mp3 / .ogg / .wav)
│       └── README.md        ← Quick reference
└── src/
    ├── config/
    │   ├── gameConfig.ts    ← Gameplay & balance (MAIN CONFIG)
    │   └── soundConfig.ts   ← All sound event config (SOUND CONFIG)
    ├── hooks/
    │   └── useSound.ts      ← Sound engine (do not edit)
    ├── store/
    │   └── gameStore.ts     ← Game state + logic
    ├── pages/
    │   └── Game.tsx         ← Main layout and input handling
    └── components/
        ├── DaphneSprite.tsx       ← Progressive SVG transformation
        ├── ParticleBackground.tsx ← Canvas particles
        ├── ClickFeedback.tsx      ← Orange ring + floating text
        ├── HeatBar.tsx            ← Apollo's Heat bar
        ├── NumenDisplay.tsx       ← Main counter + per-click/sec stats
        ├── UpgradeShop.tsx        ← Two-section upgrade panel
        ├── ScrollOfOvid.tsx       ← Unlocked lines display
        └── TriumphScreen.tsx      ← Endgame overlay
```
