// ============================================================
//  DAPHNE'S ROOT — SOUND CONFIGURATION
//  This is the ONLY file you need to edit to add/change sounds.
//
//  HOW TO ADD SOUNDS:
//  1. Drop your .mp3 (or .ogg / .wav) file into:
//        artifacts/daphnes-root/public/sounds/
//  2. Set the `src` field below to the filename, e.g. "click.mp3"
//  3. Set `enabled: false` to silence any individual event.
//
//  VOLUME: 0.0 = silent, 1.0 = full volume
//  SRC: filename inside the /sounds/ folder, or null to skip
// ============================================================

export interface SoundSlot {
  /** Filename inside /public/sounds/. Set null to play nothing. */
  src: string | null;
  /** 0.0–1.0 */
  volume: number;
  /** Set false to mute this event without removing the filename. */
  enabled: boolean;
}

// ─── GLOBAL SOUND EVENTS ─────────────────────────────────────
// One slot per game event. Edit src / volume / enabled as needed.

export const SOUND_CONFIG: Record<SoundEventKey, SoundSlot> = {
  // Fires on every sprite click (can be high-frequency — keep volume low)
  click: {
    src: null,           // e.g. "click.mp3"
    volume: 0.5,
    enabled: true,
  },

  // Fires when any upgrade is purchased (unless overridden below)
  upgrade: {
    src: null,           // e.g. "upgrade.mp3"
    volume: 0.7,
    enabled: true,
  },

  // Fires when the Refugit upgrade is purchased (heat-pushback unlock)
  refugit: {
    src: null,           // e.g. "refugit.mp3"
    volume: 0.8,
    enabled: true,
  },

  // Fires when heat first crosses the penalty threshold (75%)
  heatWarning: {
    src: null,           // e.g. "heat-warning.mp3"
    volume: 0.7,
    enabled: true,
  },

  // Fires every few seconds while heat remains at penalty level (>= 75%)
  heatPenaltyLoop: {
    src: null,           // e.g. "heat-loop.mp3"
    volume: 0.3,
    enabled: true,
  },

  // Fires when heat hits the danger zone (>= 90%)
  heatDanger: {
    src: null,           // e.g. "heat-danger.mp3"
    volume: 0.9,
    enabled: true,
  },

  // Fires when Apollo becomes visible for the first time
  apolloAppears: {
    src: null,           // e.g. "apollo.mp3"
    volume: 0.8,
    enabled: true,
  },

  // Fires when the final upgrade is purchased and the triumph screen shows
  triumph: {
    src: null,           // e.g. "triumph.mp3"
    volume: 1.0,
    enabled: true,
  },

  // Fires when the game is reset / restarted
  reset: {
    src: null,           // e.g. "reset.mp3"
    volume: 0.5,
    enabled: true,
  },
};

// ─── PER-UPGRADE SOUND OVERRIDES ────────────────────────────
// Optional: give individual lines their own sound.
// Any upgrade id listed here will play this sound INSTEAD of
// the generic "upgrade" sound above.
//
// Upgrade ids: line_543, line_544, line_545, line_546, line_548,
//              line_549, line_550, line_551, line_552, line_553,
//              line_554, line_555, line_556, line_557, line_558,
//              line_559, line_560, line_561
//
// Example:
//   "line_556": { src: "oscula.mp3", volume: 1.0, enabled: true },
//   "line_561": { src: "arbor-eris.mp3", volume: 0.9, enabled: true },

export const UPGRADE_SOUND_OVERRIDES: Partial<Record<string, SoundSlot>> = {
  // Uncomment and fill in to add per-line sounds:
  // "line_543": { src: "line_543.mp3", volume: 0.8, enabled: true },
  // "line_556": { src: "oscula.mp3",   volume: 1.0, enabled: true },
  // "line_561": { src: "triumph.mp3",  volume: 1.0, enabled: true },
};

// ─── GLOBAL MUTE ────────────────────────────────────────────
// Set to false to silence everything at once.
export const SOUND_ENABLED = true;

// ─── TYPES (do not edit) ─────────────────────────────────────
export type SoundEventKey =
  | "click"
  | "upgrade"
  | "refugit"
  | "heatWarning"
  | "heatPenaltyLoop"
  | "heatDanger"
  | "apolloAppears"
  | "triumph"
  | "reset";
